import { Bell, Search, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

function Topbar() {
  const navigate = useNavigate();
  const { rankData } = useAuth();

  return (
    <header
      className="sticky top-0 z-40 flex h-16 items-center justify-between px-lg py-sm border-b glass-nav"
      style={{
        background: 'rgb(var(--color-surface) / 0.8)',
        borderColor: 'rgb(var(--color-outline-variant))',
      }}
    >
      {/* Search */}
      <div className="relative w-full max-w-md group">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors"
          style={{ color: 'rgb(var(--color-on-surface-variant) / 0.6)' }}
          strokeWidth={1.5}
        />
        <input
          className="w-full rounded-lg py-2 pl-10 pr-4 font-body-sm text-body-sm transition-all outline-none"
          style={{
            background: 'rgb(var(--color-surface-container-lowest))',
            border: 'none',
            boxShadow: '0 0 0 1px rgb(var(--color-outline-variant))',
            color: 'rgb(var(--color-on-surface))',
          }}
          placeholder="Search workspace..."
          type="text"
          onFocus={(e) => { e.target.style.boxShadow = '0 0 0 1px rgb(var(--color-primary))'; }}
          onBlur={(e) => { e.target.style.boxShadow = '0 0 0 1px rgb(var(--color-outline-variant))'; }}
          onKeyDown={(e) => { if (e.key === 'Enter' && e.target.value.trim()) { navigate('/search?q=' + encodeURIComponent(e.target.value.trim())); } }}
        />
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-lg">
        <div className="flex items-center gap-md">
          <button
            className="relative transition-opacity hover:opacity-80"
            style={{ color: 'rgb(var(--color-on-surface-variant))' }}
            onClick={() => navigate('/notifications')}
          >
            <Bell className="h-5 w-5" strokeWidth={1.5} />
            <span className="absolute top-0 right-0 w-1.5 h-1.5 rounded-full"
              style={{ background: 'rgb(var(--color-error))' }}
            />
          </button>
        </div>
        <div className="flex items-center gap-sm pl-md" style={{ borderLeft: '1px solid rgb(var(--color-outline-variant))' }}>
          <div className="text-right">
            <p className="font-label-caps text-label-caps leading-none" style={{ color: 'rgb(var(--color-primary))' }}>
              {rankData?.rank || 'Builder'}
            </p>
            <p className="font-mono text-[10px]" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
              LVL {rankData?.points || 0}
            </p>
          </div>
          <div className="w-8 h-8 rounded-full border flex items-center justify-center overflow-hidden"
            style={{ borderColor: 'rgb(var(--color-outline-variant))', background: 'rgb(var(--color-surface-container-high))' }}
          >
            <Award className="h-4 w-4" style={{ color: 'rgb(var(--color-primary))' }} strokeWidth={1.5} />
          </div>
        </div>
      </div>
    </header>
  );
}

export default Topbar;
