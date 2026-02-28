import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Play, Info, Network } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { engineService, type Scenario } from "@/services/engine.service";
import { Badge } from "@/shared/components/ui/badge";
import SceneEditor from "../components/SceneEditor";
import { ScenarioMapModal } from "../components/ScenarioMapModal";
import { cn } from "@/shared/lib/utils";
import { toast } from "sonner";

export default function ScenarioDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [scenario, setScenario] = useState<Scenario | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isMapOpen, setIsMapOpen] = useState(false);

    const fetchScenario = async () => {
        if (!id) return;
        setIsLoading(true);
        try {
            const data = await engineService.getScenarioById(id);
            setScenario(data);
        } catch (error) {
            console.error("Failed to fetch scenario:", error);
            toast.error("Failed to load scenario details");
            navigate("/dashboard/engine");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchScenario();
    }, [id]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            </div>
        );
    }

    if (!scenario) return null;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <Button
                    variant="ghost"
                    onClick={() => navigate("/dashboard/engine")}
                    className="gap-2 rounded-xl hover:bg-primary/5 font-bold"