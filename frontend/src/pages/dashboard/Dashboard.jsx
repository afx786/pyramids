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
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    projectService.listProjects().then(setProjects).catch((err) => setLoadError(err.message));
    connectionService.listConnections().then(setConnections).catch((err) => setLoadError(err.message));
  }, []);

  const { progress, nextRank, remaining } = getRankProgress(rankData);
  const firstName = user?.name?.split(' ')[0] ?? 'Builder';
  const visibleProjects = projects.slice(0, 5);
  const verifiedSkillCount = rankData?.skills_count ?? 0;

  return (
    <div className="mx-auto max-w-7xl pb-16 lg:pb-0">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl pt-4 lg:pt-6">
        <div
          className="absolute inset-0 rounded-2xl"
          style={{
            background:
              'linear-gradient(135deg, rgb(var(--color-accent) / 0.12) 0%, transparent 50%, rgb(var(--color-accent) / 0.04) 100%)',
          }}
        />
        <div
          className="absolute -right-20 -top-20 h-64 w-64 animate-float rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, rgb(var(--color-accent) / 0.3), transparent 70%)' }}
        />
        <div
          className="absolute -bottom-16 -left-16 h-48 w-48 animate-float rounded-full opacity-10"
          style={{ animationDelay: '2s', background: 'radial-gradient(circle, rgb(var(--color-accent) / 0.2), transparent 70%)' }}
        />

        <div className="relative grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
          <Card className="p-6 sm:p-8">
            <p className="font-mono-label text-[11px] text-secondary">Dashboard / builder workspace</p>
            <div className="mt-5 max-w-3xl">
              <h1 className="font-editorial text-4xl leading-tight sm:text-5xl">
                Welcome back,{' '}
                <span className="gradient-text">{firstName}</span>
                .<br />Keep building.
              </h1>
              <p className="mt-4 max-w-2xl text-sm font-medium leading-6 text-secondary sm:text-base">
                Track verified projects, find collaborators, and move your Pyramids rank forward with real repository evidence.
              </p>
            </div>
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
          </Card>

          <Card className="p-6" glow>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-mono-label text-[11px] text-secondary">Rank progress</p>
                <h2 className="mt-3 text-2xl font-semibold gradient-text">{rankData?.rank ?? 'Explorer'}</h2>
              </div>
              <div
                className="flex h-10 w-10 items-center justify-center rounded-lg"
                style={{ background: 'rgb(var(--color-glass))', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
              >
                <ShieldCheck className="h-5 w-5" strokeWidth={1.8} style={{ color: 'rgb(var(--color-accent))' }} />
              </div>
            </div>
            <p className="mt-4 text-sm font-medium leading-6 text-secondary">
              {remaining > 0 ? `${remaining} points until ${nextRank}.` : 'You have reached the highest rank.'}
            </p>
            <div className="mt-6 h-2 overflow-hidden rounded" style={{ background: 'rgb(var(--color-accent-soft))' }}>
              <div
                className="h-full rounded"
                style={{ width: `${progress}%`, background: 'linear-gradient(90deg, rgb(var(--color-accent)), rgb(var(--color-text-primary) / 0.5))' }}
              />
            </div>
            <div className="mt-4 flex items-center justify-between text-xs font-semibold" style={{ color: 'rgb(var(--color-text-secondary))' }}>
              <span>{progress}% complete</span>
              <span>{verifiedSkillCount} skills</span>
            </div>
          </Card>
        </div>
      </section>

      {loadError && (
        <div className="mt-5 rounded-lg border px-5 py-3" style={{ borderColor: 'rgb(var(--color-danger) / 0.3)', background: 'rgb(var(--color-danger) / 0.08)' }}>
          <p className="text-sm font-semibold" style={{ color: 'rgb(var(--color-danger))' }}>{loadError}</p>
        </div>
      )}

      <section className="stagger mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ['Projects', rankData?.projects_count ?? projects.length],
          ['Verified skills', verifiedSkillCount],
          ['Connections', connections.length],
        ].map(([label, value]) => (
          <Card key={label} className="p-5">
            <p className="text-sm font-medium text-secondary">{label}</p>
            <strong className="mt-3 block text-3xl font-semibold tracking-[-0.025em] gradient-text">{value}</strong>
          </Card>
        ))}
        <Card className="p-5">
          <p className="text-sm font-medium text-secondary">Next action</p>
          <Link className="mt-4 inline-flex items-center gap-2 text-sm font-semibold" style={{ color: 'rgb(var(--color-accent))' }} to="/projects/new">
            Verify a repository
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Card>
      </section>

      <section className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="font-mono-label text-[11px] text-secondary">Project feed</p>
              <h2 className="mt-2 text-xl font-semibold tracking-[-0.02em] text-primary">Recent proof of work</h2>
            </div>
            <Link className="inline-flex items-center gap-2 text-sm font-semibold" style={{ color: 'rgb(var(--color-accent))' }} to="/domains">
              Browse domains
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="stagger space-y-4">
            {visibleProjects.length === 0 ? (
              <Card className="p-8 text-center">
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-lg" style={{ background: 'rgb(var(--color-glass))' }}>
                  <GitBranch className="h-5 w-5" strokeWidth={1.8} style={{ color: 'rgb(var(--color-accent))' }} />
                </div>
                <h3 className="mt-5 text-lg font-semibold">No projects yet</h3>
                <p className="mx-auto mt-2 max-w-md text-sm font-medium leading-6 text-secondary">
                  Add your first build and connect it to a public GitHub repository so Pyramids can verify your skills.
                </p>
                <Link className="mt-6 inline-flex" to="/projects/new">
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
          <Card className="p-6">
            <p className="font-mono-label text-[11px] text-secondary">How Pyramids works</p>
            <div className="mt-5 space-y-5">
              {[
                ['01', 'Create a project profile', 'Explain the problem, stack, and what you built.'],
                ['02', 'Attach GitHub evidence', 'Repository intelligence reads languages, files, tests, and CI.'],
                ['03', 'Invite collaborators', 'Bring teammates into projects and grow your network.'],
              ].map(([step, title, description]) => (
                <div key={step} className="border-t pt-4 first:border-t-0 first:pt-0" style={{ borderColor: 'rgb(var(--color-border-subtle))' }}>
                  <p className="font-mono-label text-[11px] text-secondary">{step}</p>
                  <p className="mt-2 text-sm font-semibold">{title}</p>
                  <p className="mt-1 text-sm leading-6 text-secondary">{description}</p>
                </div>
              ))}
            </div>
          </Card>

          {connections.length > 0 && (
            <Card className="p-6">
              <p className="font-mono-label text-[11px] text-secondary">Recent connections</p>
              <div className="mt-5 space-y-4">
                {connections.slice(0, 4).map((conn) => (
                  <div key={conn.id} className="flex items-center justify-between gap-3 border-t pt-4 first:border-t-0 first:pt-0" style={{ borderColor: 'rgb(var(--color-border-subtle))' }}>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{conn.user.name}</p>
                      <p className="truncate text-xs font-medium text-secondary">{conn.user.headline || 'Builder'}</p>
                    </div>
                    <Link className="shrink-0 text-xs font-semibold" style={{ color: 'rgb(var(--color-accent))' }} to="/messages">
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
