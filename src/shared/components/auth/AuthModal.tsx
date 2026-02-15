import { useState } from "react";
import { LoginForm } from "@/shared/components/auth/LoginForm";
import { RegisterForm } from "@/shared/components/auth/RegisterForm";
import { X } from "lucide-react";

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialMode?: "login" | "register";
    onSuccess?: () => void;
}

export function AuthModal({ isOpen, onClose, initialMode = "login", onSuccess }: AuthModalProps) {
    const [mode, setMode] = useState<"login" | "register">(initialMode);

    if (!isOpen) return null;

    const handleSuccess = () => {
        if (onSuccess) {
            onSuccess();
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className="bg-background border w-full max-w-md rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 relative"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors z-10"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="max-h-[90vh] overflow-y-auto custom-scrollbar">
                    {mode === "login" ? (
                        <div className="relative pt-4">
                            <LoginForm onSuccess={handleSuccess} />
                            <div className="px-8 pb-8 -mt-12 text-center relative z-20">
                                <p className="text-sm text-muted-foreground">
                                    Don't have an account?{" "}
                                    <button
                                        onClick={() => setMode("register")}
                                        className="text-primary font-bold hover:underline"
                                    >
                                        Sign up
                                    </button>
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="relative pt-4">
                            <RegisterForm onSuccess={handleSuccess} />
                            <div className="px-10 pb-8 -mt-12 text-center relative z-20">
                                <p className="text-sm text-muted-foreground">
                                    Already have an account?{" "}
                                    <button
                                        onClick={() => setMode("login")}
                                        className="text-primary font-bold hover:underline"
                                    >
                                        Log in
                                    </button>
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
