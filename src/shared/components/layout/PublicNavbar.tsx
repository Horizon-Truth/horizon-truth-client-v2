import { ShieldCheck, Menu, ArrowRight } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "@/assets/logo.png";
import { Sheet, SheetContent, SheetTrigger } from "@/shared/components/ui/sheet";
import { Button } from "@/shared/components/ui/button";
import { useAuthStore } from "@/store/auth.store";

export const PublicNavbar = () => {
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuthStore();
    const location = useLocation();

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
                        <img src={logo} alt="Horizon Truth Logo" className="h-10 w-auto" />
                        {/* <span className="text-xl font-bold tracking-tight">HORIZON TRUTH</span> */}
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        <button
                            onClick={() => navigate("/about")}
                            className="text-sm font-medium hover:text-primary transition-colors"
                        >
                            About
                        </button>
                        <a
                            href="#features"
                            onClick={(e) => handleAnchorClick(e, "#features")}
                            className="text-sm font-medium hover:text-primary transition-colors"
                        >
                            Features
                        </a>
                        <button
                            onClick={() => navigate("/crowdsourcing")}
                            className="text-sm font-medium hover:text-primary transition-colors"
                        >
                            Crowdsourcing
                        </button>
                        <button
                            onClick={() => navigate("/faq")}
                            className="text-sm font-medium hover:text-primary transition-colors"
                        >
                            FAQ
                        </button>
                        <button
                            onClick={() => navigate("/login")}
                            className="text-sm font-medium hover:text-primary transition-colors"
                        >
                            Login
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
                            Start the Game <ArrowRight size={16} />
                        </button>
                    </div>

                    {/* Mobile Navigation Trigger */}
                    <div className="md:hidden flex items-center">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <Menu className="w-6 h-6" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-[300px] flex flex-col p-6">
                                <div className="flex items-center gap-2 mb-8 cursor-pointer" onClick={() => navigate("/")}>
                                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                                        <ShieldCheck className="text-primary-foreground w-5 h-5" />
                                    </div>
                                    <span className="text-xl font-bold tracking-tight">HORIZON</span>
                                </div>
                                <div className="flex flex-col gap-6">
                                    <button
                                        onClick={() => navigate("/about")}
                                        className="text-left text-lg font-medium hover:text-primary transition-colors"
                                    >
                                        About
                                    </button>
                                    <a
                                        href="#features"
                                        onClick={(e) => handleAnchorClick(e, "#features")}
                                        className="text-lg font-medium hover:text-primary transition-colors"
                                    >
                                        Features
                                    </a>
                                    <button
                                        onClick={() => navigate("/crowdsourcing")}
                                        className="text-left text-lg font-medium hover:text-primary transition-colors"
                                    >
                                        Crowdsourcing
                                    </button>
                                    <button
                                        onClick={() => navigate("/faq")}
                                        className="text-left text-lg font-medium hover:text-primary transition-colors"
                                    >
                                        FAQ
                                    </button>
                                    <hr className="border-border" />
                                    <button
                                        onClick={() => navigate("/login")}
                                        className="text-left text-lg font-medium hover:text-primary transition-colors"
                                    >
                                        Login
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
                                        Start Game <ArrowRight size={18} />
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
