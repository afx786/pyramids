import { useEffect, useState } from 'react';
import { CalendarDays, MapPin } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader.jsx';
import Card from '../../components/ui/Card.jsx';
import SkillTag from '../../components/ui/SkillTag.jsx';
import { discoveryService } from '../../services/discoveryService.js';

function Hackathons() {
  const [hackathons, setHackathons] = useState([]);

  useEffect(() => {
    discoveryService.listHackathons().then(setHackathons).catch(() => {});
  }, []);

  function formatDate(dateStr) {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        eyebrow="Events"
        title="Hackathons"
        description="Upcoming hackathons, build challenges, and coding events."
      />

      <section className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {hackathons.length > 0 ? (
          hackathons.map((h) => (
            <Card key={h.id} className="p-6">
              <SkillTag>{h.mode || 'Online'}</SkillTag>
              <h2 className="mt-4 text-xl font-black text-primary">{h.title}</h2>
              <p className="mt-2 text-sm font-medium leading-6 text-secondary line-clamp-3">{h.description}</p>

              <div className="mt-5 space-y-2 border-t border-subtle pt-4">
                <div className="flex items-center gap-2 text-sm text-secondary">
                  <CalendarDays className="h-4 w-4 shrink-0" />
                  <span>{formatDate(h.start_date)} – {formatDate(h.end_date)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-secondary">
                  <MapPin className="h-4 w-4 shrink-0" />
                  <span>{h.organizer || 'TBA'}</span>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="col-span-full">
            <Card className="p-8 text-center">
              <p className="text-sm text-secondary">No hackathons right now.</p>
            </Card>
          </div>
        )}
      </section>
    </div>
  );
}

export default Hackathons;
