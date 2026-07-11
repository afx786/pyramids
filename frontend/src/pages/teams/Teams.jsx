import { useEffect, useState } from 'react';
import { UsersRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import EmptyState from '../../components/common/EmptyState.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import Button from '../../components/ui/Button.jsx';
import Card from '../../components/ui/Card.jsx';
import SkillTag from '../../components/ui/SkillTag.jsx';
import { discoveryService } from '../../services/discoveryService.js';

function Teams() {
  const [teams, setTeams] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    discoveryService.listTeams().then(setTeams).catch(() => {});
  }, []);

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        eyebrow="Collaboration"
        title="Teams"
        description="Team cards show active project groups, open roles, and where new builders can join."
        actions={
          <Button onClick={() => navigate('/projects/new')}>
            <UsersRound className="h-4 w-4" />
            Build Team
          </Button>
        }
      />

      <section className="mt-10 grid grid-cols-3 gap-5">
        {teams.length === 0 ? (
          <div className="col-span-3">
            <EmptyState title="No teams yet" description="Create a project to start building your team." />
          </div>
        ) : (
          teams.map((team) => (
            <Card key={team.id} className="p-6">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-secondary">
                {team.members?.length ?? 0} member{team.members?.length !== 1 ? 's' : ''}
              </p>
              <h2 className="mt-3 text-2xl font-black text-primary">{team.name}</h2>
              <p className="mt-2 text-sm font-bold text-secondary">{team.description}</p>

              <div className="mt-6">
                <p className="text-sm font-black text-primary">Owner</p>
                <p className="mt-2 text-sm font-medium text-secondary">{team.owner?.name ?? '—'}</p>
              </div>

              {team.members && team.members.length > 0 && (
                <div className="mt-5">
                  <p className="mb-3 text-sm font-black text-primary">Members</p>
                  <div className="flex flex-wrap gap-2">
                    {team.members.map((m) => (
                      <SkillTag key={m.id}>{m.name}</SkillTag>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          ))
        )}
      </section>
    </div>
  );
}

export default Teams;
