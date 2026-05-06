
import React from "react";
import {
    LayoutDashboard,
    Users,
    Building2,
    Cpu,
    FileText,
    Settings,
    AlertTriangle,
    Menu,
    ChevronLeft,
    LogOut,
    User as UserIcon,
    ChevronDown,
    MessageSquare,
    BookOpen,
    Megaphone,
    ShieldCheck,
    BarChart3
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDevice } from "@/shared/hooks/useDevice";
import { cn } from "@/shared/lib/utils";
import { useAuthStore } from "@/store/auth.store";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { ThemeToggle } from "@/shared/components/theme-toggle";
import { authService } from "@/services/auth.service";
import { Sheet, SheetContent, SheetTrigger } from "@/shared/components/ui/sheet";
import { Button } from "@/shared/components/ui/button";
import { Logo } from "@/shared/components/ui/logo";

const navigationGroups = [
    {
        title: "Operations",
        items: [
            { name: "Overview", icon: LayoutDashboard, href: "/dashboard", roles: ["SYSTEM_ADMIN", "ORG_ADMIN", "MODERATOR"] },
            { name: "Game Analytics", icon: BarChart3, href: "/dashboard/analytics", roles: ["SYSTEM_ADMIN", "ORG_ADMIN"] },
            { name: "Mission Ops", icon: LayoutDashboard, href: "/dashboard/game", roles: ["PLAYER"] },
            { name: "Submit Report", icon: AlertTriangle, href: "/crowdsourcing/submit", roles: ["PLAYER"] },
        ]
    },
    {
        title: "Accounts",
        items: [
            { name: "Organizations", icon: Building2, href: "/dashboard/organizations", roles: ["SYSTEM_ADMIN"] },
            { name: "User Directory", icon: Users, href: "/dashboard/users", roles: ["SYSTEM_ADMIN"] },
            // { name: "Player Network", icon: Users, href: "/dashboard/players", roles: ["SYSTEM_ADMIN"] },
            { name: "Avatar Manager", icon: Settings, href: "/dashboard/players/avatars", roles: ["SYSTEM_ADMIN"] },
        ]
    },
    {
        title: "Engine",
        items: [
            { name: "Scenario Engine", icon: Cpu, href: "/dashboard/engine", roles: ["SYSTEM_ADMIN", "MODERATOR"] },
            { name: "Feedback", icon: MessageSquare, href: "/dashboard/feedback", roles: ["SYSTEM_ADMIN"] },
        ]
    },
    {
        title: "Content",
        items: [
            { name: "Blogs", icon: FileText, href: "/dashboard/resources/blogs", roles: ["SYSTEM_ADMIN", "MODERATOR"] },
            { name: "Resources", icon: BookOpen, href: "/dashboard/resources/library", roles: ["SYSTEM_ADMIN", "MODERATOR"] },
            { name: "Contact Comms", icon: MessageSquare, href: "/dashboard/contacts", roles: ["SYSTEM_ADMIN"] },
            { name: "Newsletters", icon: Megaphone, href: "/dashboard/newsletter", roles: ["SYSTEM_ADMIN"] },
        ]
    },
    {
        title: "Reports & Safety",
        items: [
            { name: "Report Management", icon: FileText, href: "/dashboard/reports", roles: ["SYSTEM_ADMIN", "MODERATOR"] },
            { name: "Reporting Config", icon: Settings, href: "/dashboard/reports-config", roles: ["SYSTEM_ADMIN"] },
            { name: "Audit Logs", icon: ShieldCheck, href: "/dashboard/audit-logs", roles: ["SYSTEM_ADMIN"] },
        ]
    }
];

const navigation = navigationGroups.flatMap(g => g.items);

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
    const { isMobile, isLowEndDevice } = useDevice();
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(!isMobile);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false);
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();

    // Auto-close sidebar on mobile