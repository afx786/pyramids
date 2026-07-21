import { Beaker, Building2, FlaskConical, Plus, Trophy, UserMinus, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ErrorState from '../../components/common/ErrorState.jsx';
import LoadingState from '../../components/common/LoadingState.jsx';
import Avatar from '../../components/ui/Avatar.jsx';
import Button from '../../components/ui/Button.jsx';
import Card from '../../components/ui/Card.jsx';
import StatCard from '../../components/ui/StatCard.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { organizationService } from '../../services/organizationService.js';

function OrganizationDashboard() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [org, setOrg] = useState(null);
  const [members, setMembers] = useState([]);
  const [stats, setStats] = useState({ memberCount: 0, projects: 0, research: 0, hackathons: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        setStats({
          memberCount: membersData.length || 0,
          projects: orgData.project_count ?? orgData.projects ?? 0,
          research: orgData.research_count ?? orgData.research ?? 0,
          hackathons: orgData.hackathon_count ?? orgData.hackathons ?? 0,
        });
      })
      .catch((err) => setError(err?.message || 'Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, [id]);

  const isOwner = org && user && org.owner_id === user.id;

  async function handleRemoveMember(userId) {
    try {
      await organizationService.removeMember(id, userId);
      setMembers((prev) => prev.filter((m) => m.id !== userId));
      setStats((prev) => ({ ...prev, memberCount: prev.memberCount - 1 }));
    } catch (err) {
      console.warn('[org] remove member failed:', err);
    }
  }

  if (loading) return <LoadingState label="Loading dashboard..." />;
  if (error) return <ErrorState title={error} onRetry={() => window.location.reload()} />;
  if (!org) return <ErrorState title="Organization not found" />;

  if (!isOwner) {
    navigate(`/organizations/${id}`);
    return null;
  }

  return (
    <div className="p-xl max-w-7xl">
      <div className="flex items-center justify-between mb-xl">
        <div>
          <p className="font-label-caps text-label-caps uppercase tracking-widest" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
            Owner Dashboard
          </p>
          <h1 className="font-display-serif text-display-serif mt-xs" style={{ color: 'rgb(var(--color-on-surface))' }}>
            {org.name}
          </h1>
        </div>
        <Link to={`/organizations/${id}`}>
          <Button variant="secondary">
            <Building2 size={16} />
            View Organization
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-lg mb-xl">
        <StatCard
          label="Members"
          value={stats.memberCount}
          icon={<Users size={16} />}
        />
        <StatCard
          label="Projects"
          value={stats.projects}
          icon={<Beaker size={16} />}
        />
        <StatCard
          label="Research"
          value={stats.research}
          icon={<FlaskConical size={16} />}
        />
        <StatCard
          label="Hackathons"
          value={stats.hackathons}
          icon={<Trophy size={16} />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-xl">
        <Card className="p-xl">
          <div className="flex items-center justify-between mb-lg">
            <h3 className="font-headline-md font-bold" style={{ color: 'rgb(var(--color-on-surface))' }}>
              Members
            </h3>
            <span className="font-mono text-mono" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
              {members.length}
            </span>
          </div>
          {members.length > 0 ? (
            <div className="space-y-md">
              {members.map((m) => (
                <div
                  key={m.id}
                  className="flex items-center justify-between p-md rounded-lg"
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
                  {m.id !== user.id ? (
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
              ))}
            </div>
          ) : (
            <p className="font-body-sm" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>No members yet.</p>
          )}
        </Card>

        <div className="space-y-lg">
          <p className="font-label-caps text-label-caps uppercase tracking-widest" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
            Quick Actions
          </p>
          <Link to={`/projects/new?organization=${id}`} className="block">
            <div
              className="p-lg rounded-lg transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
              style={{
                background: 'rgb(var(--color-surface-container-low))',
                border: '1px solid rgb(var(--color-outline-variant))',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgb(var(--color-primary) / 0.5)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgb(var(--color-outline-variant))'; }}
            >
              <div className="flex items-center gap-md">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-lg"
                  style={{ background: 'rgb(var(--color-primary) / 0.1)', border: '1px solid rgb(var(--color-primary) / 0.2)' }}
                >
                  <Beaker size={20} style={{ color: 'rgb(var(--color-primary))' }} />
                </div>
                <div className="flex-1">
                  <p className="font-body-sm font-bold" style={{ color: 'rgb(var(--color-primary))' }}>Create Project</p>
                  <p className="font-body-sm" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>Start a new project under this organization.</p>
                </div>
                <Plus size={16} style={{ color: 'rgb(var(--color-on-surface-variant))' }} />
              </div>
            </div>
          </Link>
          <Link to={`/research/new?organization=${id}`} className="block">
            <div
              className="p-lg rounded-lg transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
              style={{
                background: 'rgb(var(--color-surface-container-low))',
                border: '1px solid rgb(var(--color-outline-variant))',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgb(var(--color-primary) / 0.5)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgb(var(--color-outline-variant))'; }}
            >
              <div className="flex items-center gap-md">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-lg"
                  style={{ background: 'rgb(var(--color-primary) / 0.1)', border: '1px solid rgb(var(--color-primary) / 0.2)' }}
                >
                  <FlaskConical size={20} style={{ color: 'rgb(var(--color-primary))' }} />
                </div>
                <div className="flex-1">
                  <p className="font-body-sm font-bold" style={{ color: 'rgb(var(--color-primary))' }}>Create Research</p>
                  <p className="font-body-sm" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>Submit a new research paper or preprint.</p>
                </div>
                <Plus size={16} style={{ color: 'rgb(var(--color-on-surface-variant))' }} />
              </div>
            </div>
          </Link>
          <Link to={`/hackathons/new?organization=${id}`} className="block">
            <div
              className="p-lg rounded-lg transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
              style={{
                background: 'rgb(var(--color-surface-container-low))',
                border: '1px solid rgb(var(--color-outline-variant))',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgb(var(--color-primary) / 0.5)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgb(var(--color-outline-variant))'; }}
            >
              <div className="flex items-center gap-md">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-lg"
                  style={{ background: 'rgb(var(--color-primary) / 0.1)', border: '1px solid rgb(var(--color-primary) / 0.2)' }}
                >
                  <Trophy size={20} style={{ color: 'rgb(var(--color-primary))' }} />
                </div>
                <div className="flex-1">
                  <p className="font-body-sm font-bold" style={{ color: 'rgb(var(--color-primary))' }}>Create Hackathon</p>
                  <p className="font-body-sm" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>Organize a new hackathon event.</p>
                </div>
                <Plus size={16} style={{ color: 'rgb(var(--color-on-surface-variant))' }} />
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default OrganizationDashboard;
