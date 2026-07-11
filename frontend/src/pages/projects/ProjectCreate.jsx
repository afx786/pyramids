import { Check, Plus } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import FieldError from '../../components/common/FieldError.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import Button from '../../components/ui/Button.jsx';
import Card from '../../components/ui/Card.jsx';
import Input from '../../components/ui/Input.jsx';
import SkillTag from '../../components/ui/SkillTag.jsx';
import { projectService } from '../../services/projectService.js';

const DOMAINS = [
  'AI / Machine Learning',
  'Frontend Engineering',
  'Backend Systems',
  'Product Design',
  'Cybersecurity',
  'Open Source',
  'Mobile',
  'Data Science',
  'DevOps',
  'Other',
];

const STARTER_SKILLS = ['React', 'Python', 'Design', 'APIs', 'ML', 'Research'];

function ProjectCreate() {
  const [submitted, setSubmitted] = useState(false);
  const [createdProject, setCreatedProject] = useState(null);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    domain: DOMAINS[0],
    description: '',
    stack: '',
  });

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: '' }));
    setApiError('');
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = {};

    if (form.title.trim().length < 4) nextErrors.title = 'Project title should be at least 4 characters.';
    if (form.description.trim().length < 20) nextErrors.description = 'Description should be at least 20 characters.';
    if (!form.stack.trim()) nextErrors.stack = 'Add at least one skill or tool.';

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const skills = form.stack
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    setLoading(true);
    try {
      const project = await projectService.createProject({
        title: form.title,
        domain: form.domain,
        description: form.description,
        skills,
      });
      setCreatedProject(project);
      setSubmitted(true);
    } catch (err) {
      setApiError(err.message || 'Failed to create project. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        eyebrow="New build"
        title="Create Project"
        description="Describe what you are building, what skills it proves, and what kind of teammates you need."
      />

      <Card className="mt-10 p-8">
        {submitted ? (
          <div className="flex min-h-[380px] flex-col items-center justify-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-app">
              <Check className="h-8 w-8" />
            </div>
            <h2 className="mt-5 text-3xl font-black text-primary">Project created!</h2>
            <p className="mt-3 max-w-md text-sm font-medium leading-6 text-secondary">
              <strong>{createdProject?.title}</strong> has been saved to the platform.
            </p>
            <div className="mt-6 flex gap-3">
              <Button onClick={() => { setSubmitted(false); setForm({ title: '', domain: DOMAINS[0], description: '', stack: '' }); }}>
                Add another project
              </Button>
              <Link to="/dashboard">
                <Button variant="secondary">Go to Dashboard</Button>
              </Link>
            </div>
          </div>
        ) : (
          <form className="grid grid-cols-2 gap-6" onSubmit={handleSubmit}>
            {apiError && (
              <p className="col-span-2 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-600">{apiError}</p>
            )}

            <label className="space-y-2">
              <span className="text-sm font-black text-primary">Project Title</span>
              <Input
                placeholder="Campus Skill Graph"
                value={form.title}
                onChange={(event) => updateField('title', event.target.value)}
              />
              <FieldError>{errors.title}</FieldError>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-black text-primary">Domain</span>
              <select
                className="h-11 w-full rounded-lg border border-subtle bg-surface px-4 text-sm font-semibold text-primary outline-none"
                value={form.domain}
                onChange={(event) => updateField('domain', event.target.value)}
              >
                {DOMAINS.map((domain) => (
                  <option key={domain}>{domain}</option>
                ))}
              </select>
            </label>

            <label className="col-span-2 space-y-2">
              <span className="text-sm font-black text-primary">Short Description</span>
              <textarea
                className="min-h-32 w-full rounded-lg border border-subtle bg-surface px-4 py-3 text-sm font-semibold leading-6 text-primary outline-none placeholder:text-secondary"
                placeholder="What problem does this project solve?"
                value={form.description}
                onChange={(event) => updateField('description', event.target.value)}
              />
              <FieldError>{errors.description}</FieldError>
            </label>

            <label className="col-span-2 space-y-2">
              <span className="text-sm font-black text-primary">Skills / Tech Stack</span>
              <Input
                placeholder="React, Tailwind, Node, Python"
                value={form.stack}
                onChange={(event) => updateField('stack', event.target.value)}
              />
              <FieldError>{errors.stack}</FieldError>
            </label>

            <div className="col-span-2">
              <span className="text-sm font-black text-primary">Suggested Skills</span>
              <div className="mt-3 flex flex-wrap gap-2">
                {STARTER_SKILLS.map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => updateField('stack', form.stack ? `${form.stack}, ${skill}` : skill)}
                  >
                    <SkillTag>{skill}</SkillTag>
                  </button>
                ))}
              </div>
            </div>

            <div className="col-span-2 flex justify-end gap-3">
              <Button
                variant="secondary"
                type="reset"
                onClick={() => { setForm({ title: '', domain: DOMAINS[0], description: '', stack: '' }); setErrors({}); }}
              >
                Clear
              </Button>
              <Button type="submit" disabled={loading}>
                <Plus className="h-4 w-4" />
                {loading ? 'Creating...' : 'Create Project'}
              </Button>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
}

export default ProjectCreate;
