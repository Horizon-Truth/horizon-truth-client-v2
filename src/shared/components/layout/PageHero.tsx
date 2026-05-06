import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface PageHeroProps {
    title: string;
    subtitle: string;
    description: string;
    badge?: string;
    icon?: ReactNode;
    children?: ReactNode;
}
