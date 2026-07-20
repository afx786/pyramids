import { useEffect, useState } from 'react';
import { Medal, Trophy } from 'lucide-react';
import LoadingState from '../../components/common/LoadingState.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import Card from '../../components/ui/Card.jsx';
import { leaderboardService } from '../../services/leaderboardService.js';

const rankStyles = {
  1: { color: 'rgb(var(--color-warning))' },
  2: { color: 'rgb(var(--color-on-surface-variant))' },
  3: { color: 'rgb(var(--color-primary) / 0.6)' },
};

function Leaderboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    leaderboardService.getLeaderboard()
      .then(setUsers)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingState label="Loading leaderboard..." />;

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        eyebrow="Rankings"
        title="Leaderboard"
        description="Top builders ranked by project and skill points."
      />

      <section className="mt-10 space-y-3">
        {users.length > 0 ? (
          users.map((u, idx) => {
            const rank = idx + 1;
            return (
              <Card key={u.id} className="flex items-center gap-5 p-5">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-black text-sm ${
                  rank <= 3 ? 'bg-primary text-app' : 'bg-accent-soft text-primary'
                }`}>
                  {rank <= 3 ? <Trophy className="h-5 w-5" style={rankStyles[rank] || {}} /> : rank}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-primary">{u.name}</p>
                  <p className="text-xs font-medium text-secondary">{u.rank || 'Builder'}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-black text-primary">{u.points}</p>
                  <p className="text-xs font-medium text-secondary">pts</p>
                </div>
              </Card>
            );
          })
        ) : (
          <Card className="p-8 text-center">
            <Medal className="mx-auto h-8 w-8 text-secondary" />
            <p className="mt-3 text-sm text-secondary">No rankings yet.</p>
          </Card>
        )}
      </section>
    </div>
  );
}

export default Leaderboard;
