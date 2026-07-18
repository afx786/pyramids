import { ArrowLeft, LogOut, UserPlus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ErrorState from '../../components/common/ErrorState.jsx';
import LoadingState from '../../components/common/LoadingState.jsx';
import Button from '../../components/ui/Button.jsx';
import Card from '../../components/ui/Card.jsx';
import SkillTag from '../../components/ui/SkillTag.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { api } from '../../services/api.js';

function ResearchDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [research, setResearch] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionError, setActionError] = useState('');

  useEffect(() => {
    Promise.all([
      api.get(`/research/${id}`),
      api.get(`/research/${id}/members`).catch(() => []),
    ])
      .then(([data, membersData]) => {
        setResearch(data);
        setMembers(membersData);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleJoin() {
    setActionError('');
    try {
      await api.post(`/research/${id}/join`);
      const [data, membersData] = await Promise.all([
        api.get(`/research/${id}`),
        api.get(`/research/${id}/members`).catch(() => []),
      ]);
      setResearch(data);
      setMembers(membersData);
    } catch (err) {
      setActionError(err.message);
    }
  }

  async function handleLeave() {
    setActionError('');
    try {
      await api.post(`/research/${id}/leave`);
      const [data, membersData] = await Promise.all([
        api.get(`/research/${id}`),
        api.get(`/research/${id}/members`).catch(() => []),
      ]);
      setResearch(data);
      setMembers(membersData);
    } catch (err) {
      setActionError(err.message);
    }
  }

  if (loading) return <LoadingState label="Loading research..." />;
  if (error) return <ErrorState title={error} />;
  if (!research) return <ErrorState title="Research not found" />;

  const isMember = members.some((m) => m.id === user?.id) || research.owner_id === user?.id;

  return (
    <div className="mx-auto max-w-6xl">
      <Link to="/research" className="mb-6 flex items-center gap-2 text-sm font-semibold text-secondary hover:text-primary transition">
        <ArrowLeft className="h-4 w-4" />
        Back to Research
      </Link>

      <Card className="p-8">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-mono-label text-[11px] text-secondary">{research.domain || 'Research'}</p>
            <h1 className="mt-3 text-4xl font-black text-primary">{research.title}</h1>
            <p className="mt-4 max-w-2xl text-sm font-medium leading-6 text-secondary">{research.description}</p>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-2">
            {isMember ? (
              <Button variant="ghost" onClick={handleLeave}><LogOut className="h-4 w-4" /> Leave</Button>
            ) : (
              <Button onClick={handleJoin}><UserPlus className="h-4 w-4" /> Join</Button>
            )}
            {actionError && (
              <p className="text-xs font-semibold text-red-500">{actionError}</p>
            )}
          </div>
        </div>
      </Card>

      <div className="mt-8">
        <Card className="p-6">
          <p className="font-mono-label text-[11px] text-secondary">Members ({members.length})</p>
          <div className="mt-5 space-y-3">
            {members.length > 0 ? (
              members.map((m) => (
                <div key={m.id || m.user_id} className="border-t border-subtle pt-3 first:border-t-0 first:pt-0">
                  <p className="text-sm font-semibold text-primary">{m.name || `User #${m.user_id}`}</p>
                  <p className="text-xs font-medium text-secondary capitalize">{m.role || 'Member'}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-secondary">No members yet.</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

export default ResearchDetail;
