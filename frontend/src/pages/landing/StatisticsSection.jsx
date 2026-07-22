import { useState, useEffect } from 'react';
import { AnimatedCounter } from './shared';
import { api } from '../../services/api';

const statKeys = [
  { key: 'builders', label: 'Builders' },
  { key: 'projects', label: 'Projects' },
  { key: 'research', label: 'Research' },
  { key: 'hackathons', label: 'Hackathons' },
  { key: 'organizations', label: 'Organizations' },
];

export default function StatisticsSection() {
  const [liveStats, setLiveStats] = useState(null);

  useEffect(() => {
    api.get('/stats/public')
      .then(setLiveStats)
      .catch(() => setLiveStats(null));
  }, []);

  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-10" style={{ background: 'rgb(var(--color-surface-container-low))' }}>
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {statKeys.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-3xl sm:text-4xl font-bold tracking-tight" style={{ color: 'rgb(var(--color-on-surface))' }}>
                <AnimatedCounter target={liveStats?.[s.key] ?? 0} suffix="+" />
              </p>
              <p className="mt-2 text-sm font-medium" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
