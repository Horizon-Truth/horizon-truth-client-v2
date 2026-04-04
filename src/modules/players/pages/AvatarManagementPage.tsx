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

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this avatar?')) {
            deleteMutation.mutate(id);
        }
    };

    const toggleStatus = (avatar: Avatar) => {
        updateMutation.mutate({
            id: avatar.id,
            data: { isActive: !avatar.isActive }
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Avatar Manager</h1>
                    <p className="text-muted-foreground">
                        Manage the collection of avatars available to players.
                    </p>
                </div>
                <Button onClick={() => { setEditingAvatar(null); setIsModalOpen(true); }}>
                    <Plus className="mr-2 h-4 w-4" /> Add Avatar
                </Button>
            </div>

            <div className="flex items-center space-x-2">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search avatars..."