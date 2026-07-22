import { useEffect, useState } from 'react';
import { ShieldCheck, Users, GitBranch } from 'lucide-react';
import { formatShortBatch } from '../../utils/batch.js';
import ErrorState from '../../components/common/ErrorState.jsx';
import LoadingState from '../../components/common/LoadingState.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import Card from '../../components/ui/Card.jsx';
import { api } from '../../services/api.js';

function Admin() {
  const [dashboard, setDashboard] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentProjects, setRecentProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([
      api.get('/admin/dashboard/cards'),
      api.get('/admin/recent/users'),
      api.get('/admin/recent/projects'),
    ])
      .then(([dash, users, projects]) => {
        setDashboard(dash);
        setRecentUsers(Array.isArray(users) ? users.slice(0, 10) : []);
        setRecentProjects(Array.isArray(projects) ? projects.slice(0, 10) : []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingState label="Loading admin..." />;
  if (error) return <ErrorState title={error} />;

  const stats = dashboard ? [
    { label: 'Total Users', value: dashboard.total_users ?? '—', icon: Users },
    { label: 'Total Projects', value: dashboard.total_projects ?? '—', icon: GitBranch },
    { label: 'Verified', value: dashboard.verified_projects ?? '—', icon: ShieldCheck },
  ] : [];

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader eyebrow="Admin" title="Admin Dashboard" description="Platform overview and moderation." />

      <section className="mt-10 grid gap-5 sm:grid-cols-3">
        {stats.map((s) => (
          <Card key={s.label} className="p-6">
            <div className="flex items-center gap-3">
              <s.icon className="h-5 w-5 text-secondary" />
              <p className="text-sm font-medium text-secondary">{s.label}</p>
            </div>
            <p className="mt-4 text-3xl font-black text-primary">{s.value}</p>
          </Card>
        ))}
      </section>

      <div className="mt-8 grid gap-8 xl:grid-cols-2">
        <Card className="p-6">
          <p className="font-mono-label text-[11px] text-secondary">Recent Users</p>
          <div className="mt-5 space-y-3">
            {recentUsers.length > 0 ? recentUsers.map((u) => (
              <div key={u.id} className="flex items-center justify-between border-t border-subtle pt-3 first:border-t-0 first:pt-0">
                <span className="text-sm font-semibold text-primary">
                  {u.name || `User #${u.id}`}
                  {(() => {
                    const batch = formatShortBatch(u.joining_year, u.graduating_year);
                    return batch ? <span className="font-mono text-[10px] ml-1" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>({batch})</span> : null;
                  })()}
                </span>
                <span className="text-xs text-secondary">{u.email || '—'}</span>
              </div>
            )) : <p className="text-sm text-secondary">No users yet.</p>}
          </div>
        </Card>

        <Card className="p-6">
          <p className="font-mono-label text-[11px] text-secondary">Recent Projects</p>
          <div className="mt-5 space-y-3">
            {recentProjects.length > 0 ? recentProjects.map((p) => (
              <div key={p.id} className="flex items-center justify-between border-t border-subtle pt-3 first:border-t-0 first:pt-0">
                <span className="text-sm font-semibold text-primary">{p.title || `Project #${p.id}`}</span>
                <span className="text-xs text-secondary">{p.domain || '—'}</span>
              </div>
            )) : <p className="text-sm text-secondary">No projects yet.</p>}
          </div>
        </Card>
      </div>
    </div>
  );
}

export default Admin;
