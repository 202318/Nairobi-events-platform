function Toast({ message, setMessage }) {
  if (!message.text) return null;

  const icons = {
    success: "✅",
    error: "❌",
    warning: "⚠️",
    info: "ℹ️",
  };

  return (
    <div className={`toast ${message.type}`}>
      <span className="toast-icon">
        {icons[message.type]}
      </span>

      <span>{message.text}</span>

      <button
        className="toast-close"
        onClick={() => setMessage({ text: "", type: "" })}
      >
        ×
      </button>
    </div>
  );
}

export default Toast;