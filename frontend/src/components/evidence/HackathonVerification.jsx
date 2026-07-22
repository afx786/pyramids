import VerificationSeal from './VerificationSeal.jsx';
import ConfidenceIndicator from './ConfidenceIndicator.jsx';

function HackathonVerification({ hackathon, className = '' }) {
  if (!hackathon) {
    return <p className="font-body-sm" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>No hackathon data.</p>;
  }

  const status = hackathon.status === 'published' || hackathon.status === 'completed' ? 'verified' : 'pending';

  return (
    <div className={`card-border rounded-lg p-lg space-y-3 ${className}`} style={{ background: 'rgb(var(--color-surface-container-low))' }}>
      <div className="flex items-center justify-between">
        <span className="font-label-caps text-[10px] uppercase tracking-wider" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
          Hackathon Status
        </span>
        <VerificationSeal status={status} size="sm" />
      </div>
      <h4 className="font-headline-md font-bold" style={{ color: 'rgb(var(--color-primary))' }}>{hackathon.title}</h4>
      <div className="flex flex-wrap gap-2">
        {hackathon.domains?.map((d, i) => (
          <span key={i} className="font-mono text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'rgb(var(--color-surface-variant))', color: 'rgb(var(--color-on-surface))' }}>
            {d}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <span className="font-label-caps text-[9px] uppercase" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>Prize Pool</span>
          <p className="font-mono text-[12px] font-semibold" style={{ color: 'rgb(var(--color-primary))' }}>{hackathon.prize_pool || '—'}</p>
        </div>
        <div>
          <span className="font-label-caps text-[9px] uppercase" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>Teams</span>
          <p className="font-mono text-[12px] font-semibold" style={{ color: 'rgb(var(--color-primary))' }}>{hackathon.teams_count || 0}</p>
        </div>
      </div>
      {hackathon.confidence != null && <ConfidenceIndicator value={hackathon.confidence} size="sm" />}
    </div>
  );
}

export default HackathonVerification;
