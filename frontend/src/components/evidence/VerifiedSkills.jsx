function VerifiedSkills({ skills = [], variant = 'standard', max = 10, className = '' }) {
  if (skills.length === 0) {
    return <p className="font-body-sm" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>No skills verified yet.</p>;
  }

  const displayed = variant === 'compact' ? skills.slice(0, 3) : variant === 'expanded' ? skills : skills.slice(0, max);
  const remaining = skills.length - displayed.length;

  return (
    <div className={`flex flex-wrap gap-1.5 ${className}`}>
      {displayed.map((skill, i) => (
        <span
          key={typeof skill === 'string' ? skill : skill.name || i}
          className="font-mono text-[11px] px-2 py-0.5 rounded"
          style={{ background: 'rgb(var(--color-surface-variant))', color: 'rgb(var(--color-on-surface))' }}
        >
          {typeof skill === 'string' ? skill : skill.name}
        </span>
      ))}
      {remaining > 0 && (
        <span className="font-mono text-[11px] px-2 py-0.5 rounded" style={{ background: 'rgb(var(--color-surface-container-high))', color: 'rgb(var(--color-on-surface-variant))' }}>
          +{remaining}
        </span>
      )}
    </div>
  );
}

export default VerifiedSkills;
