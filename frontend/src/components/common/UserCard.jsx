import Avatar from '../ui/Avatar.jsx';
import Button from '../ui/Button.jsx';
import Card from '../ui/Card.jsx';
import SkillTag from '../ui/SkillTag.jsx';

function UserCard({ user }) {
  return (
    <Card className="flex min-h-[148px] flex-col items-center px-5 py-5 text-center">
      <Avatar src={user.avatar} alt={user.name} size="md" />
      <h3 className="mt-3 text-base font-black text-primary">{user.name}</h3>
      <p className="mt-1 text-sm font-bold text-secondary">{user.role}</p>
      <div className="mt-3 flex flex-wrap justify-center gap-1.5">
        {user.skills.slice(0, 3).map((skill) => (
          <SkillTag key={skill}>{skill}</SkillTag>
        ))}
      </div>
      <Button variant="secondary" className="mt-4 h-9 px-4 text-xs">
        Connect
      </Button>
    </Card>
  );
}

export default UserCard;
