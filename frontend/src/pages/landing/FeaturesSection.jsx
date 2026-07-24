import { FadeInSection } from './shared';

const features = [
  { title: 'Projects', desc: 'Connect your GitHub and get automatic skill detection, technology recognition, and repository scoring on every project.' },
  { title: 'Research', desc: 'Publish research with milestone tracking, contributor attribution, and versioned updates for academic credibility.' },
  { title: 'Hackathons', desc: 'End-to-end hackathon management — create or join events, form teams, submit projects, and receive structured reviews.' },

  { title: 'Evidence System', desc: 'Automated verification of skills, technologies, commits, and contributions — every claim backed by repository data.' },
  { title: 'Builder Reputation', desc: 'Rank progression from Explorer to Pyramidion, trust scores, and reputation metrics driven by verified contributions.' },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-10">
      <div className="max-w-6xl mx-auto">
        <FadeInSection>
          <p className="text-sm font-semibold tracking-widest uppercase mb-4 text-center" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>Features</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-center max-w-2xl mx-auto" style={{ color: 'rgb(var(--color-on-surface))' }}>
            Everything you need to build in public
          </h2>
        </FadeInSection>
        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((item) => (
            <FadeInSection key={item.title} delay={100}>
              <div className="p-6 sm:p-8 rounded-xl transition-all duration-200 hover:-translate-y-1" style={{ background: 'rgb(var(--color-surface-container-low))', border: '1px solid rgb(var(--color-outline-variant))' }}>
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
