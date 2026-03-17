import { useEffect, useState } from "react";
import { ShieldCheck, Zap, Target, Award, Search, Filter, Mail, Ban, Unlock, MoreHorizontal } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/shared/components/ui/badge";
import { adminService, type PlayerProfile } from "@/services/admin.service";
import { toast } from "sonner";
import { cn } from "@/shared/lib/utils";

export default function PlayerManagementPage() {
    const [players, setPlayers] = useState<PlayerProfile[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchPlayers = async () => {
        setIsLoading(true);
        try {
            const response = await adminService.getPlayerProfiles();
            setPlayers(response.data.data || []);
        } catch (error) {
            console.error("Failed to fetch players:", error);
            toast.error("Failed to load player data");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPlayers();
    }, []);

    const filteredPlayers = players.filter(p =>
        p.nickname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.user?.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-10 animate-in fade-in zoom-in-95 duration-500">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6">
                <div>
                    <h2 className="text-3xl sm:text-5xl font-black tracking-tighter uppercase italic leading-none">Vanguard Personnel</h2>
                    <p className="text-sm sm:text-muted-foreground mt-3 font-semibold tracking-wide flex items-center gap-2">
                        <Target size={18} className="text-primary flex-shrink-0" />
                        Monitoring cognitive performance and trust metrics across the player network.
                    </p>
                </div>
                <div className="flex gap-4 w-full sm:w-auto">
                    <div className="flex-1 sm:flex-none bg-card border border-border/40 p-3 sm:p-4 rounded-2xl sm:rounded-3xl flex flex-col items-center justify-center min-w-[80px] sm:min-w-[120px]">
                        <span className="text-[10px] font-black text-muted-foreground uppercase mb-1">Total Assets</span>