import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/shared/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/store/auth.store';
import { GuestSessionManager } from '@/shared/utils/guest-session';
import { Phone, Lock, User as UserIcon, LogIn, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

const loginSchema = z.object({
    phone: z.string().min(10, { message: 'Enter a valid phone number' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

export function LoginForm({ onSuccess }: { onSuccess?: () => void }) {
    const navigate = useNavigate();
    const { setAuth, setGuest, loading, setLoading, error, setError } = useAuthStore();

    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            phone: '',
            password: '',
        },
    });

    async function onSubmit(values: z.infer<typeof loginSchema>) {
        setLoading(true);
        setError(null);
        try {
            const data = await authService.login(values);
            setAuth(data.user, data.access_token);
            toast.success('Welcome back!');
            if (onSuccess) {
                onSuccess();
            } else {
                navigate(data.user.role === 'PLAYER' ? '/dashboard/game' : '/dashboard');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
            toast.error('Authentication failed');
        } finally {
            setLoading(false);
        }
    }

    const handleGuestLogin = async () => {
        setLoading(true);
        try {
            const { sessionId, userId } = GuestSessionManager.createSession();
            await authService.initGuestSession(sessionId, userId);
            setGuest(true);
            toast.success('Continuing as Guest');
            navigate('/simulation');
        } catch (err: any) {
            toast.error('Failed to initialize guest session');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative p-8 md:p-12 overflow-hidden">
            {/* Background Accents */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-8">
                <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-2">
                        <Sparkles size={14} /> Next-Gen Trust Protocol
                    </div>
                    <h2 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                        Welcome Back
                    </h2>
                    <p className="text-muted-foreground">Access your decentralized verification dashboard</p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60 flex items-center gap-2 px-1">
                                        <Phone size={12} /> Phone Number
                                    </FormLabel>
                                    <FormControl>
                                        <div className="group relative">
                                            <Input
                                                placeholder="+1 (555) 000-0000"
                                                className="bg-background/50 backdrop-blur-sm border-input group-focus-within:border-primary/50 group-focus-within:ring-4 group-focus-within:ring-primary/5 h-12 rounded-2xl transition-all duration-300 pl-4"
                                                {...field}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage className="text-[10px] font-bold" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="flex items-center justify-between px-1">
                                        <FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60 flex items-center gap-2">
                                            <Lock size={12} /> Password
                                        </FormLabel>
                                        <button type="button" className="text-[10px] font-bold text-primary hover:underline">Forgot?</button>
                                    </div>
                                    <FormControl>
                                        <div className="group relative">
                                            <Input
                                                type="password"
                                                placeholder="••••••••"
                                                className="bg-background/50 backdrop-blur-sm border-input group-focus-within:border-primary/50 group-focus-within:ring-4 group-focus-within:ring-primary/5 h-12 rounded-2xl transition-all duration-300 pl-4"
                                                {...field}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage className="text-[10px] font-bold" />
                                </FormItem>
                            )}
                        />

                        {error && (
                            <div className="p-4 rounded-2xl bg-destructive/5 border border-destructive/10 animate-in fade-in slide-in-from-top-1">
                                <p className="text-xs font-bold text-destructive flex items-center gap-2">
                                    <LogIn size={14} /> {error}
                                </p>
                            </div>
                        )}

                        <div className="space-y-3 pt-2">
                            <Button
                                type="submit"
                                className="w-full h-12 rounded-2xl font-black uppercase tracking-widest bg-primary text-primary-foreground hover:shadow-2xl hover:shadow-primary/30 transition-all duration-300 active:scale-[0.97] group"
                                disabled={loading}
                            >
                                {loading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Authenticating...
                                    </div>
                                ) : (
                                    <span className="flex items-center justify-center gap-2">
                                        Sign In <LogIn size={18} className="group-hover:translate-x-1 transition-transform" />
                                    </span>
                                )}
                            </Button>

                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleGuestLogin}
                                className="w-full h-12 rounded-2xl font-bold border-input/50 border-2 hover:bg-secondary transition-all"
                                disabled={loading}
                            >
                                <UserIcon size={18} className="mr-2 opacity-70" /> Continue as Guest
                            </Button>
                        </div>
                    </form>
                </Form>

                <div className="pt-8 border-t border-border/50 text-center">
                    <p className="text-sm text-muted-foreground font-medium">
                        Don't have an account?{' '}
                        <button
                            onClick={() => navigate('/register')}
                            className="font-black text-primary hover:text-primary/80 transition-colors inline-flex items-center gap-1 group"
                        >
                            Create One <Sparkles size={14} className="group-hover:scale-125 transition-transform" />
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}
