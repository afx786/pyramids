import Avatar from '../ui/Avatar.jsx';
import Card from '../ui/Card.jsx';
import SkillTag from '../ui/SkillTag.jsx';

function ProjectCard({ project }) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-primary">{project.title}</h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-secondary">{project.description}</p>
        </div>
        <div className="flex shrink-0 items-center gap-3 text-right">
          <div>
            <p className="text-sm font-semibold text-primary">{project.creator}</p>
            <p className="text-xs text-secondary">Creator</p>
          </div>
          <Avatar src={project.avatar} alt={project.creator} size="sm" />
        </div>
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        {project.stack.map((item) => (
          <SkillTag key={item}>{item}</SkillTag>
        ))}
      </div>
    </Card>
  );
}

export default ProjectCard;
