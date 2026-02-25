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