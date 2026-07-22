import { AnimatedCounter, stats } from './shared';

export default function StatisticsSection() {
  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-10" style={{ background: 'rgb(var(--color-surface-container-low))' }}>
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-3xl sm:text-4xl font-bold tracking-tight" style={{ color: 'rgb(var(--color-on-surface))' }}>
                <AnimatedCounter target={s.value} suffix="+" />
              </p>
              <p className="mt-2 text-sm font-medium" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
