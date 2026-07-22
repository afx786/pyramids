import { formatShortBatch } from '../../utils/batch.js';
import Avatar from '../ui/Avatar.jsx';
import Button from '../ui/Button.jsx';
import SkillTag from '../ui/SkillTag.jsx';

function ConnectionCard({ person, primaryAction = 'Connect', secondaryAction, onPrimary, onSecondary }) {
  const batch = formatShortBatch(person.joining_year, person.graduating_year);
  return (
    <section
      className="rounded-xl border p-5 card-hover"
      style={{
        background: 'rgb(var(--color-glass))',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderColor: 'rgb(var(--color-glass-border))',
      }}
    >
      <div className="flex items-start gap-4">
        <Avatar src={person.avatar} alt={person.name || person.from} size="md" />
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-black">{person.name || person.from}</h3>
          {batch ? <p className="text-xs font-mono-label" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>{batch}</p> : null}
          <p className="mt-1 text-sm font-bold text-secondary">{person.role || person.reason}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {(person.skills || []).map((skill) => (
              <SkillTag key={skill}>{skill}</SkillTag>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-5 flex gap-3">
        <Button className="h-9 px-4 text-xs" onClick={onPrimary}>{primaryAction}</Button>
        {secondaryAction ? (
          <Button variant="ghost" className="h-9 px-4 text-xs" onClick={onSecondary}>
            {secondaryAction}
          </Button>
        ) : null}
      </div>
    </section>
  );
}

export default ConnectionCard;
