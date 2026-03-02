import { useState } from "react";
import { Search, Clock, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PublicLayout } from "@/shared/layouts/PublicLayout";
import { Button } from "@/shared/components/ui/button";
import { resources } from "./mockData";
import { motion, AnimatePresence } from "framer-motion";

export default function ResourceLibraryPage() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [activeFilter, setActiveFilter] = useState("all");

    const filteredResources = resources.filter(resource => {
        const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            resource.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = activeFilter === "all" || resource.type === activeFilter;
        return matchesSearch && matchesType;
    });

    const filters = ["all", "guide", "video", "course"];

    return (
        <PublicLayout>
            <section className="py-20 bg-primary/5 border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl lg:text-7xl font-extrabold tracking-tight mb-6">
                        Resource <span className="text-primary">Library</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        Access our full collection of educational materials, verification guides, and media resources to sharpen your digital literacy.
                    </p>
                </div>
            </section>

            <section className="py-16 bg-background">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Filters & Search */}
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16">
                        <div className="flex flex-wrap gap-2">
                            {filters.map((filter) => (
                                <Button
                                    key={filter}
                                    variant={activeFilter === filter ? "default" : "outline"}
                                    onClick={() => setActiveFilter(filter)}
                                    className={`rounded-full px-6 capitalize font-black ${activeFilter === filter ? 'bg-primary' : 'hover:border-primary/50'}`}
                                >
                                    {filter}
                                </Button>
                            ))}
                        </div>
                        <div className="relative w-full max-w-md">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                            <input
                                type="text"
                                placeholder="Search the library..."
                                className="w-full pl-12 pr-4 py-4 rounded-2xl border bg-secondary/5 focus:ring-2 focus:ring-primary focus:outline-none transition-all font-medium"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <AnimatePresence mode="popLayout">
                            {filteredResources.length > 0 ? (
                                filteredResources.map((resource, i) => (
                                    <motion.div
                                        key={resource.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.3, delay: i * 0.05 }}
                                        className="group bg-card border-2 border-transparent hover:border-primary/20 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer"
                                        onClick={() => navigate(`/resource/${resource.id}`)}
                                    >
                                        <div className="h-48 bg-secondary/10 flex items-center justify-center relative overflow-hidden">
                                            <resource.icon size={64} className="text-primary/10 group-hover:scale-110 group-hover:text-primary/20 transition-all duration-700" />
                                            {resource.badge && (
                                                <span className="absolute top-6 left-6 bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full shadow-lg shadow-primary/20">
                                                    {resource.badge}
                                                </span>
                                            )}
                                        </div>
                                        <div className="p-8">
                                            <div className="flex items-center gap-3 mb-4 text-[10px] font-black uppercase tracking-widest text-primary">
                                                <span className="px-2 py-0.5 bg-primary/10 rounded">{resource.type}</span>
                                                <span className="flex items-center gap-1 font-medium text-muted-foreground"><Clock size={12} /> {resource.duration}</span>
                                            </div>
                                            <h3 className="text-xl font-black mb-3 group-hover:text-primary transition-colors line-clamp-2">{resource.title}</h3>
                                            <p className="text-muted-foreground mb-6 font-medium line-clamp-2 leading-relaxed">{resource.description}</p>
                                            <div className="flex items-center text-primary font-black text-sm">
                                                <span>Access Resource</span>
                                                <ArrowRight size={16} className="ml-2 group-hover:translate-x-2 transition-transform" />
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="col-span-full py-24 text-center"
                                >
                                    <div className="w-20 h-20 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <Search size={32} className="text-muted-foreground" />
                                    </div>
                                    <h3 className="text-2xl font-black">No library items found</h3>
                                    <p className="text-muted-foreground font-medium mt-2">Try adjusting your filters or search terms.</p>
                                    <Button variant="outline" className="mt-8 rounded-xl font-black" onClick={() => { setActiveFilter("all"); setSearchTerm(""); }}>Clear Filters</Button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
