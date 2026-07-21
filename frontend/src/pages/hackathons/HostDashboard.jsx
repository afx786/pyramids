import { CalendarDays, Edit3, Eye, FileText, Globe, MoreHorizontal, Plus, Send, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EmptyState from '../../components/common/EmptyState.jsx';
import LoadingState from '../../components/common/LoadingState.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import Button from '../../components/ui/Button.jsx';
import Card from '../../components/ui/Card.jsx';
import StatCard from '../../components/ui/StatCard.jsx';
import StatusBadge from '../../components/ui/StatusBadge.jsx';
import StatusTimeline from '../../components/ui/StatusTimeline.jsx';
import { hackathonService } from '../../services/hackathonService.js';

function HostDashboard() {
  const navigate = useNavigate();
  const [hackathons, setHackathons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    hackathonService.getHostHackathons()
      .then((data) => setHackathons(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function formatDate(dateStr) {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  const total = hackathons.length;
  const published = hackathons.filter((h) => h.status === 'published').length;
  const drafts = hackathons.filter((h) => h.status === 'draft').length;
  const completed = hackathons.filter((h) => h.status === 'completed').length;

  async function handleAction(id, action) {
    try {
      if (action === 'delete') await hackathonService.deleteDraft(id);
      else if (action === 'submit') await hackathonService.submitForReview(id);
      else if (action === 'publish') await hackathonService.publish(id);
      else if (action === 'complete') await hackathonService.complete(id);
      else if (action === 'archive') await hackathonService.archive(id);
      const data = await hackathonService.getHostHackathons();
      setHackathons(Array.isArray(data) ? data : []);
    } catch {}
  }

  function renderActions(h) {
    switch (h.status) {
      case 'draft':
        return (
          <div className="flex gap-sm flex-wrap">
            <Button variant="secondary" size="sm" onClick={() => navigate(`/hackathons/edit/${h.id}`)}>
              <Edit3 size={14} /> Edit
            </Button>
            <Button size="sm" onClick={() => handleAction(h.id, 'submit')}>
              <Send size={14} /> Submit
            </Button>
            <Button variant="ghost" size="sm" onClick={() => handleAction(h.id, 'delete')} style={{ color: 'rgb(var(--color-error))' }}>
              <Trash2 size={14} />
            </Button>
          </div>
        );
      case 'submitted':
        return (
          <div className="flex items-center gap-sm font-body-sm" style={{ color: 'rgb(var(--color-warning))' }}>
            <FileText size={14} /> Pending Review
          </div>
        );
      case 'approved':
        return (
          <Button size="sm" onClick={() => handleAction(h.id, 'publish')}>
            <Globe size={14} /> Publish
          </Button>
        );
      case 'rejected':
        return (
          <div className="space-y-sm">
            {h.admin_feedback ? (
              <p className="font-body-sm" style={{ color: 'rgb(var(--color-error))' }}>Feedback: {h.admin_feedback}</p>
            ) : null}
            <div className="flex gap-sm">
              <Button variant="secondary" size="sm" onClick={() => navigate(`/hackathons/edit/${h.id}`)}>
                <Edit3 size={14} /> Edit
              </Button>
              <Button variant="ghost" size="sm" onClick={() => handleAction(h.id, 'delete')} style={{ color: 'rgb(var(--color-error))' }}>
                <Trash2 size={14} />
              </Button>
            </div>
          </div>
        );
      case 'published':
        return (
          <div className="flex gap-sm">
            <Button size="sm" onClick={() => handleAction(h.id, 'complete')}>
              <Eye size={14} /> Complete
            </Button>
            <Button variant="secondary" size="sm" onClick={() => handleAction(h.id, 'archive')}>
              Archive
            </Button>
          </div>
        );
      case 'completed':
        return (
          <Button variant="secondary" size="sm" onClick={() => handleAction(h.id, 'archive')}>
            Archive
          </Button>
        );
      case 'archived':
        return null;
      default:
        return null;
    }
  }

  if (loading) return <LoadingState label="Loading your hackathons..." />;

  return (
    <div className="animate-fade-in p-xl max-w-6xl mx-auto">
      <PageHeader
        eyebrow="Host Dashboard"
        title="My Hackathons"
        actions={
          <Button onClick={() => navigate('/hackathons/new')}>
            <Plus size={16} /> Create Hackathon
          </Button>
        }
      />

      <div className="grid gap-lg sm:grid-cols-2 lg:grid-cols-4 mt-xl">
        <StatCard label="Total" value={total} />
        <StatCard label="Published" value={published} />
        <StatCard label="Drafts" value={drafts} />
        <StatCard label="Completed" value={completed} />
      </div>

      <Card className="mt-xl p-lg">
        <p className="font-label-caps text-label-caps mb-md" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>HACKATHON WORKFLOW</p>
        <StatusTimeline currentStatus="published" />
      </Card>

      {hackathons.length === 0 ? (
        <div className="mt-xl">
          <EmptyState
            title="No hackathons yet"
            description="Create your first hackathon to get started."
            actionLabel="Create Hackathon"
            onAction={() => navigate('/hackathons/new')}
          />
        </div>
      ) : (
        <div className="grid gap-lg sm:grid-cols-2 xl:grid-cols-3 mt-xl">
          {hackathons.map((h) => (
            <div
              key={h.id}
              className="p-lg rounded-xl transition-all duration-200"
              style={{
                background: 'rgb(var(--color-surface-container-low))',
                border: '1px solid rgb(var(--color-outline-variant))',
              }}
            >
              <div className="flex items-center justify-between mb-sm">
                <StatusBadge status={h.status} />
                <span className="inline-flex items-center gap-1 font-mono text-[11px] px-sm py-xs rounded" style={{ background: 'rgb(var(--color-surface-variant))', color: 'rgb(var(--color-on-surface))' }}>
                  <Globe size={11} />
                  {h.mode || 'Online'}
                </span>
              </div>
              <h3
                className="font-headline-md text-headline-md font-bold mt-sm cursor-pointer hover:opacity-80"
                style={{ color: 'rgb(var(--color-primary))' }}
                onClick={() => navigate(`/hackathons/${h.id}`)}
              >
                {h.title}
              </h3>
              <div className="mt-md space-y-sm">
                <div className="flex items-center gap-sm font-body-sm" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
                  <CalendarDays size={14} className="shrink-0" />
                  <span>{formatDate(h.registration_opens || h.start_date)} – {formatDate(h.registration_closes || h.end_date)}</span>
                </div>
                <div className="flex items-center gap-sm font-body-sm" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
                  <MoreHorizontal size={14} className="shrink-0" />
                  <span>{h.organizer || '—'}</span>
                </div>
              </div>
              <div className="mt-lg pt-md" style={{ borderTop: '1px solid rgb(var(--color-outline-variant))' }}>
                {renderActions(h)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default HostDashboard;
