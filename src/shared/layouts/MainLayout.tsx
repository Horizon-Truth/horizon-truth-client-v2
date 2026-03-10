
import React from "react";
import {
    LayoutDashboard,
    Users,
    Building2,
    Cpu,
    FileText,
    Settings,
    AlertTriangle,
    Menu,
    ChevronLeft,
    LogOut,
    User as UserIcon,
    ChevronDown,
    MessageSquare,
    BookOpen,
    Megaphone,
    ShieldCheck,
    BarChart3
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDevice } from "@/shared/hooks/useDevice";
import { cn } from "@/shared/lib/utils";
import { useAuthStore } from "@/store/auth.store";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { ThemeToggle } from "@/shared/components/theme-toggle";
import { authService } from "@/services/auth.service";