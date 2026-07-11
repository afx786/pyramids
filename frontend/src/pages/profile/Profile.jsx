import { Pencil, Plus } from 'lucide-react';
import ProjectCard from '../../components/common/ProjectCard.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import Avatar from '../../components/ui/Avatar.jsx';
import Button from '../../components/ui/Button.jsx';
import Card from '../../components/ui/Card.jsx';
import SkillTag from '../../components/ui/SkillTag.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

function SkillMeter({ skill }) {
  return (
    <div className="grid grid-cols-[88px_1fr] items-center gap-4">
      <span className="font-black text-primary">{skill}</span>
      <div className="h-4 overflow-hidden rounded-full bg-accent-soft">
        <div className="h-full rounded-full bg-accent" style={{ width: '60%' }} />
      </div>
    </div>
  );
}

function Profile() {
  const { user, profile, rankData } = useAuth();

  const displayUser = profile?.user ?? user;
  const skills = profile?.skills ?? [];
  const projects = profile?.projects ?? [];
  const stats = profile?.statistics ?? {};

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        eyebrow="Profile"
        title={`Hi ${displayUser?.name?.split(' ')[0] ?? '...'}` }
        description={rankData ? `${rankData.rank} · ${rankData.points} points` : 'Loading rank...'}
        actions={
          <>
            <Button variant="secondary">
              <Plus className="h-4 w-4" />
              Add Skills
            </Button>
            <Button>
              <Pencil className="h-4 w-4" />
              Update
            </Button>
          </>
        }
      />

      <section className="mt-12 grid grid-cols-[280px_1fr_220px] gap-8">
        <Card className="p-6">
          <h2 className="mb-6 text-lg font-black text-primary">Skills</h2>
          {skills.length > 0 ? (
            <div className="space-y-5">
              {skills.slice(0, 6).map((skill) => (
                <SkillMeter key={skill} skill={skill} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-secondary">No skills added yet.</p>
          )}
        </Card>

        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-primary">About</h2>
              <button className="text-primary" type="button" aria-label="Edit about">
                <Pencil className="h-5 w-5" />
              </button>
            </div>
            {displayUser?.program && (
              <p className="mt-4 rounded-lg bg-accent px-4 py-3 text-sm font-black text-app">
                {displayUser.program}
              </p>
            )}
            {displayUser?.bio ? (
              <p className="mt-4 rounded-lg bg-accent px-5 py-5 text-base font-bold leading-7 text-app">
                {displayUser.bio}
              </p>
            ) : (
              <p className="mt-4 text-sm text-secondary">No bio added yet.</p>
            )}
          </Card>

          {skills.length > 0 && (
            <Card className="p-6">
              <h2 className="text-xl font-black text-primary">All Skills</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <SkillTag key={skill}>{skill}</SkillTag>
                ))}
              </div>
            </Card>
          )}
        </div>

        <aside className="space-y-5">
          <Card className="flex flex-col items-center p-6 text-center">
            <Avatar src={displayUser?.profile_picture} alt={displayUser?.name} size="lg" className="h-28 w-28" />
            <h2 className="mt-4 text-xl font-black text-primary">{displayUser?.name ?? '—'}</h2>
            <p className="mt-1 text-sm font-bold text-secondary">{displayUser?.headline || 'Builder'}</p>
          </Card>

          <Card className="p-6">
            <h2 className="text-sm font-black uppercase tracking-[0.18em] text-secondary">Activity</h2>
            <div className="mt-5 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="font-bold text-secondary">Projects</span>
                <strong>{stats.total_projects ?? rankData?.projects_count ?? '—'}</strong>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-bold text-secondary">Skills</span>
                <strong>{rankData?.skills_count ?? skills.length}</strong>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-bold text-secondary">Rank points</span>
                <strong>{rankData?.points ?? '—'}</strong>
              </div>
            </div>
          </Card>
        </aside>
      </section>

      {projects.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-5 text-xl font-black text-primary">Projects</h2>
          <div className="space-y-4">
            {projects.slice(0, 3).map((project) => (
              <ProjectCard
                key={project.id}
                project={{
                  id: project.id,
                  title: project.title,
                  description: project.description,
                  creator: user?.name ?? 'You',
                  avatar: displayUser?.profile_picture,
                  stack: project.skills ?? [],
                }}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default Profile;
