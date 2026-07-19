import { CheckCircle, Clock, XCircle, GitBranch, Code2, Blocks, Container, ShieldCheck, FileSearch, Brain } from 'lucide-react';

const eventIcons = {
  'repository_connected': GitBranch,
  'languages_detected': Code2,
  'technologies_extracted': Blocks,
  'cicd_detected': Container,
  'docker_verified': Container,
  'score_generated': FileSearch,
  'verification_completed': ShieldCheck,
  'extraction_completed': Brain,
};

const eventLabels = {
  'repository_connected': 'Repository Connected',
  'languages_detected': 'Languages Detected',
  'technologies_extracted': 'Technologies Extracted',
  'cicd_detected': 'CI/CD Detected',
  'docker_verified': 'Docker Verified',
  'score_generated': 'Repository Score Generated',
  'verification_completed': 'Verification Completed',
  'extraction_completed': 'Skill Extraction Completed',
};

function VerificationAudit({ events = [], className = '' }) {
  return (
    <div className={`space-y-0 ${className}`} role="log" aria-label="Verification audit timeline">
      {events.length === 0 ? (
        <p className="font-body-sm py-md" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>No verification events recorded yet.</p>
      ) : (
        events.map((event, idx) => {
          const Icon = eventIcons[event.type] || ShieldCheck;
          const label = eventLabels[event.type] || event.type;
          const isLast = idx === events.length - 1;
          const status = event.status || 'completed';
          const statusColor = status === 'completed' ? 'var(--color-success)' : status === 'active' ? 'var(--color-primary)' : 'var(--color-on-surface-variant)';

          return (
            <div key={event.id || idx} className="flex gap-3 relative">
              {/* Vertical line */}
              {!isLast && (
                <div className="absolute left-[11px] top-6 bottom-0 w-px" style={{ background: 'rgb(var(--color-outline-variant))' }} />
              )}
              {/* Icon */}
              <div className="relative z-10 mt-0.5">
                <Icon size={14} strokeWidth={2} style={{ color: `rgb(${statusColor})` }} />
              </div>
              {/* Content */}
              <div className="pb-4 flex-1">
                <p className="font-body-sm font-semibold" style={{ color: 'rgb(var(--color-on-surface))' }}>{label}</p>
                {event.description && (
                  <p className="font-body-sm" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>{event.description}</p>
                )}
                {event.timestamp && (
                  <span className="font-mono text-[10px]" style={{ color: 'rgb(var(--color-on-surface-variant) / 0.7)' }}>
                    {new Date(event.timestamp).toLocaleString()}
                  </span>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

export default VerificationAudit;
