function ResearchProgress({ milestones, className = '' }) {
  if (!Array.isArray(milestones)) milestones = [];
  if (milestones.length === 0) {
    return <p className="font-body-sm" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>No milestones defined.</p>;
  }

  const completed = milestones.filter(m => m.is_completed).length;
  const pct = Math.round((completed / milestones.length) * 100);

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <span className="font-label-caps text-[10px] uppercase tracking-wider" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
          Research Progress
        </span>
        <span className="font-mono text-[11px] font-semibold" style={{ color: 'rgb(var(--color-primary))' }}>
          {completed}/{milestones.length}
        </span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgb(var(--color-surface-container-highest))' }}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: 'rgb(var(--color-primary))' }}
        />
      </div>
      <div className="space-y-1">
        {milestones.map((m, i) => (
          <div key={m.id || i} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full flex items-center justify-center shrink-0"
              style={{
                background: m.is_completed ? 'rgb(var(--color-success))' : 'rgb(var(--color-surface-container-high))',
                border: m.is_completed ? 'none' : '1px solid rgb(var(--color-outline-variant))',
              }}
            >
              {m.is_completed && <span className="text-[6px]" style={{ color: 'rgb(var(--color-on-primary))' }}>✓</span>}
            </div>
            <span className="font-body-sm flex-1" style={{ color: 'rgb(var(--color-on-surface))', textDecoration: m.is_completed ? 'line-through' : 'none', opacity: m.is_completed ? 0.6 : 1 }}>
              {m.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ResearchProgress;
