import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Users, Shield, UserCheck, UserX, Trash2, Search, Filter, MoreVertical, Mail, Calendar, UserPlus, ChevronLeft, ChevronRight, Eye, Pencil, ShieldCheck, X, Clock, RotateCcw } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/shared/components/ui/badge";
import { adminService, type User, type UserActivityEntry, type UserStatus } from "@/services/admin.service";
import { MODERATION_ROLES, useAuthStore, type UserRole } from "@/store/auth.store";
import { toast } from "sonner";
import { cn } from "@/shared/lib/utils";

/**
 * Role vocabulary. These values must match the backend `UserRole` enum
 * exactly — the page previously offered `ORGANIZATION_ADMIN`, which no role
 * has ever been called, so both creating and filtering by it silently failed.
 */
const ROLE_OPTIONS: { value: UserRole; label: string; hint: string }[] = [
    { value: 'PLAYER', label: 'Field Agent (Player)', hint: 'Plays missions. No moderation access.' },
    { value: 'MODERATOR', label: 'Moderator', hint: 'Reviews reports, flags and hides content, warns users.' },
    { value: 'SENIOR_MODERATOR', label: 'Senior Moderator', hint: 'Adds deletions, suspensions, appeals and audit access.' },
    { value: 'ORG_ADMIN', label: 'Organisation Admin', hint: 'Adds bans, the flag catalogue and the moderator roster.' },
    { value: 'SYSTEM_ADMIN', label: 'System Admin', hint: 'Full platform access.' },
];

const roleLabel = (role: UserRole) =>
    ROLE_OPTIONS.find(r => r.value === role)?.label ?? role.replace(/_/g, ' ');

