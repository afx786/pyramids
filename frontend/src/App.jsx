import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import ErrorBoundary from './components/ui/ErrorBoundary.jsx';
import MainLayout from './layouts/MainLayout.jsx';
import Login from './pages/auth/Login.jsx';
import Signup from './pages/auth/Signup.jsx';
import ProtectedRoute from './routes/ProtectedRoute.jsx';

const Bookmarks = lazy(() => import('./pages/bookmarks/Bookmarks.jsx'));
const Connections = lazy(() => import('./pages/connections/Connections.jsx'));
const Dashboard = lazy(() => import('./pages/dashboard/Dashboard.jsx'));
const Domains = lazy(() => import('./pages/domains/Domains.jsx'));
const Hackathons = lazy(() => import('./pages/hackathons/Hackathons.jsx'));
const Leaderboard = lazy(() => import('./pages/leaderboard/Leaderboard.jsx'));
const Messages = lazy(() => import('./pages/messages/Messages.jsx'));
const Notifications = lazy(() => import('./pages/notifications/Notifications.jsx'));
const Opportunities = lazy(() => import('./pages/opportunities/Opportunities.jsx'));
const Profile = lazy(() => import('./pages/profile/Profile.jsx'));
const ProjectsExplorer = lazy(() => import('./pages/projects/ProjectsExplorer.jsx'));
const ProjectCreate = lazy(() => import('./pages/projects/ProjectCreate.jsx'));
const ProjectDetail = lazy(() => import('./pages/projects/ProjectDetail.jsx'));
const VerifyRepository = lazy(() => import('./pages/projects/VerifyRepository.jsx'));
const Settings = lazy(() => import('./pages/settings/Settings.jsx'));
const Pyramidion = lazy(() => import('./pages/pyramidion/Pyramidion.jsx'));
const Requests = lazy(() => import('./pages/requests/Requests.jsx'));
const Search = lazy(() => import('./pages/search/Search.jsx'));
const SkillAnalytics = lazy(() => import('./pages/skill_analytics/SkillAnalytics.jsx'));
const Stats = lazy(() => import('./pages/stats/Stats.jsx'));
const TeamCreate = lazy(() => import('./pages/teams/TeamCreate.jsx'));
const TeamDetail = lazy(() => import('./pages/teams/TeamDetail.jsx'));
const Teams = lazy(() => import('./pages/teams/Teams.jsx'));
const Technologies = lazy(() => import('./pages/technologies/Technologies.jsx'));
const Updates = lazy(() => import('./pages/updates/Updates.jsx'));
const Research = lazy(() => import('./pages/research/Research.jsx'));
const ResearchDetail = lazy(() => import('./pages/research/ResearchDetail.jsx'));
const Admin = lazy(() => import('./pages/admin/Admin.jsx'));

function PageLoading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh] p-xl">
      <div className="flex flex-col items-center gap-md">
        <div
          className="w-8 h-8 rounded-full animate-spin"
          style={{
            border: '2px solid rgb(var(--color-surface-variant))',
            borderTopColor: 'rgb(var(--color-primary))',
          }}
        />
        <span className="font-body-sm" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>Loading...</span>
      </div>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Suspense fallback={<PageLoading />}><Dashboard /></Suspense>} />
            <Route path="domains" element={<Suspense fallback={<PageLoading />}><Domains /></Suspense>} />
            <Route path="teams" element={<Suspense fallback={<PageLoading />}><Teams /></Suspense>} />
            <Route path="teams/new" element={<Suspense fallback={<PageLoading />}><TeamCreate /></Suspense>} />
            <Route path="teams/:id" element={<Suspense fallback={<PageLoading />}><TeamDetail /></Suspense>} />
            <Route path="hackathons" element={<Suspense fallback={<PageLoading />}><Hackathons /></Suspense>} />
            <Route path="messages" element={<Suspense fallback={<PageLoading />}><Messages /></Suspense>} />
            <Route path="connections" element={<Suspense fallback={<PageLoading />}><Connections /></Suspense>} />
            <Route path="requests" element={<Suspense fallback={<PageLoading />}><Requests /></Suspense>} />
            <Route path="notifications" element={<Suspense fallback={<PageLoading />}><Notifications /></Suspense>} />
            <Route path="bookmarks" element={<Suspense fallback={<PageLoading />}><Bookmarks /></Suspense>} />
            <Route path="search" element={<Suspense fallback={<PageLoading />}><Search /></Suspense>} />
            <Route path="leaderboard" element={<Suspense fallback={<PageLoading />}><Leaderboard /></Suspense>} />
            <Route path="opportunities" element={<Suspense fallback={<PageLoading />}><Opportunities /></Suspense>} />
            <Route path="technologies" element={<Suspense fallback={<PageLoading />}><Technologies /></Suspense>} />
            <Route path="research" element={<Suspense fallback={<PageLoading />}><Research /></Suspense>} />
            <Route path="research/:id" element={<Suspense fallback={<PageLoading />}><ResearchDetail /></Suspense>} />
            <Route path="skills/top" element={<Suspense fallback={<PageLoading />}><SkillAnalytics /></Suspense>} />
            <Route path="stats" element={<Suspense fallback={<PageLoading />}><Stats /></Suspense>} />
            <Route path="updates" element={<Suspense fallback={<PageLoading />}><Updates /></Suspense>} />
            <Route path="admin" element={<Suspense fallback={<PageLoading />}><Admin /></Suspense>} />
            <Route path="pyramidion" element={<Suspense fallback={<PageLoading />}><Pyramidion /></Suspense>} />
            <Route path="profile" element={<Suspense fallback={<PageLoading />}><Profile /></Suspense>} />
            <Route path="profile/:id" element={<Suspense fallback={<PageLoading />}><Profile /></Suspense>} />
            <Route path="projects" element={<Suspense fallback={<PageLoading />}><ProjectsExplorer /></Suspense>} />
            <Route path="projects/new" element={<Suspense fallback={<PageLoading />}><ProjectCreate /></Suspense>} />
            <Route path="projects/:id" element={<Suspense fallback={<PageLoading />}><ProjectDetail /></Suspense>} />
            <Route path="verify/:id" element={<Suspense fallback={<PageLoading />}><VerifyRepository /></Suspense>} />
            <Route path="settings" element={<Suspense fallback={<PageLoading />}><Settings /></Suspense>} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Route>
      </Routes>
    </ErrorBoundary>
  );
}

export default App;
