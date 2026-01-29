import { useEffect, useState } from "react";
import { reportService } from "@/services/report.service";
import { Badge } from "@/shared/components/ui/badge";
import { Loader2, AlertTriangle, Calendar, User, Globe } from "lucide-react";
import { toast } from "sonner";

interface Report {
    id: string;
    title: string;
    description: string;
    status: string;