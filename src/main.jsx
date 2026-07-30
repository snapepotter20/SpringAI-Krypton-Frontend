import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Bot,
  Copy,
  CornerDownLeft,
  Cpu,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  RefreshCcw,
  Send,
  Sparkles,
  Trash2,
  UserRound,
  Zap
} from "lucide-react";
import "./styles.css";

const starterMessages = [
  {
    id: crypto.randomUUID(),
    role: "assistant",
    content:
      "Hey, I am Krypton. Ask me anything and I will route it through your Spring AI Ollama backend.",
    createdAt: new Date().toISOString()
  }
];

const promptIdeas = [
  "Explain Spring AI like I am building my first app",
  "Write a Java controller for a chat endpoint",
  "Give me three project ideas using Ollama",
  "Debug why my model response might be slow"
];

function formatTime(value) {
  return new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

async function askKrypton(prompt, signal) {
  const response = await fetch(`/api/ollama/${encodeURIComponent(prompt)}`, {
    method: "GET",
    signal
  });

  if (!response.ok) {
    throw new Error(`Krypton backend returned ${response.status}`);
  }

  return response.text();
}

function MessageBubble({ message, onCopy }) {
  const isUser = message.role === "user";

  return (
    <article className={`message ${isUser ? "message-user" : "message-ai"}`}>
      <div className="avatar" aria-hidden="true">
        {isUser ? <UserRound size={18} /> : <Bot size={18} />}
      </div>
      <div className="message-body">
        <div className="message-meta">
          <span>{isUser ? "You" : "Krypton"}</span>
          <time>{formatTime(message.createdAt)}</time>
        </div>
        <p>{message.content}</p>
        {!isUser && (
          <button
            className="icon-action"
            type="button"
            onClick={() => onCopy(message.content)}
            aria-label="Copy response"
            title="Copy response"
          >
            <Copy size={15} />
          </button>
        )}
      </div>
    </article>
  );
}

function App() {
  const [messages, setMessages] = useState(starterMessages);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const abortRef = useRef(null);
  const transcriptRef = useRef(null);

  const lastUserPrompt = useMemo(
    () => [...messages].reverse().find((message) => message.role === "user")?.content ?? "",
    [messages]
  );

  useEffect(() => {
    transcriptRef.current?.scrollTo({
      top: transcriptRef.current.scrollHeight,
      behavior: "smooth"
    });
  }, [messages, isSending]);

  async function submitPrompt(nextPrompt = input) {
    const cleanPrompt = nextPrompt.trim();
    if (!cleanPrompt || isSending) return;

    setInput("");
    setError("");
    setIsSending(true);

    const controller = new AbortController();
    abortRef.current = controller;

    const userMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: cleanPrompt,
      createdAt: new Date().toISOString()
    };

    setMessages((current) => [...current, userMessage]);

    try {
      const answer = await askKrypton(cleanPrompt, controller.signal);
      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: answer || "Krypton returned an empty response.",
          createdAt: new Date().toISOString()
        }
      ]);
    } catch (requestError) {
      if (requestError.name !== "AbortError") {
        setError(
          "Could not reach the Spring AI Ollama endpoint. Make sure the backend is running on localhost:8080."
        );
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

  function startFreshChat() {
    abortRef.current?.abort();
    setMessages(starterMessages);
    setInput("");
    setError("");
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

  return (
    <main className="app-shell">
      <aside className={`sidebar ${sidebarOpen ? "is-open" : "is-closed"}`}>
        <div className="brand-lockup">
          <div className="brand-mark" aria-hidden="true">
            <Sparkles size={20} />
          </div>
          <div>
            <strong>Krypton</strong>
            <span>SpringAI agent</span>
          </div>
        </div>

        <button className="new-chat" type="button" onClick={startFreshChat}>
          <Plus size={18} />
          New chat
        </button>

        <section className="panel">
          <div className="panel-label">Runtime</div>
          <div className="runtime-row">
            <Cpu size={17} />
            <span>Ollama</span>
            <strong>mistral</strong>
          </div>
          <div className="runtime-row">
            <Zap size={17} />
            <span>Endpoint</span>
            <strong>/api/ollama</strong>
          </div>
        </section>

        <section className="panel">
          <div className="panel-label">Prompt starters</div>
          <div className="idea-list">
            {promptIdeas.map((idea) => (
              <button key={idea} type="button" onClick={() => submitPrompt(idea)}>
                {idea}
              </button>
            ))}
          </div>
        </section>
      </aside>

      <section className="chat-stage">
        <header className="topbar">
          <button
            className="icon-button"
            type="button"
            onClick={() => setSidebarOpen((value) => !value)}
            aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {sidebarOpen ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
          </button>
          <div className="topbar-title">
            <span>Chat with Krypton</span>
            <strong>Ollama powered answers through Spring AI</strong>
          </div>
          <button
            className="icon-button"
            type="button"
            onClick={startFreshChat}
            aria-label="Clear chat"
            title="Clear chat"
          >
            <Trash2 size={19} />
          </button>
        </header>

        <div className="transcript" ref={transcriptRef}>
          <div className="hero-strip">
            <div>
              <div className="eyebrow">
                <Moon size={15} />
                Krypton console
              </div>
              <h1>Prompt cleanly. Think faster.</h1>
            </div>
            <div className="status-pill">
              <span />
              Backend proxy ready
            </div>
          </div>

          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} onCopy={copyText} />
          ))}

          {isSending && (
            <div className="message message-ai">
              <div className="avatar" aria-hidden="true">
                <Bot size={18} />
              </div>
              <div className="message-body thinking">
                <div className="message-meta">
                  <span>Krypton</span>
                  <time>thinking</time>
                </div>
                <div className="typing-dots" aria-label="Krypton is thinking">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            </div>
          )}
        </div>

        <footer className="composer-shell">
          {error && (
            <div className="error-bar">
              <span>{error}</span>
              {lastUserPrompt && (
                <button type="button" onClick={() => submitPrompt(lastUserPrompt)}>
                  <RefreshCcw size={15} />
                  Retry
                </button>
              )}
            </div>
          )}
          <form
            className="composer"
            onSubmit={(event) => {
              event.preventDefault();
              submitPrompt();
            }}
          >
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message Krypton..."
              rows={1}
              aria-label="Message Krypton"
            />
            {isSending ? (
              <button className="send-button stop" type="button" onClick={stopResponse}>
                Stop
              </button>
            ) : (
              <button className="send-button" type="submit" disabled={!input.trim()}>
                <Send size={18} />
              </button>
            )}
          </form>
          <div className="composer-hint">
            <span>
              <CornerDownLeft size={14} />
              Enter to send
            </span>
            <span>Shift + Enter for a new line</span>
          </div>
        </footer>
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
