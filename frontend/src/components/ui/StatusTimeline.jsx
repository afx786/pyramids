import { Check, Circle } from 'lucide-react';

const statusFlows = {
  draft: ['draft', 'submitted', 'approved', 'published', 'completed', 'archived'],
};

const statusLabels = {
  draft: 'Draft', submitted: 'Submitted', under_review: 'Under Review',
  approved: 'Approved', published: 'Published', completed: 'Completed',
  archived: 'Archived', rejected: 'Rejected',
};

const statusColors = {
  draft: 'var(--color-on-surface-variant)',
  submitted: 'var(--color-primary)',
  under_review: 'var(--color-warning)',
  approved: 'var(--color-success)',
  published: 'var(--color-success)',
  completed: 'var(--color-primary)',
  archived: 'var(--color-on-surface-variant)',
  rejected: 'var(--color-error)',
};

function StatusTimeline({ currentStatus = 'draft', className = '' }) {
  const flow = statusFlows.draft;
  const currentIdx = flow.indexOf(currentStatus);

  return (
    <div className={`flex items-center gap-0 ${className}`}>
      {flow.map((step, idx) => {
        const isCompleted = idx < currentIdx;
        const isCurrent = idx === currentIdx;
        const color = statusColors[step] || 'var(--color-on-surface-variant)';
        const label = statusLabels[step] || step;

        return (
          <div key={step} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center transition-all"
                style={{
                  background: isCompleted ? `rgb(${color})` : isCurrent ? `rgb(${color} / 0.15)` : 'rgb(var(--color-surface-container-high))',
                  border: isCompleted ? 'none' : `1px solid rgb(var(--color-outline-variant))`,
                }}
              >
                {isCompleted ? (
                  <Check size={12} strokeWidth={2} style={{ color: 'rgb(var(--color-on-primary))' }} />
                ) : (
                  <Circle size={8} strokeWidth={0} fill={isCurrent ? `rgb(${color})` : 'rgb(var(--color-on-surface-variant))'} />
                )}
              </div>
              <span
                className="font-mono text-[8px] uppercase tracking-wider whitespace-nowrap"
                style={{
                  color: isCompleted || isCurrent ? `rgb(${color})` : 'rgb(var(--color-on-surface-variant) / 0.5)',
                }}
              >
                {label}
              </span>
            </div>
            {idx < flow.length - 1 && (
              <div
                className="flex-1 h-px mx-1"
                style={{
                  background: isCompleted ? `rgb(${color})` : 'rgb(var(--color-outline-variant))',
                  opacity: idx >= currentIdx ? 0.3 : 1,
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default StatusTimeline;
