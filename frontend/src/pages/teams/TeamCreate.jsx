import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import FieldError from '../../components/common/FieldError.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import Button from '../../components/ui/Button.jsx';
import Card from '../../components/ui/Card.jsx';
import Input from '../../components/ui/Input.jsx';
import { teamService } from '../../services/teamService.js';


function TeamCreate() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [purpose, setPurpose] = useState(null);
  const [hackathons, setHackathons] = useState([]);
  const [selectedHackathon, setSelectedHackathon] = useState(null);
  const [researchProjects, setResearchProjects] = useState([]);
  const [selectedResearch, setSelectedResearch] = useState(null);
  const [form, setForm] = useState({ name: '', description: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (purpose === 'hackathon') {
      fetch('/data/hackathons.json')
        .then((res) => res.json())
        .then((data) => {
          const list = Array.isArray(data) ? data : data.hackathons || [];
          const now = new Date();
          setHackathons(list.filter((h) => {
            const endStr = h.end_date;
            if (!endStr) return true;
            const endDate = new Date(endStr);
            return !isNaN(endDate.getTime()) && endDate > now;
          }));
        })
        .catch(() => {});
    }
    if (purpose === 'research') {
      setResearchProjects([]);
    }
  }, [purpose]);

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const next = {};
    if (form.name.trim().length < 2) next.name = 'Team name is required';
    if (form.description.trim().length < 10) next.description = 'Description must be at least 10 characters';
    if (purpose === 'hackathon' && !selectedHackathon) next.purpose = 'Select a hackathon';
    if (purpose === 'research' && !selectedResearch) next.purpose = 'Select a research project';
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setLoading(true);
    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        purpose,
        hackathon_id: purpose === 'hackathon' ? selectedHackathon : null,
        research_project_id: purpose === 'research' ? selectedResearch : null,
      };
      const team = await teamService.createTeam(payload);
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
        description="Start a new team for a hackathon or research project."
      />

      <Card className="mt-10 p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {errors._api && (
            <p className="rounded-lg px-4 py-3 text-sm font-medium" style={{ background: 'rgb(var(--color-error-container))', color: 'rgb(var(--color-on-error-container))' }}>{errors._api}</p>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <p className="text-sm font-bold text-primary">Step 1: Select Team Purpose</p>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  className={`p-6 rounded-xl text-left transition-all ${purpose === 'hackathon' ? 'ring-2' : 'hover:border-primary'}`}
                  style={{
                    background: purpose === 'hackathon' ? 'rgb(var(--color-primary) / 0.08)' : 'rgb(var(--color-surface-container))',
                    border: `2px solid ${purpose === 'hackathon' ? 'rgb(var(--color-primary))' : 'rgb(var(--color-outline-variant))'}`,
                  }}
                  onClick={() => { setPurpose('hackathon'); setStep(2); }}
                >
                  <p className="text-lg font-bold mb-1" style={{ color: 'rgb(var(--color-primary))' }}>Hackathon</p>
                  <p className="text-sm" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>Form a team for an active hackathon</p>
                </button>
                <button
                  type="button"
                  className={`p-6 rounded-xl text-left transition-all ${purpose === 'research' ? 'ring-2' : 'hover:border-primary'}`}
                  style={{
                    background: purpose === 'research' ? 'rgb(var(--color-primary) / 0.08)' : 'rgb(var(--color-surface-container))',
                    border: `2px solid ${purpose === 'research' ? 'rgb(var(--color-primary))' : 'rgb(var(--color-outline-variant))'}`,
                  }}
                  onClick={() => { setPurpose('research'); setStep(2); }}
                >
                  <p className="text-lg font-bold mb-1" style={{ color: 'rgb(var(--color-primary))' }}>Research</p>
                  <p className="text-sm" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>Collaborate on a research project</p>
                </button>
              </div>
            </div>
          )}

          {step === 2 && purpose === 'hackathon' && (
            <div className="space-y-4">
              <p className="text-sm font-bold text-primary">Step 2: Select Hackathon</p>
              {hackathons.length === 0 ? (
                <p className="text-sm" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>No active hackathons available.</p>
              ) : (
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {hackathons.map((h) => (
                    <button
                      key={h.id}
                      type="button"
                      className={`w-full p-4 rounded-xl text-left transition-all ${selectedHackathon === h.id ? 'ring-2' : ''}`}
                      style={{
                        background: selectedHackathon === h.id ? 'rgb(var(--color-primary) / 0.08)' : 'rgb(var(--color-surface-container))',
                        border: `2px solid ${selectedHackathon === h.id ? 'rgb(var(--color-primary))' : 'rgb(var(--color-outline-variant))'}`,
                      }}
                      onClick={() => setSelectedHackathon(h.id)}
                    >
                      {h.banner_url ? (
                        <img src={h.banner_url} alt="" className="w-full h-24 object-cover rounded-lg mb-2" />
                      ) : null}
                      <p className="font-bold" style={{ color: 'rgb(var(--color-primary))' }}>{h.title}</p>
                      <div className="flex gap-4 mt-1 text-xs" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
                        <span>Mode: {h.mode || 'Online'}</span>
                        {h.prize_pool ? <span>Prize: {h.prize_pool}</span> : null}
                        {h.team_size_min || h.team_size_max ? (
                          <span>Team: {h.team_size_min || 1}–{h.team_size_max || '∞'}</span>
                        ) : null}
                      </div>
                    </button>
                  ))}
                </div>
              )}
              <div className="flex gap-3">
                <Button variant="secondary" type="button" onClick={() => { setStep(1); setPurpose(null); }}>Back</Button>
                {hackathons.length > 0 ? <Button type="button" onClick={() => setStep(3)} disabled={!selectedHackathon}>Next</Button> : null}
              </div>
            </div>
          )}

          {step === 2 && purpose === 'research' && (
            <div className="space-y-4">
              <p className="text-sm font-bold text-primary">Step 2: Select Research Project</p>
              {researchProjects.length === 0 ? (
                <div className="p-6 rounded-xl text-center" style={{ background: 'rgb(var(--color-surface-container))' }}>
                  <p className="text-sm font-semibold" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>Create Research First</p>
                  <p className="text-xs mt-2" style={{ color: 'rgb(var(--color-on-surface-variant) / 0.7)' }}>You need to create a research project before forming a team.</p>
                  <Link to="/research/new">
                    <Button variant="secondary" className="mt-4">Create Research Project</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {researchProjects.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      className={`w-full p-4 rounded-xl text-left ${selectedResearch === r.id ? 'ring-2' : ''}`}
                      style={{
                        background: selectedResearch === r.id ? 'rgb(var(--color-primary) / 0.08)' : 'rgb(var(--color-surface-container))',
                        border: `2px solid ${selectedResearch === r.id ? 'rgb(var(--color-primary))' : 'rgb(var(--color-outline-variant))'}`,
                      }}
                      onClick={() => setSelectedResearch(r.id)}
                    >
                      <p className="font-bold" style={{ color: 'rgb(var(--color-primary))' }}>{r.title}</p>
                      <p className="text-xs mt-1" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>{r.domain}</p>
                    </button>
                  ))}
                </div>
              )}
              <div className="flex gap-3">
                <Button variant="secondary" type="button" onClick={() => { setStep(1); setPurpose(null); }}>Back</Button>
                {researchProjects.length > 0 ? <Button type="button" onClick={() => setStep(3)} disabled={!selectedResearch}>Next</Button> : null}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <p className="text-sm font-bold text-primary">Step 3: Team Details</p>

              {selectedHackathon && purpose === 'hackathon' && (() => {
                const h = hackathons.find((x) => x.id === selectedHackathon);
                if (!h) return null;
                return (
                  <div className="p-4 rounded-xl" style={{ background: 'rgb(var(--color-surface-container))' }}>
                    {h.banner_url ? <img src={h.banner_url} alt="" className="w-full h-20 object-cover rounded-lg mb-2" /> : null}
                    <p className="font-bold text-sm" style={{ color: 'rgb(var(--color-primary))' }}>{h.title}</p>
                    <div className="grid grid-cols-2 gap-2 mt-2 text-xs" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
                      <span>Mode: {h.mode || 'Online'}</span>
                      <span>Prize: {h.prize_pool || '—'}</span>
                      <span>Min Team Size: {h.team_size_min || 1}</span>
                      <span>Max Team Size: {h.team_size_max || '∞'}</span>
                    </div>
                  </div>
                );
              })()}

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
            </div>
          )}
        </form>
      </Card>
    </div>
  );
}

export default TeamCreate;
