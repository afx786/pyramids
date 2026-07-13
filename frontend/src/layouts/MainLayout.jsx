import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar.jsx';
import Topbar from '../components/layout/Topbar.jsx';

function MainLayout() {
  return (
    <div className="min-h-screen bg-app text-primary">
      <Sidebar />
      <div className="min-h-screen lg:pl-64">
        <Topbar />
        <main className="px-4 pb-28 sm:px-6 lg:px-10 lg:pb-12 xl:px-12">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
