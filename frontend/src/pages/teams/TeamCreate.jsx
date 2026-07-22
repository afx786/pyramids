import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import FieldError from '../../components/common/FieldError.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import Button from '../../components/ui/Button.jsx';
import Card from '../../components/ui/Card.jsx';
import Input from '../../components/ui/Input.jsx';
import { teamService } from '../../services/teamService.js';

function TeamCreate() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', description: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const next = {};
    if (form.name.trim().length < 2) next.name = 'Team name is required';
    if (form.description.trim().length < 10) next.description = 'Description must be at least 10 characters';
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setLoading(true);
    try {
      const team = await teamService.createTeam({ name: form.name, description: form.description });
      navigate(`/teams/${team.id}`);
    } catch (err) {
      setErrors({ _api: err.message || 'Failed to create team' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        eyebrow="Collaboration"
        title="Create Team"
        description="Start a new team for your project or research group."
      />

      <Card className="mt-10 p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {errors._api && (
            <p className="rounded-lg px-4 py-3 text-sm font-medium" style={{ background: 'rgb(var(--color-error-container))', color: 'rgb(var(--color-on-error-container))' }}>{errors._api}</p>
          )}

          <label className="space-y-2">
            <span className="text-sm font-black text-primary">Team Name</span>
            <Input placeholder="e.g. Campus AI Builders" value={form.name} onChange={(e) => updateField('name', e.target.value)} />
            <FieldError>{errors.name}</FieldError>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-black text-primary">Description</span>
            <textarea
              className="min-h-28 w-full rounded-lg border border-subtle bg-surface px-4 py-3 text-sm font-semibold leading-6 text-primary outline-none"
              placeholder="What is your team working on?"
              value={form.description}
              onChange={(e) => updateField('description', e.target.value)}
            />
            <FieldError>{errors.description}</FieldError>
          </label>

          <div className="flex justify-end gap-3">
            <Link to="/teams"><Button variant="secondary" type="button">Cancel</Button></Link>
            <Button type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create Team'}</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default TeamCreate;
