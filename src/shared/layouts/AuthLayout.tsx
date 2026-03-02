import { Outlet, useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowLeft } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

export function AuthLayout() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen relative flex items-center justify-center bg-background overflow-hidden p-4">
            {/* Back to Home Button */}
            <div className="absolute top-8 left-8 z-50">
                <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2 text-muted-foreground hover:text-foreground backdrop-blur-md bg-white/5 border border-white/5 rounded-full px-4 h-10"
                    onClick={() => navigate('/')}
                >
                    <ArrowLeft size={16} /> Back to Home
                </Button>
            </div>

            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
            </div>

            <div className="w-full max-w-md relative z-10">
                <div className="mb-8 flex flex-col items-center">
                    <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-primary/20">
                        <ShieldCheck className="text-primary-foreground w-7 h-7" />
                    </div>
                    <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
                        HORIZON TRUTH
                    </h1>
                    <p className="text-muted-foreground mt-2 font-medium">Secure Access Portal</p>
                </div>

                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-primary/0 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                    <div className="relative bg-card/50 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                        <Outlet />
                    </div>
                </div>

                <p className="mt-8 text-center text-xs text-muted-foreground">
                    &copy; 2026 Horizon Truth. Trust Protocol v2.0
                </p>
            </div>
        </div>
    );
}
