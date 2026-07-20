import { useEffect, useState } from 'react';
import { ArrowUpRight, GitBranch, Plus, UsersRound, Terminal, ShieldCheck, CheckCircle, Bolt } from 'lucide-react';
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
  { name: 'Architect', min: 100, next: 200 },
  { name: 'Innovator', min: 200, next: 400 },
  { name: 'Pyramidion', min: 400, next: null },
];

function getRankProgress(rankData) {
  if (!rankData) return { progress: 0, nextRank: 'Builder', remaining: 50 };
  const points = rankData.points ?? 0;
  const band = rankBands.find((item) => points >= item.min && (item.next === null || points < item.next)) ?? rankBands[0];
  if (band.next === null) return { progress: 100, nextRank: 'Top rank', remaining: 0 };
  const span = band.next - band.min;
  const progress = Math.min(100, Math.round(((points - band.min) / span) * 100));
  const nextRank = rankBands.find((item) => item.min === band.next)?.name ?? 'next rank';
  return { progress, nextRank, remaining: band.next - points };
}

function Dashboard() {
  const { user, rankData } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    projectService.listProjects().then(setProjects).catch((err) => setLoadError(err.message));
  }, []);

  const { progress, nextRank, remaining } = getRankProgress(rankData);
  const firstName = user?.name?.split(' ')[0] ?? 'Builder';
  const visibleProjects = projects.slice(0, 5);
  const verifiedSkillCount = rankData?.skills_count ?? 0;
  const rankPoints = rankData?.points ?? 0;
  const rankLabel = rankData?.rank ?? 'Explorer';

  const circumference = 2 * Math.PI * 58;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="pb-16 lg:pb-0">
      {/* Header */}
      <section className="mb-2xl">
        <h2 className="font-display-serif text-display-serif mb-xs" style={{ color: 'rgb(var(--color-on-surface))' }}>
          Builder Workspace
        </h2>
        <p className="font-body-lg text-body-lg max-w-2xl" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
          Welcome back, {firstName}. Your last verification was 4 hours ago. {verifiedSkillCount} skills are ready for architectural extraction.
        </p>
      </section>

      {loadError && (
        <div className="mb-lg rounded-lg px-lg py-md" style={{ background: 'rgb(var(--color-error-container))', color: 'rgb(var(--color-on-error-container))' }}>
          <p className="font-body-sm font-semibold">{loadError}</p>
        </div>
      )}

      {/* Primary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-lg mb-lg">
        <div className="card-border p-xl rounded-lg" style={{ background: 'rgb(var(--color-surface-container-low))' }}>
          <span className="font-label-caps text-label-caps uppercase tracking-widest" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>Verified Repos</span>
          <div className="flex items-baseline gap-sm mt-sm">
            <span className="font-headline-lg text-headline-lg font-bold" style={{ color: 'rgb(var(--color-primary))' }}>{projects.length}</span>
            <span className="font-mono" style={{ color: 'rgb(var(--color-on-primary-container))' }}>+2 this week</span>
          </div>
        </div>
        <div className="card-border p-xl rounded-lg" style={{ background: 'rgb(var(--color-surface-container-low))' }}>
          <span className="font-label-caps text-label-caps uppercase tracking-widest" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>Skills Extracted</span>
          <div className="flex items-baseline gap-sm mt-sm">
            <span className="font-headline-lg text-headline-lg font-bold" style={{ color: 'rgb(var(--color-primary))' }}>{verifiedSkillCount}</span>
            <span className="font-mono" style={{ color: 'rgb(var(--color-on-primary-container))' }}>Top 5% Rank</span>
          </div>
        </div>
        <div className="card-border p-xl rounded-lg" style={{ background: 'rgb(var(--color-surface-container-low))' }}>
          <span className="font-label-caps text-label-caps uppercase tracking-widest" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>Reputation Points</span>
          <div className="flex items-baseline gap-sm mt-sm">
            <span className="font-headline-lg text-headline-lg font-bold" style={{ color: 'rgb(var(--color-primary))' }}>{(rankPoints / 1000).toFixed(1)}k</span>
            <span className="font-mono" style={{ color: 'rgb(var(--color-on-primary-container))' }}>{rankLabel} Track</span>
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-12 gap-lg">
        {/* Active Projects */}
        <div className="col-span-12 lg:col-span-8">
          <div className="flex items-center justify-between mb-lg">
            <h3 className="font-headline-md text-headline-md font-semibold" style={{ color: 'rgb(var(--color-on-surface))' }}>Active Projects</h3>
            <Link to="/projects" className="font-body-sm hover:opacity-80 transition-opacity" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>View All</Link>
          </div>
          <div className="grid grid-cols-1 gap-md">
            {visibleProjects.length === 0 ? (
              <Card className="flex flex-col items-center justify-center py-2xl text-center stagger">
                <GitBranch className="h-8 w-8 mb-md" style={{ color: 'rgb(var(--color-on-surface-variant))' }} strokeWidth={1.5} />
                <h3 className="font-headline-md" style={{ color: 'rgb(var(--color-on-surface))' }}>No projects yet</h3>
                <p className="font-body-sm mt-sm max-w-md" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>Add your first build and connect it to a public GitHub repository.</p>
                <Link to="/projects/new" className="mt-lg"><Button><Plus className="h-4 w-4" strokeWidth={1.5} />Add Project</Button></Link>
              </Card>
            ) : (
              visibleProjects.map((project, idx) => (
                <article key={project.id} className="card-border p-lg rounded-lg card-hover group" style={{ background: 'rgb(var(--color-surface-container-low))' }}>
                  <div className="flex items-start justify-between mb-lg">
                    <div className="flex gap-md">
                      <div className="w-12 h-12 rounded flex items-center justify-center card-border" style={{ background: 'rgb(var(--color-surface-container-highest))' }}>
                        <Terminal className="h-6 w-6" strokeWidth={1.5} style={{ color: 'rgb(var(--color-primary))' }} />
                      </div>
                      <div>
                        <h4 className="font-headline-md font-bold" style={{ color: 'rgb(var(--color-on-surface))' }}>{project.title}</h4>
                        <p className="font-body-sm" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>{project.description || 'No description'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-sm">
                      <span className="flex h-2 w-2 rounded-full" style={{ background: 'rgb(var(--color-success))' }} />
                      <span className="font-mono text-[12px]" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>Live Sync</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-xl">
                    <div className="flex -space-x-2">
                      <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-[10px] font-bold" style={{ borderColor: 'rgb(var(--color-surface-container-low))', background: 'rgb(var(--color-surface-container-highest))' }}>+3</div>
                    </div>
                    <div className="flex items-center gap-md">
                      <div className="flex flex-col items-end">
                        <span className="font-label-caps text-[10px] uppercase" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>GitHub Sync</span>
                        <span className="font-mono" style={{ color: 'rgb(var(--color-primary))' }}>main/fe4a21</span>
                      </div>
                      <ArrowUpRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'rgb(var(--color-on-surface-variant))' }} strokeWidth={1.5} />
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>

        {/* Right column: Rank + Activity */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-lg">
          {/* Rank Progression */}
          <div className="card-border p-lg rounded-lg" style={{ background: 'rgb(var(--color-surface-container-low))' }}>
            <div className="flex items-center justify-between mb-lg">
              <h3 className="font-body-sm font-bold" style={{ color: 'rgb(var(--color-on-surface))' }}>Rank Progression</h3>
            </div>
            <div className="flex flex-col items-center py-lg">
              <div className="relative w-32 h-32 flex items-center justify-center mb-lg">
                <svg className="absolute inset-0 w-full h-full -rotate-90">
                  <circle cx="64" cy="64" fill="transparent" r="58" stroke="currentColor" strokeWidth="2" style={{ color: 'rgb(var(--color-surface-container-highest))' }} />
                  <circle cx="64" cy="64" fill="transparent" r="58" stroke="currentColor" strokeWidth="2" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} className="transition-all duration-1000" style={{ color: 'rgb(var(--color-primary))' }} />
                </svg>
                <div className="flex flex-col items-center">
                  <ShieldCheck className="h-8 w-8" strokeWidth={1.5} style={{ color: 'rgb(var(--color-primary))' }} />
                  <span className="font-mono font-bold mt-sm" style={{ color: 'rgb(var(--color-primary))' }}>{progress}%</span>
                </div>
              </div>
              <div className="text-center">
                <p className="font-body-sm font-semibold" style={{ color: 'rgb(var(--color-on-surface))' }}>Level: {rankLabel}</p>
                <p className="font-body-sm" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
                  {remaining > 0 ? `${remaining} points to ${nextRank}` : 'Highest rank reached'}
                </p>
              </div>
            </div>
            <div className="mt-lg pt-lg" style={{ borderTop: '1px solid rgb(var(--color-outline-variant))' }}>
              <div className="flex justify-between items-center py-sm">
                <span className="font-body-sm" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>Consistency</span>
                <span className="font-mono text-[12px]" style={{ color: 'rgb(var(--color-primary))' }}>High (9.4)</span>
              </div>
              <div className="flex justify-between items-center py-sm">
                <span className="font-body-sm" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>Complexity</span>
                <span className="font-mono text-[12px]" style={{ color: 'rgb(var(--color-primary))' }}>Architect-Ready</span>
              </div>
            </div>
          </div>

          {/* Building Feed */}
          <div className="card-border p-lg rounded-lg flex-1" style={{ background: 'rgb(var(--color-surface-container-low))' }}>
            <div className="flex items-center justify-between mb-lg">
              <h3 className="font-body-sm font-bold" style={{ color: 'rgb(var(--color-on-surface))' }}>Building Feed</h3>
            </div>
            <div className="space-y-lg">
              <div className="flex gap-md">
                <div className="mt-1">
                  <CheckCircle className="h-4 w-4" strokeWidth={1.5} style={{ color: 'rgb(var(--color-success))' }} />
                </div>
                <div className="flex flex-col">
                  <p className="font-body-sm" style={{ color: 'rgb(var(--color-on-surface))' }}>Repository Verified</p>
                  <span className="font-mono text-[11px] uppercase" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>pyramids/engine-v2 • 2h ago</span>
                </div>
              </div>
              <div className="flex gap-md">
                <div className="mt-1">
                  <UsersRound className="h-4 w-4" strokeWidth={1.5} style={{ color: 'rgb(var(--color-primary))' }} />
                </div>
                <div className="flex flex-col">
                  <p className="font-body-sm" style={{ color: 'rgb(var(--color-on-surface))' }}>Team Formed: Project Vector</p>
                  <span className="font-mono text-[11px] uppercase" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>3 Architects joined • 5h ago</span>
                </div>
              </div>
              <div className="flex gap-md">
                <div className="mt-1">
                  <Bolt className="h-4 w-4" strokeWidth={1.5} style={{ color: 'rgb(var(--color-on-primary-container))' }} />
                </div>
                <div className="flex flex-col">
                  <p className="font-body-sm" style={{ color: 'rgb(var(--color-on-surface))' }}>Skill Extracted: Rust Safety</p>
                  <span className="font-mono text-[11px] uppercase" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>Lighthouse Engine • 1d ago</span>
                </div>
              </div>
              <div className="flex gap-md opacity-60">
                <div className="mt-1">
                  <GitBranch className="h-4 w-4" strokeWidth={1.5} style={{ color: 'rgb(var(--color-on-surface-variant))' }} />
                </div>
                <div className="flex flex-col">
                  <p className="font-body-sm" style={{ color: 'rgb(var(--color-on-surface))' }}>Commits Mirrored</p>
                  <span className="font-mono text-[11px] uppercase" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>14 commits linked • 2d ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Background atmospheric effect */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full blur-[120px]" style={{ background: 'rgb(var(--color-primary) / 0.03)' }} />
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full blur-[100px]" style={{ background: 'rgb(var(--color-surface-container-highest) / 0.08)' }} />
      </div>
    </div>
  );
}

export default Dashboard;
