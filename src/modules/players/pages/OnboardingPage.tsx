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