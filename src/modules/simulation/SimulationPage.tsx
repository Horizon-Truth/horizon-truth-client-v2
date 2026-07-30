import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { TRIAL_SCENARIO } from './data/trial-scenario';
import type { Scene, Choice } from './data/trial-scenario';
import { useAuthStore } from '@/store/auth.store';
import { cn } from '@/shared/lib/utils';
import { ShieldCheck, ArrowRight, Share2, User, MessageCircle, LayoutDashboard, Target, BookOpen, GraduationCap, Brain, CheckCircle2 } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { LearningMomentCard } from '@/modules/gamification/components/LearningMomentCard';
import { Confetti } from '@/modules/gamification/components/Confetti';
import { TECHNIQUES } from '@/modules/gamification/learning-content';

const SimulationPage = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuthStore();
    const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
    const [trustScore, setTrustScore] = useState(50);
    const [bestChoices, setBestChoices] = useState(0);
    const [isCompleted, setIsCompleted] = useState(false);
    const [selectedChoice, setSelectedChoice] = useState<Choice | null>(null);

    const totalScenes = TRIAL_SCENARIO.scenes.length;
    const currentScene = TRIAL_SCENARIO.scenes[currentSceneIndex];

    const handleChoice = (choice: Choice) => {
        setSelectedChoice(choice);
        if (choice.isBest) setBestChoices(prev => prev + 1);
        setTrustScore(prev => Math.min(100, Math.max(0, prev + choice.trustImpact)));
    };

    const nextStep = () => {
        setSelectedChoice(null);
        if (currentSceneIndex < totalScenes - 1) {
            setCurrentSceneIndex(prev => prev + 1);
        } else {
            setIsCompleted(true);
        }
    };

    const accuracy = Math.round((bestChoices / totalScenes) * 100);

    // Techniques the player has faced so far (for the results screen)
    const coveredTechniques = useMemo(
        () => TRIAL_SCENARIO.scenes
            .map(s => TECHNIQUES.find(t => t.key === s.techniqueKey))
            .filter((t): t is NonNullable<typeof t> => !!t),
        []
    );

    const renderSceneContent = (scene: Scene) => {
        if (scene.type === 'SOCIAL_POST') {
            return (
                <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="p-4 flex items-center gap-3 border-b border-border">
                        <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center text-primary font-bold" aria-hidden>
                            {scene.author[0]}
                        </div>
                        <div>
                            <p className="font-bold text-sm tracking-tight">{scene.author}</p>
                            <p className="text-[11px] text-muted-foreground">
                                {scene.handle ? `${scene.handle} · ` : ''}{scene.timestamp}
                            </p>
                        </div>
                        <div className="ml-auto">
                            <Share2 size={16} className="text-muted-foreground" aria-hidden />
                        </div>
                    </div>
                    {scene.mediaUrl && (
                        <div className="aspect-video overflow-hidden bg-muted">
                            <img src={scene.mediaUrl} alt="Attached to the post — treat with suspicion" className="w-full h-full object-cover" loading="lazy" />
                        </div>
                    )}
                    <div className="p-6">
                        <p className="text-base sm:text-lg leading-relaxed font-medium">{scene.content}</p>
                    </div>
                </div>
            );
        }

        return (
            <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-lg p-6 animate-in fade-in slide-in-from-left-4 duration-500">
                <div className="flex items-start gap-4 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary" aria-hidden>
                        <MessageCircle size={24} />
                    </div>
                    <div>
                        <h4 className="font-bold text-lg">{scene.author}</h4>
                        <p className="text-sm text-muted-foreground">Someone you trust is asking for your advice.</p>
                    </div>
                </div>

                <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0" aria-hidden>
                        <User size={20} className="text-muted-foreground" />
                    </div>
                    <div className="bg-muted/60 p-4 rounded-2xl rounded-tl-none border border-border max-w-[80%]">
                        <p className="text-sm font-medium leading-relaxed">{scene.content}</p>
                        <p className="text-[10px] text-muted-foreground mt-2">{scene.timestamp}</p>
                    </div>
                </div>
            </div>
        );
    };

    if (isCompleted) {
        const passed = accuracy >= 70;
        return (
            <div className="min-h-screen bg-background text-foreground relative flex items-center justify-center p-4 py-12 overflow-hidden">
                {passed && <Confetti />}
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary/10 blur-[120px] rounded-full" />

                <div className="w-full max-w-2xl z-10 space-y-6 animate-in zoom-in-95 duration-700">
                    <div className="text-center space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider">
                            <ShieldCheck size={14} aria-hidden /> Trial complete
                        </div>
                        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
                            {passed ? 'You have sharp instincts.' : 'The feed fooled you — this time.'}
                        </h1>
                        <p className="text-base sm:text-lg text-muted-foreground max-w-lg mx-auto">
                            {passed
                                ? 'You saw through most of the manipulation. Imagine what you could do fully trained.'
                                : 'Everyone falls for these techniques at first — that\'s why they work. Now you know what to watch for.'}
                        </p>
                    </div>

                    {/* Results */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-2xl border border-border bg-card p-5 text-center shadow-sm">
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1 flex items-center justify-center gap-1.5">
                                <ShieldCheck size={12} aria-hidden /> Trust Score
                            </p>
                            <p className="text-3xl font-black tabular-nums">{trustScore}%</p>
                        </div>
                        <div className="rounded-2xl border border-border bg-card p-5 text-center shadow-sm">
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1 flex items-center justify-center gap-1.5">
                                <Target size={12} aria-hidden /> Accuracy
                            </p>
                            <p className="text-3xl font-black tabular-nums">{accuracy}%</p>
                            <p className="text-[11px] text-muted-foreground mt-1">{bestChoices} of {totalScenes} best calls</p>
                        </div>
                    </div>

                    {/* Techniques faced */}
                    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-3">
                        <p className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                            <Brain size={14} className="text-primary" aria-hidden /> Techniques you faced
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {coveredTechniques.map(t => (
                                <span key={t.key} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/15 text-xs font-bold text-primary">
                                    <CheckCircle2 size={12} aria-hidden /> {t.title}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* What you learned */}
                    <div className="space-y-3">
                        <p className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2 px-1">
                            <BookOpen size={14} className="text-primary" aria-hidden /> What you learned
                        </p>
                        {[
                            { icon: <GraduationCap size={18} aria-hidden />, label: 'The skill', text: TRIAL_SCENARIO.learningObjective },
                            { icon: <Brain size={18} aria-hidden />, label: 'Why it works on us', text: TRIAL_SCENARIO.psychologicalTrigger },
                            { icon: <ShieldCheck size={18} aria-hidden />, label: 'How to protect yourself', text: TRIAL_SCENARIO.preventionLesson },
                        ].map((lesson, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -12 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 + i * 0.15 }}
                                className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm"
                            >
                                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                    {lesson.icon}
                                </div>
                                <div className="space-y-1 min-w-0">
                                    <p className="text-xs font-black uppercase tracking-wider text-muted-foreground">{lesson.label}</p>
                                    <p className="text-sm leading-relaxed">{lesson.text}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* CTA */}
                    <Card className="bg-card border-border shadow-lg overflow-hidden">
                        <CardContent className="p-6 sm:p-8">
                            <div className="flex flex-col md:flex-row gap-6 items-center">
                                <div className="flex-1 text-center md:text-left">
                                    <h3 className="text-xl sm:text-2xl font-bold mb-2">This was one mission. There are many more.</h3>
                                    <p className="text-xs sm:text-sm text-muted-foreground">
                                        Create a free account to earn XP, climb 11 ranks from Recruit to Legend, keep a daily
                                        streak, and face harder missions — deepfakes, doctored charts, coordinated campaigns.
                                    </p>
                                </div>
                                <div className="flex flex-col gap-3 w-full md:w-auto">
                                    {isAuthenticated ? (
                                        <Button
                                            onClick={() => navigate('/dashboard/game')}
                                            className="w-full sm:w-auto h-12 px-8 rounded-xl font-bold shadow-lg shadow-primary/20 gap-2"
                                        >
                                            Go to your missions <ArrowRight size={18} aria-hidden />
                                        </Button>
                                    ) : (
                                        <Button
                                            onClick={() => navigate('/register')}
                                            className="w-full sm:w-auto h-12 px-8 rounded-xl font-bold shadow-lg shadow-primary/20 gap-2"
                                        >
                                            Start training free <ArrowRight size={18} aria-hidden />
                                        </Button>
                                    )}
                                    <Button
                                        variant="ghost"
                                        onClick={() => navigate('/')}
                                        className="w-full sm:w-auto h-12 px-8 rounded-xl font-bold"
                                    >
                                        Back to home
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
        <div className="min-h-screen bg-background text-foreground relative flex flex-col p-4 md:p-8 overflow-hidden">
            <div className="absolute top-[-5%] left-[-5%] w-[30%] h-[30%] bg-primary/5 blur-[100px] rounded-full" />
            <div className="absolute bottom-[-5%] right-[-5%] w-[30%] h-[30%] bg-secondary/5 blur-[100px] rounded-full" />

            {/* Header */}
            <header className="relative z-10 flex items-center justify-between mb-8 sm:mb-10 max-w-6xl w-full mx-auto">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 flex-shrink-0" aria-hidden>
                        <ShieldCheck className="text-primary-foreground h-6 w-6" />
                    </div>
                    <h2 className="font-bold tracking-tight text-xl hidden sm:block">Horizon Truth — Trial Mission</h2>
                </div>

                <div className="flex items-center gap-4 sm:gap-6">
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] font-bold text-muted-foreground tracking-widest uppercase">Trust Score</span>
                        <div className="flex items-center gap-2">
                            <div
                                className="w-24 sm:w-32 h-2 bg-muted rounded-full overflow-hidden hidden xs:block"
                                role="progressbar"
                                aria-valuenow={trustScore}
                                aria-valuemin={0}
                                aria-valuemax={100}
                                aria-label="Trust score"
                            >
                                <div
                                    className={cn(
                                        "h-full transition-all duration-1000",
                                        trustScore > 70 ? "bg-emerald-500" : trustScore > 40 ? "bg-amber-500" : "bg-destructive"
                                    )}
                                    style={{ width: `${trustScore}%` }}
                                />
                            </div>
                            <span className="font-bold text-base sm:text-lg tabular-nums">{trustScore}</span>
                        </div>
                    </div>
                </div>
            </header>

            {isAuthenticated && (
                <div className="relative z-20 max-w-6xl w-full mx-auto mb-6">
                    <Button
                        variant="outline"
                        onClick={() => navigate('/dashboard/game')}
                        className="bg-primary/10 border-primary/20 hover:bg-primary/20 text-primary font-bold rounded-xl"
                    >
                        <LayoutDashboard className="mr-2 h-4 w-4" aria-hidden /> Go to your missions
                    </Button>
                </div>
            )}

            {/* Main */}
            <main className="flex-1 relative z-10 max-w-4xl w-full mx-auto flex flex-col gap-8 pb-12">
                <div className="space-y-3 px-2 sm:px-0 text-center sm:text-left">
                    <p className="text-primary font-bold text-[10px] sm:text-xs uppercase tracking-widest">
                        Scene {currentSceneIndex + 1} of {totalScenes}
                    </p>
                    <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{TRIAL_SCENARIO.title}</h3>
                    <div
                        className="w-full max-w-xs mx-auto sm:mx-0 h-1.5 bg-muted rounded-full overflow-hidden"
                        role="progressbar"
                        aria-valuenow={Math.round(((currentSceneIndex + 1) / totalScenes) * 100)}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label="Trial progress"
                    >
                        <motion.div
                            animate={{ width: `${((currentSceneIndex + 1) / totalScenes) * 100}%` }}
                            className="h-full rounded-full bg-primary"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 flex-1">
                    <div className="lg:col-span-3 space-y-6">
                        {renderSceneContent(currentScene)}

                        <AnimatePresence>
                            {selectedChoice && (
                                <div className="space-y-4">
                                    <LearningMomentCard
                                        correct={selectedChoice.isBest || selectedChoice.trustImpact > 0 ? true : selectedChoice.trustImpact < 0 ? false : null}
                                        feedback={selectedChoice.feedback}
                                        choiceLabel={selectedChoice.text}
                                        trap={selectedChoice.trap}
                                        trustDelta={selectedChoice.trustImpact}
                                        tipSeed={currentScene.id}
                                    />
                                    <Button
                                        onClick={nextStep}
                                        className="w-full h-11 rounded-xl font-bold bg-primary text-primary-foreground hover:shadow-lg hover:shadow-primary/20"
                                    >
                                        {currentSceneIndex < totalScenes - 1 ? 'Next scene' : 'See my results'}
                                        <ArrowRight size={16} className="ml-2" aria-hidden />
                                    </Button>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="lg:col-span-2 flex flex-col gap-3">
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 px-1">What do you do?</p>
                        {currentScene.choices.map((choice) => (
                            <button
                                key={choice.id}
                                disabled={!!selectedChoice}
                                onClick={() => handleChoice(choice)}
                                className={cn(
                                    "p-5 text-left rounded-2xl border transition-all duration-200 group relative overflow-hidden",
                                    "focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none",
                                    selectedChoice?.id === choice.id
                                        ? "bg-primary border-primary text-primary-foreground shadow-xl shadow-primary/20 translate-x-1"
                                        : selectedChoice
                                            ? "opacity-50 border-border cursor-not-allowed"
                                            : "bg-card border-border hover:border-primary/50 hover:-translate-y-1 hover:shadow-lg"
                                )}
                            >
                                <div className="flex items-center justify-between gap-4">
                                    <span className="font-bold text-sm">{choice.text}</span>
                                    <ArrowRight size={18} className={cn("shrink-0 transition-transform", selectedChoice?.id === choice.id ? "translate-x-0" : "-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100")} aria-hidden />
                                </div>
                            </button>
                        ))}

                        <div className="mt-auto pt-8">
                            <div className="p-6 rounded-2xl bg-muted/50 border border-border">
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
