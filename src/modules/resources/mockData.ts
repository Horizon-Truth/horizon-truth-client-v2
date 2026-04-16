import { FileText, Video, BookOpen, CheckCircle } from "lucide-react";

export const blogs = [
    {
        id: "1",
        title: "The Rise of Synthetic Media: What You Need to Know",
        excerpt: "As deepfakes and AI-generated content become more sophisticated, distinguishing truth from fiction is getting harder. Here's our guide to navigating this new reality.",
        content: `
            <p>Misinformation has taken a new, more realistic form: synthetic media. From deepfake videos of world leaders to AI-generated images of events that never happened, the digital landscape is changing rapidly.</p>
            <h3>Understanding the Technology</h3>
            <p>Generative AI models can now create highly convincing media with minimal input. While these tools have creative potential, they are also being weaponized to spread false narratives.</p>
            <blockquote>"The speed at which synthetic media is evolving outpaces our natural ability to verify it."</blockquote>
            <h3>How to Protect Yourself</h3>
            <ul>
                <li><strong>Check the source:</strong> Always verify where the media originated.</li>
                <li><strong>Look for artifacts:</strong> AI-generated images often have subtle glitches in textures or symmetry.</li>
                <li><strong>Use verification tools:</strong> Platforms like Horizon Truth offer specialized tools to flag potential deepfakes.</li>
            </ul>
        `,
        date: "May 15, 2024",
        readTime: "6 min read",
        author: {
            name: "Sarah Chen",
            role: "AI Researcher",
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
        },
        image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80",
        category: "Technology"
    },
    {
        id: "2",
        title: "Building Community Resilience Against Fake News",
        excerpt: "Misinformation isn't just a technical problem; it's a social one. Discover how local communities are coming together to verify information.",
        content: "<p>Content coming soon...</p>",
        date: "May 10, 2024",
        readTime: "4 min read",
        author: {
            name: "Marcus Thorne",
            role: "Community Director",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"
        },
        image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80",
        category: "Community"
    }
];

export const resources = [
    {
        id: "1",
        title: "The Misinformation Handbook",
        type: "guide",
        description: "Learn essential steps to verify social media posts and identify fake news effectively.",
        duration: "15 min read",
        badge: "Most Popular",
        icon: FileText,
        fullContent: "This handbook provides a step-by-step framework for verifying digital content. It covers reverse image search, source checking, and lateral reading techniques."
    },
    {
        id: "2",
        title: "Solution Overview",
        type: "guide",
        description: "How gamified learning and crowdsource reporting combine to protect digital integrity.",
        duration: "10 min read",
        badge: "New",
        icon: CheckCircle
    },
    {
        id: "3",
        title: "How Fake News Spreads",
        type: "video",
        description: "A visual guide to the viral nature of misinformation across digital platforms.",
        duration: "6 min",
        icon: Video
    },
    {
        id: "4",
        title: "Defending Truth",
        type: "course",
        description: "A comprehensive course on why digital honesty matters in the modern era.",
        duration: "45 min",
        icon: BookOpen
    }
];
