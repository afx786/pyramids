import { Plus, Save, Trash2, X } from 'lucide-react';
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

const emptySponsor = () => ({ name: '', logo_url: '', website: '' });
const emptyJudge = () => ({ name: '', title: '', organization: '' });
const emptyFaq = () => ({ question: '', answer: '' });

const initialState = {
  title: '', description: '', theme: '', banner_url: '', organizer: '',
  registration_opens: '', registration_closes: '', start_date: '', end_date: '',
  mode: 'Online', venue: '', city: '', country: '',
  official_website: '', registration_link: '',
  prize_pool: '', team_size_min: 1, team_size_max: 5, eligibility: '',
  domains: [], technologies: '',
  sponsors: [], judges: [], faqs: [],
  rules: '', contact_info: '',
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
          theme: h.theme || '',
          banner_url: h.banner_url || '',
          organizer: h.organizer || '',
          registration_opens: h.registration_opens || '',
          registration_closes: h.registration_closes || '',
          start_date: h.start_date || '',
          end_date: h.end_date || '',
          mode: h.mode || 'Online',
          venue: h.venue || '',
          city: h.city || '',
          country: h.country || '',
          official_website: h.official_website || '',
          registration_link: h.registration_link || '',
          prize_pool: h.prize_pool || '',
          team_size_min: h.team_size_min ?? 1,
          team_size_max: h.team_size_max ?? 5,
          eligibility: h.eligibility || '',
          domains: h.domains || [],
          technologies: Array.isArray(h.technologies) ? h.technologies.join(', ') : (h.technologies || ''),
          sponsors: h.sponsors || [],
          judges: h.judges || [],
          faqs: h.faqs || [],
          rules: h.rules || '',
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

  function addSponsor() { setForm((prev) => ({ ...prev, sponsors: [...prev.sponsors, emptySponsor()] })); }
  function removeSponsor(i) { setForm((prev) => ({ ...prev, sponsors: prev.sponsors.filter((_, idx) => idx !== i) })); }
  function updateSponsor(i, field, value) {
    setForm((prev) => {
      const sponsors = [...prev.sponsors];
      sponsors[i] = { ...sponsors[i], [field]: value };
      return { ...prev, sponsors };
    });
  }

  function addJudge() { setForm((prev) => ({ ...prev, judges: [...prev.judges, emptyJudge()] })); }
  function removeJudge(i) { setForm((prev) => ({ ...prev, judges: prev.judges.filter((_, idx) => idx !== i) })); }
  function updateJudge(i, field, value) {
    setForm((prev) => {
      const judges = [...prev.judges];
      judges[i] = { ...judges[i], [field]: value };
      return { ...prev, judges };
    });
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
      technologies: form.technologies.split(',').map((t) => t.trim()).filter(Boolean),
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

      <Card className="mt-xl p-xl">
        {error ? (
          <p className="mb-lg rounded-lg px-lg py-sm font-body-sm" style={{ background: 'rgb(var(--color-error-container))', color: 'rgb(var(--color-on-error-container))' }}>{error}</p>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-xl">
          <section>
            <p className="font-label-caps text-label-caps mb-lg" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>BASIC INFORMATION</p>
            <div className="grid gap-lg sm:grid-cols-2">
              <FormField label="Title" required className="sm:col-span-2">
                <Input placeholder="Pyramids Global Hackathon 2026" value={form.title} onChange={(e) => handleChange('title', e.target.value)} />
              </FormField>
              <FormField label="Description" required className="sm:col-span-2">
                <textarea
                  className="min-h-24 w-full rounded-lg px-md py-sm font-body-sm leading-6"
                  style={{ background: 'rgb(var(--color-surface-container-lowest))', boxShadow: '0 0 0 1px rgb(var(--color-outline-variant))', color: 'rgb(var(--color-on-surface))' }}
                  placeholder="Describe what this hackathon is about..."
                  value={form.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                />
              </FormField>
              <FormField label="Theme">
                <Input placeholder="Innovation in EdTech" value={form.theme} onChange={(e) => handleChange('theme', e.target.value)} />
              </FormField>
              <FormField label="Banner URL">
                <Input placeholder="https://example.com/banner.png" value={form.banner_url} onChange={(e) => handleChange('banner_url', e.target.value)} />
              </FormField>
              <FormField label="Organizer" className="sm:col-span-2">
                <Input placeholder="Pyramids Foundation" value={form.organizer} onChange={(e) => handleChange('organizer', e.target.value)} />
              </FormField>
            </div>
          </section>

          <section>
            <p className="font-label-caps text-label-caps mb-lg" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>SCHEDULE</p>
            <div className="grid gap-lg sm:grid-cols-2">
              <FormField label="Registration Opens">
                <Input type="datetime-local" value={form.registration_opens} onChange={(e) => handleChange('registration_opens', e.target.value)} />
              </FormField>
              <FormField label="Registration Closes">
                <Input type="datetime-local" value={form.registration_closes} onChange={(e) => handleChange('registration_closes', e.target.value)} />
              </FormField>
              <FormField label="Start Date">
                <Input type="datetime-local" value={form.start_date} onChange={(e) => handleChange('start_date', e.target.value)} />
              </FormField>
              <FormField label="End Date">
                <Input type="datetime-local" value={form.end_date} onChange={(e) => handleChange('end_date', e.target.value)} />
              </FormField>
            </div>
          </section>

          <section>
            <p className="font-label-caps text-label-caps mb-lg" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>MODE & LOCATION</p>
            <div className="grid gap-lg sm:grid-cols-2">
              <FormField label="Mode">
                <select
                  className="w-full rounded-lg py-sm px-md font-body-sm"
                  style={{ background: 'rgb(var(--color-surface-container-lowest))', boxShadow: '0 0 0 1px rgb(var(--color-outline-variant))', color: 'rgb(var(--color-on-surface))' }}
                  value={form.mode}
                  onChange={(e) => handleChange('mode', e.target.value)}
                >
                  <option>Online</option>
                  <option>Offline</option>
                  <option>Hybrid</option>
                  <option>Remote</option>
                </select>
              </FormField>
              <FormField label="Venue">
                <Input placeholder="Main Auditorium" value={form.venue} onChange={(e) => handleChange('venue', e.target.value)} />
              </FormField>
              <FormField label="City">
                <Input placeholder="San Francisco" value={form.city} onChange={(e) => handleChange('city', e.target.value)} />
              </FormField>
              <FormField label="Country">
                <Input placeholder="USA" value={form.country} onChange={(e) => handleChange('country', e.target.value)} />
              </FormField>
            </div>
          </section>

          <section>
            <p className="font-label-caps text-label-caps mb-lg" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>LINKS</p>
            <div className="grid gap-lg sm:grid-cols-2">
              <FormField label="Official Website">
                <Input placeholder="https://hackathon.dev" value={form.official_website} onChange={(e) => handleChange('official_website', e.target.value)} />
              </FormField>
              <FormField label="Registration Link">
                <Input placeholder="https://example.com/register" value={form.registration_link} onChange={(e) => handleChange('registration_link', e.target.value)} />
              </FormField>
            </div>
          </section>

          <section>
            <p className="font-label-caps text-label-caps mb-lg" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>COMPETITION DETAILS</p>
            <div className="grid gap-lg sm:grid-cols-2">
              <FormField label="Prize Pool">
                <Input placeholder="$10,000" value={form.prize_pool} onChange={(e) => handleChange('prize_pool', e.target.value)} />
              </FormField>
              <FormField label="Team Size Min">
                <Input type="number" min={1} value={form.team_size_min} onChange={(e) => handleChange('team_size_min', Number(e.target.value))} />
              </FormField>
              <FormField label="Team Size Max">
                <Input type="number" min={1} value={form.team_size_max} onChange={(e) => handleChange('team_size_max', Number(e.target.value))} />
              </FormField>
              <FormField label="Eligibility" className="sm:col-span-2">
                <textarea
                  className="min-h-20 w-full rounded-lg px-md py-sm font-body-sm leading-6"
                  style={{ background: 'rgb(var(--color-surface-container-lowest))', boxShadow: '0 0 0 1px rgb(var(--color-outline-variant))', color: 'rgb(var(--color-on-surface))' }}
                  placeholder="Who can participate?"
                  value={form.eligibility}
                  onChange={(e) => handleChange('eligibility', e.target.value)}
                />
              </FormField>
            </div>
          </section>

          <section>
            <p className="font-label-caps text-label-caps mb-lg" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>DOMAINS</p>
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
          </section>

          <section>
            <p className="font-label-caps text-label-caps mb-lg" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>TECHNOLOGIES</p>
            <FormField label="Technologies (comma-separated)">
              <Input placeholder="React, Python, Docker, AWS" value={form.technologies} onChange={(e) => handleChange('technologies', e.target.value)} />
            </FormField>
          </section>

          <section>
            <div className="flex items-center justify-between mb-lg">
              <p className="font-label-caps text-label-caps" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>SPONSORS</p>
              <Button type="button" variant="secondary" size="sm" onClick={addSponsor}>
                <Plus size={14} /> Add Sponsor
              </Button>
            </div>
            {form.sponsors.map((sponsor, i) => (
              <div key={i} className="grid gap-md sm:grid-cols-3 mb-md p-md rounded-lg" style={{ background: 'rgb(var(--color-surface-container-high))' }}>
                <FormField label="Name">
                  <Input value={sponsor.name} onChange={(e) => updateSponsor(i, 'name', e.target.value)} />
                </FormField>
                <FormField label="Logo URL">
                  <Input value={sponsor.logo_url} onChange={(e) => updateSponsor(i, 'logo_url', e.target.value)} />
                </FormField>
                <FormField label="Website">
                  <Input value={sponsor.website} onChange={(e) => updateSponsor(i, 'website', e.target.value)} />
                </FormField>
                <div className="sm:col-span-3 flex justify-end">
                  <button type="button" onClick={() => removeSponsor(i)} style={{ color: 'rgb(var(--color-error))' }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </section>

          <section>
            <div className="flex items-center justify-between mb-lg">
              <p className="font-label-caps text-label-caps" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>JUDGES</p>
              <Button type="button" variant="secondary" size="sm" onClick={addJudge}>
                <Plus size={14} /> Add Judge
              </Button>
            </div>
            {form.judges.map((judge, i) => (
              <div key={i} className="grid gap-md sm:grid-cols-3 mb-md p-md rounded-lg" style={{ background: 'rgb(var(--color-surface-container-high))' }}>
                <FormField label="Name">
                  <Input value={judge.name} onChange={(e) => updateJudge(i, 'name', e.target.value)} />
                </FormField>
                <FormField label="Title">
                  <Input value={judge.title} onChange={(e) => updateJudge(i, 'title', e.target.value)} />
                </FormField>
                <FormField label="Organization">
                  <Input value={judge.organization} onChange={(e) => updateJudge(i, 'organization', e.target.value)} />
                </FormField>
                <div className="sm:col-span-3 flex justify-end">
                  <button type="button" onClick={() => removeJudge(i)} style={{ color: 'rgb(var(--color-error))' }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </section>

          <section>
            <p className="font-label-caps text-label-caps mb-lg" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>RULES</p>
            <textarea
              className="min-h-32 w-full rounded-lg px-md py-sm font-body-sm leading-6"
              style={{ background: 'rgb(var(--color-surface-container-lowest))', boxShadow: '0 0 0 1px rgb(var(--color-outline-variant))', color: 'rgb(var(--color-on-surface))' }}
              placeholder="Rules and guidelines for participants..."
              value={form.rules}
              onChange={(e) => handleChange('rules', e.target.value)}
            />
          </section>

          <section>
            <div className="flex items-center justify-between mb-lg">
              <p className="font-label-caps text-label-caps" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>FREQUENTLY ASKED QUESTIONS</p>
              <Button type="button" variant="secondary" size="sm" onClick={addFaq}>
                <Plus size={14} /> Add FAQ
              </Button>
            </div>
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
          </section>

          <section>
            <p className="font-label-caps text-label-caps mb-lg" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>CONTACT</p>
            <FormField label="Contact Info">
              <Input placeholder="organizer@example.com" value={form.contact_info} onChange={(e) => handleChange('contact_info', e.target.value)} />
            </FormField>
          </section>

          <div className="flex justify-end gap-md pt-lg" style={{ borderTop: '1px solid rgb(var(--color-outline-variant))' }}>
            <Button type="submit" disabled={saving}>
              <Save size={16} />
              {saving ? 'Saving...' : 'Save as Draft'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default HackathonCreate;
