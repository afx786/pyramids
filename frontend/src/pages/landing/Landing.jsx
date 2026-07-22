import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronDown, ExternalLink, Menu, Moon, Sun, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';

const stats = [
  { label: 'Projects', value: 240 },
  { label: 'Research', value: 86 },
  { label: 'Hackathons', value: 32 },
  { label: 'Organizations', value: 18 },
  { label: 'Builders', value: 1200 },
];

const testimonials = [
  { name: 'Arjun M.', role: 'Final Year CSE', text: 'Pyramids transformed how I showcase my work. My verified projects speak louder than any resume bullet point.' },
  { name: 'Priya K.', role: 'Research Scholar', text: 'The evidence system is brilliant. My research contributions are now verifiable and organized.' },
  { name: 'Rahul S.', role: 'Open Source Contributor', text: 'Finding collaborators who match my skills has never been easier. The builder network is incredible.' },
  { name: 'Neha P.', role: 'Hackathon Enthusiast', text: 'From hackathon registrations to team formation — everything is seamless on Pyramids.' },
];

const faqs = [
  { q: 'What is Pyramids?', a: 'Pyramids is a builder-first campus collaboration platform where students showcase verified projects, form teams, participate in hackathons, and build their reputation through real evidence.' },
  { q: 'Is Pyramids free?', a: 'Yes, Pyramids is completely free for students and builders. Create your profile, showcase projects, and connect with collaborators at no cost.' },
  { q: 'How does the evidence system work?', a: 'Pyramids connects with GitHub to analyze your repositories. Skills, technologies, and contributions are automatically verified and displayed on your profile.' },
  { q: 'Can I join existing projects?', a: 'Absolutely. Browse projects in your domain, send requests to join, or create your own project and invite collaborators.' },
  { q: 'How do hackathons work on Pyramids?', a: 'Organizers can create and publish hackathons. Teams register, submit projects, and get reviewed — all within the platform.' },
  { q: 'What is the rank system?', a: 'Your rank (Explorer → Builder → Architect → Innovator → Pyramidion) reflects your verified contributions, project quality, and community engagement.' },
];

function AnimatedCounter({ target, suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasAnimated.current) {
        hasAnimated.current = true;
        const duration = 2000;
        const steps = 60;
        const increment = target / steps;
        let current = 0;
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            setCount(target);
            clearInterval(timer);
          } else {
            setCount(Math.floor(current));
          }
        }, duration / steps);
      }
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{count}{suffix}</span>;
}

