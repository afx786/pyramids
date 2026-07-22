import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

function PublicIdDisplay({ publicId, label }) {
  const [copied, setCopied] = useState(false);

  if (!publicId) return null;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(publicId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }

  return (
    <div className="inline-flex items-center gap-2">
      <span className="font-mono text-[11px] tracking-tight" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
        {label ? <span className="font-label-caps text-[10px] uppercase tracking-wider mr-1.5">{label}</span> : null}
        {publicId}
      </span>
      <button
        type="button"
        onClick={handleCopy}
        className="flex items-center justify-center w-7 h-7 rounded-md transition-all active:scale-90 hover:opacity-70"
        style={{ color: copied ? 'rgb(var(--color-success))' : 'rgb(var(--color-on-surface-variant))' }}
        aria-label={copied ? 'Copied' : `Copy ${publicId}`}
        title={copied ? 'Copied' : 'Copy ID'}
      >
        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      </button>
    </div>
  );
}

export default PublicIdDisplay;
