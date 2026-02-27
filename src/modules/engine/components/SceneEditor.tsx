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