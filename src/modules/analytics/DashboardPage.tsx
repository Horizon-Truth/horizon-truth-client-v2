import { Link } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";
import {
    Users,
    Building2,
    Gamepad2,
    BookOpen,
    MessageSquare,
    FileText,
    Mail,
    PlayCircle,
    TrendingUp,
    AlertCircle,
    Loader2
} from "lucide-react";
import { useAnalyticsStats } from "@/shared/hooks/useAnalytics";
import { useAuthStore } from "@/store/auth.store";
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
    Legend
} from 'recharts';
import { motion } from "framer-motion";
import { useDevice } from "@/shared/hooks/useDevice";