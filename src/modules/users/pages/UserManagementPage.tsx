import { useEffect, useState } from "react";
import { Users, Shield, UserCheck, UserX, Trash2, Search, Filter, MoreVertical, Mail, Calendar, UserPlus } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/shared/components/ui/badge";
import { adminService, type User } from "@/services/admin.service";
import { toast } from "sonner";
import { cn } from "@/shared/lib/utils";

export default function UserManagementPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const response = await adminService.getUsers();
            setUsers(response.data.data || []);
        } catch (error) {
            console.error("Failed to fetch users:", error);
            toast.error("Failed to load users");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

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

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.username.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === "all" || user.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-black tracking-tight italic uppercase tracking-wider">User Directory</h2>
                    <p className="text-muted-foreground mt-1">Manage system accounts and access control parameters.</p>
                </div>
                <Button className="rounded-2xl h-12 px-6 font-bold gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all">
                    <UserPlus size={20} />
                    Onboard New User
                </Button>
            </div>

            <div className="flex items-center gap-4 bg-card border border-border/50 p-4 rounded-[2rem] shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <Input
                        placeholder="Search by name, email, or username..."
                        className="pl-12 h-12 rounded-xl bg-muted/30 border-none focus-visible:ring-1 focus-visible:ring-primary"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2 px-4 border-l border-border/50">
                    <Filter size={18} className="text-muted-foreground" />
                    <select
                        className="bg-transparent border-none focus:ring-0 text-sm font-bold uppercase tracking-wider outline-none"
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

            <div className="bg-card border border-border/50 rounded-[2.5rem] overflow-hidden shadow-sm">
                <table className="w-full border-collapse">
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
                        ) : filteredUsers.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="py-20 text-center">
                                    <div className="flex flex-col items-center gap-4">
                                        <Users size={40} className="text-muted-foreground/30" />
                                        <p className="text-sm font-bold text-muted-foreground">No personnel records found in this vector.</p>
                                    </div>
                                </td>
                            </tr>
                        ) : filteredUsers.map((user) => (
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
        </div>
    );
}
