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
    {
        id: 'how-verification-works',
        question: 'How does the crowdsourced verification work?',
        answer: 'Users can submit suspicious content they encounter online for community verification. Our system uses a combination of AI analysis and community voting to assess content credibility. Verified cases become part of our educational database, helping others learn from real examples.',
        category: 'verification'
    },
    {
        id: 'ai-detection',
        question: 'How does the AI misinformation detection work?',
        answer: 'Our AI system uses natural language processing and machine learning to analyze patterns commonly found in misinformation. It examines factors like sensationalism, source credibility, emotional manipulation tactics, and consistency with verified information. The AI continuously learns from new data and community feedback.',
        category: 'verification'
    },
    {
        id: 'report-misinformation',
        question: 'How can I report misinformation I find online?',
        answer: 'Use our "Report" feature to submit suspicious content. You\'ll need to provide the content, source, and context. Our system guides you through the verification process and helps you analyze why the content might be misleading.',
        category: 'verification'
    },
    {
        id: 'trust-scores',
        question: 'What are trust scores and how are they calculated?',
        answer: 'Trust scores rate the credibility of content sources based on multiple factors: historical accuracy, transparency, expertise, and community verification results. Higher scores indicate more reliable sources. These scores help users quickly assess source credibility.',
        category: 'verification'
    },

    // Technical Support FAQs
    {
        id: 'browser-support',
        question: 'Which browsers are supported?',
        answer: 'Horizon Truth works on all modern browsers including Chrome, Firefox, Safari, and Edge. For the best experience, ensure your browser is updated to the latest version. We also have a mobile-responsive design for smartphone access.',
        category: 'technical'
    },
    {
        id: 'mobile-app',
        question: 'Is there a mobile app?',
        answer: 'We\'re currently web-based with a mobile-responsive design. A dedicated mobile app is in development and will be available soon. You can access our platform through your mobile browser in the meantime.',
        category: 'technical'
    },
    {