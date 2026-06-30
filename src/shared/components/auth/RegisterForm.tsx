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