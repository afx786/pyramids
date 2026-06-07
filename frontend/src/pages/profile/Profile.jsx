import { Pencil, Plus } from 'lucide-react';
import ProjectCard from '../../components/common/ProjectCard.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import Avatar from '../../components/ui/Avatar.jsx';
import Button from '../../components/ui/Button.jsx';
import Card from '../../components/ui/Card.jsx';
import SkillTag from '../../components/ui/SkillTag.jsx';
import { currentUser, projects } from '../../data/mockData.js';

function SkillMeter({ skill }) {
  return (
    <div className="grid grid-cols-[88px_1fr] items-center gap-4">
      <span className="font-black text-primary">{skill.name}</span>
      <div className="h-4 overflow-hidden rounded-full bg-accent-soft">
        <div className="h-full rounded-full bg-accent" style={{ width: `${skill.strength}%` }} />
      </div>
    </div>
  );
}

function Profile() {
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        eyebrow="Profile"
        title={`Hi ${currentUser.name.split(' ')[0]}`}
        description={`Rank ${currentUser.rank} · Almost there`}
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
          <h2 className="mb-6 text-lg font-black text-primary">Verified Skills</h2>
          <div className="space-y-5">
            {currentUser.verifiedSkills.map((skill) => (
              <SkillMeter key={skill.name} skill={skill} />
            ))}
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-primary">About</h2>
              <button className="text-primary" type="button" aria-label="Edit about">
                <Pencil className="h-5 w-5" />
              </button>
            </div>
            <p className="mt-4 rounded-lg bg-accent px-4 py-3 text-sm font-black text-app">
              {currentUser.program}
            </p>
            <p className="mt-4 rounded-lg bg-accent px-5 py-5 text-base font-bold leading-7 text-app">
              {currentUser.bio}
            </p>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-black text-primary">Declared Skills</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {currentUser.declaredSkills.map((skill) => (
                <SkillTag key={skill}>{skill}</SkillTag>
              ))}
            </div>
          </Card>
        </div>

        <aside className="space-y-5">
          <Card className="flex flex-col items-center p-6 text-center">
            <Avatar src={currentUser.avatar} alt={currentUser.name} size="lg" className="h-28 w-28" />
            <h2 className="mt-4 text-xl font-black text-primary">{currentUser.name}</h2>
            <p className="mt-1 text-sm font-bold text-secondary">{currentUser.role}</p>
          </Card>

          <Card className="p-6">
            <h2 className="text-sm font-black uppercase tracking-[0.18em] text-secondary">Activity</h2>
            <div className="mt-5 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="font-bold text-secondary">Projects</span>
                <strong>{currentUser.activity.projects}</strong>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-bold text-secondary">Collaborations</span>
                <strong>{currentUser.activity.collaborations}</strong>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-bold text-secondary">Skills verified</span>
                <strong>{currentUser.activity.skillsVerified}</strong>
              </div>
            </div>
          </Card>
        </aside>
      </section>

      <section className="mt-10">
        <h2 className="mb-5 text-xl font-black text-primary">Projects</h2>
        <div className="space-y-4">
          {projects.slice(0, 3).map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>
    </div>
  );
}

export default Profile;
