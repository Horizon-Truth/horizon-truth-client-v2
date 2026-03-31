import { useEffect, useState } from "react";
import { Users, Shield, UserCheck, UserX, Trash2, Search, Filter, MoreVertical, Mail, Calendar, UserPlus, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/shared/components/ui/badge";
import { adminService, type User } from "@/services/admin.service";
import { toast } from "sonner";
import { cn } from "@/shared/lib/utils";

export default function UserManagementPage() {
    const PAGE_SIZE = 10;
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newUser, setNewUser] = useState({ fullName: '', email: '', username: '', role: 'PLAYER' });

    const fetchUsers = async (targetPage = page) => {
        setIsLoading(true);
        try {
            const response = await adminService.getUsers({
                page: targetPage,
                limit: PAGE_SIZE,
                search: searchTerm || undefined,
                role: roleFilter === "all" ? undefined : roleFilter,
            });
            setUsers(response.data || []);
            const meta = response.meta;
            setTotalPages(meta?.totalPages || 1);
            setTotal(meta?.total ?? (response.data?.length || 0));
        } catch (error) {
            console.error("Failed to fetch users:", error);
            toast.error("Failed to load users");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await adminService.createUser(newUser);
            toast.success("Personnel onboarded successfully");
            setIsCreateModalOpen(false);
            setNewUser({ fullName: '', email: '', username: '', role: 'PLAYER' });
            fetchUsers();
        } catch (error) {
            toast.error("Failed to onboard personnel");
        }
    };

    // Reset to the first page whenever the search or role filter changes.
    useEffect(() => {
        setPage(1);
    }, [searchTerm, roleFilter]);

    // Fetch from the server (debounced for search) on page/filter changes.
    useEffect(() => {
        const timeoutId = setTimeout(() => fetchUsers(page), searchTerm ? 400 : 0);
        return () => clearTimeout(timeoutId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, searchTerm, roleFilter]);

    const handleStatusToggle = async (user: User) => {
        try {
            const newStatus = user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
            await adminService.updateUserStatus(user.id, newStatus);
            toast.success(`User ${user.email} status updated to ${newStatus}`);
            fetchUsers();
        } catch (error) {
            toast.error("Failed to update user status");
        }
    };

    const handleDelete = async (user: User) => {
        if (!confirm(`Are you sure you want to delete user ${user.email}?`)) return;
        try {
            await adminService.deleteUser(user.id);
            toast.success("User deleted successfully");
            fetchUsers();
        } catch (error) {
            toast.error("Failed to delete user");
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-black tracking-tight italic uppercase tracking-wider">User Directory</h2>
                    <p className="text-sm text-muted-foreground mt-1">Manage system accounts and access control parameters.</p>
                </div>
                <Button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="w-full sm:w-auto rounded-2xl h-12 px-6 font-bold gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all border-none bg-foreground text-background"
                >
                    <UserPlus size={20} />
                    Onboard New User
                </Button>
            </div>

            {/* Create User Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
                    <div className="bg-card border border-border/50 w-full max-w-xl rounded-[2.5rem] p-8 shadow-2xl space-y-8 animate-in zoom-in-95 duration-300">
                        <div className="flex items-center justify-between">
                            <h3 className="text-3xl font-black italic uppercase tracking-tighter decoration-primary decoration-4 underline-offset-8 underline">Embed Personnel</h3>
                            <Button variant="ghost" size="icon" onClick={() => setIsCreateModalOpen(false)} className="rounded-full">
                                <UserX size={24} />
                            </Button>
                        </div>

                        <form onSubmit={handleCreateUser} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Identity Full Name</label>
                                <Input
                                    required
                                    className="h-14 rounded-2xl bg-muted/30 border-none font-bold italic"
                                    value={newUser.fullName}
                                    onChange={e => setNewUser({ ...newUser, fullName: e.target.value })}
                                    placeholder="e.g. CASPIAN MILLER"
                                />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Comms Email</label>
                                    <Input
                                        required
                                        type="email"
                                        className="h-14 rounded-2xl bg-muted/30 border-none font-bold italic"
                                        value={newUser.email}
                                        onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                                        placeholder="miller@truthwatch.io"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Registry Handle</label>
                                    <Input
                                        required
                                        className="h-14 rounded-2xl bg-muted/30 border-none font-bold italic"
                                        value={newUser.username}
                                        onChange={e => setNewUser({ ...newUser, username: e.target.value })}
                                        placeholder="caspian_88"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Clearance Protocol</label>
                                <select
                                    className="w-full h-14 rounded-2xl bg-muted/30 border-none px-4 font-bold italic outline-none appearance-none cursor-pointer"
                                    value={newUser.role}
                                    onChange={e => setNewUser({ ...newUser, role: e.target.value })}
                                >
                                    <option value="PLAYER">Field Agent (Player)</option>
                                    <option value="ORGANIZATION_ADMIN">Lead Investigator (Org Admin)</option>
                                    <option value="SYSTEM_ADMIN">High Overseer (System Admin)</option>
                                </select>
                            </div>
                            <p className="text-[10px] font-medium italic text-muted-foreground px-1">
                                Note: Initial authentication credentials will be dispatched to the provided communications channel upon verification.
                            </p>
                            <Button type="submit" className="w-full h-14 rounded-full font-black uppercase tracking-widest shadow-xl shadow-primary/20">
                                Authenticate and Embed
                            </Button>
                        </form>
                    </div>
                </div>
            )}

            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 bg-card border border-border/50 p-2 sm:p-4 rounded-[1.5rem] sm:rounded-[2rem] shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <Input
                        placeholder="Search personnel..."
                        className="pl-12 h-12 rounded-xl bg-muted/30 border-none focus-visible:ring-1 focus-visible:ring-primary"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2 px-4 h-12 border-t md:border-t-0 md:border-l border-border/50">
                    <Filter size={18} className="text-muted-foreground" />
                    <select
                        className="flex-1 bg-transparent border-none focus:ring-0 text-xs sm:text-sm font-bold uppercase tracking-wider outline-none"
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                    >
                        <option value="all">All Roles</option>
                        <option value="SYSTEM_ADMIN">Super Admin</option>
                        <option value="ORGANIZATION_ADMIN">Org Admin</option>
                        <option value="PLAYER">Player</option>
                    </select>
                </div>
            </div>

            <div className="bg-card border border-border/50 rounded-[1.5rem] sm:rounded-[2.5rem] overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-muted/30 border-b border-border/50">
                                <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground">User Profile</th>
                                <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground">Access Level</th>
                                <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</th>
                                <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground">Verified Since</th>
                                <th className="px-8 py-5 text-right text-[10px] font-black uppercase tracking-widest text-muted-foreground">Protocol</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="py-20 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                                            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Accessing Mainframe...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-20 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <Users size={40} className="text-muted-foreground/30" />
                                            <p className="text-sm font-bold text-muted-foreground">No personnel records found in this vector.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : users.map((user) => (
                                <tr key={user.id} className="group hover:bg-accent/5 transition-colors">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black uppercase transition-transform group-hover:scale-110">
                                                {user.fullName.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-extrabold text-lg tracking-tight capitalize">{user.fullName}</p>
                                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium grayscale group-hover:grayscale-0 transition-all">
                                                    <Mail size={12} />
                                                    {user.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <Badge variant="outline" className="rounded-lg h-7 px-3 font-black tracking-widest text-[9px] uppercase border-primary/20 bg-primary/5 text-primary">
                                            <Shield size={10} className="mr-1.5" />
                                            {user.role.replace('_', ' ')}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-5">
                                        <Badge className={cn(
                                            "rounded-lg h-7 px-3 font-black tracking-widest text-[9px] uppercase",
                                            user.status === 'ACTIVE' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-red-500/10 text-red-500 border-red-500/20"
                                        )}>
                                            <div className={cn("w-1.5 h-1.5 rounded-full mr-2", user.status === 'ACTIVE' ? "bg-emerald-500" : "bg-red-500")} />
                                            {user.status}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                                            <Calendar size={14} />
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="rounded-xl hover:bg-primary/10 hover:text-primary"
                                                onClick={() => handleStatusToggle(user)}
                                            >
                                                {user.status === 'ACTIVE' ? <UserX size={18} /> : <UserCheck size={18} />}
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="rounded-xl hover:bg-destructive/10 hover:text-destructive"
                                                onClick={() => handleDelete(user)}
                                            >
                                                <Trash2 size={18} />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="rounded-xl">
                                                <MoreVertical size={18} />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {!isLoading && total > 0 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 sm:px-8 py-5 border-t border-border/50">
                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                            Page {page} of {totalPages} · {total} {total === 1 ? "record" : "records"}
                        </p>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                className="rounded-xl gap-1 font-bold"
                                disabled={page <= 1}
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                            >
                                <ChevronLeft size={16} /> Prev
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="rounded-xl gap-1 font-bold"
                                disabled={page >= totalPages}
                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            >
                                Next <ChevronRight size={16} />
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
