import { ArrowLeft, Calendar, Check, ChevronRight, Clock, ExternalLink, GitBranch, LogOut, MapPin, Plus, Send, UserMinus, UserPlus, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ErrorState from '../../components/common/ErrorState.jsx';
import LoadingState from '../../components/common/LoadingState.jsx';
import Avatar from '../../components/ui/Avatar.jsx';
import Button from '../../components/ui/Button.jsx';
import Card from '../../components/ui/Card.jsx';
import Input from '../../components/ui/Input.jsx';
import StatusBadge from '../../components/ui/StatusBadge.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { researchService } from '../../services/researchService.js';

const TABS = ['Overview', 'Team', 'Milestones', 'Updates'];

function ResearchDetail() {
  const { id } = useParams();
  const { user } = useAuth();

  const [research, setResearch] = useState(null);
  const [members, setMembers] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [updates, setUpdates] = useState([]);
  const [joinRequests, setJoinRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('Overview');
  const [actionError, setActionError] = useState('');

  const [newMilestone, setNewMilestone] = useState({ title: '', description: '' });
  const [newUpdate, setNewUpdate] = useState('');
  const [submittingMilestone, setSubmittingMilestone] = useState(false);
  const [submittingUpdate, setSubmittingUpdate] = useState(false);

  const isOwner = research && user && research.owner_id === user.id;
  const isMember = members.some((m) => m.id === user?.id) || isOwner;

  async function fetchAll() {
    setLoading(true);
    setError(null);
    try {
      const [data, membersData, milestonesData, updatesData, requestsData] = await Promise.all([
        researchService.get(id),
        researchService.getMembers(id).catch(() => []),
        researchService.getMilestones(id).catch(() => []),
        researchService.getUpdates(id).catch(() => []),
        researchService.getRequests(id).catch(() => []),
      ]);
      setResearch(data);
      setMembers(membersData);
      setMilestones(milestonesData);
      setUpdates(updatesData);
      setJoinRequests(requestsData);
    } catch (err) {
      setError(err.message || 'Failed to load research');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchAll(); }, [id]);

  async function handleJoin() {
    setActionError('');
    try {
      await researchService.join(id);
      await fetchAll();
    } catch (err) {
      setActionError(err.message);
    }
  }

  async function handleLeave() {
    setActionError('');
    try {
      await researchService.leave(id);
      await fetchAll();
    } catch (err) {
      setActionError(err.message);
    }
  }

  async function handleApprove(requestId) {
    try {
      await researchService.approveRequest(requestId);
      await fetchAll();
    } catch (err) {
      setActionError(err.message);
    }
  }

  async function handleReject(requestId) {
    try {
      await researchService.rejectRequest(requestId);
      await fetchAll();
    } catch (err) {
      setActionError(err.message);
    }
  }

  async function handleCreateMilestone(e) {
    e.preventDefault();
    if (!newMilestone.title.trim()) return;
    setSubmittingMilestone(true);
    try {
      await researchService.createMilestone(id, newMilestone);
      setNewMilestone({ title: '', description: '' });
      const updated = await researchService.getMilestones(id);
      setMilestones(updated);
    } catch (err) {
      setActionError(err.message);
    } finally {
      setSubmittingMilestone(false);
    }
  }

  async function handleCompleteMilestone(milestoneId) {
    try {
      await researchService.completeMilestone(milestoneId);
      const updated = await researchService.getMilestones(id);
      setMilestones(updated);
    } catch (err) {
      setActionError(err.message);
    }
  }

  async function handleCreateUpdate(e) {
    e.preventDefault();
    if (!newUpdate.trim()) return;
    setSubmittingUpdate(true);
    try {
      await researchService.createUpdate(id, newUpdate);
      setNewUpdate('');
      const updated = await researchService.getUpdates(id);
      setUpdates(updated);
    } catch (err) {
      setActionError(err.message);
    } finally {
      setSubmittingUpdate(false);
    }
  }

  if (loading) return <LoadingState label="Loading research..." />;
  if (error) return <ErrorState title={error} onRetry={fetchAll} />;
  if (!research) return <ErrorState title="Research not found" />;

  return (
    <div className="mx-auto max-w-6xl">
      <nav className="mb-6">
        <Link
          to="/research"
          className="inline-flex items-center gap-1.5 font-body-sm font-semibold transition"
          style={{ color: 'rgb(var(--color-on-surface-variant))' }}
        >
          <ArrowLeft size={16} />
          Back to Research Hub
        </Link>
      </nav>

      <Card className="p-8">
        <div className="flex items-start justify-between gap-6">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-3">
              {research.research_type ? (
                <span
                  className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold"
                  style={{
                    background: 'rgb(var(--color-surface-container-highest))',
                    color: 'rgb(var(--color-on-surface-variant))',
                  }}
                >
                  {research.research_type}
                </span>
              ) : null}
              <StatusBadge status={research.status || 'draft'} />
            </div>
            <h1 className="font-display-serif text-display-serif leading-tight" style={{ color: 'rgb(var(--color-primary))' }}>
              {research.title}
            </h1>
            {research.public_id ? (
              <p className="font-mono text-[11px] tracking-tight mt-1" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>{research.public_id}</p>
            ) : null}
            <div className="mt-3 flex items-center gap-4 flex-wrap">
              {research.domain ? (
                <span className="font-label-caps text-[11px]" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
                  {research.domain}
                </span>
              ) : null}
              {research.difficulty ? (
                <span
                  className="font-mono text-[11px] font-semibold"
                  style={{
                    color: research.difficulty === 'Advanced' ? 'rgb(var(--color-error))' : research.difficulty === 'Intermediate' ? 'rgb(var(--color-warning))' : 'rgb(var(--color-success))',
                  }}
                >
                  {research.difficulty}
                </span>
              ) : null}
              {research.duration ? (
                <span className="flex items-center gap-1 font-body-sm text-body-sm" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
                  <Clock size={14} />
                  {research.duration}
                </span>
              ) : null}
              {research.mode ? (
                <span className="flex items-center gap-1 font-body-sm text-body-sm" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
                  <MapPin size={14} />
                  {research.mode}
                </span>
              ) : null}
            </div>
          </div>

          <div className="flex shrink-0 flex-col items-end gap-2">
            {isOwner ? null : isMember ? (
              <Button variant="ghost" onClick={handleLeave}>
                <LogOut size={16} /> Leave
              </Button>
            ) : (
              <Button onClick={handleJoin}>
                <UserPlus size={16} /> Join
              </Button>
            )}
            {actionError && (
              <p className="font-body-sm text-body-sm" style={{ color: 'rgb(var(--color-error))' }}>{actionError}</p>
            )}
          </div>
        </div>

        {research.description && (
          <p className="mt-6 max-w-3xl font-body-lg text-body-lg leading-6" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
            {research.description}
          </p>
        )}

        {research.open_positions > 0 && (
          <div
            className="mt-5 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold"
            style={{
              background: 'rgb(var(--color-primary) / 0.1)',
              color: 'rgb(var(--color-primary))',
            }}
          >
            <Users size={14} />
            {research.open_positions} open position{research.open_positions > 1 ? 's' : ''}
          </div>
        )}
      </Card>

      <div className="mt-8 flex gap-1 border-b pb-0" style={{ borderColor: 'rgb(var(--color-outline-variant) / 0.5)' }}>
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="px-5 py-2.5 text-sm font-semibold transition-all rounded-t-lg"
            style={{
              color: activeTab === tab ? 'rgb(var(--color-primary))' : 'rgb(var(--color-on-surface-variant))',
              borderBottom: activeTab === tab ? '2px solid rgb(var(--color-primary))' : '2px solid transparent',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {activeTab === 'Overview' && (
          <OverviewTab research={research} />
        )}
        {activeTab === 'Team' && (
          <TeamTab
            members={members}
            joinRequests={joinRequests}
            isOwner={isOwner}
            isMember={isMember}
            onApprove={handleApprove}
            onReject={handleReject}
            onJoin={handleJoin}
            onLeave={handleLeave}
            actionError={actionError}
          />
        )}
        {activeTab === 'Milestones' && (
          <MilestonesTab
            milestones={milestones}
            isOwner={isOwner}
            newMilestone={newMilestone}
            onNewMilestoneChange={setNewMilestone}
            onCreateMilestone={handleCreateMilestone}
            onCompleteMilestone={handleCompleteMilestone}
            submitting={submittingMilestone}
          />
        )}
        {activeTab === 'Updates' && (
          <UpdatesTab
            updates={updates}
            isMember={isMember}
            newUpdate={newUpdate}
            onNewUpdateChange={setNewUpdate}
            onCreateUpdate={handleCreateUpdate}
            submitting={submittingUpdate}
          />
        )}
      </div>
    </div>
  );
}

function OverviewTab({ research }) {
  const fields = [
    { label: 'Abstract', value: research.abstract },
    { label: 'Problem Statement', value: research.problem_statement },
    { label: 'Description', value: research.description },
    { label: 'Expected Outcomes', value: research.expected_outcomes },
    { label: 'Methodology', value: research.methodology },
  ];

  const links = [
    { label: 'Datasets', value: research.datasets },
    { label: 'Resources', value: research.resources },
    { label: 'Repository', value: research.repository_url, href: research.repository_url },
    { label: 'Paper', value: research.paper_link, href: research.paper_link },
  ];

  const meta = [
    { label: 'Funding', value: research.funding },
    { label: 'Supervisor', value: research.supervisor },
    { label: 'Institution', value: research.institution },
    { label: 'Publication Goal', value: research.publication_goal },
    { label: 'Duration', value: research.duration },
    { label: 'Mode', value: research.mode },
    { label: 'Team Size', value: research.team_size },
    { label: 'Open Positions', value: research.open_positions },
  ];

  return (
    <div className="grid gap-8 xl:grid-cols-[1fr_320px]">
      <div className="space-y-8">
        {fields.map((f) => f.value ? (
          <section key={f.label}>
            <h3 className="font-label-caps text-label-caps uppercase tracking-widest mb-2" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
              {f.label}
            </h3>
            <p className="font-body-sm text-body-sm leading-6 whitespace-pre-wrap" style={{ color: 'rgb(var(--color-on-surface))' }}>
              {f.value}
            </p>
          </section>
        ) : null)}

        {research.skills_needed ? (
          <section>
            <h3 className="font-label-caps text-label-caps uppercase tracking-widest mb-2" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
              Skills Needed
            </h3>
            <div className="flex flex-wrap gap-2">
              {(Array.isArray(research.skills_needed) ? research.skills_needed : typeof research.skills_needed === 'string' ? research.skills_needed.split(',') : []).map((s, i) => (
                <span
                  key={i}
                  className="px-2 py-1 rounded text-xs font-mono font-semibold"
                  style={{
                    background: 'rgb(var(--color-surface-container-high))',
                    color: 'rgb(var(--color-primary))',
                  }}
                >
                  {s.trim()}
                </span>
              ))}
            </div>
          </section>
        ) : null}

        {research.required_roles?.length > 0 ? (
          <section>
            <h3 className="font-label-caps text-label-caps uppercase tracking-widest mb-2" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
              Required Roles
            </h3>
            <div className="flex flex-wrap gap-2">
              {research.required_roles.map((role, i) => (
                <span
                  key={i}
                  className="px-2 py-1 rounded text-xs font-semibold"
                  style={{
                    background: 'rgb(var(--color-surface-container-high))',
                    color: 'rgb(var(--color-on-surface))',
                  }}
                >
                  {role}
                </span>
              ))}
            </div>
          </section>
        ) : null}

        {links.some((l) => l.value) ? (
          <section className="space-y-3">
            <h3 className="font-label-caps text-label-caps uppercase tracking-widest" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
              Links & Resources
            </h3>
            {links.map((l) => l.value ? (
              l.href ? (
                <a
                  key={l.label}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 font-body-sm text-body-sm font-semibold transition hover:opacity-70"
                  style={{ color: 'rgb(var(--color-primary))' }}
                >
                  <ExternalLink size={14} />
                  {l.label} — {l.value}
                </a>
              ) : (
                <p key={l.label} className="font-body-sm text-body-sm" style={{ color: 'rgb(var(--color-on-surface))' }}>
                  <span className="font-semibold" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>{l.label}:</span> {l.value}
                </p>
              )
            ) : null)}
          </section>
        ) : null}
      </div>

      <aside className="space-y-4">
        <Card className="p-5">
          <h3 className="font-label-caps text-label-caps uppercase tracking-widest mb-4" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
            Details
          </h3>
          <div className="space-y-3">
            {meta.map((m) => m.value ? (
              <div key={m.label}>
                <p className="text-[10px] font-label-caps uppercase" style={{ color: 'rgb(var(--color-on-surface-variant) / 0.7)' }}>
                  {m.label}
                </p>
                <p className="font-body-sm text-body-sm font-medium mt-0.5" style={{ color: 'rgb(var(--color-on-surface))' }}>
                  {m.value}
                </p>
              </div>
            ) : null)}
          </div>
        </Card>

        {research.application_deadline ? (
          <Card className="p-5">
            <div className="flex items-center gap-2 mb-2">
              <Calendar size={16} style={{ color: 'rgb(var(--color-on-surface-variant))' }} />
              <span className="font-label-caps text-label-caps uppercase tracking-widest" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
                Deadline
              </span>
            </div>
            <p className="font-body-sm text-body-sm font-semibold" style={{ color: 'rgb(var(--color-primary))' }}>
              {new Date(research.application_deadline).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </Card>
        ) : null}
      </aside>
    </div>
  );
}

function TeamTab({ members, joinRequests, isOwner, isMember, onApprove, onReject, onJoin, onLeave, actionError }) {
  return (
    <div className="grid gap-8 xl:grid-cols-[1fr_360px]">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-5">
          <p className="font-label-caps text-label-caps uppercase tracking-widest" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
            Members ({members.length})
          </p>
        </div>
        {members.length > 0 ? (
          <div className="space-y-3">
            {members.map((m) => (
              <div
                key={m.id || m.user_id}
                className="flex items-center gap-3 p-2 rounded-lg transition-colors"
                style={{ borderBottom: '1px solid rgb(var(--color-outline-variant) / 0.3)' }}
              >
                <Avatar size="sm" {...(m.avatar ? { src: m.avatar } : {})} alt={m.name || `User #${m.user_id}`} />
                <div className="flex-1 min-w-0">
                  <p className="font-body-sm font-semibold" style={{ color: 'rgb(var(--color-primary))' }}>
                    {m.name || `User #${m.user_id}`}
                  </p>
                  <p className="text-[11px] font-medium capitalize" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
                    {m.role || 'Member'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="font-body-sm text-body-sm" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
            No members yet.
          </p>
        )}
        {!isMember && (
          <div className="mt-5">
            <Button onClick={onJoin}>
              <UserPlus size={16} /> Join Research
            </Button>
            {actionError && (
              <p className="mt-2 font-body-sm text-body-sm" style={{ color: 'rgb(var(--color-error))' }}>{actionError}</p>
            )}
          </div>
        )}
      </Card>

      {isOwner && (
        <Card className="p-6">
          <p className="font-label-caps text-label-caps uppercase tracking-widest mb-4" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
            Join Requests ({joinRequests.length})
          </p>
          {joinRequests.length > 0 ? (
            <div className="space-y-3">
              {joinRequests.map((req) => (
                <div
                  key={req.id}
                  className="flex items-center justify-between p-3 rounded-lg"
                  style={{ background: 'rgb(var(--color-surface-container))', border: '1px solid rgb(var(--color-outline-variant))' }}
                >
                  <div className="min-w-0">
                    <p className="font-body-sm font-semibold" style={{ color: 'rgb(var(--color-primary))' }}>
                      User #{req.user_id}
                    </p>
                    <p className="text-[11px] capitalize" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
                      {req.status}
                    </p>
                  </div>
                  {req.status === 'pending' && (
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => onApprove(req.id)}
                        className="text-xs font-bold px-2 py-1 rounded"
                        style={{ color: 'rgb(var(--color-success))', background: 'rgb(var(--color-success) / 0.1)' }}
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => onReject(req.id)}
                        className="text-xs font-bold px-2 py-1 rounded"
                        style={{ color: 'rgb(var(--color-error))', background: 'rgb(var(--color-error) / 0.1)' }}
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="font-body-sm text-body-sm" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
              No pending requests.
            </p>
          )}
        </Card>
      )}
    </div>
  );
}

function MilestonesTab({ milestones, isOwner, newMilestone, onNewMilestoneChange, onCreateMilestone, onCompleteMilestone, submitting }) {
  return (
    <div className="grid gap-8 xl:grid-cols-[1fr_360px]">
      <div className="space-y-4">
        {milestones.length > 0 ? (
          milestones.map((m) => (
            <div
              key={m.id}
              className="flex items-start justify-between p-5 rounded-lg"
              style={{
                background: 'rgb(var(--color-surface-container-low))',
                border: '1px solid rgb(var(--color-outline-variant))',
                opacity: m.completed ? 0.6 : 1,
              }}
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-body-sm font-bold" style={{ color: m.completed ? 'rgb(var(--color-on-surface-variant))' : 'rgb(var(--color-primary))' }}>
                    {m.title}
                  </h4>
                  {m.completed && (
                    <Check size={14} style={{ color: 'rgb(var(--color-success))' }} />
                  )}
                </div>
                {m.description && (
                  <p className="mt-1 font-body-sm text-body-sm" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
                    {m.description}
                  </p>
                )}
              </div>
              {!m.completed && (
                <button
                  onClick={() => onCompleteMilestone(m.id)}
                  className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded shrink-0"
                  style={{
                    background: 'rgb(var(--color-success) / 0.1)',
                    color: 'rgb(var(--color-success))',
                  }}
                >
                  <Check size={12} /> Complete
                </button>
              )}
            </div>
          ))
        ) : (
          <div
            className="p-8 rounded-lg text-center"
            style={{
              background: 'rgb(var(--color-surface-container-low))',
              border: '1px dashed rgb(var(--color-outline-variant))',
            }}
          >
            <p className="font-body-sm text-body-sm" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
              No milestones yet.
            </p>
          </div>
        )}
      </div>

      {isOwner && (
        <Card className="p-5">
          <h3 className="font-label-caps text-label-caps uppercase tracking-widest mb-4" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
            Add Milestone
          </h3>
          <form onSubmit={onCreateMilestone} className="space-y-4">
            <Input
              placeholder="Milestone title"
              value={newMilestone.title}
              onChange={(e) => onNewMilestoneChange((prev) => ({ ...prev, title: e.target.value }))}
            />
            <textarea
              placeholder="Description (optional)"
              value={newMilestone.description}
              onChange={(e) => onNewMilestoneChange((prev) => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full rounded-lg py-2 px-3 font-body-sm text-body-sm leading-6 transition-all"
              style={{
                background: 'rgb(var(--color-surface-container-lowest))',
                border: 'none',
                outline: 'none',
                boxShadow: '0 0 0 1px rgb(var(--color-outline-variant))',
                color: 'rgb(var(--color-on-surface))',
              }}
              onFocus={(e) => { e.target.style.boxShadow = '0 0 0 1px rgb(var(--color-primary))'; }}
              onBlur={(e) => { e.target.style.boxShadow = '0 0 0 1px rgb(var(--color-outline-variant))'; }}
            />
            <Button type="submit" disabled={submitting || !newMilestone.title.trim()}>
              <Plus size={16} />
              {submitting ? 'Adding...' : 'Add Milestone'}
            </Button>
          </form>
        </Card>
      )}
    </div>
  );
}

function UpdatesTab({ updates, isMember, newUpdate, onNewUpdateChange, onCreateUpdate, submitting }) {
  return (
    <div className="grid gap-8 xl:grid-cols-[1fr_360px]">
      <div className="space-y-4">
        {updates.length > 0 ? (
          updates.map((u) => (
            <div
              key={u.id}
              className="p-5 rounded-lg"
              style={{
                background: 'rgb(var(--color-surface-container-low))',
                border: '1px solid rgb(var(--color-outline-variant))',
              }}
            >
              <p className="font-body-sm text-body-sm leading-6 whitespace-pre-wrap" style={{ color: 'rgb(var(--color-on-surface))' }}>
                {u.content}
              </p>
              {u.created_at && (
                <p className="mt-2 text-[11px] font-mono font-medium" style={{ color: 'rgb(var(--color-on-surface-variant) / 0.7)' }}>
                  {new Date(u.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
              )}
            </div>
          ))
        ) : (
          <div
            className="p-8 rounded-lg text-center"
            style={{
              background: 'rgb(var(--color-surface-container-low))',
              border: '1px dashed rgb(var(--color-outline-variant))',
            }}
          >
            <p className="font-body-sm text-body-sm" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
              No updates yet.
            </p>
          </div>
        )}
      </div>

      {isMember && (
        <Card className="p-5">
          <h3 className="font-label-caps text-label-caps uppercase tracking-widest mb-4" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
            Post Update
          </h3>
          <form onSubmit={onCreateUpdate} className="space-y-4">
            <textarea
              placeholder="Share an update..."
              value={newUpdate}
              onChange={(e) => onNewUpdateChange(e.target.value)}
              rows={4}
              className="w-full rounded-lg py-2 px-3 font-body-sm text-body-sm leading-6 transition-all"
              style={{
                background: 'rgb(var(--color-surface-container-lowest))',
                border: 'none',
                outline: 'none',
                boxShadow: '0 0 0 1px rgb(var(--color-outline-variant))',
                color: 'rgb(var(--color-on-surface))',
              }}
              onFocus={(e) => { e.target.style.boxShadow = '0 0 0 1px rgb(var(--color-primary))'; }}
              onBlur={(e) => { e.target.style.boxShadow = '0 0 0 1px rgb(var(--color-outline-variant))'; }}
            />
            <Button type="submit" disabled={submitting || !newUpdate.trim()}>
              <Send size={16} />
              {submitting ? 'Posting...' : 'Post Update'}
            </Button>
          </form>
        </Card>
      )}
    </div>
  );
}

export default ResearchDetail;
