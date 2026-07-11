import { useEffect, useState } from 'react';
import { Plus, UsersRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProjectCard from '../../components/common/ProjectCard.jsx';
import UserCard from '../../components/common/UserCard.jsx';
import Button from '../../components/ui/Button.jsx';
import Card from '../../components/ui/Card.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { projectService } from '../../services/projectService.js';
import { connectionService } from '../../services/connectionService.js';

function Dashboard() {
  const { user, rankData } = useAuth();
  const [projects, setProjects] = useState([]);
  const [connections, setConnections] = useState([]);

  useEffect(() => {
    projectService.listProjects().then(setProjects).catch(() => {});
    connectionService.listConnections().then(setConnections).catch(() => {});
  }, []);

  const progress = rankData
    ? Math.min(100, Math.round(((rankData.points % 50) / 50) * 100))
    : 0;

  return (
    <div className="mx-auto max-w-6xl">
      <section className="pt-20 text-center">
        <h1 className="text-[56px] font-black leading-none tracking-normal text-primary">
          Welcome back, {user?.name ?? '...'}
        </h1>
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

      {connections.length > 0 && (
        <section className="mx-auto mt-16 max-w-3xl">
          <h2 className="mb-6 text-lg font-black text-primary">Your Connections</h2>
          <div className="grid grid-cols-4 gap-5">
            {connections.slice(0, 8).map((conn) => (
              <UserCard
                key={conn.id}
                user={{
                  avatar: conn.user.profile_picture,
                  name: conn.user.name,
                  role: conn.user.headline || 'Builder',
                  skills: [],
                }}
              />
            ))}
          </div>
        </section>
      )}

      <section className="mt-16 grid grid-cols-[1fr_280px] gap-8">
        <div>
          <div className="mb-5">
            <h2 className="text-lg font-black text-primary">Project Feed</h2>
            <p className="mt-1 text-sm font-medium text-secondary">Recent builds from students across your campus network.</p>
          </div>
          <div className="space-y-4">
            {projects.length === 0 ? (
              <p className="text-sm text-secondary">No projects yet. Be the first to add one!</p>
            ) : (
              projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={{
                    id: project.id,
                    title: project.title,
                    description: project.description,
                    creator: project.owner_name || 'Builder',
                    avatar: null,
                    stack: project.skills.length > 0 ? project.skills : project.technologies.map((t) => t.name),
                  }}
                />
              ))
            )}
          </div>
        </div>

        <aside className="space-y-4">
          <Card className="p-6">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-secondary">Rank Summary</p>
            <h2 className="mt-3 text-2xl font-black text-primary">{rankData?.rank ?? '—'}</h2>
            <p className="mt-2 text-sm font-medium leading-6 text-secondary">
              {rankData
                ? `${rankData.points} points from ${rankData.projects_count} projects and ${rankData.skills_count} skills.`
                : 'Your rank grows as your projects verify real skills and collaborations.'}
            </p>
            <div className="mt-6 h-2 overflow-hidden rounded-full bg-accent-soft">
              <div className="h-full rounded-full bg-accent" style={{ width: `${progress}%` }} />
            </div>
            <div className="mt-4 flex items-center justify-between text-sm font-bold">
              <span className="text-secondary">Progress</span>
              <span className="text-primary">{progress}%</span>
            </div>
          </Card>

          <Card className="p-6">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-secondary">Platform</p>
            <div className="mt-5 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-secondary">Your projects</span>
                <strong className="text-primary">{rankData?.projects_count ?? '—'}</strong>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-secondary">Verified skills</span>
                <strong className="text-primary">{rankData?.skills_count ?? '—'}</strong>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-secondary">Connections</span>
                <strong className="text-primary">{connections.length}</strong>
              </div>
            </div>
          </Card>
        </aside>
      </section>
    </div>
  );
}

export default Dashboard;
