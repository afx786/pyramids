import { ArrowLeft, Building2, Globe, Mail, MapPin, Pencil, Plus, ShieldCheck, Trash2, UserMinus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ErrorState from '../../components/common/ErrorState.jsx';
import LoadingState from '../../components/common/LoadingState.jsx';
import Avatar from '../../components/ui/Avatar.jsx';
import Button from '../../components/ui/Button.jsx';
import Card from '../../components/ui/Card.jsx';
import Input from '../../components/ui/Input.jsx';
import StatusBadge from '../../components/ui/StatusBadge.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { organizationService } from '../../services/organizationService.js';

function OrganizationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [org, setOrg] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [addUserId, setAddUserId] = useState('');
  const [adding, setAdding] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);
    Promise.all([
      organizationService.get(id),
      organizationService.getMembers(id).catch(() => []),
    ])
      .then(([orgData, membersData]) => {
        setOrg(orgData);
        setMembers(membersData);
      })
      .catch((err) => setError(err?.message || 'Failed to load organization'))
      .finally(() => setLoading(false));
  }, [id]);

  const isOwner = org && user && org.owner_id === user.id;

  async function handleAddMember() {
    if (!addUserId.trim()) return;
    setAdding(true);
    try {
      await organizationService.addMember(id, addUserId.trim());
      const updated = await organizationService.getMembers(id).catch(() => []);
      setMembers(updated);
      setAddUserId('');
    } catch (err) {
      console.warn('[org] add member failed:', err);
    } finally {
      setAdding(false);
    }
  }

  async function handleRemoveMember(userId) {
    try {
      await organizationService.removeMember(id, userId);
      setMembers((prev) => prev.filter((m) => m.id !== userId));
    } catch (err) {
      console.warn('[org] remove member failed:', err);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      await organizationService.delete(id);
      navigate('/organizations');
    } catch (err) {
      console.warn('[org] delete failed:', err);
      setShowDeleteConfirm(false);
    } finally {
      setDeleting(false);
    }
  }

  if (loading) return <LoadingState label="Loading organization..." />;
  if (error) return <ErrorState title={error} onRetry={() => window.location.reload()} />;
  if (!org) return <ErrorState title="Organization not found" />;

  const domains = org.domains ?? [];

  return (
    <div className="mx-auto max-w-6xl">
      <Link to="/organizations" className="mb-lg flex items-center gap-sm font-body-sm" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
        <ArrowLeft size={16} />
        Back to Organizations
      </Link>

      <Card className="p-xl">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-lg">
            <div
              className="flex h-16 w-16 items-center justify-center rounded-xl shrink-0"
              style={{ background: 'rgb(var(--color-primary) / 0.1)', border: '1px solid rgb(var(--color-primary) / 0.2)' }}
            >
              {org.logo_url ? (
                <img src={org.logo_url} alt={org.name} className="h-full w-full rounded-xl object-cover" />
              ) : (
                <Building2 size={32} style={{ color: 'rgb(var(--color-primary))' }} />
              )}
            </div>
            <div>
              <div className="flex items-center gap-sm flex-wrap">
                <h1 className="font-display-serif text-display-serif" style={{ color: 'rgb(var(--color-on-surface))' }}>
                  {org.name}
                </h1>
                {org.verified ? (
                  <ShieldCheck size={20} style={{ color: 'rgb(var(--color-success))' }} />
                ) : null}
              </div>
              <div className="flex items-center gap-sm mt-sm">
                <StatusBadge status={org.org_type || org.type || 'active'} />
                <StatusBadge status={org.status || 'active'} />
              </div>
            </div>
          </div>

          {isOwner ? (
            <div className="flex shrink-0 gap-md">
              <Link to={`/organizations/${id}/edit`}>
                <Button variant="secondary">
                  <Pencil size={16} />
                  Edit
                </Button>
              </Link>
              <Button variant="ghost" onClick={() => setShowDeleteConfirm(true)} style={{ color: 'rgb(var(--color-error))' }}>
                <Trash2 size={16} />
              </Button>
            </div>
          ) : null}
        </div>

        {org.description ? (
          <p className="font-body-lg text-body-lg mt-lg max-w-3xl" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
            {org.description}
          </p>
        ) : null}

        <div className="flex flex-wrap gap-xl mt-lg" style={{ borderTop: '1px solid rgb(var(--color-outline-variant) / 0.2)', paddingTop: '16px' }}>
          {org.website ? (
            <a href={org.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-sm font-body-sm" style={{ color: 'rgb(var(--color-primary))' }}>
              <Globe size={16} />
              {org.website.replace(/^https?:\/\//, '')}
            </a>
          ) : null}
          {org.email ? (
            <span className="flex items-center gap-sm font-body-sm" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
              <Mail size={16} />
              {org.email}
            </span>
          ) : null}
          {org.location ? (
            <span className="flex items-center gap-sm font-body-sm" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
              <MapPin size={16} />
              {org.location}
            </span>
          ) : null}
        </div>

        {domains.length > 0 ? (
          <div className="flex flex-wrap gap-sm mt-lg">
            {domains.map((domain) => (
              <span
                key={domain}
                className="px-md py-xs rounded font-mono text-mono"
                style={{
                  background: 'rgb(var(--color-surface-container-high))',
                  border: '1px solid rgb(var(--color-outline-variant))',
                  color: 'rgb(var(--color-primary))',
                }}
              >
                {domain}
              </span>
            ))}
          </div>
        ) : null}
      </Card>

      <div className="mt-xl grid gap-xl lg:grid-cols-[1fr_360px]">
        <Card className="p-xl">
          <h3 className="font-headline-md font-bold" style={{ color: 'rgb(var(--color-on-surface))' }}>
            Members ({members.length})
          </h3>
          <div className="mt-lg space-y-md">
            {members.length > 0 ? (
              members.map((m) => (
                <div
                  key={m.id}
                  className="flex items-center justify-between p-md rounded-lg transition-colors"
                  style={{ background: 'rgb(var(--color-surface-container))', border: '1px solid rgb(var(--color-outline-variant))' }}
                >
                  <div className="flex items-center gap-md">
                    <Avatar
                      size="sm"
                      src={m.avatar || m.profile_picture}
                      alt={m.name || m.user_name || 'Member'}
                    />
                    <div>
                      <p className="font-body-sm font-bold" style={{ color: 'rgb(var(--color-primary))' }}>
                        {m.name || m.user_name || `User #${m.id}`}
                      </p>
                      <p className="font-body-sm capitalize" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
                        {m.role || 'Member'}
                      </p>
                    </div>
                  </div>
                  {isOwner && m.id !== user.id ? (
                    <button
                      type="button"
                      onClick={() => handleRemoveMember(m.id)}
                      className="transition-colors"
                      style={{ color: 'rgb(var(--color-on-surface-variant))' }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = 'rgb(var(--color-error))'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = 'rgb(var(--color-on-surface-variant))'; }}
                      aria-label="Remove member"
                    >
                      <UserMinus size={16} />
                    </button>
                  ) : null}
                </div>
              ))
            ) : (
              <p className="font-body-sm" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>No members yet.</p>
            )}
          </div>
        </Card>

        {isOwner ? (
          <div className="space-y-xl">
            <Card className="p-xl">
              <h4 className="font-label-caps text-label-caps" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>Add Member</h4>
              <div className="flex items-center gap-md mt-md">
                <div className="flex-1">
                  <Input
                    placeholder="User ID"
                    value={addUserId}
                    onChange={(e) => setAddUserId(e.target.value)}
                  />
                </div>
                <Button onClick={handleAddMember} disabled={adding || !addUserId.trim()}>
                  <Plus size={16} />
                  {adding ? 'Adding...' : 'Add'}
                </Button>
              </div>
            </Card>
          </div>
        ) : null}
      </div>

      {showDeleteConfirm ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-lg" style={{ background: 'rgb(0 0 0 / 0.4)' }}>
          <Card className="mx-auto w-full max-w-md p-xl">
            <div className="flex items-center gap-md">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-full"
                style={{ background: 'rgb(var(--color-error-container))' }}
              >
                <Trash2 size={20} style={{ color: 'rgb(var(--color-error))' }} />
              </div>
              <div>
                <h2 className="font-headline-md" style={{ color: 'rgb(var(--color-primary))' }}>Delete organization?</h2>
                <p className="mt-sm font-body-sm" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
                  This action cannot be undone. &ldquo;{org.name}&rdquo; will be permanently removed.
                </p>
              </div>
            </div>
            <div className="mt-lg flex justify-end gap-md">
              <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)} disabled={deleting}>
                Cancel
              </Button>
              <Button onClick={handleDelete} disabled={deleting} style={{ borderColor: 'rgb(var(--color-error))', color: 'rgb(var(--color-error))', background: 'transparent' }}>
                <Trash2 size={16} />
                {deleting ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </Card>
        </div>
      ) : null}
    </div>
  );
}

export default OrganizationDetail;
