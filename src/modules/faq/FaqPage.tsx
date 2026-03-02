import { useState } from "react";
import { Search, ChevronDown, ChevronUp, Info, User, Gamepad, CheckCircle, Settings, Shield } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useNavigate } from "react-router-dom";
import { PublicLayout } from "@/shared/layouts/PublicLayout";

const categories = [
    { id: 'general', name: 'General', icon: Info },
    { id: 'account', name: 'Account & Access', icon: User },
    { id: 'game', name: 'Game & Learning', icon: Gamepad },
    { id: 'verification', name: 'Content Verification', icon: CheckCircle },
    { id: 'technical', name: 'Technical Support', icon: Settings },
    { id: 'privacy', name: 'Privacy & Security', icon: Shield }
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
        id: 'internet-requirements',
        question: 'What are the internet requirements?',
        answer: 'Our platform is optimized for varying internet speeds, including low-bandwidth environments. Basic functionality works with 2G connections, though faster speeds provide a better experience for multimedia content.',
        category: 'technical'
    },
    {
        id: 'technical-issues',
        question: 'What should I do if I encounter technical issues?',
        answer: 'First, try refreshing the page and clearing your browser cache. If the issue persists, contact our support team at support@horizontruth.com with details about the problem, your device, browser, and any error messages you see.',
        category: 'technical'
    },

    // Privacy & Security FAQs
    {
        id: 'data-privacy',
        question: 'What data do you collect about me?',
        answer: 'We collect minimal data necessary for platform functionality: account information, learning progress, and content you voluntarily submit for verification. We never sell your data. We use industry-standard encryption to protect your personal information.',
        category: 'privacy'
    },
    {
        id: 'data-security',
        question: 'How is my data protected?',
        answer: 'We use industry-standard security measures including encryption, secure servers, and regular security audits. Your personal information is protected and we only use data for educational and platform improvement purposes as outlined in our privacy policy.',
        category: 'privacy'
    },
    {
        id: 'cookies-usage',
        question: 'Do you use cookies?',
        answer: 'We use necessary cookies for platform functionality and optional analytics cookies to improve user experience. You can manage your cookie preferences in our <Link to="/cookies-policy" className="text-sky-600 hover:text-sky-700">Cookies Policy</Link> page.',
        category: 'privacy'
    },
    {
        id: 'research-data',
        question: 'Is my data used for research?',
        answer: 'We may use anonymized, aggregated data for research purposes to improve digital literacy education and misinformation detection. Individual users are never identified in research findings. You can opt out of research data usage in your account settings.',
        category: 'privacy'
    }
];

