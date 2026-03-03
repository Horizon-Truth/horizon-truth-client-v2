import { useEffect, useState } from 'react';
import { useGuestGameStore } from '@/store/guest-game.store';
import {
    ShieldCheck,
    MessageSquare,
    ArrowRight,
    Trophy,
    Home,
    UserPlus
} from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ScenarioList } from '../engine/components/ScenarioList';
import { toast } from 'sonner';

export default function GuestGamePage() {
    const {
        activeScenario,
        currentScene,
        isCompleted,
        trustScore,
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
                    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        {/* Hero Section */}
                        <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-card/20 border border-white/5 rounded-[2rem] p-8 sm:p-12 backdrop-blur-2xl">
                            <div className="space-y-4 text-center md:text-left">
                                <h1 className="text-3xl sm:text-5xl font-black italic uppercase tracking-wider">Mission Command</h1>
                                <p className="text-muted-foreground text-lg max-w-xl">
                                    Welcome, Operator. Access the network protocols below to begin your influence training. Create an account to save your progress and join the global leaderboard.
                                </p>
                                <div className="flex flex-wrap gap-4 justify-center md:justify-start pt-2">
                                    <Button
                                        onClick={handleFeedback}
                                        className="rounded-xl h-12 px-6 font-bold gap-2 bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 hover:bg-indigo-500/20 transition-all"
                                    >
                                        <MessageSquare size={20} />
                                        Give Feedback
                                    </Button>
                                </div>
                            </div>
                            <div className="hidden lg:flex flex-col items-center gap-2 p-8 rounded-3xl bg-primary/5 border border-primary/10 max-w-xs text-center">
                                <Trophy size={48} className="text-primary opacity-50 mb-2" />
                                <h4 className="font-black text-sm uppercase">Pro Status Awaits</h4>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    Registered players earn badges, level up, and gain access to advanced tactical scenarios.
                                </p>
                            </div>
                        </div>

                        {/* Scenario List - Passing custom start handler */}
                        <div className="bg-card/20 border border-white/5 rounded-[2rem] p-4 sm:p-10 backdrop-blur-2xl">
                            <ScenarioList onStartGame={startGuestGame} guestMode />
                        </div>
                    </div>
                )}

                {/* Local Guest Game Play */}
                {(activeScenario || isCompleted) && (
                    <div className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-3xl flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-500">
                        {/* Guest Session UI (Local) */}
                        <div className="w-full max-w-6xl max-h-[100vh] md:max-h-[90vh] overflow-y-auto custom-scrollbar relative">
                            <div className="bg-card/30 border border-white/10 rounded-[1.5rem] sm:rounded-[3rem] p-4 sm:p-12 shadow-2xl backdrop-blur-2xl relative">
                                {isCompleted ? (
                                    <div className="text-center space-y-8 py-12 animate-in zoom-in-95 duration-700">
                                        <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/30">
                                            <Trophy size={48} className="text-primary" />
                                        </div>
                                        <div className="space-y-2">
                                            <h2 className="text-4xl sm:text-6xl font-black tracking-tighter uppercase italic">Training Complete</h2>
                                            <p className="text-xl text-muted-foreground font-medium">Final Trust Score: <span className="text-primary font-black">{trustScore}</span></p>
                                        </div>

                                        <div className="max-w-md mx-auto p-6 rounded-3xl bg-white/5 border border-white/10 space-y-4">
                                            <h4 className="font-bold text-lg">Don't lose your progress</h4>
                                            <p className="text-sm text-muted-foreground leading-relaxed">
                                                Your guest play data has been recorded for analysis, but your stats won't be saved to a profile. Create an account now to claim your first reward!
                                            </p>
                                            <Button
                                                onClick={() => navigate('/register')}
                                                className="w-full h-12 rounded-xl font-black uppercase tracking-widest shadow-xl shadow-primary/20"
                                            >
                                                Claim Account & XP
                                            </Button>
                                        </div>

                                        <div className="flex items-center justify-center gap-4">
                                            <Button variant="ghost" onClick={resetGuestGame} className="font-bold underline">Try Another Mission</Button>
                                            <Button variant="ghost" onClick={() => navigate('/')} className="font-bold">Exit Component</Button>
                                        </div>
                                    </div>
                                ) : (
                                    // Simulated Game Session Component or simplified local version
                                    <div className="space-y-8">
                                        {/* Local Session Implementation or Simplified view */}
                                        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                                            <div className="flex items-center gap-4">
                                                <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-black text-primary uppercase tracking-widest">
                                                    Mission: {activeScenario?.title}
                                                </div>
                                            </div>
                                            <Button variant="ghost" size="sm" onClick={resetGuestGame} className="text-xs text-muted-foreground">Abort Protocol</Button>
                                        </div>

                                        {currentScene && (
                                            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
                                                <div className="lg:col-span-3 space-y-8 animate-in slide-in-from-left-4 duration-500">
                                                    <div className="space-y-2">
                                                        <h3 className="text-3xl font-black tracking-tight">{currentScene.title}</h3>
                                                        <p className="text-muted-foreground leading-relaxed font-medium">{currentScene.description}</p>
                                                    </div>

                                                    {/* Simple Content Display */}
                                                    <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 shadow-inner">
                                                        {currentScene.content?.textBody || currentScene.description}
                                                    </div>
                                                </div>

                                                <div className="lg:col-span-2 flex flex-col gap-3 animate-in slide-in-from-right-4 duration-500">
                                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2">Protocol Choices</p>
                                                    {currentScene.choices?.map((choice: any) => (
                                                        <button
                                                            key={choice.id || choice.label}
                                                            onClick={() => submitGuestChoice(choice)}
                                                            className="group p-5 text-left rounded-2xl bg-white/5 border border-white/10 hover:border-primary/50 hover:bg-primary/10 transition-all duration-300 flex items-center justify-between gap-4"
                                                        >
                                                            <span className="font-bold text-sm tracking-tight">{choice.label}</span>
                                                            <ArrowRight size={18} className="shrink-0 -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all" />
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
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
