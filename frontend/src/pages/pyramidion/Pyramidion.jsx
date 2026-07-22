import PageHeader from '../../components/common/PageHeader.jsx';
import Card from '../../components/ui/Card.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

const RANK_TIERS = [
  { key: 'Explorer', title: 'Explorer', threshold: 0, next: 50 },
  { key: 'Builder', title: 'Builder', threshold: 50, next: 100 },
  { key: 'Creator', title: 'Creator', threshold: 100, next: 200 },
  { key: 'Architect', title: 'Architect', threshold: 200, next: 400 },
  { key: 'Pyramidion', title: 'Pyramidion', threshold: 400, next: Infinity },
];

function getProgress(rank, points) {
  const tier = RANK_TIERS.find((t) => t.key === rank);
  if (!tier || tier.next === Infinity) return 100;
  return Math.min(100, Math.round(((points - tier.threshold) / (tier.next - tier.threshold)) * 100));
}

function Pyramidion() {
  const { rankData } = useAuth();
  const rank = rankData?.rank ?? '—';
  const points = rankData?.points ?? 0;
  const progress = rankData ? getProgress(rankData.rank, points) : 0;

  const currentTierIndex = RANK_TIERS.findIndex((t) => t.key === rank);

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        eyebrow="Rank"
        title="Pyramidion"
        description="A builder rank based on project work, verified skills, and meaningful collaborations."
      />

      <section className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[360px_1fr]">
        <Card className="p-8">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-secondary">Current Rank</p>
          <h2 className="mt-4 text-5xl font-black text-primary">{rank}</h2>
          <p className="mt-4 text-sm font-medium leading-6 text-secondary">
            {points} points from projects and verified skills.
          </p>
          <div className="mt-8 h-3 overflow-hidden rounded-full bg-accent-soft">
            <div className="h-full rounded-full bg-accent" style={{ width: `${progress}%` }} />
          </div>
          <div className="mt-3 flex justify-between text-sm font-black">
            <span className="text-secondary">Next rank</span>
            <span className="text-primary">{progress}%</span>
          </div>
        </Card>

        <Card className="p-8">
          <h2 className="text-2xl font-black text-primary">Rank Path</h2>
          <div className="mt-8 space-y-5">
            {RANK_TIERS.map((tier, index) => {
              const isComplete = currentTierIndex > index;
              const isCurrent = currentTierIndex === index;
              return (
                <div key={tier.key} className="flex items-center gap-4">
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-black ${
                      isComplete || isCurrent ? 'bg-primary text-app' : 'bg-accent-soft text-primary'
                    }`}
                  >
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-black text-primary">{tier.title}</p>
                    <p className="text-sm font-medium text-secondary">
                      {isComplete
                        ? 'Unlocked'
                        : isCurrent
                        ? `${points} / ${tier.next} pts`
                        : `Requires ${tier.threshold} pts`}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </section>
    </div>
  );
}

export default Pyramidion;
