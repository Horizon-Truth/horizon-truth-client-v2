import React from "react";
import { PublicNavbar } from "../components/layout/PublicNavbar";
import { PublicFooter } from "../components/layout/PublicFooter";

export const PublicLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
            <PublicNavbar />
            <main className="flex-grow pt-16">
                {children}
            </main>
            <PublicFooter />
        </div>
    );
};
