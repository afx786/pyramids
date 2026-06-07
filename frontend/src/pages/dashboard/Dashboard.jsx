import { Plus, UsersRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProjectCard from '../../components/common/ProjectCard.jsx';
import UserCard from '../../components/common/UserCard.jsx';
import Button from '../../components/ui/Button.jsx';
import Card from '../../components/ui/Card.jsx';
import { collaborators, currentUser, projects } from '../../data/mockData.js';

function Dashboard() {
  return (
    <div className="mx-auto max-w-6xl">
      <section className="pt-20 text-center">
        <h1 className="text-[56px] font-black leading-none tracking-normal text-primary">Welcome back, {currentUser.name}</h1>
        <p className="mt-7 text-[22px] font-black text-primary">Who are we looking for today?</p>
        <div className="mt-8 flex justify-center gap-3">
          <Link to="/projects/new">
            <Button>
              <Plus className="h-4 w-4" />
              Add Project
            </Button>
          </Link>
          <Link to="/teams">
            <Button variant="secondary">
              <UsersRound className="h-4 w-4" />
              Build Team
            </Button>
          </Link>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-3xl">
        <h2 className="mb-6 text-lg font-black text-primary">Connect with:</h2>
        <div className="grid grid-cols-4 gap-5">
          {collaborators.map((user) => (
            <UserCard key={user.id} user={user} />
          ))}
        </div>
      </section>

      <section className="mt-16 grid grid-cols-[1fr_280px] gap-8">
        <div>
          <div className="mb-5">
            <h2 className="text-lg font-black text-primary">Project Feed</h2>
            <p className="mt-1 text-sm font-medium text-secondary">Recent builds from students across your campus network.</p>
          </div>
          <div className="space-y-4">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>

        <aside className="space-y-4">
          <Card className="p-6">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-secondary">Rank Summary</p>
            <h2 className="mt-3 text-2xl font-black text-primary">{currentUser.rank}</h2>
            <p className="mt-2 text-sm font-medium leading-6 text-secondary">
              Your rank grows as your projects verify real skills and collaborations.
            </p>
            <div className="mt-6 h-2 overflow-hidden rounded-full bg-accent-soft">
              <div className="h-full rounded-full bg-accent" style={{ width: `${currentUser.nextRankProgress}%` }} />
            </div>
            <div className="mt-4 flex items-center justify-between text-sm font-bold">
              <span className="text-secondary">Progress</span>
              <span className="text-primary">{currentUser.nextRankProgress}%</span>
            </div>
          </Card>

          <Card className="p-6">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-secondary">This Week</p>
            <div className="mt-5 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-secondary">New builders</span>
                <strong className="text-primary">18</strong>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-secondary">Projects posted</span>
                <strong className="text-primary">7</strong>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-secondary">Team invites</span>
                <strong className="text-primary">4</strong>
              </div>
            </div>
          </Card>
        </aside>
      </section>
    </div>
  );
}

export default Dashboard;
