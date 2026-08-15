export default function ChatHeader({
  isSidebarOpen,
  onToggleSidebar,
  onClearChat,
  collapseIcon,
  expandIcon,
  clearIcon
}) {
  return (
    <header className="topbar">
      <button
        className="icon-button"
        type="button"
        onClick={onToggleSidebar}
        aria-label={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
        title={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
      >
        {isSidebarOpen ? collapseIcon : expandIcon}
      </button>

      <div className="topbar-title">
        <span>Chat with Krypton</span>
        <strong>Ollama powered answers through Spring AI</strong>
      </div>

      <button
        className="icon-button"
        type="button"
        onClick={onClearChat}
        aria-label="Clear chat"
        title="Clear chat"
      >
        {clearIcon}
      </button>
    </header>
  );
}
