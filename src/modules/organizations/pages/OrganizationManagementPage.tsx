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