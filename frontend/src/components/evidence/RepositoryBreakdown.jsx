const defaultMetrics = [
  { key: 'documentation', label: 'Documentation' },
  { key: 'codeQuality', label: 'Code Quality' },
  { key: 'testing', label: 'Testing' },
  { key: 'structure', label: 'Structure' },
  { key: 'maintainability', label: 'Maintainability' },
  { key: 'activity', label: 'Activity' },
];

function RepositoryBreakdown({ metrics = {}, className = '' }) {
  return (
    <div className={`space-y-3 ${className}`}>
      {defaultMetrics.map((m) => {
        const value = metrics[m.key] ?? 0;
        const clamped = Math.max(0, Math.min(100, value));
        const color = clamped >= 80 ? 'var(--color-success)' : clamped >= 50 ? 'var(--color-warning)' : 'var(--color-error)';
        return (
          <div key={m.key}>
            <div className="flex items-center justify-between mb-1">
              <span className="font-label-caps text-[10px] uppercase tracking-wider" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>{m.label}</span>
              <span className="font-mono text-[10px] font-semibold" style={{ color: `rgb(${color})` }}>{clamped}%</span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgb(var(--color-surface-container-highest))' }}>
              <div className="h-full rounded-full transition-all duration-500" style={{ width: `${clamped}%`, background: `rgb(${color})` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default RepositoryBreakdown;
