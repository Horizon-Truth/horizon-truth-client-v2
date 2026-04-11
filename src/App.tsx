import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./shared/components/theme-provider";
import { I18nProvider } from "./shared/i18n/I18nProvider";
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