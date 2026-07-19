import { Link2, Search, Brain, Target, Award, ShieldCheck } from 'lucide-react';

const steps = [
  { key: 'connect', icon: Link2, label: 'Connect' },
  { key: 'inspect', icon: Search, label: 'Inspect' },
  { key: 'analyze', icon: Brain, label: 'Analyze' },
  { key: 'extract', icon: Target, label: 'Extract' },
  { key: 'score', icon: Award, label: 'Score' },
  { key: 'verify', icon: ShieldCheck, label: 'Verify' },
];

function VerificationTimeline({ currentStep = 'connect', className = '' }) {
  const stepKeys = steps.map((s) => s.key);
  const currentIdx = stepKeys.indexOf(currentStep);

  return (
    <div className={`flex items-center justify-between ${className}`} role="progressbar" aria-label="Verification pipeline" aria-valuenow={currentIdx + 1} aria-valuemin={1} aria-valuemax={steps.length}>
      {steps.map((step, idx) => {
        const Icon = step.icon;
        const isCompleted = idx < currentIdx;
        const isActive = idx === currentIdx;
        const isPending = idx > currentIdx;
        const statusColor = isCompleted ? 'var(--color-success)' : isActive ? 'var(--color-primary)' : 'var(--color-on-surface-variant)';

        return (
          <div key={step.key} className="flex items-center gap-0 flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300"
                style={{
                  background: isCompleted ? `rgb(${statusColor})` : isActive ? 'rgb(var(--color-surface-container-high))' : 'rgb(var(--color-surface-container-lowest))',
                  border: isCompleted ? 'none' : `1px solid rgb(var(--color-outline-variant))`,
                }}
              >
                <Icon size={14} strokeWidth={isActive ? 2 : 1.5} style={{ color: isCompleted ? 'rgb(var(--color-on-primary))' : `rgb(${statusColor})` }} />
              </div>
              <span className="font-mono text-[9px] uppercase tracking-wider" style={{ color: `rgb(${statusColor})`, opacity: isPending ? 0.4 : 1 }}>
                {step.label}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div className="flex-1 h-px mx-1" style={{ background: isCompleted ? 'rgb(var(--color-success))' : 'rgb(var(--color-outline-variant))', opacity: isPending ? 0.3 : 1 }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default VerificationTimeline;
