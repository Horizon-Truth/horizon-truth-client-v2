import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { AlertCircle, Loader2, LogOut } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/shared/components/ui/alert';

interface AnonymizeConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void>;
}

export const AnonymizeConfirmModal: React.FC<AnonymizeConfirmModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
}) => {
    const [confirmText, setConfirmText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleConfirm = async () => {
        if (confirmText !== 'ANONYMIZE') return;

        setIsLoading(true);
        setError(null);
        try {
            await onConfirm();
            onClose();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to anonymize account. Please try again.');