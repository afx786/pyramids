import { useEffect, useState } from 'react';
import { BarChart3 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import Card from '../../components/ui/Card.jsx';
import { api } from '../../services/api.js';

function Stats() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (!user?.id) return;
    api.get(`/stats/user/${user.id}`).then(setStats).catch(() => {});
  }, [user?.id]);

  const items = stats ? [
    { label: 'Projects', value: stats.projects_count ?? 0 },
    { label: 'Skills', value: stats.skills_count ?? 0 },
    { label: 'Points', value: stats.points ?? 0 },
    { label: 'Rank', value: stats.rank || '—' },
  ] : [];

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        eyebrow="Analytics"
        title="Your Stats"
        description="Overview of your platform activity and contributions."
      />

      <section className="mt-10 grid gap-5 sm:grid-cols-2">
        {items.map((item) => (
          <Card key={item.label} className="p-8">
            <p className="text-sm font-medium text-secondary">{item.label}</p>
            <p className="mt-2 text-4xl font-black text-primary">{item.value}</p>
          </Card>
        ))}
        {!stats && (
          <div className="col-span-full">
            <Card className="p-8 text-center">
              <BarChart3 className="mx-auto h-8 w-8 text-secondary" />
              <p className="mt-3 text-sm text-secondary">Stats loading...</p>
            </Card>
          </div>
        )}
      </section>
    </div>
  );
}

export default Stats;
