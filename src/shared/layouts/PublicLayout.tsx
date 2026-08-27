import React from "react";
import { PublicNavbar } from "../components/layout/PublicNavbar";
import { PublicFooter } from "../components/layout/PublicFooter";

export const PublicLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
            <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:p-4 focus:bg-background focus:text-primary focus:outline-none">
                Skip to main content
            </a>
            <PublicNavbar />
            <main id="main-content" className="flex-grow pt-16">
                {children}
            </main>
            <PublicFooter />
        </div>
    );
};
