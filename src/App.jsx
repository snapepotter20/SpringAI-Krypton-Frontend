import { useEffect, useRef, useState } from "react";
import {
  CornerDownLeft,
  PanelLeftClose,
  PanelLeftOpen,
  Paperclip,
  RefreshCcw,
  Send,
  Trash2
} from "lucide-react";
import ChatHeader from "./components/ChatHeader";
import ChatSidebar from "./components/ChatSidebar";
import Composer from "./components/Composer";
import ErrorBanner from "./components/ErrorBanner";
import HeroStrip from "./components/HeroStrip";
import MessageBubble from "./components/MessageBubble";
import ThinkingBubble from "./components/ThinkingBubble";
import { createChat, getChat, listChats, sendMessage } from "./lib/api";
import { promptIdeas } from "./lib/chatData";
import { getChatSubtitle, getChatTitle, getLastUserPrompt } from "./lib/chatSelectors";

export default function App() {
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState("");
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isBooting, setIsBooting] = useState(true);
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [launchTick, setLaunchTick] = useState(0);
  const [pendingFiles, setPendingFiles] = useState([]);
  const abortRef = useRef(null);
  const transcriptRef = useRef(null);

  const activeChat = chats.find((chat) => chat.id === activeChatId) || null;
  const messages = activeChat?.messages ?? [];
  const lastUserPrompt = getLastUserPrompt(messages);

  useEffect(() => {
    async function boot() {
      try {
        const chatList = await listChats();
        if (chatList.length === 0) {
          const created = await createChat("Launch strategy");
          setChats([created]);
          setActiveChatId(created.id);
        } else {
          setChats(chatList);
          setActiveChatId(chatList[0].id);
        }
      } catch (requestError) {
        setError(requestError.message || "Could not load Krypton chats.");
      } finally {
        setIsBooting(false);
      }
    }

    boot();
  }, []);

  useEffect(() => {
    transcriptRef.current?.scrollTo({
      top: transcriptRef.current.scrollHeight,
      behavior: "smooth"
    });
  }, [messages, isSending]);

  async function refreshChat(chatId) {
    const freshChat = await getChat(chatId);
    setChats((current) => {
      const remaining = current.filter((chat) => chat.id !== chatId);
      return [freshChat, ...remaining];
    });
    setActiveChatId(chatId);
    return freshChat;
  }

  async function handleSelectChat(chatId) {
    if (!chatId) return;
    setError("");

    try {
      await refreshChat(chatId);
    } catch (requestError) {
      setError(requestError.message || "Could not open this chat.");
    }
  }

  async function handleCreateChat(seedPrompt) {
    setError("");

    try {
      const title = seedPrompt?.trim() || "New Krypton chat";
      const created = await createChat(title);
      setChats((current) => [created, ...current]);
      setActiveChatId(created.id);
      setInput("");
      setPendingFiles([]);

      if (seedPrompt?.trim()) {
        setInput(seedPrompt);
      }
    } catch (requestError) {
      setError(requestError.message || "Could not create a new chat.");
    }
  }

  async function submitPrompt(nextPrompt = input) {
    const cleanPrompt = nextPrompt.trim();
    if ((!cleanPrompt && pendingFiles.length === 0) || isSending || !activeChatId) return;

    setInput("");
    setError("");
    setIsSending(true);
    setLaunchTick((value) => value + 1);

    const controller = new AbortController();
    abortRef.current = controller;
    const filesToSend = [...pendingFiles];

    try {
      await sendMessage(activeChatId, cleanPrompt || "Please review the attached files.", filesToSend, controller.signal);
      setPendingFiles([]);
      await refreshChat(activeChatId);
    } catch (requestError) {
      if (requestError.name !== "AbortError") {
        setError(requestError.message || "Could not reach the Spring AI Ollama endpoint.");
      }
    } finally {
      setIsSending(false);
      abortRef.current = null;
    }
  }

  function stopResponse() {
    abortRef.current?.abort();
    setIsSending(false);
  }

  async function copyText(text) {
    await navigator.clipboard.writeText(text);
  }

  function handleKeyDown(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submitPrompt();
    }
  }

  function handleFilesAdded(fileList) {
    const nextFiles = Array.from(fileList || []);
    if (nextFiles.length === 0) return;
    setPendingFiles((current) => [...current, ...nextFiles]);
  }

  function handleRemoveFile(fileName) {
    setPendingFiles((current) => current.filter((file) => file.name !== fileName));
  }

  return (
    <main className="app-shell">
      <ChatSidebar
        isOpen={sidebarOpen}
        chats={chats}
        activeChatId={activeChatId}
        promptIdeas={promptIdeas}
        onNewChat={() => handleCreateChat("")}
        onPromptSelect={(idea) => setInput(idea)}
        onChatSelect={handleSelectChat}
      />

      <section className="chat-stage">
        <ChatHeader
          isSidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen((value) => !value)}
          onClearChat={() => handleCreateChat("")}
          collapseIcon={<PanelLeftClose size={20} />}
          expandIcon={<PanelLeftOpen size={20} />}
          clearIcon={<Trash2 size={19} />}
        />

        <div className="transcript" ref={transcriptRef}>
          <HeroStrip
            title={getChatTitle(activeChat)}
            subtitle={getChatSubtitle(activeChat)}
            isBooting={isBooting}
          />

          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} onCopy={copyText} />
          ))}

          {isSending && <ThinkingBubble />}
        </div>

        <footer className="composer-shell">
          {error && (
            <ErrorBanner
              error={error}
              canRetry={Boolean(lastUserPrompt)}
              onRetry={() => submitPrompt(lastUserPrompt)}
              retryIcon={<RefreshCcw size={15} />}
            />
          )}

          <Composer
            input={input}
            isSending={isSending}
            launchTick={launchTick}
            pendingFiles={pendingFiles}
            onInputChange={setInput}
            onKeyDown={handleKeyDown}
            onSubmit={() => submitPrompt()}
            onStop={stopResponse}
            onFilesAdded={handleFilesAdded}
            onFileRemove={handleRemoveFile}
            sendIcon={<Send size={18} />}
            attachIcon={<Paperclip size={16} />}
            hintIcon={<CornerDownLeft size={14} />}
          />
        </footer>
      </section>
    </main>
  );
}
