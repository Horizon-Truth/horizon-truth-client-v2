import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Save, X, Info, Type, Image as ImageIcon, Video, MessageSquare, Layout, ArrowRight, Link2, Scale } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { engineService } from "@/services/engine.service";
import { toast } from "sonner";
import { cn } from "@/shared/lib/utils";

interface SceneEditorProps {
    scenarioId: string;
}

export default function SceneEditor({ scenarioId }: SceneEditorProps) {
    const [scenes, setScenes] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingScene, setEditingScene] = useState<any | null>(null);
    const [formSubmitted, setFormSubmitted] = useState(false);

    // Form State
    const [title, setTitle] = useState("");
    const [sceneType, setSceneType] = useState("INVESTIGATION");
    const [contentType, setContentType] = useState("TEXT");
    const [order, setOrder] = useState(1);
    const [isTerminal, setIsTerminal] = useState(false);

    // Rich Choices State
    interface ChoiceOutcome {
        outcomeType: string;
        score: number;
        trustScoreDelta: number;
        message: string;
        endScenario: boolean;
    }

    interface SceneChoice {
        id?: string;
        label: string;
        actionType: string;
        nextSceneId?: string;
        scoreImpact?: number;
        influenceImpact?: number;
        outcomes: ChoiceOutcome[];
    }

    const [choices, setChoices] = useState<SceneChoice[]>([]);
    const [editingChoiceIndex, setEditingChoiceIndex] = useState<number | null>(null);

    // New choice form
    const [newChoiceLabel, setNewChoiceLabel] = useState("");
    const [showChoiceForm, setShowChoiceForm] = useState(false);
    const [currentOutcome, setCurrentOutcome] = useState<ChoiceOutcome>({
        outcomeType: "NEUTRAL",
        score: 0,
        trustScoreDelta: 0,
        message: "",
        endScenario: false
    });

    const [textBody, setTextBody] = useState("");
    const [mediaUrl, setMediaUrl] = useState("");
    // JSON payload for interactive challenge types (URL_INSPECTION / SOURCE_COMPARISON)
    const [challengeJson, setChallengeJson] = useState("");
    const isChallengeType = (t: string) => t === "URL_INSPECTION" || t === "SOURCE_COMPARISON";
    const [selectedNextSceneId, setSelectedNextSceneId] = useState<string>("");
    const [newChoiceScoreImpact, setNewChoiceScoreImpact] = useState(0);
    const [newChoiceInfluenceImpact, setNewChoiceInfluenceImpact] = useState(0);
    const [newChoiceActionType, setNewChoiceActionType] = useState("CHOICE");

    const fetchScenes = async () => {
        setIsLoading(true);
        try {
            const data = await engineService.getScenes(scenarioId);
            setScenes(data);
            if (data.length > 0) {
                setOrder(Math.max(...data.map((s: any) => s.order)) + 1);
            }
        } catch (error) {
            toast.error("Failed to load scenes");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (scenarioId) fetchScenes();
    }, [scenarioId]);

    const resetForm = () => {
        setTitle("");
        setSceneType("INVESTIGATION");
        setContentType("TEXT");
        setChoices([]);
        setNewChoiceLabel("");
        setShowChoiceForm(false);
        setTextBody("");
        setMediaUrl("");
        setChallengeJson("");
        setIsTerminal(false);
        setEditingScene(null);
        setIsFormOpen(false);
        setSelectedNextSceneId("");
        setNewChoiceScoreImpact(0);
        setNewChoiceInfluenceImpact(0);
        setNewChoiceActionType("CHOICE");
        setEditingChoiceIndex(null);
        setFormSubmitted(false);
    };

    const handleEdit = (scene: any) => {
        setEditingScene(scene);
        setTitle(scene.title || "");
        setSceneType(scene.sceneType || "INVESTIGATION");
        setContentType(scene.contentType || "TEXT");
        setOrder(scene.order || 1);
        setIsTerminal(scene.isTerminal || false);

        // Migrate old simple string choices to rich choices if needed
        const loadedChoices = scene.choices || scene.availableChoices?.map((label: string) => ({
            label,
            actionType: "VERIFY",
            outcomes: []
        })) || [];

        setChoices(loadedChoices);
        setTextBody(scene.content?.textBody || "");
        setMediaUrl(scene.content?.imageUrl || scene.content?.videoUrl || "");
        if (isChallengeType(scene.contentType)) {
            const { contentType: _ct, textBody: _tb, ...challenge } = scene.content ?? {};
            setChallengeJson(Object.keys(challenge).length ? JSON.stringify(challenge, null, 2) : "");
        } else {
            setChallengeJson("");
        }
        setIsFormOpen(true);
    };

    const handleSave = async () => {
        setFormSubmitted(true);
        if (!title.trim()) {
            toast.error("Stage Title is required");
            return;
        }
        if (choices.length === 0) {
            toast.error("At least one decision choice is required");
            return;
        }

        let challengeContent: Record<string, any> = {};
        if (isChallengeType(contentType) && challengeJson.trim()) {
            try {
                challengeContent = JSON.parse(challengeJson);
            } catch {
                toast.error("Challenge content is not valid JSON");
                return;
            }
        }

        const sceneData = {
            title,
            sceneType,
            contentType,
            order,
            isTerminal,
            choices, // Replaces availableChoices
            content: {
                ...challengeContent,
                contentType,
                textBody,
                imageUrl: contentType === "IMAGE" ? mediaUrl : undefined,
                videoUrl: contentType === "VIDEO" ? mediaUrl : undefined,
            }
        };

        try {
            if (editingScene) {
                await engineService.updateScene(editingScene.id, sceneData);
                toast.success("Scene updated");
            } else {
                await engineService.createScene(scenarioId, sceneData);
                toast.success("Scene created");
            }
            fetchScenes();
            resetForm();
        } catch (error) {
            toast.error("Failed to save scene");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure?")) return;
        try {
            await engineService.deleteScene(id);
            toast.success("Scene removed");
            fetchScenes();
        } catch (error) {
            toast.error("Failed to delete scene");
        }
    };

    const saveChoice = () => {
        if (!newChoiceLabel.trim()) return;

        const updatedChoice: SceneChoice = {
            label: newChoiceLabel.trim(),
            actionType: newChoiceActionType,
            nextSceneId: selectedNextSceneId || undefined,
            scoreImpact: newChoiceScoreImpact,
            influenceImpact: newChoiceInfluenceImpact,
            outcomes: currentOutcome.message ? [currentOutcome] : []
        };

        if (editingChoiceIndex !== null) {
            const updatedChoices = [...choices];
            updatedChoices[editingChoiceIndex] = updatedChoice;
            setChoices(updatedChoices);
        } else {
            setChoices([...choices, updatedChoice]);
        }

        setNewChoiceLabel("");
        setSelectedNextSceneId("");
        setCurrentOutcome({
            outcomeType: "NEUTRAL",
            score: 0,
            trustScoreDelta: 0,
            message: "",
            endScenario: false
        });
        setEditingChoiceIndex(null);
        setShowChoiceForm(false);
        setNewChoiceScoreImpact(0);
        setNewChoiceInfluenceImpact(0);
    };

    const editChoice = (index: number) => {
        const choice = choices[index];
        setNewChoiceLabel(choice.label);
        setNewChoiceActionType(choice.actionType || "CHOICE");
        setSelectedNextSceneId(choice.nextSceneId || "");
        setNewChoiceScoreImpact(choice.scoreImpact || 0);
        setNewChoiceInfluenceImpact(choice.influenceImpact || 0);

        if (choice.outcomes && choice.outcomes.length > 0) {
            setCurrentOutcome(choice.outcomes[0]);
        } else {
            setCurrentOutcome({
                outcomeType: "NEUTRAL",
                score: 0,
                trustScoreDelta: 0,
                message: "",
                endScenario: false
            });
        }

        setEditingChoiceIndex(index);
        setShowChoiceForm(true);
    };

    const removeChoice = (indexToRemove: number) => {
        setChoices(choices.filter((_, idx) => idx !== indexToRemove));
    };

    return (
        <div className="space-y-6 pt-8 border-t mt-12 animate-in fade-in duration-700">
            <div className="flex items-center justify-between">
                <div>
                    <h4 className="text-xl font-black uppercase italic tracking-wider flex items-center gap-2">
                        <Layout className="text-primary" size={20} />
                        Mission Protocol Stages
                    </h4>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-0.5 opacity-70">
                        Design the branching logic and verification steps.
                    </p>
                </div>
                {!isFormOpen && (
                    <Button
                        onClick={() => { resetForm(); setIsFormOpen(true); }}
                        className="rounded-xl h-10 px-4 font-black text-xs uppercase tracking-widest gap-2 shadow-lg hover:shadow-primary/20 transition-all border border-primary/20"
                    >
                        <Plus size={16} />
                        Append Stage
                    </Button>
                )}
            </div>

            {isFormOpen ? (
                <div className="bg-muted/30 border border-primary/10 rounded-[2rem] p-8 space-y-6 animate-in slide-in-from-top duration-500">
                    <div className="flex items-center justify-between border-b border-primary/5 pb-4 mb-2">
                        <h5 className="font-black uppercase tracking-tighter italic text-primary">
                            {editingScene ? "Reconfigure Stage" : "Initialize New Stage"}
                        </h5>
                        <Button variant="ghost" size="icon" onClick={resetForm} className="rounded-full hover:bg-destructive/10 hover:text-destructive">
                            <X size={20} />
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest ml-1 text-muted-foreground">
                                Stage Title <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                value={title}
                                onChange={(e) => { setTitle(e.target.value); }}
                                placeholder="e.g. Analyzing the Source"
                                className={cn(
                                    "rounded-xl h-12 bg-background shadow-sm focus-visible:ring-1 ring-primary",
                                    formSubmitted && !title.trim()
                                        ? "border border-destructive focus-visible:ring-destructive"
                                        : "border-none"
                                )}
                            />
                            {formSubmitted && !title.trim() && (
                                <p className="text-[11px] text-destructive font-semibold ml-1">Stage title is required.</p>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest ml-1 text-muted-foreground">
                                    Stage Type <span className="text-destructive">*</span>
                                </Label>
                                <select
                                    value={sceneType}
                                    onChange={(e) => setSceneType(e.target.value)}
                                    className="w-full h-12 rounded-xl bg-background border-none shadow-sm focus:ring-1 ring-primary outline-none px-3 text-sm font-bold"
                                >
                                    <option value="INVESTIGATION">Investigation</option>
                                    <option value="ANALYSIS">Analysis</option>
                                    <option value="DECISION">Decision</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest ml-1 text-muted-foreground">Order</Label>
                                <Input
                                    type="number"
                                    value={order}
                                    onChange={(e) => setOrder(parseInt(e.target.value))}
                                    className="rounded-xl h-12 bg-background border-none shadow-sm focus-visible:ring-1 ring-primary font-bold"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-[10px) font-black uppercase tracking-widest ml-1 text-muted-foreground">Stage Description (Narrative)</Label>
                        <textarea
                            value={textBody}
                            onChange={(e) => setTextBody(e.target.value)}
                            rows={3}
                            placeholder="What happens in this stage? What information is presented to the player?"
                            className="w-full rounded-2xl bg-background border-none shadow-sm focus:ring-1 ring-primary outline-none p-4 text-sm resize-none font-medium"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <Label className={cn(
                                "text-[10px] font-black uppercase tracking-widest ml-1",
                                formSubmitted && choices.length === 0 ? "text-destructive" : "text-muted-foreground"
                            )}>
                                Available Choices & Consequences <span className="text-destructive">*</span>
                            </Label>
                            {formSubmitted && choices.length === 0 && (
                                <p className="text-[11px] text-destructive font-semibold ml-1 -mt-2">At least one choice is required.</p>
                            )}

                            {!showChoiceForm ? (
                                <Button onClick={() => setShowChoiceForm(true)} className="w-full rounded-xl border border-dashed border-primary/30 text-primary bg-primary/5 hover:bg-primary/10 h-10">
                                    <Plus size={16} className="mr-2" /> Add Decision Option
                                </Button>
                            ) : (
                                <div className="space-y-3 bg-muted/50 p-3 rounded-2xl border border-primary/20">
                                    <div>
                                        <Label className="text-[10px] font-bold uppercase tracking-widest ml-1 text-muted-foreground">Choice Text</Label>
                                        <Input
                                            value={newChoiceLabel}
                                            onChange={(e) => setNewChoiceLabel(e.target.value)}
                                            placeholder="e.g. Trust the informant"
                                            className="h-9 mt-1"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <Label className="text-[10px] font-bold uppercase tracking-widest ml-1 text-muted-foreground">Action Type</Label>
                                            <select
                                                value={newChoiceActionType}
                                                onChange={(e) => setNewChoiceActionType(e.target.value)}
                                                className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm mt-1 focus:ring-1 ring-primary outline-none"
                                            >
                                                <option value="CHOICE">Choice</option>
                                                <option value="VERIFY">Verify</option>
                                                <option value="SHARE">Share</option>
                                                <option value="REPORT">Report</option>
                                                <option value="INVESTIGATE">Investigate</option>
                                                <option value="IGNORE">Ignore</option>
                                                <option value="NEXT">Next</option>
                                            </select>
                                        </div>
                                        <div>
                                            <Label className="text-[10px] font-bold uppercase tracking-widest ml-1 text-muted-foreground">Next Stage</Label>
                                            <select
                                                value={selectedNextSceneId}
                                                onChange={(e) => setSelectedNextSceneId(e.target.value)}
                                                className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm mt-1 focus:ring-1 ring-primary outline-none"
                                            >
                                                <option value="">Default (Auto)</option>
                                                {scenes.filter(s => s.id !== editingScene?.id).map(s => (
                                                    <option key={s.id} value={s.id}>{s.title}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <Label className="text-[10px] font-bold uppercase tracking-widest ml-1 text-muted-foreground">Choice Score Impact</Label>
                                            <Input
                                                type="number"
                                                value={newChoiceScoreImpact}
                                                onChange={(e) => setNewChoiceScoreImpact(parseInt(e.target.value) || 0)}
                                                className="h-9 mt-1"
                                                placeholder="+10 or -10"
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-[10px] font-bold uppercase tracking-widest ml-1 text-muted-foreground">Influence Impact</Label>
                                            <Input
                                                type="number"
                                                value={newChoiceInfluenceImpact}
                                                onChange={(e) => setNewChoiceInfluenceImpact(parseInt(e.target.value) || 0)}
                                                className="h-9 mt-1"
                                                placeholder="+5 or -5"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <Label className="text-[10px] font-bold uppercase tracking-widest ml-1 text-muted-foreground">Outcome Score (Legacy)</Label>
                                            <Input
                                                type="number"
                                                value={currentOutcome.score}
                                                onChange={(e) => setCurrentOutcome({ ...currentOutcome, score: parseInt(e.target.value) || 0 })}
                                                className="h-9 mt-1"
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-[10px] font-bold uppercase tracking-widest ml-1 text-muted-foreground">Trust Impact</Label>
                                            <Input
                                                type="number"
                                                value={currentOutcome.trustScoreDelta}
                                                onChange={(e) => setCurrentOutcome({ ...currentOutcome, trustScoreDelta: parseInt(e.target.value) || 0 })}
                                                className="h-9 mt-1"
                                                placeholder="-10"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <Label className="text-[10px] font-bold uppercase tracking-widest ml-1 text-muted-foreground">Feedback Message</Label>
                                        <textarea
                                            value={currentOutcome.message}
                                            onChange={(e) => setCurrentOutcome({ ...currentOutcome, message: e.target.value })}
                                            className="w-full h-16 rounded-xl border-input bg-background px-3 py-2 text-sm mt-1"
                                            placeholder="Feedback shown after they make this choice"
                                        />
                                    </div>
                                    <div className="flex items-center gap-2 pb-2">
                                        <input
                                            type="checkbox"
                                            id="end-scenario-choice"
                                            checked={currentOutcome.endScenario}
                                            onChange={(e) => setCurrentOutcome({ ...currentOutcome, endScenario: e.target.checked })}
                                            className="w-4 h-4 rounded"
                                        />
                                        <Label htmlFor="end-scenario-choice" className="text-xs">End scenario if chosen</Label>
                                    </div>

                                    {/* Link selection moved up */}

                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="flex-1"
                                            onClick={() => {
                                                setShowChoiceForm(false);
                                                setEditingChoiceIndex(null);
                                                setNewChoiceLabel("");
                                                setSelectedNextSceneId("");
                                                setNewChoiceScoreImpact(0);
                                                setNewChoiceInfluenceImpact(0);
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                        <Button size="sm" className="flex-1" onClick={saveChoice}>
                                            {editingChoiceIndex !== null ? "Update Choice" : "Save Choice"}
                                        </Button>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-2 mt-4">
                                {choices.map((choice, index) => (
                                    <div key={index} className="flex flex-col bg-background border border-border/60 rounded-xl overflow-hidden text-sm group/choice">
                                        <div className="flex items-center justify-between p-2.5 bg-muted/30">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-primary">{choice.label}</span>
                                                <div className="flex gap-2 mt-0.5">
                                                    <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-primary/10 text-primary uppercase">{choice.actionType}</span>
                                                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500">Trust: {choice.outcomes?.[0]?.trustScoreDelta || 0}</span>
                                                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500">Influence: {choice.influenceImpact || 0}</span>
                                                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-primary/10 text-primary">Score: {choice.scoreImpact || (choice.outcomes?.[0]?.score || 0)}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1 opacity-0 group-hover/choice:opacity-100 transition-opacity">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-7 w-7 rounded-md hover:bg-primary/10 hover:text-primary"
                                                    onClick={() => editChoice(index)}
                                                >
                                                    <Edit2 size={12} />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-7 w-7 rounded-md hover:bg-destructive/10 hover:text-destructive"
                                                    onClick={() => removeChoice(index)}
                                                >
                                                    <X size={12} />
                                                </Button>
                                            </div>
                                        </div>
                                        {choice.outcomes?.[0]?.message && (
                                            <div className="p-2.5 pt-2 border-t border-border/30">
                                                <p className="text-[11px] text-muted-foreground italic line-clamp-2">"{choice.outcomes[0].message}"</p>
                                                {choice.nextSceneId && (
                                                    <div className="mt-1 flex items-center gap-1 text-[9px] font-black uppercase text-blue-400">
                                                        <ArrowRight size={10} />
                                                        Next: {scenes.find(s => s.id === choice.nextSceneId)?.title || "Stage Link"}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        {choice.nextSceneId && (!choice.outcomes || choice.outcomes.length === 0) && (
                                            <div className="p-2.5 pt-2 border-t border-border/30">
                                                <div className="flex items-center gap-1 text-[9px] font-black uppercase text-blue-400">
                                                    <ArrowRight size={10} />
                                                    Next: {scenes.find(s => s.id === choice.nextSceneId)?.title || "Stage Link"}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <Label className="text-[10px] font-black uppercase tracking-widest ml-1 text-muted-foreground">Content Configuration</Label>
                            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                                {[
                                    { id: "TEXT", icon: Type, label: "Text" },
                                    { id: "IMAGE", icon: ImageIcon, label: "Image" },
                                    { id: "VIDEO", icon: Video, label: "Video" },
                                    { id: "CHAT", icon: MessageSquare, label: "Chat" },
                                    { id: "URL_INSPECTION", icon: Link2, label: "URL" },
                                    { id: "SOURCE_COMPARISON", icon: Scale, label: "Sources" },
                                ].map(type => (
                                    <button
                                        key={type.id}
                                        onClick={() => setContentType(type.id)}
                                        className={cn(
                                            "flex flex-col items-center justify-center gap-2 p-3 rounded-2xl border transition-all",
                                            contentType === type.id
                                                ? "bg-primary/10 border-primary text-primary shadow-inner"
                                                : "bg-background border-transparent hover:border-primary/30 text-muted-foreground"
                                        )}
                                    >
                                        <type.icon size={18} />
                                        <span className="text-[10px] font-black uppercase tracking-tighter">{type.label}</span>
                                    </button>
                                ))}
                            </div>
                            {(contentType === "IMAGE" || contentType === "VIDEO") && (
                                <Input
                                    value={mediaUrl}
                                    onChange={(e) => setMediaUrl(e.target.value)}
                                    placeholder={contentType === "IMAGE" ? "https://...png" : "https://youtube.com/..."}
                                    className="rounded-xl h-12 bg-background border-none shadow-sm mt-4"
                                />
                            )}
                            {isChallengeType(contentType) && (
                                <div className="space-y-2 mt-4">
                                    <Label className="text-[10px] font-black uppercase tracking-widest ml-1 text-muted-foreground">
                                        Challenge content (JSON)
                                    </Label>
                                    <textarea
                                        value={challengeJson}
                                        onChange={(e) => setChallengeJson(e.target.value)}
                                        rows={10}
                                        spellCheck={false}
                                        placeholder={contentType === "URL_INSPECTION"
                                            ? '{\n  "url": "https://bbc-news24.co/breaking",\n  "pageTitle": "BREAKING: ...",\n  "pageSnippet": "...",\n  "prompt": "Is this link what it claims to be?",\n  "clues": [\n    { "label": "Domain registered 12 days ago", "detail": "...", "suspicious": true }\n  ]\n}'
                                            : '{\n  "prompt": "Who should you trust on this story?",\n  "sources": [\n    {\n      "name": "National Desk", "handle": "@national_desk", "verified": true,\n      "timestamp": "2h", "headline": "...", "excerpt": "...",\n      "signals": [ { "label": "Named reporters", "detail": "...", "suspicious": false } ]\n    }\n  ]\n}'}
                                        className="w-full rounded-xl bg-background shadow-sm p-4 font-mono text-xs leading-relaxed border border-transparent focus:border-primary/40 focus:outline-none resize-y"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-3 pt-4 border-t border-primary/5">
                        <input
                            type="checkbox"
                            id="is-terminal"
                            checked={isTerminal}
                            onChange={(e) => setIsTerminal(e.target.checked)}
                            className="w-4 h-4 rounded border-primary text-primary"
                        />
                        <Label htmlFor="is-terminal" className="text-xs font-bold uppercase tracking-tight">Terminal Stage (Scenario Ends Here)</Label>
                    </div>

                    <div className="flex gap-3 pt-6 justify-end">
                        <Button variant="ghost" onClick={resetForm} className="rounded-xl h-12 px-8 font-black text-xs uppercase tracking-widest">
                            Discard
                        </Button>
                        <Button onClick={handleSave} className="rounded-xl h-12 px-10 font-black text-xs uppercase tracking-widest gap-2 bg-primary shadow-xl shadow-primary/20">
                            <Save size={18} />
                            {editingScene ? "Commit Changes" : "Deploy Stage"}
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {isLoading ? (
                        <div className="flex justify-center py-20">
                            <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                        </div>
                    ) : scenes.length === 0 ? (
                        <div className="bg-card border-2 border-dashed border-primary/10 rounded-[2.5rem] py-24 text-center group cursor-pointer hover:border-primary/30 transition-all flex flex-col items-center gap-6" onClick={() => setIsFormOpen(true)}>
                            <div className="p-8 rounded-full bg-primary/5 group-hover:scale-110 transition-transform">
                                <Plus size={48} className="text-primary/50 group-hover:text-primary transition-colors" />
                            </div>
                            <div className="space-y-1">
                                <h5 className="text-xl font-black uppercase tracking-tighter italic">No Events Found</h5>
                                <p className="text-sm text-muted-foreground font-medium max-w-sm mx-auto opacity-70">
                                    This mission has no events yet. Add the first event to begin building the experience.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {scenes.map((scene) => (
                                <div key={scene.id} className="group bg-card border border-border/50 rounded-[2rem] p-5 hover:border-primary/40 transition-all hover:bg-accent/5 flex items-center justify-between shadow-sm">
                                    <div className="flex items-center gap-6">
                                        <div className="w-14 h-14 rounded-2xl bg-muted/50 flex flex-col items-center justify-center group-hover:bg-primary/10 transition-colors">
                                            <span className="text-[10px] font-black uppercase text-muted-foreground/50 leading-none mb-1">Order</span>
                                            <span className="text-2xl font-black text-primary leading-none">{scene.order}</span>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-3">
                                                <h5 className="text-lg font-black tracking-tight group-hover:text-primary transition-colors">{scene.title}</h5>
                                                {scene.isTerminal && (
                                                    <div className="bg-destructive/10 text-destructive text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border border-destructive/20">
                                                        Terminal
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">
                                                    <Info size={10} />
                                                    {scene.sceneType}
                                                </div>
                                                <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 border-l border-border/50 pl-4">
                                                    {scene.contentType === "TEXT" && <Type size={10} />}
                                                    {scene.contentType === "IMAGE" && <ImageIcon size={10} />}
                                                    {scene.contentType === "VIDEO" && <Video size={10} />}
                                                    {scene.contentType === "CHAT" && <MessageSquare size={10} />}
                                                    {scene.contentType === "URL_INSPECTION" && <Link2 size={10} />}
                                                    {scene.contentType === "SOURCE_COMPARISON" && <Scale size={10} />}
                                                    {scene.contentType}
                                                </div>
                                                <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-500/5 px-2 py-0.5 rounded-md">
                                                    {scene.availableChoices?.length || 0} Decisive Options
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-10 w-10 rounded-xl hover:bg-primary/10 hover:text-primary"
                                            onClick={() => handleEdit(scene)}
                                        >
                                            <Edit2 size={16} />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-10 w-10 rounded-xl hover:bg-destructive/10 hover:text-destructive"
                                            onClick={() => handleDelete(scene.id)}
                                        >
                                            <Trash2 size={16} />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
