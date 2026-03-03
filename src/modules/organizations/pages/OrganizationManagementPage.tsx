import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, Globe, CheckCircle2, XCircle, Search, MoreVertical, Plus, MapPin } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/shared/components/ui/badge";
import { adminService, type Organization } from "@/services/admin.service";
import { toast } from "sonner";
import { cn } from "@/shared/lib/utils";

export default function OrganizationManagementPage() {
    const navigate = useNavigate();
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newOrg, setNewOrg] = useState({
        name: '',
        country: 'Ethiopia',
        description: '',
        type: 'CROWDSOURCED',
        adminFullName: '',
        adminEmail: '',
        adminPassword: ''
    });

    const fetchOrganizations = async () => {
        setIsLoading(true);
        try {
            const response = await adminService.getOrganizations();
            setOrganizations(response.data || []);
        } catch (error) {
            console.error("Failed to fetch organizations:", error);
            toast.error("Failed to load organizations");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOrganizations();
    }, []);

    const handleCreateOrg = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await adminService.createOrganization(newOrg);
            toast.success("Organization and Admin registered successfully");
            setIsCreateModalOpen(false);
            setNewOrg({
                name: '',
                country: 'Ethiopia',
                description: '',
                type: 'CROWDSOURCED',
                adminFullName: '',
                adminEmail: '',
                adminPassword: ''
            });
            fetchOrganizations();
        } catch (error) {
            toast.error("Failed to create organization");
        }
    };

    const handleStatusToggle = async (org: Organization) => {
        try {
            const newStatus = org.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
            await adminService.updateOrganizationStatus(org.id, newStatus);
            toast.success(`Organization status updated to ${newStatus}`);
            fetchOrganizations();
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    const filteredOrgs = organizations.filter(org =>
        org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        org.country.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl sm:text-4xl font-black tracking-tighter italic uppercase">Registry of Entities</h2>
                    <p className="text-sm text-muted-foreground mt-1 font-medium italic">Authorized organizations and institutional partners.</p>
                </div>
                <Button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="w-full sm:w-auto rounded-full h-14 px-8 font-black uppercase tracking-widest gap-2 bg-foreground text-background hover:bg-foreground/90 transition-all shadow-xl shadow-foreground/10"
                >
                    <Plus size={20} />
                    Register Unit
                </Button>
            </div>

            {/* Create Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
                    <div className="bg-card border border-border/50 w-full max-w-xl rounded-[2.5rem] p-8 shadow-2xl space-y-8 animate-in zoom-in-95 duration-300">
                        <div className="flex items-center justify-between">
                            <h3 className="text-3xl font-black italic uppercase tracking-tighter decoration-primary decoration-4 underline-offset-8 underline">Onboard Entity</h3>
                            <Button variant="ghost" size="icon" onClick={() => setIsCreateModalOpen(false)} className="rounded-full">
                                <XCircle size={24} />
                            </Button>
                        </div>

                        <form onSubmit={handleCreateOrg} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Entity Name</label>
                                <Input
                                    required
                                    className="h-14 rounded-2xl bg-muted/30 border-none font-bold italic"
                                    value={newOrg.name}
                                    onChange={e => setNewOrg({ ...newOrg, name: e.target.value })}
                                    placeholder="e.g. TRUTH WATCH"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Territory</label>
                                    <Input
                                        required
                                        className="h-14 rounded-2xl bg-muted/30 border-none font-bold italic"
                                        value={newOrg.country}
                                        onChange={e => setNewOrg({ ...newOrg, country: e.target.value })}
                                        placeholder="Ethiopia"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Sector Class</label>
                                    <select
                                        className="w-full h-14 rounded-2xl bg-muted/30 border-none px-4 font-bold italic outline-none appearance-none"
                                        value={newOrg.type}
                                        onChange={e => setNewOrg({ ...newOrg, type: e.target.value })}
                                    >
                                        <option value="CROWDSOURCED">Crowdsourced</option>
                                        <option value="GOVERNMENT">Government</option>
                                        <option value="NGO">NGO</option>
                                        <option value="ACADEMIC">Academic</option>
                                        <option value="MEDIA">Media</option>
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-4 pt-4 border-t border-border/20">
                                <h4 className="text-xs font-black uppercase tracking-widest text-primary ml-1">Administrative Node Access</h4>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Admin Full Name</label>
                                    <Input
                                        className="h-14 rounded-2xl bg-muted/30 border-none font-bold italic"
                                        value={newOrg.adminFullName}
                                        onChange={e => setNewOrg({ ...newOrg, adminFullName: e.target.value })}
                                        placeholder="e.g. ABEBE BIKILA"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Admin Email (Required)</label>
                                        <Input
                                            required
                                            type="email"
                                            className="h-14 rounded-2xl bg-muted/30 border-none font-bold italic"
                                            value={newOrg.adminEmail}
                                            onChange={e => setNewOrg({ ...newOrg, adminEmail: e.target.value })}
                                            placeholder="admin@entity.com"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Access Protocol (Password)</label>
                                        <Input
                                            required
                                            type="password"
                                            className="h-14 rounded-2xl bg-muted/30 border-none font-bold italic"
                                            value={newOrg.adminPassword}
                                            onChange={e => setNewOrg({ ...newOrg, adminPassword: e.target.value })}
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>
                            </div>

                            <Button type="submit" className="w-full h-14 rounded-full font-black uppercase tracking-widest shadow-xl shadow-primary/20">
                                Verify and Register Unit
                            </Button>
                        </form>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                <div className="md:col-span-2 relative">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                    <Input
                        placeholder="Filter by Unit Name or Territory..."
                        className="pl-14 h-16 rounded-[2rem] bg-card border-border/40 focus-visible:ring-offset-0 focus-visible:ring-primary/20 text-base sm:text-lg font-bold italic"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="bg-card border border-border/40 rounded-[2rem] flex items-center px-8 py-4 sm:py-0 gap-4 shadow-sm">
                    <Globe size={20} className="text-primary flex-shrink-0" />
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Active Nodes</p>
                        <p className="text-2xl font-black italic tracking-tighter">{organizations.filter(o => o.status === 'ACTIVE').length}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                    Array(6).fill(0).map((_, i) => (
                        <div key={i} className="h-64 rounded-[3rem] bg-card animate-pulse border border-border/40" />
                    ))
                ) : filteredOrgs.length === 0 ? (
                    <div className="col-span-full py-20 text-center bg-card border border-dashed border-border/60 rounded-[3rem]">
                        <Building2 size={48} className="mx-auto text-muted-foreground/20 mb-4" />
                        <h3 className="text-xl font-bold italic text-muted-foreground">Entity Records Unavailable</h3>
                        <p className="text-muted-foreground mt-2">Adjust your search parameters or register a new unit.</p>
                    </div>
                ) : filteredOrgs.map((org) => (
                    <div key={org.id} className="group relative bg-card border border-border/40 rounded-[3rem] p-8 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />

                        <div className="flex flex-col h-full gap-6">
                            <div className="flex items-start justify-between relative z-10">
                                <div className="p-3 sm:p-4 bg-muted/50 rounded-2xl group-hover:bg-primary/10 transition-colors">
                                    <Building2 className="text-primary" size={24} />
                                </div>
                                <Badge className={cn(
                                    "rounded-full px-3 sm:px-4 h-6 sm:h-7 font-black tracking-widest text-[8px] sm:text-[9px] uppercase",
                                    org.status === 'ACTIVE' ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
                                )}>
                                    {org.status}
                                </Badge>
                            </div>

                            <div className="space-y-2">
                                <button
                                    onClick={() => navigate(`/dashboard/organizations/${org.id}`)}
                                    className="text-2xl font-black tracking-tighter italic uppercase group-hover:text-primary transition-colors text-left hover:underline underline-offset-4"
                                >
                                    {org.name}
                                </button>
                                <div className="flex items-center gap-2 text-muted-foreground font-bold italic text-sm">
                                    <MapPin size={14} className="text-primary" />
                                    {org.country}
                                </div>
                            </div>

                            <p className="text-sm text-muted-foreground font-medium line-clamp-2 italic">
                                {org.description || "Experimental truth verification agency specializing in cross-border narrative analytics."}
                            </p>

                            <div className="mt-auto pt-6 flex items-center justify-between border-t border-border/20">
                                <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 italic">
                                    EST: {new Date(org.createdAt).getFullYear()}
                                </div>
                                <div className="flex items-center gap-1">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="rounded-full hover:bg-primary/10 hover:text-primary"
                                        onClick={() => handleStatusToggle(org)}
                                    >
                                        {org.status === 'ACTIVE' ? <XCircle size={18} /> : <CheckCircle2 size={18} />}
                                    </Button>
                                    <Button variant="ghost" size="icon" className="rounded-full">
                                        <MoreVertical size={18} />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
