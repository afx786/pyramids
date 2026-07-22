import { useState } from 'react';
import { X, Mail, Smartphone } from 'lucide-react';
import { contactService } from '../../services/contactService.js';
import Button from '../../components/ui/Button.jsx';

function RequesterInfoModal({ isOpen, onClose }) {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  async function handleSave() {
    if (!email.trim() && !phone.trim()) {
      setError('Please provide at least one contact method.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await contactService.updateMyInfo({ contact_email: email.trim() || null, whatsapp_number: phone.trim() || null });
      onClose(true);
    } catch (err) {
      setError(err.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  }

  function handleNotNow() {
    onClose(false);
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-lg"
      style={{ background: 'rgb(0 0 0 / 0.5)' }}
      onClick={(e) => { if (e.target === e.currentTarget) handleNotNow(); }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="requester-info-title"
    >
      <div
        className="w-full max-w-md rounded-xl p-xl"
        style={{
          background: 'rgb(var(--color-surface-container))',
          border: '1px solid rgb(var(--color-outline-variant))',
        }}
      >
        <div className="flex items-center justify-between mb-lg">
          <h3 id="requester-info-title" className="font-headline-md text-headline-md font-semibold" style={{ color: 'rgb(var(--color-on-surface))' }}>
            Connect Beyond Pyramids
          </h3>
          <button type="button" onClick={handleNotNow} className="p-xs rounded-lg hover:opacity-80" aria-label="Close">
            <X size={18} style={{ color: 'rgb(var(--color-on-surface-variant))' }} />
          </button>
        </div>

        <p className="font-body-sm mb-xl" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
          To request another builder&apos;s contact details, share how they can reach you. Your information remains private until you approve a request.
        </p>

        {error ? (
          <p className="rounded-lg px-lg py-sm font-body-sm mb-lg" style={{ background: 'rgb(var(--color-error-container))', color: 'rgb(var(--color-on-error-container))' }}>{error}</p>
        ) : null}

        <div className="space-y-lg mb-xl">
          <div>
            <label className="font-label-caps text-label-caps block mb-sm" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
              <Mail size={14} className="inline mr-1" /> Email
            </label>
            <input
              className="w-full rounded-lg py-sm px-md font-body-sm"
              style={{
                background: 'rgb(var(--color-surface-container-lowest))',
                border: '1px solid rgb(var(--color-outline-variant))',
                color: 'rgb(var(--color-on-surface))',
              }}
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="font-label-caps text-label-caps block mb-sm" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
              <Smartphone size={14} className="inline mr-1" /> Phone Number
            </label>
            <p className="font-body-sm mb-xs" style={{ color: 'rgb(var(--color-on-surface-variant) / 0.7)' }}>
              (e.g., WhatsApp, Telegram, or mobile)
            </p>
            <input
              className="w-full rounded-lg py-sm px-md font-body-sm"
              style={{
                background: 'rgb(var(--color-surface-container-lowest))',
                border: '1px solid rgb(var(--color-outline-variant))',
                color: 'rgb(var(--color-on-surface))',
              }}
              placeholder="+1 555 123 4567"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
        </div>

        <div className="flex gap-md justify-end">
          <Button variant="secondary" onClick={handleNotNow}>Not Now</Button>
          <Button variant="primary" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save & Continue'}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default RequesterInfoModal;
