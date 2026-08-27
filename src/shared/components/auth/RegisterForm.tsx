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
import { User, Lock, AtSign, Sparkles, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

const registerSchema = z.object({
    fullName: z.string().min(2, { message: 'Full name must be at least 2 characters' }),
    username: z.string().min(3, { message: 'Username must be at least 3 characters' }),
    email: z.string().email({ message: 'Enter a valid email address' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
    confirmPassword: z.string(),
    consent: z.boolean().refine(val => val === true, {
        message: "You must agree to the privacy policy to continue",
    }),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

export function RegisterForm({ onSuccess }: { onSuccess?: () => void }) {
    const navigate = useNavigate();
    const { setAuth, loading, setLoading, error, setError } = useAuthStore();

    const form = useForm<z.infer<typeof registerSchema>>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            fullName: '',
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
            consent: false,
        },
    });

    async function onSubmit(values: z.infer<typeof registerSchema>) {
        setLoading(true);
        setError(null);
        try {
            const data = await authService.register({
                ...values,
                role: 'PLAYER' // Default role for new registrations
            });
            setAuth(data.user, data.access_token);
            toast.success('Account created! Welcome to Horizon.');
            if (onSuccess) {
                onSuccess();
            } else {
                navigate('/onboarding');
            }
        } catch (err: any) {
            const msg = err.response?.data?.message || 'Registration failed. Please try again.';
            setError(msg);
            toast.error(msg);
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
                        <Sparkles size={14} /> Join the Investigation
                    </div>
                    <h2 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                        Create Account
                    </h2>
                    <p className="text-muted-foreground">Start your journey as a truth seeking investigator</p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" aria-label="Registration form">
                        <FormField
                            control={form.control}
                            name="fullName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60 flex items-center gap-2 px-1">
                                        <User size={12} /> Full Name
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="John Doe"
                                            className="bg-background/50 backdrop-blur-sm border-input focus-visible:ring-primary/5 h-12 rounded-2xl transition-all pl-4"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-[10px] font-bold" />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60 flex items-center gap-2 px-1">
                                            <AtSign size={12} /> Username
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="investigator_01"
                                                className="bg-background/50 backdrop-blur-sm border-input focus-visible:ring-primary/5 h-12 rounded-2xl transition-all pl-4 text-sm"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-[10px] font-bold" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60 flex items-center gap-2 px-1">
                                            <AtSign size={12} /> Email
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="john@example.com"
                                                className="bg-background/50 backdrop-blur-sm border-input focus-visible:ring-primary/5 h-12 rounded-2xl transition-all pl-4 text-sm"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-[10px] font-bold" />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-2">
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60 flex items-center gap-2 px-1">
                                            <Lock size={12} /> Password
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                placeholder="••••••••"
                                                className="bg-background/50 backdrop-blur-sm border-input focus-visible:ring-primary/5 h-12 rounded-2xl transition-all pl-4 text-sm"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-[10px] font-bold" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60 flex items-center gap-2 px-1">
                                            <Lock size={12} /> Confirm
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                placeholder="••••••••"
                                                className="bg-background/50 backdrop-blur-sm border-input focus-visible:ring-primary/5 h-12 rounded-2xl transition-all pl-4 text-sm"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-[10px] font-bold" />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {error && (
                            <div className="p-4 rounded-2xl bg-destructive/5 border border-destructive/10 animate-in fade-in slide-in-from-top-1 my-4" role="alert" aria-live="assertive">
                                <p className="text-xs font-bold text-destructive">
                                    {error}
                                </p>
                            </div>
                        )}

                        <FormField
                            control={form.control}
                            name="consent"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-2xl border border-border/50 p-4 bg-background/30 backdrop-blur-sm transition-all hover:bg-background/50">
                                    <FormControl>
                                        <div className="flex items-center h-5">
                                            <input
                                                type="checkbox"
                                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary accent-primary cursor-pointer"
                                                checked={field.value}
                                                onChange={field.onChange}
                                                aria-label="I agree to the Privacy Policy and Terms of Use"
                                            />
                                        </div>
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel className="text-[11px] font-medium leading-relaxed text-muted-foreground cursor-pointer select-none">
                                            By creating an account, I confirm I am at least 13 years old (and if I am under 18, that a parent or guardian has reviewed this with me), and I agree to the collection and use of my data as described in the{" "}
                                            <button
                                                type="button"
                                                onClick={() => navigate('/privacy-policy')}
                                                className="text-primary font-bold hover:underline underline-offset-4"
                                            >
                                                Privacy Policy
                                            </button>{" "}
                                            and the{" "}
                                            <button
                                                type="button"
                                                onClick={() => navigate('/terms-of-service')}
                                                className="text-primary font-bold hover:underline underline-offset-4"
                                            >
                                                Terms of Use
                                            </button>
                                            . I understand my game progress and contributions will be stored.
                                        </FormLabel>
                                        <FormMessage className="text-[10px] font-bold" />
                                    </div>
                                </FormItem>
                            )}
                        />

                        <Button
                            type="submit"
                            className="w-full h-12 rounded-2xl font-black uppercase tracking-widest bg-primary text-primary-foreground hover:shadow-2xl hover:shadow-primary/30 transition-all duration-300 active:scale-[0.97] group mt-4"
                            disabled={loading}
                        >
                            {loading ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Creating Account...
                                </div>
                            ) : (
                                <span className="flex items-center justify-center gap-2">
                                    Create Account <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </span>
                            )}
                        </Button>
                    </form>
                </Form>

                <div className="pt-8 border-t border-border/50 text-center">
                    <p className="text-sm text-muted-foreground font-medium">
                        Already have an account?{' '}
                        <button
                            onClick={() => navigate('/login')}
                            className="font-black text-primary hover:text-primary/80 transition-colors"
                        >
                            Sign In
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}
