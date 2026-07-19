import Avatar from '../ui/Avatar.jsx';
import RepositoryScore from './RepositoryScore.jsx';
import VerifiedSkills from './VerifiedSkills.jsx';

function ContributorCard({ contributor, variant = 'standard', className = '' }) {
  if (!contributor) {
    return <p className="font-body-sm" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>No contributor data.</p>;
  }

  return (
    <div
      className={`card-border rounded-lg p-lg ${variant === 'compact' ? 'flex items-center gap-3' : 'space-y-3'} ${className}`}
      style={{ background: 'rgb(var(--color-surface-container-low))' }}
    >
      {/* Header: avatar + name + role */}
      <div className={`flex items-center gap-3 ${variant === 'compact' ? '' : ''}`}>
        <Avatar src={contributor.avatar} alt={contributor.name || 'Contributor'} size={variant === 'compact' ? 'sm' : 'md'} />
        <div className="min-w-0 flex-1">
          <p className="font-body-sm font-semibold truncate" style={{ color: 'rgb(var(--color-on-surface))' }}>{contributor.name}</p>
          <p className="font-body-sm truncate" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>{contributor.role || 'Builder'}</p>
        </div>
        {variant === 'compact' && contributor.repositoryScore != null && (
          <RepositoryScore score={contributor.repositoryScore} size="sm" showRing={false} showGrade />
        )}
      </div>

      {variant !== 'compact' && (
        <>
          {/* Score + Rank */}
          <div className="flex items-center justify-between">
            {contributor.repositoryScore != null && <RepositoryScore score={contributor.repositoryScore} size="sm" />}
            {contributor.rank && (
              <span className="font-label-caps text-[10px] px-2 py-0.5 rounded" style={{ background: 'rgb(var(--color-surface-container-high))', color: 'rgb(var(--color-on-surface-variant))' }}>
                {contributor.rank}
              </span>
            )}
          </div>

          {/* Skills */}
          {contributor.skills?.length > 0 && <VerifiedSkills skills={contributor.skills} variant="compact" />}

          {/* Contribution % */}
          {contributor.contributionPercent != null && (
            <div className="flex items-center gap-2">
              <span className="font-label-caps text-[10px] uppercase tracking-wider" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>Contribution</span>
              <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgb(var(--color-surface-container-highest))' }}>
                <div className="h-full rounded-full transition-all" style={{ width: `${contributor.contributionPercent}%`, background: 'rgb(var(--color-primary))' }} />
              </div>
              <span className="font-mono text-[10px] font-semibold" style={{ color: 'rgb(var(--color-primary))' }}>{contributor.contributionPercent}%</span>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ContributorCard;
