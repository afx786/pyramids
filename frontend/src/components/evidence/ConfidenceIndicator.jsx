function ConfidenceIndicator({ value = 0, size = 'md', showLabel = true, className = '' }) {
  const clamped = Math.max(0, Math.min(100, value));
  const color = clamped >= 80 ? 'var(--color-success)' : clamped >= 50 ? 'var(--color-warning)' : 'var(--color-error)';
  const barHeight = size === 'sm' ? 4 : size === 'lg' ? 8 : 6;

  return (
    <div className={`flex items-center gap-2 ${className}`} role="meter" aria-valuenow={clamped} aria-valuemin={0} aria-valuemax={100} aria-label={`Confidence ${clamped}%`}>
      <div className="flex-1 rounded-full overflow-hidden" style={{ height: barHeight, background: 'rgb(var(--color-surface-container-highest))' }}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${clamped}%`, background: `rgb(${color})` }}
        />
      </div>
      {showLabel && (
        <span className="font-mono text-[11px] font-semibold shrink-0" style={{ color: `rgb(${color})` }}>
          {clamped}%
        </span>
      )}
    </div>
  );
}

export default ConfidenceIndicator;
