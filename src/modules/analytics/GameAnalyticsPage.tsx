import {
    Gamepad2,
    Users,
    Trophy,
    CheckCircle2,
    TrendingUp,
    BarChart3,
    PieChart as PieChartIcon,
    Loader2,
    AlertCircle,
    Download,
    Calendar,
    User,
    CheckCircle,
    XCircle,
    Info
} from "lucide-react";
import { useGamePlayAnalytics, useRecentSessions } from "@/shared/hooks/useAnalytics";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
    AreaChart,
    Area
} from 'recharts';
import { motion } from "framer-motion";
import { Button } from "@/shared/components/ui/button";
import api from "@/services/api";
import { toast } from "sonner";
import { cn } from "@/shared/lib/utils";