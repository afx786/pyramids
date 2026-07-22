function LoadingState({ label = 'Loading' }) {
  return (
    <div className="flex min-h-48 items-center justify-center rounded-xl card-border" style={{ background: 'rgb(var(--color-surface-container-low))' }}>
      <div className="text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full" style={{ border: '2px solid rgb(var(--color-surface-container-high))', borderTopColor: 'rgb(var(--color-primary))' }} />
        <p className="mt-md font-body-sm font-semibold" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>{label}</p>
      </div>
    </div>
  );
}

export default LoadingState;
