import { LogOut, Triangle } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService.js';

const navigation = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Domains', to: '/domains' },
  { label: 'Teams', to: '/teams' },
  { label: 'Messages', to: '/messages' },
  { label: 'Connections', to: '/connections' },
  { label: 'Requests', to: '/requests' },
  { label: "What's New?", to: '/updates' },
  { label: 'Pyramidion', to: '/pyramidion' },
  { label: 'Profile', to: '/profile' },
];

function Sidebar() {
  const navigate = useNavigate();

  function handleLogout() {
    authService.logout();
    navigate('/login');
  }

  return (
    <aside className="fixed inset-y-0 left-0 flex w-44 flex-col bg-sidebar px-4 py-7">
      <div className="flex flex-col items-center">
        <div className="flex h-16 w-16 items-center justify-center">
          <Triangle className="h-14 w-14 text-accent" strokeWidth={1.1} />
        </div>
        <p className="mt-2 text-[10px] font-black uppercase tracking-[0.42em] text-primary">Pyramids</p>
      </div>

      <nav className="mt-10 flex flex-1 flex-col gap-2">
        {navigation.map((item) => {
          return (
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }) =>
                `flex h-9 items-center justify-center rounded-md px-2 text-center text-base font-black transition ${
                  isActive
                    ? 'bg-surface/70 text-primary'
                    : 'text-primary hover:bg-surface/50'
                }`
              }
            >
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <button
        className="flex h-9 items-center justify-center gap-2 rounded-md px-2 text-sm font-black text-primary transition hover:bg-surface/50"
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
