function LoadingState({ label = 'Loading' }) {
  return (
    <div className="flex min-h-48 items-center justify-center rounded-lg border border-subtle bg-surface">
      <div className="text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-subtle border-t-primary" />
        <p className="mt-4 text-sm font-black text-secondary">{label}</p>
      </div>
    </div>
  );
}

export default LoadingState;
