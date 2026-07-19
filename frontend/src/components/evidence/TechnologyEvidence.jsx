import ConfidenceIndicator from './ConfidenceIndicator.jsx';

const techIcons = {
  rust: '🦀',
  typescript: 'TS',
  javascript: 'JS',
  python: '🐍',
  go: '🔵',
  solidity: '◆',
  cpp: 'C++',
  react: '⚛️',
  docker: '🐳',
  kubernetes: '☸️',
  aws: '☁️',
  default: '⚙️',
};

function TechnologyEvidence({ technology, confidence, evidenceCount, icon, className = '' }) {
  const displayIcon = icon || techIcons[technology?.toLowerCase()] || techIcons.default;

  return (
    <div className={`flex items-center gap-2 p-2 rounded-lg card-hover ${className}`} style={{ background: 'rgb(var(--color-surface-container-low))' }} title={`${technology}: ${confidence}% confidence, ${evidenceCount} evidence items`}>
      <div className="w-8 h-8 rounded flex items-center justify-center text-[14px] font-mono font-bold shrink-0" style={{ background: 'rgb(var(--color-surface-container-high))' }}>
        {displayIcon}
      </div>
      <div className="flex-1 min-w-0">
        <span className="font-body-sm font-semibold block truncate" style={{ color: 'rgb(var(--color-on-surface))' }}>{technology}</span>
        {confidence != null && <ConfidenceIndicator value={confidence} size="sm" />}
      </div>
      {evidenceCount > 0 && (
        <span className="font-mono text-[10px] shrink-0" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
          {evidenceCount} files
        </span>
      )}
    </div>
  );
}

export default TechnologyEvidence;
