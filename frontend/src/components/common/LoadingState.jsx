function LoadingState({ label = 'Loading' }) {
  return (
    <div className="flex min-h-48 items-center justify-center rounded-xl" style={{ border: '1px solid rgb(var(--color-glass-border))', background: 'rgb(var(--color-glass))' }}>
      <div className="text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full" style={{ border: '2px solid rgb(var(--color-accent-soft))', borderTopColor: 'rgb(var(--color-accent))' }} />
        <p className="mt-4 text-sm font-black text-secondary">{label}</p>
      </div>
    </div>
  );
}

export default LoadingState;
