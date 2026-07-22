import { FadeInSection } from './shared';

export default function ComparisonSection() {
  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-10" style={{ background: 'rgb(var(--color-surface-container-low))' }}>
      <div className="max-w-4xl mx-auto">
        <FadeInSection>
          <p className="text-sm font-semibold tracking-widest uppercase mb-4 text-center" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>Why Pyramids</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-center max-w-3xl mx-auto" style={{ color: 'rgb(var(--color-on-surface))' }}>
            Proof over Claims
          </h2>
        </FadeInSection>
        <div className="mt-14 grid sm:grid-cols-2 gap-8">
          <div className="p-8 rounded-xl" style={{ background: 'rgb(var(--color-surface))', border: '1px solid rgb(var(--color-outline-variant))' }}>
            <p className="text-sm font-semibold mb-4" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>Traditional Resume</p>
            <ul className="space-y-3 text-sm" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
              <li className="flex items-center gap-3"><span style={{ color: 'rgb(var(--color-error))' }}>✗</span> Self-reported claims, zero proof</li>
              <li className="flex items-center gap-3"><span style={{ color: 'rgb(var(--color-error))' }}>✗</span> No verification mechanism</li>
              <li className="flex items-center gap-3"><span style={{ color: 'rgb(var(--color-error))' }}>✗</span> Static, easily exaggerated</li>
              <li className="flex items-center gap-3"><span style={{ color: 'rgb(var(--color-error))' }}>✗</span> No collaboration signals</li>
            </ul>
          </div>
          <div className="p-8 rounded-xl" style={{ background: 'rgb(var(--color-surface))', border: '1px solid rgb(var(--color-primary) / 0.2)' }}>
            <p className="text-sm font-semibold mb-4" style={{ color: 'rgb(var(--color-primary))' }}>Pyramids Profile</p>
            <ul className="space-y-3 text-sm" style={{ color: 'rgb(var(--color-on-surface))' }}>
              <li className="flex items-center gap-3"><span style={{ color: 'rgb(var(--color-success))' }}>✓</span> GitHub-verified skills & contributions</li>
              <li className="flex items-center gap-3"><span style={{ color: 'rgb(var(--color-success))' }}>✓</span> Automated evidence from real work</li>
              <li className="flex items-center gap-3"><span style={{ color: 'rgb(var(--color-success))' }}>✓</span> Dynamic profile, always up-to-date</li>
              <li className="flex items-center gap-3"><span style={{ color: 'rgb(var(--color-success))' }}>✓</span> Built-in team & network signals</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
