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