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
    notificationService.listNotifications().then((data) => {
      const count = Array.isArray(data) ? data.filter((n) => !n.is_read).length : 0;
      setUnreadCount(count);
    }).catch(() => {});
  }, []);

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <aside className="fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-sidebar px-2 py-2 text-white lg:inset-y-0 lg:left-0 lg:right-auto lg:flex lg:w-64 lg:flex-col lg:border-r lg:border-t-0 lg:border-white/10 lg:px-3 lg:py-4">
      <div className="hidden items-center gap-3 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-3 lg:flex">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 bg-white/[0.04]">
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
            className={({ isActive }) =>
              `flex h-11 min-w-11 items-center justify-center gap-3 rounded-lg border px-2 text-xs font-medium transition duration-200 lg:h-9 lg:min-w-0 lg:justify-start lg:px-3 lg:text-sm ${
                isActive
                  ? 'border-white/12 bg-white/10 text-white'
                  : 'border-transparent text-white/58 hover:border-white/8 hover:bg-white/[0.06] hover:text-white'
              }`
            }
            title={item.label}
          >
            <Icon className="h-4 w-4 shrink-0" strokeWidth={1.9} aria-hidden="true" />
            <span className="hidden lg:inline">{item.label}</span>
          {item.label === 'Notifications' && unreadCount > 0 && (
            <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-white text-[10px] font-bold text-sidebar px-1">
              {unreadCount}
            </span>
          )}
          </NavLink>
          );
        })}
      </nav>

      <button
        className="mt-3 hidden h-9 items-center justify-center gap-2 rounded-lg border border-white/10 px-3 text-sm font-medium text-white/58 transition duration-200 hover:bg-white/[0.06] hover:text-white lg:flex"
        type="button"
        onClick={handleLogout}
      >
        <LogOut className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
        Logout
      </button>
    </aside>
  );
}

export default Sidebar;
