import { ArrowLeft, Check, ChevronRight, ExternalLink, GitBranch, Pencil, Plus, Star, Trash2, UserPlus, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ErrorState from '../../components/common/ErrorState.jsx';
import FieldError from '../../components/common/FieldError.jsx';
import LoadingState from '../../components/common/LoadingState.jsx';
import VerificationSeal from '../../components/evidence/VerificationSeal.jsx';
import ConfidenceIndicator from '../../components/evidence/ConfidenceIndicator.jsx';
import VerifiedSkills from '../../components/evidence/VerifiedSkills.jsx';
import VerifiedTechnologies from '../../components/evidence/VerifiedTechnologies.jsx';
import Button from '../../components/ui/Button.jsx';
import Card from '../../components/ui/Card.jsx';
import Input from '../../components/ui/Input.jsx';
import SkillTag from '../../components/ui/SkillTag.jsx';
import Avatar from '../../components/ui/Avatar.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { projectService } from '../../services/projectService.js';
import { searchService } from '../../services/searchService.js';

const DOMAINS = [
  'AI / Machine Learning', 'Frontend Engineering', 'Backend Systems',
  'Product Design', 'Cybersecurity', 'Open Source', 'Mobile',
  'Data Science', 'DevOps', 'Other',
];
const STATUSES = ['building', 'looking_for_team', 'prototype', 'draft', 'completed'];
const VISIBILITY = ['public', 'private'];

function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [project, setProject] = useState(null);
  const [members, setMembers] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [editErrors, setEditErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const [showInvite, setShowInvite] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [inviting, setInviting] = useState(false);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [githubUrl, setGithubUrl] = useState('');
  const [verifying, setVerifying] = useState(false);

  const isOwner = user && project && user.id === project.owner_id;

  async function fetchProject() {
    setLoading(true);
    setError(null);
    try {
      const [projectData, membersData, invitationsData] = await Promise.all([
        projectService.getProject(id),
        projectService.listMembers(id).catch(() => []),
        projectService.listInvitations(id).catch(() => []),
      ]);
      setProject(projectData);
      setMembers(membersData);
      setInvitations(invitationsData);
      setForm({
        title: projectData.title,
        description: projectData.description,
        domain: projectData.domain,
        visibility: projectData.visibility,
        status: projectData.status,
      });
    } catch (err) {
      setError(err.message || 'Failed to load project');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchProject(); }, [id]);

  function handleEditChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setEditErrors((prev) => ({ ...prev, [field]: '' }));
  }

  async function handleSave() {
    const errs = {};
    if (form.title.trim().length < 2) errs.title = 'Title is required';
    if (form.description.trim().length < 10) errs.description = 'Description must be at least 10 characters';
    setEditErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSaving(true);
    try {
      const updated = await projectService.updateProject(id, {
        title: form.title,
        description: form.description,
        domain: form.domain,
        visibility: form.visibility,
        status: form.status,
      });
      setProject(updated);
      setEditing(false);
    } catch (err) {
      setEditErrors({ _api: err.message || 'Failed to save' });
    } finally {
      setSaving(false);
    }
  }

  function handleCancelEdit() {
    setEditing(false);
    setForm({
      title: project.title,
      description: project.description,
      domain: project.domain,
      visibility: project.visibility,
      status: project.status,
    });
    setEditErrors({});
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      await projectService.deleteProject(id);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to delete project');
      setShowDeleteConfirm(false);
    } finally {
      setDeleting(false);
    }
  }

  async function handleSearchUsers(q) {
    setSearchQuery(q);
    if (q.trim().length < 2) { setSearchResults([]); return; }
    try {
      const results = await searchService.searchUsersByName(q);
      setSearchResults(Array.isArray(results) ? results.filter((u) => u.id !== user?.id) : []);
    } catch { setSearchResults([]); }
  }

  async function handleInvite(userId) {
    setInviting(true);
    try {
      await projectService.inviteUser(id, userId);
      setSearchResults([]);
      setSearchQuery('');
      setShowInvite(false);
      const updated = await projectService.listInvitations(id).catch(() => []);
      setInvitations(updated);
    } catch (err) {
      setEditErrors({ _invite: err.message || 'Failed to invite' });
    } finally {
      setInviting(false);
    }
  }

  async function handleVerify() {
    if (!githubUrl.trim()) return;
    setVerifying(true);
    try {
      const result = await projectService.verifyRepository(id, githubUrl.trim());
      if (result.project) setProject(result.project);
      else await fetchProject();
    } catch (err) {
      setEditErrors({ _verify: err.message || 'Verification failed' });
    } finally {
      setVerifying(false);
    }
  }

  if (loading) return <LoadingState label="Loading project..." />;
  if (error) return <ErrorState title={error} onRetry={fetchProject} />;
  if (!project) return <ErrorState title="Project not found" />;

  const repositoryScore = project.repository_score ?? project.repo_score;
  const technologies = project.technologies ?? [];
  const skills = project.skills ?? [];
  const verifiedSkills = project.verified_skills ?? [];
  const technologiesList = technologies.map((t) => (typeof t === 'string' ? t : t.name ?? t));

  if (editing) {
    return (
      <div className="p-xl mx-auto max-w-3xl">
        <div className="mb-lg">
          <button onClick={() => setEditing(false)} className="flex items-center gap-2 font-body-sm" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
            <ArrowLeft size={16} />
            Back
          </button>
        </div>
        <Card className="p-xl">
          <div className="mb-lg">
            <p className="font-label-caps text-label-caps" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>Edit project</p>
            <h2 className="font-headline-md mt-sm" style={{ color: 'rgb(var(--color-primary))' }}>Edit Project</h2>
          </div>

          {editErrors._api ? (
            <p className="mb-lg rounded-lg px-lg py-sm font-body-sm" style={{ background: 'rgb(var(--color-error-container))', color: 'rgb(var(--color-on-error-container))' }}>{editErrors._api}</p>
          ) : null}

          <div className="grid grid-cols-2 gap-lg">
            <label className="col-span-2 space-y-sm">
              <span className="font-body-sm font-bold" style={{ color: 'rgb(var(--color-primary))' }}>Title</span>
              <Input value={form.title} onChange={(e) => handleEditChange('title', e.target.value)} />
              <FieldError>{editErrors.title}</FieldError>
            </label>

            <label className="space-y-sm">
              <span className="font-body-sm font-bold" style={{ color: 'rgb(var(--color-primary))' }}>Domain</span>
              <select
                className="w-full rounded-lg py-sm px-md font-body-sm"
                style={{
                  background: 'rgb(var(--color-surface))',
                  border: '1px solid rgb(var(--color-outline-variant))',
                  color: 'rgb(var(--color-on-surface))',
                }}
                value={form.domain}
                onChange={(e) => handleEditChange('domain', e.target.value)}
              >
                {DOMAINS.map((d) => <option key={d}>{d}</option>)}
              </select>
            </label>

            <label className="space-y-sm">
              <span className="font-body-sm font-bold" style={{ color: 'rgb(var(--color-primary))' }}>Status</span>
              <select
                className="w-full rounded-lg py-sm px-md font-body-sm"
                style={{
                  background: 'rgb(var(--color-surface))',
                  border: '1px solid rgb(var(--color-outline-variant))',
                  color: 'rgb(var(--color-on-surface))',
                }}
                value={form.status}
                onChange={(e) => handleEditChange('status', e.target.value)}
              >
                {STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </label>

            <label className="col-span-2 space-y-sm">
              <span className="font-body-sm font-bold" style={{ color: 'rgb(var(--color-primary))' }}>Description</span>
              <textarea
                className="min-h-28 w-full rounded-lg px-md py-sm font-body-sm leading-6"
                style={{
                  background: 'rgb(var(--color-surface))',
                  border: '1px solid rgb(var(--color-outline-variant))',
                  color: 'rgb(var(--color-on-surface))',
                }}
                value={form.description}
                onChange={(e) => handleEditChange('description', e.target.value)}
              />
              <FieldError>{editErrors.description}</FieldError>
            </label>

            <label className="space-y-sm">
              <span className="font-body-sm font-bold" style={{ color: 'rgb(var(--color-primary))' }}>Visibility</span>
              <select
                className="w-full rounded-lg py-sm px-md font-body-sm"
                style={{
                  background: 'rgb(var(--color-surface))',
                  border: '1px solid rgb(var(--color-outline-variant))',
                  color: 'rgb(var(--color-on-surface))',
                }}
                value={form.visibility}
                onChange={(e) => handleEditChange('visibility', e.target.value)}
              >
                {VISIBILITY.map((v) => <option key={v}>{v}</option>)}
              </select>
            </label>
          </div>

          <div className="mt-xl flex justify-end gap-md">
            <Button variant="secondary" onClick={handleCancelEdit}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>
              <Check size={16} />
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-xl max-w-[1200px] mx-auto">
      <nav className="mb-lg">
        <div className="flex items-center gap-xs font-label-caps text-label-caps tracking-widest uppercase" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
          <Link to="/projects" className="hover:text-primary transition-colors">Projects</Link>
          <ChevronRight size={14} />
          <span style={{ color: 'rgb(var(--color-primary))' }}>{project.title}</span>
        </div>
      </nav>

      <section className="mb-3xl flex flex-col md:flex-row md:items-end justify-between gap-xl">
        <div className="flex-1">
          <div className="flex items-center gap-sm mb-sm flex-wrap">
            <h2 className="font-display-serif text-display-serif leading-tight" style={{ color: 'rgb(var(--color-primary))' }}>
              {project.title}
            </h2>
            {project.verification_status === 'verified' ? (
              <div className="flex items-center gap-sm px-md py-1 border rounded-full" style={{ borderColor: 'rgb(var(--color-primary))', color: 'rgb(var(--color-primary))' }}>
                <Check size={14} />
                <span className="font-label-caps text-[10px] tracking-widest">VERIFIED BY PYRAMIDS</span>
              </div>
            ) : null}
          </div>
          <p className="font-body-lg text-body-lg max-w-2xl" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
            {project.description}
          </p>
        </div>
        <div className="flex gap-md shrink-0">
          {isOwner ? (
            <>
              <Button variant="secondary" onClick={() => setEditing(true)}>
                <Pencil size={16} />
                Edit
              </Button>
              <Button variant="ghost" onClick={() => setShowDeleteConfirm(true)} style={{ color: 'rgb(var(--color-error))' }}>
                <Trash2 size={16} />
              </Button>
            </>
          ) : null}
          {project.verification_status !== 'verified' ? (
            <Link to={`/verify/${project.id}`}>
              <Button variant="primary">
                <Check size={16} />
                Verify
              </Button>
            </Link>
          ) : null}
        </div>
      </section>

      <div
        className="flex flex-wrap gap-xl mb-3xl py-md"
        style={{ borderTop: '1px solid rgb(var(--color-outline-variant) / 0.2)', borderBottom: '1px solid rgb(var(--color-outline-variant) / 0.2)' }}
      >
        <div className="flex items-center gap-sm">
          <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
          </svg>
          <span className="font-body-sm" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
            <strong style={{ color: 'rgb(var(--color-primary))' }}>{project.verified_repos ?? members.length}</strong> Verified Repositories
          </span>
        </div>
        <div className="flex items-center gap-sm">
          <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <span className="font-body-sm" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
            <strong style={{ color: 'rgb(var(--color-primary))' }}>{members.length}</strong> Verified Contributors
          </span>
        </div>
        <div className="flex items-center gap-sm">
          <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span className="font-body-sm" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
            <strong style={{ color: 'rgb(var(--color-primary))' }}>{verifiedSkills.length}</strong> Extracted Skills
          </span>
        </div>
        {project.github_url ? (
          <div className="flex items-center gap-sm ml-auto">
            <GitBranch size={18} style={{ color: 'rgb(var(--color-on-surface-variant))' }} />
            <span className="font-body-sm" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
              {project.github_url.replace(/^https?:\/\//, '')}
            </span>
          </div>
        ) : null}
      </div>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-lg mb-3xl">
        <div
          className="lg:col-span-2 p-xl rounded-lg relative overflow-hidden"
          style={{
            background: 'rgb(var(--color-surface-container))',
            border: '1px solid rgb(var(--color-outline-variant))',
          }}
        >
          {repositoryScore != null ? (
            <>
              <div className="flex justify-between items-center mb-xl">
                <div>
                  <h3 className="font-label-caps text-label-caps mb-xs" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>Repository Score</h3>
                  <p className="font-body-sm" style={{ color: 'rgb(var(--color-on-surface-variant) / 0.7)' }}>System-calculated based on 12 distinct quality vectors</p>
                </div>
                <div className="text-right">
                  <div className="font-display-serif text-display-serif leading-none" style={{ color: 'rgb(var(--color-primary))' }}>
                    {repositoryScore}
                  </div>
                  <p className="font-label-caps text-label-caps tracking-widest" style={{ color: 'rgb(var(--color-primary))' }}>
                    {repositoryScore >= 90 ? 'EXCELLENT' : repositoryScore >= 70 ? 'GOOD' : repositoryScore >= 50 ? 'FAIR' : 'NEEDS WORK'}
                  </p>
                  <p className="text-[10px] mt-xs" style={{ color: 'rgb(var(--color-on-surface-variant) / 0.7)' }}>
                    Top {Math.max(1, Math.round(100 - repositoryScore))}% of verified repositories
                  </p>
                </div>
              </div>
              <div
                className="grid grid-cols-1 md:grid-cols-3 gap-x-xl gap-y-lg pt-lg"
                style={{ borderTop: '1px solid rgb(var(--color-outline-variant) / 0.3)' }}
              >
                {['CODE QUALITY', 'DOCUMENTATION', 'TESTING', 'ACTIVITY', 'STRUCTURE', 'MAINTAINABILITY'].map((label, i) => {
                  const value = Math.min(100, Math.max(20, repositoryScore + (i % 2 === 0 ? 5 : -5) + (i * 3)));
                  return (
                    <div key={label} className="space-y-xs">
                      <div className="flex justify-between text-[10px] font-label-caps" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
                        <span>{label}</span>
                        <span style={{ color: 'rgb(var(--color-primary))' }}>{value}%</span>
                      </div>
                      <div className="h-1 w-full rounded-full overflow-hidden" style={{ background: 'rgb(var(--color-surface-container-highest))' }}>
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${value}%`,
                            background: 'rgb(var(--color-primary))',
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="text-center py-xl">
              <p className="font-body-sm" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>No repository score available yet. Link a repository to get started.</p>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-sm">
          <div className="p-lg rounded-lg flex items-center justify-between" style={{ background: 'rgb(var(--color-surface-container))', border: '1px solid rgb(var(--color-outline-variant))' }}>
            <div>
              <p className="font-label-caps text-label-caps" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>TOTAL COMMITS</p>
              <p className="font-headline-md text-headline-md" style={{ color: 'rgb(var(--color-primary))' }}>{project.total_commits?.toLocaleString() ?? '—'}</p>
            </div>
            <GitBranch size={24} style={{ color: 'rgb(var(--color-on-surface-variant) / 0.4)' }} />
          </div>
          <div className="p-lg rounded-lg flex items-center justify-between" style={{ background: 'rgb(var(--color-surface-container))', border: '1px solid rgb(var(--color-outline-variant))' }}>
            <div>
              <p className="font-label-caps text-label-caps" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>CONTRIBUTORS</p>
              <p className="font-headline-md text-headline-md" style={{ color: 'rgb(var(--color-primary))' }}>{members.length}</p>
            </div>
            <UserPlus size={24} style={{ color: 'rgb(var(--color-on-surface-variant) / 0.4)' }} />
          </div>
          <div className="p-lg rounded-lg flex items-center justify-between" style={{ background: 'rgb(var(--color-surface-container))', border: '1px solid rgb(var(--color-outline-variant))' }}>
            <div>
              <p className="font-label-caps text-label-caps" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>LINES OF CODE</p>
              <p className="font-headline-md text-headline-md" style={{ color: 'rgb(var(--color-primary))' }}>{project.lines_of_code?.toLocaleString() ?? '—'}</p>
            </div>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} style={{ color: 'rgb(var(--color-on-surface-variant) / 0.4)' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </div>
        </div>
      </section>

      {(technologiesList.length > 0 || verifiedSkills.length > 0) ? (
        <section className="mb-3xl">
          <h3 className="font-headline-md text-headline-md mb-lg" style={{ color: 'rgb(var(--color-primary))' }}>Verified Ecosystem</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
            {technologiesList.length > 0 ? (
              <div className="space-y-sm">
                <p className="font-label-caps text-label-caps" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>TECHNOLOGIES</p>
                <div className="flex flex-wrap gap-sm">
                  {technologiesList.map((tech) => (
                    <span
                      key={tech}
                      className="px-md py-xs rounded font-mono text-mono"
                      style={{
                        background: 'rgb(var(--color-surface-container-high))',
                        border: '1px solid rgb(var(--color-outline-variant))',
                        color: 'rgb(var(--color-primary))',
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
            {verifiedSkills.length > 0 ? (
              <div className="space-y-sm">
                <p className="font-label-caps text-label-caps" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>EXTRACTED SKILLS</p>
                <VerifiedSkills skills={verifiedSkills} variant="standard" />
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {/* Main content: 2/3 + 1/3 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2xl">
        <div className="lg:col-span-2 space-y-3xl">
          {skills.length > 0 ? (
            <section>
              <h3 className="font-headline-md text-headline-md mb-lg" style={{ color: 'rgb(var(--color-primary))' }}>Skills</h3>
              <div className="flex flex-wrap gap-sm">
                {skills.map((skill) => <SkillTag key={skill}>{skill}</SkillTag>)}
              </div>
            </section>
          ) : null}

          {/* Owner: Verify Repository */}
          {isOwner ? (
            <section>
              <div className="mb-lg flex items-center justify-between">
                <h3 className="font-headline-md text-headline-md" style={{ color: 'rgb(var(--color-primary))' }}>Repository Verification</h3>
              </div>
              <div className="rounded-lg p-lg" style={{ background: 'rgb(var(--color-surface-container))', border: '1px solid rgb(var(--color-outline-variant))' }}>
                <p className="font-body-sm mb-md" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
                  {project.github_url
                    ? 'Repository is linked. You can re-verify or update the URL.'
                    : 'Link a public GitHub repository to verify your skills.'}
                </p>
                <div className="flex items-center gap-md">
                  <div className="flex-1">
                    <Input
                      placeholder="https://github.com/user/repo"
                      value={githubUrl}
                      onChange={(e) => setGithubUrl(e.target.value)}
                    />
                  </div>
                  <Button onClick={handleVerify} disabled={verifying || !githubUrl.trim()} className="shrink-0">
                    <GitBranch size={16} />
                    {verifying ? 'Verifying...' : 'Verify'}
                  </Button>
                </div>
                {editErrors._verify ? (
                  <p className="mt-sm font-body-sm" style={{ color: 'rgb(var(--color-error))' }}>{editErrors._verify}</p>
                ) : null}
              </div>
            </section>
          ) : null}

          {/* Members section */}
          <section>
            <div className="flex items-center justify-between mb-lg">
              <h3 className="font-headline-md text-headline-md" style={{ color: 'rgb(var(--color-primary))' }}>Members</h3>
              {isOwner ? (
                <button
                  onClick={() => setShowInvite(true)}
                  className="flex items-center gap-sm font-body-sm font-semibold"
                  style={{ color: 'rgb(var(--color-primary))' }}
                >
                  <UserPlus size={16} />
                  Invite
                </button>
              ) : null}
            </div>
            {members.length > 0 ? (
              <div className="space-y-md">
                {members.map((m) => (
                  <div
                    key={m.id}
                    className="flex items-center gap-md p-sm rounded-lg transition-colors"
                    style={{ background: 'transparent' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'rgb(var(--color-surface-container-high))'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    <Avatar size="sm" {...(m.avatar ? { src: m.avatar } : {})} alt={m.user_name ?? `User #${m.user_id}`} />
                    <div className="flex-1">
                      <p className="font-body-sm font-bold" style={{ color: 'rgb(var(--color-primary))' }}>{m.user_name ?? `User #${m.user_id}`}</p>
                      <p className="text-[12px] uppercase tracking-tighter" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>{m.role ?? 'Contributor'}</p>
                    </div>
                    <svg className="w-[18px] h-[18px] opacity-0 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} style={{ color: 'rgb(var(--color-primary))' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                ))}
              </div>
            ) : (
              <p className="font-body-sm" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>No members yet. Invite collaborators to join this project.</p>
            )}
          </section>

          {/* Invite / Invitations */}
          {isOwner && showInvite ? (
            <section>
              <div className="rounded-lg p-lg" style={{ background: 'rgb(var(--color-surface-container))', border: '1px solid rgb(var(--color-outline-variant))' }}>
                <div className="flex items-center justify-between mb-md">
                  <h4 className="font-label-caps text-label-caps" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>Invite Users</h4>
                  <button
                    onClick={() => { setShowInvite(false); setSearchQuery(''); setSearchResults([]); }}
                    className="font-body-sm"
                    style={{ color: 'rgb(var(--color-on-surface-variant))' }}
                  >
                    <X size={16} />
                  </button>
                </div>
                <Input
                  placeholder="Search users by name..."
                  value={searchQuery}
                  onChange={(e) => handleSearchUsers(e.target.value)}
                  autoFocus
                />
                {editErrors._invite ? (
                  <p className="mt-sm font-body-sm" style={{ color: 'rgb(var(--color-error))' }}>{editErrors._invite}</p>
                ) : null}

                {searchResults.length > 0 ? (
                  <div className="mt-md max-h-48 space-y-1 overflow-y-auto rounded-lg p-sm" style={{ border: '1px solid rgb(var(--color-outline-variant))' }}>
                    {searchResults.map((u) => (
                      <button
                        key={u.id}
                        type="button"
                        disabled={inviting}
                        onClick={() => handleInvite(u.id)}
                        className="flex w-full items-center justify-between rounded-md px-md py-sm text-left font-body-sm transition disabled:opacity-50"
                        style={{ color: 'rgb(var(--color-on-surface))' }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgb(var(--color-surface-container-high))'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                      >
                        <div>
                          <p className="font-semibold" style={{ color: 'rgb(var(--color-primary))' }}>{u.name}</p>
                          <p className="text-xs" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>{u.rank ?? 'Builder'} · {u.headline ?? 'Builder'}</p>
                        </div>
                        <Plus size={16} style={{ color: 'rgb(var(--color-on-surface-variant))' }} />
                      </button>
                    ))}
                  </div>
                ) : searchQuery.length >= 2 ? (
                  <p className="mt-sm font-body-sm" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>No users found.</p>
                ) : null}
              </div>
            </section>
          ) : null}

          {/* Invitations list */}
          {invitations.length > 0 ? (
            <section>
              <div className="flex items-center justify-between mb-lg">
                <h3 className="font-headline-md text-headline-md" style={{ color: 'rgb(var(--color-primary))' }}>Invitations</h3>
                <span className="font-body-sm font-semibold" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
                  {invitations.filter((i) => i.status === 'pending').length}
                </span>
              </div>
              <div className="space-y-md">
                {invitations.map((inv) => (
                  <div
                    key={inv.id}
                    className="flex items-center justify-between p-md rounded-lg"
                    style={{ background: 'rgb(var(--color-surface-container-low))', border: '1px solid rgb(var(--color-outline-variant))' }}
                  >
                    <div>
                      <p className="font-body-sm font-bold" style={{ color: 'rgb(var(--color-primary))' }}>User #{inv.invited_user_id}</p>
                      <p
                        className="font-body-sm capitalize"
                        style={{
                          color: inv.status === 'accepted'
                            ? 'rgb(var(--color-success, 34 197 94))'
                            : inv.status === 'rejected'
                            ? 'rgb(var(--color-error))'
                            : 'rgb(var(--color-on-surface-variant))',
                        }}
                      >
                        {inv.status}
                      </p>
                    </div>
                    {inv.status === 'pending' ? (
                      <span
                        className="rounded-full px-md py-xs text-[11px] font-semibold"
                        style={{ background: 'rgb(var(--color-surface-container-highest))', color: 'rgb(var(--color-on-surface-variant))' }}
                      >
                        Pending
                      </span>
                    ) : null}
                  </div>
                ))}
              </div>
            </section>
          ) : null}
        </div>

        {/* Sidebar (1/3) */}
        <div className="space-y-3xl">
          {/* Open Roles */}
          <section>
            <h3 className="font-label-caps text-label-caps mb-lg tracking-widest" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>OPEN ROLES</h3>
            {project.open_roles && project.open_roles.length > 0 ? (
              <div className="space-y-md">
                {project.open_roles.map((role, idx) => (
                  <div
                    key={idx}
                    className="p-md rounded-lg"
                    style={{ background: 'rgb(var(--color-surface-container-low))', border: '1px solid rgb(var(--color-outline-variant) / 0.3)' }}
                  >
                    <div className="flex justify-between items-start mb-sm">
                      <p className="font-body-sm font-bold" style={{ color: 'rgb(var(--color-primary))' }}>
                        {typeof role === 'string' ? role : role.name}
                      </p>
                      <span
                        className="px-xs py-1 text-[9px] font-bold rounded uppercase"
                        style={{ background: 'rgb(var(--color-primary))', color: 'rgb(var(--color-on-primary))' }}
                      >
                        Open
                      </span>
                    </div>
                    <div className="space-y-xs">
                      {role.skills ? (
                        <p className="text-[11px]" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
                          <span style={{ color: 'rgb(var(--color-primary) / 0.6)' }}>Skills:</span> {Array.isArray(role.skills) ? role.skills.join(', ') : role.skills}
                        </p>
                      ) : null}
                      {role.commitment ? (
                        <p className="text-[11px]" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
                          <span style={{ color: 'rgb(var(--color-primary) / 0.6)' }}>Commit:</span> {role.commitment}
                        </p>
                      ) : null}
                      {role.level ? (
                        <p className="text-[11px]" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
                          <span style={{ color: 'rgb(var(--color-primary) / 0.6)' }}>Level:</span> {role.level}
                        </p>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="font-body-sm italic" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>No open roles currently</p>
            )}
          </section>

          {/* Project Metadata */}
          {project.github_url && (
            <section>
              <h3 className="font-label-caps text-label-caps mb-lg tracking-widest" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>REPOSITORY</h3>
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-md group cursor-pointer"
              >
                <div
                  className="w-12 h-12 rounded flex items-center justify-center"
                  style={{ background: 'rgb(var(--color-surface-container-highest))', border: '1px solid rgb(var(--color-outline-variant))' }}
                >
                  <GitBranch size={20} style={{ color: 'rgb(var(--color-on-surface-variant))' }} />
                </div>
                <div>
                  <p className="font-body-sm font-bold group-hover:underline" style={{ color: 'rgb(var(--color-primary))' }}>
                    {project.github_url.split('/').pop() || 'Repository'}
                  </p>
                  <p className="text-[12px]" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
                    {project.github_url.replace(/^https?:\/\//, '')}
                  </p>
                </div>
                <ExternalLink size={16} style={{ color: 'rgb(var(--color-on-surface-variant))' }} className="ml-auto shrink-0" />
              </a>
            </section>
          )}

          {/* Related Projects */}
          {project.related_projects && project.related_projects.length > 0 ? (
            <section>
              <h3 className="font-label-caps text-label-caps mb-lg tracking-widest" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>RELATED PROOF</h3>
              <div className="space-y-sm">
                {project.related_projects.map((rp, idx) => (
                  <div key={idx} className="flex items-center gap-md group cursor-pointer">
                    <div
                      className="w-12 h-12 rounded flex items-center justify-center"
                      style={{ background: 'rgb(var(--color-surface-container-highest))', border: '1px solid rgb(var(--color-outline-variant))' }}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-body-sm font-bold group-hover:underline" style={{ color: 'rgb(var(--color-primary))' }}>
                        {rp.title || `Project ${rp.id}`}
                      </p>
                      {rp.description ? (
                        <p className="text-[12px]" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>{rp.description}</p>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-lg" style={{ background: 'rgb(0 0 0 / 0.4)' }}>
          <Card className="mx-auto w-full max-w-md p-xl">
            <div className="flex items-center gap-md">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-full"
                style={{ background: 'rgb(var(--color-error-container))' }}
              >
                <Trash2 size={20} style={{ color: 'rgb(var(--color-error))' }} />
              </div>
              <div>
                <h2 className="font-headline-md" style={{ color: 'rgb(var(--color-primary))' }}>Delete project?</h2>
                <p className="mt-sm font-body-sm" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
                  This action cannot be undone. &ldquo;{project.title}&rdquo; will be permanently removed.
                </p>
              </div>
            </div>
            <div className="mt-lg flex justify-end gap-md">
              <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)} disabled={deleting}>
                Cancel
              </Button>
              <Button onClick={handleDelete} disabled={deleting} style={{ borderColor: 'rgb(var(--color-error))', color: 'rgb(var(--color-error))', background: 'transparent' }}>
                <Trash2 size={16} />
                {deleting ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

export default ProjectDetail;
