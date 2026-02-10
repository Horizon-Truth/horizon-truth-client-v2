import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "./shared/layouts/MainLayout";
import DashboardPage from "./modules/analytics/DashboardPage";
import LandingPage from "./modules/landing/LandingPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard/*" element={
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
        } />
        <Route path="*" element={<LandingPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;