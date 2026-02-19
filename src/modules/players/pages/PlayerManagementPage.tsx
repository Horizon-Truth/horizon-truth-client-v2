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
                        <span className="text-xl sm:text-3xl font-black italic">{players.length}</span>
                    </div>
                    <div className="flex-1 sm:flex-none bg-card border border-border/40 p-3 sm:p-4 rounded-2xl sm:rounded-3xl flex flex-col items-center justify-center min-w-[80px] sm:min-w-[120px]">
                        <span className="text-[10px] font-black text-muted-foreground uppercase mb-1">Onboarded</span>
                        <span className="text-xl sm:text-3xl font-black italic text-emerald-500">{players.filter(p => p.onboardingCompleted).length}</span>
                    </div>
                </div>
            </div>

            <div className="flex gap-4 p-2 bg-muted/30 rounded-[2.5rem] border border-border/20 backdrop-blur-md">
                <div className="relative flex-1">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground/50" size={20} />
                    <Input
                        placeholder="Intercept signal by Handle or Cyber-Link..."
                        className="pl-14 h-14 rounded-full border-none bg-card/50 focus-visible:ring-primary/40 text-lg font-bold italic"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Button variant="outline" className="h-14 w-14 rounded-full p-0 border-border/40 bg-card hover:bg-accent group">
                    <Filter size={20} className="group-hover:rotate-180 transition-transform duration-500" />
                </Button>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {isLoading ? (
                    Array(4).fill(0).map((_, i) => (
                        <div key={i} className="h-24 rounded-[2rem] bg-card animate-pulse border border-border/40" />
                    ))
                ) : filteredPlayers.length === 0 ? (
                    <div className="py-32 text-center rounded-[3rem] bg-card/30 border border-dashed border-border/60">
                        <Award size={64} className="mx-auto text-muted-foreground/10 mb-6" />
                        <h3 className="text-2xl font-black italic uppercase text-muted-foreground">No Operatives Located</h3>
                    </div>
                ) : filteredPlayers.map((player) => (
                    <div key={player.id} className="group bg-card border border-border/40 rounded-[2rem] sm:rounded-[2.5rem] p-4 sm:pr-8 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 hover:border-primary/60 transition-all duration-300 hover:translate-x-1 sm:hover:translate-x-2 shadow-sm">
                        <div className="flex items-center gap-4 w-full sm:w-auto">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-[1rem] sm:rounded-[1.5rem] bg-gradient-to-br from-primary/20 to-primary/5 flex-shrink-0 flex items-center justify-center overflow-hidden relative border border-primary/20">
                                <span className="text-xl sm:text-2xl font-black text-primary italic z-10">{player.nickname.charAt(0)}</span>
                                <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <div className="sm:hidden flex-1 min-w-0">
                                <h3 className="text-lg font-black italic tracking-tighter uppercase group-hover:text-primary transition-colors leading-tight truncate">{player.nickname}</h3>
                                <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground italic truncate">
                                    <Mail size={10} />
                                    {player.user?.email || "N/A"}
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-4 items-center gap-4 sm:gap-6 w-full">
                            <div className="hidden sm:block col-span-1 min-w-0">
                                <h3 className="text-xl font-black italic tracking-tighter uppercase group-hover:text-primary transition-colors leading-tight truncate">{player.nickname}</h3>
                                <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground italic truncate">
                                    <Mail size={12} />
                                    {player.user?.email || "N/A"}
                                </div>
                            </div>

                            <div className="flex flex-col gap-1">
                                <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Trust Profile</span>
                                <div className="flex items-center gap-4">
                                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden border border-border/10">
                                        <div
                                            className="h-full bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)] transition-all duration-1000"
                                            style={{ width: `${player.trustScoreInitial}%` }}
                                        />
                                    </div>
                                    <span className="text-xs font-black italic">{player.trustScoreInitial}%</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-center">
                                <Badge className={cn(
                                    "rounded-xl px-4 h-8 font-black tracking-widest text-[10px] uppercase border",
                                    player.onboardingCompleted ? "bg-primary/5 text-primary border-primary/20" : "bg-muted text-muted-foreground border-border/40"
                                )}>
                                    {player.onboardingCompleted ? (
                                        <><ShieldCheck size={12} className="mr-2" /> ACTIVE STATUS</>
                                    ) : (
                                        <><Zap size={12} className="mr-2" /> PENDING MISSION</>
                                    )}
                                </Badge>
                            </div>

                            <div className="flex items-center justify-end gap-3 sm:px-4 border-t sm:border-t-0 pt-4 sm:pt-0">
                                <Button variant="ghost" size="icon" className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl sm:rounded-2xl hover:bg-red-500/10 hover:text-red-500">
                                    <Ban size={16} className="sm:w-[18px] sm:h-[18px]" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl sm:rounded-2xl hover:bg-emerald-500/10 hover:text-emerald-500">
                                    <Unlock size={16} className="sm:w-[18px] sm:h-[18px]" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl sm:rounded-2xl">
                                    <MoreHorizontal size={16} className="sm:w-[18px] sm:h-[18px]" />
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
