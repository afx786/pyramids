import { Plus, Save, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ErrorState from '../../components/common/ErrorState.jsx';
import LoadingState from '../../components/common/LoadingState.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import Button from '../../components/ui/Button.jsx';
import Card from '../../components/ui/Card.jsx';
import FormField from '../../components/ui/FormField.jsx';
import Input from '../../components/ui/Input.jsx';
import { DOMAINS } from '../../data/constants.js';
import { hackathonService } from '../../services/hackathonService.js';

const emptyFaq = () => ({ question: '', answer: '' });

const initialState = {
  title: '', description: '', banner_url: '',
  start_date: '', end_date: '',
  mode: 'Online', location: '',
  official_website: '', registration_link: '',
  prize_pool: '', team_size_min: 1, team_size_max: 5,
  domains: [], faqs: [], contact_info: '',
};

function HackathonCreate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    hackathonService.get(id)
      .then((data) => {
        const h = data;
        setForm({
          title: h.title || '',
          description: h.description || '',
          banner_url: h.banner_url || '',
          start_date: h.start_date || '',
          end_date: h.end_date || '',
          mode: h.mode || 'Online',
          location: h.venue || h.city || h.country ? [h.venue, h.city, h.country].filter(Boolean).join(', ') : '',
          official_website: h.official_website || '',
          registration_link: h.registration_link || '',
          prize_pool: h.prize_pool || '',
          team_size_min: h.team_size_min ?? 1,
          team_size_max: h.team_size_max ?? 5,
          domains: h.domains || [],
          faqs: h.faqs || [],
          contact_info: h.contact_info || '',
        });
      })
      .catch((err) => setError(err.message || 'Failed to load hackathon'))
      .finally(() => setLoading(false));
  }, [id]);

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError('');
  }

  function toggleDomain(domain) {
    setForm((prev) => ({
      ...prev,
      domains: prev.domains.includes(domain)
        ? prev.domains.filter((d) => d !== domain)
        : [...prev.domains, domain],
    }));
  }

  function addFaq() { setForm((prev) => ({ ...prev, faqs: [...prev.faqs, emptyFaq()] })); }
  function removeFaq(i) { setForm((prev) => ({ ...prev, faqs: prev.faqs.filter((_, idx) => idx !== i) })); }
  function updateFaq(i, field, value) {
    setForm((prev) => {
      const faqs = [...prev.faqs];
      faqs[i] = { ...faqs[i], [field]: value };
      return { ...prev, faqs };
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError('');

    const payload = {
      ...form,
      venue: form.mode === 'Online' ? '' : form.location,
      city: '',
      country: '',
    };

    try {
      if (isEditing) {
        await hackathonService.update(id, payload);
      } else {
        await hackathonService.createDraft(payload);
      }
      navigate('/hackathons/host');
    } catch (err) {
      setError(err.message || 'Failed to save hackathon');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <LoadingState label="Loading hackathon..." />;
  if (error && !saving && isEditing) return <ErrorState title={error} />;

  return (
    <div className="animate-fade-in mx-auto max-w-4xl p-xl">
      <PageHeader
        eyebrow={isEditing ? 'Edit Hackathon' : 'New Hackathon'}
        title={isEditing ? 'Edit Hackathon' : 'Create Hackathon'}
        description="Fill in the details below to create or update your hackathon."
      />

      <div className="mt-xl space-y-lg">
        {error ? (
          <p className="rounded-lg px-lg py-sm font-body-sm" style={{ background: 'rgb(var(--color-error-container))', color: 'rgb(var(--color-on-error-container))' }}>{error}</p>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-lg">
          <Card className="p-xl">
            <p className="font-label-caps text-label-caps mb-lg" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>HACKATHON DETAILS</p>
            <div className="grid gap-lg sm:grid-cols-2">
              <FormField label="Title" required className="sm:col-span-2">
                <Input placeholder="Pyramids Global Hackathon 2026" value={form.title} onChange={(e) => handleChange('title', e.target.value)} />
              </FormField>
              <FormField label="Short Description" required className="sm:col-span-2">
                <textarea
                  className="min-h-24 w-full rounded-lg px-md py-sm font-body-sm leading-6"
                  style={{ background: 'rgb(var(--color-surface-container-lowest))', boxShadow: '0 0 0 1px rgb(var(--color-outline-variant))', color: 'rgb(var(--color-on-surface))' }}
                  placeholder="Describe what this hackathon is about..."
                  value={form.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                />
              </FormField>
              <FormField label="Banner Image">
                <Input placeholder="https://example.com/banner.png" value={form.banner_url} onChange={(e) => handleChange('banner_url', e.target.value)} />
              </FormField>
            </div>
            <div className="mt-lg">
              <p className="font-label-caps text-label-caps mb-md" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>Tags</p>
              <div className="flex flex-wrap gap-md">
                {DOMAINS.map((domain) => (
                  <label key={domain} className="flex items-center gap-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.domains.includes(domain)}
                      onChange={() => toggleDomain(domain)}
                      className="h-4 w-4 rounded"
                    />
                    <span className="font-body-sm" style={{ color: 'rgb(var(--color-on-surface))' }}>{domain}</span>
                  </label>
                ))}
              </div>
            </div>
          </Card>

          <Card className="p-xl">
            <p className="font-label-caps text-label-caps mb-lg" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>SCHEDULE</p>
            <div className="grid gap-lg sm:grid-cols-2">
              <FormField label="Start Date" required>
                <Input type="datetime-local" value={form.start_date} onChange={(e) => handleChange('start_date', e.target.value)} />
              </FormField>
              <FormField label="End Date" required>
                <Input type="datetime-local" value={form.end_date} onChange={(e) => handleChange('end_date', e.target.value)} />
              </FormField>
            </div>
          </Card>

          <Card className="p-xl">
            <p className="font-label-caps text-label-caps mb-lg" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>MODE & LOCATION</p>
            <div className="grid gap-lg sm:grid-cols-2">
              <FormField label="Mode" required>
                <select
                  className="w-full rounded-lg py-sm px-md font-body-sm"
                  style={{ background: 'rgb(var(--color-surface-container-lowest))', boxShadow: '0 0 0 1px rgb(var(--color-outline-variant))', color: 'rgb(var(--color-on-surface))' }}
                  value={form.mode}
                  onChange={(e) => handleChange('mode', e.target.value)}
                >
                  <option>Online</option>
                  <option>Offline</option>
                  <option>Hybrid</option>
                </select>
              </FormField>
              {form.mode !== 'Online' ? (
                <FormField label="Location">
                  <Input placeholder="Main Auditorium, San Francisco, USA" value={form.location} onChange={(e) => handleChange('location', e.target.value)} />
                </FormField>
              ) : null}
            </div>
          </Card>

          <Card className="p-xl">
            <p className="font-label-caps text-label-caps mb-lg" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>LINKS</p>
            <div className="grid gap-lg sm:grid-cols-2">
              <FormField label="Official Website">
                <Input placeholder="https://hackathon.dev" value={form.official_website} onChange={(e) => handleChange('official_website', e.target.value)} />
              </FormField>
              <FormField label="Registration Link">
                <Input placeholder="https://example.com/register" value={form.registration_link} onChange={(e) => handleChange('registration_link', e.target.value)} />
              </FormField>
            </div>
          </Card>

          <Card className="p-xl">
            <p className="font-label-caps text-label-caps mb-lg" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>COMPETITION DETAILS</p>
            <div className="grid gap-lg sm:grid-cols-2">
              <FormField label="Prize Pool">
                <Input placeholder="$10,000" value={form.prize_pool} onChange={(e) => handleChange('prize_pool', e.target.value)} />
              </FormField>
              <FormField label="Minimum Team Size">
                <Input type="number" min={1} value={form.team_size_min} onChange={(e) => handleChange('team_size_min', Number(e.target.value))} />
              </FormField>
              <FormField label="Maximum Team Size">
                <Input type="number" min={1} value={form.team_size_max} onChange={(e) => handleChange('team_size_max', Number(e.target.value))} />
              </FormField>
            </div>
          </Card>

          <Card className="p-xl">
            <div className="flex items-center justify-between mb-lg">
              <p className="font-label-caps text-label-caps" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>FAQs</p>
              <Button type="button" variant="secondary" size="sm" onClick={addFaq}>
                <Plus size={14} /> Add FAQ
              </Button>
            </div>
            {form.faqs.length === 0 ? (
              <p className="font-body-sm" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>No FAQs added yet.</p>
            ) : null}
            {form.faqs.map((faq, i) => (
              <div key={i} className="grid gap-md sm:grid-cols-2 mb-md p-md rounded-lg" style={{ background: 'rgb(var(--color-surface-container-high))' }}>
                <FormField label="Question" className="sm:col-span-2">
                  <Input value={faq.question} onChange={(e) => updateFaq(i, 'question', e.target.value)} />
                </FormField>
                <FormField label="Answer" className="sm:col-span-2">
                  <textarea
                    className="min-h-16 w-full rounded-lg px-md py-sm font-body-sm leading-6"
                    style={{ background: 'rgb(var(--color-surface-container-lowest))', boxShadow: '0 0 0 1px rgb(var(--color-outline-variant))', color: 'rgb(var(--color-on-surface))' }}
                    value={faq.answer}
                    onChange={(e) => updateFaq(i, 'answer', e.target.value)}
                  />
                </FormField>
                <div className="sm:col-span-2 flex justify-end">
                  <button type="button" onClick={() => removeFaq(i)} style={{ color: 'rgb(var(--color-error))' }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </Card>

          <Card className="p-xl">
            <p className="font-label-caps text-label-caps mb-lg" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>CONTACT</p>
            <FormField label="Contact Information">
              <Input placeholder="Email, Discord, Telegram, or Website URL" value={form.contact_info} onChange={(e) => handleChange('contact_info', e.target.value)} />
            </FormField>
          </Card>

          <div className="flex justify-end gap-md pt-lg" style={{ borderTop: '1px solid rgb(var(--color-outline-variant))' }}>
            <Button type="submit" disabled={saving}>
              <Save size={16} />
              {saving ? 'Saving...' : 'Save as Draft'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default HackathonCreate;
