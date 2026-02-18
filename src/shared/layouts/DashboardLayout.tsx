import { Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';
import { Button } from '@/shared/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { LogOut, Home } from 'lucide-react';

export function DashboardLayout() {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-16 items-center justify-between py-4 px-4 md:px-8">
                    <div className="flex items-center gap-4">
                        <h2 className="text-xl font-bold tracking-tight">Horizon</h2>
                        <nav className="flex gap-2">
                            <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')} className="gap-2">
                                <Home className="h-4 w-4" />
                                <span className="hidden sm:inline">Dashboard</span>
                            </Button>
                        </nav>
                    </div>

                    <div className="flex items-center gap-2 md:gap-4">
                        {user && (
                            <div className="flex items-center gap-3">
                                <div className="text-right hidden md:block">
                                    <p className="text-sm font-medium leading-none">{user.fullName}</p>
                                    <p className="text-xs text-muted-foreground mt-1 capitalize">{user.role.toLowerCase()}</p>
                                </div>
                                <Avatar className="h-8 w-8 md:h-9 md:w-9 border border-border">
                                    <AvatarImage src={user.avatarUrl} alt={user.fullName} />
                                    <AvatarFallback>{user.fullName.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout" className="text-muted-foreground hover:text-destructive">
                                    <LogOut className="h-5 w-5" />
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <main className="flex-1 container py-6 px-4 md:px-8">
                {user?.role === 'PLAYER' && (
                    <div className="mb-6 md:mb-8 p-4 md:p-6 bg-primary/5 rounded-xl border border-primary/10 flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 text-center sm:text-left">
                        <Avatar className="h-16 w-16 md:h-20 md:w-20 border-2 border-primary">
                            <AvatarImage src={user.avatarUrl} alt={user.fullName} />
                            <AvatarFallback className="text-xl md:text-2xl">{user.fullName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold">Welcome back, {user.fullName}!</h1>
                            <p className="text-muted-foreground mt-1">Ready for your next challenge?</p>
                        </div>
                    </div>
                )}
                <Outlet />
            </main>
        </div>
    );
}
