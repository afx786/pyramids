import { CheckCircle, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import Button from '../../components/ui/Button.jsx';
import Card from '../../components/ui/Card.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import LoadingState from '../../components/common/LoadingState.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import StatusBadge from '../../components/ui/StatusBadge.jsx';
import Avatar from '../../components/ui/Avatar.jsx';
import { api } from '../../services/api.js';

function AdminOrganizationReview() {
  const [orgs, setOrgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState('');

  function load() {
    setLoading(true);
    api.get('/admin/organizations/pending')
      .then(setOrgs)
      .catch(() => {})
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function handleVerify(id) {
    try {
      await api.post(`/admin/organizations/${id}/verify`);
      setActionMsg('Organization verified successfully');
      load();
    } catch (err) {
      setActionMsg(`Error: ${err.message}`);
    }
  }

  if (loading) return <LoadingState label="Loading pending organizations..." />;

  return (
    <div className="animate-fade-in mx-auto max-w-6xl">
      <PageHeader eyebrow="Admin" title="Organization Review" description="Review and verify organizations" />

      {actionMsg && (
        <p className="mb-md font-body-sm" style={{ color: actionMsg.startsWith('Error') ? 'rgb(var(--color-error))' : 'rgb(var(--color-success))' }}>
          {actionMsg}
        </p>
      )}

      {orgs.length === 0 ? (
        <EmptyState title="No pending organizations" description="All organizations have been reviewed." />
      ) : (
        <div className="space-y-lg">
          {orgs.map((org) => (
            <Card key={org.id} className="p-lg">
              <div className="flex items-start justify-between gap-md">
                <div className="flex items-center gap-md min-w-0 flex-1">
                  <Avatar src={org.logo_url} alt={org.name} size="md" />
                  <div>
                    <div className="flex items-center gap-sm flex-wrap">
                      <h3 className="font-headline-md font-bold" style={{ color: 'rgb(var(--color-primary))' }}>{org.name}</h3>
                      <StatusBadge status={org.status || 'pending'} />
                      {org.org_type && (
                        <span className="font-mono text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'rgb(var(--color-surface-variant))', color: 'rgb(var(--color-on-surface))' }}>
                          {org.org_type}
                        </span>
                      )}
                    </div>
                    {org.description && (
                      <p className="font-body-sm mt-sm line-clamp-2" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
                        {org.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-sm mt-md">
                <Button size="sm" onClick={() => handleVerify(org.id)}>
                  <CheckCircle size={14} /> Verify
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminOrganizationReview;
