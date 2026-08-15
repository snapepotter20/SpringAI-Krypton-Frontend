export default function ErrorBanner({ error, canRetry, onRetry, retryIcon }) {
  return (
    <div className="error-bar">
      <span>{error}</span>
      {canRetry && (
        <button type="button" onClick={onRetry}>
          {retryIcon}
          Retry
        </button>
      )}
    </div>
  );
}
