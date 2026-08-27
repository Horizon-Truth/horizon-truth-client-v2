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
import { Lock, User as UserIcon, LogIn, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from '@/shared/i18n/useTranslation';

const loginSchema = z.object({
    email: z.string().min(3, { message: 'Enter a valid email or username' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

export function LoginForm({ onSuccess }: { onSuccess?: () => void }) {
    const navigate = useNavigate();
    const { setAuth, loading, setLoading, error, setError } = useAuthStore();
    const { t } = useTranslation();

    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    async function onSubmit(values: z.infer<typeof loginSchema>) {
        setLoading(true);
        setError(null);
        try {
            const data = await authService.login(values);
            setAuth(data.user, data.access_token);
            toast.success(t('auth.welcomeToast'));
            if (onSuccess) {
                onSuccess();
            } else {
                navigate(data.user.role === 'PLAYER' ? '/dashboard/game' : '/dashboard');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || t('auth.loginFailed'));
            toast.error(t('auth.authFailedToast'));
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="relative p-8 md:p-12 overflow-hidden">
            {/* Background Accents */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-8">
                <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-2">
                        <Sparkles size={14} /> {t('auth.loginBadge')}
                    </div>
                    <h2 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                        {t('auth.loginTitle')}
                    </h2>
                    <p className="text-muted-foreground">{t('auth.loginDashboard')}</p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" aria-label="Login form">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60 flex items-center gap-2 px-1">
                                        <UserIcon size={12} /> {t('auth.emailOrUsername')}
                                    </FormLabel>
                                    <FormControl>
                                        <div className="group relative">
                                            <Input
                                                placeholder={t('auth.emailOrUsernamePlaceholder')}
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
                                            <Lock size={12} /> {t('auth.password')}
                                        </FormLabel>
                                        <button type="button" className="text-[10px] font-bold text-primary hover:underline">{t('auth.forgot')}</button>
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
                            <div className="p-4 rounded-2xl bg-destructive/5 border border-destructive/10 animate-in fade-in slide-in-from-top-1" role="alert" aria-live="assertive">
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
                                        {t('auth.authenticating')}
                                    </div>
                                ) : (
                                    <span className="flex items-center justify-center gap-2">
                                        {t('auth.signIn')} <LogIn size={18} className="group-hover:translate-x-1 transition-transform" />
                                    </span>
                                )}
                            </Button>
                        </div>
                    </form>
                </Form>

                <div className="pt-8 border-t border-border/50 text-center">
                    <p className="text-sm text-muted-foreground font-medium">
                        {t('auth.noAccount')}{' '}
                        <button
                            onClick={() => navigate('/register')}
                            className="font-black text-primary hover:text-primary/80 transition-colors inline-flex items-center gap-1 group"
                        >
                            {t('auth.createOne')} <Sparkles size={14} className="group-hover:scale-125 transition-transform" />
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}
