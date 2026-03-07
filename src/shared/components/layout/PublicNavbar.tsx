import { Menu, ArrowRight } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Logo } from "@/shared/components/ui/logo";
import { Sheet, SheetContent, SheetTrigger } from "@/shared/components/ui/sheet";
import { Button } from "@/shared/components/ui/button";
import { useAuthStore } from "@/store/auth.store";
import { ThemeToggle } from "@/shared/components/theme-toggle";
import { LanguageSwitcher } from "@/shared/i18n/components/LanguageSwitcher";
import { useTranslation } from "@/shared/i18n/useTranslation";

export const PublicNavbar = () => {
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuthStore();
    const location = useLocation();
    const { t } = useTranslation();
