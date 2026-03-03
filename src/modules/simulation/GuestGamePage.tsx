import { memo, useEffect, useState } from 'react';
import { useGuestGameStore } from '@/store/guest-game.store';
import { cn } from '@/shared/lib/utils';
import {
    ShieldCheck,
    MessageSquare,
    ArrowRight,
    Trophy,
    Home,
    UserPlus,
    Loader2,
    Zap,
    Users,
    ShieldAlert,
    Clock,
    TrendingUp,
    Bell,
    User,
    AlertCircle,
    History as LucideHistory
} from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ScenarioList } from '../engine/components/ScenarioList';
import { toast } from 'sonner';
import { Badge } from '@/shared/components/ui/badge';

// Component-specific imports
import { TrustMeter } from '../engine/components/play/TrustMeter';
import { Progress } from '@/shared/components/ui/progress';
import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';

const NavItem = memo(({ icon, label, active = false, isLocked = false }: { icon: React.ReactNode, label: string, active?: boolean, isLocked?: boolean }) => {
    return (
        <div className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer group relative",
            active ? "bg-primary/10 text-primary border border-primary/20" : "text-muted-foreground hover:bg-white/5 hover:text-white",
            isLocked && "opacity-40 grayscale pointer-events-none"
        )}>
            {icon}
            <span className="text-xs font-black uppercase tracking-wider">{label}</span>
            {isLocked && (
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[8px] bg-black/80 px-2 py-0.5 rounded-full border border-white/10 uppercase">Locked</span>
                </div>
            )}
        </div>
    );
});
NavItem.displayName = 'NavItem';

const NotificationCard = memo(({ icon, title, desc, time, highlight = false, isLocked = false }: { icon: React.ReactNode, title: string, desc: string, time: string, highlight?: boolean, isLocked?: boolean }) => {
    return (
        <div className={cn(
            "p-5 rounded-2xl border transition-all duration-300 hover:scale-[1.02] relative overflow-hidden",
            highlight ? "bg-primary/10 border-primary/20" : "bg-white/5 border-white/5",
            isLocked && "opacity-40 grayscale blur-[1px]"
        )}>
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <div className={cn("p-1.5 rounded-lg", highlight ? "bg-primary text-white" : "bg-white/10 text-muted-foreground")}>
                        {icon}
                    </div>
                    <span className="font-bold text-xs truncate max-w-[150px]">{title}</span>
                </div>
                <span className="text-[10px] text-muted-foreground">{time}</span>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">{desc}</p>
            {isLocked && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full border border-white/10 scale-75">
                        <span className="text-[8px] font-black uppercase tracking-widest text-white/60">Node Encrypted</span>
                    </div>
                </div>
            )}
        </div>
    );
});
NotificationCard.displayName = 'NotificationCard';

function StatCard({ label, value, subValue, icon, progress, color, isLocked }: { label: string, value: string, subValue?: string, icon: React.ReactNode, progress?: number, color?: string, isLocked?: boolean }) {
    return (
        <div className={cn(
            "bg-card/20 border border-white/10 rounded-[2rem] p-6 backdrop-blur-xl relative overflow-hidden group transition-all duration-300",
            isLocked ? "opacity-60 grayscale-[0.5]" : "hover:border-white/20 hover:bg-card/30"
        )}>
            <div className="flex items-center justify-between mb-6">
                <span className="text-[10px] font-black text-muted-foreground tracking-[0.2em] uppercase">{label}</span>
                <div className="w-10 h-10 bg-white/5 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform">
                    {icon}
                </div>
            </div>
            <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                    <h4 className="text-2xl sm:text-3xl font-black tracking-tighter">{value}</h4>
                    {isLocked && <Badge variant="secondary" className="text-[8px] h-4 rounded-md uppercase font-black tracking-tighter bg-white/5 border-white/10">Locked</Badge>}
                </div>
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
            {isLocked && (
                <div className="absolute inset-0 bg-background/5 backdrop-blur-[1px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <span className="text-[10px] font-black uppercase tracking-widest bg-black/50 px-3 py-1 rounded-full border border-white/10">Sign in to unlock</span>
                </div>
            )}
        </div>
    );
}


