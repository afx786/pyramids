import { useEffect, useState } from 'react';
import PageHeader from '../../components/common/PageHeader.jsx';
import Card from '../../components/ui/Card.jsx';
import SkillTag from '../../components/ui/SkillTag.jsx';
import { projectService } from '../../services/projectService.js';

const STATIC_UPDATES = [
  { id: 1, title: 'Connect with builders', detail: 'Send connection requests to collaborate on projects.', tag: 'Connections' },
  { id: 2, title: 'Showcase your work', detail: 'Add projects to build your verified skill profile.', tag: 'Projects' },
  { id: 3, title: 'Climb the ranks', detail: 'Complete projects and verify skills to reach Pyramidion.', tag: 'Pyramidion' },
];

function Updates() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    projectService.listProjects().then(setProjects).catch(() => {});
  }, []);

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        eyebrow="Activity"
        title="What's New?"
        description="A simple activity surface for project updates, invites, and rank progress."
      />

      <section className="mt-10 grid grid-cols-[1fr_340px] gap-8">
        <div className="space-y-4">
          {STATIC_UPDATES.map((update) => (
            <Card key={update.id} className="p-6">
              <SkillTag>{update.tag}</SkillTag>
              <h2 className="mt-4 text-xl font-black text-primary">{update.title}</h2>
              <p className="mt-2 text-sm font-medium leading-6 text-secondary">{update.detail}</p>
            </Card>
          ))}
        </div>

        <Card className="p-6">
          <h2 className="text-xl font-black text-primary">Recent Projects</h2>
          <div className="mt-5 space-y-4">
            {projects.length === 0 ? (
              <p className="text-sm text-secondary">No projects yet.</p>
            ) : (
              projects.slice(0, 5).map((project) => (
                <div key={project.id} className="border-b border-subtle pb-4 last:border-b-0 last:pb-0">
                  <p className="font-black text-primary">{project.title}</p>
                  <p className="mt-1 text-sm font-medium text-secondary">{project.status} · {project.domain}</p>
                </div>
              ))
            )}
          </div>
        </Card>
      </section>
    </div>
  );
}

export default Updates;
