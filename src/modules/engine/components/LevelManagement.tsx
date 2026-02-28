import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, X, Info, Trophy, Clock, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { engineService } from "@/services/engine.service";
import { toast } from "sonner";
import { cn } from "@/shared/lib/utils";

interface GameLevel {
    id: string;
    levelNumber: number;
    name: string;
    description: string;
    estimatedDurationMinutes: number;
    isActive: boolean;
}

interface LevelManagementProps {
    onClose: () => void;
}

export default function LevelManagement({ onClose }: LevelManagementProps) {
    const [levels, setLevels] = useState<GameLevel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingLevel, setEditingLevel] = useState<GameLevel | null>(null);

    const [formData, setFormData] = useState({
        levelNumber: 1,
        name: "",
        description: "",
        estimatedDurationMinutes: 15,
        isActive: true
    });

    const fetchLevels = async () => {
        setIsLoading(true);
        try {
            const data = await engineService.getLevels();
            setLevels(data || []);
        } catch (error) {
            toast.error("Failed to load levels");
        } finally {
            setIsLoading(false);
        }
    };