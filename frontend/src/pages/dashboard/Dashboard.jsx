import { useEffect, useState } from 'react';
import { ArrowUpRight, GitBranch, MessageSquare, Plus, ShieldCheck, UsersRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProjectCard from '../../components/common/ProjectCard.jsx';
import Button from '../../components/ui/Button.jsx';
import Card from '../../components/ui/Card.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { connectionService } from '../../services/connectionService.js';
import { projectService } from '../../services/projectService.js';

const rankBands = [
  { name: 'Explorer', min: 0, next: 50 },
  { name: 'Builder', min: 50, next: 100 },
  { name: 'Creator', min: 100, next: 200 },
  { name: 'Architect', min: 200, next: 400 },
  { name: 'Pyramidion', min: 400, next: null },
];

function getRankProgress(rankData) {
  if (!rankData) return { progress: 0, nextRank: 'Builder', remaining: 50 };

  const points = rankData.points ?? 0;
  const band = rankBands.find((item) => points >= item.min && (item.next === null || points < item.next)) ?? rankBands[0];

  if (band.next === null) {
    return { progress: 100, nextRank: 'Top rank', remaining: 0 };
  }

  const span = band.next - band.min;
  const progress = Math.min(100, Math.round(((points - band.min) / span) * 100));
  const nextRank = rankBands.find((item) => item.min === band.next)?.name ?? 'next rank';

  return { progress, nextRank, remaining: band.next - points };
}

function Dashboard() {
  const { user, rankData } = useAuth();
  const [projects, setProjects] = useState([]);
  const [connections, setConnections] = useState([]);

  useEffect(() => {
    projectService.listProjects().then(setProjects).catch(() => {});
    connectionService.listConnections().then(setConnections).catch(() => {});
  }, []);

  const { progress, nextRank, remaining } = getRankProgress(rankData);
  const firstName = user?.name?.split(' ')[0] ?? 'Builder';
  const visibleProjects = projects.slice(0, 5);
  const verifiedSkillCount = rankData?.skills_count ?? 0;

  return (
    <div className="mx-auto max-w-7xl pb-16 lg:pb-0">
      <section className="grid gap-6 pt-4 lg:grid-cols-[minmax(0,1fr)_340px] lg:pt-8">
        <div className="rounded-lg border border-subtle bg-elevated p-6 shadow-sm sm:p-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-accent-soft px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-accent">
              {rankData?.rank ?? 'Explorer'}
            </span>
            <span className="text-sm font-semibold text-secondary">{rankData?.points ?? 0} points</span>
          </div>
          <h1 className="mt-5 max-w-3xl text-3xl font-black leading-tight text-primary sm:text-5xl">
            Welcome back, {firstName}. Build the proof behind your skills.
          </h1>
          <p className="mt-4 max-w-2xl text-base font-medium leading-7 text-secondary">
            Add projects, verify GitHub repositories, find collaborators, and turn real work into rank progress.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
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
            <Link to="/messages">
              <Button variant="ghost">
                <MessageSquare className="h-4 w-4" />
                Messages
              </Button>
            </Link>
          </div>
        </div>

        <Card className="bg-sidebar p-6 text-white">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-white/55">Rank Progress</p>
              <h2 className="mt-3 text-3xl font-black text-white">{rankData?.rank ?? 'Explorer'}</h2>
            </div>
            <ShieldCheck className="h-8 w-8 text-accent" strokeWidth={1.7} />
          </div>
          <p className="mt-4 text-sm font-medium leading-6 text-white/72">
            {remaining > 0 ? `${remaining} points until ${nextRank}.` : 'You have reached the highest rank.'}
          </p>
          <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/12">
            <div className="h-full rounded-full bg-accent" style={{ width: `${progress}%` }} />
          </div>
          <div className="mt-4 flex items-center justify-between text-sm font-bold text-white">
            <span>{progress}%</span>
            <span>{verifiedSkillCount} verified skills</span>
          </div>
        </Card>
      </section>

      <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="bg-elevated p-5">
          <p className="text-sm font-bold text-secondary">Projects</p>
          <strong className="mt-2 block text-3xl font-black text-primary">{rankData?.projects_count ?? projects.length}</strong>
        </Card>
        <Card className="bg-elevated p-5">
          <p className="text-sm font-bold text-secondary">Verified skills</p>
          <strong className="mt-2 block text-3xl font-black text-primary">{verifiedSkillCount}</strong>
        </Card>
        <Card className="bg-elevated p-5">
          <p className="text-sm font-bold text-secondary">Connections</p>
          <strong className="mt-2 block text-3xl font-black text-primary">{connections.length}</strong>
        </Card>
        <Card className="bg-elevated p-5">
          <p className="text-sm font-bold text-secondary">Next action</p>
          <Link className="mt-3 inline-flex items-center gap-2 text-sm font-black text-accent" to="/projects/new">
            Verify a repo
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Card>
      </section>

      <section className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-xl font-black text-primary">Project Feed</h2>
              <p className="mt-1 text-sm font-medium text-secondary">Recent builds from students across your campus network.</p>
            </div>
            <Link className="text-sm font-black text-accent" to="/domains">
              Browse domains
            </Link>
          </div>
          <div className="space-y-4">
            {visibleProjects.length === 0 ? (
              <Card className="bg-elevated p-8 text-center">
                <GitBranch className="mx-auto h-10 w-10 text-accent" strokeWidth={1.6} />
                <h3 className="mt-4 text-lg font-black text-primary">No projects yet</h3>
                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-secondary">
                  Add your first build and connect it to a public GitHub repository so Pyramids can verify your skills.
                </p>
                <Link className="mt-5 inline-flex" to="/projects/new">
                  <Button>
                    <Plus className="h-4 w-4" />
                    Add Project
                  </Button>
                </Link>
              </Card>
            ) : (
              visibleProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={{
                    id: project.id,
                    title: project.title,
                    description: project.description,
                    creator: project.owner_name || 'Builder',
                    avatar: null,
                    stack:
                      project.skills?.length > 0
                        ? project.skills
                        : project.technologies?.map((technology) => technology.name) ?? [],
                  }}
                />
              ))
            )}
          </div>
        </div>

        <aside className="space-y-4">
          <Card className="bg-elevated p-6">
            <h2 className="text-lg font-black text-primary">Quick Build Path</h2>
            <div className="mt-5 space-y-4">
              {[
                ['1', 'Create a project profile', 'Explain the problem, stack, and what you built.'],
                ['2', 'Attach GitHub evidence', 'Let repository intelligence read languages, files, tests, and CI.'],
                ['3', 'Invite collaborators', 'Bring teammates into the project and grow your network.'],
              ].map(([step, title, description]) => (
                <div key={step} className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-accent-soft text-xs font-black text-accent">
                    {step}
                  </span>
                  <div>
                    <p className="text-sm font-black text-primary">{title}</p>
                    <p className="mt-1 text-sm leading-6 text-secondary">{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {connections.length > 0 && (
            <Card className="bg-elevated p-6">
              <h2 className="text-lg font-black text-primary">Recent Connections</h2>
              <div className="mt-4 space-y-3">
                {connections.slice(0, 4).map((conn) => (
                  <div key={conn.id} className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-black text-primary">{conn.user.name}</p>
                      <p className="truncate text-xs font-semibold text-secondary">{conn.user.headline || 'Builder'}</p>
                    </div>
                    <Link className="shrink-0 text-xs font-black text-accent" to="/messages">
                      Message
                    </Link>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </aside>
      </section>
    </div>
  );
}

export default Dashboard;
