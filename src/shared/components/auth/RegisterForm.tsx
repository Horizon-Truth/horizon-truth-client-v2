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

const registerSchema = z.object({
    fullName: z.string().min(2, { message: 'Full name must be at least 2 characters' }),
    email: z.string().email({ message: 'Invalid email address' }).optional().or(z.literal('')),
    username: z.string().min(3, { message: 'Username must be at least 3 characters' }).optional().or(z.literal('')),
    password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
}).refine((data) => data.email || data.username, {
    message: "Either email or username is required",
    path: ["email"],
});

export function RegisterForm() {
    const navigate = useNavigate();
    const setAuth = useAuthStore((state) => state.setAuth);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const form = useForm<z.infer<typeof registerSchema>>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            fullName: '',
            email: '',
            username: '',
            password: '',
            confirmPassword: '',
        },
    });

    async function onSubmit(values: z.infer<typeof registerSchema>) {
        setLoading(true);
        setError(null);
        try {
            const data = await authService.register(values);
            setAuth(data.user, data.access_token);
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="p-8">
            <div className="space-y-1 mb-8">
                <h2 className="text-2xl font-bold tracking-tight">Create an account</h2>
                <p className="text-sm text-muted-foreground">Join the next generation trust protocol</p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }: { field: any }) => (
                            <FormItem>
                                <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">Full Name</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="John Doe"
                                        className="bg-background/50 border-white/5 focus-visible:ring-primary/30 h-11 rounded-xl"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }: { field: any }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">Email Address</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="name@example.com"
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
                            name="username"
                            render={({ field }: { field: any }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">Username</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="johndoe"
                                            className="bg-background/50 border-white/5 focus-visible:ring-primary/30 h-11 rounded-xl"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }: { field: any }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="••••••••"
                                            className="bg-background/50 border-white/5 focus-visible:ring-primary/30 h-11 rounded-xl text-sm"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }: { field: any }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">Confirm</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="••••••••"
                                            className="bg-background/50 border-white/5 focus-visible:ring-primary/30 h-11 rounded-xl text-sm"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    {error && (
                        <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                            <p className="text-xs font-semibold text-destructive">{error}</p>
                        </div>
                    )}
                    <Button
                        type="submit"
                        className="w-full h-11 rounded-xl font-bold bg-primary text-primary-foreground hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-[0.98] mt-2"
                        disabled={loading}
                    >
                        {loading ? 'Creating account...' : 'Create Account'}
                    </Button>
                </form>
            </Form>

            <div className="mt-8 pt-6 border-t border-white/5 text-center">
                <p className="text-sm text-muted-foreground">
                    Already have an account?{' '}
                    <button
                        onClick={() => navigate('/login')}
                        className="font-bold text-primary hover:underline underline-offset-4"
                    >
                        Sign in
                    </button>
                </p>
            </div>
        </div>
    );
}
