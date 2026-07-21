function StatCard({ label, value, icon, trend, className = '' }) {
  return (
    <div
      className={`rounded-xl p-lg ${className}`}
      style={{ background: 'rgb(var(--color-surface-container-low))', border: '1px solid rgb(var(--color-outline-variant))' }}
    >
      <div className="flex items-center justify-between">
        <span className="font-label-caps text-[10px] uppercase tracking-wider" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
          {label}
        </span>
        {icon && <span style={{ color: 'rgb(var(--color-on-surface-variant))' }}>{icon}</span>}
      </div>
      <p className="font-headline-md font-bold mt-sm" style={{ color: 'rgb(var(--color-primary))' }}>
        {value ?? '—'}
      </p>
      {trend != null && (
        <span
          className="font-mono text-[10px]"
          style={{ color: trend > 0 ? 'rgb(var(--color-success))' : 'rgb(var(--color-error))' }}
        >
          {trend > 0 ? '+' : ''}{trend}
        </span>
      )}
    </div>
  );
}

export default StatCard;
