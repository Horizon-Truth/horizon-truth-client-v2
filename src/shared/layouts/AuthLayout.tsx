import { Outlet, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Logo } from '@/shared/components/ui/logo';
import { Button } from '@/shared/components/ui/button';

export function AuthLayout() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen relative flex items-center justify-center bg-background overflow-hidden p-4">