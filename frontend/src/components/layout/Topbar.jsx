import { Bell, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Avatar from '../ui/Avatar.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

function Topbar() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const avatar = profile?.user?.profile_picture ?? null;
  const name = user?.name ?? '';

  return (
    <header
      className="sticky top-0 z-20 flex h-20 items-center justify-between px-4 sm:px-6 lg:px-10 xl:px-12"
      style={{
        background: 'rgb(var(--color-app) / 0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgb(var(--color-glass-border))',
      }}
    >
      <div>
        <p className="font-mono-label text-xs text-secondary">Pyramids</p>
        <p className="mt-1 hidden text-sm font-semibold sm:block" style={{ color: 'rgb(var(--color-text-secondary))' }}>Builder network</p>
      </div>
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          className="flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-200 btn-press"
          style={{ color: 'rgb(var(--color-text-secondary))' }}
          aria-label="Search"
          onClick={() => navigate('/search')}
        >
          <Search className="h-5 w-5" strokeWidth={1.8} style={{ color: 'rgb(var(--color-accent))' }} />
        </button>
        <button
          className="flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-200 btn-press"
          style={{ color: 'rgb(var(--color-text-secondary))' }}
          aria-label="Notifications"
          onClick={() => navigate('/notifications')}
        >
          <Bell className="h-5 w-5" strokeWidth={1.8} />
        </button>
        <Avatar src={avatar} alt={name} />
      </div>
    </header>
  );
}

export default Topbar;
