import PageHeader from '../../components/common/PageHeader.jsx';
import Card from '../../components/ui/Card.jsx';
import SkillTag from '../../components/ui/SkillTag.jsx';
import { projects } from '../../data/mockData.js';

const updates = [
  {
    id: 1,
    title: 'New collaboration requests',
    detail: 'Two builders asked to contribute to Campus Skill Graph.',
    tag: 'Requests',
  },
  {
    id: 2,
    title: 'Project feed refreshed',
    detail: 'Four project updates were posted across Frontend and AI domains.',
    tag: 'Projects',
  },
  {
    id: 3,
    title: 'Rank progress changed',
    detail: 'Your verified React and Product skills moved you closer to O3.',
    tag: 'Pyramidion',
  },
];

function Updates() {
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        eyebrow="Activity"
        title="What's New?"
        description="A simple activity surface for project updates, invites, and rank progress."
      />

      <section className="mt-10 grid grid-cols-[1fr_340px] gap-8">
        <div className="space-y-4">
          {updates.map((update) => (
            <Card key={update.id} className="p-6">
              <SkillTag>{update.tag}</SkillTag>
              <h2 className="mt-4 text-xl font-black text-primary">{update.title}</h2>
              <p className="mt-2 text-sm font-medium leading-6 text-secondary">{update.detail}</p>
            </Card>
          ))}
        </div>

        <Card className="p-6">
          <h2 className="text-xl font-black text-primary">Recent Project Signals</h2>
          <div className="mt-5 space-y-4">
            {projects.slice(0, 3).map((project) => (
              <div key={project.id} className="border-b border-subtle pb-4 last:border-b-0 last:pb-0">
                <p className="font-black text-primary">{project.title}</p>
                <p className="mt-1 text-sm font-medium text-secondary">{project.status}</p>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}

export default Updates;
