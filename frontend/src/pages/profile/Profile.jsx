import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, MessageSquare, Pencil, Plus, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import LoadingState from '../../components/common/LoadingState.jsx';
import ProjectCard from '../../components/common/ProjectCard.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import Avatar from '../../components/ui/Avatar.jsx';
import Button from '../../components/ui/Button.jsx';
import Card from '../../components/ui/Card.jsx';
import SkillTag from '../../components/ui/SkillTag.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { connectionService } from '../../services/connectionService.js';
import { messageService } from '../../services/messageService.js';
import { userService } from '../../services/userService.js';

function SkillMeter({ skill, width }) {
  return (
    <div className="grid grid-cols-[88px_1fr] items-center gap-4">
      <span className="font-black text-primary">{skill}</span>
      <div className="h-4 overflow-hidden rounded-full bg-accent-soft">
        <div className="h-full rounded-full bg-accent" style={{ width: `${width}%` }} />
      </div>
    </div>
  );
}

function Profile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, profile, rankData } = useAuth();
  const [otherProfile, setOtherProfile] = useState(null);
  const [otherRank, setOtherRank] = useState(null);
  const [loading, setLoading] = useState(false);
  const [actionError, setActionError] = useState('');

  const isOwnProfile = !id || String(user?.id) === String(id);
  const userId = isOwnProfile ? user?.id : id;

  useEffect(() => {
    if (!userId || isOwnProfile) return;
    setLoading(true);
    Promise.all([
      userService.getProfile(userId),
      userService.getRank(userId),
    ])
      .then(([p, r]) => { setOtherProfile(p); setOtherRank(r); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [userId]);

  const displayUser = isOwnProfile
    ? (profile?.user ?? user)
    : (otherProfile?.user ?? { name: 'User', id: userId });

  const displaySkills = isOwnProfile
    ? (profile?.skills ?? [])
    : (otherProfile?.skills ?? []);

  const displayProjects = isOwnProfile
    ? (profile?.projects ?? [])
    : (otherProfile?.projects ?? []);

  const displayRank = isOwnProfile
    ? rankData
    : otherRank;

  const displayStats = isOwnProfile
    ? (profile?.statistics ?? {})
    : (otherProfile?.statistics ?? {});

  async function handleConnect() {
    try {
      await connectionService.sendRequest(userId);
      setActionError('');
    } catch (err) { setActionError(err.message); }
  }

  async function handleMessage() {
    try {
      await messageService.startConversation(userId);
      navigate('/messages');
    } catch (err) { setActionError(err.message); }
  }

  if (loading) return <LoadingState label="Loading profile..." />;

  if (!isOwnProfile && !otherProfile) {
    return (
      <div className="mx-auto max-w-6xl">
        <Link to="/search" className="mb-6 flex items-center gap-2 text-sm font-semibold text-secondary hover:text-primary transition">
          <ArrowLeft className="h-4 w-4" />
          Back to Search
        </Link>
        <Card className="p-8 text-center">
          <p className="text-sm text-secondary">User not found.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl">
      {!isOwnProfile && (
        <Link to="/search" className="mb-6 flex items-center gap-2 text-sm font-semibold text-secondary hover:text-primary transition">
          <ArrowLeft className="h-4 w-4" />
          Back to Search
        </Link>
      )}

      <PageHeader
        eyebrow="Profile"
        title={isOwnProfile ? `Hi ${displayUser?.name?.split(' ')[0] ?? '...'}` : displayUser?.name ?? 'Builder'}
        description={displayRank ? `${displayRank.rank} · ${displayRank.points} points` : 'Loading rank...'}
        actions={
          isOwnProfile ? (
            <>
              <Button variant="secondary">
                <Plus className="h-4 w-4" />
                Add Skills
              </Button>
              <Button>
                <Pencil className="h-4 w-4" />
                Update
              </Button>
            </>
          ) : (
            <>
              <Button variant="secondary" onClick={handleMessage}>
                <MessageSquare className="h-4 w-4" />
                Message
              </Button>
              <Button onClick={handleConnect}>
                <UserPlus className="h-4 w-4" />
                Connect
              </Button>
            </>
          )
        }
      />

      {actionError && (
        <div className="mt-5 border border-red-200 bg-red-50 px-5 py-3 rounded-lg">
          <p className="text-sm font-semibold text-red-700">{actionError}</p>
        </div>
      )}

      <section className="mt-12 grid grid-cols-[280px_1fr_220px] gap-8">
        <Card className="p-6">
          <h2 className="mb-6 text-lg font-black text-primary">Skills</h2>
          {displaySkills.length > 0 ? (
            <div className="space-y-5">
              {displaySkills.slice(0, 6).map((skill, i) => (
                <SkillMeter key={skill} skill={skill} width={40 + (skill.length * 3) % 45} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-secondary">No skills added yet.</p>
          )}
        </Card>

        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-primary">About</h2>
            </div>
            {displayUser?.program && (
              <p className="mt-4 rounded-lg bg-accent px-4 py-3 text-sm font-black text-app">
                {displayUser.program}
              </p>
            )}
            {displayUser?.bio ? (
              <p className="mt-4 rounded-lg bg-accent px-5 py-5 text-base font-bold leading-7 text-app">
                {displayUser.bio}
              </p>
            ) : (
              <p className="mt-4 text-sm text-secondary">No bio added yet.</p>
            )}
          </Card>

          {displaySkills.length > 0 && (
            <Card className="p-6">
              <h2 className="text-xl font-black text-primary">All Skills</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {displaySkills.map((skill) => (
                  <SkillTag key={skill}>{skill}</SkillTag>
                ))}
              </div>
            </Card>
          )}
        </div>

        <aside className="space-y-5">
          <Card className="flex flex-col items-center p-6 text-center">
            <Avatar src={displayUser?.profile_picture} alt={displayUser?.name} size="lg" className="h-28 w-28" />
            <h2 className="mt-4 text-xl font-black text-primary">{displayUser?.name ?? '—'}</h2>
            <p className="mt-1 text-sm font-bold text-secondary">{displayUser?.headline || 'Builder'}</p>
          </Card>

          <Card className="p-6">
            <h2 className="text-sm font-black uppercase tracking-[0.18em] text-secondary">Activity</h2>
            <div className="mt-5 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="font-bold text-secondary">Projects</span>
                <strong>{displayStats.total_projects ?? displayRank?.projects_count ?? '—'}</strong>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-bold text-secondary">Skills</span>
                <strong>{displayRank?.skills_count ?? displaySkills.length}</strong>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-bold text-secondary">Rank points</span>
                <strong>{displayRank?.points ?? '—'}</strong>
              </div>
            </div>
          </Card>
        </aside>
      </section>

      {displayProjects.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-5 text-xl font-black text-primary">Projects</h2>
          <div className="space-y-4">
            {displayProjects.slice(0, 3).map((project) => (
              <ProjectCard
                key={project.id}
                project={{
                  id: project.id,
                  title: project.title,
                  description: project.description,
                  creator: displayUser?.name ?? 'Builder',
                  avatar: displayUser?.profile_picture,
                  stack: project.skills ?? [],
                }}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default Profile;
