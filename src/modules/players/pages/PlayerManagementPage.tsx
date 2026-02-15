import { useEffect, useState } from "react";
import { ShieldCheck, Zap, Target, Award, Search, Filter, Mail, Ban, Unlock, MoreHorizontal } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/shared/components/ui/badge";
import { adminService, type PlayerProfile } from "@/services/admin.service";
import { toast } from "sonner";
import { cn } from "@/shared/lib/utils";

export default function PlayerManagementPage() {
    const [players, setPlayers] = useState<PlayerProfile[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchPlayers = async () => {