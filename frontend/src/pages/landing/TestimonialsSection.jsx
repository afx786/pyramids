import { FadeInSection } from './shared';

const testimonials = [
  { name: 'Arjun M.', role: 'Final Year CSE', text: 'Pyramids transformed how I showcase my work. My verified projects speak louder than any resume bullet point.' },
  { name: 'Priya K.', role: 'Research Scholar', text: 'The evidence system is brilliant. My research contributions are now verifiable and organized.' },
  { name: 'Rahul S.', role: 'Open Source Contributor', text: 'Finding collaborators who match my skills has never been easier. The builder network is incredible.' },
  { name: 'Neha P.', role: 'Hackathon Enthusiast', text: 'From hackathon registrations to team formation — everything is seamless on Pyramids.' },
];

export default function TestimonialsSection() {
  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-10">
      <div className="max-w-5xl mx-auto">
        <FadeInSection>
          <p className="text-sm font-semibold tracking-widest uppercase mb-4 text-center" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>Testimonials</p>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-center" style={{ color: 'rgb(var(--color-on-surface))' }}>
            Loved by builders
          </h2>
        </FadeInSection>
        <div className="mt-14 grid sm:grid-cols-2 gap-6">
          {testimonials.map((t, idx) => (
            <FadeInSection key={t.name} delay={idx * 100}>
              <div className="p-6 rounded-xl h-full" style={{ background: 'rgb(var(--color-surface-container-low))', border: '1px solid rgb(var(--color-outline-variant))' }}>
                <p className="text-sm leading-relaxed mb-6" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>"{t.text}"</p>
                <div>
                  <p className="text-sm font-semibold" style={{ color: 'rgb(var(--color-on-surface))' }}>{t.name}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>{t.role}</p>
                </div>
              </div>
            </FadeInSection>
          ))}
        </div>
      </div>
    </section>
  );
}
