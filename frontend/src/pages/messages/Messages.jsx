import { MessageSquare, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function MessagesComingSoon() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-xl text-center">
      <div
        className="w-20 h-20 rounded-2xl flex items-center justify-center mb-xl"
        style={{ background: 'rgb(var(--color-surface-container-high))', border: '1px solid rgb(var(--color-outline-variant))' }}
      >
        <MessageSquare size={36} strokeWidth={1.5} style={{ color: 'rgb(var(--color-on-surface-variant))' }} />
      </div>
      <h2 className="font-display-serif text-display-serif font-semibold mb-md" style={{ color: 'rgb(var(--color-on-surface))' }}>
        Messaging is Coming Soon
      </h2>
      <p className="font-body-lg text-body-lg max-w-lg mb-xl" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
        We&apos;re focusing on building the best collaboration experience for our beta community.
      </p>
      <p className="font-body-sm max-w-md mb-2xl" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
        For now, connect with builders and securely request their contact information when you want to collaborate. Messaging will launch after the beta program.
      </p>
      <button
        type="button"
        onClick={() => navigate('/dashboard')}
        className="inline-flex items-center gap-2 px-xl py-md rounded-lg font-body-sm font-semibold transition-all hover:opacity-90 active:scale-[0.98]"
        style={{ background: 'rgb(var(--color-primary))', color: 'rgb(var(--color-on-primary))' }}
      >
        Back to Dashboard
        <ArrowRight size={16} />
      </button>
    </div>
  );
}

export default MessagesComingSoon;
