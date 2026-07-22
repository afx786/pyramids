import { Check, LayoutGrid, MessageSquare, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ErrorState from '../../components/common/ErrorState.jsx';
import LoadingState from '../../components/common/LoadingState.jsx';
import ProjectCard from '../../components/common/ProjectCard.jsx';
import VerifiedSkills from '../../components/evidence/VerifiedSkills.jsx';
import Avatar from '../../components/ui/Avatar.jsx';
import Button from '../../components/ui/Button.jsx';
import Card from '../../components/ui/Card.jsx';
import SkillTag from '../../components/ui/SkillTag.jsx';
import { formatBatch, formatShortBatch } from '../../utils/batch.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { connectionService } from '../../services/connectionService.js';
import { messageService } from '../../services/messageService.js';
import { userService } from '../../services/userService.js';

function Profile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, profile, rankData } = useAuth();
  const [otherProfile, setOtherProfile] = useState(null);
  const [otherRank, setOtherRank] = useState(null);
  const [loading, setLoading] = useState(false);
  const [actionError, setActionError] = useState('');
  const [requestSent, setRequestSent] = useState(false);

  const isOwnProfile = !id || String(user?.id) === String(id);
  const userId = isOwnProfile ? user?.id : id;

  useEffect(() => {
    if (!userId || isOwnProfile) return;
    setLoading(true);
    Promise.all([
      userService.getProfile(userId),
      userService.getRank(userId),
    ])
      .then(([p, r]) => { setOtherProfile(p); setOtherRank(r); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [userId]);

  const displayUser = isOwnProfile
    ? (profile?.user ?? user)
    : (otherProfile?.user ?? { name: 'User', id: userId });

  const displaySkills = isOwnProfile
    ? (profile?.skills ?? [])
    : (otherProfile?.skills ?? []);

  const displayProjects = isOwnProfile
    ? (profile?.projects ?? [])
    : (otherProfile?.projects ?? []);

  const displayRank = isOwnProfile
    ? rankData
    : otherRank;

  const displayStats = isOwnProfile
    ? (profile?.statistics ?? {})
    : (otherProfile?.statistics ?? {});

  function handleConnect() {
    setRequestSent(true);
    connectionService.sendRequest(userId).catch((err) => { setActionError(err.message); setRequestSent(false); });
  }

  function handleMessage() {
    navigate('/messages');
    messageService.startConversation(userId).catch(() => {});
  }

  if (loading) return <LoadingState label="Loading profile..." />;

  if (!isOwnProfile && !otherProfile) {
    return (
      <div className="p-xl max-w-[1200px] mx-auto">
        <Card className="p-xl text-center">
          <p className="font-body-sm" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>User not found.</p>
        </Card>
      </div>
    );
  }

  const rankName = displayRank?.rank || 'Builder';
  const repoScores = displayProjects.map((p) => p.repository_score ?? p.repo_score ?? 0).filter(Boolean);
  const avgScore = repoScores.length > 0 ? (repoScores.reduce((a, b) => a + b, 0) / repoScores.length) : 0;

  const RANK_TIERS = [
    { name: 'Explorer', icon: '○' },
    { name: 'Builder', icon: '□' },
    { name: 'Architect', icon: '⊞' },
    { name: 'Innovator', icon: '△' },
    { name: 'Pyramidion', icon: '◇' },
  ];
  const currentRankIdx = RANK_TIERS.findIndex((r) => r.name === rankName);

  return (
    <div className="p-xl max-w-[1200px] mx-auto w-full">
      <section
        className="mb-3xl flex flex-col md:flex-row gap-2xl relative overflow-hidden p-2xl rounded-xl"
        style={{
          background: 'rgb(var(--color-surface-container-lowest))',
          border: '1px solid rgb(var(--color-outline-variant))',
        }}
      >
        <div className="relative z-10 flex flex-col gap-md">
          <div className="flex items-center gap-md">
            {displayUser?.created_at ? (
              <span
                className="font-label-caps text-label-caps px-md py-1 rounded-full font-semibold"
                style={{
                  background: 'rgb(var(--color-surface-container-highest))',
                  border: '1px solid rgb(var(--color-outline-variant))',
                  color: 'rgb(var(--color-on-surface))',
                }}
              >
                MEMBER SINCE {new Date(displayUser.created_at).getFullYear()}
              </span>
            ) : null}
            <div className="flex items-center gap-xs" style={{ color: 'rgb(var(--color-secondary))' }}>
              <LayoutGrid size={16} />
              <span className="font-label-caps text-label-caps uppercase tracking-widest">{rankName} Rank</span>
            </div>
          </div>
          <div className="flex items-center gap-lg">
            <Avatar src={displayUser?.profile_picture} alt={displayUser?.name} size="lg" className="shrink-0" />
            <div>
              <h2 className="font-display-serif text-display-serif leading-none" style={{ color: 'rgb(var(--color-primary))' }}>
                {displayUser?.name ?? 'Builder'}
              </h2>
              {(() => {
                const batch = formatBatch(displayUser?.joining_year, displayUser?.graduating_year);
                return batch ? (
                  <span className="font-mono-label text-xs block mt-1" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
                    Batch {batch}
                  </span>
                ) : null;
              })()}
            </div>
          </div>
          <p className="font-body-lg text-body-lg max-w-xl" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
            {displayUser?.headline || displayUser?.bio || 'Builder'}
          </p>
        </div>
        <div className="md:ml-auto relative z-10 text-right flex flex-col items-end gap-md shrink-0">
          <div className="flex flex-col items-end">
            {displayRank?.verified ? (
              <>
                <div className="flex items-center gap-xs mb-xs" style={{ color: 'rgb(var(--color-primary))' }}>
                  <Check size={16} />
                  <span className="font-label-caps text-label-caps tracking-[0.2em] uppercase">Verified by Pyramids</span>
                </div>
                <div
                  className="w-32 h-px"
                  style={{ background: 'linear-gradient(to left, rgb(var(--color-primary)), transparent)' }}
                />
              </>
            ) : null}
          </div>
          <div className="flex flex-col items-end" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
            {displayUser?.public_id ? (
              <span className="font-mono text-[11px] tracking-tight">{displayUser.public_id}</span>
            ) : displayUser?.id ? (
              <span className="font-mono text-body-sm">ID: {String(displayUser.id).padStart(8, '0').slice(0, 8)}...</span>
            ) : null}
            <span className="font-mono text-body-sm">Trust Score: {Math.min(100, Math.round(avgScore * 10 + 50))}%</span>
          </div>
          {!isOwnProfile ? (
            <div className="flex gap-md mt-md">
              <Button variant="secondary" onClick={handleMessage}>
                <MessageSquare size={16} />
                Message
              </Button>
              <Button onClick={handleConnect} disabled={requestSent}>
                {requestSent ? 'Requested' : 'Connect'}
              </Button>
            </div>
          ) : null}
        </div>
      </section>

      {actionError ? (
        <div
          className="mb-xl rounded-lg px-lg py-sm font-body-sm font-semibold"
          style={{ background: 'rgb(var(--color-error-container))', color: 'rgb(var(--color-on-error-container))' }}
        >
          {actionError}
        </div>
      ) : null}

      <div className="grid grid-cols-12 gap-xl">
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-xl">
          <div className="grid grid-cols-3 gap-lg">
            <div
              className="p-lg rounded-xl flex flex-col gap-xs"
              style={{
                background: 'rgb(var(--color-surface-container-low))',
                border: '1px solid rgb(var(--color-outline-variant))',
              }}
            >
              <span className="font-label-caps text-label-caps uppercase" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
                Verified Repositories
              </span>
              <span className="font-headline-lg text-headline-lg font-bold" style={{ color: 'rgb(var(--color-primary))' }}>
                {displayStats.total_projects ?? displayRank?.projects_count ?? displayProjects.length}
              </span>
              <div className="w-full h-1 rounded-full mt-sm" style={{ background: 'rgb(var(--color-surface-container-high))' }}>
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.min(100, (displayProjects.length) * 15)}%`,
                    background: 'rgb(var(--color-primary))',
                  }}
                />
              </div>
            </div>
            <div
              className="p-lg rounded-xl flex flex-col gap-xs"
              style={{
                background: 'rgb(var(--color-surface-container-low))',
                border: '1px solid rgb(var(--color-outline-variant))',
              }}
            >
              <span className="font-label-caps text-label-caps uppercase" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
                Avg. Repo Score
              </span>
              <span className="font-headline-lg text-headline-lg font-bold" style={{ color: 'rgb(var(--color-primary))' }}>
                {avgScore > 0 ? avgScore.toFixed(1) : '—'}<span className="font-body-lg font-medium" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>{avgScore > 0 ? '/10' : ''}</span>
              </span>
              <div className="w-full h-1 rounded-full mt-sm" style={{ background: 'rgb(var(--color-surface-container-high))' }}>
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.min(100, avgScore * 10)}%`,
                    background: 'rgb(var(--color-primary))',
                  }}
                />
              </div>
            </div>
            <div
              className="p-lg rounded-xl flex flex-col gap-xs"
              style={{
                background: 'rgb(var(--color-surface-container-low))',
                border: '1px solid rgb(var(--color-outline-variant))',
              }}
            >
              <span className="font-label-caps text-label-caps uppercase" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
                Verified Skills
              </span>
              <span className="font-headline-lg text-headline-lg font-bold" style={{ color: 'rgb(var(--color-primary))' }}>
                {displaySkills.length}
              </span>
              <div className="w-full h-1 rounded-full mt-sm" style={{ background: 'rgb(var(--color-surface-container-high))' }}>
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.min(100, displaySkills.length * 5)}%`,
                    background: 'rgb(var(--color-primary))',
                  }}
                />
              </div>
            </div>
          </div>

          {displayProjects.length > 0 ? (
            <div className="flex flex-col gap-lg">
              <div className="flex justify-between items-end">
                <h3 className="font-headline-md text-headline-md font-bold" style={{ color: 'rgb(var(--color-primary))' }}>
                  {isOwnProfile ? 'Your' : 'Verified'} Projects
                </h3>
                <Link
                  to="/projects"
                  className="font-label-caps text-label-caps underline underline-offset-4 hover:text-primary transition-colors"
                  style={{ color: 'rgb(var(--color-on-surface-variant))' }}
                >
                  VIEW FULL CATALOG
                </Link>
              </div>
              <div className="space-y-lg">
                {displayProjects.map((project) => (
                  <ProjectCard key={project.id} project={{
                    id: project.id,
                    title: project.title,
                    description: project.description,
                    creator: displayUser?.name ?? 'Builder',
                    avatar: displayUser?.profile_picture,
                    stack: project.skills ?? [],
                    member_count: project.member_count,
                  }} />
                ))}
              </div>
            </div>
          ) : null}

          {displaySkills.length > 0 ? (
            <div className="flex flex-col gap-lg">
              <h3 className="font-headline-md text-headline-md font-bold" style={{ color: 'rgb(var(--color-primary))' }}>
                Skills
              </h3>
              <div className="flex flex-wrap gap-sm">
                {displaySkills.map((skill) => (
                  <SkillTag key={skill}>{skill}</SkillTag>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <div className="col-span-12 lg:col-span-4 flex flex-col gap-xl">
          <div
            className="p-lg rounded-xl flex flex-col gap-lg"
            style={{
              background: 'rgb(var(--color-surface-container-low))',
              border: '1px solid rgb(var(--color-outline-variant))',
            }}
          >
            <div className="flex justify-between items-center">
              <h4 className="font-headline-md text-headline-md font-bold" style={{ color: 'rgb(var(--color-primary))' }}>Rank Progression</h4>
              <TrendingUp size={20} style={{ color: 'rgb(var(--color-on-surface-variant))' }} />
            </div>
            <div className="flex flex-col gap-md">
              {RANK_TIERS.map((tier, idx) => {
                const isCurrent = idx === currentRankIdx;
                const isPast = idx < currentRankIdx;
                return (
                  <div
                    key={tier.name}
                    className="flex items-center gap-md"
                    style={{
                      opacity: isPast ? 0.4 : isCurrent ? 1 : 0.2,
                    }}
                  >
                    <div
                      className="flex items-center justify-center"
                      style={{
                        color: isCurrent ? 'rgb(var(--color-primary))' : 'rgb(var(--color-on-surface-variant))',
                      }}
                    >
                      {isCurrent ? (
                        <span className="font-headline-md text-headline-md">{tier.icon}</span>
                      ) : (
                        <span className="font-body-sm">{tier.icon}</span>
                      )}
                    </div>
                    <span
                      className="font-body-sm text-body-sm"
                      style={{
                        color: isCurrent ? 'rgb(var(--color-primary))' : 'rgb(var(--color-on-surface-variant))',
                        fontWeight: isCurrent ? 700 : 400,
                      }}
                    >
                      {tier.name}
                    </span>
                    {isCurrent ? (
                      <span
                        className="ml-auto px-sm py-xs rounded text-[10px] font-bold"
                        style={{
                          background: 'rgb(var(--color-surface-container-high))',
                          border: '1px solid rgb(var(--color-outline-variant))',
                          color: 'rgb(var(--color-primary))',
                        }}
                      >
                        CURRENT
                      </span>
                    ) : null}
                  </div>
                );
              })}
            </div>
            {currentRankIdx < RANK_TIERS.length - 1 ? (
              <div className="pt-lg" style={{ borderTop: '1px solid rgb(var(--color-outline-variant) / 0.3)' }}>
                <p className="font-body-sm text-body-sm mb-sm" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
                  Next milestone: <strong style={{ color: 'rgb(var(--color-primary))' }}>{RANK_TIERS[currentRankIdx + 1].name}</strong>
                </p>
                <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'rgb(var(--color-surface-container-high))' }}>
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.min(100, (displayRank?.points ?? 0) / 10)}%`,
                      background: 'linear-gradient(to right, rgb(var(--color-primary) / 0.5), rgb(var(--color-primary)))',
                    }}
                  />
                </div>
              </div>
            ) : null}
          </div>

          <div
            className="p-lg rounded-xl flex flex-col gap-lg"
            style={{
              background: 'rgb(var(--color-surface-container-low))',
              border: '1px solid rgb(var(--color-outline-variant))',
            }}
          >
            <h4 className="font-headline-md text-headline-md font-bold" style={{ color: 'rgb(var(--color-primary))' }}>Reputation Metrics</h4>
            <div className="space-y-md">
              <div className="flex justify-between items-center">
                <span className="font-body-sm text-body-sm" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>Code Solidity</span>
                <span className="font-mono text-body-sm font-bold" style={{ color: 'rgb(var(--color-primary))' }}>{avgScore > 0 ? `${(avgScore * 9 + 10).toFixed(1)}%` : '—'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-body-sm text-body-sm" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>Collaboration Index</span>
                <span className="font-mono text-body-sm font-bold" style={{ color: 'rgb(var(--color-primary))' }}>
                  {displayProjects.length > 0 ? (0.5 + (displayProjects.length * 0.05)).toFixed(2) : '—'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-body-sm text-body-sm" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>System Impact</span>
                <span className="font-mono text-body-sm font-bold" style={{ color: 'rgb(var(--color-primary))' }}>
                  {displayRank?.points > 500 ? 'High' : displayRank?.points > 100 ? 'Medium' : 'Low'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-body-sm text-body-sm" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>Review Precision</span>
                <span className="font-mono text-body-sm font-bold" style={{ color: 'rgb(var(--color-primary))' }}>{avgScore > 0 ? `${Math.min(99, Math.round(avgScore * 9 + 10))}%` : '—'}</span>
              </div>
            </div>
          </div>

          {displaySkills.length > 0 ? (
            <div
              className="p-lg rounded-xl flex flex-col gap-lg"
              style={{
                background: 'rgb(var(--color-surface-container-low))',
                border: '1px solid rgb(var(--color-outline-variant))',
              }}
            >
              <h4 className="font-headline-md text-headline-md font-bold" style={{ color: 'rgb(var(--color-primary))' }}>Verified Skills</h4>
              <div className="flex flex-wrap gap-sm">
                {displaySkills.slice(0, 10).map((skill, idx) => {
                  const level = Math.min(10, Math.max(1, 10 - idx));
                  return (
                    <div key={skill} className="flex flex-col gap-1 w-full">
                      <div className="flex justify-between font-mono text-[11px] uppercase" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
                        <span>{skill}</span>
                        <span>Lvl {level}</span>
                      </div>
                      <div className="w-full h-px" style={{ background: level >= 8 ? 'rgb(var(--color-primary))' : `rgb(var(--color-primary) / ${0.3 + (level * 0.07)})` }} />
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null}

          <div
            className="p-lg rounded-xl flex flex-col gap-md"
            style={{
              background: 'rgb(var(--color-surface-container))',
              border: '1px solid rgb(var(--color-primary) / 0.2)',
            }}
          >
            <div className="flex items-center gap-md">
              <div className="w-2 h-2 rounded-full" style={{ background: 'rgb(var(--color-primary))', animation: 'pulse 2s infinite' }} />
              <span className="font-body-sm text-body-sm font-bold" style={{ color: 'rgb(var(--color-primary))' }}>Open to Collaborate</span>
            </div>
            <p className="font-body-sm text-body-sm" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
              Currently seeking high-performance engineering teams.
            </p>
            {!isOwnProfile ? (
              <Button variant="secondary" className="w-full" onClick={handleConnect} disabled={requestSent}>
                {requestSent ? 'Requested' : 'Request Connection'}
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
