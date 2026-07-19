import VerificationSeal from './VerificationSeal.jsx';
import RepositoryScore from './RepositoryScore.jsx';
import { ShieldCheck, BookOpen, Clock } from 'lucide-react';

function CredibilitySummary({ data = {}, variant = 'standard', className = '' }) {
  if (!data || Object.keys(data).length === 0) {
    return <p className="font-body-sm" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>No credibility data available.</p>;
  }

  return (
    <div
      className={`card-border rounded-lg ${variant === 'compact' ? 'p-3 flex items-center gap-3' : 'p-lg space-y-3'} ${className}`}
      style={{ background: 'rgb(var(--color-surface-container-low))' }}
    >
      {/* Verification Status */}
      {data.verificationStatus && (
        <VerificationSeal status={data.verificationStatus} size={variant === 'compact' ? 'sm' : 'md'} />
      )}

      {variant !== 'compact' && (
        <>
          {/* Repository Score */}
          {data.repositoryScore != null && <RepositoryScore score={data.repositoryScore} size="sm" />}

          {/* Stats */}
          <div className="flex flex-wrap gap-4">
            {data.verifiedRepos != null && (
              <div className="flex items-center gap-1.5">
                <ShieldCheck size={14} strokeWidth={1.5} style={{ color: 'rgb(var(--color-on-surface-variant))' }} />
                <span className="font-mono text-[12px] font-semibold" style={{ color: 'rgb(var(--color-primary))' }}>{data.verifiedRepos}</span>
                <span className="font-label-caps text-[9px] uppercase" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>Repos</span>
              </div>
            )}
            {data.verifiedSkills != null && (
              <div className="flex items-center gap-1.5">
                <BookOpen size={14} strokeWidth={1.5} style={{ color: 'rgb(var(--color-on-surface-variant))' }} />
                <span className="font-mono text-[12px] font-semibold" style={{ color: 'rgb(var(--color-primary))' }}>{data.verifiedSkills}</span>
                <span className="font-label-caps text-[9px] uppercase" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>Skills</span>
              </div>
            )}
          </div>

          {/* Last Verification */}
          {data.lastVerified && (
            <div className="flex items-center gap-1.5">
              <Clock size={12} strokeWidth={1.5} style={{ color: 'rgb(var(--color-on-surface-variant))' }} />
              <span className="font-mono text-[10px]" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
                Last verified: {new Date(data.lastVerified).toLocaleDateString()}
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default CredibilitySummary;
