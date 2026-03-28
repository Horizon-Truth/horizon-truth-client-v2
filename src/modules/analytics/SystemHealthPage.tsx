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
