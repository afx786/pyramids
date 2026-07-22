const statusConfig = {
  draft: { color: 'var(--color-on-surface-variant)', bg: 'var(--color-surface-container-high)' },
  submitted: { color: 'var(--color-primary)', bg: 'var(--color-primary)' },
  under_review: { color: 'var(--color-warning)', bg: 'var(--color-warning)' },
  approved: { color: 'var(--color-success)', bg: 'var(--color-success)' },
  rejected: { color: 'var(--color-error)', bg: 'var(--color-error)' },
  published: { color: 'var(--color-success)', bg: 'var(--color-success)' },
  completed: { color: 'var(--color-primary)', bg: 'var(--color-primary)' },
  archived: { color: 'var(--color-on-surface-variant)', bg: 'var(--color-surface-container-high)' },
  pending: { color: 'var(--color-warning)', bg: 'var(--color-warning)' },
  verified: { color: 'var(--color-success)', bg: 'var(--color-success)' },
  recruiting: { color: 'var(--color-primary)', bg: 'var(--color-primary)' },
  active: { color: 'var(--color-success)', bg: 'var(--color-success)' },
  writing: { color: 'var(--color-warning)', bg: 'var(--color-warning)' },
  submitted_status: { color: 'var(--color-primary)', bg: 'var(--color-primary)' },
  accepted: { color: 'var(--color-success)', bg: 'var(--color-success)' },
  winner: { color: 'var(--color-warning)', bg: 'var(--color-warning)' },
};

function StatusBadge({ status = 'draft', size = 'sm', className = '' }) {
  const config = statusConfig[status] || { color: 'var(--color-on-surface-variant)', bg: 'var(--color-surface-container-high)' };
  const sizeClass = size === 'sm' ? 'text-[10px] px-1.5 py-0.5' : 'text-[12px] px-2 py-1';

  return (
    <span
      className={`inline-flex items-center font-mono font-semibold rounded ${sizeClass} ${className}`}
      style={{
        background: `rgb(${config.bg} / 0.12)`,
        color: `rgb(${config.color})`,
        textTransform: 'capitalize',
      }}
    >
      {status.replace(/_/g, ' ')}
    </span>
  );
}

export default StatusBadge;
