import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Building2, MapPin, CheckCircle2, XCircle,
    Users as UsersIcon, Mail, Shield, ArrowLeft, MoreVertical,
    Trash2, UserPlus
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { adminService, type Organization, type User } from "@/services/admin.service";
import { toast } from "sonner";
import { cn } from "@/shared/lib/utils";

export default function OrganizationDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [organization, setOrganization] = useState<Organization | null>(null);
    const [orgUsers, setOrgUsers] = useState<any[]>([]);
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [assignment, setAssignment] = useState({ userId: '', role: 'MEMBER' });

    const fetchData = async () => {
        if (!id) return;
        setIsLoading(true);
        try {
            const [orgRes, usersRes, allUsersRes] = await Promise.all([
                adminService.getOrganizationById(id),
                adminService.getOrganizationUsers(id),
                adminService.getUsers()
            ]);
            setOrganization(orgRes.data);
            setOrgUsers(usersRes.data || []);
            setAllUsers(allUsersRes.data?.data || allUsersRes.data || []);
        } catch (error) {
            console.error("Failed to fetch organization details:", error);
            toast.error("Failed to load organization data");
        } finally {
            setIsLoading(false);
        }
    };

    const handleAssignAgent = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id || !assignment.userId) return;
        try {
            await adminService.addOrganizationUser(id, assignment);
            toast.success("Agent assigned successfully");
            setIsAssignModalOpen(false);
            setAssignment({ userId: '', role: 'MEMBER' });
            fetchData();
        } catch (error) {
            toast.error("Failed to assign agent");
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    const handleStatusToggle = async () => {
        if (!organization) return;
        try {
            const newStatus = organization.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
            await adminService.updateOrganizationStatus(organization.id, newStatus);
            toast.success(`Organization status updated to ${newStatus}`);
            fetchData();
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                <p className="text-sm font-black uppercase tracking-widest text-muted-foreground animate-pulse">Syncing Entity Data...</p>
            </div>
        );
    }

    if (!organization) {
        return (
            <div className="text-center py-20">
                <p className="text-lg font-bold text-muted-foreground">Entity not found in current sector.</p>
                <Button variant="link" onClick={() => navigate("/dashboard/organizations")} className="mt-4">
                    Return to Organizations
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header section */}
            <div className="flex flex-col gap-6">
                <Button
                    variant="ghost"
                    className="w-fit gap-2 -ml-2 text-muted-foreground hover:text-primary transition-colors font-bold uppercase tracking-widest text-[10px]"
                    onClick={() => navigate("/dashboard/organizations")}
                >
                    <ArrowLeft size={14} />
                    Back to Organizations
                </Button>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="p-4 bg-primary/10 rounded-2xl text-primary">
                                <Building2 size={32} />
                            </div>
                            <div>
                                <h1 className="text-4xl sm:text-5xl font-black tracking-tighter italic uppercase underline decoration-primary/30 decoration-4 underline-offset-8">
                                    {organization.name}
                                </h1>
                                <div className="flex items-center gap-4 mt-2">
                                    <Badge className={cn(
                                        "rounded-full px-4 h-7 font-black tracking-widest text-[10px] uppercase",
                                        organization.status === 'ACTIVE' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-red-500/10 text-red-500 border-red-500/20"
                                    )}>
                                        <div className={cn("w-1.5 h-1.5 rounded-full mr-2", organization.status === 'ACTIVE' ? "bg-emerald-500" : "bg-red-500")} />
                                        {organization.status}
                                    </Badge>
                                    <span className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                        <MapPin size={14} className="text-primary" />
                                        {organization.country}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            className="rounded-xl border-border/40 font-bold uppercase tracking-widest text-[10px] h-11 px-6 hover:bg-primary/5 hover:text-primary transition-all"
                            onClick={handleStatusToggle}
                        >
                            {organization.status === 'ACTIVE' ? <XCircle size={16} className="mr-2" /> : <CheckCircle2 size={16} className="mr-2" />}
                            Deactivate Unit
                        </Button>
                        <Button className="rounded-xl font-bold uppercase tracking-widest text-[10px] h-11 px-6 shadow-lg shadow-primary/20 transition-all">
                            Edit Metadata
                        </Button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Stats and Info */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-card border border-border/40 rounded-[2.5rem] p-8 space-y-8">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">Institutional Summary</p>
                            <p className="text-sm font-medium leading-relaxed italic text-muted-foreground/80">
                                {organization.description || "Experimental truth verification agency specializing in cross-border narrative analytics and digital forensic investigation."}
                            </p>
                        </div>

                        <div className="space-y-4 pt-6 border-t border-border/20">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">Organization ID</span>
                                <span className="text-[10px] font-mono font-bold text-primary">{organization.id}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">Establishment</span>
                                <span className="text-xs font-bold">{new Date(organization.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">Personnel Count</span>
                                <span className="text-sm font-black italic">{orgUsers.length} Nodes</span>
                            </div>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-3xl p-6">
                            <Shield className="text-emerald-500 mb-2" size={20} />
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Verification Rate</p>
                            <p className="text-2xl font-black italic tracking-tighter text-emerald-600">98.4%</p>
                        </div>
                        <div className="bg-primary/5 border border-primary/10 rounded-3xl p-6">
                            <UsersIcon className="text-primary mb-2" size={20} />
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total Impact</p>
                            <p className="text-2xl font-black italic tracking-tighter text-primary">1.2k+</p>
                        </div>
                    </div>
                </div>

                {/* Right Column: User Management */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <h3 className="text-xl font-black uppercase tracking-widest italic">Assigned Personnel</h3>
                        <Button
                            onClick={() => setIsAssignModalOpen(true)}
                            className="h-10 rounded-xl px-4 font-bold border-none shadow-md shadow-primary/10 transition-all gap-2"
                        >
                            <UserPlus size={16} />
                            Assign Agent
                        </Button>
                    </div>

                    {/* Assign Agent Modal */}
                    {isAssignModalOpen && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
                            <div className="bg-card border border-border/50 w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl space-y-8 animate-in zoom-in-95 duration-300">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-2xl font-black italic uppercase tracking-tighter underline decoration-primary decoration-4 underline-offset-4">Assign User</h3>
                                    <Button variant="ghost" size="icon" onClick={() => setIsAssignModalOpen(false)} className="rounded-full">
                                        <XCircle size={24} />
                                    </Button>
                                </div>

                                <form onSubmit={handleAssignAgent} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Select User</label>
                                        <select
                                            required
                                            className="w-full h-14 rounded-2xl bg-muted/30 border-none px-4 font-bold italic outline-none appearance-none cursor-pointer"
                                            value={assignment.userId}
                                            onChange={e => setAssignment({ ...assignment, userId: e.target.value })}
                                        >
                                            <option value="">Select a user...</option>
                                            {allUsers.filter(u => !orgUsers.some(ou => ou.userId === u.id)).map(user => (
                                                <option key={user.id} value={user.id}>{user.fullName} ({user.email})</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Assigned Authority</label>
                                        <select
                                            className="w-full h-14 rounded-2xl bg-muted/30 border-none px-4 font-bold italic outline-none appearance-none cursor-pointer"
                                            value={assignment.role}
                                            onChange={e => setAssignment({ ...assignment, role: e.target.value })}
                                        >
                                            <option value="MEMBER">Member</option>
                                            <option value="ADMIN">Administrator</option>
                                            <option value="MANAGER">Manager</option>
                                        </select>
                                    </div>
                                    <Button type="submit" className="w-full h-14 rounded-full font-black uppercase tracking-widest shadow-xl shadow-primary/20">
                                        Confirm Assignment
                                    </Button>
                                </form>
                            </div>
                        </div>
                    )}

                    <div className="bg-card border border-border/40 rounded-[2.5rem] overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-muted/30 border-b border-border/40">
                                        <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground">User</th>
                                        <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground">Org Authority</th>
                                        <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</th>
                                        <th className="px-8 py-5 text-right text-[10px] font-black uppercase tracking-widest text-muted-foreground">Protocol</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/20">
                                    {orgUsers.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="py-20 text-center">
                                                <UsersIcon size={40} className="mx-auto text-muted-foreground/20 mb-3" />
                                                <p className="text-sm font-bold text-muted-foreground italic uppercase tracking-wider">No users in this organization.</p>
                                            </td>
                                        </tr>
                                    ) : orgUsers.map((item) => (
                                        <tr key={item.id} className="group hover:bg-primary/[0.02] transition-colors">
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center font-black text-xs uppercase group-hover:bg-primary group-hover:text-white transition-all duration-300">
                                                        {item.user?.fullName?.charAt(0) || 'U'}
                                                    </div>
                                                    <div>
                                                        <p className="font-extrabold text-sm uppercase tracking-tight italic">{item.user?.fullName || 'Unknown User'}</p>
                                                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-bold">
                                                            <Mail size={10} />
                                                            {item.user?.email || 'N/A'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <Badge variant="outline" className="rounded-lg h-6 px-3 font-black tracking-widest text-[8px] uppercase border-primary/20 bg-primary/5 text-primary italic">
                                                    {item.role}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-5">
                                                <Badge className={cn(
                                                    "rounded-lg h-6 px-3 font-black tracking-widest text-[8px] uppercase",
                                                    item.status === 'ACTIVE' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-red-500/10 text-red-500 border-red-500/20"
                                                )}>
                                                    {item.status}
                                                </Badge>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-colors">
                                                        <Trash2 size={14} />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                                                        <MoreVertical size={14} />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
