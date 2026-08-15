import BrandMark from "./BrandMark";

export default function ThinkingBubble() {
  return (
    <div className="message message-ai">
      <div className="avatar avatar-brand" aria-hidden="true">
        <BrandMark />
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
  );
}
