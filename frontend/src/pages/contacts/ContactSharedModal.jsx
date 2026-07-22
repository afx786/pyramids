import { useState } from 'react';
import { X, Mail, Smartphone, Copy, CheckCircle } from 'lucide-react';
import Button from '../../components/ui/Button.jsx';

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard not available
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="p-xs rounded-lg transition-all shrink-0 hover:opacity-80"
      style={{ color: 'rgb(var(--color-on-surface-variant))' }}
      aria-label="Copy to clipboard"
    >
      {copied ? <CheckCircle size={16} style={{ color: 'rgb(var(--color-success))' }} /> : <Copy size={16} />}
    </button>
  );
}

function ContactSharedModal({ isOpen, onClose, contactInfo }) {
  if (!isOpen || !contactInfo) return null;

  const hasEmail = Boolean(contactInfo.contact_email);
  const hasPhone = Boolean(contactInfo.whatsapp_number);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-lg"
      style={{ background: 'rgb(0 0 0 / 0.5)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label="Contact information shared"
    >
      <div
        className="w-full max-w-md rounded-xl p-xl"
        style={{
          background: 'rgb(var(--color-surface-container))',
          border: '1px solid rgb(var(--color-outline-variant))',
        }}
      >
        <div className="flex items-center justify-between mb-lg">
          <h3 className="font-headline-md text-headline-md font-semibold" style={{ color: 'rgb(var(--color-on-surface))' }}>
            Contact Information Shared
          </h3>
          <button type="button" onClick={onClose} className="p-xs rounded-lg hover:opacity-80" aria-label="Close">
            <X size={18} style={{ color: 'rgb(var(--color-on-surface-variant))' }} />
          </button>
        </div>

        <div className="flex items-center gap-md mb-xl p-md rounded-lg" style={{ background: 'rgb(var(--color-success) / 0.1)' }}>
          <CheckCircle size={20} style={{ color: 'rgb(var(--color-success))' }} />
          <p className="font-body-sm" style={{ color: 'rgb(var(--color-success))' }}>The builder has shared their contact details with you.</p>
        </div>

        <div className="space-y-lg">
          {hasEmail ? (
            <div className="flex items-center gap-md p-md rounded-lg" style={{ background: 'rgb(var(--color-surface-container-high))' }}>
              <Mail size={18} style={{ color: 'rgb(var(--color-primary))' }} />
              <div className="flex-1 min-w-0">
                <p className="font-label-caps text-label-caps" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>Email</p>
                <p className="font-body-sm font-medium truncate" style={{ color: 'rgb(var(--color-on-surface))' }}>{contactInfo.contact_email}</p>
              </div>
              <CopyButton text={contactInfo.contact_email} />
            </div>
          ) : null}
          {hasPhone ? (
            <div className="flex items-center gap-md p-md rounded-lg" style={{ background: 'rgb(var(--color-surface-container-high))' }}>
              <Smartphone size={18} style={{ color: 'rgb(var(--color-primary))' }} />
              <div className="flex-1 min-w-0">
                <p className="font-label-caps text-label-caps" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>Phone</p>
                <p className="font-body-sm font-medium truncate" style={{ color: 'rgb(var(--color-on-surface))' }}>{contactInfo.whatsapp_number}</p>
              </div>
              <CopyButton text={contactInfo.whatsapp_number} />
            </div>
          ) : null}
        </div>

        <div className="mt-xl flex justify-end">
          <Button variant="primary" onClick={onClose}>Got it</Button>
        </div>
      </div>
    </div>
  );
}

export default ContactSharedModal;
