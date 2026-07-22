const techColors = {
  rust: { bg: 'var(--color-success)', text: 'var(--color-on-primary)' },
  typescript: { bg: 'var(--color-primary)', text: 'var(--color-on-primary)' },
  javascript: { bg: 'var(--color-warning)', text: 'var(--color-on-primary)' },
  python: { bg: 'var(--color-secondary)', text: 'var(--color-on-secondary)' },
  go: { bg: 'var(--color-primary)', text: 'var(--color-on-primary)' },
  solidity: { bg: 'var(--color-on-surface-variant)', text: 'var(--color-on-surface)' },
};

function VerifiedTechnologies({ technologies = [], onFilter, className = '' }) {
  if (technologies.length === 0) {
    return <p className="font-body-sm" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>No technologies detected.</p>;
  }

  return (
    <div className={`flex flex-wrap gap-1.5 ${className}`}>
      {technologies.map((tech, i) => {
        const key = typeof tech === 'string' ? tech : tech.name;
        const techKey = key?.toLowerCase();
        const colors = techColors[techKey] || { bg: 'var(--color-surface-container-high)', text: 'var(--color-on-surface)' };

        return (
          <button
            key={key || i}
            className="inline-flex items-center gap-1 font-mono text-[11px] px-2 py-0.5 rounded transition-all duration-150 hover:opacity-80"
            style={{ background: `rgb(${colors.bg} / 0.15)`, color: `rgb(${colors.text})` }}
            onClick={() => onFilter?.(key)}
            type="button"
          >
            {typeof tech === 'string' ? tech : tech.name}
            {tech.confidence != null && (
              <span className="opacity-60">· {tech.confidence}%</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export default VerifiedTechnologies;
