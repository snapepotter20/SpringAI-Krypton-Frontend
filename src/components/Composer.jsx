import BrandMark from "./BrandMark";
import { formatFileSize } from "../lib/files";

export default function Composer({
  input,
  isSending,
  launchTick,
  pendingFiles,
  onInputChange,
  onKeyDown,
  onSubmit,
  onStop,
  onFilesAdded,
  onFileRemove,
  sendIcon,
  attachIcon,
  hintIcon
}) {
  return (
    <>
      {pendingFiles.length > 0 && (
        <div className="attachment-strip">
          {pendingFiles.map((file) => (
            <div key={`${file.name}-${file.size}`} className="attachment-pill">
              <div>
                <strong>{file.name}</strong>
                <span>{formatFileSize(file.size)}</span>
              </div>
              <button type="button" onClick={() => onFileRemove(file.name)} aria-label={`Remove ${file.name}`}>
                x
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="composer-launchpad">
        <div className="launch-rail" aria-hidden="true">
          <div key={launchTick} className={`superman-flight ${launchTick ? "is-launching" : ""}`}>
            <div className="superman-body">
              <BrandMark />
            </div>
            <span className="flight-trail" />
          </div>
        </div>

        <form
          className="composer"
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit();
          }}
        >
          <label className="attach-button" title="Attach files">
            <input
              type="file"
              multiple
              onChange={(event) => {
                onFilesAdded(event.target.files);
                event.target.value = "";
              }}
            />
            {attachIcon}
          </label>
          <textarea
            value={input}
            onChange={(event) => onInputChange(event.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Message Krypton, add files, and keep the thread moving..."
            rows={1}
            aria-label="Message Krypton"
          />
          {isSending ? (
            <button className="send-button stop" type="button" onClick={onStop}>
              Stop
            </button>
          ) : (
            <button className="send-button" type="submit" disabled={!input.trim()}>
              {sendIcon}
            </button>
          )}
        </form>
      </div>

      <div className="composer-hint">
        <span>
          {hintIcon}
          Enter to send
        </span>
        <span>Shift + Enter for a new line</span>
      </div>
    </>
  );
}
