import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Edit2, Trash2, CheckCircle2, XCircle, Play, Info, MessageSquare, Eye, Download, Upload, CheckSquare, Square, Loader2, Trophy } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { engineService, type Scenario } from "@/services/engine.service";
import { Badge } from "@/shared/components/ui/badge";
import { cn } from "@/shared/lib/utils";
import { toast } from "sonner";
import ScenarioForm from "../components/ScenarioForm";
import ScenarioFeedbackList from "../components/ScenarioFeedbackList";
import LevelManagement from "../components/LevelManagement";
import { LanguageBadge } from "@/shared/i18n/components/LanguageBadge";
import { SUPPORTED_LANGUAGES, type LanguageCode } from "@/shared/i18n/languages";

export default function ScenarioManagementPage() {
    const navigate = useNavigate();
    const [scenarios, setScenarios] = useState<Scenario[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isFeedbackListOpen, setIsFeedbackListOpen] = useState(false);
    const [isLevelMgmtOpen, setIsLevelMgmtOpen] = useState(false);
    const [editingScenario, setEditingScenario] = useState<Scenario | undefined>(undefined);
    const [activeScenarioId, setActiveScenarioId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'active' | 'archived'>('active');
    const [languageFilter, setLanguageFilter] = useState<'all' | LanguageCode>('all');
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isImporting, setIsImporting] = useState(false);

    const fetchScenarios = async () => {
        setIsLoading(true);
        try {
            const response = await engineService.getAdminScenarios({
                isArchived: activeTab === 'archived',
                language: languageFilter === 'all' ? undefined : languageFilter,
                limit: 100
            } as any);
            setScenarios(response.data || []);
        } catch (error) {
            console.error("Failed to fetch scenarios:", error);
            toast.error("Failed to load scenarios");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {