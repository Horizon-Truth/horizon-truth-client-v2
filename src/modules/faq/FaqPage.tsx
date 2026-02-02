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
    {
        id: 'target-audience',
        question: 'Who is Horizon Truth for?',
        answer: 'Our primary audience is Ethiopian youth aged 16-25, but the platform is valuable for anyone interested in improving their digital literacy skills. We\'re particularly focused on students, community leaders, and anyone who wants to become more resilient against misinformation.',
        category: 'general'
    },
    {
        id: 'languages-supported',
        question: 'What languages does Horizon Truth support?',
        answer: 'Currently, Horizon Truth is available in English, with ongoing localization for Amharic and Afaan Oromo. We\'re committed to making the platform accessible to all Ethiopian users in their preferred languages.',
        category: 'general'
    },

    // Account & Access FAQs
    {
        id: 'create-account',
        question: 'How do I create an account?',
        answer: 'You can create an account by clicking the "Sign Up" button on our website. You\'ll need to provide a valid phone number and create a password. For educational institutions looking to enroll multiple users, please contact us at partnerships@horizontruth.com.',
        category: 'account'
    },
    {
        id: 'age-requirement',
        question: 'Is there an age requirement to use Horizon Truth?',
        answer: 'Users must be at least 13 years old to create an account. For users between 13-18, we recommend parental guidance and consent. Our content is designed to be appropriate for youth while effectively addressing real-world misinformation challenges.',
        category: 'account'
    },
    {
        id: 'forgot-password',
        question: 'What if I forget my password?',
        answer: 'Click the "Forgot Password" link on the login page. We\'ll send a password reset code to your registered phone number. If you don\'t receive the code within 5 minutes, check your connection or contact our support team.',
        category: 'account'
    },
    {
        id: 'account-deletion',
        question: 'Can I delete my account?',
        answer: 'Yes, you can delete your account at any time. Go to your account settings and select "Delete Account." Please note that this action is permanent and will remove all your progress, achievements, and submitted content.',
        category: 'account'
    },

    // Game & Learning FAQs
    {
        id: 'how-game-works',
        question: 'How does the gamified learning work?',
        answer: 'Our platform uses interactive scenarios that simulate real-world misinformation challenges. You\'ll encounter various types of false content (health myths, political manipulation, social media hoaxes) and learn to identify them through quizzes, critical thinking exercises, and immediate feedback. As you progress, you earn points, level up, and unlock new challenges.',
        category: 'game'
    },
    {
        id: 'learning-outcomes',
        question: 'What will I learn from using Horizon Truth?',
        answer: 'You\'ll develop essential digital literacy skills including: source verification, fact-checking techniques, bias recognition, emotional manipulation detection, and critical analysis of online content. These skills help you make informed decisions and resist misinformation in your daily digital life.',
        category: 'game'
    },
    {
        id: 'time-commitment',
        question: 'How much time do I need to commit?',
        answer: 'You can learn at your own pace! Each learning module takes 15-30 minutes to complete. We recommend regular practice - even 10-15 minutes daily can significantly improve your misinformation detection skills over time.',
        category: 'game'
    },
    {
        id: 'progress-tracking',
        question: 'Can I track my learning progress?',
        answer: 'Yes! Your dashboard shows your current level, points earned, badges achieved, and completion status for all modules. You can also see how your skills improve over time through our progress analytics.',
        category: 'game'
    },

    // Content Verification FAQs