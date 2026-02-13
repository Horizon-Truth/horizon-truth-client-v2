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
import { useState } from 'react';

const loginSchema = z.object({
    email: z.string().min(1, { message: 'Email or Username is required' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

export function LoginForm() {
    const navigate = useNavigate();
    const setAuth = useAuthStore((state) => state.setAuth);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

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
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="p-8">
            <div className="space-y-1 mb-8">
                <h2 className="text-2xl font-bold tracking-tight">Welcome back</h2>
                <p className="text-sm text-muted-foreground">Enter your details to access your dashboard</p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }: { field: any }) => (
                            <FormItem>
                                <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">Email or Username</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Email or Username"
                                        className="bg-background/50 border-white/5 focus-visible:ring-primary/30 h-11 rounded-xl"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }: { field: any }) => (
                            <FormItem>
                                <div className="flex items-center justify-between">
                                    <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">Password</FormLabel>
                                </div>
                                <FormControl>
                                    <Input
                                        type="password"
                                        placeholder="••••••••"
                                        className="bg-background/50 border-white/5 focus-visible:ring-primary/30 h-11 rounded-xl"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {error && (
                        <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                            <p className="text-xs font-semibold text-destructive">{error}</p>
                        </div>
                    )}
                    <Button
                        type="submit"
                        className="w-full h-11 rounded-xl font-bold bg-primary text-primary-foreground hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-[0.98]"
                        disabled={loading}
                    >
                        {loading ? 'Authenticating...' : 'Sign In'}
                    </Button>
                </form>
            </Form>

            <div className="mt-8 pt-6 border-t border-white/5 text-center">
                <p className="text-sm text-muted-foreground">
                    New to Horizon?{' '}
                    <button
                        onClick={() => navigate('/register')}
                        className="font-bold text-primary hover:underline underline-offset-4"
                    >
                        Create an account
                    </button>
                </p>
            </div>
        </div>
    );
}
