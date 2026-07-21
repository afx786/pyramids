import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader.jsx';
import Button from '../../components/ui/Button.jsx';
import Card from '../../components/ui/Card.jsx';
import FormField from '../../components/ui/FormField.jsx';
import Input from '../../components/ui/Input.jsx';
import { organizationService } from '../../services/organizationService.js';

const ORG_TYPES = [
  'University',
  'Company',
  'Community',
  'Club',
  'Startup',
  'Research Lab',
  'Incubator',
  'Innovation Cell',
];

function OrganizationCreate() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    description: '',
    org_type: ORG_TYPES[0],
    logo_url: '',
    website: '',
    email: '',
    location: '',
    domains: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const next = {};
    if (form.name.trim().length < 2) next.name = 'Organization name is required';
    if (form.description.trim().length < 10) next.description = 'Description must be at least 10 characters';
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    const domains = form.domains
      .split(',')
      .map((d) => d.trim())
      .filter(Boolean);

    setLoading(true);
    try {
      await organizationService.create({
        name: form.name,
        description: form.description,
        org_type: form.org_type,
        logo_url: form.logo_url.trim() || undefined,
        website: form.website.trim() || undefined,
        email: form.email.trim() || undefined,
        location: form.location.trim() || undefined,
        domains: domains.length > 0 ? domains : undefined,
      });
      navigate('/organizations');
    } catch (err) {
      setErrors({ _api: err.message || 'Failed to create organization' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        eyebrow="Organizations"
        title="Create Organization"
        description="Register a new organization on the platform."
      />

      <Card className="mt-xl p-xl">
        <form onSubmit={handleSubmit} className="space-y-xl">
          {errors._api && (
            <p className="rounded-lg px-lg py-sm font-body-sm" style={{ background: 'rgb(var(--color-error-container))', color: 'rgb(var(--color-on-error-container))' }}>{errors._api}</p>
          )}

          <div className="grid grid-cols-2 gap-lg">
            <FormField label="Name" required error={errors.name} className="col-span-2">
              <Input placeholder="e.g. MIT Media Lab" value={form.name} onChange={(e) => updateField('name', e.target.value)} />
            </FormField>

            <FormField label="Description" error={errors.description} className="col-span-2">
              <textarea
                className="min-h-28 w-full rounded-lg py-sm px-md font-body-sm text-body-sm leading-6 outline-none transition-all"
                style={{
                  background: 'rgb(var(--color-surface-container-lowest))',
                  boxShadow: '0 0 0 1px rgb(var(--color-outline-variant))',
                  color: 'rgb(var(--color-on-surface))',
                }}
                onFocus={(e) => { e.target.style.boxShadow = '0 0 0 1px rgb(var(--color-primary))'; }}
                onBlur={(e) => { e.target.style.boxShadow = '0 0 0 1px rgb(var(--color-outline-variant))'; }}
                placeholder="What does your organization do?"
                value={form.description}
                onChange={(e) => updateField('description', e.target.value)}
              />
            </FormField>

            <FormField label="Organization Type">
              <select
                className="w-full rounded-lg py-sm px-md font-body-sm text-body-sm outline-none"
                style={{
                  background: 'rgb(var(--color-surface-container-lowest))',
                  boxShadow: '0 0 0 1px rgb(var(--color-outline-variant))',
                  color: 'rgb(var(--color-on-surface))',
                }}
                value={form.org_type}
                onChange={(e) => updateField('org_type', e.target.value)}
              >
                {ORG_TYPES.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </FormField>

            <FormField label="Logo URL">
              <Input placeholder="https://example.com/logo.png" value={form.logo_url} onChange={(e) => updateField('logo_url', e.target.value)} />
            </FormField>

            <FormField label="Website">
              <Input placeholder="https://example.com" value={form.website} onChange={(e) => updateField('website', e.target.value)} />
            </FormField>

            <FormField label="Email">
              <Input placeholder="contact@example.com" value={form.email} onChange={(e) => updateField('email', e.target.value)} />
            </FormField>

            <FormField label="Location">
              <Input placeholder="e.g. Cambridge, MA" value={form.location} onChange={(e) => updateField('location', e.target.value)} />
            </FormField>

            <FormField label="Domains" className="col-span-2">
              <Input placeholder="AI, Education, Robotics (comma-separated)" value={form.domains} onChange={(e) => updateField('domains', e.target.value)} />
            </FormField>
          </div>

          <div className="flex justify-end gap-md">
            <Link to="/organizations"><Button variant="secondary" type="button">Cancel</Button></Link>
            <Button type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create Organization'}</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default OrganizationCreate;
