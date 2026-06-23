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

            <div className="relative z-10 w-full max-w-lg px-6">
                <AnimatePresence mode="wait">
                    <motion.div
                        key="onboarding-card"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="bg-[#111111]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-10 shadow-2xl relative overflow-hidden"
                    >
                        {/* Glow Border Effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 pointer-events-none" />

                        {/* Switch Account Action */}
                        <button
                            onClick={handleLogout}
                            className="absolute top-6 right-6 text-white/30 hover:text-white transition-colors flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold z-20"
                        >
                            <span className="hidden sm:inline">Switch Account</span>
                            <LogOut size={14} />
                        </button>

                        <div className="mb-8 text-center pt-2 flex flex-col items-center">
                            <Logo variant="only" className="h-16 w-auto mb-6" />
                            <h1 className="text-3xl font-light tracking-tight mb-2">Create Your Profile</h1>
                            <p className="text-white/40 text-sm">Choose a nickname and avatar to get started.</p>
                        </div>

                        <div className="space-y-8">
                            {/* Nickname Input */}
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-widest text-white/30 font-medium px-1">Nickname</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-white/20 group-focus-within:text-blue-400/50 transition-colors">
                                        <User size={18} />
                                    </div>
                                    <input
                                        type="text"
                                        value={nickname}
                                        onChange={(e) => setNickname(e.target.value)}
                                        placeholder="e.g. Alex"
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-white/10"
                                    />
                                </div>
                            </div>

                            {/* Avatar Selection */}
                            <div className="space-y-3">
                                <label className="text-xs uppercase tracking-widest text-white/30 font-medium px-1 flex justify-between">
                                    <span>Select Avatar</span>
                                </label>
                                <div className="grid grid-cols-5 gap-3">
                                    {loadingAvatars ? (
                                        [...Array(5)].map((_, i) => (
                                            <div key={i} className="aspect-square bg-white/5 rounded-2xl animate-pulse" />
                                        ))
                                    ) : (
                                        avatars?.filter(a => a.ageGroup === 'YOUTH').map((avatar) => (
                                            <motion.button
                                                key={avatar.id}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => setSelectedAvatar(avatar)}
                                                className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all ${selectedAvatar?.id === avatar.id
                                                    ? 'border-blue-500 bg-blue-500/10'
                                                    : 'border-white/5 hover:border-white/20'
                                                    }`}
                                            >
                                                <div className={`absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity ${selectedAvatar?.id === avatar.id ? 'opacity-100' : ''}`} />
                                                <img
                                                    src={avatar.imageUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + avatar.name}
                                                    alt={avatar.name}
                                                    className="w-full h-full object-cover"
                                                />
                                                {selectedAvatar?.id === avatar.id && (
                                                    <div className="absolute bottom-1 right-1 bg-blue-500 rounded-full p-0.5">
                                                        <Check size={10} strokeWidth={4} />
                                                    </div>
                                                )}
                                            </motion.button>
                                        ))
                                    )}
                                </div>
                                {selectedAvatar && (
                                    <motion.p
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="text-center text-xs text-white/40 italic"
                                    >