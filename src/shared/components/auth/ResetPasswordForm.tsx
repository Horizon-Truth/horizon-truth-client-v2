import { useSearchParams } from 'react-router-dom';
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
import { Lock, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

const resetSchema = z.object({
    token: z.string().min(1, 'Token is required'),
    newPassword: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[a-z]/, 'Must include a lowercase letter')
        .regex(/[A-Z]/, 'Must include an uppercase letter')
        .regex(/[0-9]/, 'Must include a number')
        .regex(/[^a-zA-Z0-9]/, 'Must include a special character'),
    confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
});

type ResetFormValues = z.infer<typeof resetSchema>;

export function ResetPasswordForm() {
    // navigate not used
    const [searchParams] = useSearchParams();
    const urlToken = searchParams.get('token') ?? '';
    const [success, setSuccess] = useState(false);

    const form = useForm<ResetFormValues>({
        resolver: zodResolver(resetSchema),
        defaultValues: { token: urlToken, newPassword: '', confirmPassword: '' },
    });

    async function onSubmit(values: ResetFormValues) {
        try {
            await authService.resetPassword(values.token, values.newPassword);
            setSuccess(true);
            toast.success('Password reset successful! You can sign in now.');
        } catch (err: any) {
            const msg = err.response?.data?.message || 'Reset failed. The link may be expired or invalid.';
            toast.error(msg);
        }
    }

    if (success) {
        return (
            <div className="relative p-8 md:p-12 overflow-hidden text-center space-y-6">
                <CheckCircle size={48} className="mx-auto text-primary" />
                <h2 className="text-2xl font-extrabold">Password reset</h2>
                <p className="text-muted-foreground text-sm">Your password has been updated. You can now sign in with your new password.</p>
                <Button asChild variant="outline" className="w-full">
                    <a href="/login">Go to sign in</a>
                </Button>
            </div>
        );
    }

    return (
        <div className="relative p-8 md:p-12 overflow-hidden space-y-6">
            <div className="space-y-2">
                <h2 className="text-2xl font-extrabold tracking-tight">Set new password</h2>
                <p className="text-muted-foreground text-sm">Enter your token and choose a new password.</p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" aria-label="Reset password form">
                    <FormField
                        control={form.control}
                        name="token"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60 flex items-center gap-2 px-1">
                                    Reset Token
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Paste your reset token"
                                        className="bg-background/50 backdrop-blur-sm border-input focus-visible:ring-primary/5 h-12 rounded-2xl transition-all pl-4 font-mono text-sm"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage className="text-[10px] font-bold" />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="newPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60 flex items-center gap-2 px-1">
                                    <Lock size={12} /> New Password
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        type="password"
                                        placeholder="••••••••"
                                        className="bg-background/50 backdrop-blur-sm border-input focus-visible:ring-primary/5 h-12 rounded-2xl transition-all pl-4"
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
                                    <Lock size={12} /> Confirm Password
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        type="password"
                                        placeholder="••••••••"
                                        className="bg-background/50 backdrop-blur-sm border-input focus-visible:ring-primary/5 h-12 rounded-2xl transition-all pl-4"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage className="text-[10px] font-bold" />
                            </FormItem>
                        )}
                    />

                    <Button
                        type="submit"
                        className="w-full h-12 rounded-2xl font-black uppercase tracking-widest bg-primary text-primary-foreground hover:shadow-2xl hover:shadow-primary/30 transition-all duration-300 active:scale-[0.97] group"
                    >
                        Reset password
                    </Button>
                </form>
            </Form>
        </div>
    );
}
