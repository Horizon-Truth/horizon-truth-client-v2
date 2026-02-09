import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "./shared/layouts/MainLayout";
import DashboardPage from "./modules/analytics/DashboardPage";

function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          {/* Add more routes as we build module pages */}
          <Route path="*" element={<div className="flex items-center justify-center h-full text-muted-foreground">Page coming soon...</div>} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

export default App;
