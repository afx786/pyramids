import { Navigate, Route, Routes } from 'react-router-dom';
import MainLayout from './layouts/MainLayout.jsx';
import Login from './pages/auth/Login.jsx';
import Signup from './pages/auth/Signup.jsx';
import Connections from './pages/connections/Connections.jsx';
import Dashboard from './pages/dashboard/Dashboard.jsx';
import Domains from './pages/domains/Domains.jsx';
import Messages from './pages/messages/Messages.jsx';
import Profile from './pages/profile/Profile.jsx';
import ProjectCreate from './pages/projects/ProjectCreate.jsx';
import Pyramidion from './pages/pyramidion/Pyramidion.jsx';
import Requests from './pages/requests/Requests.jsx';
import Teams from './pages/teams/Teams.jsx';
import Updates from './pages/updates/Updates.jsx';
import ProtectedRoute from './routes/ProtectedRoute.jsx';

function App() {
  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route path="signup" element={<Signup />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="domains" element={<Domains />} />
          <Route path="teams" element={<Teams />} />
          <Route path="messages" element={<Messages />} />
          <Route path="connections" element={<Connections />} />
          <Route path="requests" element={<Requests />} />
          <Route path="updates" element={<Updates />} />
          <Route path="pyramidion" element={<Pyramidion />} />
          <Route path="profile" element={<Profile />} />
          <Route path="projects/new" element={<ProjectCreate />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
