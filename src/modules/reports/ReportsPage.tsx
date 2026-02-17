import { useState } from "react";
import { useAuthStore } from "@/store/auth.store";
import { ReportForm } from "./components/ReportForm";
import { ReportList } from "./components/ReportList";
import { AuthModal } from "@/shared/components/auth/AuthModal";
import { ShieldAlert, Plus, ArrowLeft } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

export default function ReportsPage() {
    const { isAuthenticated } = useAuthStore();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [authMode, setAuthMode] = useState<"login" | "register">("login");
    const [showForm, setShowForm] = useState(false);

    const handleSuccess = () => {
        setShowForm(false);
    };

    const openAuth = (mode: "login" | "register") => {
        setAuthMode(mode);
        setIsAuthModalOpen(true);
    };

    const handleAuthSuccess = () => {
        setIsAuthModalOpen(false);
    };

    return (
        <div className="min-h-screen bg-background text-foreground">
            <div className="max-w-4xl mx-auto px-4 py-12 md:py-20">
                {!showForm && (
                    <div className="text-center mb-12 animate-in fade-in zoom-in-95 duration-500">
                        <div className="inline-flex items-center justify-center p-3 mb-6 rounded-2xl bg-primary/5 border border-primary/10">
                            <ShieldAlert className="w-8 h-8 text-primary" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
                            Horizon Truth Crowdsourcing
                        </h1>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
                            Your reports help us identify and verify incidents. Be the guardians of truth in the digital age.
                        </p>
                        <Button
                            onClick={() => setShowForm(true)}
                            className="h-14 px-10 rounded-2xl bg-primary text-primary-foreground font-black text-lg shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                        >
                            <Plus className="mr-2 w-5 h-5" />
                            SUBMIT NEW REPORT
                        </Button>
                    </div>
                )}

                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            {showForm && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setShowForm(false)}
                                    className="rounded-full hover:bg-muted"
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                </Button>
                            )}
                            <h2 className="text-2xl font-black tracking-tight">
                                {showForm ? "Submit a New Report" : "Recent Reports"}
                            </h2>
                        </div>
                        {showForm && (
                            isAuthenticated ? (
                                <div className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-500 text-[10px] font-black uppercase tracking-widest flex items-center">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2 animate-pulse" />
                                    Authenticated
                                </div>
                            ) : (
                                <div className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-black uppercase tracking-widest flex items-center">
                                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-2" />
                                    Guest Mode
                                </div>
                            )
                        )}
                    </div>

                    {showForm ? (
                        <ReportForm
                            onSuccess={handleSuccess}
                            onRequireAuth={() => openAuth("login")}
                            onCancel={() => setShowForm(false)}
                        />
                    ) : (
                        <ReportList />
                    )}
                </div>
            </div>

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                initialMode={authMode}
                onSuccess={handleAuthSuccess}
            />
        </div>
    );
}
