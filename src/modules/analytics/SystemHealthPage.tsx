import { useSystemHealth } from "@/shared/hooks/useAnalytics";
import {
    Activity,
    Cpu,
    Database,
    Clock,
    Server,
    Zap,
    ShieldCheck,
    AlertTriangle,
    RefreshCw,
    HardDrive
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Progress } from "@/shared/components/ui/progress";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function SystemHealthPage() {
    const { data: health, isLoading, isError, refetch, isFetching } = useSystemHealth();

    const formatUptime = (seconds: number) => {
        const days = Math.floor(seconds / (3600 * 24));
        const hours = Math.floor((seconds % (3600 * 24)) / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        return `${days}d ${hours}h ${minutes}m`;
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                <p className="text-sm font-black uppercase tracking-widest text-muted-foreground animate-pulse">Scanning Bio-Digital Systems...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center">
                <div className="p-6 bg-destructive/10 rounded-full text-destructive">