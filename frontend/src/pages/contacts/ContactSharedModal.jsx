import { X, Mail, Smartphone, CheckCircle } from 'lucide-react';
import Button from '../../components/ui/Button.jsx';

function ContactSharedModal({ isOpen, onClose, contactInfo }) {
  if (!isOpen || !contactInfo) return null;

  const hasEmail = Boolean(contactInfo.contact_email);
  const hasWhatsapp = Boolean(contactInfo.whatsapp_number);

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
              <div>
                <p className="font-label-caps text-label-caps" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>Email</p>
                <p className="font-body-sm font-medium" style={{ color: 'rgb(var(--color-on-surface))' }}>{contactInfo.contact_email}</p>
              </div>
            </div>
          ) : null}
          {hasWhatsapp ? (
            <div className="flex items-center gap-md p-md rounded-lg" style={{ background: 'rgb(var(--color-surface-container-high))' }}>
              <Smartphone size={18} style={{ color: 'rgb(var(--color-primary))' }} />
              <div>
                <p className="font-label-caps text-label-caps" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>WhatsApp</p>
                <p className="font-body-sm font-medium" style={{ color: 'rgb(var(--color-on-surface))' }}>{contactInfo.whatsapp_number}</p>
              </div>
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
