import { Building2, Plus, ShieldCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import EmptyState from '../../components/common/EmptyState.jsx';
import ErrorState from '../../components/common/ErrorState.jsx';
import LoadingState from '../../components/common/LoadingState.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import Button from '../../components/ui/Button.jsx';
import StatusBadge from '../../components/ui/StatusBadge.jsx';
import { organizationService } from '../../services/organizationService.js';

function Organizations() {
  const navigate = useNavigate();
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    organizationService.list()
      .then((data) => setOrganizations(Array.isArray(data) ? data : []))
      .catch((err) => setError(err?.message || 'Failed to load organizations'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingState label="Loading organizations..." />;
  if (error) return <ErrorState title={error} onRetry={() => window.location.reload()} />;

  return (
    <div className="p-xl max-w-7xl">
      <PageHeader
        eyebrow="Organizations"
        title="Organizations"
        actions={
          <Link to="/organizations/new">
            <Button variant="primary">
              <Plus size={16} />
              Create
            </Button>
          </Link>
        }
      />

      {organizations.length === 0 ? (
        <div className="mt-xl">
          <EmptyState
            title="No organizations yet"
            description="Create an organization to bring your team together."
            actionLabel="Create Organization"
            onAction={() => navigate('/organizations/new')}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg mt-xl">
          {organizations.map((org) => (
            <Link key={org.id} to={`/organizations/${org.id}`} className="block group">
              <div
                className="p-lg rounded-lg transition-all duration-200 hover:-translate-y-0.5 h-full"
                style={{
                  background: 'rgb(var(--color-surface-container-low))',
                  border: '1px solid rgb(var(--color-outline-variant))',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgb(var(--color-primary) / 0.5)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgb(var(--color-outline-variant))'; }}
              >
                <div className="flex items-center gap-md mb-md">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-lg"
                    style={{ background: 'rgb(var(--color-primary) / 0.1)', border: '1px solid rgb(var(--color-primary) / 0.2)' }}
                  >
                    <Building2 size={24} style={{ color: 'rgb(var(--color-primary))' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-sm">
                      <h4 className="font-headline-md font-bold truncate" style={{ color: 'rgb(var(--color-primary))' }}>
                        {org.name}
                      </h4>
                      {org.verified ? (
                        <ShieldCheck size={16} style={{ color: 'rgb(var(--color-success))' }} />
                      ) : null}
                    </div>
                    <StatusBadge status={org.org_type || org.type || 'active'} />
                  </div>
                </div>

                {org.description ? (
                  <p className="font-body-sm text-body-sm line-clamp-2" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
                    {org.description}
                  </p>
                ) : null}

                {org.domains && org.domains.length > 0 ? (
                  <div className="flex flex-wrap gap-xs mt-md">
                    {org.domains.slice(0, 3).map((domain) => (
                      <span
                        key={domain}
                        className="px-sm py-xs font-mono text-mono rounded text-[10px]"
                        style={{
                          background: 'rgb(var(--color-surface-container-high))',
                          border: '1px solid rgb(var(--color-outline-variant))',
                          color: 'rgb(var(--color-on-surface-variant))',
                        }}
                      >
                        {domain}
                      </span>
                    ))}
                    {org.domains.length > 3 ? (
                      <span className="font-body-sm text-body-sm" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
                        +{org.domains.length - 3}
                      </span>
                    ) : null}
                  </div>
                ) : null}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default Organizations;
