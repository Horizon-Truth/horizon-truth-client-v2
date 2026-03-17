import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/shared/components/ui/dialog';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Switch } from '@/shared/components/ui/switch';
import { type Avatar, type AvatarDto } from '../services/onboarding.service';

const formSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    imageUrl: z.string().url('Must be a valid URL'),
    gender: z.enum(['MALE', 'FEMALE', 'NEUTRAL']),
    ageGroup: z.enum(['YOUTH', 'ADULT']),
    isActive: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

interface AvatarFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: AvatarDto) => void;