export default function UserManagementPage() {
    const PAGE_SIZE = 10;
    const currentUser = useAuthStore(s => s.user);
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newUser, setNewUser] = useState<{ fullName: string; email: string; username: string; role: UserRole; password: string }>({ fullName: '', email: '', username: '', role: 'PLAYER', password: '' });
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const [detailUser, setDetailUser] = useState<User | null>(null);
    const [activity, setActivity] = useState<UserActivityEntry[] | null>(null);
    const [editUser, setEditUser] = useState<User | null>(null);
    const [editForm, setEditForm] = useState<{ fullName: string; username: string; email: string; role: UserRole }>({ fullName: '', username: '', email: '', role: 'PLAYER' });
    const [isSaving, setIsSaving] = useState(false);

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
            setNewUser({ fullName: '', email: '', username: '', role: 'PLAYER', password: '' });
            fetchUsers();
        } catch (error) {
            toast.error("Failed to onboard personnel");
        }
    };

    // Reset to the first page whenever the search or role filter changes.
    useEffect(() => {
        setPage(1);
    }, [searchTerm, roleFilter]);

    // Close the row menu on an outside click or Escape.
    useEffect(() => {
        if (!openMenuId) return;
        const close = () => setOpenMenuId(null);
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
        window.addEventListener('click', close);
        window.addEventListener('keydown', onKey);
        return () => {
            window.removeEventListener('click', close);
            window.removeEventListener('keydown', onKey);
        };
    }, [openMenuId]);

    // Fetch from the server (debounced for search) on page/filter changes.
    useEffect(() => {
        const timeoutId = setTimeout(() => fetchUsers(page), searchTerm ? 400 : 0);
        return () => clearTimeout(timeoutId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, searchTerm, roleFilter]);

    const handleStatusToggle = async (user: User) => {
        try {
            // DEACTIVATED, not INACTIVE — the latter is not in the backend enum
            // and used to fail once it reached the database.
            const newStatus: UserStatus = user.status === 'ACTIVE' ? 'DEACTIVATED' : 'ACTIVE';
            await adminService.updateUserStatus(user.id, newStatus);
            toast.success(`${user.fullName} is now ${newStatus.toLowerCase()}`);
            fetchUsers();
        } catch (error) {
            toast.error(apiMessage(error, "Failed to update user status"));
        }
    };

    const handleRoleChange = async (user: User, role: UserRole) => {
        if (role === user.role) return;
        const label = roleLabel(role);
        if (!confirm(`Change ${user.fullName}'s role to ${label}?`)) return;
        try {
            await adminService.updateUser(user.id, { role });
            toast.success(`${user.fullName} is now ${label}`);
            setDetailUser(prev => (prev && prev.id === user.id ? { ...prev, role } : prev));
            fetchUsers();
        } catch (error) {
            toast.error(apiMessage(error, "Failed to change role"));
        }
    };

    const handleSaveEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editUser) return;
        setIsSaving(true);
        try {
            await adminService.updateUser(editUser.id, editForm);
            toast.success("User updated");
            setEditUser(null);
            fetchUsers();
        } catch (error) {
            toast.error(apiMessage(error, "Failed to update user"));
        } finally {
            setIsSaving(false);
        }
    };

    const openDetail = async (user: User) => {
        setDetailUser(user);
        setActivity(null);
        try {
            const response = await adminService.getUserActivity(user.id, { limit: 8 });
            setActivity(response.data ?? []);
        } catch {
            // Activity is supplementary — the panel still shows the profile.
            setActivity([]);
        }
    };

    const openEdit = (user: User) => {
        setEditUser(user);
        setEditForm({
            fullName: user.fullName,
            username: user.username,
            email: user.email,
            role: user.role,
        });
    };

    const handleDelete = async (user: User) => {
        if (!confirm(`Permanently delete ${user.fullName} (${user.email})? This cannot be undone.`)) return;
        try {
            await adminService.deleteUser(user.id);
            toast.success("User deleted successfully");
            setDetailUser(prev => (prev?.id === user.id ? null : prev));
            fetchUsers();
        } catch (error) {
            toast.error(apiMessage(error, "Failed to delete user"));
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
                                    onChange={e => setNewUser({ ...newUser, role: e.target.value as UserRole })}
                                >
                                    {ROLE_OPTIONS.map(option => (
                                        <option key={option.value} value={option.value}>{option.label}</option>
                                    ))}
                                </select>
                                <p className="text-[11px] text-muted-foreground px-1">
                                    {ROLE_OPTIONS.find(r => r.value === newUser.role)?.hint}
                                </p>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Access Key</label>
                                <Input
                                    required
                                    type="password"
                                    minLength={8}
                                    className="h-14 rounded-2xl bg-muted/30 border-none font-bold italic"
                                    value={newUser.password}
                                    onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                                    placeholder="Min 8 chars, upper+lower+digit+special"
                                />
                                <p className="text-[11px] text-muted-foreground px-1">
                                    Must include uppercase, lowercase, number, and special character.
                                </p>
                            </div>
                            <p className="text-[10px] font-medium italic text-muted-foreground px-1">
                                Share the access key securely with the new personnel through a trusted channel.
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
                        {ROLE_OPTIONS.map(option => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
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
                                            {user.role.replace(/_/g, ' ')}
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
                                                title={user.status === 'ACTIVE' ? 'Deactivate account' : 'Reactivate account'}
                                                className="rounded-xl hover:bg-primary/10 hover:text-primary"
                                                onClick={() => handleStatusToggle(user)}
                                            >
                                                {user.status === 'ACTIVE' ? <UserX size={18} /> : <UserCheck size={18} />}
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                title="Delete account"
                                                className="rounded-xl hover:bg-destructive/10 hover:text-destructive"
                                                onClick={() => handleDelete(user)}
                                            >
                                                <Trash2 size={18} />
                                            </Button>

                                            {/* Row menu. Hand-rolled rather than pulling in a dropdown
                                                dependency the design system does not ship. */}
                                            <div className="relative" onClick={e => e.stopPropagation()}>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="rounded-xl"
                                                    aria-haspopup="menu"
                                                    aria-expanded={openMenuId === user.id}
                                                    aria-label={`Actions for ${user.fullName}`}
                                                    onClick={() => setOpenMenuId(openMenuId === user.id ? null : user.id)}
                                                >
                                                    <MoreVertical size={18} />
                                                </Button>

                                                {openMenuId === user.id && (
                                                    <div
                                                        role="menu"
                                                        className="absolute right-0 top-full mt-2 z-30 w-64 rounded-2xl border border-border bg-card shadow-xl p-2 animate-in fade-in zoom-in-95 duration-150 text-left"
                                                    >
                                                        <MenuItem icon={<Eye size={15} />} onClick={() => { setOpenMenuId(null); openDetail(user); }}>
                                                            View details
                                                        </MenuItem>
                                                        <MenuItem icon={<Pencil size={15} />} onClick={() => { setOpenMenuId(null); openEdit(user); }}>
                                                            Edit user
                                                        </MenuItem>

                                                        <div className="my-2 h-px bg-border" />
                                                        <p className="px-3 pb-1 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                                            Assign role
                                                        </p>
                                                        {ROLE_OPTIONS.map(option => (
                                                            <MenuItem
                                                                key={option.value}
                                                                icon={option.value === user.role
                                                                    ? <ShieldCheck size={15} className="text-primary" />
                                                                    : <Shield size={15} />}
                                                                disabled={option.value === user.role || user.id === currentUser?.id}
                                                                onClick={() => { setOpenMenuId(null); handleRoleChange(user, option.value); }}
                                                            >
                                                                {option.label}
                                                            </MenuItem>
                                                        ))}

                                                        {user.id === currentUser?.id && (
                                                            <p className="px-3 py-2 text-[11px] text-muted-foreground leading-snug">
                                                                You cannot change your own role.
                                                            </p>
                                                        )}

                                                        {MODERATION_ROLES.includes(user.role) && (
                                                            <>
                                                                <div className="my-2 h-px bg-border" />
                                                                <Link
                                                                    to={`/dashboard/moderation/users/${user.id}`}
                                                                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-semibold hover:bg-muted transition-colors"
                                                                    onClick={() => setOpenMenuId(null)}
                                                                >
                                                                    <Shield size={15} /> Moderation record
                                                                </Link>
                                                            </>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
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

            {/* Detail panel */}
            {detailUser && (
                <div className="fixed inset-0 z-50 flex justify-end">
                    <div
                        className="absolute inset-0 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200"
                        onClick={() => setDetailUser(null)}
                        aria-hidden
                    />
                    <aside
                        role="dialog"
                        aria-modal="true"
                        aria-label={`Details for ${detailUser.fullName}`}
                        className="relative z-10 w-full max-w-md h-full overflow-y-auto bg-card border-l border-border p-8 space-y-8 shadow-2xl animate-in slide-in-from-right duration-300"
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center text-primary font-black text-2xl uppercase">
                                    {detailUser.fullName.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="text-xl font-black tracking-tight capitalize">{detailUser.fullName}</h3>
                                    <p className="text-xs text-muted-foreground font-medium">@{detailUser.username}</p>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setDetailUser(null)} aria-label="Close details">
                                <X size={20} />
                            </Button>
                        </div>

                        <dl className="space-y-4">
                            <DetailRow label="Email" value={detailUser.email} />
                            <DetailRow label="Role" value={roleLabel(detailUser.role)} />
                            <DetailRow label="Status" value={detailUser.status} />
                            <DetailRow label="Joined" value={new Date(detailUser.createdAt).toLocaleString()} />
                            {detailUser.lastLoginAt && (
                                <DetailRow label="Last seen" value={new Date(detailUser.lastLoginAt).toLocaleString()} />
                            )}
                            <DetailRow label="User ID" value={detailUser.id} mono />
                        </dl>

                        <div className="flex flex-wrap gap-2">
                            <Button variant="outline" className="rounded-xl font-bold gap-2" onClick={() => { openEdit(detailUser); setDetailUser(null); }}>
                                <Pencil size={15} /> Edit
                            </Button>
                            <Button variant="outline" className="rounded-xl font-bold gap-2" onClick={() => handleStatusToggle(detailUser)}>
                                {detailUser.status === 'ACTIVE' ? <><UserX size={15} /> Deactivate</> : <><RotateCcw size={15} /> Reactivate</>}
                            </Button>
                            {MODERATION_ROLES.includes(detailUser.role) && (
                                <Button asChild variant="outline" className="rounded-xl font-bold gap-2">
                                    <Link to={`/dashboard/moderation/users/${detailUser.id}`}>
                                        <Shield size={15} /> Moderation record
                                    </Link>
                                </Button>
                            )}
                        </div>

                        <div className="space-y-3">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Recent activity</h4>
                            {activity === null ? (
                                <p className="text-xs text-muted-foreground">Loading…</p>
                            ) : activity.length === 0 ? (
                                <p className="text-xs text-muted-foreground">No recorded activity.</p>
                            ) : (
                                <ul className="space-y-2">
                                    {activity.map(entry => (
                                        <li key={entry.id} className="flex items-start gap-3 rounded-2xl bg-muted/40 px-4 py-3">
                                            <Clock size={14} className="mt-0.5 text-muted-foreground shrink-0" />
                                            <div className="min-w-0">
                                                <p className="text-xs font-bold">{entry.action}</p>
                                                <p className="text-[11px] text-muted-foreground">
                                                    {new Date(entry.createdAt).toLocaleString()}
                                                    {entry.ipAddressPartial ? ` · ${entry.ipAddressPartial}` : ''}
                                                </p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </aside>
                </div>
            )}

            {/* Edit dialog */}
            {editUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
                    <div className="bg-card border border-border/50 w-full max-w-xl rounded-[2.5rem] p-8 shadow-2xl space-y-8 animate-in zoom-in-95 duration-300">
                        <div className="flex items-center justify-between">
                            <h3 className="text-2xl font-black italic uppercase tracking-tighter">Edit personnel</h3>
                            <Button variant="ghost" size="icon" onClick={() => setEditUser(null)} className="rounded-full" aria-label="Close">
                                <X size={22} />
                            </Button>
                        </div>

                        <form onSubmit={handleSaveEdit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Full name</label>
                                <Input
                                    required
                                    className="h-14 rounded-2xl bg-muted/30 border-none font-bold italic"
                                    value={editForm.fullName}
                                    onChange={e => setEditForm({ ...editForm, fullName: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Email</label>
                                    <Input
                                        required
                                        type="email"
                                        className="h-14 rounded-2xl bg-muted/30 border-none font-bold italic"
                                        value={editForm.email}
                                        onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Username</label>
                                    <Input
                                        required
                                        className="h-14 rounded-2xl bg-muted/30 border-none font-bold italic"
                                        value={editForm.username}
                                        onChange={e => setEditForm({ ...editForm, username: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Role</label>
                                <select
                                    className="w-full h-14 rounded-2xl bg-muted/30 border-none px-4 font-bold italic outline-none appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                    value={editForm.role}
                                    disabled={editUser.id === currentUser?.id}
                                    onChange={e => setEditForm({ ...editForm, role: e.target.value as UserRole })}
                                >
                                    {ROLE_OPTIONS.map(option => (
                                        <option key={option.value} value={option.value}>{option.label}</option>
                                    ))}
                                </select>
                                <p className="text-[11px] text-muted-foreground px-1">
                                    {editUser.id === currentUser?.id
                                        ? 'You cannot change your own role — ask another administrator.'
                                        : ROLE_OPTIONS.find(r => r.value === editForm.role)?.hint}
                                </p>
                            </div>
                            <Button type="submit" disabled={isSaving} className="w-full h-14 rounded-full font-black uppercase tracking-widest shadow-xl shadow-primary/20">
                                {isSaving ? 'Saving…' : 'Save changes'}
                            </Button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

function MenuItem({ icon, children, onClick, disabled }: {
    icon: React.ReactNode;
    children: React.ReactNode;
    onClick: () => void;
    disabled?: boolean;
}) {
    return (
        <button
            role="menuitem"
            type="button"
            disabled={disabled}
            onClick={onClick}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-semibold hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
        >
            {icon}
            {children}
        </button>
    );
}

function DetailRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
    return (
        <div className="flex items-start justify-between gap-4">
            <dt className="text-[10px] font-black uppercase tracking-widest text-muted-foreground pt-0.5">{label}</dt>
            <dd className={cn("text-sm font-semibold text-right break-all", mono && "font-mono text-xs")}>{value}</dd>
        </div>
    );
}

/** Surface the backend's message (e.g. the self-edit and uniqueness rules). */
function apiMessage(error: unknown, fallback: string): string {
    const message = (error as { response?: { data?: { message?: string | string[] } } })
        ?.response?.data?.message;
    if (Array.isArray(message)) return message[0] ?? fallback;
    return message ?? fallback;
}
