import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader.jsx';
import Card from '../../components/ui/Card.jsx';
import SkillTag from '../../components/ui/SkillTag.jsx';
import { discoveryService } from '../../services/discoveryService.js';

function Updates() {
  const [feed, setFeed] = useState({ projects: [], research: [], hackathons: [] });

  useEffect(() => {
    discoveryService.getFeed('all').then(setFeed).catch((err) => console.warn('[updates] feed failed:', err));
  }, []);

  const allItems = [
    ...(feed.projects || []).map((p) => ({ ...p, _type: 'Project' })),
    ...(feed.research || []).map((r) => ({ ...r, _type: 'Research' })),
    ...(feed.hackathons || []).map((h) => ({ ...h, _type: 'Hackathon' })),
  ];

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        eyebrow="Activity"
        title="Feed"
        description="Recent projects, research, and hackathons across the platform."
      />

      <section className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_340px]">
        <div className="space-y-4">
          {allItems.length > 0 ? (
            allItems.map((item, idx) => (
              <Card key={`${item._type}-${item.id}`} className="p-6">
                <SkillTag>{item._type}</SkillTag>
                <h2 className="mt-4 text-xl font-black text-primary">{item.title}</h2>
                {item.description && (
                  <p className="mt-2 text-sm font-medium leading-6 text-secondary">
                    {item.description.length > 200 ? item.description.slice(0, 200) + '...' : item.description}
                  </p>
                )}
                {item.owner_name && (
                  <p className="mt-3 text-sm font-semibold text-secondary">by {item.owner_name}</p>
                )}
              </Card>
            ))
          ) : (
            <Card className="p-8 text-center">
              <p className="text-sm text-secondary">No activity yet. Be the first to create a project!</p>
            </Card>
          )}
        </div>

        <Card className="p-6">
          <h2 className="text-xl font-black text-primary">Quick Actions</h2>
          <div className="mt-5 space-y-4">
            <Link to="/projects/new" className="block rounded-lg border border-subtle p-4 transition hover:border-primary/20">
              <p className="font-bold text-primary">Create Project</p>
              <p className="mt-1 text-sm text-secondary">Showcase your build</p>
            </Link>
            <Link to="/search" className="block rounded-lg border border-subtle p-4 transition hover:border-primary/20">
              <p className="font-bold text-primary">Find Builders</p>
              <p className="mt-1 text-sm text-secondary">Search by name or skill</p>
            </Link>
            <Link to="/leaderboard" className="block rounded-lg border border-subtle p-4 transition hover:border-primary/20">
              <p className="font-bold text-primary">Leaderboard</p>
              <p className="mt-1 text-sm text-secondary">Top builders this week</p>
            </Link>
          </div>
        </Card>
      </section>
    </div>
  );
}

export default Updates;
