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
    ChevronLeft
} from "lucide-react";
import { cn } from "@/shared/lib/utils";

const navigation = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
    { name: "Organizations", icon: Building2, href: "/dashboard/organizations" },
    { name: "Users", icon: Users, href: "/dashboard/users" },
    { name: "Players", icon: Users, href: "/dashboard/players" },
    { name: "Gamification", icon: Trophy, href: "/dashboard/gamification" },
    { name: "Engine", icon: Cpu, href: "/dashboard/engine" },
    { name: "Analytics", icon: BarChart3, href: "/dashboard/analytics" },
    { name: "Incidents", icon: AlertTriangle, href: "/dashboard/incidents" },
    { name: "Audit Logs", icon: History, href: "/dashboard/audit-logs" },
    { name: "Auth", icon: Lock, href: "/dashboard/auth" },
];

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

    return (
        <div className="flex h-screen bg-background text-foreground">
            {/* Sidebar */}
            <aside
                className={cn(
                    "bg-card border-r transition-all duration-300 ease-in-out flex flex-col",
                    isSidebarOpen ? "w-64" : "w-16"
                )}
            >
                <div className="flex items-center h-16 px-4 border-b justify-between">
                    {isSidebarOpen && (
                        <a href="/" className="font-bold text-xl uppercase tracking-wider hover:opacity-80 transition-opacity">
                            Horizon
                        </a>
                    )}
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-1 rounded-md hover:bg-accent hover:text-accent-foreground"
                    >
                        {isSidebarOpen ? <ChevronLeft size={20} /> : <Menu size={20} />}
                    </button>
                </div>

                <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
                    {navigation.map((item) => (
                        <a
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "flex items-center px-2 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground group",
                                !isSidebarOpen && "justify-center"
                            )}
                        >
                            <item.icon
                                className={cn(
                                    "flex-shrink-0",
                                    isSidebarOpen ? "mr-3 h-5 w-5" : "h-6 w-6"
                                )}
                            />
                            {isSidebarOpen && <span>{item.name}</span>}
                        </a>
                    ))}
                </nav>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="h-16 bg-card border-b flex items-center px-8">
                    <h1 className="text-xl font-semibold">Dashboard</h1>
                </header>
                <main className="flex-1 overflow-y-auto p-8">
                    {children}
                </main>
            </div>
        </div>
    );
};
