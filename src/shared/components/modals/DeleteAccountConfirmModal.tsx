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
import { AlertCircle, Loader2, Trash2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/shared/components/ui/alert';

const CONFIRM_WORD = 'DELETE';

interface DeleteAccountConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void>;
}

export const DeleteAccountConfirmModal: React.FC<DeleteAccountConfirmModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
}) => {
    const [confirmText, setConfirmText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleConfirm = async () => {
        if (confirmText !== CONFIRM_WORD) return;

        setIsLoading(true);
        setError(null);
        try {
            await onConfirm();
            onClose();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to delete your account. Please try again.');
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !isLoading && !open && onClose()}>
            <DialogContent className="sm:max-w-[500px] bg-card/95 backdrop-blur-2xl border-white/5 shadow-2xl">
                <DialogHeader>
                    <div className="mx-auto w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
                        <AlertCircle className="text-destructive h-6 w-6" />
                    </div>
                    <DialogTitle className="text-2xl font-bold text-center">Delete your account?</DialogTitle>
                    <DialogDescription className="text-center text-muted-foreground pt-2">
                        Your account will be locked right away and <span className="text-destructive font-bold">permanently deleted after 30 days</span>.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    <Alert variant="destructive" className="bg-destructive/5 border-destructive/20 rounded-xl">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle className="text-sm font-bold">What happens next</AlertTitle>
                        <AlertDescription className="text-xs opacity-90 space-y-1">
                            <p>You will be signed out on all devices.</p>
                            <p>Changed your mind? Sign in within 30 days and choose “Restore my account”.</p>
                            <p>After 30 days your personal information, game progress and badges are erased for good.</p>
                        </AlertDescription>
                    </Alert>

                    <div className="space-y-3">
                        <p className="text-sm font-medium text-center">
                            To confirm, type <span className="font-mono font-bold text-foreground bg-muted px-1.5 py-0.5 rounded">{CONFIRM_WORD}</span> below:
                        </p>
                        <Input
                            placeholder={CONFIRM_WORD}
                            value={confirmText}
                            onChange={(e) => setConfirmText(e.target.value.toUpperCase())}
                            className="bg-background/50 border-white/10 text-center h-12 text-lg font-mono tracking-widest focus-visible:ring-destructive/30 rounded-xl"
                            autoFocus
                            disabled={isLoading}
                            aria-label={`Type ${CONFIRM_WORD} to confirm`}
                        />
                    </div>

                    {error && (
                        <div className="p-3 text-xs font-medium text-destructive bg-destructive/10 border border-destructive/20 rounded-lg animate-in fade-in slide-in-from-top-2" role="alert">
                            {error}
                        </div>
                    )}
                </div>

                <DialogFooter className="flex sm:justify-between gap-3 pt-2">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={onClose}
                        disabled={isLoading}
                        className="flex-1 rounded-xl h-11"
                    >
                        Keep My Account
                    </Button>
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={handleConfirm}
                        disabled={confirmText !== CONFIRM_WORD || isLoading}
                        className="flex-1 rounded-xl h-11 shadow-lg shadow-destructive/20 font-bold"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Account
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
