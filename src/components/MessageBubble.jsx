import { Copy, UserRound } from "lucide-react";
import BrandMark from "./BrandMark";
import { formatFileSize } from "../lib/files";
import { formatTime } from "../lib/format";

export default function MessageBubble({ message, onCopy }) {
  const isUser = message.role === "user";

  return (
    <article className={`message ${isUser ? "message-user" : "message-ai"}`}>
      <div className={`avatar ${isUser ? "" : "avatar-brand"}`} aria-hidden="true">
        {isUser ? <UserRound size={18} /> : <BrandMark />}
      </div>
      <div className="message-body">
        <div className="message-meta">
          <span>{isUser ? "You" : "Krypton"}</span>
          <time>{formatTime(message.createdAt)}</time>
        </div>
        <p>{message.content}</p>
        {message.attachments?.length > 0 && (
          <div className="message-attachments">
            {message.attachments.map((attachment) => (
              <div key={attachment.id} className="message-attachment-card">
                <strong>{attachment.fileName}</strong>
                <span>{formatFileSize(attachment.size)}</span>
                <small>{attachment.preview || attachment.contentType}</small>
              </div>
            ))}
          </div>
        )}
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
