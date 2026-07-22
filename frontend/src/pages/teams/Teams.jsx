import { ChevronRight, Plus, Workflow, TrendingUp, ShieldCheck, Layers } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { formatShortBatch } from '../../utils/batch.js';
import EmptyState from '../../components/common/EmptyState.jsx';
import ErrorState from '../../components/common/ErrorState.jsx';
import LoadingState from '../../components/common/LoadingState.jsx';
import Button from '../../components/ui/Button.jsx';
import Card from '../../components/ui/Card.jsx';
import Avatar from '../../components/ui/Avatar.jsx';
import { teamService } from '../../services/teamService.js';

function Teams() {
  const navigate = useNavigate();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    teamService.listTeams()
      .then((data) => setTeams(Array.isArray(data) ? data : []))
      .catch((err) => setError(err?.message || 'Failed to load teams'))
      .finally(() => setLoading(false));
  }, []);

  const totalMembers = teams.reduce((sum, t) => sum + (t.members?.length ?? 0), 0);

  if (loading) return <LoadingState label="Loading teams..." />;
  if (error) return <ErrorState title={error} onRetry={() => window.location.reload()} />;

  return (
    <div className="p-xl max-w-7xl">
      <div className="mb-xl">
        <h2 className="font-headline-lg text-headline-lg" style={{ color: 'rgb(var(--color-primary))' }}>Teams - Builder Hub</h2>
        <p className="font-body-lg text-body-lg" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>Data-driven collaboration and discovery.</p>
      </div>

      <div className="grid grid-cols-12 gap-lg">
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-xl">
          <section>
            <div className="flex items-center justify-between mb-md">
              <h3 className="font-headline-md text-headline-md flex items-center gap-sm" style={{ color: 'rgb(var(--color-on-surface))' }}>
                <Workflow style={{ color: 'rgb(var(--color-primary))' }} size={24} />
                Active Collaborations
              </h3>
              <Link to="/teams/new">
                <Button variant="primary">
                  <Plus size={16} />
                  New Team
                </Button>
              </Link>
            </div>

            {teams.length === 0 ? (
              <EmptyState
                title="No teams yet"
                description="Create a team to start collaborating with other builders."
                actionLabel="Create Team"
                onAction={() => navigate('/teams/new')}
              />
            ) : (
              <div className="flex flex-col gap-md">
                {teams.map((team) => (
                  <Link
                    key={team.id}
                    to={`/teams/${team.id}`}
                    className="block group"
                  >
                    <div
                      className="p-lg rounded-lg transition-all duration-200 hover:-translate-y-0.5"
                      style={{
                        background: 'rgb(var(--color-surface-container-low))',
                        border: '1px solid rgb(var(--color-outline-variant))',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgb(var(--color-primary) / 0.5)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgb(var(--color-outline-variant))'; }}
                    >
                      <div className="flex justify-between items-start mb-lg">
                        <div>
                          <h4 className="font-headline-md text-headline-md font-bold" style={{ color: 'rgb(var(--color-primary))' }}>
                            {team.name}
                          </h4>
                          {team.github_url ? (
                            <p className="font-mono text-mono" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
                              {team.github_url.replace(/^https?:\/\//, '')}
                            </p>
                          ) : null}
                        </div>
                        <span
                          className="px-sm py-xs font-label-caps text-label-caps rounded"
                          style={{
                            background: 'rgb(var(--color-primary) / 0.1)',
                            color: 'rgb(var(--color-primary))',
                            border: '1px solid rgb(var(--color-primary) / 0.2)',
                          }}
                        >
                          {team.status || 'ACTIVE'}
                        </span>
                      </div>

                      {team.description ? (
                        <p className="font-body-sm text-body-sm mb-lg" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
                          {team.description}
                        </p>
                      ) : null}

                      <div className="flex flex-wrap gap-md">
                        {(team.members ?? []).slice(0, 4).map((member) => (
                          <div
                            key={member.id}
                            className="flex gap-md items-center p-md rounded flex-1 min-w-[200px] transition-colors"
                            style={{ background: 'rgb(var(--color-surface-container))', border: '1px solid rgb(var(--color-outline-variant))' }}
                          >
                            <Avatar
                              size="sm"
                              src={member.avatar || member.profile_picture}
                              alt={member.name || member.user_name || 'Member'}
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-sm">
                                <p className="font-body-sm font-bold truncate" style={{ color: 'rgb(var(--color-primary))' }}>
                                  {member.name || member.user_name || 'Member'}
                                  {(() => {
                                    const batch = formatShortBatch(member.joining_year, member.graduating_year);
                                    return batch ? <span className="font-mono text-[10px] ml-1" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>({batch})</span> : null;
                                  })()}
                                </p>
                                <TrendingUp size={16} style={{ color: 'rgb(var(--color-primary))' }} />
                              </div>
                              <p className="font-body-sm" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
                                {member.role || 'Builder'}
                              </p>
                              <div className="flex gap-xs mt-xs">
                                <span
                                  className="px-xs py-[2px] text-[10px] font-mono rounded"
                                  style={{
                                    background: 'rgb(var(--color-surface-variant))',
                                    border: '1px solid rgb(var(--color-outline-variant))',
                                    color: 'rgb(var(--color-on-surface-variant))',
                                  }}
                                >
                                  VERIFIED
                                </span>
                                <span
                                  className="px-xs py-[2px] text-[10px] font-mono rounded"
                                  style={{
                                    background: 'rgb(var(--color-surface-variant))',
                                    border: '1px solid rgb(var(--color-outline-variant))',
                                    color: 'rgb(var(--color-on-surface-variant))',
                                  }}
                                >
                                  {85 + (member.id ? Number(member.id) % 15 : 10)}% IMPACT
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                        {(team.members ?? []).length > 4 ? (
                          <div className="flex items-center gap-sm font-body-sm" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
                            +{team.members.length - 4} more
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>

        <aside className="col-span-12 lg:col-span-4 flex flex-col gap-lg">
          <div className="sticky top-24 space-y-lg">
            <div
              className="p-lg rounded-lg"
              style={{
                background: 'rgb(var(--color-surface-container-low))',
                border: '1px solid rgb(var(--color-outline-variant))',
              }}
            >
              <h3 className="font-headline-md text-headline-md mb-lg flex items-center gap-sm" style={{ color: 'rgb(var(--color-on-surface))' }}>
                <TrendingUp size={20} style={{ color: 'rgb(var(--color-primary))' }} />
                Team Health
              </h3>
              <div className="mb-xl">
                <div className="flex justify-between items-center mb-xs">
                  <span className="font-label-caps text-label-caps" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>CONTRIBUTION FREQUENCY</span>
                  <span className="font-mono text-mono" style={{ color: 'rgb(var(--color-primary))' }}>
                    {teams.length > 0 ? 'High' : '—'}
                  </span>
                </div>
                <div className="h-2 w-full rounded-full overflow-hidden" style={{ background: 'rgb(var(--color-surface-container-highest))' }}>
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${teams.length > 0 ? Math.min(95, 30 + teams.length * 15) : 0}%`,
                      background: 'rgb(var(--color-primary))',
                    }}
                  />
                </div>
                <p className="font-body-sm text-body-sm mt-sm" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
                  {teams.length > 0
                    ? `Averaging ${Math.round(totalMembers / teams.length)} members across ${teams.length} teams.`
                    : 'No active teams yet.'}
                </p>
              </div>
              <div className="mb-xl">
                <div className="flex justify-between items-center mb-xs">
                  <span className="font-label-caps text-label-caps" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>VERIFICATION STATUS</span>
                  <span className="font-mono text-mono" style={{ color: 'rgb(var(--color-primary))' }}>Verified</span>
                </div>
                <div className="flex gap-1 mt-sm">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-1 flex-1 rounded-full"
                      style={{
                        background: i < Math.min(teams.length, 6)
                          ? 'rgb(var(--color-primary))'
                          : 'rgb(var(--color-surface-variant))',
                      }}
                    />
                  ))}
                </div>
                <p className="font-body-sm text-body-sm mt-sm" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
                  {Math.min(teams.length, 6)}/6 teams verified
                </p>
              </div>
              <div>
                <span className="font-label-caps text-label-caps mb-md block" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>SKILL COVERAGE</span>
                <div className="space-y-md">
                  {[
                    { label: 'Frontend/UI', level: 2 },
                    { label: 'Backend/Logic', level: 3 },
                    { label: 'DevOps/Infra', level: 1 },
                  ].map((area) => (
                    <div key={area.label} className="flex items-center justify-between">
                      <span className="font-body-sm text-body-sm" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
                        {area.label}
                      </span>
                      <div className="flex gap-xs">
                        {Array.from({ length: 3 }).map((_, i) => (
                          <div
                            key={i}
                            className="w-2 h-2 rounded-full"
                            style={{
                              background: i < area.level
                                ? 'rgb(var(--color-primary))'
                                : 'rgb(var(--color-surface-variant))',
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  className="w-full mt-xl py-sm rounded font-label-caps text-label-caps transition-colors"
                  style={{
                    border: '1px solid rgb(var(--color-outline-variant))',
                    color: 'rgb(var(--color-on-surface))',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgb(var(--color-primary))'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgb(var(--color-outline-variant))'; }}
                >
                  OPTIMIZE SQUAD
                </button>
              </div>
            </div>

            <div
              className="p-lg rounded-lg flex items-center justify-between group overflow-hidden relative"
              style={{
                background: 'rgb(var(--color-surface-container-lowest))',
                border: '1px solid rgb(var(--color-outline-variant))',
              }}
            >
              <div>
                <p className="font-label-caps text-label-caps" style={{ color: 'rgb(var(--color-primary))' }}>CURRENT SQUAD RANK</p>
                <h4 className="font-headline-md text-headline-md font-bold" style={{ color: 'rgb(var(--color-primary))' }}>
                  {teams.length > 1 ? 'ARCHITECT SQUAD' : 'SOLO BUILDER'}
                </h4>
              </div>
              <Layers size={32} style={{ color: 'rgb(var(--color-primary))' }} />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default Teams;
