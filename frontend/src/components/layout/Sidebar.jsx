import {
  Bell,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Network,
  Pyramid,
  Send,
  Shapes,
  Sparkles,
  Triangle,
  UserRound,
  UsersRound,
} from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

const navigation = [
  { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { label: 'Domains', to: '/domains', icon: Shapes },
  { label: 'Teams', to: '/teams', icon: UsersRound },
  { label: 'Messages', to: '/messages', icon: MessageSquare },
  { label: 'Connections', to: '/connections', icon: Network },
  { label: 'Requests', to: '/requests', icon: Send },
  { label: 'Updates', to: '/updates', icon: Bell },
  { label: 'Pyramidion', to: '/pyramidion', icon: Pyramid },
  { label: 'Profile', to: '/profile', icon: UserRound },
];

function Sidebar() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <aside className="fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-sidebar px-2 py-2 text-white lg:inset-y-0 lg:left-0 lg:right-auto lg:flex lg:w-64 lg:flex-col lg:border-r lg:border-t-0 lg:px-4 lg:py-6">
      <div className="hidden items-center gap-3 px-2 lg:flex">
        <div className="flex h-11 w-11 items-center justify-center border border-white/20">
          <Triangle className="h-8 w-8 text-white" strokeWidth={1.2} />
        </div>
        <div>
          <p className="text-base font-extrabold tracking-normal text-white">Pyramids</p>
          <p className="font-mono-label text-[10px] text-white/45">Builder network</p>
        </div>
      </div>

      <nav className="flex gap-1 overflow-x-auto lg:mt-8 lg:flex-1 lg:flex-col lg:overflow-visible lg:gap-1.5">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
          <NavLink
            key={item.label}
            to={item.to}
            className={({ isActive }) =>
              `flex h-12 min-w-12 items-center justify-center gap-3 rounded-none px-2 text-xs font-extrabold transition lg:h-10 lg:min-w-0 lg:justify-start lg:px-3 lg:text-sm ${
                isActive ? 'bg-white text-sidebar' : 'text-white/60 hover:bg-white/10 hover:text-white'
              }`
            }
            title={item.label}
          >
            <Icon className="h-4 w-4 shrink-0" strokeWidth={1.9} aria-hidden="true" />
            <span className="hidden lg:inline">{item.label}</span>
          </NavLink>
          );
        })}
      </nav>

      <button
        className="mt-3 hidden h-10 items-center justify-center gap-2 rounded-none border border-white/15 px-3 text-sm font-extrabold text-white/60 transition hover:bg-white hover:text-black lg:flex"
        type="button"
        onClick={handleLogout}
      >
        <LogOut className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
        Logout
      </button>
      <Sparkles className="pointer-events-none absolute bottom-5 right-5 hidden h-5 w-5 text-white/45 lg:block" aria-hidden="true" />
    </aside>
  );
}

export default Sidebar;
