import VerificationSeal from './VerificationSeal.jsx';
import VerifiedSkills from './VerifiedSkills.jsx';

function ResearchVerification({ research, className = '' }) {
  if (!research) {
    return <p className="font-body-sm" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>No research data.</p>;
  }

  const statusMap = { published: 'verified', completed: 'verified', submitted: 'verified' };
  const status = statusMap[research.status] || 'pending';

  return (
    <div className={`card-border rounded-lg p-lg space-y-3 ${className}`} style={{ background: 'rgb(var(--color-surface-container-low))' }}>
      <div className="flex items-center justify-between">
        <span className="font-label-caps text-[10px] uppercase tracking-wider" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
          Research Status
        </span>
        <VerificationSeal status={status} size="sm" />
      </div>
      <h4 className="font-headline-md font-bold" style={{ color: 'rgb(var(--color-primary))' }}>{research.title}</h4>
      <div className="flex flex-wrap gap-2">
        <span className="font-mono text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'rgb(var(--color-surface-variant))', color: 'rgb(var(--color-on-surface))' }}>
          {research.research_type}
        </span>
        <span className="font-mono text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'rgb(var(--color-surface-variant))', color: 'rgb(var(--color-on-surface))' }}>
          {research.domain}
        </span>
      </div>
      {research.skills_needed && (
        <div>
          <span className="font-label-caps text-[9px] uppercase" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>Skills Needed</span>
          <VerifiedSkills skills={research.skills_needed.split(',').map(s => s.trim())} variant="compact" />
        </div>
      )}
      <div className="grid grid-cols-2 gap-3">
        {research.institution && (
          <div>
            <span className="font-label-caps text-[9px] uppercase" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>Institution</span>
            <p className="font-mono text-[11px]" style={{ color: 'rgb(var(--color-primary))' }}>{research.institution}</p>
          </div>
        )}
        {research.supervisor && (
          <div>
            <span className="font-label-caps text-[9px] uppercase" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>Supervisor</span>
            <p className="font-mono text-[11px]" style={{ color: 'rgb(var(--color-primary))' }}>{research.supervisor}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ResearchVerification;
