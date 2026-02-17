import { useState } from "react";
import { useAuthStore } from "@/store/auth.store";
import { ReportForm } from "./components/ReportForm";
import { AuthModal } from "@/shared/components/auth/AuthModal";
import { ShieldAlert } from "lucide-react";

export default function ReportsPage() {
    const { isAuthenticated } = useAuthStore();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [authMode, setAuthMode] = useState<"login" | "register">("login");

    const handleSuccess = () => {
        // Handle post-submission logic if needed
    };

    const openAuth = (mode: "login" | "register") => {
        setAuthMode(mode);
        setIsAuthModalOpen(true);
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white">
            <div className="max-w-4xl mx-auto px-4 py-12 md:py-20">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center p-3 mb-6 rounded-2xl bg-primary/10 border border-primary/20">
                        <ShieldAlert className="w-8 h-8 text-primary" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                        Horizon Truth Crowdsourcing
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Your reports help us identify and verify incidents. Be the guardians of truth in the digital age.
                    </p>
                </div>

                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold">Submit a New Report</h2>
                        {isAuthenticated ? (
                            <div className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-500 text-xs font-bold flex items-center">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2 animate-pulse" />
                                Authenticated Session
                            </div>
                        ) : (
                            <div className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-bold flex items-center">
                                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-2" />
                                Guest Mode (Auth Required to Submit)
                            </div>
                        )}
                    </div>
                    <ReportForm
                        onSuccess={handleSuccess}
                        onRequireAuth={() => openAuth("login")}
                    />
                </div>
            </div>

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                initialMode={authMode}
            />
        </div>
    );
}
