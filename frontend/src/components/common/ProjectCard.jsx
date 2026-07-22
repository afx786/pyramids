import { Link } from 'react-router-dom';
import { formatShortBatch } from '../../utils/batch.js';
import Avatar from '../ui/Avatar.jsx';
import Card from '../ui/Card.jsx';
import SkillTag from '../ui/SkillTag.jsx';

function ProjectCard({ project }) {
  const stack = project.stack ?? [];
  const memberCount = project.member_count ?? project.members?.length;

  return (
    <Link to={`/projects/${project.id}`} className="block">
      <Card className="p-5 transition duration-200 hover:-translate-y-0.5 hover:border-primary/15 hover:shadow-md">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h3 className="text-base font-semibold text-primary">{project.title}</h3>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-secondary">{project.description}</p>
          </div>
          <div className="flex shrink-0 items-center gap-3 sm:text-right">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-primary">
                by {project.creator}
                {(() => {
                  const batch = formatShortBatch(project.creator_joining_year, project.creator_graduating_year);
                  return batch ? <span className="font-mono text-[10px] ml-1" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>({batch})</span> : null;
                })()}
              </p>
              <p className="text-xs" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
                {memberCount != null ? `${memberCount} ${memberCount === 1 ? 'Member' : 'Members'}` : 'Creator'}
              </p>
            </div>
            <Avatar src={project.avatar} alt={project.creator} size="sm" />
          </div>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          {stack.slice(0, 8).map((item) => (
            <SkillTag key={item}>{item}</SkillTag>
          ))}
          {stack.length === 0 && <span className="text-xs font-medium text-secondary">No stack tagged yet</span>}
        </div>
      </Card>
    </Link>
  );
}

export default ProjectCard;
