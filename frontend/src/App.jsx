import { Navigate, Route, Routes } from 'react-router-dom';
import MainLayout from './layouts/MainLayout.jsx';
import Login from './pages/auth/Login.jsx';
import Signup from './pages/auth/Signup.jsx';
import Bookmarks from './pages/bookmarks/Bookmarks.jsx';
import Connections from './pages/connections/Connections.jsx';
import Dashboard from './pages/dashboard/Dashboard.jsx';
import Domains from './pages/domains/Domains.jsx';
import Hackathons from './pages/hackathons/Hackathons.jsx';
import Leaderboard from './pages/leaderboard/Leaderboard.jsx';
import Messages from './pages/messages/Messages.jsx';
import Notifications from './pages/notifications/Notifications.jsx';
import Opportunities from './pages/opportunities/Opportunities.jsx';
import Profile from './pages/profile/Profile.jsx';
import ProjectsExplorer from './pages/projects/ProjectsExplorer.jsx';
import ProjectCreate from './pages/projects/ProjectCreate.jsx';
import ProjectDetail from './pages/projects/ProjectDetail.jsx';
import VerifyRepository from './pages/projects/VerifyRepository.jsx';
import Settings from './pages/settings/Settings.jsx';
import Pyramidion from './pages/pyramidion/Pyramidion.jsx';
import Requests from './pages/requests/Requests.jsx';
import Search from './pages/search/Search.jsx';
import SkillAnalytics from './pages/skill_analytics/SkillAnalytics.jsx';
import Stats from './pages/stats/Stats.jsx';
import TeamCreate from './pages/teams/TeamCreate.jsx';
import TeamDetail from './pages/teams/TeamDetail.jsx';
import Teams from './pages/teams/Teams.jsx';
import Technologies from './pages/technologies/Technologies.jsx';
import Updates from './pages/updates/Updates.jsx';
import Research from './pages/research/Research.jsx';
import ResearchDetail from './pages/research/ResearchDetail.jsx';
import Admin from './pages/admin/Admin.jsx';
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
          <Route path="teams/new" element={<TeamCreate />} />
          <Route path="teams/:id" element={<TeamDetail />} />
          <Route path="hackathons" element={<Hackathons />} />
          <Route path="messages" element={<Messages />} />
          <Route path="connections" element={<Connections />} />
          <Route path="requests" element={<Requests />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="bookmarks" element={<Bookmarks />} />
          <Route path="search" element={<Search />} />
          <Route path="leaderboard" element={<Leaderboard />} />
          <Route path="opportunities" element={<Opportunities />} />
          <Route path="technologies" element={<Technologies />} />
          <Route path="research" element={<Research />} />
          <Route path="research/:id" element={<ResearchDetail />} />
          <Route path="skills/top" element={<SkillAnalytics />} />
          <Route path="stats" element={<Stats />} />
          <Route path="updates" element={<Updates />} />
          <Route path="admin" element={<Admin />} />
          <Route path="pyramidion" element={<Pyramidion />} />
          <Route path="profile" element={<Profile />} />
          <Route path="profile/:id" element={<Profile />} />
          <Route path="projects" element={<ProjectsExplorer />} />
          <Route path="projects/new" element={<ProjectCreate />} />
          <Route path="projects/:id" element={<ProjectDetail />} />
          <Route path="verify/:id" element={<VerifyRepository />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
