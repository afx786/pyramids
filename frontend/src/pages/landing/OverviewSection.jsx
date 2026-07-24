import { FadeInSection } from './shared';

const items = [
  { title: 'Projects', desc: 'Showcase verified repositories with automated skill detection, technology recognition, and contribution scoring from your GitHub.' },
  { title: 'Research', desc: 'Document academic research with milestones, collaborative tools, and verifiable contribution history.' },
  { title: 'Hackathons', desc: 'Full hackathon lifecycle — discover events, register, form teams, submit projects, and receive reviews, all on-platform.' },

  { title: 'Evidence System', desc: 'Every repository, commit, and contribution is analyzed and displayed as verified proof of your skills.' },
  { title: 'Builder Network', desc: 'Connect with verified builders, form evidence-backed teams, and grow your campus professional network.' },
];

export default function OverviewSection() {
  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-10">
      <div className="max-w-6xl mx-auto">
        <FadeInSection>
          <p className="text-sm font-semibold tracking-widest uppercase mb-4" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>Overview</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight max-w-3xl" style={{ color: 'rgb(var(--color-on-surface))' }}>
            Evidence-based campus ecosystem
          </h2>
        </FadeInSection>
        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <FadeInSection key={item.title} delay={100}>
              <div className="p-6 sm:p-8 rounded-xl h-full transition-all duration-200 hover:-translate-y-1" style={{ background: 'rgb(var(--color-surface-container-low))', border: '1px solid rgb(var(--color-outline-variant))' }}>
                <h3 className="text-lg font-semibold mb-3" style={{ color: 'rgb(var(--color-on-surface))' }}>{item.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>{item.desc}</p>
              </div>
            </FadeInSection>
          ))}
        </div>
      </div>
    </section>
  );
}
