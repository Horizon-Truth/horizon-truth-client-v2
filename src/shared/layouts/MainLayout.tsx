
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
    ShieldCheck
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

const navigationGroups = [
    {
        title: "Operations",
        items: [
            { name: "Overview", icon: LayoutDashboard, href: "/dashboard", roles: ["SYSTEM_ADMIN", "ORG_ADMIN", "MODERATOR"] },
            { name: "Mission Ops", icon: LayoutDashboard, href: "/dashboard/game", roles: ["PLAYER"] },
            { name: "Submit Report", icon: AlertTriangle, href: "/crowdsourcing/submit", roles: ["PLAYER"] },
        ]
    },
    {
        title: "Accounts",
        items: [
            { name: "Organizations", icon: Building2, href: "/dashboard/organizations", roles: ["SYSTEM_ADMIN"] },
            { name: "User Directory", icon: Users, href: "/dashboard/users", roles: ["SYSTEM_ADMIN"] },
            { name: "Player Network", icon: Users, href: "/dashboard/players", roles: ["SYSTEM_ADMIN"] },
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
            { name: "Newsletter Base", icon: Megaphone, href: "/dashboard/newsletter", roles: ["SYSTEM_ADMIN"] },
        ]
    },
    {
        title: "Reports & Safety",
        items: [
            { name: "Report Management", icon: FileText, href: "/dashboard/reports", roles: ["SYSTEM_ADMIN", "MODERATOR"] },
            { name: "Reporting Config", icon: Settings, href: "/dashboard/reports-config", roles: ["SYSTEM_ADMIN"] },
            { name: "Audit Log Base", icon: ShieldCheck, href: "/dashboard/audit-logs", roles: ["SYSTEM_ADMIN"] },
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
    React.useEffect(() => {
        if (isMobile) {
            setIsSidebarOpen(false);
        } else {
            setIsSidebarOpen(true);
        }
    }, [isMobile]);

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

    const NavContent = ({ mobile = false, onSelect }: { mobile?: boolean, onSelect?: () => void }) => (
        <div className="flex flex-col h-full">
            <div className={cn("flex items-center h-16 px-4 border-b justify-between", mobile && "px-6")}>
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform flex-shrink-0">
                        <ShieldCheck className="text-primary-foreground h-5 w-5" />
                    </div>
                    {(isSidebarOpen || mobile) && (
                        <span className="font-bold text-xl uppercase tracking-widest hover:opacity-80 transition-opacity">
                            Horizon
                        </span>
                    )}
                </Link>
                {!mobile && (
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-1 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                        {isSidebarOpen ? <ChevronLeft size={20} /> : <Menu size={20} />}
                    </button>
                )}
            </div>

            <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-4">
                {navigationGroups.map((group) => {
                    const groupItems = group.items.filter(item => {
                        if (!item.roles) return true;
                        if (item.roles.includes("GUEST")) return true;
                        return user?.role && item.roles.includes(user.role);
                    });

                    if (groupItems.length === 0) return null;

                    return (
                        <div key={group.title} className="space-y-1">
                            {/* Group Header */}
                            {(isSidebarOpen || mobile) && (
                                <p className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 mb-2 mt-4">
                                    {group.title}
                                </p>
                            )}

                            {/* Group Items */}
                            {groupItems.map((item) => {
                                const isActive = location.pathname === item.href;
                                return (
                                    <Link
                                        key={item.name}
                                        to={item.href}
                                        onClick={onSelect}
                                        className={cn(
                                            "flex items-center px-2 py-2.5 text-sm font-medium rounded-md transition-colors group relative",
                                            isActive
                                                ? "bg-primary text-primary-foreground"
                                                : "hover:bg-accent hover:text-accent-foreground",
                                            !isSidebarOpen && !mobile && "justify-center"
                                        )}
                                    >
                                        <item.icon
                                            className={cn(
                                                "flex-shrink-0 transition-all",
                                                isSidebarOpen || mobile ? "mr-3 h-5 w-5" : "h-6 w-6"
                                            )}
                                        />
                                        {(isSidebarOpen || mobile) && <span>{item.name}</span>}
                                        
                                        {isActive && (isSidebarOpen || mobile) && (
                                            <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-foreground/50" />
                                        )}
                                        {/* Show tooltip-like title when collapsed */}
                                        {!isSidebarOpen && !mobile && (
                                            <span className="absolute left-14 opacity-0 group-hover:opacity-100 bg-black/90 text-white text-xs px-2 py-1 rounded pointer-events-none transition-opacity font-bold whitespace-nowrap z-50">
                                                {item.name}
                                            </span>
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    );
                })}
            </nav>
        </div>
    );

    return (
        <div className="flex vh-height bg-background text-foreground overflow-hidden">
            {/* Desktop Sidebar */}
            <aside
                className={cn(
                    "bg-card border-r hidden md:flex flex-col z-20",
                    !isLowEndDevice && "transition-all duration-300 ease-in-out",
                    isSidebarOpen ? "w-64" : "w-16"
                )}
            >
                <NavContent />
            </aside>

            {/* Mobile Sidebar (Sheet) */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-hidden relative w-full">
                    <header className="h-16 bg-card border-b flex items-center justify-between px-4 md:px-8 z-10 sticky top-0">
                        <div className="flex items-center gap-4">
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="md:hidden">
                                    <Menu size={20} />
                                </Button>
                            </SheetTrigger>
                            <h1 className="text-lg md:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 truncate max-w-[150px] sm:max-w-[300px] md:max-w-none">
                                {navigation.find(n => location.pathname === n.href)?.name || "Dashboard"}
                            </h1>
                        </div>

                        <div className="flex items-center gap-2 md:gap-4 relative">
                            <ThemeToggle />
                            <button
                                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                className="flex items-center gap-2 md:gap-3 p-1 md:p-1.5 md:pr-3 rounded-full hover:bg-accent transition-all group border border-transparent hover:border-border"
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
                                <ChevronDown size={14} className={cn("text-muted-foreground transition-transform duration-200 hidden md:block", isUserMenuOpen && "rotate-180")} />
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
                                            <p className="md:hidden text-sm font-medium mt-1">{user?.fullName}</p>
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
                    <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-muted/20 w-full animate-in fade-in duration-500">
                        {children}
                    </main>
                </div>

                <SheetContent side="left" className="p-0 w-72">
                    <NavContent mobile onSelect={() => setIsMobileMenuOpen(false)} />
                </SheetContent>
            </Sheet>
        </div>
    );
};
