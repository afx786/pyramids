const submissionStatuses = [
  { key: 'submitted', label: 'Submitted' },
  { key: 'pending_review', label: 'Pending Review' },
  { key: 'accepted', label: 'Accepted' },
  { key: 'rejected', label: 'Rejected' },
  { key: 'winner', label: 'Winner' },
];

function SubmissionTimeline({ currentStatus = 'submitted', className = '' }) {
  const currentIdx = submissionStatuses.findIndex(s => s.key === currentStatus) || 0;

  return (
    <div className={`flex items-center gap-0 ${className}`} role="progressbar" aria-label="Submission progress">
      {submissionStatuses.slice(0, 3).map((step, idx) => {
        const isCompleted = idx < currentIdx;
        const isCurrent = idx === currentIdx;
        const isPast = idx <= currentIdx;

        return (
          <div key={step.key} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center transition-all"
                style={{
                  background: isPast ? 'rgb(var(--color-primary))' : 'rgb(var(--color-surface-container-high))',
                  border: isPast ? 'none' : '1px solid rgb(var(--color-outline-variant))',
                }}
              >
                <span className="font-mono text-[8px] font-bold" style={{ color: isPast ? 'rgb(var(--color-on-primary))' : 'rgb(var(--color-on-surface-variant))' }}>
                  {idx + 1}
                </span>
              </div>
              <span className="font-mono text-[8px] uppercase tracking-wider" style={{ color: isPast ? 'rgb(var(--color-primary))' : 'rgb(var(--color-on-surface-variant) / 0.5)' }}>
                {step.label}
              </span>
            </div>
            {idx < 2 && (
              <div className="flex-1 h-px mx-1" style={{ background: idx < currentIdx ? 'rgb(var(--color-primary))' : 'rgb(var(--color-outline-variant))' }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default SubmissionTimeline;
