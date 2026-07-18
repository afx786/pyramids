import { Bell, Moon, Search, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from '../ui/Avatar.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

function Topbar() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [theme, setTheme] = useState(() => localStorage.getItem('pyramids-theme') || 'light');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('pyramids-theme', theme);
  }, [theme]);

  const isDark = theme === 'dark';
  const avatar = profile?.user?.profile_picture ?? null;
  const name = user?.name ?? '';

  return (
    <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-subtle bg-app/92 px-4 backdrop-blur sm:px-6 lg:px-10 xl:px-12">
      <div>
        <p className="font-mono-label text-xs text-secondary">Pyramids</p>
        <p className="mt-1 hidden text-sm font-semibold text-primary sm:block">Verified projects, teams, skills, and rank.</p>
      </div>
      <div className="flex items-center gap-2 sm:gap-3">
        <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-transparent text-primary transition duration-200 hover:border-subtle hover:bg-surface" aria-label="Search" onClick={() => navigate('/search')}>
          <Search className="h-5 w-5 text-accent" strokeWidth={1.8} />
        </button>
        <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-transparent text-primary transition duration-200 hover:border-subtle hover:bg-surface" aria-label="Notifications" onClick={() => navigate('/notifications')}>
          <Bell className="h-5 w-5" strokeWidth={1.8} />
        </button>
        <button
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-transparent text-primary transition duration-200 hover:border-subtle hover:bg-surface"
          aria-label="Toggle theme"
          onClick={() => setTheme(isDark ? 'light' : 'dark')}
        >
          {isDark ? <Sun className="h-5 w-5" strokeWidth={1.8} /> : <Moon className="h-5 w-5" strokeWidth={1.8} />}
        </button>
        <Avatar src={avatar} alt={name} />
      </div>
    </header>
  );
}

export default Topbar;
