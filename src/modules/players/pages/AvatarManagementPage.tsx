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
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[80px]">Preview</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Gender</TableHead>
                            <TableHead>Age Group</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                                </TableCell>
                            </TableRow>
                        ) : data?.data.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    No avatars found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            data?.data.map((avatar: Avatar) => (
                                <TableRow key={avatar.id}>
                                    <TableCell>
                                        <div className="h-10 w-10 rounded-full overflow-hidden border">
                                            <img
                                                src={avatar.imageUrl}
                                                alt={avatar.name}
                                                className="h-full w-full object-cover"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=' + avatar.name;
                                                }}
                                            />
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium">{avatar.name}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{avatar.gender}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{avatar.ageGroup}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={avatar.isActive ? "default" : "secondary"}>
                                            {avatar.isActive ? 'Active' : 'Inactive'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => toggleStatus(avatar)}
                                                title={avatar.isActive ? 'Deactivate' : 'Activate'}
                                            >
                                                {avatar.isActive ? (
                                                    <ToggleRight className="h-4 w-4 text-primary" />
                                                ) : (
                                                    <ToggleLeft className="h-4 w-4 text-muted-foreground" />
                                                )}
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => {
                                                    setEditingAvatar(avatar);
                                                    setIsModalOpen(true);
                                                }}
                                            >
                                                <Edit2 className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-destructive hover:text-destructive"
                                                onClick={() => handleDelete(avatar.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    Page {page} of {data?.meta?.totalPages || 1}
                </div>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(p => Math.min(data?.meta?.totalPages || 1, p + 1))}
                        disabled={page >= (data?.meta?.totalPages || 1)}
                    >
                        Next
                    </Button>
                </div>
            </div>

            <AvatarFormModal
                isOpen={isModalOpen}
                onClose={() => { setIsModalOpen(false); setEditingAvatar(null); }}
                onSubmit={editingAvatar ? handleUpdate : handleCreate}
                initialData={editingAvatar}
                isSubmitting={createMutation.isPending || updateMutation.isPending}
            />
        </div>
    );
};

export default AvatarManagementPage;
