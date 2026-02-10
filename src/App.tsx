import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthLayout } from './components/layouts/AuthLayout';
import { DashboardLayout } from './components/layouts/DashboardLayout';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import { PrivateRoute } from './components/auth/PrivateRoute';
import { useAuthStore } from './store/auth.store';
import { LandingPage } from './pages/LandingPage';

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

        {/* Protected Routes */}
        <Route element={<PrivateRoute><DashboardLayout /></PrivateRoute>}>
          <Route path="/dashboard" element={
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {/* Dashboard content placeholder */}
              <div className="p-4 border rounded-lg bg-card text-card-foreground shadow-sm">
                <h3 className="font-semibold mb-2">My Games</h3>
                <p className="text-3xl font-bold">12</p>
              </div>
              <div className="p-4 border rounded-lg bg-card text-card-foreground shadow-sm">
                <h3 className="font-semibold mb-2">Achievements</h3>
                <p className="text-3xl font-bold">48</p>
              </div>
              <div className="p-4 border rounded-lg bg-card text-card-foreground shadow-sm">
                <h3 className="font-semibold mb-2">Global Rank</h3>
                <p className="text-3xl font-bold">#1,234</p>
              </div>
              <div className="p-4 border rounded-lg bg-card text-card-foreground shadow-sm">
                <h3 className="font-semibold mb-2">Tokens</h3>
                <p className="text-3xl font-bold">2,500</p>
              </div>
            </div>
          } />
        </Route>

        {/* Catch-all Redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;