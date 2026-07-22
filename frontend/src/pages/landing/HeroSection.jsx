import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { FadeInSection } from './shared';

export default function HeroSection({ scrollTo }) {
  return (
    <section className="min-h-[90vh] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-10 pt-24 pb-16 text-center" style={{ background: 'rgb(var(--color-surface))' }}>
      <FadeInSection>
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-8" style={{ background: 'rgb(var(--color-surface-container-high))', border: '1px solid rgb(var(--color-outline-variant))', color: 'rgb(var(--color-on-surface-variant))' }}>
          <span className="w-2 h-2 rounded-full" style={{ background: 'rgb(var(--color-success))' }} />
          Proof over Claims
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.05] max-w-4xl mx-auto" style={{ color: 'rgb(var(--color-on-surface))' }}>
          Research. Build.{' '}
          <span className="block sm:inline" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>Collaborate.</span>
        </h1>
        <p className="mt-6 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
          Your work should speak louder than your résumé. The builder-first campus network where projects, research, and skills are verified — not claimed.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/signup" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-base font-semibold transition-all hover:opacity-90 active:scale-[0.98]" style={{ background: 'rgb(var(--color-primary))', color: 'rgb(var(--color-on-primary))' }}>
            Join Pyramids
            <ArrowRight className="h-4 w-4" />
          </Link>
          <button onClick={() => scrollTo('how-it-works')} className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-base font-semibold transition-all hover:opacity-80" style={{ color: 'rgb(var(--color-on-surface-variant))', border: '1px solid rgb(var(--color-outline-variant))' }}>
            Learn More
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>
      </FadeInSection>
    </section>
  );
}
