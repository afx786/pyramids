import { ArrowLeft, Check, ExternalLink, GitBranch, Pencil, Plus, Trash2, Triangle, UserPlus, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ErrorState from '../../components/common/ErrorState.jsx';
import FieldError from '../../components/common/FieldError.jsx';
import LoadingState from '../../components/common/LoadingState.jsx';
import Button from '../../components/ui/Button.jsx';
import Card from '../../components/ui/Card.jsx';
import Input from '../../components/ui/Input.jsx';
import SkillTag from '../../components/ui/SkillTag.jsx';
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

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6 flex items-center gap-4">
        <Link to="/dashboard" className="flex items-center gap-2 text-sm font-semibold text-secondary hover:text-primary transition">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
      </div>

      {editing ? (
        <Card className="p-8">
          <div className="mb-6">
            <p className="font-mono-label text-[11px] text-secondary">Edit project</p>
            <h2 className="mt-2 text-2xl font-black text-primary">Edit Project</h2>
          </div>

          {editErrors._api && (
            <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-600">{editErrors._api}</p>
          )}

          <div className="grid grid-cols-2 gap-6">
            <label className="col-span-2 space-y-2">
              <span className="text-sm font-black text-primary">Title</span>
              <Input value={form.title} onChange={(e) => handleEditChange('title', e.target.value)} />
              <FieldError>{editErrors.title}</FieldError>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-black text-primary">Domain</span>
              <select
                className="h-11 w-full rounded-lg border border-subtle bg-surface px-4 text-sm font-semibold text-primary outline-none"
                value={form.domain}
                onChange={(e) => handleEditChange('domain', e.target.value)}
              >
                {DOMAINS.map((d) => <option key={d}>{d}</option>)}
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-black text-primary">Status</span>
              <select
                className="h-11 w-full rounded-lg border border-subtle bg-surface px-4 text-sm font-semibold text-primary outline-none"
                value={form.status}
                onChange={(e) => handleEditChange('status', e.target.value)}
              >
                {STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </label>

            <label className="col-span-2 space-y-2">
              <span className="text-sm font-black text-primary">Description</span>
              <textarea
                className="min-h-28 w-full rounded-lg border border-subtle bg-surface px-4 py-3 text-sm font-semibold leading-6 text-primary outline-none"
                value={form.description}
                onChange={(e) => handleEditChange('description', e.target.value)}
              />
              <FieldError>{editErrors.description}</FieldError>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-black text-primary">Visibility</span>
              <select
                className="h-11 w-full rounded-lg border border-subtle bg-surface px-4 text-sm font-semibold text-primary outline-none"
                value={form.visibility}
                onChange={(e) => handleEditChange('visibility', e.target.value)}
              >
                {VISIBILITY.map((v) => <option key={v}>{v}</option>)}
              </select>
            </label>
          </div>

          <div className="mt-8 flex justify-end gap-3">
            <Button variant="secondary" onClick={handleCancelEdit}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>
              <Check className="h-4 w-4" />
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </Card>
      ) : (
        <>
          <Card className="p-8">
            <div className="flex items-start justify-between gap-6">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-3">
                  <p className="font-mono-label text-[11px] text-secondary">{project.domain}</p>
                  <span className="text-[11px] text-subtle">/</span>
                  <p className="font-mono-label text-[11px] text-secondary">{project.status}</p>
                </div>
                <h1 className="mt-3 text-4xl font-black leading-tight text-primary">{project.title}</h1>
                <p className="mt-4 max-w-3xl text-sm font-medium leading-6 text-secondary">{project.description}</p>

                <div className="mt-6 flex flex-wrap items-center gap-6">
                  <div>
                    <p className="text-xs font-medium text-secondary">Owner</p>
                    <p className="mt-0.5 text-sm font-semibold text-primary">{project.owner_name || '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-secondary">Visibility</p>
                    <p className="mt-0.5 text-sm font-semibold text-primary capitalize">{project.visibility}</p>
                  </div>
                  {project.verification_status && (
                    <div>
                      <p className="text-xs font-medium text-secondary">Verification</p>
                      <p className={`mt-0.5 text-sm font-semibold capitalize ${
                        project.verification_status === 'verified' ? 'text-green-600' : 'text-secondary'
                      }`}>
                        {project.verification_status}
                      </p>
                    </div>
                  )}
                  {project.repository_score != null && (
                    <div>
                      <p className="text-xs font-medium text-secondary">Repo Score</p>
                      <p className="mt-0.5 text-sm font-semibold text-primary">{project.repository_score}/100</p>
                    </div>
                  )}
                </div>

                {project.skills?.length > 0 && (
                  <div className="mt-6">
                    <p className="text-xs font-medium text-secondary">Skills</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {project.skills.map((skill) => <SkillTag key={skill}>{skill}</SkillTag>)}
                    </div>
                  </div>
                )}

                {project.technologies?.length > 0 && (
                  <div className="mt-5">
                    <p className="text-xs font-medium text-secondary">Technologies</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {project.technologies.map((t) => <SkillTag key={t.id}>{t.name}</SkillTag>)}
                    </div>
                  </div>
                )}

                {project.github_url && (
                  <div className="mt-5">
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
                    >
                      <GitBranch className="h-4 w-4" />
                      {project.github_url}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                )}

                {project.verified_skills?.length > 0 && (
                  <div className="mt-5">
                    <p className="text-xs font-medium text-secondary">Verified Skills</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {project.verified_skills.map((skill) => (
                        <SkillTag key={skill}>{skill}</SkillTag>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {isOwner && (
                <div className="flex shrink-0 flex-col gap-2">
                  <Button variant="secondary" onClick={() => setEditing(true)}>
                    <Pencil className="h-4 w-4" />
                    Edit
                  </Button>
                  <Button variant="ghost" onClick={() => setShowDeleteConfirm(true)} className="text-red-500 hover:bg-red-50 hover:text-red-600">
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </div>
              )}
            </div>
          </Card>

          <div className="mt-8 grid gap-8 xl:grid-cols-[1fr_360px]">
            <div className="space-y-6">
              {isOwner && (
                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <p className="font-mono-label text-[11px] text-secondary">Verification</p>
                  </div>
                  <p className="mt-3 text-sm font-medium leading-6 text-secondary">
                    {project.github_url
                      ? 'Repository is linked. You can re-verify or update the URL.'
                      : 'Link a public GitHub repository to verify your skills.'}
                  </p>
                  <div className="mt-4 flex items-center gap-3">
                    <Input
                      placeholder="https://github.com/user/repo"
                      value={githubUrl}
                      onChange={(e) => setGithubUrl(e.target.value)}
                    />
                    <Button onClick={handleVerify} disabled={verifying || !githubUrl.trim()} className="shrink-0">
                      <GitBranch className="h-4 w-4" />
                      {verifying ? 'Verifying...' : 'Verify'}
                    </Button>
                  </div>
                  {editErrors._verify && (
                    <p className="mt-2 text-sm font-medium text-red-600">{editErrors._verify}</p>
                  )}
                </Card>
              )}

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <p className="font-mono-label text-[11px] text-secondary">Members</p>
                  <span className="text-sm font-semibold text-secondary">{members.length}</span>
                </div>
                {members.length > 0 ? (
                  <div className="mt-5 space-y-3">
                    {members.map((m) => (
                      <div key={m.id} className="flex items-center justify-between border-t border-subtle pt-3 first:border-t-0 first:pt-0">
                        <div>
                          <p className="text-sm font-semibold text-primary">User #{m.user_id}</p>
                          <p className="text-xs font-medium text-secondary capitalize">{m.role}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-4 text-sm text-secondary">No members yet.</p>
                )}
              </Card>
            </div>

            <div className="space-y-6">
              {isOwner && (
                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <p className="font-mono-label text-[11px] text-secondary">Invite</p>
                    {!showInvite && (
                      <button
                        type="button"
                        onClick={() => setShowInvite(true)}
                        className="flex items-center gap-1 text-sm font-semibold text-primary"
                      >
                        <UserPlus className="h-4 w-4" />
                        Invite
                      </button>
                    )}
                  </div>

                  {showInvite && (
                    <div className="mt-4">
                      <Input
                        placeholder="Search users by name..."
                        value={searchQuery}
                        onChange={(e) => handleSearchUsers(e.target.value)}
                        autoFocus
                      />
                      {editErrors._invite && (
                        <p className="mt-2 text-sm font-medium text-red-600">{editErrors._invite}</p>
                      )}

                      {searchResults.length > 0 && (
                        <div className="mt-3 max-h-48 space-y-1 overflow-y-auto rounded-lg border border-subtle p-2">
                          {searchResults.map((u) => (
                            <button
                              key={u.id}
                              type="button"
                              disabled={inviting}
                              onClick={() => handleInvite(u.id)}
                              className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm transition hover:bg-accent-soft disabled:opacity-50"
                            >
                              <div>
                                <p className="font-semibold text-primary">{u.name}</p>
                                <p className="text-xs text-secondary">{u.rank} · {u.headline || 'Builder'}</p>
                              </div>
                              <Plus className="h-4 w-4 text-secondary" />
                            </button>
                          ))}
                        </div>
                      )}

                      {searchQuery.length >= 2 && searchResults.length === 0 && (
                        <p className="mt-2 text-sm text-secondary">No users found.</p>
                      )}

                      <button
                        type="button"
                        onClick={() => { setShowInvite(false); setSearchQuery(''); setSearchResults([]); }}
                        className="mt-2 text-sm font-semibold text-secondary hover:text-primary"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </Card>
              )}

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <p className="font-mono-label text-[11px] text-secondary">Invitations</p>
                  <span className="text-sm font-semibold text-secondary">
                    {invitations.filter((i) => i.status === 'pending').length}
                  </span>
                </div>
                {invitations.length > 0 ? (
                  <div className="mt-5 space-y-3">
                    {invitations.map((inv) => (
                      <div key={inv.id} className="flex items-center justify-between border-t border-subtle pt-3 first:border-t-0 first:pt-0">
                        <div>
                          <p className="text-sm font-semibold text-primary">User #{inv.invited_user_id}</p>
                          <p className={`text-xs font-medium capitalize ${
                            inv.status === 'accepted' ? 'text-green-600' : inv.status === 'rejected' ? 'text-red-500' : 'text-secondary'
                          }`}>
                            {inv.status}
                          </p>
                        </div>
                        {inv.status === 'pending' && (
                          <span className="rounded-full bg-yellow-100 px-2.5 py-0.5 text-[11px] font-semibold text-yellow-700">
                            Pending
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-4 text-sm text-secondary">No invitations sent.</p>
                )}
              </Card>
            </div>
          </div>
        </>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <Card className="mx-4 w-full max-w-md p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                <Trash2 className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h2 className="text-lg font-black text-primary">Delete project?</h2>
                <p className="mt-1 text-sm font-medium text-secondary">
                  This action cannot be undone. "{project.title}" will be permanently removed.
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)} disabled={deleting}>
                Cancel
              </Button>
              <Button onClick={handleDelete} disabled={deleting} className="bg-red-600 text-white hover:bg-red-700 border-red-600">
                <Trash2 className="h-4 w-4" />
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
