import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar.jsx';
import Topbar from '../components/layout/Topbar.jsx';

function MainLayout() {
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: 'rgb(var(--color-surface))', color: 'rgb(var(--color-on-surface))' }}>
      <Sidebar />
      <div className="min-h-screen lg:pl-[240px] pl-0">
        <Topbar />
        <main className="px-4 sm:px-6 lg:px-10 xl:px-lg pb-4 sm:pb-6 lg:pb-12 pt-lg mx-auto">
          <div key={pathname} className="animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
