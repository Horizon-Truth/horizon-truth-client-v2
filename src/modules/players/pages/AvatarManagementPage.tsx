import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    Plus,
    Search,
    Edit2,
    Trash2,
    ToggleLeft,
    ToggleRight,
    Loader2
} from 'lucide-react';
import { onboardingService, type Avatar, type AvatarDto } from '../services/onboarding.service';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/shared/components/ui/table';
import { Badge } from '@/shared/components/ui/badge';
import { AvatarFormModal } from '../components/AvatarFormModal';
import { toast } from 'sonner';

const AvatarManagementPage: React.FC = () => {
    const queryClient = useQueryClient();
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAvatar, setEditingAvatar] = useState<Avatar | null>(null);

    const { data, isLoading } = useQuery({
        queryKey: ['admin-avatars', page, searchQuery],
        queryKeyHashFn: (queryKey) => JSON.stringify(queryKey),
        queryFn: () => onboardingService.getAllAvatarsAdmin({ page, limit: 10 }),
    });

    const createMutation = useMutation({
        mutationFn: (newAvatar: AvatarDto) => onboardingService.createAvatar(newAvatar),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-avatars'] });
            setIsModalOpen(false);
            toast.success('Avatar created successfully');
        },
        onError: () => toast.error('Failed to create avatar'),
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string, data: Partial<AvatarDto> }) =>
            onboardingService.updateAvatar(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-avatars'] });
            setIsModalOpen(false);
            setEditingAvatar(null);
            toast.success('Avatar updated successfully');
        },
        onError: () => toast.error('Failed to update avatar'),
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => onboardingService.deleteAvatar(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-avatars'] });
            toast.success('Avatar deleted successfully');
        },
        onError: () => toast.error('Failed to delete avatar'),
    });

    const handleCreate = (data: AvatarDto) => {
        createMutation.mutate(data);
    };

    const handleUpdate = (data: AvatarDto) => {
        if (editingAvatar) {
            updateMutation.mutate({ id: editingAvatar.id, data });
        }
    };
