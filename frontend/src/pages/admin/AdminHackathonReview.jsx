import { CheckCircle, XCircle, MessageSquare, Archive } from 'lucide-react';
import { useEffect, useState } from 'react';
import Button from '../../components/ui/Button.jsx';
import Card from '../../components/ui/Card.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import LoadingState from '../../components/common/LoadingState.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import StatusBadge from '../../components/ui/StatusBadge.jsx';
import { api } from '../../services/api.js';

function AdminHackathonReview() {
  const [hackathons, setHackathons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState({});
  const [actionMsg, setActionMsg] = useState('');

  function load() {
    setLoading(true);
    api.get('/admin/hackathons/pending')
      .then(setHackathons)
      .catch(() => {})
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function handleAction(id, action) {
    const fb = feedback[id] || '';
    try {
      await api.post(`/admin/hackathons/${id}/${action}${fb ? `?feedback=${encodeURIComponent(fb)}` : ''}`);
      setActionMsg(`${action} successful`);
      setFeedback((prev) => ({ ...prev, [id]: '' }));
      load();
    } catch (err) {
      setActionMsg(`Error: ${err.message}`);
    }
  }

  if (loading) return <LoadingState label="Loading pending hackathons..." />;

  return (
    <div className="animate-fade-in mx-auto max-w-6xl">
      <PageHeader eyebrow="Admin" title="Hackathon Review" description="Review submitted hackathons" />

      {actionMsg && (
        <p className="mb-md font-body-sm" style={{ color: actionMsg.startsWith('Error') ? 'rgb(var(--color-error))' : 'rgb(var(--color-success))' }}>
          {actionMsg}
        </p>
      )}

      {hackathons.length === 0 ? (
        <EmptyState title="No pending hackathons" description="All submitted hackathons have been reviewed." />
      ) : (
        <div className="space-y-lg">
          {hackathons.map((h) => (
            <Card key={h.id} className="p-lg">
              <div className="flex items-start justify-between gap-md">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-sm flex-wrap">
                    <h3 className="font-headline-md font-bold" style={{ color: 'rgb(var(--color-primary))' }}>{h.title}</h3>
                    <StatusBadge status={h.status} />
                  </div>
                  <p className="font-body-sm mt-sm" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
                    {h.organizer} · {h.mode || 'Online'}
                  </p>
                  {h.description && (
                    <p className="font-body-sm mt-sm line-clamp-2" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
                      {h.description}
                    </p>
                  )}
                </div>
              </div>

              <hr className="my-md" style={{ borderColor: 'rgb(var(--color-outline-variant))' }} />

              <div className="space-y-sm">
                <label className="font-label-caps text-[10px] uppercase tracking-wider" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
                  Feedback (optional)
                </label>
                <textarea
                  className="w-full p-sm rounded-lg font-body-sm"
                  style={{ background: 'rgb(var(--color-surface))', border: '1px solid rgb(var(--color-outline-variant))', color: 'rgb(var(--color-on-surface))' }}
                  rows={2}
                  placeholder="Provide feedback to the host..."
                  value={feedback[h.id] || ''}
                  onChange={(e) => setFeedback((prev) => ({ ...prev, [h.id]: e.target.value }))}
                />
              </div>

              <div className="flex flex-wrap gap-sm mt-md">
                <Button size="sm" onClick={() => handleAction(h.id, 'approve')}>
                  <CheckCircle size={14} /> Approve
                </Button>
                <Button size="sm" variant="ghost" onClick={() => handleAction(h.id, 'reject')}>
                  <XCircle size={14} /> Reject
                </Button>
                <Button size="sm" variant="ghost" onClick={() => handleAction(h.id, 'request-changes')}>
                  <MessageSquare size={14} /> Request Changes
                </Button>
              </div>

              {h.admin_feedback && (
                <p className="font-body-sm mt-sm p-sm rounded" style={{ background: 'rgb(var(--color-surface-variant) / 0.3)', color: 'rgb(var(--color-on-surface-variant))' }}>
                  Previous feedback: {h.admin_feedback}
                </p>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminHackathonReview;
