import { ArrowLeft, LogOut, Trash2, UserPlus, UserMinus, Crown } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ErrorState from '../../components/common/ErrorState.jsx';
import LoadingState from '../../components/common/LoadingState.jsx';
import Button from '../../components/ui/Button.jsx';
import Card from '../../components/ui/Card.jsx';
import SkillTag from '../../components/ui/SkillTag.jsx';
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
    try { await teamService.joinTeam(id); window.location.reload(); } catch {}
  }

  async function handleLeave() {
    try { await teamService.leaveTeam(id); navigate('/teams'); } catch {}
  }

  async function handleDelete() {
    try { await teamService.deleteTeam(id); navigate('/teams'); } catch {}
  }

  async function handleApprove(reqId) {
    try { await teamService.approveRequest(reqId); setRequests((prev) => prev.filter((r) => r.id !== reqId)); } catch {}
  }

  async function handleReject(reqId) {
    try { await teamService.rejectRequest(reqId); setRequests((prev) => prev.filter((r) => r.id !== reqId)); } catch {}
  }

  async function handleRemoveMember(userId) {
    try { await teamService.removeMember(id, userId); setTeam((prev) => ({ ...prev, members: prev.members.filter((m) => m.id !== userId) })); } catch {}
  }

  if (loading) return <LoadingState label="Loading team..." />;
  if (error) return <ErrorState title={error} onRetry={() => window.location.reload()} />;
  if (!team) return <ErrorState title="Team not found" />;

  return (
    <div className="mx-auto max-w-6xl">
      <Link to="/teams" className="mb-6 flex items-center gap-2 text-sm font-semibold text-secondary hover:text-primary transition">
        <ArrowLeft className="h-4 w-4" />
        Back to Teams
      </Link>

      <Card className="p-8">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-mono-label text-[11px] text-secondary">{team.members?.length ?? 0} members</p>
            <h1 className="mt-3 text-4xl font-black text-primary">{team.name}</h1>
            <p className="mt-4 max-w-2xl text-sm font-medium leading-6 text-secondary">{team.description}</p>
            <p className="mt-4 text-sm font-semibold text-secondary">Owner: {team.owner?.name || '—'}</p>
          </div>

          <div className="flex shrink-0 flex-col gap-2">
            {isOwner && (
              <Button variant="ghost" onClick={handleDelete} className="text-red-500">
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
      </Card>

      <div className="mt-8 grid gap-8 xl:grid-cols-[1fr_360px]">
        <Card className="p-6">
          <p className="font-mono-label text-[11px] text-secondary">Members</p>
          <div className="mt-5 space-y-4">
            {team.members?.length > 0 ? (
              team.members.map((m) => (
                <div key={m.id} className="flex items-center justify-between border-t border-subtle pt-4 first:border-t-0 first:pt-0">
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="text-sm font-semibold text-primary">{m.name}</p>
                      <p className="text-xs font-medium text-secondary capitalize">{m.role}</p>
                    </div>
                    {m.id === team.owner?.id && <Crown className="h-4 w-4 text-yellow-500" />}
                  </div>
                  {isOwner && m.id !== user.id && (
                    <button type="button" onClick={() => handleRemoveMember(m.id)} className="text-secondary hover:text-red-500">
                      <UserMinus className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))
            ) : (
              <p className="text-sm text-secondary">No members.</p>
            )}
          </div>
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
                      <button type="button" onClick={() => handleApprove(r.id)} className="text-xs font-bold text-green-600">Approve</button>
                      <button type="button" onClick={() => handleReject(r.id)} className="text-xs font-bold text-red-500">Reject</button>
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
