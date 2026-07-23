import { ArrowLeft, Copy, LogOut, Trash2, UserPlus, UserMinus, Crown, Users, Hash } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ErrorState from '../../components/common/ErrorState.jsx';
import LoadingState from '../../components/common/LoadingState.jsx';
import Button from '../../components/ui/Button.jsx';
import Card from '../../components/ui/Card.jsx';
import Input from '../../components/ui/Input.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { teamService } from '../../services/teamService.js';

function TeamDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [team, setTeam] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [inviteBuilderId, setInviteBuilderId] = useState('');
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteError, setInviteError] = useState('');
  const [inviteSuccess, setInviteSuccess] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    Promise.all([
      teamService.getTeam(id),
      teamService.listRequests(id).catch(() => []),
    ])
      .then(([teamData, requestsData]) => {
        setTeam(teamData);
        setRequests(requestsData);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const isOwner = team && user && team.owner?.id === user.id;
  const isMember = team && user && team.members?.some((m) => m.id === user.id);

  async function handleJoin() {
    try {
      await teamService.joinTeam(id);
      const [teamData, requestsData] = await Promise.all([
        teamService.getTeam(id),
        teamService.listRequests(id).catch(() => []),
      ]);
      setTeam(teamData);
      setRequests(requestsData);
    } catch (err) {
      setError(err.message || 'Failed to join team');
    }
  }

  async function handleLeave() {
    try { await teamService.leaveTeam(id); navigate('/teams'); } catch (err) { console.warn('[team] leave failed:', err); }
  }

  async function handleDelete() {
    try { await teamService.deleteTeam(id); navigate('/teams'); } catch (err) { console.warn('[team] delete failed:', err); }
  }

  async function handleApprove(reqId) {
    try { await teamService.approveRequest(reqId); setRequests((prev) => prev.filter((r) => r.id !== reqId)); } catch (err) { console.warn('[team] approve failed:', err); }
  }

  async function handleReject(reqId) {
    try { await teamService.rejectRequest(reqId); setRequests((prev) => prev.filter((r) => r.id !== reqId)); } catch (err) { console.warn('[team] reject failed:', err); }
  }

  async function handleRemoveMember(userId) {
    try { await teamService.removeMember(id, userId); setTeam((prev) => ({ ...prev, members: prev.members.filter((m) => m.id !== userId) })); } catch (err) { console.warn('[team] remove member failed:', err); }
  }

  async function handleInviteByBuilderId() {
    const bid = inviteBuilderId.trim().toLowerCase();
    if (!bid) return;
    setInviteLoading(true);
    setInviteError('');
    setInviteSuccess('');
    try {
      await teamService.inviteByBuilderId(id, bid);
      setInviteSuccess(`Invited @${bid} to the team`);
      setInviteBuilderId('');
      const teamData = await teamService.getTeam(id);
      setTeam(teamData);
    } catch (err) {
      setInviteError(err.message || 'Failed to invite');
    } finally {
      setInviteLoading(false);
    }
  }

  function handleCopyInvite() {
    if (team?.public_id) {
      navigator.clipboard.writeText(team.public_id).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
    }
  }

  function getMemberStatus(member) {
    if (member.id === team?.owner?.id) return { label: 'Owner', color: 'rgb(var(--color-warning))' };
    if (member.role === 'Admin') return { label: 'Admin', color: 'rgb(var(--color-primary))' };
    if (member.role === 'Pending Invite') return { label: 'Pending', color: 'rgb(var(--color-on-surface-variant))' };
    return { label: 'Member', color: 'rgb(var(--color-on-surface-variant))' };
  }

  if (loading) return <LoadingState label="Loading team..." />;
  function handleRetry() { window.location.reload(); }
  if (error) return <ErrorState title={error} onRetry={handleRetry} />;
  if (!team) return <ErrorState title="Team not found" />;

  const hackathon = team.hackathon;
  const research = team.research_project;

  return (
    <div className="mx-auto max-w-6xl">
      <Link to="/teams" className="mb-6 flex items-center gap-2 text-sm font-semibold text-secondary hover:text-primary transition">
        <ArrowLeft className="h-4 w-4" />
        Back to Teams
      </Link>

      <Card className="p-8">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-mono-label text-[11px] text-secondary">{team.members?.length ?? 0} members</p>
              {team.purpose ? (
                <span className="px-sm py-[2px] text-[10px] font-mono rounded" style={{ background: 'rgb(var(--color-surface-variant))', color: 'rgb(var(--color-on-surface-variant))' }}>
                  {team.purpose.toUpperCase()}
                </span>
              ) : null}
            </div>
            <h1 className="mt-3 text-4xl font-black text-primary">{team.name}</h1>
            {team.public_id ? (
              <div className="mt-1 flex items-center gap-2">
                <span className="font-mono text-xs" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>ID: {team.public_id}</span>
                <button type="button" onClick={handleCopyInvite} className="text-xs hover:text-primary transition-colors" style={{ color: 'rgb(var(--color-on-surface-variant))' }} aria-label="Copy team ID">
                  {copied ? <span style={{ color: 'rgb(var(--color-success))' }}>Copied!</span> : <Copy size={14} />}
                </button>
              </div>
            ) : null}
            <p className="mt-4 max-w-2xl text-sm font-medium leading-6 text-secondary">{team.description}</p>
            <p className="mt-2 text-sm font-semibold text-secondary">
              Owner: {team.owner?.name || '—'}
              {team.owner?.builder_id ? <span className="font-mono text-xs ml-2" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>@{team.owner.builder_id}</span> : null}
            </p>
          </div>

          <div className="flex shrink-0 flex-col gap-2">
            {isOwner && (
              <Button variant="ghost" onClick={handleDelete} style={{ color: 'rgb(var(--color-error))' }}>
                <Trash2 className="h-4 w-4" /> Delete
              </Button>
            )}
            {isMember && !isOwner && (
              <Button variant="ghost" onClick={handleLeave}>
                <LogOut className="h-4 w-4" /> Leave
              </Button>
            )}
            {!isMember && (
              <Button onClick={handleJoin}>
                <UserPlus className="h-4 w-4" /> Join
              </Button>
            )}
          </div>
        </div>

        {hackathon ? (
          <div className="mt-6 p-4 rounded-xl flex items-center gap-4" style={{ background: 'rgb(var(--color-surface-container))' }}>
            {hackathon.banner_url ? <img src={hackathon.banner_url} alt="" className="w-24 h-16 object-cover rounded-lg" /> : null}
            <div>
              <p className="font-bold text-sm" style={{ color: 'rgb(var(--color-primary))' }}>{hackathon.title}</p>
              <div className="flex gap-3 mt-1 text-xs" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
                <span>Mode: {hackathon.mode || 'Online'}</span>
                {hackathon.prize_pool ? <span>Prize: {hackathon.prize_pool}</span> : null}
                {hackathon.team_size_min || hackathon.team_size_max ? (
                  <span>Team: {hackathon.team_size_min || 1}–{hackathon.team_size_max || '∞'}</span>
                ) : null}
              </div>
            </div>
          </div>
        ) : null}

        {research ? (
          <div className="mt-6 p-4 rounded-xl" style={{ background: 'rgb(var(--color-surface-container))' }}>
            <p className="font-bold text-sm" style={{ color: 'rgb(var(--color-primary))' }}>{research.title}</p>
            <p className="text-xs mt-1" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>{research.domain}{research.supervisor ? ` · Supervisor: ${research.supervisor}` : ''}</p>
          </div>
        ) : null}
      </Card>

      <div className="mt-8 grid gap-8 xl:grid-cols-[1fr_360px]">
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Users size={16} style={{ color: 'rgb(var(--color-on-surface-variant))' }} />
            <p className="font-mono-label text-[11px] text-secondary">
              Members
              {hackathon?.team_size_max ? (
                <span className="ml-2">({team.members?.length ?? 0}/{hackathon.team_size_max})</span>
              ) : null}
            </p>
          </div>
          <div className="space-y-4">
            {team.members?.length > 0 ? (
              team.members.map((m) => {
                const status = getMemberStatus(m);
                return (
                  <div key={m.id} className="flex items-center justify-between border-t border-subtle pt-4 first:border-t-0 first:pt-0">
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="text-sm font-semibold text-primary">
                          {m.name}
                          {m.builder_id ? <span className="font-mono text-[10px] ml-1" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>@{m.builder_id}</span> : null}
                        </p>
                        <p className="text-xs font-medium capitalize" style={{ color: status.color }}>{status.label}</p>
                      </div>
                      {m.id === team.owner?.id && <Crown className="h-4 w-4" style={{ color: 'rgb(var(--color-warning))' }} />}
                    </div>
                    {isOwner && m.id !== user.id && (
                      <button type="button" onClick={() => handleRemoveMember(m.id)} className="text-secondary hover:text-error transition-colors" aria-label="Remove member">
                        <UserMinus className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-secondary">No members.</p>
            )}
          </div>

          {isOwner && (
            <div className="mt-6 pt-6 border-t" style={{ borderColor: 'rgb(var(--color-outline-variant))' }}>
              <p className="font-mono-label text-[11px] text-secondary mb-3">Invite by Builder ID</p>
              <div className="flex gap-2">
                <Input
                  placeholder="@builder_id"
                  value={inviteBuilderId}
                  onChange={(e) => { setInviteBuilderId(e.target.value); setInviteError(''); setInviteSuccess(''); }}
                />
                <Button onClick={handleInviteByBuilderId} disabled={inviteLoading || !inviteBuilderId.trim()}>
                  {inviteLoading ? '...' : 'Invite'}
                </Button>
              </div>
              {inviteError ? <p className="text-xs mt-1" style={{ color: 'rgb(var(--color-error))' }}>{inviteError}</p> : null}
              {inviteSuccess ? <p className="text-xs mt-1" style={{ color: 'rgb(var(--color-success))' }}>{inviteSuccess}</p> : null}
              <p className="text-xs mt-2" style={{ color: 'rgb(var(--color-on-surface-variant) / 0.7)' }}>
                Invite Code: <span className="font-mono">{team.public_id}</span>
                <button type="button" onClick={handleCopyInvite} className="ml-1 text-xs hover:text-primary" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
                  <Copy size={12} className="inline" />
                </button>
              </p>
            </div>
          )}
        </Card>

        {isOwner && (
          <Card className="p-6">
            <p className="font-mono-label text-[11px] text-secondary">Join Requests</p>
            <div className="mt-5 space-y-3">
              {requests.filter((r) => r.status === 'pending').length > 0 ? (
                requests.filter((r) => r.status === 'pending').map((r) => (
                  <div key={r.id} className="flex items-center justify-between border-t border-subtle pt-3 first:border-t-0 first:pt-0">
                    <p className="text-sm font-semibold text-primary">User #{r.user_id}</p>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => handleApprove(r.id)} className="text-xs font-bold" style={{ color: 'rgb(var(--color-success))' }}>Approve</button>
                      <button type="button" onClick={() => handleReject(r.id)} className="text-xs font-bold" style={{ color: 'rgb(var(--color-error))' }}>Reject</button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-secondary">No pending requests.</p>
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

export default TeamDetail;
