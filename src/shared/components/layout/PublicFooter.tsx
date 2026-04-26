import { ShieldCheck, Globe, Github } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Logo } from "@/shared/components/ui/logo";
import { useTranslation } from "@/shared/i18n/useTranslation";

export const PublicFooter = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    return (
        <footer className="py-12 border-t mt-auto bg-background">