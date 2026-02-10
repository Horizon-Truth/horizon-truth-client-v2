import { Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut } from 'lucide-react';

export function DashboardLayout() {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen flex flex-col">
            <header className="sticky top-0 z-40 border-b bg-background">
                <div className="container flex h-16 items-center justify-between py-4">
                    <div className="flex items-center gap-4">
                        <h2 className="text-xl font-bold">Horizon</h2>
                        <nav className="hidden md:flex gap-6">
                            <Button variant="ghost" onClick={() => navigate('/dashboard')}>Dashboard</Button>
                        </nav>
                    </div>

                    <div className="flex items-center gap-4">
                        {user && (
                            <div className="flex items-center gap-3">
                                <div className="text-right hidden sm:block">
                                    <p className="text-sm font-medium leading-none">{user.fullName}</p>
                                    <p className="text-xs text-muted-foreground mt-1 capitalize">{user.role.toLowerCase()}</p>
                                </div>
                                <Avatar>
                                    <AvatarImage src={user.avatarUrl} alt={user.fullName} />
                                    <AvatarFallback>{user.fullName.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout">
                                    <LogOut className="h-5 w-5" />
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <main className="flex-1 container py-6">
                {user?.role === 'PLAYER' && (
                    <div className="mb-8 p-6 bg-primary/5 rounded-xl border border-primary/10 flex items-center gap-6">
                        <Avatar className="h-20 w-20 border-2 border-primary">
                            <AvatarImage src={user.avatarUrl} alt={user.fullName} />
                            <AvatarFallback className="text-2xl">{user.fullName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <h1 className="text-3xl font-bold">Welcome back, {user.fullName}!</h1>
                            <p className="text-muted-foreground mt-1">Ready for your next challenge?</p>
                        </div>
                    </div>
                )}
                <Outlet />
            </main>
        </div>
    );
}
