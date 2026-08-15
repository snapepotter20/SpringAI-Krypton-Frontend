import { MessageSquareText, Plus, Shield, Zap } from "lucide-react";
import BrandMark from "./BrandMark";
import RuntimePanel from "./RuntimePanel";
import { formatTime } from "../lib/format";

export default function ChatSidebar({
  isOpen,
  chats,
  activeChatId,
  promptIdeas,
  onNewChat,
  onPromptSelect,
  onChatSelect
}) {
  return (
    <aside className={`sidebar ${isOpen ? "is-open" : "is-closed"}`}>
      <div className="brand-lockup">
        <BrandMark />
        <div>
          <strong>Krypton</strong>
          <span>House of El AI agent</span>
        </div>
      </div>

      <button className="new-chat" type="button" onClick={onNewChat}>
        <Plus size={18} />
        New chat
      </button>

      <RuntimePanel />

      <section className="panel">
        <div className="panel-label">Chats</div>
        <div className="chat-list">
          {chats.map((chat) => (
            <button
              key={chat.id}
              type="button"
              className={`chat-list-item ${chat.id === activeChatId ? "is-active" : ""}`}
              onClick={() => onChatSelect(chat.id)}
            >
              <span className="chat-list-head">
                <MessageSquareText size={15} />
                <strong>{chat.title}</strong>
              </span>
              <span className="chat-list-preview">{chat.lastMessagePreview || "Ready for context"}</span>
              <time>{formatTime(chat.updatedAt)}</time>
            </button>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="panel-label">Prompt starters</div>
        <div className="idea-list">
          {promptIdeas.map((idea) => (
            <button key={idea} type="button" onClick={() => onPromptSelect(idea)}>
              <Shield size={15} />
              {idea}
            </button>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="panel-label">Signal</div>
        <div className="runtime-row">
          <Zap size={17} />
          <span>Style</span>
          <strong>heroic</strong>
        </div>
      </section>
    </aside>
  );
}
