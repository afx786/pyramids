import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar.jsx';
import Topbar from '../components/layout/Topbar.jsx';

function MainLayout() {
  return (
    <div className="min-h-screen bg-app text-primary">
      <Sidebar />
      <div className="min-h-screen pl-44">
        <Topbar />
        <main className="px-12 pb-12">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
