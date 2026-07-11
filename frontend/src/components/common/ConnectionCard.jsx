import Avatar from '../ui/Avatar.jsx';
import Button from '../ui/Button.jsx';
import Card from '../ui/Card.jsx';
import SkillTag from '../ui/SkillTag.jsx';

function ConnectionCard({ person, primaryAction = 'Connect', secondaryAction, onPrimary, onSecondary }) {
  return (
    <Card className="p-5">
      <div className="flex items-start gap-4">
        <Avatar src={person.avatar} alt={person.name || person.from} size="md" />
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-black text-primary">{person.name || person.from}</h3>
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
          <Button variant="secondary" className="h-9 px-4 text-xs" onClick={onSecondary}>
            {secondaryAction}
          </Button>
        ) : null}
      </div>
    </Card>
  );
}

export default ConnectionCard;
