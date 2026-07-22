import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Moon, Sun, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import HeroSection from './HeroSection';
import StatisticsSection from './StatisticsSection';
import OverviewSection from './OverviewSection';
import HowItWorksSection from './HowItWorksSection';
import FeaturesSection from './FeaturesSection';
import ComparisonSection from './ComparisonSection';
import TestimonialsSection from './TestimonialsSection';
import FAQSection from './FAQSection';
import CTASection from './CTASection';
import FooterSection from './FooterSection';

function Landing() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard', { replace: true });
  }, [isAuthenticated, navigate]);

  const scrollTo = (id) => {
    setMobileMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div style={{ background: 'rgb(var(--color-surface))', color: 'rgb(var(--color-on-surface))' }}>
      {/* NAV */}
      <nav className="fixed top-0 inset-x-0 z-50 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-10" style={{ background: 'rgb(var(--color-surface) / 0.8)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgb(var(--color-outline-variant))' }}>
        <Link to="/" className="text-lg font-bold tracking-tight" style={{ color: 'rgb(var(--color-on-surface))' }}>Pyramids</Link>
        <div className="hidden md:flex items-center gap-lg">
          <button onClick={() => scrollTo('features')} className="text-sm font-medium transition-opacity hover:opacity-70" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>Features</button>
          <button onClick={() => scrollTo('how-it-works')} className="text-sm font-medium transition-opacity hover:opacity-70" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>How It Works</button>
          <button onClick={() => scrollTo('faq')} className="text-sm font-medium transition-opacity hover:opacity-70" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>FAQ</button>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={toggleTheme} className="p-2 rounded-lg transition-opacity hover:opacity-70" style={{ color: 'rgb(var(--color-on-surface-variant))' }} aria-label="Toggle theme">
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <Link to="/login" className="hidden sm:inline-flex text-sm font-semibold px-4 py-2 rounded-lg transition-all hover:opacity-80" style={{ color: 'rgb(var(--color-on-surface-variant))', border: '1px solid rgb(var(--color-outline-variant))' }}>Log In</Link>
          <Link to="/signup" className="text-sm font-semibold px-4 py-2 rounded-lg transition-all hover:opacity-90" style={{ background: 'rgb(var(--color-primary))', color: 'rgb(var(--color-on-primary))' }}>Join Pyramids</Link>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2" style={{ color: 'rgb(var(--color-on-surface-variant))' }} aria-label="Toggle menu">
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden pt-16" style={{ background: 'rgb(var(--color-surface))' }}>
          <div className="flex flex-col p-6 gap-4">
            <button onClick={() => scrollTo('features')} className="text-lg font-medium py-3 text-left" style={{ color: 'rgb(var(--color-on-surface))' }}>Features</button>
            <button onClick={() => scrollTo('how-it-works')} className="text-lg font-medium py-3 text-left" style={{ color: 'rgb(var(--color-on-surface))' }}>How It Works</button>
            <button onClick={() => scrollTo('faq')} className="text-lg font-medium py-3 text-left" style={{ color: 'rgb(var(--color-on-surface))' }}>FAQ</button>
            <div className="border-t pt-6 mt-4" style={{ borderColor: 'rgb(var(--color-outline-variant))' }}>
              <Link to="/login" className="block text-center text-sm font-semibold px-4 py-3 rounded-lg mb-3" style={{ color: 'rgb(var(--color-on-surface))', border: '1px solid rgb(var(--color-outline-variant))' }}>Log In</Link>
              <Link to="/signup" className="block text-center text-sm font-semibold px-4 py-3 rounded-lg" style={{ background: 'rgb(var(--color-primary))', color: 'rgb(var(--color-on-primary))' }}>Join Pyramids</Link>
            </div>
          </div>
        </div>
      )}

      <HeroSection scrollTo={scrollTo} />
      <StatisticsSection />
      <OverviewSection />
      <HowItWorksSection />
      <FeaturesSection />
      <ComparisonSection />
      <TestimonialsSection />
      <FAQSection />
      <CTASection />
      <FooterSection scrollTo={scrollTo} />
    </div>
  );
}

export default Landing;
