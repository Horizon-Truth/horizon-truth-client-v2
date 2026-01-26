import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCcw, Terminal } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

interface GlitchErrorProps {
    message?: string;