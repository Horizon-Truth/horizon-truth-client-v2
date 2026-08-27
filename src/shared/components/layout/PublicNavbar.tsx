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
        <nav aria-label="Main navigation" className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <button className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")} aria-label="Horizon Truth - Go to homepage">
                        <Logo variant="right" className="h-10 w-auto" />
                    </button>

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
                        <button
                            onClick={() => navigate("/crowdsourcing")}
                            className="text-sm font-medium hover:text-primary transition-colors"
                        >
                            {t("nav.crowdsourcing")}
                        </button>
                        <button
                            onClick={() => navigate("/faq")}
                            className="text-sm font-medium hover:text-primary transition-colors"
                        >
                            {t("nav.faq")}
                        </button>
                        <button
                            onClick={() => navigate("/login")}
                            className="text-sm font-medium hover:text-primary transition-colors"
                        >
                            {t("nav.login")}
                        </button>
                        <button
                            onClick={() => {
                                if (isAuthenticated) {
                                    navigate(user?.role === 'PLAYER' ? "/dashboard/game" : "/dashboard");
                                } else {
                                    navigate("/login");
                                }
                            }}
                            className="text-sm font-medium px-4 py-2 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-all flex items-center gap-2"
                        >
                            {t("nav.startGame")} <ArrowRight size={16} />
                        </button>
                    </div>

                    {/* Mobile Navigation Trigger */}
                    <div className="md:hidden flex items-center">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" aria-label="Open navigation menu">
                                    <Menu className="w-6 h-6" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-[300px] flex flex-col p-6">
                                <div className="mb-8 cursor-pointer" onClick={() => navigate("/")}>
                                    <Logo variant="right" className="h-8 w-auto px-1" />
                                </div>
                                <div className="flex flex-col gap-6">
                                    <button
                                        onClick={() => navigate("/about")}
                                        className="text-left text-lg font-medium hover:text-primary transition-colors"
                                    >
                                        {t("nav.about")}
                                    </button>
                                    <a
                                        href="#features"
                                        onClick={(e) => handleAnchorClick(e, "#features")}
                                        className="text-lg font-medium hover:text-primary transition-colors"
                                    >
                                        {t("nav.features")}
                                    </a>
                                    <button
                                        onClick={() => navigate("/crowdsourcing")}
                                        className="text-left text-lg font-medium hover:text-primary transition-colors"
                                    >
                                        {t("nav.crowdsourcing")}
                                    </button>
                                    <button
                                        onClick={() => navigate("/faq")}
                                        className="text-left text-lg font-medium hover:text-primary transition-colors"
                                    >
                                        {t("nav.faq")}
                                    </button>
                                    <hr className="border-border" />
                                    <div className="flex items-center justify-between">
                                        <span className="text-lg font-medium">{t("nav.language")}</span>
                                        <LanguageSwitcher variant="compact" />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-lg font-medium">{t("nav.theme")}</span>
                                        <ThemeToggle />
                                    </div>
                                    <button
                                        onClick={() => navigate("/login")}
                                        className="text-left text-lg font-medium hover:text-primary transition-colors"
                                    >
                                        {t("nav.login")}
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (isAuthenticated) {
                                                navigate(user?.role === 'PLAYER' ? "/dashboard/game" : "/dashboard");
                                            } else {
                                                navigate("/login");
                                            }
                                        }}
                                        className="w-full px-4 py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2"
                                    >
                                        {t("nav.startGameShort")} <ArrowRight size={18} />
                                    </button>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </nav>
    );
};
