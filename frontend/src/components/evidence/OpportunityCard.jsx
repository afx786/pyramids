import Button from '../ui/Button.jsx';
import VerifiedSkills from './VerifiedSkills.jsx';

function OpportunityCard({ opportunity, onApply, className = '' }) {
  if (!opportunity) {
    return <p className="font-body-sm" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>No opportunity data.</p>;
  }

  return (
    <article className="card-border rounded-lg p-lg space-y-3 card-hover" style={{ background: 'rgb(var(--color-surface-container-low))' }}>
      {/* Role + Apply */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h4 className="font-body-sm font-bold" style={{ color: 'rgb(var(--color-on-surface))' }}>{opportunity.role}</h4>
          {opportunity.availability && (
            <span className="font-label-caps text-[10px] uppercase tracking-wider" style={{ color: 'rgb(var(--color-success))' }}>
              {opportunity.availability}
            </span>
          )}
        </div>
        <Button size="sm" onClick={() => onApply?.(opportunity)}>Apply</Button>
      </div>

      {/* Required Skills */}
      {opportunity.skills?.length > 0 && (
        <div>
          <span className="font-label-caps text-[9px] uppercase tracking-wider" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>Required Skills</span>
          <VerifiedSkills skills={opportunity.skills} variant="compact" />
        </div>
      )}

      {/* Meta */}
      <div className="flex flex-wrap gap-3 text-[11px]">
        {opportunity.experience && (
          <span className="font-mono" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
            Exp: {opportunity.experience}
          </span>
        )}
        {opportunity.commitment && (
          <span className="font-mono" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
            {opportunity.commitment}/wk
          </span>
        )}
      </div>
    </article>
  );
}

export default OpportunityCard;
