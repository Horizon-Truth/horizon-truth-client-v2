import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { MainLayout } from "./shared/layouts/MainLayout";
import DashboardPage from "./modules/analytics/DashboardPage";
import LandingPage from "./modules/landing/LandingPage";
import { AuthLayout } from "./shared/layouts/AuthLayout";
import { LoginForm } from "./shared/components/auth/LoginForm";
import { RegisterForm } from "./shared/components/auth/RegisterForm";
import { PrivateRoute } from "./shared/components/auth/PrivateRoute";
import { useAuthStore } from "./store/auth.store";
import ProfilePage from "./modules/profile/ProfilePage";
import SimulationPage from "./modules/simulation/SimulationPage";
import GamePage from "./modules/simulation/GamePage";
import ScenarioManagementPage from "./modules/engine/pages/ScenarioManagementPage";
import UserManagementPage from "./modules/users/pages/UserManagementPage";
import OrganizationManagementPage from "./modules/organizations/pages/OrganizationManagementPage";
import PlayerManagementPage from "./modules/players/pages/PlayerManagementPage";
import FeedbackDashboardPage from "./modules/engine/pages/FeedbackDashboardPage";
import ReportsPage from "./modules/reports/ReportsPage";
import ReportingConfigPage from "./modules/reports/pages/ReportingConfigPage";
import OnboardingPage from "./modules/players/pages/OnboardingPage";

function App() {
  const { isAuthenticated, user } = useAuthStore();

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Auth Routes */}
        <Route element={!isAuthenticated ? <AuthLayout /> : <Navigate to={user?.role === 'PLAYER' ? (user?.onboardingCompleted ? "/dashboard/game" : "/onboarding") : "/dashboard"} replace />}>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
        </Route>

        <Route path="/onboarding" element={
          <PrivateRoute>
            {user?.onboardingCompleted ? <Navigate to="/dashboard/game" replace /> : <OnboardingPage />}
          </PrivateRoute>
        } />

        {/* Public Simulation (Guest Mode) */}
        <Route path="/simulation" element={<SimulationPage />} />
        <Route path="/report" element={<ReportsPage />} />

        {/* Protected Dashboard Routes */}
        <Route path="/dashboard/*" element={
          <PrivateRoute>
            <MainLayout>
              <Routes>
                <Route index element={
                  user?.role === 'PLAYER'
                    ? (user?.onboardingCompleted ? <Navigate to="/dashboard/game" replace /> : <Navigate to="/onboarding" replace />)
                    : <DashboardPage />
                } />
                <Route path="organizations" element={user?.role === 'SYSTEM_ADMIN' ? <OrganizationManagementPage /> : <Navigate to="/dashboard" replace />} />
                <Route path="users" element={user?.role === 'SYSTEM_ADMIN' ? <UserManagementPage /> : <Navigate to="/dashboard" replace />} />
                <Route path="players" element={user?.role === 'SYSTEM_ADMIN' ? <PlayerManagementPage /> : <Navigate to="/dashboard" replace />} />
                <Route path="gamification" element={<div>Gamification Page</div>} />
                <Route path="engine" element={user?.role !== 'PLAYER' ? <ScenarioManagementPage /> : <Navigate to="/dashboard/game" replace />} />
                <Route path="analytics" element={user?.role !== 'PLAYER' ? <div>Analytics Page</div> : <Navigate to="/dashboard/game" replace />} />
                <Route path="incidents" element={user?.role !== 'PLAYER' ? <div>Incidents Page</div> : <Navigate to="/dashboard/game" replace />} />
                <Route path="audit-logs" element={user?.role !== 'PLAYER' ? <div>Audit Logs Page</div> : <Navigate to="/dashboard/game" replace />} />
                <Route path="auth" element={user?.role !== 'PLAYER' ? <div>Auth Settings Page</div> : <Navigate to="/dashboard/game" replace />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="simulation" element={<SimulationPage />} />
                <Route path="game" element={<GamePage />} />
                <Route path="feedback" element={user?.role !== 'PLAYER' ? <FeedbackDashboardPage /> : <Navigate to="/dashboard/game" replace />} />
                <Route path="reports" element={user?.role !== 'PLAYER' ? <div>Reports Admin Page</div> : <ReportsPage />} />
                <Route path="reports-config" element={user?.role !== 'PLAYER' ? <ReportingConfigPage /> : <Navigate to="/dashboard/game" replace />} />
                <Route path="*" element={<div className="flex items-center justify-center h-full text-muted-foreground">Page coming soon...</div>} />
              </Routes>
            </MainLayout>
          </PrivateRoute>
        } />

        {/* Catch-all Redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;