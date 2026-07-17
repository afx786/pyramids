import { useEffect, useState } from 'react';
import { Briefcase, ExternalLink } from 'lucide-react';
import EmptyState from '../../components/common/EmptyState.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import Card from '../../components/ui/Card.jsx';
import SkillTag from '../../components/ui/SkillTag.jsx';
import { opportunityService } from '../../services/opportunityService.js';

function Opportunities() {
  const [opportunities, setOpportunities] = useState([]);

  useEffect(() => {
    opportunityService.listOpportunities().then(setOpportunities).catch(() => {});
  }, []);

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        eyebrow="Opportunities"
        title="Opportunities"
        description="Hackathons, internships, research positions, and more."
      />

      <section className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {opportunities.length > 0 ? (
          opportunities.map((o) => (
            <Card key={o.id} className="p-6">
              <SkillTag>{o.type || 'General'}</SkillTag>
              <h2 className="mt-4 text-xl font-black text-primary">{o.title}</h2>
              <p className="mt-2 text-sm font-medium leading-6 text-secondary">{o.description}</p>
              <div className="mt-5 flex items-center justify-between border-t border-subtle pt-4">
                <span className="text-sm font-semibold text-secondary">{o.organizer || '—'}</span>
                {o.external_url && (
                  <a href={o.external_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm font-semibold text-primary">
                    Apply <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </Card>
          ))
        ) : (
          <div className="col-span-full">
            <EmptyState title="No opportunities yet" description="Opportunities will appear here when posted." />
          </div>
        )}
      </section>
    </div>
  );
}

export default Opportunities;
