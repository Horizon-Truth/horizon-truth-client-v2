import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./shared/components/theme-provider";
import { MainLayout } from "./shared/layouts/MainLayout";
import DashboardPage from "./modules/analytics/DashboardPage";
import SystemHealthPage from "./modules/analytics/SystemHealthPage";
import LandingPage from "./modules/landing/LandingPage";
import AboutPage from "./modules/about/AboutPage";
import BlogResourcePage from "./modules/resources/BlogResourcePage";
import ResourceLibraryPage from "./modules/resources/ResourceLibraryPage";
import BlogDetailPage from "./modules/resources/BlogDetailPage";
import ResourceDetailPage from "./modules/resources/ResourceDetailPage";
import FaqPage from "./modules/faq/FaqPage";
import ContactPage from "./modules/contact/ContactPage";
import PrivacyPolicyPage from "./modules/legal/PrivacyPolicyPage";
import TermsOfServicePage from "./modules/legal/TermsOfServicePage";
import CookiesPolicyPage from "./modules/legal/CookiesPolicyPage";
import CrowdsourcingListingPage from "./modules/reports/CrowdsourcingListingPage";
import CrowdsourcingDetailPage from "./modules/reports/CrowdsourcingDetailPage";
import ReportSubmissionPage from "./modules/reports/ReportSubmissionPage";
import { AuthLayout } from "./shared/layouts/AuthLayout";
import { ScrollToTop } from "./shared/components/layout/ScrollToTop";
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
import OrganizationDetailPage from "./modules/organizations/pages/OrganizationDetailPage";
import PlayerManagementPage from "./modules/players/pages/PlayerManagementPage";
import FeedbackDashboardPage from "./modules/engine/pages/FeedbackDashboardPage";
import ReportingConfigPage from "./modules/reports/pages/ReportingConfigPage";
import ScenarioDetailPage from "./modules/engine/pages/ScenarioDetailPage";
import OnboardingPage from "./modules/players/pages/OnboardingPage";
import AvatarManagementPage from "./modules/players/pages/AvatarManagementPage";
import ReportAdminManagementPage from "./modules/reports/pages/ReportAdminManagementPage";
import ReportAdminDetailPage from "./modules/reports/pages/ReportAdminDetailPage";
import ContactSubmissionsPage from "./modules/admin/pages/ContactSubmissionsPage";
import NewsletterSubscriptionsPage from "./modules/admin/pages/NewsletterSubscriptionsPage";
import GuestGamePage from "@/modules/simulation/GuestGamePage";
import AuditLogPage from "./modules/admin/pages/AuditLogPage";
import GameAnalyticsPage from "./modules/analytics/GameAnalyticsPage";
import { Toaster, toast } from "sonner";
import { lazy, Suspense, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ErrorBoundary } from "./shared/components/layout/ErrorBoundary";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const BlogManagementPage = lazy(() => import('./modules/resources/admin/BlogManagementPage'));
const BlogCreatePage = lazy(() => import('./modules/resources/admin/BlogCreatePage'));
const BlogEditPage = lazy(() => import('./modules/resources/admin/BlogEditPage'));
const ResourceManagementPage = lazy(() => import('./modules/resources/admin/ResourceManagementPage'));
const ResourceCreatePage = lazy(() => import('./modules/resources/admin/ResourceCreatePage'));
const ResourceEditPage = lazy(() => import('./modules/resources/admin/ResourceEditPage'));

