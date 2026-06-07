import PageHeader from '../../components/common/PageHeader.jsx';
import Card from '../../components/ui/Card.jsx';
import { currentUser, rankMilestones } from '../../data/mockData.js';

function Pyramidion() {
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        eyebrow="Rank"
        title="Pyramidion"
        description="A builder rank based on project work, verified skills, and meaningful collaborations."
      />

      <section className="mt-10 grid grid-cols-[360px_1fr] gap-8">
        <Card className="p-8">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-secondary">Current Rank</p>
          <h2 className="mt-4 text-5xl font-black text-primary">{currentUser.rank}</h2>
          <p className="mt-2 text-xl font-black text-primary">{currentUser.rankLabel}</p>
          <p className="mt-4 text-sm font-medium leading-6 text-secondary">
            {currentUser.points} points from projects, connections, and verified skills.
          </p>
          <div className="mt-8 h-3 overflow-hidden rounded-full bg-accent-soft">
            <div className="h-full rounded-full bg-accent" style={{ width: `${currentUser.nextRankProgress}%` }} />
          </div>
          <div className="mt-3 flex justify-between text-sm font-black">
            <span className="text-secondary">Next rank</span>
            <span className="text-primary">{currentUser.nextRankProgress}%</span>
          </div>
        </Card>

        <Card className="p-8">
          <h2 className="text-2xl font-black text-primary">Rank Path</h2>
          <div className="mt-8 space-y-5">
            {rankMilestones.map((milestone) => (
              <div key={milestone.label} className="flex items-center gap-4">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-full text-sm font-black ${
                    milestone.complete ? 'bg-primary text-app' : 'bg-accent-soft text-primary'
                  }`}
                >
                  {milestone.label}
                </div>
                <div>
                  <p className="font-black text-primary">{milestone.title}</p>
                  <p className="text-sm font-medium text-secondary">
                    {milestone.complete ? 'Unlocked through verified work' : 'Keep building to unlock'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}

export default Pyramidion;
