import { ChevronDown } from 'lucide-react';
import { FadeInSection } from './shared';

const faqs = [
  { q: 'What is Pyramids?', a: 'Pyramids is a builder-first campus collaboration platform where students showcase verified projects, form teams, participate in hackathons, and build their reputation through real evidence.' },
  { q: 'Is Pyramids free?', a: 'Yes, Pyramids is completely free for students and builders. Create your profile, showcase projects, and connect with collaborators at no cost.' },
  { q: 'How does the evidence system work?', a: 'Pyramids connects with GitHub to analyze your repositories. Skills, technologies, and contributions are automatically verified and displayed on your profile.' },
  { q: 'Can I join existing projects?', a: 'Absolutely. Browse projects in your domain, send requests to join, or create your own project and invite collaborators.' },
  { q: 'How do hackathons work on Pyramids?', a: 'Organizers can create and publish hackathons. Teams register, submit projects, and get reviewed — all within the platform.' },
  { q: 'What is the rank system?', a: 'Your rank (Explorer → Builder → Architect → Innovator → Pyramidion) reflects your verified contributions, project quality, and community engagement.' },
];

export default function FAQSection() {
  return (
    <section id="faq" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-10" style={{ background: 'rgb(var(--color-surface-container-low))' }}>
      <div className="max-w-3xl mx-auto">
        <FadeInSection>
          <p className="text-sm font-semibold tracking-widest uppercase mb-4 text-center" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>FAQ</p>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-center" style={{ color: 'rgb(var(--color-on-surface))' }}>
            Frequently asked questions
          </h2>
        </FadeInSection>
        <div className="mt-14 space-y-4">
          {faqs.map((faq, idx) => (
            <FadeInSection key={faq.q} delay={idx * 50}>
              <details className="group rounded-xl overflow-hidden" style={{ background: 'rgb(var(--color-surface))', border: '1px solid rgb(var(--color-outline-variant))' }}>
                <summary className="flex items-center justify-between p-5 cursor-pointer list-none text-sm font-semibold transition-colors hover:opacity-80" style={{ color: 'rgb(var(--color-on-surface))' }}>
                  {faq.q}
                  <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 group-open:rotate-180" style={{ color: 'rgb(var(--color-on-surface-variant))' }} />
                </summary>
                <div className="px-5 pb-5 text-sm leading-relaxed" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
                  {faq.a}
                </div>
              </details>
            </FadeInSection>
          ))}
        </div>
      </div>
    </section>
  );
}
