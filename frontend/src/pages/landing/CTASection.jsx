import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { FadeInSection } from './shared';

export default function CTASection() {
  return (
    <section className="py-28 sm:py-36 px-4 sm:px-6 lg:px-10 text-center">
      <FadeInSection>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight max-w-2xl mx-auto" style={{ color: 'rgb(var(--color-on-surface))' }}>
          Ready to build?
        </h2>
        <p className="mt-4 text-lg" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
          Your work speaks for itself. Let the world see it.
        </p>
        <Link to="/signup" className="mt-8 inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-base font-semibold transition-all hover:opacity-90 active:scale-[0.98]" style={{ background: 'rgb(var(--color-primary))', color: 'rgb(var(--color-on-primary))' }}>
          Join Pyramids
          <ArrowRight className="h-4 w-4" />
        </Link>
      </FadeInSection>
    </section>
  );
}
