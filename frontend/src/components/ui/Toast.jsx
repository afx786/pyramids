import { useEffect } from 'react';
import { CheckCircle, X } from 'lucide-react';

function Toast({ message, type = 'info', onClose, duration = 3500 }) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const bgColor = type === 'success'
    ? 'rgb(var(--color-success) / 0.15)'
    : type === 'error'
    ? 'rgb(var(--color-error-container))'
    : 'rgb(var(--color-surface-container))';

  const textColor = type === 'success'
    ? 'rgb(var(--color-success))'
    : type === 'error'
    ? 'rgb(var(--color-on-error-container))'
    : 'rgb(var(--color-on-surface))';

  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-md px-lg py-sm rounded-xl shadow-lg animate-in fade-in slide-in-from-bottom-2"
      style={{ background: bgColor, color: textColor, border: '1px solid rgb(var(--color-outline-variant))' }}
      role="status"
      aria-live="polite"
    >
      {type === 'success' ? <CheckCircle size={16} /> : null}
      <span className="font-body-sm">{message}</span>
      <button
        type="button"
        onClick={onClose}
        className="ml-sm p-xs rounded-lg hover:opacity-80"
        aria-label="Dismiss"
      >
        <X size={14} />
      </button>
    </div>
  );
}

export default Toast;
