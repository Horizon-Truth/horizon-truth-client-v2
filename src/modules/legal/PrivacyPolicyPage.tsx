import { useState } from 'react';
import { Shield, Lock, Eye, FileText, Globe, Scale, Mail } from 'lucide-react';
import { PublicLayout } from '@/shared/layouts/PublicLayout';

export default function PrivacyPolicyPage() {
    const [activeSection, setActiveSection] = useState('introduction');

    const sections = [
        { id: 'introduction', title: 'Introduction', icon: FileText },
        { id: 'collection', title: 'Data Collection', icon: Eye },
        { id: 'usage', title: 'How We Use Data', icon: Globe },
        { id: 'security', title: 'Data Security', icon: Lock },
        { id: 'rights', title: 'Your Rights', icon: Scale },
        { id: 'contact', title: 'Contact Us', icon: Mail }
    ];

    const scrollToSection = (id: string) => {
        setActiveSection(id);