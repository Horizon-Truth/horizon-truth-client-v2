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

    const isHomePage = location.pathname === "/";

    const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        if (!isHomePage) {
            e.preventDefault();
            navigate(`/${id}`);
        }
    };

    return (
        <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
                        <Logo variant="right" className="h-10 w-auto" />
                        {/* <span className="text-xl font-bold tracking-tight">HORIZON TRUTH</span> */}
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        <LanguageSwitcher variant="compact" />
                        <ThemeToggle />
                        <button
                            onClick={() => navigate("/about")}
                            className="text-sm font-medium hover:text-primary transition-colors"
                        >
                            {t("nav.about")}
                        </button>
                        <a
                            href="#features"
                            onClick={(e) => handleAnchorClick(e, "#features")}
                            className="text-sm font-medium hover:text-primary transition-colors"
                        >
                            {t("nav.features")}
                        </a>