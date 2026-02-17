import React from "react";
import {
    LayoutDashboard,
    Users,
    Building2,
    Trophy,
    Cpu,
    BarChart3,
    AlertTriangle,
    History,
    Lock,
    Menu,
    ChevronLeft,
    LogOut,
    User as UserIcon,
    ChevronDown
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/shared/lib/utils";
import { useAuthStore } from "@/store/auth.store";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { authService } from "@/services/auth.service";

const navigation = [
    { name: "Overview", icon: LayoutDashboard, href: "/dashboard", roles: ["SYSTEM_ADMIN", "ORG_ADMIN", "MODERATOR"] },
    { name: "Mission Ops", icon: LayoutDashboard, href: "/dashboard/game", roles: ["PLAYER"] },
    { name: "Organizations", icon: Building2, href: "/dashboard/organizations", roles: ["SYSTEM_ADMIN"] },
    { name: "User Directory", icon: Users, href: "/dashboard/users", roles: ["SYSTEM_ADMIN"] },
    { name: "Player Network", icon: Users, href: "/dashboard/players", roles: ["SYSTEM_ADMIN"] },
    { name: "Scenario Engine", icon: Cpu, href: "/dashboard/engine", roles: ["SYSTEM_ADMIN", "MODERATOR"] },
    { name: "Gamification", icon: Trophy, href: "/dashboard/gamification", roles: ["SYSTEM_ADMIN", "ORG_ADMIN", "MODERATOR", "PLAYER"] },
    { name: "Cloud Analytics", icon: BarChart3, href: "/dashboard/analytics", roles: ["SYSTEM_ADMIN", "ORG_ADMIN"] },
    { name: "Incident Log", icon: AlertTriangle, href: "/dashboard/incidents", roles: ["SYSTEM_ADMIN", "ORG_ADMIN", "MODERATOR"] },
    { name: "Audit Protocol", icon: History, href: "/dashboard/audit-logs", roles: ["SYSTEM_ADMIN", "ORG_ADMIN"] },
    { name: "Security Auth", icon: Lock, href: "/dashboard/auth", roles: ["SYSTEM_ADMIN", "ORG_ADMIN"] },
];

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
    const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false);
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        try {
            await authService.logout();
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            logout();
            navigate("/login");
        }
    };

    return (
        <div className="flex h-screen bg-background text-foreground">
            {/* Sidebar */}
            <aside
                className={cn(
                    "bg-card border-r transition-all duration-300 ease-in-out flex flex-col z-20",
                    isSidebarOpen ? "w-64" : "w-16"
                )}
            >
                <div className="flex items-center h-16 px-4 border-b justify-between">
                    {isSidebarOpen && (
                        <Link to="/" className="font-bold text-xl uppercase tracking-wider hover:opacity-80 transition-opacity">
                            Horizon
                        </Link>
                    )}
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-1 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                        {isSidebarOpen ? <ChevronLeft size={20} /> : <Menu size={20} />}
                    </button>
                </div>

                <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
                    {navigation
                        .filter(item => !item.roles || (user?.role && item.roles.includes(user.role)))
                        .map((item) => {
                            const isActive = location.pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className={cn(
                                        "flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors group",
                                        isActive
                                            ? "bg-primary text-primary-foreground"
                                            : "hover:bg-accent hover:text-accent-foreground",
                                        !isSidebarOpen && "justify-center"
                                    )}
                                >
                                    <item.icon
                                        className={cn(
                                            "flex-shrink-0 transition-all",
                                            isSidebarOpen ? "mr-3 h-5 w-5" : "h-6 w-6"
                                        )}
                                    />
                                    {isSidebarOpen && <span>{item.name}</span>}
                                    {isActive && isSidebarOpen && (
                                        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-foreground/50" />
                                    )}
                                </Link>
                            );
                        })}
                </nav>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden relative">
                <header className="h-16 bg-card border-b flex items-center justify-between px-8 z-10">
                    <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                        {navigation.find(n => location.pathname === n.href)?.name || "Dashboard"}
                    </h1>

                    <div className="relative">
                        <button
                            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                            className="flex items-center gap-3 p-1.5 pr-3 rounded-full hover:bg-accent transition-all group border border-transparent hover:border-border"
                        >
                            <Avatar className="h-8 w-8 border-2 border-primary/20">
                                <AvatarImage src={user?.avatarUrl} alt={user?.fullName || "User"} />
                                <AvatarFallback className="bg-primary/10 text-primary font-bold">
                                    {user?.fullName?.split(" ").map(n => n[0]).join("").toUpperCase() || "U"}
                                </AvatarFallback>
                            </Avatar>
                            <div className="hidden md:block text-left">
                                <p className="text-sm font-bold leading-none">{user?.fullName}</p>
                                <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter mt-1">{user?.role}</p>
                            </div>
                            <ChevronDown size={14} className={cn("text-muted-foreground transition-transform duration-200", isUserMenuOpen && "rotate-180")} />
                        </button>

                        {isUserMenuOpen && (
                            <>
                                <div
                                    className="fixed inset-0 z-10"
                                    onClick={() => setIsUserMenuOpen(false)}
                                />
                                <div className="absolute right-0 mt-2 w-56 bg-card border rounded-2xl shadow-2xl z-20 py-2 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                                    <div className="px-4 py-2 border-b mb-1">
                                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Account</p>
                                    </div>
                                    <Link
                                        to="/dashboard/profile"
                                        className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium hover:bg-accent transition-colors"
                                        onClick={() => setIsUserMenuOpen(false)}
                                    >
                                        <UserIcon size={16} className="text-muted-foreground" />
                                        <span>My Profile</span>
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/10 w-full transition-colors"
                                    >
                                        <LogOut size={16} />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </header>
                <main className="flex-1 overflow-y-auto p-8 bg-muted/20">
                    {children}
                </main>
            </div>
        </div>
    );
};
