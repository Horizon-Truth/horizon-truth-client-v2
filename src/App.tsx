import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { MainLayout } from "./shared/layouts/MainLayout";
import DashboardPage from "./modules/analytics/DashboardPage";
import LandingPage from "./modules/landing/LandingPage";
import { AuthLayout } from "./shared/layouts/AuthLayout";
import { LoginForm } from "./shared/components/auth/LoginForm";
import { RegisterForm } from "./shared/components/auth/RegisterForm";
import { PrivateRoute } from "./shared/components/auth/PrivateRoute";
import { useAuthStore } from "./store/auth.store";

function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Auth Routes */}
        <Route element={!isAuthenticated ? <AuthLayout /> : <Navigate to="/dashboard" />}>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
        </Route>

        {/* Protected Dashboard Routes */}
        <Route path="/dashboard/*" element={
          <PrivateRoute>
            <MainLayout>
              <Routes>
                <Route index element={<DashboardPage />} />
                <Route path="organizations" element={<div>Organizations Page</div>} />
                <Route path="users" element={<div>Users Page</div>} />
                <Route path="players" element={<div>Players Page</div>} />
                <Route path="gamification" element={<div>Gamification Page</div>} />
                <Route path="engine" element={<div>Engine Page</div>} />
                <Route path="analytics" element={<div>Analytics Page</div>} />
                <Route path="incidents" element={<div>Incidents Page</div>} />
                <Route path="audit-logs" element={<div>Audit Logs Page</div>} />
                <Route path="auth" element={<div>Auth Settings Page</div>} />
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