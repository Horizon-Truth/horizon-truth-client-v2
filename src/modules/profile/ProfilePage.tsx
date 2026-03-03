import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuthStore } from '@/store/auth.store';
import { userService } from '@/services/user.service';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/shared/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/shared/components/ui/form';
import {
    ShieldCheck,
    Mail,
    User as UserIcon,
    Calendar,
    Edit2,
    X,
    Save,
    Loader2,
    CheckCircle2,
    AlertCircle,
    Trash2,
    Lock,
    Globe
} from 'lucide-react';
import { AnonymizeConfirmModal } from '@/shared/components/modals/AnonymizeConfirmModal';
import { LanguageSwitcher } from '@/shared/i18n/components/LanguageSwitcher';
import { useTranslation } from '@/shared/i18n/useTranslation';


const profileSchema = z.object({
    fullName: z.string().min(2, { message: 'Full name must be at least 2 characters' }),
    username: z.string().min(3, { message: 'Username must be at least 3 characters' }).regex(/^[a-zA-Z0-9_-]+$/, { message: 'Invalid username format' }).optional().or(z.literal('')),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const ProfilePage = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [isAnonymizeModalOpen, setIsAnonymizeModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { user, updateUser, logout } = useAuthStore();
    const { t: tt } = useTranslation();

    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            fullName: user?.fullName || '',
            username: user?.username || '',
        },
    });

    if (!user) return null;

    const onSubmit = async (values: ProfileFormValues) => {
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            const updated = await userService.updateProfile(values);
            updateUser(updated);
            setSuccess('Profile updated successfully!');
            setIsEditing(false);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to update profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        form.reset();
        setIsEditing(false);
        setError(null);
        setSuccess(null);
    };

    const handleAnonymize = async () => {
        await userService.anonymizeAccount();
        logout();
        navigate('/');
    };


    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">User Profile</h2>
                    <p className="text-sm text-muted-foreground mt-1">Manage your account details and security settings.</p>
                </div>
            </div>

            {success && (
                <div className="flex items-center gap-2 p-4 text-sm font-medium text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 rounded-xl animate-in fade-in slide-in-from-top-4">
                    <CheckCircle2 size={18} />
                    {success}
                </div>
            )}
