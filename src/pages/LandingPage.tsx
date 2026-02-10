import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/auth.store';
import { Navigate } from 'react-router-dom';

export function LandingPage() {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuthStore();

    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
            <div className="max-w-3xl w-full text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="space-y-4">
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
                        Horizon <span className="text-primary">Gaming</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-muted-foreground">
                        The next generation of competitive gaming and social interaction.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Button
                        size="lg"
                        className="w-full sm:w-auto text-lg px-8 py-6 h-auto"
                        onClick={() => navigate('/login')}
                    >
                        Login to Account
                    </Button>
                    <Button
                        variant="outline"
                        size="lg"
                        className="w-full sm:w-auto text-lg px-8 py-6 h-auto"
                        onClick={() => navigate('/register')}
                    >
                        Join the Community
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
                    <div className="p-6 border rounded-2xl bg-card hover:border-primary/50 transition-colors">
                        <h3 className="font-bold text-xl mb-2">Compete</h3>
                        <p className="text-muted-foreground text-sm">Join tournaments and prove your skills against the best.</p>
                    </div>
                    <div className="p-6 border rounded-2xl bg-card hover:border-primary/50 transition-colors">
                        <h3 className="font-bold text-xl mb-2">Connect</h3>
                        <p className="text-muted-foreground text-sm">Build your team and interact with other players worldwide.</p>
                    </div>
                    <div className="p-6 border rounded-2xl bg-card hover:border-primary/50 transition-colors">
                        <h3 className="font-bold text-xl mb-2">Earn</h3>
                        <p className="text-muted-foreground text-sm">Get rewards for your achievements and climb the rankings.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
