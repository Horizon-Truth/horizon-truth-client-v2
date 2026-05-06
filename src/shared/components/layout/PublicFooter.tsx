import { ShieldCheck, Globe, Github } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Logo } from "@/shared/components/ui/logo";
import { useTranslation } from "@/shared/i18n/useTranslation";

export const PublicFooter = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    return (
        <footer className="py-12 border-t mt-auto bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b pb-12">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    <div className="col-span-2">
                        <div className="flex items-center gap-3 mb-6">
                            <Logo variant="right" className="h-8 w-auto" />
                            {/* <span className="font-bold italic text-lg tracking-tight">HORIZON TRUTH</span> */}