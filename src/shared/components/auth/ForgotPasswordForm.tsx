import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useState } from 'react';
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
import { Mail, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
// useTranslation removed

const forgotSchema = z.object({
    email: z.string().email({ message: 'Enter a valid email address' }),
});

export function ForgotPasswordForm() {
    // navigate not used
    const { setLoading, error, setError } = useAuthStore();
    // t not used
    const [sent, setSent] = useState(false);

    const form = useForm<z.infer<typeof forgotSchema>>({
        resolver: zodResolver(forgotSchema),
        defaultValues: { email: '' },
    });

    async function onSubmit(values: z.infer<typeof forgotSchema>) {
        setLoading(true);
        setError(null);
        try {
            await authService.forgotPassword(values.email);
            setSent(true);
            toast.success('If that email exists, a reset link has been sent.');
        } catch (err: any) {
            const msg = err.response?.data?.message || 'Failed to send reset email. Try again.';
            setError(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    }

    if (sent) {
        return (
            <div className="relative p-8 md:p-12 overflow-hidden text-center space-y-6">
                <CheckCircle size={48} className="mx-auto text-primary" />
                <h2 className="text-2xl font-extrabold">Check your inbox</h2>
                <p className="text-muted-foreground text-sm">
                    We sent a password-reset link to the address you provided.
                    It expires in 1 hour. If you don't see it, check spam or try
                    again.
                </p>
                <Button asChild variant="outline" className="w-full">
                    <Link to="/login">Back to sign in</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="relative p-8 md:p-12 overflow-hidden space-y-6">
            <div className="space-y-2">
                <h2 className="text-2xl font-extrabold tracking-tight">Reset your password</h2>
                <p className="text-muted-foreground text-sm">Enter your email and we'll send you a reset link.</p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" aria-label="Forgot password form">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60 flex items-center gap-2 px-1">
                                    <Mail size={12} /> Email
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        type="email"
                                        placeholder="you@example.com"
                                        className="bg-background/50 backdrop-blur-sm border-input focus-visible:ring-primary/5 h-12 rounded-2xl transition-all pl-4"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage className="text-[10px] font-bold" />
                            </FormItem>
                        )}
                    />

                    {error && (
                        <div className="p-3 rounded-2xl bg-destructive/5 border border-destructive/10 flex items-center gap-2" role="alert">
                            <AlertCircle size={14} className="text-destructive shrink-0" />
                            <p className="text-xs font-bold text-destructive">{error}</p>
                        </div>
                    )}

                    <Button
                        type="submit"
                        className="w-full h-12 rounded-2xl font-black uppercase tracking-widest bg-primary text-primary-foreground hover:shadow-2xl hover:shadow-primary/30 transition-all duration-300 active:scale-[0.97] group"
                        disabled={useAuthStore.getState().loading}
                    >
                        {useAuthStore.getState().loading ? (
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Sending…
                            </div>
                        ) : (
                            <span className="flex items-center justify-center gap-2">
                                Send reset link <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </span>
                        )}
                    </Button>
                </form>
            </Form>

            <div className="text-center">
                <p className="text-sm text-muted-foreground font-medium">
                    Remember your password?{' '}
                    <Link to="/login" className="font-black text-primary hover:text-primary/80 transition-colors">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}
