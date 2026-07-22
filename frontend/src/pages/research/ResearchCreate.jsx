import { Check, ExternalLink, Plus, X } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader.jsx';
import Button from '../../components/ui/Button.jsx';
import Card from '../../components/ui/Card.jsx';
import FormField from '../../components/ui/FormField.jsx';
import Input from '../../components/ui/Input.jsx';
import { researchService } from '../../services/researchService.js';

const RESEARCH_TYPES = [
  'Research Topic', 'Thesis', 'Capstone', 'Publication',
  'Innovation Challenge', 'Industry Problem', 'Open Research',
];

const DIFFICULTIES = ['Beginner', 'Intermediate', 'Advanced'];

const MODES = ['Remote', 'Offline', 'Hybrid'];

function ResearchCreate() {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [created, setCreated] = useState(null);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [errors, setErrors] = useState({});
  const [requiredRoles, setRequiredRoles] = useState([]);
  const [newRole, setNewRole] = useState('');

  const [form, setForm] = useState({
    title: '',
    description: '',
    abstract: '',
    problem_statement: '',
    research_type: RESEARCH_TYPES[0],
    domain: '',
    skills_needed: '',
    expected_outcomes: '',
    methodology: '',
    datasets: '',
    resources: '',
    repository_url: '',
    paper_link: '',
    funding: '',
    supervisor: '',
    institution: '',
    publication_goal: '',
    duration: '',
    mode: MODES[0],
    open_positions: 1,
    difficulty: DIFFICULTIES[0],
    application_deadline: '',
    team_size: 1,
  });

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
    setApiError('');
  }

  function addRole() {
    const trimmed = newRole.trim();
    if (trimmed && !requiredRoles.includes(trimmed)) {
      setRequiredRoles([...requiredRoles, trimmed]);
      setNewRole('');
    }
  }

  function removeRole(role) {
    setRequiredRoles(requiredRoles.filter((r) => r !== role));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const nextErrors = {};

    if (!form.title.trim()) nextErrors.title = 'Title is required';
    if (!form.description.trim()) nextErrors.description = 'Description is required';
    if (!form.domain.trim()) nextErrors.domain = 'Domain is required';

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setLoading(true);
    try {
      const result = await researchService.create({
        ...form,
        required_roles: requiredRoles,
        open_positions: Number(form.open_positions),
        team_size: Number(form.team_size),
      });
      setCreated(result);
      setSubmitted(true);
    } catch (err) {
      setApiError(err.message || 'Failed to create research. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function renderField(field, label, type = 'text', opts = {}) {
    const { required, placeholder, rows, className } = opts;
    return (
      <FormField label={label} required={required} error={errors[field]} className={className}>
        {type === 'textarea' ? (
          <textarea
            value={form[field]}
            onChange={(e) => updateField(field, e.target.value)}
            placeholder={placeholder}
            rows={rows || 4}
            className="w-full rounded-lg py-2 px-3 font-body-sm text-body-sm leading-6 transition-all"
            style={{
              background: 'rgb(var(--color-surface-container-lowest))',
              border: 'none',
              outline: 'none',
              boxShadow: '0 0 0 1px rgb(var(--color-outline-variant))',
              color: 'rgb(var(--color-on-surface))',
            }}
            onFocus={(e) => { e.target.style.boxShadow = '0 0 0 1px rgb(var(--color-primary))'; }}
            onBlur={(e) => { e.target.style.boxShadow = '0 0 0 1px rgb(var(--color-outline-variant))'; }}
          />
        ) : type === 'select' ? (
          <select
            value={form[field]}
            onChange={(e) => updateField(field, e.target.value)}
            className="w-full rounded-lg py-2 px-3 font-body-sm text-body-sm"
            style={{
              background: 'rgb(var(--color-surface-container-lowest))',
              border: 'none',
              outline: 'none',
              boxShadow: '0 0 0 1px rgb(var(--color-outline-variant))',
              color: 'rgb(var(--color-on-surface))',
            }}
          >
            {opts.options.map((opt) => <option key={opt}>{opt}</option>)}
          </select>
        ) : type === 'number' ? (
          <Input
            type="number"
            min={opts.min || 0}
            value={form[field]}
            onChange={(e) => updateField(field, e.target.value)}
            placeholder={placeholder}
          />
        ) : (
          <Input
            type={type}
            value={form[field]}
            onChange={(e) => updateField(field, e.target.value)}
            placeholder={placeholder}
          />
        )}
      </FormField>
    );
  }

  if (submitted && created) {
    return (
      <div className="mx-auto max-w-5xl">
        <PageHeader eyebrow="Research & Innovation" title="Create Research" />
        <Card className="mt-8 p-10">
          <div className="flex min-h-[380px] flex-col items-center justify-center text-center">
            <div
              className="flex h-16 w-16 items-center justify-center rounded-full"
              style={{
                background: 'rgb(var(--color-primary))',
                color: 'rgb(var(--color-on-primary))',
              }}
            >
              <Check className="h-8 w-8" />
            </div>
            <h2 className="mt-5 font-headline-md text-3xl" style={{ color: 'rgb(var(--color-primary))' }}>
              Research created!
            </h2>
            <p className="mt-3 max-w-md font-body-sm text-body-sm leading-6" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
              <strong>{created?.title}</strong> has been published to the Research Hub.
            </p>
            <div className="mt-6 flex gap-3">
              <Button onClick={() => { setSubmitted(false); setForm({ title: '', description: '', abstract: '', problem_statement: '', research_type: RESEARCH_TYPES[0], domain: '', skills_needed: '', expected_outcomes: '', methodology: '', datasets: '', resources: '', repository_url: '', paper_link: '', funding: '', supervisor: '', institution: '', publication_goal: '', duration: '', mode: MODES[0], open_positions: 1, difficulty: DIFFICULTIES[0], application_deadline: '', team_size: 1 }); setRequiredRoles([]); }}>
                Add another
              </Button>
              <Link to="/research">
                <Button variant="secondary">Back to Hub</Button>
              </Link>
              <Link to={`/research/${created.id}`}>
                <Button variant="ghost">
                  View Research
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        eyebrow="Research & Innovation"
        title="Create Research"
        description="Define a new research project, thesis, or innovation challenge."
      />

      <Card className="mt-8 p-8">
        <form onSubmit={handleSubmit} className="space-y-10">
          {apiError && (
            <p
              className="rounded-lg px-4 py-3 font-body-sm text-body-sm"
              style={{ background: 'rgb(var(--color-error-container))', color: 'rgb(var(--color-on-error-container))' }}
            >
              {apiError}
            </p>
          )}

          <section className="space-y-5">
            <h3 className="font-label-caps text-label-caps uppercase tracking-widest" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
              Basic Information
            </h3>
            <div className="grid gap-5">
              {renderField('title', 'Title', 'text', { required: true, placeholder: 'Enter research title' })}
              {renderField('description', 'Description', 'textarea', { required: true, placeholder: 'Short description of the research', rows: 3 })}
              {renderField('abstract', 'Abstract', 'textarea', { placeholder: 'Detailed abstract', rows: 5 })}
              {renderField('problem_statement', 'Problem Statement', 'textarea', { placeholder: 'What problem does this research address?', rows: 4 })}
            </div>
          </section>

          <hr style={{ borderColor: 'rgb(var(--color-outline-variant) / 0.5)' }} />

          <section className="space-y-5">
            <h3 className="font-label-caps text-label-caps uppercase tracking-widest" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
              Type & Domain
            </h3>
            <div className="grid gap-5 sm:grid-cols-2">
              {renderField('research_type', 'Research Type', 'select', { options: RESEARCH_TYPES })}
              {renderField('domain', 'Domain', 'text', { required: true, placeholder: 'e.g. AI / Machine Learning' })}
            </div>
          </section>

          <hr style={{ borderColor: 'rgb(var(--color-outline-variant) / 0.5)' }} />

          <section className="space-y-5">
            <h3 className="font-label-caps text-label-caps uppercase tracking-widest" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
              Skills & Roles
            </h3>
            <div className="grid gap-5">
              {renderField('skills_needed', 'Skills Needed', 'textarea', { placeholder: 'Comma-separated list of required skills', rows: 3 })}
              <FormField label="Required Roles">
                <div className="flex items-center gap-2">
                  <Input
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    placeholder="Type a role and press Add"
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addRole(); } }}
                  />
                  <Button type="button" variant="secondary" onClick={addRole} className="shrink-0">
                    <Plus size={16} />
                  </Button>
                </div>
                {requiredRoles.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {requiredRoles.map((role) => (
                      <span
                        key={role}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold"
                        style={{
                          background: 'rgb(var(--color-surface-container-high))',
                          color: 'rgb(var(--color-on-surface))',
                        }}
                      >
                        {role}
                        <button type="button" onClick={() => removeRole(role)} className="hover:opacity-70">
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </FormField>
            </div>
          </section>

          <hr style={{ borderColor: 'rgb(var(--color-outline-variant) / 0.5)' }} />

          <section className="space-y-5">
            <h3 className="font-label-caps text-label-caps uppercase tracking-widest" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
              Outcomes & Methodology
            </h3>
            <div className="grid gap-5">
              {renderField('expected_outcomes', 'Expected Outcomes', 'textarea', { placeholder: 'What will this research produce?', rows: 4 })}
              {renderField('methodology', 'Methodology', 'textarea', { placeholder: 'Research methodology and approach', rows: 4 })}
            </div>
          </section>

          <hr style={{ borderColor: 'rgb(var(--color-outline-variant) / 0.5)' }} />

          <section className="space-y-5">
            <h3 className="font-label-caps text-label-caps uppercase tracking-widest" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
              Resources
            </h3>
            <div className="grid gap-5 sm:grid-cols-2">
              {renderField('datasets', 'Datasets', 'textarea', { placeholder: 'Links or descriptions of datasets', rows: 3 })}
              {renderField('resources', 'Resources', 'textarea', { placeholder: 'Equipment, software, facilities', rows: 3 })}
              {renderField('repository_url', 'Repository URL', 'text', { placeholder: 'https://github.com/org/repo' })}
              {renderField('paper_link', 'Paper Link', 'text', { placeholder: 'https://arxiv.org/abs/...' })}
            </div>
          </section>

          <hr style={{ borderColor: 'rgb(var(--color-outline-variant) / 0.5)' }} />

          <section className="space-y-5">
            <h3 className="font-label-caps text-label-caps uppercase tracking-widest" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
              Institution
            </h3>
            <div className="grid gap-5 sm:grid-cols-2">
              {renderField('funding', 'Funding', 'text', { placeholder: 'Funding source or N/A' })}
              {renderField('supervisor', 'Supervisor', 'text', { placeholder: 'Supervisor name' })}
              {renderField('institution', 'Institution', 'text', { placeholder: 'University or organization' })}
              {renderField('publication_goal', 'Publication Goal', 'text', { placeholder: 'Target journal or conference' })}
            </div>
          </section>

          <hr style={{ borderColor: 'rgb(var(--color-outline-variant) / 0.5)' }} />

          <section className="space-y-5">
            <h3 className="font-label-caps text-label-caps uppercase tracking-widest" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
              Logistics
            </h3>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {renderField('duration', 'Duration', 'text', { placeholder: 'e.g. 3 months' })}
              {renderField('mode', 'Mode', 'select', { options: MODES })}
              {renderField('open_positions', 'Open Positions', 'number', { min: 0 })}
              {renderField('difficulty', 'Difficulty', 'select', { options: DIFFICULTIES })}
              {renderField('application_deadline', 'Application Deadline', 'datetime-local')}
              {renderField('team_size', 'Team Size', 'number', { min: 1 })}
            </div>
          </section>

          <div className="flex justify-end gap-3 pt-4" style={{ borderTop: '1px solid rgb(var(--color-outline-variant) / 0.5)' }}>
            <Link to="/research">
              <Button variant="secondary" type="button">Cancel</Button>
            </Link>
            <Button type="submit" disabled={loading}>
              <Plus className="h-4 w-4" />
              {loading ? 'Creating...' : 'Save & Publish'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default ResearchCreate;