function App() {
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    const handleOnline = () => {
      toast.success("Network connection restored. You are back online.", {
        icon: "🔌",
        duration: 4000,
      });
    };
    const handleOffline = () => {
      toast.error("Network connection lost. Changes will be saved locally when possible.", {
        icon: "📡",
        duration: 5000,
      });
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
        <ScrollToTop />
        <Toaster position="top-center" richColors />
        <ErrorBoundary>
          <Routes>
            {/* Public Landing Page */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/resources" element={<BlogResourcePage />} />
            <Route path="/resources/library" element={<ResourceLibraryPage />} />
            <Route path="/blog/:id" element={<BlogDetailPage />} />
            <Route path="/resource/:id" element={<ResourceDetailPage />} />
            <Route path="/faq" element={<FaqPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/terms-of-service" element={<TermsOfServicePage />} />
            <Route path="/cookies-policy" element={<CookiesPolicyPage />} />
            <Route path="/crowdsourcing" element={<CrowdsourcingListingPage />} />
            <Route path="/crowdsourcing/submit" element={<ReportSubmissionPage />} />
            <Route path="/crowdsourcing/:id" element={<CrowdsourcingDetailPage />} />

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
            <Route path="/guest" element={<GuestGamePage />} />

            {/* Protected Dashboard Routes */}
            <Route path="/dashboard/*" element={
              <PrivateRoute>
                <Suspense fallback={<div className="flex items-center justify-center h-full"><div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" /></div>}>
                  <Routes>
                    <Route path="game" element={<GamePage />} />
                    <Route path="*" element={
                      <MainLayout>
                        <Routes>
                          <Route index element={
                            user?.role === 'PLAYER'
                              ? (user?.onboardingCompleted ? <Navigate to="/dashboard/game" replace /> : <Navigate to="/onboarding" replace />)
                              : <DashboardPage />
                          } />
                          <Route path="organizations" element={user?.role === 'SYSTEM_ADMIN' ? <OrganizationManagementPage /> : <Navigate to="/dashboard" replace />} />
                          <Route path="organizations/:id" element={user?.role === 'SYSTEM_ADMIN' ? <OrganizationDetailPage /> : <Navigate to="/dashboard" replace />} />
                          <Route path="users" element={user?.role === 'SYSTEM_ADMIN' ? <UserManagementPage /> : <Navigate to="/dashboard" replace />} />
                          <Route path="players" element={user?.role === 'SYSTEM_ADMIN' ? <PlayerManagementPage /> : <Navigate to="/dashboard" replace />} />
                          <Route path="players/avatars" element={user?.role === 'SYSTEM_ADMIN' ? <AvatarManagementPage /> : <Navigate to="/dashboard" replace />} />
                          <Route path="resources/blogs" element={<BlogManagementPage />} />
                          <Route path="resources/blogs/create" element={<BlogCreatePage />} />
                          <Route path="resources/blogs/edit/:id" element={<BlogEditPage />} />
                          <Route path="resources/library" element={<ResourceManagementPage />} />
                          <Route path="resources/library/create" element={<ResourceCreatePage />} />
                          <Route path="resources/library/edit/:id" element={<ResourceEditPage />} />
                          <Route path="gamification" element={<div>Gamification Page</div>} />
                          <Route path="engine" element={user?.role !== 'PLAYER' ? <ScenarioManagementPage /> : <Navigate to="/dashboard/game" replace />} />
                          <Route path="engine/:id" element={user?.role !== 'PLAYER' ? <ScenarioDetailPage /> : <Navigate to="/dashboard/game" replace />} />
                          <Route path="analytics" element={user?.role !== 'PLAYER' ? <GameAnalyticsPage /> : <Navigate to="/dashboard/game" replace />} />
                          <Route path="health" element={user?.role === 'SYSTEM_ADMIN' ? <SystemHealthPage /> : <Navigate to="/dashboard" replace />} />
                          <Route path="incidents" element={user?.role !== 'PLAYER' ? <div>Incidents Page</div> : <Navigate to="/dashboard/game" replace />} />
                          <Route path="auth" element={user?.role !== 'PLAYER' ? <div>Auth Settings Page</div> : <Navigate to="/dashboard/game" replace />} />
                          <Route path="profile" element={<ProfilePage />} />
                          <Route path="simulation" element={<SimulationPage />} />
                          <Route path="feedback" element={user?.role !== 'PLAYER' ? <FeedbackDashboardPage /> : <Navigate to="/dashboard/game" replace />} />
                          <Route path="reports" element={user?.role !== 'PLAYER' ? <ReportAdminManagementPage /> : <Navigate to="/crowdsourcing/submit" replace />} />
                          <Route path="reports/:id" element={user?.role !== 'PLAYER' ? <ReportAdminDetailPage /> : <Navigate to="/dashboard/reports" replace />} />
                          <Route path="reports-config" element={user?.role !== 'PLAYER' ? <ReportingConfigPage /> : <Navigate to="/dashboard/game" replace />} />
                          <Route path="contacts" element={user?.role === 'SYSTEM_ADMIN' ? <ContactSubmissionsPage /> : <Navigate to="/dashboard" replace />} />
                          <Route path="newsletter" element={user?.role === 'SYSTEM_ADMIN' ? <NewsletterSubscriptionsPage /> : <Navigate to="/dashboard" replace />} />
                          <Route path="audit-logs" element={user?.role === 'SYSTEM_ADMIN' ? <AuditLogPage /> : <Navigate to="/dashboard" replace />} />
                          <Route path="*" element={<div className="flex items-center justify-center h-full text-muted-foreground">Page coming soon...</div>} />
                        </Routes>
                      </MainLayout>
                    } />
                  </Routes>
                </Suspense>
              </PrivateRoute>
            } />

            {/* Catch-all Redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ErrorBoundary>
      </BrowserRouter>
    </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;