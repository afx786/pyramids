import { FileQuestion } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-lg py-2xl text-center">
      <div className="flex items-center justify-center w-20 h-20 rounded-2xl mb-xl" style={{ background: 'rgb(var(--color-surface-container-high))', border: '1px solid rgb(var(--color-outline-variant))' }}>
        <FileQuestion className="h-10 w-10" strokeWidth={1.5} style={{ color: 'rgb(var(--color-on-surface-variant))' }} />
      </div>
      <h1 className="font-display-serif text-[120px] leading-none font-bold mb-sm" style={{ color: 'rgb(var(--color-primary))' }}>
        404
      </h1>
      <h2 className="font-headline-lg font-semibold mb-md" style={{ color: 'rgb(var(--color-on-surface))' }}>
        Page not found
      </h2>
      <p className="font-body-lg max-w-md mb-xl" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div className="flex items-center gap-md">
        <button
          type="button"
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center gap-2 px-xl py-sm rounded-lg font-body-sm font-semibold transition-all hover:opacity-90 active:scale-[0.98]"
          style={{ background: 'rgb(var(--color-primary))', color: 'rgb(var(--color-on-primary))' }}
        >
          Return Home
        </button>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-xl py-sm rounded-lg font-body-sm font-semibold transition-all hover:opacity-90 active:scale-[0.98]"
          style={{ background: 'rgb(var(--color-surface-container-high))', color: 'rgb(var(--color-on-surface))', border: '1px solid rgb(var(--color-outline-variant))' }}
        >
          Go Back
        </button>
      </div>
    </div>
  );
}

export default NotFound;