export default function GuestGamePage() {
    const {
        activeScenario,
        currentScene,
        isCompleted,
        trustScore,
        isLoading,
        fetchScenarios,
        startGuestGame,
        submitGuestChoice,
        resetGuestGame
    } = useGuestGameStore();

    const navigate = useNavigate();
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

    useEffect(() => {
        fetchScenarios();
    }, [fetchScenarios]);

    // Handle "Give Feedback"
    const handleFeedback = () => {
        setIsFeedbackOpen(true);
    };

    return (
        <div className="flex flex-col min-h-screen bg-background relative overflow-hidden selection:bg-primary/20">
            {/* Ambient Background */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

            {/* Guest Header */}
            <header className="relative z-20 border-b border-white/5 bg-background/50 backdrop-blur-xl px-4 sm:px-8 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div
                            className="flex items-center gap-2 cursor-pointer group"
                            onClick={() => navigate('/')}
                        >
                            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                                <ShieldCheck className="text-primary-foreground h-5 w-5" />
                            </div>
                            <span className="font-black tracking-tighter text-xl hidden sm:block">HORIZON</span>
                        </div>
                        <div className="h-6 w-px bg-white/10 mx-2 hidden sm:block" />
                        <div className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                            <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Guest Mode</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 sm:gap-6">
                        <Button
                            variant="ghost"
                            onClick={() => navigate('/')}
                            className="hidden sm:flex text-xs font-bold gap-2 rounded-xl"
                        >
                            <Home size={16} /> Home
                        </Button>
                        <Button
                            onClick={() => navigate('/register')}
                            className="rounded-xl h-10 px-5 font-bold gap-2 shadow-lg shadow-primary/20 text-xs sm:text-sm"
                        >
                            <UserPlus size={16} /> Create Account
                        </Button>
                    </div>
                </div>
            </header>

            <main className="flex-1 relative z-10 max-w-7xl w-full mx-auto p-4 sm:p-8 overflow-y-auto custom-scrollbar">
                {!activeScenario && !isCompleted && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        {/* Better When Signed In Banner */}
                        <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-[2rem] p-6 flex flex-col md:flex-row items-center justify-between gap-6 group">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 bg-indigo-500/20 rounded-3xl flex items-center justify-center border border-indigo-500/30 flex-shrink-0">
                                    <Zap className="text-indigo-500 w-8 h-8 animate-pulse" />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-xl font-black italic uppercase tracking-wider text-indigo-400">Horizon Pro Experience</h3>
                                    <p className="text-sm text-indigo-300/80 font-medium leading-relaxed max-w-xl">
                                        Signing in unlocks global ranking, customizable avatars, advanced log analytics, and allows you to earn real Trust XP for every mission completed and get certificate.
                                    </p>
                                </div>
                            </div>
                            <Button
                                onClick={() => navigate('/register')}
                                className="bg-indigo-500 hover:bg-indigo-600 text-white font-black uppercase tracking-widest px-8 h-14 rounded-2xl shadow-xl shadow-indigo-500/20 shrink-0"
                            >
                                <UserPlus size={18} className="mr-2" /> Upgrade to Pro
                            </Button>
                        </div>

                        <div className="flex flex-col lg:flex-row gap-8">
                            {/* Main Content Area */}
                            <div className="flex-1 space-y-8">
                                {/* Hero Section */}
                                <div className="bg-card/20 border border-white/5 rounded-[2rem] p-8 sm:p-12 backdrop-blur-2xl relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none group-hover:opacity-[0.05] transition-opacity">
                                        <Home size={200} />
                                    </div>
                                    <div className="space-y-4 text-center md:text-left relative z-10">
                                        <h1 className="text-3xl sm:text-5xl font-black italic uppercase tracking-wider">Mission Command</h1>
                                        <p className="text-muted-foreground text-lg max-w-xl">
                                            Access the truth protocols below. As a guest, your session data is stored locally. Sign in to join the global resistance.
                                        </p>
                                        <div className="flex flex-wrap gap-4 justify-center md:justify-start pt-2">
                                            <Button
                                                onClick={handleFeedback}
                                                className="rounded-xl h-12 px-6 font-bold gap-2 bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 hover:bg-indigo-500/20 transition-all font-black uppercase tracking-widest text-[10px]"
                                            >
                                                <MessageSquare size={16} />
                                                Give Feedback
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                {/* Scenario List */}
                                <div className="bg-card/20 border border-white/5 rounded-[2rem] p-4 sm:p-10 backdrop-blur-2xl">
                                    <ScenarioList onStartGame={startGuestGame} guestMode />
                                </div>
                            </div>

                            {/* Sidebar - Locked Features */}
                            <aside className="w-full lg:w-80 flex flex-col gap-6">
                                <div className="bg-card/20 border border-white/5 rounded-[2.5rem] p-8 flex-1 flex flex-col gap-8 backdrop-blur-xl relative group">
                                    <div className="absolute inset-x-8 bottom-8 z-20">
                                        <div className="p-6 rounded-3xl bg-black/60 border border-white/10 backdrop-blur-md text-center space-y-4">
                                            <ShieldAlert className="w-10 h-10 text-primary mx-auto opacity-50" />
                                            <div className="space-y-1">
                                                <p className="font-black text-white text-[10px] uppercase tracking-widest">Logs Encrypted</p>
                                                <p className="text-[10px] text-white">Persistent mission logs require an active operator profile.</p>
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="w-full text-[10px] font-black uppercase tracking-widest h-10 rounded-xl"
                                                onClick={() => navigate('/login')}
                                            >
                                                Initialize Login
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </aside>
                        </div>
                    </div>
                )}

                {/* Local Guest Game Play */}
                {(activeScenario || isCompleted) && (
                    <div className="fixed inset-0 z-[100] bg-[#0B0E11] flex flex-col overflow-hidden animate-in fade-in duration-500">
                        {isLoading ? (
                            <div className="flex-1 flex items-center justify-center">
                                <div className="flex flex-col items-center gap-4 animate-in zoom-in-95 duration-500">
                                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20">
                                        <Loader2 className="w-8 h-8 text-primary animate-spin" />
                                    </div>
                                    <p className="text-sm font-bold tracking-widest uppercase opacity-50 animate-pulse text-white">Initializing Protocol...</p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex h-full text-white overflow-hidden">
                                {/* 1. Left Sidebar - Profile & Stats (Dimmed) */}
                                <aside className="w-[300px] border-r border-white/5 flex flex-col pt-8 bg-[#0B0E11]/80 backdrop-blur-xl transition-all duration-500 hidden md:flex">
                                    <div className="px-6 space-y-8">
                                        {/* Profile Section */}
                                        <div className="flex flex-col items-center text-center gap-4">
                                            <div className="relative group">
                                                <div className="absolute -inset-1 bg-gradient-to-tr from-primary to-blue-500 rounded-full blur opacity-40"></div>
                                                <Avatar className="w-20 h-20 border-2 border-[#0B0E11] relative z-10">
                                                    <AvatarFallback className="bg-[#1A1D21] text-xl font-black italic">G</AvatarFallback>
                                                </Avatar>
                                                <div className="absolute bottom-1 right-1 w-5 h-5 bg-amber-500 border-4 border-[#0B0E11] rounded-full z-20" />
                                            </div>
                                            <div className="space-y-1">
                                                <h2 className="text-lg font-black tracking-tight italic uppercase">Guest Operator</h2>
                                                <p className="text-[10px] text-muted-foreground uppercase font-black tracking-[0.2em]">@anonymous</p>
                                            </div>
                                        </div>

                                        {/* Stats Section */}
                                        <div className="space-y-8 pt-4 flex flex-col items-center relative">
                                            <div className="relative transition-all duration-500">
                                                <TrustMeter score={trustScore} size={160} strokeWidth={10} />
                                            </div>

                                            <div className="w-full space-y-3 opacity-40 grayscale blur-[0.5px]">
                                                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
                                                            <Zap size={18} />
                                                        </div>
                                                        <span className="text-xs font-black uppercase tracking-wider">Level</span>
                                                    </div>
                                                    <span className="text-xl font-black italic">Lvl 1</span>
                                                </div>

                                                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
                                                            <TrendingUp size={18} />
                                                        </div>
                                                        <span className="text-xs font-black uppercase tracking-wider">Influence</span>
                                                    </div>
                                                    <span className="text-xl font-black italic">0</span>
                                                </div>
                                            </div>

                                            {/* Sign in overlay for stats */}
                                            <div className="absolute inset-x-0 bottom-4 py-8 bg-gradient-to-t from-[#0B0E11] to-transparent flex flex-col items-center justify-end z-20">
                                                <div className="bg-black/80 border border-white/10 rounded-2xl p-4 text-center backdrop-blur-md shadow-2xl">
                                                    <p className="text-[8px] font-black uppercase tracking-[0.2em] mb-2 text-primary">Limited Session</p>
                                                    <p className="text-[9px] text-white/60 mb-3 leading-tight">Persistent progression data requires an active profile.</p>
                                                    <Button
                                                        size="sm"
                                                        className="h-8 text-[9px] font-black uppercase tracking-widest w-full rounded-lg"
                                                        onClick={() => navigate('/register')}
                                                    >
                                                        Login to sync
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Navigation Mini (Locked) */}
                                        <nav className="space-y-1 pt-4">
                                            <NavItem icon={<User size={18} />} label="Overview" active />
                                            <NavItem icon={<Trophy size={18} />} label="Achievements" isLocked />
                                            <NavItem icon={<AlertCircle size={18} />} label="Security" isLocked />
                                        </nav>
                                    </div>
                                </aside>

                                {/* 2. Main Feed - Scene Content */}
                                <main className="flex-1 flex flex-col relative bg-gradient-to-b from-[#0F1216] to-[#0B0E11]">
                                    {/* Header */}
                                    <header className="h-16 border-b border-white/5 px-8 flex items-center justify-between bg-black/20 backdrop-blur-md sticky top-0 z-50">
                                        <div className="flex items-center gap-4">
                                            <span className="font-black italic tracking-tighter text-lg uppercase text-primary">Guest Simulation</span>
                                            <div className="h-4 w-[1px] bg-white/10" />
                                            <span className="text-xs font-bold text-muted-foreground truncate max-w-[200px]">{activeScenario?.title || 'Unknown Protocol'}</span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <Button variant="ghost" size="sm" onClick={resetGuestGame} className="text-[10px] font-black uppercase tracking-widest h-8 px-4 rounded-lg bg-white/5 hover:bg-red-500/10 hover:text-red-500">
                                                Abort Simulation
                                            </Button>
                                            <div className="flex items-center gap-2 border-l border-white/10 pl-4">
                                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                                                <span className="text-[10px] font-black uppercase tracking-widest text-amber-500">Guest Stream</span>
                                            </div>
                                        </div>
                                    </header>

                                    {/* Content Area */}
                                    <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-12 custom-scrollbar flex flex-col items-center">
                                        <div className="w-full max-w-xl space-y-12 pb-32">
                                            {isCompleted ? (
                                                <div className="text-center space-y-8 py-12 animate-in zoom-in-95 duration-700">
                                                    <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/30">
                                                        <Trophy size={48} className="text-primary" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <h2 className="text-4xl sm:text-6xl font-black tracking-tighter uppercase italic">Training Complete</h2>
                                                        <p className="text-xl text-muted-foreground font-medium">Final Trust Score: <span className="text-primary font-black">{trustScore}</span></p>
                                                    </div>

                                                    <div className="max-w-md mx-auto p-8 rounded-[2rem] bg-indigo-500/10 border border-indigo-500/20 space-y-6">
                                                        <div className="space-y-2">
                                                            <h4 className="font-black text-xl italic uppercase tracking-wider text-indigo-400">Save Your Progress</h4>
                                                            <p className="text-xs text-indigo-300/80 leading-relaxed font-medium">
                                                                Your session data won't persist across devices as a guest. Register now to sync your Trust Score and start earning official certifications.
                                                            </p>
                                                        </div>
                                                        <Button
                                                            onClick={() => navigate('/register')}
                                                            className="w-full h-14 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary/20 bg-indigo-500"
                                                        >
                                                            Claim Account & Certificate
                                                        </Button>
                                                    </div>

                                                    <div className="flex items-center justify-center gap-6 pt-4">
                                                        <Button variant="ghost" onClick={resetGuestGame} className="font-black text-[10px] uppercase tracking-[0.2em] underline underline-offset-4">Try Another Protocol</Button>
                                                        <Button variant="ghost" onClick={() => navigate('/')} className="font-black text-[10px] uppercase tracking-[0.2em]">Exit to Terminal</Button>
                                                    </div>
                                                </div>
                                            ) : currentScene && (
                                                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <Clock size={14} className="text-muted-foreground" />
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Interpolated {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                    </div>

                                                    <div className="space-y-6">
                                                        <div className="space-y-2 text-center md:text-left">
                                                            <h3 className="text-3xl font-black tracking-tighter uppercase italic">{currentScene.title}</h3>
                                                            <p className="text-muted-foreground text-lg leading-relaxed font-medium">{currentScene.description}</p>
                                                        </div>

                                                        <div className="p-8 sm:p-12 rounded-[2.5rem] bg-white/5 border border-white/5 shadow-2xl text-lg leading-relaxed font-medium relative overflow-hidden group">
                                                            <div className="absolute top-0 left-0 w-1 h-0 bg-primary group-hover:h-full transition-all duration-700" />
                                                            {currentScene.content?.textBody || currentScene.description}
                                                        </div>
                                                    </div>

                                                    <div className="space-y-6 pt-10 border-t border-white/5">
                                                        <div className="flex items-center justify-between px-2">
                                                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Select response node</span>
                                                            <span className="text-[10px] font-mono text-muted-foreground opacity-40">PHASE_GUEST_{currentScene.id}</span>
                                                        </div>

                                                        <div className="grid grid-cols-1 gap-3">
                                                            {currentScene.choices?.map((choice: any, index: number) => (
                                                                <button
                                                                    key={choice.id || choice.label}
                                                                    onClick={() => submitGuestChoice(choice)}
                                                                    className="group p-6 text-left rounded-2xl bg-white/5 border border-white/5 hover:border-primary/40 hover:bg-white/10 transition-all duration-300 flex items-center justify-between gap-6"
                                                                >
                                                                    <div className="space-y-1">
                                                                        <div className="flex items-center gap-3">
                                                                            <span className="text-[10px] font-black text-primary/40 leading-none">[{index + 1}]</span>
                                                                            <span className="font-bold text-lg group-hover:text-primary transition-colors">{choice.label}</span>
                                                                        </div>
                                                                        <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest opacity-60">System Directive Guest</p>
                                                                    </div>
                                                                    <ArrowRight size={20} className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </main>

                                {/* 3. Right Panel - Notifications & Intel (Dimmed) */}
                                <aside className="w-[350px] border-l border-white/5 flex flex-col bg-[#0B0E11]/80 backdrop-blur-xl transition-all duration-500 hidden lg:flex">
                                    <div className="p-6 h-full flex flex-col relative">
                                        <div className="flex items-center justify-between mb-8">
                                            <div className="flex items-center gap-2">
                                                <Bell size={18} className="text-primary/60" />
                                                <h3 className="font-black text-xs tracking-widest uppercase">Global Feed</h3>
                                            </div>
                                            <div className="w-2 h-2 rounded-full bg-primary/20" />
                                        </div>

                                        <div className="flex-1 space-y-4">
                                            <NotificationCard
                                                icon={<Zap size={14} />}
                                                title="Intel Intercepted"
                                                desc="A encrypted transmission was detected in Sector 5."
                                                time="5m ago"
                                                isLocked
                                            />
                                            <NotificationCard
                                                icon={<TrendingUp size={14} />}
                                                title="Global Trend"
                                                desc="Public trust indexes are shifting rapidly. Analysis required."
                                                time="12m ago"
                                                isLocked
                                            />
                                            <NotificationCard
                                                icon={<User size={14} />}
                                                title="Network Status"
                                                desc="A new operator has officially entered the network."
                                                time="1h ago"
                                                isLocked
                                            />

                                            <div className="pt-8 space-y-4 border-t border-white/5 opacity-40">
                                                <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Regional Strength</h4>
                                                <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 space-y-3">
                                                    <div className="flex justify-between text-[10px] font-bold uppercase">
                                                        <span>Node Load</span>
                                                        <span className="text-primary">0%</span>
                                                    </div>
                                                    <Progress value={0} className="h-1 bg-primary/20" indicatorClassName="bg-primary" />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Overlay for Right Sidebar */}
                                        <div className="absolute inset-x-0 bottom-0 top-[60%] bg-gradient-to-t from-[#0B0E11] via-[#0B0E11]/90 to-transparent flex flex-col items-center justify-center p-8 text-center z-20">
                                            <div className="space-y-4">
                                                <LucideHistory size={40} className="mx-auto text-primary/40 opacity-50" />
                                                <div className="space-y-1">
                                                    <h4 className="font-black text-xs uppercase tracking-widest">Feed Locked</h4>
                                                    <p className="text-[10px] text-muted-foreground leading-relaxed">
                                                        Global intelligence feeds and network alerts require an authenticated operator connection.
                                                    </p>
                                                </div>
                                                <Button
                                                    variant="outline"
                                                    className="w-full h-10 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-primary hover:text-white transition-all"
                                                    onClick={() => navigate('/login')}
                                                >
                                                    Login to view
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </aside>
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* Guest Feedback Modal (Simplified) */}
            {isFeedbackOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-background/90 backdrop-blur-md" onClick={() => setIsFeedbackOpen(false)} />
                    <div className="relative z-[210] w-full max-w-lg bg-card border border-white/10 rounded-[2rem] p-8 shadow-2xl">
                        <h2 className="text-2xl font-black uppercase mb-4">Guest Feedback</h2>
                        <p className="text-muted-foreground mb-6">Your insights help us refine the truth protocol. (Guest feedback is logged anonymously).</p>
                        <textarea
                            className="w-full h-32 rounded-2xl bg-white/5 border border-white/10 p-4 focus:outline-none focus:border-primary/50 transition-colors mb-4"
                            placeholder="Enter your transmission..."
                        />
                        <div className="flex gap-3">
                            <Button onClick={() => {
                                toast.success("Feedback received via anonymous channel.");
                                setIsFeedbackOpen(false);
                            }} className="flex-1 rounded-xl h-12 font-bold">Transmit Feedback</Button>
                            <Button variant="ghost" onClick={() => setIsFeedbackOpen(false)} className="rounded-xl h-12 font-bold">Cancel</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
