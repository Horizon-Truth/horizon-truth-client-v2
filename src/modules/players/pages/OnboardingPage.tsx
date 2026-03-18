import React, { useState } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { onboardingService, type Avatar } from '../services/onboarding.service';
import { useAuthStore } from '../../../store/auth.store';
import { User, ChevronRight, Check, LogOut } from 'lucide-react';
import { toast } from 'sonner';
import { authService } from '../../../services/auth.service';
import { Logo } from '@/shared/components/ui/logo';

const OnboardingPage: React.FC = () => {
    const [nickname, setNickname] = useState('');
    const [selectedAvatar, setSelectedAvatar] = useState<Avatar | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const navigate = useNavigate();
    const { updateUser, logout } = useAuthStore();

    const handleLogout = async () => {
        try {
            await authService.logout();
        } catch (error) {
            console.error(error);
        } finally {
            logout();
            navigate('/login');
        }
    };

    const { data: avatars, isLoading: loadingAvatars } = useQuery({
        queryKey: ['avatars'],
        queryFn: onboardingService.getAvatars
    });

    const mutation = useMutation({
        mutationFn: onboardingService.initializeProfile,
        onSuccess: (data) => {
            updateUser({
                onboardingCompleted: true,
                nickname: data.nickname,
                avatarUrl: data.avatar?.imageUrl
            });
            toast.success('Profile created successfully. Welcome!');
            navigate('/dashboard/game');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to initialize profile');
            setIsSubmitting(false);
        }
    });

    const handleSubmit = () => {
        if (!nickname || !selectedAvatar) {
            toast.error('Please complete your identity profile');
            return;
        }
        setIsSubmitting(true);
        mutation.mutate({
            nickname,
            avatarId: selectedAvatar.id
        });
    };

    const containerVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
        exit: { opacity: 0, y: -20, transition: { duration: 0.4 } }
    };

    return (
        <div className="fixed inset-0 bg-[#050505] flex items-center justify-center overflow-hidden font-sans text-white">
            {/* Background Soft Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />