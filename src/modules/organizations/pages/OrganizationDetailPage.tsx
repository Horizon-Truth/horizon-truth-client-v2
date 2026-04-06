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