export default function FaqPage() {
    const [activeCategory, setActiveCategory] = useState('general');
    const [searchTerm, setSearchTerm] = useState('');
    const [openItems, setOpenItems] = useState<string[]>(['what-is-horizon-truth']);
    const navigate = useNavigate();

    const toggleItem = (id: string) => {
        setOpenItems(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const filteredFAQs = faqs.filter(faq => {
        const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = searchTerm ? true : faq.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <PublicLayout>
            <div className="flex flex-col min-h-screen">
                {/* Header Section */}
                <section className="py-16 bg-primary/5">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h1 className="text-4xl lg:text-6xl font-extrabold tracking-tight mb-6">Frequently Asked <span className="text-primary">Questions</span></h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
                            Find answers to common questions about Horizon Truth and how to make the most of our platform.
                        </p>
                        <div className="relative max-w-2xl mx-auto">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                            <input
                                type="text"
                                placeholder="Search FAQs..."
                                className="w-full pl-12 pr-4 py-4 rounded-2xl border bg-background shadow-sm focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </section>

                <section className="py-20 bg-background">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col lg:flex-row gap-12">
                            {/* Sidebar Categories */}
                            <div className="lg:w-1/4 space-y-2">
                                <h3 className="text-lg font-bold mb-6 px-4">Categories</h3>
                                <div className="flex lg:flex-col overflow-x-auto pb-4 lg:pb-0 gap-2">
                                    {categories.map((cat) => (
                                        <button
                                            key={cat.id}
                                            onClick={() => { setActiveCategory(cat.id); setSearchTerm(''); }}
                                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all whitespace-nowrap ${activeCategory === cat.id && !searchTerm ? "bg-primary text-primary-foreground shadow-md" : "hover:bg-secondary text-muted-foreground hover:text-foreground"
                                                }`}
                                        >
                                            <cat.icon size={18} />
                                            <span className="font-semibold">{cat.name}</span>
                                        </button>
                                    ))}
                                </div>
                                <div className="hidden lg:block mt-12 p-6 bg-secondary/30 rounded-2xl border border-border">
                                    <h4 className="font-bold mb-2">Still have questions?</h4>
                                    <p className="text-sm text-muted-foreground mb-6 leading-relaxed">Can't find what you're looking for? Our support team is here to help you.</p>
                                    <Button onClick={() => navigate("/contact")} className="w-full rounded-xl">Contact Support</Button>
                                </div>
                            </div>

                            {/* FAQ List */}
                            <div className="lg:w-3/4">
                                <div className="mb-8">
                                    <h2 className="text-3xl font-bold mb-2">
                                        {searchTerm ? `Search Results for "${searchTerm}"` :
                                            categories.find(c => c.id === activeCategory)?.name + " Questions"}
                                    </h2>
                                    <p className="text-muted-foreground">{filteredFAQs.length} questions found</p>
                                </div>

                                <div className="space-y-4">
                                    {filteredFAQs.length > 0 ? (
                                        filteredFAQs.map((faq) => (
                                            <div key={faq.id} className="border rounded-2xl overflow-hidden hover:border-primary transition-all bg-card">
                                                <button
                                                    onClick={() => toggleItem(faq.id)}
                                                    className="w-full text-left p-6 flex justify-between items-center group"
                                                >
                                                    <span className="text-lg font-bold group-hover:text-primary transition-colors pr-8">{faq.question}</span>
                                                    {openItems.includes(faq.id) ? <ChevronUp size={20} className="text-primary shrink-0" /> : <ChevronDown size={20} className="text-muted-foreground shrink-0" />}
                                                </button>
                                                <div className={`px-6 pb-6 text-muted-foreground leading-relaxed transition-all ${openItems.includes(faq.id) ? "block" : "hidden"}`}>
                                                    <div className="pt-4 border-t border-border">
                                                        {faq.answer}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-20 bg-secondary/10 rounded-3xl border border-dashed border-border">
                                            <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                                                <Search size={32} className="text-muted-foreground" />
                                            </div>
                                            <h3 className="text-2xl font-bold mb-2">No results found</h3>
                                            <p className="text-muted-foreground">Try using different keywords or selecting a different category.</p>
                                            <Button variant="outline" className="mt-6" onClick={() => { setSearchTerm(''); setActiveCategory('general'); }}>Clear all filters</Button>
                                        </div>
                                    )}
                                </div>

                                {/* Help Banner */}
                                <div className="mt-16 bg-primary p-8 rounded-3xl text-primary-foreground flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
                                    <div>
                                        <h3 className="text-2xl font-bold mb-2">Still need help?</h3>
                                        <p className="opacity-80">Our experts are available to clarify any doubts about our platform.</p>
                                    </div>
                                    <div className="flex gap-4">
                                        <Button onClick={() => navigate("/contact")} variant="secondary" className="rounded-xl px-8 py-6 font-bold">Contact Us</Button>
                                        <Button variant="outline" className="rounded-xl px-8 py-6 font-bold bg-transparent border-white text-white hover:bg-white hover:text-primary" onClick={() => window.location.href = "mailto:support@horizontruth.com"}>Email Support</Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </PublicLayout>
    );
}
