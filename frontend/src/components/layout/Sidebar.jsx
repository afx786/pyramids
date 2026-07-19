import {
  Bell,
  LayoutDashboard,
  List,
  LogOut,
  Medal,
  MessageSquare,
  Network,
  Pyramid,
  Search,
  Send,
  Shapes,
  ShieldCheck,
  Star,
  Triangle,
  Trophy,
  UserRound,
  UsersRound,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { notificationService } from '../../services/notificationService.js';
import { prefetchService } from '../../services/prefetchService.js';

const navigation = [
  { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { label: 'Notifications', to: '/notifications', icon: Bell },
  { label: 'Feed', to: '/updates', icon: List },
  { label: 'Domains', to: '/domains', icon: Shapes },
  { label: 'Teams', to: '/teams', icon: UsersRound },
  { label: 'Hackathons', to: '/hackathons', icon: Trophy },
  { label: 'Research', to: '/research', icon: Star },
  { label: 'Messages', to: '/messages', icon: MessageSquare },
  { label: 'Connections', to: '/connections', icon: Network },
  { label: 'Requests', to: '/requests', icon: Send },
  { label: 'Search', to: '/search', icon: Search },
  { label: 'Leaderboard', to: '/leaderboard', icon: Medal },
  { label: 'Pyramidion', to: '/pyramidion', icon: Pyramid },
  { label: 'Profile', to: '/profile', icon: UserRound },
  { label: 'Admin', to: '/admin', icon: ShieldCheck },
];

function Sidebar() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    function fetchUnread() {
      notificationService.listNotifications().then((data) => {
        const count = Array.isArray(data) ? data.filter((n) => !n.is_read).length : 0;
        setUnreadCount(count);
      }).catch(() => {});
    }

    fetchUnread();
    const interval = setInterval(fetchUnread, 30000);
    document.addEventListener('visibilitychange', fetchUnread);
    return () => { clearInterval(interval); document.removeEventListener('visibilitychange', fetchUnread); };
  }, []);

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <aside
      className="fixed inset-x-0 bottom-0 z-30 px-2 py-2 lg:inset-y-0 lg:left-0 lg:right-auto lg:flex lg:w-64 lg:flex-col lg:border-r lg:border-t-0 lg:px-3 lg:py-4"
      style={{
        background: 'rgb(var(--color-sidebar))',
        borderColor: 'rgb(var(--color-glass-border))',
      }}
    >
      {/* Logo */}
      <div
        className="hidden items-center gap-3 rounded-xl px-3 py-3 lg:flex gradient-border"
        style={{ background: 'rgb(var(--color-glass))' }}
      >
        <div
          className="flex h-9 w-9 items-center justify-center rounded-lg"
          style={{
            background: 'linear-gradient(135deg, rgb(var(--color-accent)), rgb(80 60 255))',
          }}
        >
          <Triangle className="h-5 w-5 text-white" strokeWidth={1.7} />
        </div>
        <div>
          <p className="text-sm font-semibold tracking-normal text-white">Pyramids</p>
          <p className="font-mono-label mt-0.5 text-[10px] text-white/42">Builder network</p>
        </div>
      </div>

      <nav className="flex gap-1 overflow-x-auto lg:mt-4 lg:flex-1 lg:flex-col lg:overflow-visible lg:gap-1">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
          <NavLink
            key={item.label}
            to={item.to}
            onMouseEnter={() => prefetchService[item.label.toLowerCase()]?.()}
            className={({ isActive }) =>
              `flex h-11 min-w-11 items-center justify-center gap-3 rounded-lg border px-2 text-xs font-medium transition-all duration-200 lg:h-9 lg:min-w-0 lg:justify-start lg:px-3 lg:text-sm btn-press ${
                isActive
                  ? 'border text-white'
                  : 'border-transparent text-white/50 hover:text-white'
              }`
            }
            style={({ isActive }) => ({
              background: isActive
                ? 'linear-gradient(135deg, rgb(var(--color-accent) / 0.15), rgb(80 60 255 / 0.08))'
                : 'transparent',
              borderColor: isActive ? 'rgb(var(--color-accent) / 0.25)' : 'transparent',
              boxShadow: isActive ? '0 0 20px rgb(var(--color-accent) / 0.08)' : 'none',
            })}
            title={item.label}
          >
            <Icon className="h-4 w-4 shrink-0" strokeWidth={1.9} aria-hidden="true" />
            <span className="hidden lg:inline">{item.label}</span>
          {item.label === 'Notifications' && unreadCount > 0 && (
            <span
              className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-bold"
              style={{
                background: 'rgb(var(--color-accent))',
                color: 'white',
              }}
            >
              {unreadCount}
            </span>
          )}
          </NavLink>
          );
        })}
      </nav>

      <button
        type="button"
        onClick={handleLogout}
        className="mt-3 hidden h-9 items-center justify-center gap-2 rounded-lg px-3 text-sm font-medium transition-all duration-200 lg:flex btn-press"
        style={{
          border: '1px solid rgb(var(--color-glass-border))',
          color: 'rgb(var(--color-text-secondary))',
          background: 'rgb(var(--color-glass))',
        }}
      >
        <LogOut className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
        Logout
      </button>
    </aside>
  );
}

export default Sidebar;
