import Avatar from '../ui/Avatar.jsx';
import Card from '../ui/Card.jsx';
import SkillTag from '../ui/SkillTag.jsx';

function ProjectCard({ project }) {
  const stack = project.stack ?? [];

  return (
    <Card className="p-5 transition hover:-translate-y-0.5 hover:border-accent/30 hover:shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h3 className="text-lg font-bold text-primary">{project.title}</h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-secondary">{project.description}</p>
        </div>
        <div className="flex shrink-0 items-center gap-3 sm:text-right">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-primary">{project.creator}</p>
            <p className="text-xs text-secondary">Creator</p>
          </div>
          <Avatar src={project.avatar} alt={project.creator} size="sm" />
        </div>
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        {stack.slice(0, 8).map((item) => (
          <SkillTag key={item}>{item}</SkillTag>
        ))}
        {stack.length === 0 && <span className="text-xs font-semibold text-secondary">No stack tagged yet</span>}
      </div>
    </Card>
  );
}

export default ProjectCard;
