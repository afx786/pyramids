import { Bell, Moon, Search, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';
import Avatar from '../ui/Avatar.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

function Topbar() {
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
    <header className="sticky top-0 z-20 flex h-24 items-center justify-end bg-app/95 px-12 backdrop-blur">
      <div className="flex items-center gap-5">
        <button className="flex h-11 w-11 items-center justify-center rounded-full text-primary transition hover:bg-surface" aria-label="Search">
          <Search className="h-6 w-6 text-accent" strokeWidth={1.6} />
        </button>
        <button className="flex h-11 w-11 items-center justify-center rounded-full text-primary transition hover:bg-surface" aria-label="Notifications">
          <Bell className="h-6 w-6" strokeWidth={1.6} />
        </button>
        <button
          className="flex h-11 w-11 items-center justify-center rounded-full text-primary transition hover:bg-surface"
          aria-label="Toggle theme"
          onClick={() => setTheme(isDark ? 'light' : 'dark')}
        >
          {isDark ? <Sun className="h-6 w-6" strokeWidth={1.6} /> : <Moon className="h-6 w-6" strokeWidth={1.6} />}
        </button>
        <Avatar src={avatar} alt={name} />
      </div>
    </header>
  );
}

export default Topbar;
