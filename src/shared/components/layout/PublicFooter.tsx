import { ShieldCheck, Globe, Github } from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/logo.png";

export const PublicFooter = () => {
    const navigate = useNavigate();

    return (
        <footer className="py-12 border-t mt-auto bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b pb-12">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    <div className="col-span-2">
                        <div className="flex items-center gap-3 mb-6">
                            <img src={logo} alt="Horizon Truth Logo" className="h-8 w-auto" />
                            {/* <span className="font-bold italic text-lg tracking-tight">HORIZON TRUTH</span> */}
                        </div>
                        <p className="text-sm text-muted-foreground max-w-xs">
                            Empowering minds through gamified digital literacy. Building a more truthful digital space.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-bold mb-4 text-sm uppercase tracking-wider">Pages</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><button onClick={() => navigate("/about")} className="hover:text-primary transition-colors">About Us</button></li>
                            <li><button onClick={() => navigate("/resources")} className="hover:text-primary transition-colors">Blog & Resources</button></li>
                            <li><button onClick={() => navigate("/faq")} className="hover:text-primary transition-colors">FAQ</button></li>
                            <li><button onClick={() => navigate("/contact")} className="hover:text-primary transition-colors">Contact</button></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold mb-4 text-sm uppercase tracking-wider">Legal</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><button onClick={() => navigate("/privacy-policy")} className="hover:text-primary transition-colors">Privacy Policy</button></li>
                            <li><button onClick={() => navigate("/terms-of-service")} className="hover:text-primary transition-colors">Terms of Service</button></li>
                            <li><button onClick={() => navigate("/cookies-policy")} className="hover:text-primary transition-colors">Cookies Policy</button></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-xs text-muted-foreground">© 2026 Horizon Truth. All rights reserved.</p>
                <div className="flex gap-6 text-muted-foreground">
                    <a href="https://horizon-truth.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors"><ShieldCheck size={18} /></a>
                    <a href="https://twitter.com/horizontruth" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors"><Globe size={18} /></a>
                    <a href="https://github.com/horizon-truth" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors"><Github size={18} /></a>
                </div>
            </div>
        </footer>
    );
};
