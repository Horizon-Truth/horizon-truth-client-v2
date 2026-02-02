import { useState } from 'react';
import { Cookie, ShieldCheck, BarChart3, Settings, Megaphone, Info, Save, Check } from 'lucide-react';
import { Button } from "@/shared/components/ui/button";
import { toast } from "sonner";
import { PublicLayout } from '@/shared/layouts/PublicLayout';

export default function CookiesPolicyPage() {
    const [activeSection, setActiveSection] = useState('what-are-cookies');
    const [preferences, setPreferences] = useState({
        necessary: true,
        analytics: false,
        functional: false,
        marketing: false
    });

    const sections = [
        { id: 'what-are-cookies', title: 'Meaning', icon: Info },
        { id: 'types', title: 'Types of Cookies', icon: Cookie },
        { id: 'purpose', title: 'Why We Use Them', icon: ShieldCheck },
        { id: 'management', title: 'Management', icon: Settings }
    ];
