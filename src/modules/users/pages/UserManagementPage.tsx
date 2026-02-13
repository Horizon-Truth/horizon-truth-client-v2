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