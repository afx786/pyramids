import { ChevronRight, Plus, Users, Workflow, TrendingUp, ShieldCheck, Layers, X, Hash, Search, UserPlus } from 'lucide-react';
import { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { formatShortBatch } from '../../utils/batch.js';
import EmptyState from '../../components/common/EmptyState.jsx';
import ErrorState from '../../components/common/ErrorState.jsx';
import LoadingState from '../../components/common/LoadingState.jsx';
import Button from '../../components/ui/Button.jsx';
import Card from '../../components/ui/Card.jsx';
import Avatar from '../../components/ui/Avatar.jsx';
import Input from '../../components/ui/Input.jsx';
import { teamService } from '../../services/teamService.js';

const AVATAR_COLORS = [
  '#E57373', '#64B5F6', '#81C784', '#FFB74D', '#BA68C8',
  '#4DB6AC', '#FF8A65', '#A1887F', '#90A4AE', '#F06292',
];

function getInitials(name) {
  if (!name) return '?';
  return name.split(/\s+/).map((w) => w[0]).join('').toUpperCase().slice(0, 2);
}

function getAvatarColor(id) {
  return AVATAR_COLORS[(id || 0) % AVATAR_COLORS.length];
}

function AvatarStack({ members, max = 4 }) {
  const visible = (members || []).slice(0, max);
  const remaining = (members || []).length - max;

  return (
    <div className="flex items-center">
      <div className="flex -space-x-2">
        {visible.map((m, i) => (
          m.avatar ? (
            <img
              key={m.id}
              src={m.avatar}
              alt={m.name || 'Member'}
              className="h-8 w-8 rounded-full object-cover border-2"
              style={{ borderColor: 'rgb(var(--color-surface))', zIndex: max - i }}
            />
          ) : (
            <div
              key={m.id}
              className="h-8 w-8 rounded-full flex items-center justify-center text-[10px] font-bold border-2"
              style={{
                background: getAvatarColor(m.id),
                color: '#fff',
                borderColor: 'rgb(var(--color-surface))',
                zIndex: max - i,
              }}
              title={m.name || 'Member'}
            >
              {getInitials(m.name)}
            </div>
          )
        ))}
      </div>
      {remaining > 0 ? (
        <span className="ml-2 text-xs font-semibold" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
          +{remaining}
        </span>
      ) : null}
    </div>
  );
}

function CountdownTimer({ targetDate }) {
  const [display, setDisplay] = useState('');

  useEffect(() => {
    function update() {
      if (!targetDate) { setDisplay(''); return; }
      const now = new Date();
      const target = new Date(targetDate);
      const diff = target - now;

      if (diff <= 0) { setDisplay('Registration Closed'); return; }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);

      if (days > 7) setDisplay(`Registration closes in ${days} days`);
      else if (days > 1) setDisplay(`Registration closes in ${days} days`);
      else if (days === 1) setDisplay(`Registration closes tomorrow`);
      else if (hours >= 1) setDisplay(`Registration closes in ${hours} hours`);
      else setDisplay(`Registration closes today`);
    }

    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, [targetDate]);

  if (!display) return null;
  return display === 'Registration Closed' ? (
    <span className="text-xs font-semibold" style={{ color: 'rgb(var(--color-error))' }}>Registration Closed</span>
  ) : (
    <span className="text-xs font-semibold" style={{ color: 'rgb(var(--color-primary))' }}>{display}</span>
  );
}

function Teams() {
  const navigate = useNavigate();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [inviteCode, setInviteCode] = useState('');
  const [joinLoading, setJoinLoading] = useState(false);
  const [joinError, setJoinError] = useState('');
  const [joinSuccess, setJoinSuccess] = useState('');

  const [discoverTeams, setDiscoverTeams] = useState([]);
  const [discoverLoading, setDiscoverLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [purposeFilter, setPurposeFilter] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    setLoading(true);
    setError(null);
    teamService.listTeams()
      .then((data) => setTeams(Array.isArray(data) ? data : []))
      .catch((err) => setError(err?.message || 'Failed to load teams'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setDiscoverLoading(true);
    teamService.discoverTeams({ q: searchQuery, purpose: purposeFilter, sort: sortBy })
      .then((data) => setDiscoverTeams(Array.isArray(data?.items) ? data.items : []))
      .catch(() => {})
      .finally(() => setDiscoverLoading(false));
  }, [searchQuery, purposeFilter, sortBy]);

  const totalMembers = teams.reduce((sum, t) => sum + (t.members?.length ?? 0), 0);

  async function handleJoinByCode() {
    const code = inviteCode.trim();
    if (!code) return;
    setJoinLoading(true);
    setJoinError('');
    setJoinSuccess('');
    try {
      const result = await teamService.joinByCode(code);
      setJoinSuccess(result.message || 'Join request sent!');
      setInviteCode('');
      setTimeout(() => { setShowJoinModal(false); setJoinSuccess(''); }, 2000);
    } catch (err) {
      setJoinError(err.message || 'Failed to join team');
    } finally {
      setJoinLoading(false);
    }
  }

  function isTeamFull(team) {
    return team.hackathon?.team_size_max && (team.members?.length || 0) >= team.hackathon.team_size_max;
  }

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
              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => { setShowJoinModal(true); setInviteCode(''); setJoinError(''); setJoinSuccess(''); }}>
                  <Hash size={16} />
                  Join by Code
                </Button>
                <Link to="/teams/new">
                  <Button variant="primary">
                    <Plus size={16} />
                    New Team
                  </Button>
                </Link>
              </div>
            </div>

            {teams.length === 0 ? (
              <EmptyState
                icon={Users}
                title="No Teams Yet"
                description="Create a team to collaborate."
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
                        <div className="flex-1 min-w-0">
                          <h4 className="font-headline-md text-headline-md font-bold truncate" style={{ color: 'rgb(var(--color-primary))' }}>
                            {team.name}
                          </h4>
                          {team.purpose ? (
                            <span className="font-mono text-[10px]" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
                              {team.purpose === 'hackathon' ? (team.hackathon?.title || 'Hackathon') : (team.research_project?.title || 'Research')}
                            </span>
                          ) : null}
                        </div>
                        <div className="flex items-center gap-2 shrink-0 ml-3">
                          {isTeamFull(team) ? (
                            <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded" style={{ background: 'rgb(var(--color-error) / 0.1)', color: 'rgb(var(--color-error))', border: '1px solid rgb(var(--color-error) / 0.3)' }}>
                              TEAM FULL
                            </span>
                          ) : null}
                          <span
                            className="px-sm py-xs font-label-caps text-label-caps rounded"
                            style={{
                              background: 'rgb(var(--color-primary) / 0.1)',
                              color: 'rgb(var(--color-primary))',
                              border: '1px solid rgb(var(--color-primary) / 0.2)',
                            }}
                          >
                            {team.purpose ? team.purpose.toUpperCase() : (team.status || 'ACTIVE')}
                          </span>
                        </div>
                      </div>

                      {team.description ? (
                        <p className="font-body-sm text-body-sm mb-lg line-clamp-2" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
                          {team.description}
                        </p>
                      ) : null}

                      <div className="flex items-center justify-between">
                        <AvatarStack members={team.members} max={4} />
                        <span className="text-xs font-semibold" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
                          {team.members?.length ?? 0}
                          {team.hackathon?.team_size_max ? ` / ${team.hackathon.team_size_max}` : ''} Members
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>

          <section>
            <div className="flex items-center justify-between mb-md flex-wrap gap-3">
              <h3 className="font-headline-md text-headline-md flex items-center gap-sm" style={{ color: 'rgb(var(--color-on-surface))' }}>
                <Users style={{ color: 'rgb(var(--color-primary))' }} size={24} />
                Looking for Members
              </h3>
              <div className="flex gap-2 flex-wrap">
                <select
                  className="text-xs rounded-lg px-3 py-1.5"
                  style={{ background: 'rgb(var(--color-surface-container))', border: '1px solid rgb(var(--color-outline-variant))', color: 'rgb(var(--color-on-surface))' }}
                  value={purposeFilter}
                  onChange={(e) => setPurposeFilter(e.target.value)}
                  aria-label="Filter by purpose"
                >
                  <option value="">All Purposes</option>
                  <option value="hackathon">Hackathon</option>
                  <option value="research">Research</option>
                </select>
                <select
                  className="text-xs rounded-lg px-3 py-1.5"
                  style={{ background: 'rgb(var(--color-surface-container))', border: '1px solid rgb(var(--color-outline-variant))', color: 'rgb(var(--color-on-surface))' }}
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  aria-label="Sort teams"
                >
                  <option value="newest">Recently Created</option>
                  <option value="oldest">Oldest</option>
                  <option value="most_needed">Most Members Needed</option>
                  <option value="closing_soon">Registration Closing Soon</option>
                  <option value="highest_prize">Highest Prize Pool</option>
                  <option value="newest_hackathons">Newest Hackathons</option>
                  <option value="oldest_hackathons">Oldest Hackathons</option>
                </select>
                <div className="relative">
                  <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: 'rgb(var(--color-on-surface-variant))' }} />
                  <input
                    type="text"
                    placeholder="Search teams..."
                    className="text-xs rounded-lg pl-8 pr-3 py-1.5 w-44"
                    style={{ background: 'rgb(var(--color-surface-container))', border: '1px solid rgb(var(--color-outline-variant))', color: 'rgb(var(--color-on-surface))' }}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    aria-label="Search teams"
                  />
                </div>
              </div>
            </div>

            {discoverLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="p-md rounded-lg animate-pulse" style={{ background: 'rgb(var(--color-surface-container-low))', border: '1px solid rgb(var(--color-outline-variant))' }}>
                    <div className="h-4 w-3/4 rounded mb-3" style={{ background: 'rgb(var(--color-surface-variant))' }} />
                    <div className="h-3 w-full rounded mb-2" style={{ background: 'rgb(var(--color-surface-variant))' }} />
                    <div className="h-3 w-1/2 rounded" style={{ background: 'rgb(var(--color-surface-variant))' }} />
                  </div>
                ))}
              </div>
            ) : discoverTeams.length === 0 ? (
              <div className="p-xl rounded-xl text-center" style={{ background: 'rgb(var(--color-surface-container-low))', border: '1px solid rgb(var(--color-outline-variant))' }}>
                <Users size={40} className="mx-auto mb-4" style={{ color: 'rgb(var(--color-on-surface-variant) / 0.5)' }} />
                <h4 className="font-headline-md text-headline-md mb-2" style={{ color: 'rgb(var(--color-on-surface))' }}>
                  No teams are currently looking for members.
                </h4>
                <p className="text-sm mb-6 max-w-md mx-auto" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
                  {searchQuery || purposeFilter || sortBy !== 'newest'
                    ? 'Try adjusting your filters or search query.'
                    : 'Be the first builder to create a team and start recruiting collaborators.'}
                </p>
                <div className="flex justify-center gap-3">
                  <Button variant="primary" onClick={() => navigate('/teams/new')}>
                    <Plus size={16} /> Create Team
                  </Button>
                  <Button variant="secondary" onClick={() => navigate('/hackathons')}>
                    Browse Hackathons
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
                {discoverTeams.map((team) => (
                  <div
                    key={team.id}
                    className="p-md rounded-lg transition-all duration-200 hover:-translate-y-0.5 cursor-pointer flex flex-col"
                    style={{
                      background: 'rgb(var(--color-surface-container-low))',
                      border: '1px solid rgb(var(--color-outline-variant))',
                    }}
                    onClick={() => navigate(`/teams/${team.id}`)}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgb(var(--color-primary) / 0.5)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgb(var(--color-outline-variant))'; }}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter') navigate(`/teams/${team.id}`); }}
                    aria-label={`View team ${team.name}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-bold text-sm truncate flex-1" style={{ color: 'rgb(var(--color-primary))' }}>{team.name}</h4>
                      <div className="flex items-center gap-1.5 shrink-0 ml-2">
                        {isTeamFull(team) ? (
                          <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold rounded" style={{ background: 'rgb(var(--color-error) / 0.1)', color: 'rgb(var(--color-error))', border: '1px solid rgb(var(--color-error) / 0.3)' }}>
                            FULL
                          </span>
                        ) : null}
                        {team.purpose ? (
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded" style={{ background: 'rgb(var(--color-surface-variant))', color: 'rgb(var(--color-on-surface-variant))' }}>
                            {team.purpose === 'hackathon' ? 'HACK' : 'RSCH'}
                          </span>
                        ) : null}
                      </div>
                    </div>
                    {team.description ? (
                      <p className="text-xs mb-2 line-clamp-2 flex-1" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>{team.description}</p>
                    ) : <div className="flex-1" />}
                    {team.looking_for && team.looking_for.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {team.looking_for.slice(0, 3).map((role) => (
                          <span
                            key={role}
                            className="px-2 py-0.5 text-[9px] font-semibold rounded-full"
                            style={{
                              background: 'rgb(var(--color-primary) / 0.1)',
                              color: 'rgb(var(--color-primary))',
                              border: '1px solid rgb(var(--color-primary) / 0.2)',
                            }}
                          >
                            {role}
                          </span>
                        ))}
                        {team.looking_for.length > 3 ? (
                          <span className="text-[9px] px-1.5 py-0.5 font-mono" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
                            +{team.looking_for.length - 3}
                          </span>
                        ) : null}
                      </div>
                    ) : null}
                    <div className="flex items-center justify-between mt-auto pt-2 border-t" style={{ borderColor: 'rgb(var(--color-outline-variant))' }}>
                      <AvatarStack members={team.members} max={3} />
                      <div className="flex items-center gap-2 text-xs" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
                        {team.hackathon?.end_date ? <CountdownTimer targetDate={team.hackathon.end_date} /> : null}
                        <span className="font-semibold">{team.members?.length ?? 0}</span>
                      </div>
                    </div>
                  </div>
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
      {showJoinModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgb(0 0 0 / 0.5)' }} role="dialog" aria-modal="true" aria-label="Join team by code">
          <div className="w-full max-w-md rounded-xl p-6 relative" style={{ background: 'rgb(var(--color-surface-container-high))' }}>
            <button type="button" onClick={() => setShowJoinModal(false)} className="absolute top-4 right-4" style={{ color: 'rgb(var(--color-on-surface-variant))' }} aria-label="Close modal">
              <X size={20} />
            </button>
            <h3 className="font-headline-md text-headline-md mb-1" style={{ color: 'rgb(var(--color-primary))' }}>Join Team by Code</h3>
            <p className="text-sm mb-4" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
              Enter a team's invite code to send a join request.
            </p>
            <Input
              placeholder="e.g. PYR-TEAM-A1B2C3"
              value={inviteCode}
              onChange={(e) => { setInviteCode(e.target.value); setJoinError(''); setJoinSuccess(''); }}
              aria-label="Invite code"
            />
            {joinError ? <p className="text-xs mt-2" style={{ color: 'rgb(var(--color-error))' }} role="alert">{joinError}</p> : null}
            {joinSuccess ? <p className="text-xs mt-2" style={{ color: 'rgb(var(--color-success))' }} role="alert">{joinSuccess}</p> : null}
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="secondary" onClick={() => setShowJoinModal(false)}>Cancel</Button>
              <Button onClick={handleJoinByCode} disabled={joinLoading || !inviteCode.trim()}>
                {joinLoading ? 'Sending...' : 'Send Request'}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default Teams;
