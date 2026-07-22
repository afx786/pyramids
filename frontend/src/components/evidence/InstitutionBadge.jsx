function InstitutionBadge({ name, type, verified = false, className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono text-[10px] px-2 py-0.5 rounded ${className}`}
      style={{
        background: verified ? 'rgb(var(--color-success) / 0.1)' : 'rgb(var(--color-surface-container-high))',
        color: verified ? 'rgb(var(--color-success))' : 'rgb(var(--color-on-surface-variant))',
        border: verified ? '1px solid rgb(var(--color-success) / 0.3)' : '1px solid rgb(var(--color-outline-variant))',
      }}
    >
      {verified && <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'rgb(var(--color-success))' }} />}
      {name || type || 'Unknown Institution'}
    </span>
  );
}

export default InstitutionBadge;
