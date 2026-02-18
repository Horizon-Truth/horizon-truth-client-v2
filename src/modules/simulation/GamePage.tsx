import { useEffect, useState } from 'react';
import { useGameStore } from '@/store/game.store';
import { cn } from '@/shared/lib/utils';
import {
    ShieldCheck,
    Zap,
    Users,
    Trophy,
    History,
    AlertCircle,
    LayoutDashboard,
    Activity,
    MessageSquare
} from 'lucide-react';
import { ScenarioList } from '../engine/components/ScenarioList';
import { GameSession } from '../engine/components/GameSession';
import { GameOutcome } from '../engine/components/GameOutcome';
import { Button } from '@/shared/components/ui/button';
import AddFeedbackModal from '../engine/components/AddFeedbackModal';

export default function GamePage() {
    const { stats, activeProgress, currentOutcome, fetchGameHistory } = useGameStore();
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

    useEffect(() => {
        fetchGameHistory();
    }, [fetchGameHistory]);

    return (
        <div className="flex flex-col min-h-full gap-8 p-8 overflow-y-auto bg-background/50 selection:bg-primary/20">
            {/* Standard Dashboard View (Scenario List) */}
            {!activeProgress && !currentOutcome && (
                <>
                    {/* Stats Header */}
                    <header className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-in fade-in slide-in-from-top-4 duration-700">
                        <StatCard
                            label="Protocol Trust"
                            value={`${stats.trustScore}%`}
                            icon={<ShieldCheck className="text-emerald-500" />}
                            progress={stats.trustScore}
                            color="bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                        />
                        <StatCard
                            label="Operational Level"
                            value={`Lvl ${stats.level}`}
                            subValue={`${stats.experience} / ${stats.level * 100} XP`}
                            icon={<Zap className="text-amber-500" />}
                            progress={(stats.experience / (stats.level * 100)) * 100}
                            color="bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)]"
                        />
                        <StatCard
                            label="Influencer Status"
                            value={stats.influence.toString()}
                            subValue="Network nodes"
                            icon={<Users className="text-blue-500" />}
                        />
                        <StatCard
                            label="Missions Verified"
                            value={stats.missionsCompleted.toString()}
                            subValue="Completed tasks"
                            icon={<Trophy className="text-purple-500" />}
                        />
                    </header>

                    {/* Main Content Area */}
                    <main className="flex-1 flex gap-8">
                        <div className="flex-1 flex flex-col gap-6 bg-card/20 border border-white/5 rounded-[2.5rem] p-10 relative overflow-hidden backdrop-blur-2xl shadow-2xl isolation-isolate [transform:translateZ(0)] backface-visibility-hidden">
                            <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none">
                                <LayoutDashboard size={240} />
                            </div>

                            <div className="flex items-center justify-between mb-2 relative z-10">
                                <h1 className="text-4xl font-black italic uppercase tracking-wider">Mission Command</h1>
                                <Button
                                    onClick={() => setIsFeedbackOpen(true)}
                                    className="rounded-2xl h-12 px-6 font-bold gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all bg-indigo-500 hover:bg-indigo-600 relative z-10"
                                >
                                    <MessageSquare size={20} />
                                    Give Feedback
                                </Button>
                            </div>

                            <ScenarioList />
                        </div>

                        {/* Sidebar - Global Intel */}
                        <aside className="w-80 hidden xl:flex flex-col gap-8">
                            <div className="bg-card/20 border border-white/5 rounded-[2.5rem] p-8 flex-1 flex flex-col gap-8 overflow-hidden backdrop-blur-xl isolation-isolate [transform:translateZ(0)] backface-visibility-hidden">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-3">
                                        <History className="text-muted-foreground" size={20} />
                                        <h3 className="font-black text-xs tracking-[0.2em] uppercase">Log Streams</h3>
                                    </div>
                                    <Activity size={16} className="text-primary animate-pulse" />
                                </div>

                                <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                                    {stats.missionsCompleted === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-16 opacity-30 text-center">
                                            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                                                <AlertCircle size={32} />
                                            </div>
                                            <p className="text-xs font-black uppercase tracking-widest">No Active Streams</p>
                                            <p className="text-[10px] mt-2 font-medium">Initialize a protocol to begin logging</p>
                                        </div>
                                    ) : (
                                        Array.from({ length: stats.missionsCompleted }).map((_, i) => (
                                            <div key={i} className="p-5 rounded-3xl bg-white/5 border border-white/5 flex items-center gap-5 group hover:bg-white/10 hover:border-primary/20 transition-all cursor-default">
                                                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                                                    <Trophy size={18} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-black text-xs truncate">MISSION_{100 + i}</p>
                                                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">Verified Success</p>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </aside>
                    </main>
                </>
            )}

            {/* Immersive Full-Screen Game View */}
            {(activeProgress || currentOutcome) && (
                <div className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-3xl flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-500">
                    {/* Background Ambient Glows */}
                    <div className="absolute top-0 left-0 w-[50vw] h-[50vh] bg-primary/10 blur-[120px] rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
                    <div className="absolute bottom-0 right-0 w-[40vw] h-[40vh] bg-emerald-500/5 blur-[120px] rounded-full translate-x-1/2 translate-y-1/2 pointer-events-none" />

                    <div className="w-full max-w-6xl max-h-[100vh] md:max-h-[90vh] overflow-y-auto custom-scrollbar relative">
                        <div className="bg-card/30 border border-white/10 rounded-[3rem] p-8 md:p-12 shadow-2xl backdrop-blur-2xl isolation-isolate [transform:translateZ(0)]">
                            {activeProgress && <GameSession />}
                            {currentOutcome && <GameOutcome />}
                        </div>
                    </div>
                </div>
            )}

            {/* Feedback Modal Overlay */}
            {isFeedbackOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-background/90 backdrop-blur-md animate-in fade-in duration-300"
                        onClick={() => setIsFeedbackOpen(false)}
                    />
                    <div className="relative z-[210] w-full max-w-lg">
                        <AddFeedbackModal
                            onSuccess={() => setIsFeedbackOpen(false)}
                            onCancel={() => setIsFeedbackOpen(false)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

function StatCard({ label, value, subValue, icon, progress, color }: { label: string, value: string, subValue?: string, icon: React.ReactNode, progress?: number, color?: string }) {
    return (
        <div className="bg-card/20 border border-white/10 rounded-[2rem] p-6 backdrop-blur-xl relative overflow-hidden group hover:border-white/20 hover:bg-card/30 transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
                <span className="text-[10px] font-black text-muted-foreground tracking-[0.2em] uppercase">{label}</span>
                <div className="w-10 h-10 bg-white/5 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform">
                    {icon}
                </div>
            </div>
            <div className="space-y-1.5">
                <h4 className="text-4xl font-black tracking-tighter">{value}</h4>
                {subValue && <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none">{subValue}</p>}
            </div>
            {progress !== undefined && (
                <div className="mt-6 w-full h-2 bg-white/5 rounded-full overflow-hidden p-[1px]">
                    <div
                        className={cn("h-full rounded-full transition-all duration-1000 ease-out", color)}
                        style={{ width: `${progress}%` }}
                    />
                </div>
            )}
        </div>
    );
}
