import { useState } from 'react';
import { Scale, CheckCircle, AlertTriangle, Copyright, UserCheck, Trash2, Gavel } from 'lucide-react';
import { PublicLayout } from '@/shared/layouts/PublicLayout';

export default function TermsOfServicePage() {
    const [activeSection, setActiveSection] = useState('acceptance');

    const sections = [
        { id: 'acceptance', title: 'Acceptance', icon: UserCheck },
        { id: 'eligibility', title: 'Eligibility', icon: Scale },
        { id: 'responsibilities', title: 'Responsibilities', icon: CheckCircle },
        { id: 'content', title: 'Content Guidelines', icon: Copyright },
        { id: 'termination', title: 'Termination', icon: Trash2 },
        { id: 'liability', title: 'Liability', icon: AlertTriangle },
        { id: 'law', title: 'Governing Law', icon: Gavel }