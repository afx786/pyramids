import { useEffect, useState } from 'react';
import { TrendingUp } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader.jsx';
import Card from '../../components/ui/Card.jsx';
import { api } from '../../services/api.js';

function SkillAnalytics() {
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    api.get('/skills/top').then(setSkills).catch(() => {});
  }, []);

  const maxProjects = Math.max(...skills.map((s) => s.projects), 1);

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        eyebrow="Analytics"
        title="Top Skills"
        description="Most used skills across all projects on the platform."
      />

      <section className="mt-10 space-y-4">
        {skills.length > 0 ? (
          skills.map((s, idx) => (
            <Card key={s.skill} className="flex items-center gap-5 p-5">
              <span className="w-6 text-center text-sm font-black text-secondary">{idx + 1}</span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-primary">{s.skill}</p>
                  <span className="text-sm font-bold text-secondary">{s.projects} project{s.projects !== 1 ? 's' : ''}</span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-accent-soft">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${(s.projects / maxProjects) * 100}%` }} />
                </div>
              </div>
            </Card>
          ))
        ) : (
          <Card className="p-8 text-center">
            <TrendingUp className="mx-auto h-8 w-8 text-secondary" />
            <p className="mt-3 text-sm text-secondary">No skill data yet.</p>
          </Card>
        )}
      </section>
    </div>
  );
}

export default SkillAnalytics;
