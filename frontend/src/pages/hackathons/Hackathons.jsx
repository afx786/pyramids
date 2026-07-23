import { CalendarDays, MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import EmptyState from '../../components/common/EmptyState.jsx';
import LoadingState from '../../components/common/LoadingState.jsx';

function Hackathons() {
  const [hackathons, setHackathons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch('/data/hackathons.json')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load hackathons');
        return res.json();
      })
      .then((data) => setHackathons(Array.isArray(data) ? data : data.hackathons || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function formatDate(dateStr) {
    if (!dateStr) return '—';
    if (/\w{3}\s+\d{1,2}\s*[-–]\s*\w{3}\s+\d{1,2},\s*\d{4}/.test(dateStr) || dateStr.includes('–') || dateStr.includes(' - ')) return dateStr;
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch { return dateStr; }
  }

  if (loading) return <LoadingState label="Loading hackathons..." />;

  return (
    <div className="p-xl max-w-6xl mx-auto">
      <header className="mb-xl">
        <h2 className="font-display-serif text-display-serif" style={{ color: 'rgb(var(--color-primary))' }}>Hackathons</h2>
        <p className="font-body-lg text-body-lg mt-sm" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
          Discover hackathons from around the web — updated daily.
        </p>
      </header>

      <section className="grid gap-lg sm:grid-cols-2 xl:grid-cols-3">
        {hackathons.length > 0 ? (
          hackathons.map((h, i) => (
            <Link
              key={h.id || i}
              to={`/hackathons/${h.id || i}`}
              className="block p-lg rounded-xl transition-all duration-200 hover:-translate-y-0.5"
              style={{
                background: 'rgb(var(--color-surface-container-low))',
                border: '1px solid rgb(var(--color-outline-variant))',
              }}
            >
              <span
                className="inline-block px-sm py-xs font-mono text-[11px] rounded"
                style={{
                  background: 'rgb(var(--color-surface-variant))',
                  color: 'rgb(var(--color-on-surface))',
                }}
              >
                {h.mode || h.type || 'Online'}
              </span>
              <h3 className="font-headline-md text-headline-md font-bold mt-md" style={{ color: 'rgb(var(--color-primary))' }}>
                {h.title}
              </h3>
              <p className="font-body-sm mt-sm leading-6 line-clamp-3" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
                {h.description}
              </p>
              <div className="mt-lg space-y-sm pt-md" style={{ borderTop: '1px solid rgb(var(--color-outline-variant))' }}>
                <div className="flex items-center gap-sm font-body-sm" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
                  <CalendarDays size={16} className="shrink-0" />
                  <span>{formatDate(h.start_date)} – {formatDate(h.end_date)}</span>
                </div>
                <div className="flex items-center gap-sm font-body-sm" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
                  <MapPin size={16} className="shrink-0" />
                  <span>{h.organizer || h.org || 'TBA'}</span>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full">
            <EmptyState title="No hackathons right now" description="Check back later for upcoming events." />
          </div>
        )}
      </section>
    </div>
  );
}

export default Hackathons;
