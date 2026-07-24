import { FadeInSection } from './shared';

const steps = [
  { step: '01', title: 'Create Profile', desc: 'Sign up with your college email, set your program and batch, and join the builder network.' },
  { step: '02', title: 'Build', desc: 'Create projects, push code to GitHub, and let Pyramids automatically verify your skills and technologies.' },
  { step: '03', title: 'Collaborate', desc: 'Form teams, invite members, work on research together, and participate in hackathons.' },
  { step: '04', title: 'Participate', desc: 'Join hackathons, contribute to open research, and build your reputation.' },
  { step: '05', title: 'Grow Reputation', desc: 'Earn rank points through verified contributions. Advance from Explorer to Pyramidion.' },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-10" style={{ background: 'rgb(var(--color-surface-container-low))' }}>
      <div className="max-w-4xl mx-auto">
        <FadeInSection>
          <p className="text-sm font-semibold tracking-widest uppercase mb-4 text-center" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>How It Works</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-center max-w-2xl mx-auto" style={{ color: 'rgb(var(--color-on-surface))' }}>
            Five steps to your verified profile
          </h2>
        </FadeInSection>
        <div className="mt-14 space-y-8">
          {steps.map((item, idx) => (
            <FadeInSection key={item.step} delay={idx * 100}>
              <div className="flex items-start gap-6 p-6 rounded-xl transition-all duration-200 hover:-translate-y-0.5" style={{ background: 'rgb(var(--color-surface))', border: '1px solid rgb(var(--color-outline-variant))' }}>
                <span className="text-2xl font-bold shrink-0 w-12" style={{ color: 'rgb(var(--color-primary) / 0.3)' }}>{item.step}</span>
                <div>
                  <h3 className="text-lg font-semibold mb-2" style={{ color: 'rgb(var(--color-on-surface))' }}>{item.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>{item.desc}</p>
                </div>
              </div>
            </FadeInSection>
          ))}
        </div>
      </div>
    </section>
  );
}