function FadeInSection({ children, delay = 0 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setTimeout(() => setVisible(true), delay);
        observer.disconnect();
      }
    }, { threshold: 0.1 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
    >
      {children}
    </div>
  );
}

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

      {/* HERO */}
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
            The builder-first campus network where your projects, research, and skills speak louder than any resume.
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

      {/* STATISTICS */}
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

      {/* WHAT IS PYRAMIDS */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-10">
        <div className="max-w-6xl mx-auto">
          <FadeInSection>
            <p className="text-sm font-semibold tracking-widest uppercase mb-4" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>Overview</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight max-w-3xl" style={{ color: 'rgb(var(--color-on-surface))' }}>
              Your campus builder ecosystem
            </h2>
          </FadeInSection>
          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Projects', desc: 'Showcase verified repositories with automated skill and technology detection from your GitHub.' },
              { title: 'Research', desc: 'Publish and manage research projects with milestones, updates, and collaborative tools.' },
              { title: 'Hackathons', desc: 'Discover, register, and compete in hackathons. Form teams and submit projects seamlessly.' },
              { title: 'Organizations', desc: 'Create or join campus organizations, clubs, and labs to collaborate on shared goals.' },
              { title: 'Evidence System', desc: 'Every contribution is verified. Skills, technologies, and repository scores back your profile.' },
              { title: 'Builder Network', desc: 'Connect with like-minded builders, form teams, and grow your professional network on campus.' },
            ].map((item) => (
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

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-10" style={{ background: 'rgb(var(--color-surface-container-low))' }}>
        <div className="max-w-4xl mx-auto">
          <FadeInSection>
            <p className="text-sm font-semibold tracking-widest uppercase mb-4 text-center" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>How It Works</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-center max-w-2xl mx-auto" style={{ color: 'rgb(var(--color-on-surface))' }}>
              Five steps to your verified profile
            </h2>
          </FadeInSection>
          <div className="mt-14 space-y-8">
            {[
              { step: '01', title: 'Create Profile', desc: 'Sign up with your college email, set your program and batch, and join the builder network.' },
              { step: '02', title: 'Build', desc: 'Create projects, push code to GitHub, and let Pyramids automatically verify your skills and technologies.' },
              { step: '03', title: 'Collaborate', desc: 'Form teams, invite members, work on research together, and participate in hackathons.' },
              { step: '04', title: 'Participate', desc: 'Join hackathons, contribute to open research, and engage with campus organizations.' },
              { step: '05', title: 'Grow Reputation', desc: 'Earn rank points through verified contributions. Advance from Explorer to Pyramidion.' },
            ].map((item, idx) => (
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

      {/* FEATURES */}
      <section id="features" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-10">
        <div className="max-w-6xl mx-auto">
          <FadeInSection>
            <p className="text-sm font-semibold tracking-widest uppercase mb-4 text-center" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>Features</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-center max-w-2xl mx-auto" style={{ color: 'rgb(var(--color-on-surface))' }}>
              Everything you need to build in public
            </h2>
          </FadeInSection>
          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Projects', desc: 'Create and manage projects with GitHub verification, skill detection, and repository scoring.' },
              { title: 'Research', desc: 'Document research with milestones, updates, and collaborative tools for academic projects.' },
              { title: 'Hackathons', desc: 'Full hackathon lifecycle — create, register, submit, and review. Built-in team management.' },
              { title: 'Organizations', desc: 'Campus clubs, labs, and societies with member management and verification.' },
              { title: 'Evidence System', desc: 'Verified skills, technologies, repository analysis, and contribution tracking.' },
              { title: 'Builder Reputation', desc: 'Rank progression, trust scores, and reputation metrics based on verified contributions.' },
            ].map((item) => (
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

      {/* WHY PYRAMIDS */}
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
                <li className="flex items-center gap-3"><span style={{ color: 'rgb(var(--color-error))' }}>✗</span> Self-reported skills</li>
                <li className="flex items-center gap-3"><span style={{ color: 'rgb(var(--color-error))' }}>✗</span> No verification</li>
                <li className="flex items-center gap-3"><span style={{ color: 'rgb(var(--color-error))' }}>✗</span> Static PDF</li>
                <li className="flex items-center gap-3"><span style={{ color: 'rgb(var(--color-error))' }}>✗</span> Hard to collaborate</li>
              </ul>
            </div>
            <div className="p-8 rounded-xl" style={{ background: 'rgb(var(--color-surface))', border: '1px solid rgb(var(--color-primary) / 0.2)' }}>
              <p className="text-sm font-semibold mb-4" style={{ color: 'rgb(var(--color-primary))' }}>Pyramids Profile</p>
              <ul className="space-y-3 text-sm" style={{ color: 'rgb(var(--color-on-surface))' }}>
                <li className="flex items-center gap-3"><span style={{ color: 'rgb(var(--color-success))' }}>✓</span> GitHub-verified skills</li>
                <li className="flex items-center gap-3"><span style={{ color: 'rgb(var(--color-success))' }}>✓</span> Automated evidence</li>
                <li className="flex items-center gap-3"><span style={{ color: 'rgb(var(--color-success))' }}>✓</span> Dynamic & shareable</li>
                <li className="flex items-center gap-3"><span style={{ color: 'rgb(var(--color-success))' }}>✓</span> Built-in collaboration</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
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

      {/* FAQ */}
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

      {/* FINAL CTA */}
      <section className="py-28 sm:py-36 px-4 sm:px-6 lg:px-10 text-center">
        <FadeInSection>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight max-w-2xl mx-auto" style={{ color: 'rgb(var(--color-on-surface))' }}>
            Ready to build?
          </h2>
          <p className="mt-4 text-lg" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
            Join thousands of builders on Pyramids.
          </p>
          <Link to="/signup" className="mt-8 inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-base font-semibold transition-all hover:opacity-90 active:scale-[0.98]" style={{ background: 'rgb(var(--color-primary))', color: 'rgb(var(--color-on-primary))' }}>
            Join Pyramids
            <ArrowRight className="h-4 w-4" />
          </Link>
        </FadeInSection>
      </section>

      {/* FOOTER */}
      <footer className="py-12 px-4 sm:px-6 lg:px-10" style={{ borderTop: '1px solid rgb(var(--color-outline-variant))' }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <h3 className="text-base font-bold mb-4" style={{ color: 'rgb(var(--color-on-surface))' }}>Pyramids</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>The builder-first campus collaboration platform.</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-4" style={{ color: 'rgb(var(--color-on-surface))' }}>Product</h4>
              <div className="flex flex-col gap-2">
                <button onClick={() => scrollTo('features')} className="text-sm text-left transition-opacity hover:opacity-70" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>Features</button>
                <button onClick={() => scrollTo('how-it-works')} className="text-sm text-left transition-opacity hover:opacity-70" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>How It Works</button>
                <Link to="/login" className="text-sm transition-opacity hover:opacity-70" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>Sign In</Link>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-4" style={{ color: 'rgb(var(--color-on-surface))' }}>Legal</h4>
              <div className="flex flex-col gap-2">
                <span className="text-sm" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>Privacy</span>
                <span className="text-sm" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>Terms</span>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-4" style={{ color: 'rgb(var(--color-on-surface))' }}>Connect</h4>
              <div className="flex flex-col gap-2">
                <a href="https://github.com/afx786/pyramids" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm transition-opacity hover:opacity-70" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
                  <ExternalLink className="h-4 w-4" />
                  GitHub
                </a>
                <span className="text-sm" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>Contact</span>
              </div>
            </div>
          </div>
          <div className="mt-10 pt-6 text-center text-xs" style={{ borderTop: '1px solid rgb(var(--color-outline-variant))', color: 'rgb(var(--color-on-surface-variant))' }}>
            &copy; {new Date().getFullYear()} Pyramids. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
