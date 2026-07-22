import {
  Bell,
  Building2,
  LayoutDashboard,
  List,
  LogOut,
  Medal,
  Menu,
  MessageSquare,
  Network,
  Plus,
  Pyramid,
  Search,
  Send,
  Shapes,
  ShieldCheck,
  Star,
  Trophy,
  UserRound,
  UsersRound,
  X,
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
  { label: 'My Hackathons', to: '/hackathons/host', icon: Trophy },
  { label: 'Research', to: '/research', icon: Star },
  { label: 'Organizations', to: '/organizations', icon: Building2 },
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
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    function fetchUnread() {
      notificationService.listNotifications().then((data) => {
        const count = Array.isArray(data) ? data.filter((n) => !n.is_read).length : 0;
        setUnreadCount(count);
      }).catch((err) => console.warn('[sidebar] unread count failed:', err));
    }
    fetchUnread();
    const interval = setInterval(fetchUnread, 30000);
    document.addEventListener('visibilitychange', fetchUnread);
    return () => { clearInterval(interval); document.removeEventListener('visibilitychange', fetchUnread); };
  }, []);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') setIsOpen(false);
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const closeDrawer = () => setIsOpen(false);

  const renderNavItems = ({ onClick, labelClass = 'hidden lg:inline' } = {}) =>
    navigation.map((item) => {
      const Icon = item.icon;
      return (
        <NavLink
          key={item.label}
          to={item.to}
          onClick={onClick}
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
          <span className={`${labelClass} text-body-sm`}>{item.label}</span>
          {item.label === 'Notifications' && unreadCount > 0 && (
            <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold"
              style={{ background: 'rgb(var(--color-error))', color: 'rgb(var(--color-on-error))' }}
            >
              {unreadCount}
            </span>
          )}
        </NavLink>
      );
    });

  const renderBottom = ({ onNewProject } = {}) => (
    <div className="px-sm pt-lg border-t" style={{ borderColor: 'rgb(var(--color-outline-variant))' }}>
      <button
        className="w-full flex items-center justify-center gap-sm bg-primary font-medium py-sm px-md rounded-lg active:scale-[0.98] transition-all hover:opacity-90"
        style={{ color: 'rgb(var(--color-on-primary))' }}
        type="button"
        onClick={() => { navigate('/projects/new'); onNewProject?.(); }}
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
          aria-label="Log out"
        >
          <LogOut className="h-4 w-4" strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar — unchanged */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 z-50 flex-col w-[240px] border-r h-full glass-nav"
        style={{ background: 'rgb(var(--color-surface-container-low) / 0.8)', borderColor: 'rgb(var(--color-outline-variant))' }}
      >
        <div className="px-md pt-lg pb-xl">
          <h1 className="text-headline-md font-bold tracking-tight" style={{ color: 'rgb(var(--color-on-surface))' }}>
            Pyramids
          </h1>
          <p className="font-label-caps text-[11px]" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
            Builder Workspace
          </p>
        </div>
        <nav className="flex flex-col flex-1 gap-0.5 px-md overflow-y-auto">
          {renderNavItems()}
        </nav>
        {renderBottom()}
      </aside>

      {/* Mobile hamburger button */}
      <button
        className="fixed top-4 left-4 z-50 flex items-center justify-center w-10 h-10 rounded-lg lg:hidden"
        style={{ background: 'rgb(var(--color-surface-container-low) / 0.8)' }}
        onClick={() => setIsOpen(true)}
        aria-label="Open navigation menu"
        aria-expanded={isOpen}
        type="button"
      >
        <Menu className="h-5 w-5" style={{ color: 'rgb(var(--color-on-surface-variant))' }} />
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 transition-opacity lg:hidden"
          onClick={closeDrawer}
          aria-hidden="true"
        />
      )}

      {/* Mobile slide-out drawer */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-[280px] transform transition-transform duration-300 ease-in-out lg:hidden flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ background: 'rgb(var(--color-surface-container-low) / 0.95)', borderRight: '1px solid rgb(var(--color-outline-variant))' }}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        <div className="flex items-center justify-between px-md pt-lg pb-xl">
          <div>
            <h1 className="text-headline-md font-bold tracking-tight" style={{ color: 'rgb(var(--color-on-surface))' }}>
              Pyramids
            </h1>
            <p className="font-label-caps text-[11px]" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
              Builder Workspace
            </p>
          </div>
          <button
            className="flex items-center justify-center w-8 h-8 rounded-lg btn-press"
            type="button"
            onClick={closeDrawer}
            aria-label="Close navigation menu"
            style={{ color: 'rgb(var(--color-on-surface-variant))' }}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto px-md pb-md">
          {renderNavItems({ onClick: closeDrawer, labelClass: 'inline' })}
        </nav>
        <div className="flex-shrink-0">
          {renderBottom({ onNewProject: closeDrawer })}
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
