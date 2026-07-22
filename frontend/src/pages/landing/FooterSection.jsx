import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';

export default function FooterSection({ scrollTo }) {
  return (
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
  );
}
