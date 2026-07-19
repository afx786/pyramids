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
  Plus,
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
  const { user, logout } = useAuth();
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

  return (
    <aside className="fixed inset-x-0 bottom-0 z-50 flex h-16 border-t lg:inset-y-0 lg:left-0 lg:right-auto lg:flex-col lg:w-[240px] lg:border-r lg:border-t-0 lg:h-full glass-nav"
      style={{ background: 'rgb(var(--color-surface-container-low) / 0.8)', borderColor: 'rgb(var(--color-outline-variant))' }}
    >
      {/* Logo — desktop only */}
      <div className="hidden lg:block px-md pt-lg pb-xl">
        <h1 className="text-headline-md font-bold tracking-tight" style={{ color: 'rgb(var(--color-on-surface))' }}>
          Pyramids
        </h1>
        <p className="font-label-caps text-[11px]" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
          Builder Workspace
        </p>
      </div>

      {/* Nav — horizontal on mobile, vertical on desktop */}
      <nav className="flex items-center gap-0.5 overflow-x-auto px-2 no-scrollbar lg:flex-col lg:items-stretch lg:flex-1 lg:gap-0.5 lg:px-md lg:overflow-visible">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.label}
              to={item.to}
              onMouseEnter={() => prefetchService[item.label.toLowerCase()]?.()}
              className="group flex items-center gap-md rounded-lg px-md py-sm transition-all duration-150"
              style={({ isActive }) => ({
                color: isActive ? 'rgb(var(--color-primary))' : 'rgb(var(--color-on-surface-variant))',
                background: isActive ? 'rgb(var(--color-surface-container-highest))' : 'transparent',
                fontWeight: isActive ? 700 : 500,
                borderLeft: isActive ? '2px solid rgb(var(--color-primary))' : '2px solid transparent',
                borderRadius: 0,
              })}
              title={item.label}
            >
              <Icon className="h-5 w-5 shrink-0" strokeWidth={1.5} aria-hidden="true" />
              <span className="hidden lg:inline text-body-sm">{item.label}</span>
              {item.label === 'Notifications' && unreadCount > 0 && (
                <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold"
                  style={{ background: 'rgb(var(--color-error))', color: 'rgb(var(--color-on-error))' }}
                >
                  {unreadCount}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom section — desktop only */}
      <div className="hidden lg:block px-sm pt-lg border-t" style={{ borderColor: 'rgb(var(--color-outline-variant))' }}>
        <button
          className="w-full flex items-center justify-center gap-sm bg-primary font-medium py-sm px-md rounded-lg active:scale-[0.98] transition-all hover:opacity-90"
          style={{ color: 'rgb(var(--color-on-primary))' }}
          type="button"
          onClick={() => navigate('/projects/new')}
        >
          <Plus className="h-[18px] w-[18px]" strokeWidth={2} />
          <span className="font-body-sm font-semibold">New Project</span>
        </button>
        <div className="mt-lg flex items-center gap-md px-sm pb-lg">
          <div className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden"
            style={{ background: 'rgb(var(--color-surface-container-high))' }}
          >
            <UserRound className="h-4 w-4" style={{ color: 'rgb(var(--color-on-surface-variant))' }} />
          </div>
          <div className="flex flex-col">
            <span className="font-body-sm font-semibold" style={{ color: 'rgb(var(--color-on-surface))' }}>
              {user?.name || 'Builder'}
            </span>
            <span className="font-label-caps text-[10px] uppercase tracking-wider" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
              Builder
            </span>
          </div>
          <button
            className="ml-auto btn-press"
            type="button"
            onClick={() => { logout(); navigate('/login'); }}
            style={{ color: 'rgb(var(--color-on-surface-variant))' }}
          >
            <LogOut className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
