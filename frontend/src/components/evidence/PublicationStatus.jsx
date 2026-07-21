function PublicationStatus({ status = 'draft', className = '' }) {
  const config = {
    draft: { label: 'In Progress', color: 'var(--color-on-surface-variant)' },
    submitted: { label: 'Submitted', color: 'var(--color-primary)' },
    published: { label: 'Published', color: 'var(--color-success)' },
    accepted: { label: 'Accepted', color: 'var(--color-success)' },
    rejected: { label: 'Rejected', color: 'var(--color-error)' },
  };

  const c = config[status] || config.draft;

  return (
    <span
      className={`inline-flex items-center gap-1 font-mono text-[10px] px-2 py-0.5 rounded-full ${className}`}
      style={{ background: `rgb(${c.color} / 0.12)`, color: `rgb(${c.color})` }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: `rgb(${c.color})` }} />
      {c.label}
    </span>
  );
}

export default PublicationStatus;
