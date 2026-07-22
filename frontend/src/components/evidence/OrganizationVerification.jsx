import VerificationSeal from './VerificationSeal.jsx';

function OrganizationVerification({ organization, className = '' }) {
  if (!organization) {
    return <p className="font-body-sm" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>No organization data.</p>;
  }

  return (
    <div className={`card-border rounded-lg p-lg space-y-3 ${className}`} style={{ background: 'rgb(var(--color-surface-container-low))' }}>
      <div className="flex items-center justify-between">
        <span className="font-label-caps text-[10px] uppercase tracking-wider" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
          Organization
        </span>
        <VerificationSeal status={organization.is_verified ? 'verified' : 'pending'} size="sm" />
      </div>
      <h4 className="font-headline-md font-bold" style={{ color: 'rgb(var(--color-primary))' }}>{organization.name}</h4>
      {organization.org_type && (
        <span className="font-mono text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'rgb(var(--color-surface-variant))', color: 'rgb(var(--color-on-surface))' }}>
          {organization.org_type}
        </span>
      )}
      {organization.domains?.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {organization.domains.map((d, i) => (
            <span key={i} className="font-mono text-[9px] px-1 py-0.5 rounded" style={{ background: 'rgb(var(--color-surface-container-high))', color: 'rgb(var(--color-on-surface-variant))' }}>
              {d}
            </span>
          ))}
        </div>
      )}
      {organization.website && (
        <p className="font-mono text-[10px]" style={{ color: 'rgb(var(--color-primary))' }}>{organization.website}</p>
      )}
    </div>
  );
}

export default OrganizationVerification;
