import { useState } from "react";
import { Search, ChevronDown, ChevronUp, Info, User, Gamepad, CheckCircle, Settings, Shield } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useNavigate } from "react-router-dom";
import { PublicLayout } from "@/shared/layouts/PublicLayout";
import { useTranslation } from "@/shared/i18n/useTranslation";

const categories = [
    { id: 'general', nameKey: 'faq.catGeneral', icon: Info },
    { id: 'account', nameKey: 'faq.catAccount', icon: User },
    { id: 'game', nameKey: 'faq.catGame', icon: Gamepad },
    { id: 'verification', nameKey: 'faq.catVerification', icon: CheckCircle },
    { id: 'technical', nameKey: 'faq.catTechnical', icon: Settings },
    { id: 'privacy', nameKey: 'faq.catPrivacy', icon: Shield }
];

const faqs = [
    // General FAQs
    {
        id: 'what-is-horizon-truth',
        question: 'What is Horizon Truth?',
        answer: 'Horizon Truth is a gamified digital literacy platform designed to combat misinformation through interactive learning, crowdsourced content verification, and AI-powered detection tools. We empower Ethiopian youth to identify and resist false information while building critical thinking skills.',
        category: 'general'
    },
    {
        id: 'who-is-behind',
        question: 'Who is behind Horizon Truth?',
        answer: 'Horizon Truth is developed by Dabbal Software Development PLC, an Ethiopian technology company focused on creating solutions for social good. Our team includes educators, software developers, and digital literacy experts working in partnership with institutions like Jimma University and the Ministry of Peace.',
        category: 'general'
    },