import { ArrowLeft, CalendarDays, ChevronDown, ChevronRight, ExternalLink, Globe, MapPin, Trophy, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import EmptyState from '../../components/common/EmptyState.jsx';
import ErrorState from '../../components/common/ErrorState.jsx';
import LoadingState from '../../components/common/LoadingState.jsx';
import Button from '../../components/ui/Button.jsx';
import Card from '../../components/ui/Card.jsx';
import StatusBadge from '../../components/ui/StatusBadge.jsx';

function HackathonDetail() {
  const { id } = useParams();
  const [hackathon, setHackathon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch('/data/hackathons.json')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load hackathons');
        return res.json();
      })
      .then((data) => {
        const list = Array.isArray(data) ? data : data.hackathons || [];
        const found = list.find((h) => String(h.id) === id);
        if (!found) throw new Error('Hackathon not found');
        setHackathon(found);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  function formatDate(dateStr) {
    if (!dateStr) return '—';
    if (/\w{3}\s+\d{1,2}\s*[-–]\s*\w{3}\s+\d{1,2},\s*\d{4}/.test(dateStr) || dateStr.includes('–') || dateStr.includes(' - ')) return dateStr;
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch { return dateStr; }
  }

  function formatDateTime(dateStr) {
    if (!dateStr) return '—';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' });
    } catch { return dateStr; }
  }

  if (loading) return <LoadingState label="Loading hackathon..." />;
  if (error) return <ErrorState title={error} onRetry={() => window.location.reload()} />;
  if (!hackathon) return <ErrorState title="Hackathon not found" />;

  const domains = hackathon.domains || [];
  const technologies = hackathon.technologies || [];
  const sponsors = hackathon.sponsors || [];
  const judges = hackathon.judges || [];
  const faqs = hackathon.faqs || [];
  const teams = hackathon.teams || [];

  return (
    <div className="animate-fade-in p-xl max-w-6xl mx-auto">
      <Link to="/hackathons" className="mb-lg inline-flex items-center gap-sm font-body-sm transition-colors" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
        <ArrowLeft size={16} />
        Back to Hackathons
      </Link>

      <header className="mb-xl">
        <div className="flex items-center gap-sm mb-sm flex-wrap">
          {hackathon.status ? <StatusBadge status={hackathon.status} /> : null}
          <span className="inline-flex items-center gap-1 font-mono text-[11px] px-sm py-xs rounded" style={{ background: 'rgb(var(--color-surface-variant))', color: 'rgb(var(--color-on-surface))' }}>
            <Globe size={11} />
            {hackathon.mode || hackathon.type || 'Online'}
          </span>
        </div>
        <h1 className="font-display-serif text-display-serif leading-tight" style={{ color: 'rgb(var(--color-primary))' }}>
          {hackathon.title}
        </h1>
        <p className="font-body-lg text-body-lg mt-sm" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
          Organized by {hackathon.organizer || hackathon.org || '—'}
        </p>
      </header>

      <div className="grid gap-lg sm:grid-cols-2 lg:grid-cols-4 mb-xl">
        {hackathon.registration_opens || hackathon.registration_closes ? (
          <div className="p-lg rounded-xl" style={{ background: 'rgb(var(--color-surface-container-low))', border: '1px solid rgb(var(--color-outline-variant))' }}>
            <p className="font-label-caps text-label-caps" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>REGISTRATION</p>
            <p className="font-body-sm mt-sm" style={{ color: 'rgb(var(--color-on-surface))' }}>
              {formatDateTime(hackathon.registration_opens)} – {formatDateTime(hackathon.registration_closes)}
            </p>
          </div>
        ) : (
          <div className="p-lg rounded-xl" style={{ background: 'rgb(var(--color-surface-container-low))', border: '1px solid rgb(var(--color-outline-variant))' }}>
            <p className="font-label-caps text-label-caps" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>EVENT DATES</p>
            <p className="font-body-sm mt-sm" style={{ color: 'rgb(var(--color-on-surface))' }}>
              {formatDate(hackathon.start_date)} – {formatDate(hackathon.end_date)}
            </p>
          </div>
        )}
        <div className="p-lg rounded-xl" style={{ background: 'rgb(var(--color-surface-container-low))', border: '1px solid rgb(var(--color-outline-variant))' }}>
          <p className="font-label-caps text-label-caps" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>EVENT DATES</p>
          <p className="font-body-sm mt-sm" style={{ color: 'rgb(var(--color-on-surface))' }}>
            {formatDate(hackathon.start_date)} – {formatDate(hackathon.end_date)}
          </p>
        </div>
        {hackathon.venue ? (
          <div className="p-lg rounded-xl" style={{ background: 'rgb(var(--color-surface-container-low))', border: '1px solid rgb(var(--color-outline-variant))' }}>
            <p className="font-label-caps text-label-caps" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>LOCATION</p>
            <p className="font-body-sm mt-sm" style={{ color: 'rgb(var(--color-on-surface))' }}>
              {[hackathon.venue, hackathon.city, hackathon.country].filter(Boolean).join(', ')}
            </p>
          </div>
        ) : null}
        {hackathon.prize_pool ? (
          <div className="p-lg rounded-xl" style={{ background: 'rgb(var(--color-surface-container-low))', border: '1px solid rgb(var(--color-outline-variant))' }}>
            <p className="font-label-caps text-label-caps" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>PRIZE POOL</p>
            <p className="font-display-serif text-display-serif mt-sm" style={{ color: 'rgb(var(--color-primary))' }}>{hackathon.prize_pool}</p>
          </div>
        ) : null}
      </div>

      <div className="grid gap-xl lg:grid-cols-[1fr_360px] mb-xl">
        <div className="space-y-xl">
          {hackathon.description ? (
            <Card className="p-lg">
              <h2 className="font-label-caps text-label-caps mb-md" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>DESCRIPTION</h2>
              <p className="font-body-sm leading-6 whitespace-pre-line" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
                {hackathon.description}
              </p>
            </Card>
          ) : null}

          {domains.length > 0 ? (
            <Card className="p-lg">
              <h2 className="font-label-caps text-label-caps mb-md" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>THEME / DOMAINS</h2>
              <div className="flex flex-wrap gap-sm">
                {domains.map((d) => (
                  <span key={d} className="px-md py-xs rounded font-mono text-[11px]" style={{ background: 'rgb(var(--color-surface-container-high))', border: '1px solid rgb(var(--color-outline-variant))', color: 'rgb(var(--color-primary))' }}>
                    {d}
                  </span>
                ))}
              </div>
            </Card>
          ) : null}

          {technologies.length > 0 ? (
            <Card className="p-lg">
              <h2 className="font-label-caps text-label-caps mb-md" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>TECHNOLOGIES</h2>
              <div className="flex flex-wrap gap-sm">
                {technologies.map((t) => (
                  <span key={t} className="px-md py-xs rounded font-mono text-[11px]" style={{ background: 'rgb(var(--color-surface-container-high))', border: '1px solid rgb(var(--color-outline-variant))', color: 'rgb(var(--color-primary))' }}>
                    {typeof t === 'string' ? t : t.name || t}
                  </span>
                ))}
              </div>
            </Card>
          ) : null}

          {hackathon.team_size_min != null ? (
            <Card className="p-lg">
              <h2 className="font-label-caps text-label-caps mb-md" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>TEAM SIZE</h2>
              <p className="font-body-sm" style={{ color: 'rgb(var(--color-on-surface))' }}>
                {hackathon.team_size_min} – {hackathon.team_size_max} members
              </p>
            </Card>
          ) : null}

          {hackathon.eligibility ? (
            <Card className="p-lg">
              <h2 className="font-label-caps text-label-caps mb-md" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>ELIGIBILITY</h2>
              <p className="font-body-sm leading-6 whitespace-pre-line" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>{hackathon.eligibility}</p>
            </Card>
          ) : null}

          {sponsors.length > 0 ? (
            <Card className="p-lg">
              <h2 className="font-label-caps text-label-caps mb-md" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>SPONSORS</h2>
              <div className="grid gap-md sm:grid-cols-2">
                {sponsors.map((s, i) => (
                  <div key={i} className="flex items-center gap-md p-md rounded-lg" style={{ background: 'rgb(var(--color-surface-container-high))' }}>
                    {s.logo_url ? (
                      <img src={s.logo_url} alt={s.name} className="h-10 w-10 rounded object-cover" />
                    ) : null}
                    <div>
                      <p className="font-body-sm font-bold" style={{ color: 'rgb(var(--color-primary))' }}>{s.name}</p>
                      {s.website ? (
                        <a href={s.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 font-mono text-[10px] mt-xs" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
                          <ExternalLink size={10} /> Website
                        </a>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ) : null}

          {judges.length > 0 ? (
            <Card className="p-lg">
              <h2 className="font-label-caps text-label-caps mb-md" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>JUDGES</h2>
              <div className="grid gap-md sm:grid-cols-2">
                {judges.map((j, i) => (
                  <div key={i} className="p-md rounded-lg" style={{ background: 'rgb(var(--color-surface-container-high))' }}>
                    <p className="font-body-sm font-bold" style={{ color: 'rgb(var(--color-primary))' }}>{j.name}</p>
                    <p className="font-body-sm" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>{j.title}{j.organization ? ` · ${j.organization}` : ''}</p>
                  </div>
                ))}
              </div>
            </Card>
          ) : null}

          {hackathon.rules ? (
            <Card className="p-lg">
              <h2 className="font-label-caps text-label-caps mb-md" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>RULES</h2>
              <p className="font-body-sm leading-6 whitespace-pre-line" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>{hackathon.rules}</p>
            </Card>
          ) : null}

          {faqs.length > 0 ? (
            <Card className="p-lg">
              <h2 className="font-label-caps text-label-caps mb-md" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>FAQ</h2>
              <div className="space-y-sm">
                {faqs.map((faq, i) => (
                  <div key={i} className="rounded-lg overflow-hidden" style={{ border: '1px solid rgb(var(--color-outline-variant))' }}>
                    <button
                      type="button"
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="flex w-full items-center justify-between p-md font-body-sm font-bold text-left"
                      style={{ color: 'rgb(var(--color-primary))', background: 'rgb(var(--color-surface-container-high))' }}
                    >
                      {faq.question}
                      {openFaq === i ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </button>
                    {openFaq === i ? (
                      <div className="p-md font-body-sm leading-6" style={{ color: 'rgb(var(--color-on-surface-variant))', background: 'rgb(var(--color-surface-container-low))' }}>
                        {faq.answer}
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            </Card>
          ) : null}

          {hackathon.contact_info ? (
            <Card className="p-lg">
              <h2 className="font-label-caps text-label-caps mb-md" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>CONTACT</h2>
              <p className="font-body-sm" style={{ color: 'rgb(var(--color-primary))' }}>{hackathon.contact_info}</p>
            </Card>
          ) : null}

          {hackathon.links?.length > 0 || hackathon.official_website || hackathon.registration_link ? (
            <Card className="p-lg">
              <h2 className="font-label-caps text-label-caps mb-md" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>LINKS</h2>
              <div className="flex flex-wrap gap-md">
                {hackathon.official_website ? (
                  <a href={hackathon.official_website} target="_blank" rel="noopener noreferrer">
                    <Button variant="secondary" size="sm">
                      <ExternalLink size={14} /> Official Website
                    </Button>
                  </a>
                ) : null}
                {hackathon.registration_link ? (
                  <a href={hackathon.registration_link} target="_blank" rel="noopener noreferrer">
                    <Button variant="secondary" size="sm">
                      <ExternalLink size={14} /> Registration
                    </Button>
                  </a>
                ) : null}
              </div>
            </Card>
          ) : null}
        </div>

        {teams.length > 0 ? (
          <div className="space-y-xl">
            <Card className="p-lg">
              <div className="flex items-center gap-sm mb-md">
                <Users size={18} style={{ color: 'rgb(var(--color-on-surface-variant))' }} />
                <h2 className="font-label-caps text-label-caps" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>TEAMS ({teams.length})</h2>
              </div>
              <div className="space-y-sm">
                {teams.map((team, i) => (
                  <div key={i} className="flex items-center gap-md p-sm rounded-lg" style={{ background: 'rgb(var(--color-surface-container-high))' }}>
                    <Avatar size="sm" src={team.logo_url} alt={team.name} />
                    <div>
                      <p className="font-body-sm font-bold" style={{ color: 'rgb(var(--color-primary))' }}>{team.name}</p>
                      <p className="font-body-sm text-[11px]" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
                        {team.member_count || team.members?.length || 0} members
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default HackathonDetail;
