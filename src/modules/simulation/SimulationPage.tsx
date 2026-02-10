import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TRIAL_SCENARIO } from './data/trial-scenario';
import type { Scene, Choice } from './data/trial-scenario';
import { useAuthStore } from '@/store/auth.store';
import { cn } from '@/shared/lib/utils';
import { ShieldCheck, ArrowRight, Share2, AlertTriangle, User, MessageCircle, Info } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';

const SimulationPage = () => {
    const navigate = useNavigate();
    useAuthStore();
    const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
    const [trustScore, setTrustScore] = useState(50);
    const [isCompleted, setIsCompleted] = useState(false);
    const [feedback, setFeedback] = useState<string | null>(null);
    const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);

    const currentScene = TRIAL_SCENARIO.scenes[currentSceneIndex];

    const handleChoice = (choice: Choice) => {
        setSelectedChoiceId(choice.id);
        setFeedback(choice.feedback);
        setTrustScore(prev => Math.min(100, Math.max(0, prev + choice.trustImpact)));
    };

    const nextStep = () => {
        setFeedback(null);
        setSelectedChoiceId(null);
        if (currentSceneIndex < TRIAL_SCENARIO.scenes.length - 1) {
            setCurrentSceneIndex(prev => prev + 1);
        } else {
            setIsCompleted(true);
        }
    };

    const renderSceneContent = (scene: Scene) => {
        if (scene.type === 'SOCIAL_POST') {
            return (
                <div className="bg-card border border-white/5 rounded-2xl overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="p-4 flex items-center gap-3 border-b border-white/5">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                            {scene.author[0]}
                        </div>
                        <div>
                            <p className="font-bold text-sm tracking-tight">{scene.author}</p>
                            <p className="text-[10px] text-muted-foreground">{scene.timestamp}</p>
                        </div>
                        <div className="ml-auto">
                            <Share2 size={16} className="text-muted-foreground" />
                        </div>
                    </div>
                    {scene.mediaUrl && (
                        <div className="aspect-video overflow-hidden">
                            <img src={scene.mediaUrl} alt="Post content" className="w-full h-full object-cover" />
                        </div>
                    )}
                    <div className="p-6">
                        <p className="text-lg leading-relaxed font-medium">{scene.content}</p>
                    </div>
                </div>
            );
        }

        return (
            <div className="bg-card border border-white/5 rounded-2xl overflow-hidden shadow-2xl p-6 animate-in fade-in slide-in-from-left-4 duration-500">
                <div className="flex items-start gap-4 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                        <MessageCircle size={24} />
                    </div>
                    <div>
                        <h4 className="font-bold text-lg">Chat Context</h4>
                        <p className="text-sm text-muted-foreground">A trusted contact is asking for your advice.</p>
                    </div>
                </div>

                <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                        <User size={20} className="text-muted-foreground" />
                    </div>
                    <div className="bg-muted/30 p-4 rounded-2xl rounded-tl-none border border-white/5 max-w-[80%]">
                        <p className="text-sm font-medium leading-relaxed">{scene.content}</p>
                        <p className="text-[10px] text-muted-foreground mt-2">{scene.timestamp}</p>
                    </div>
                </div>
            </div>
        );
    };

    if (isCompleted) {
        return (
            <div className="min-h-screen bg-background relative flex items-center justify-center p-4 overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '1s' }} />

                <div className="w-full max-w-2xl z-10 text-center space-y-8 animate-in zoom-in-95 duration-700">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-4">
                        <ShieldCheck size={14} /> Simulation Ended
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Final Trust Score: {trustScore}</h1>
                    <p className="text-xl text-muted-foreground max-w-lg mx-auto">
                        Your skills are sharp, but the protocol demands more. Join the Horizon Network to unlock full training capabilities.
                    </p>

                    <Card className="bg-card/50 backdrop-blur-2xl border-white/10 shadow-2xl overflow-hidden">
                        <CardContent className="p-8">
                            <div className="flex flex-col md:flex-row gap-6 items-center">
                                <div className="flex-1 text-left">
                                    <h3 className="text-2xl font-bold mb-2">Save Your Progress</h3>
                                    <p className="text-sm text-muted-foreground">Registration allows you to track your growth across multiple scenarios and join the global leaderboard.</p>
                                </div>
                                <div className="flex flex-col gap-3 w-full md:w-auto">
                                    <Button
                                        onClick={() => navigate('/register')}
                                        className="h-12 px-8 rounded-xl font-bold shadow-lg shadow-primary/20 gap-2"
                                    >
                                        Register Now <ArrowRight size={18} />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        onClick={() => navigate('/')}
                                        className="h-12 px-8 rounded-xl font-bold"
                                    >
                                        Back to Home
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background relative flex flex-col p-4 md:p-8 overflow-hidden">
            {/* Design Accents */}
            <div className="absolute top-[-5%] left-[-5%] w-[30%] h-[30%] bg-primary/5 blur-[100px] rounded-full" />
            <div className="absolute bottom-[-5%] right-[-5%] w-[30%] h-[30%] bg-primary/5 blur-[100px] rounded-full" />

            {/* Header */}
            <header className="relative z-10 flex items-center justify-between mb-12 max-w-6xl w-full mx-auto">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                        <ShieldCheck className="text-primary-foreground h-6 w-6" />
                    </div>
                    <h2 className="font-bold tracking-tight text-xl hidden sm:block">HORIZON SIMULATOR</h2>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] font-bold text-muted-foreground tracking-widest uppercase">Protocol Trust</span>
                        <div className="flex items-center gap-2">
                            <div className="w-32 h-2 bg-muted rounded-full overflow-hidden hidden sm:block">
                                <div
                                    className={cn(
                                        "h-full transition-all duration-1000",
                                        trustScore > 70 ? "bg-emerald-500" : trustScore > 40 ? "bg-amber-500" : "bg-destructive"
                                    )}
                                    style={{ width: `${trustScore}%` }}
                                />
                            </div>
                            <span className="font-bold text-lg tabular-nums">{trustScore}</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 relative z-10 max-w-4xl w-full mx-auto flex flex-col gap-8 pb-12">
                <div className="space-y-2">
                    <p className="text-primary font-bold text-xs uppercase tracking-widest">Scenario trial {currentSceneIndex + 1}/{TRIAL_SCENARIO.scenes.length}</p>
                    <h3 className="text-3xl font-extrabold tracking-tight">{TRIAL_SCENARIO.title}</h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 flex-1">
                    <div className="lg:col-span-3">
                        {renderSceneContent(currentScene)}

                        {feedback && (
                            <div className="mt-6 p-6 rounded-2xl bg-primary/10 border border-primary/20 animate-in slide-in-from-top-2 duration-300">
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                                        <Info className="text-primary" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm mb-1 uppercase tracking-wider">Protocol Feedback</h4>
                                        <p className="text-sm text-foreground/90 font-medium leading-relaxed">{feedback}</p>
                                    </div>
                                </div>
                                <Button
                                    onClick={nextStep}
                                    className="mt-6 w-full h-11 rounded-xl font-bold bg-primary text-primary-foreground hover:shadow-lg hover:shadow-primary/20"
                                >
                                    Continue Mission
                                </Button>
                            </div>
                        )}
                    </div>

                    <div className="lg:col-span-2 flex flex-col gap-3">
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 px-1">Engagement Choices</p>
                        {currentScene.choices.map((choice) => (
                            <button
                                key={choice.id}
                                disabled={!!feedback}
                                onClick={() => handleChoice(choice)}
                                className={cn(
                                    "p-5 text-left rounded-2xl border transition-all duration-200 group relative overflow-hidden",
                                    selectedChoiceId === choice.id
                                        ? "bg-primary border-primary text-primary-foreground shadow-xl shadow-primary/20 translate-x-1"
                                        : feedback
                                            ? "opacity-50 border-white/5 cursor-not-allowed"
                                            : "bg-card/50 border-white/10 hover:border-primary/50 hover:bg-card hover:-translate-y-1 hover:shadow-lg"
                                )}
                            >
                                <div className="flex items-center justify-between gap-4">
                                    <span className="font-bold text-sm">{choice.text}</span>
                                    <ArrowRight size={18} className={cn("shrink-0 transition-transform", selectedChoiceId === choice.id ? "translate-x-0" : "-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100")} />
                                </div>
                            </button>
                        ))}

                        <div className="mt-auto pt-8">
                            <div className="p-6 rounded-2xl bg-destructive/5 border border-destructive/10">
                                <div className="flex gap-3 items-center mb-2">
                                    <AlertTriangle className="text-destructive h-4 w-4" />
                                    <h4 className="text-xs font-bold text-destructive uppercase tracking-wider underline underline-offset-4 decoration-destructive/30">Intelligence Note</h4>
                                </div>
                                <p className="text-xs text-muted-foreground leading-relaxed italic">
                                    "The highest trust comes from the quietest scrutiny. Don't let viral velocity dictate your reality."
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default SimulationPage;
