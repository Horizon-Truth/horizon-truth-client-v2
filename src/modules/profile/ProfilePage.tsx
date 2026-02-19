import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuthStore } from '@/store/auth.store';
import { userService } from '@/services/user.service';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/shared/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/shared/components/ui/form';
import {
    ShieldCheck,
    Mail,
    User as UserIcon,
    Calendar,
    Edit2,
    X,
    Save,
    Loader2,
    CheckCircle2,
    AlertCircle
} from 'lucide-react';

const profileSchema = z.object({
    fullName: z.string().min(2, { message: 'Full name must be at least 2 characters' }),
    username: z.string().min(3, { message: 'Username must be at least 3 characters' }).regex(/^[a-zA-Z0-9_-]+$/, { message: 'Invalid username format' }).optional().or(z.literal('')),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const ProfilePage = () => {
    const { user, updateUser } = useAuthStore();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            fullName: user?.fullName || '',
            username: user?.username || '',
        },
    });

    if (!user) return null;

    const onSubmit = async (values: ProfileFormValues) => {
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            const updated = await userService.updateProfile(values);
            updateUser(updated);
            setSuccess('Profile updated successfully!');
            setIsEditing(false);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to update profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        form.reset();
        setIsEditing(false);
        setError(null);
        setSuccess(null);
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">User Profile</h2>
                    <p className="text-sm text-muted-foreground mt-1">Manage your account details and security settings.</p>
                </div>
            </div>

            {success && (
                <div className="flex items-center gap-2 p-4 text-sm font-medium text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 rounded-xl animate-in fade-in slide-in-from-top-4">
                    <CheckCircle2 size={18} />
                    {success}
                </div>
            )}

            {error && (
                <div className="flex items-center gap-2 p-4 text-sm font-medium text-destructive bg-destructive/10 border border-destructive/20 rounded-xl animate-in fade-in slide-in-from-top-4">
                    <AlertCircle size={18} />
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Column: Avatar & Quick Info */}
                <Card className="md:col-span-1 h-fit bg-card/50 backdrop-blur-xl border-white/5 shadow-xl">
                    <CardContent className="pt-8">
                        <div className="flex flex-col items-center text-center">
                            <div className="relative p-1 rounded-full bg-gradient-to-br from-primary to-primary/20 shadow-2xl shadow-primary/20">
                                <Avatar className="h-24 w-24 border-4 border-card">
                                    <AvatarImage src={user.avatarUrl} alt={user.fullName} />
                                    <AvatarFallback className="text-2xl font-bold bg-muted/50">
                                        {user.fullName?.split(" ").map(n => n[0]).join("").toUpperCase() || "U"}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-1.5 rounded-full border-4 border-card shadow-lg">
                                    <ShieldCheck size={16} />
                                </div>
                            </div>
                            <h3 className="text-xl font-bold mt-4">{user.fullName}</h3>
                            <p className="text-sm text-muted-foreground font-medium uppercase tracking-widest">{user.role}</p>

                            <div className="mt-6 w-full space-y-3 pt-6 border-t border-white/5">
                                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                    <Mail size={16} className="text-primary/70" />
                                    <span className="truncate">{user.email}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                    <UserIcon size={16} className="text-primary/70" />
                                    <span>@{user.username || user.fullName.toLowerCase().replace(/\s+/g, '')}</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Right Column: Detailed Info / Edit Form */}
                <div className="md:col-span-2 space-y-6">
                    <Card className="bg-card/50 backdrop-blur-xl border-white/5 shadow-xl overflow-hidden relative">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
                            <div className="space-y-1.5">
                                <CardTitle className="text-lg font-bold">Personal Information</CardTitle>
                                <CardDescription>Core details associated with your identity on Horizon Truth.</CardDescription>
                            </div>
                            {!isEditing && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="bg-white/5 border-white/10 hover:bg-white/10"
                                    onClick={() => setIsEditing(true)}
                                >
                                    <Edit2 size={14} className="mr-2" />
                                    Edit Profile
                                </Button>
                            )}
                        </CardHeader>
                        <CardContent>
                            {isEditing ? (
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <FormField
                                                control={form.control}
                                                name="fullName"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Full Name</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                className="bg-background/50 border-white/5 focus-visible:ring-primary/30 h-11 rounded-xl"
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="username"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Username</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                placeholder="johndoe"
                                                                className="bg-background/50 border-white/5 focus-visible:ring-primary/30 h-11 rounded-xl"
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <div className="flex items-center gap-3 pt-4 justify-end">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                className="hover:bg-destructive/10 hover:text-destructive rounded-xl"
                                                onClick={handleCancel}
                                                disabled={loading}
                                            >
                                                <X size={16} className="mr-2" />
                                                Cancel
                                            </Button>
                                            <Button
                                                type="submit"
                                                className="bg-primary hover:shadow-lg hover:shadow-primary/20 rounded-xl"
                                                disabled={loading}
                                            >
                                                {loading ? (
                                                    <Loader2 size={16} className="mr-2 animate-spin" />
                                                ) : (
                                                    <Save size={16} className="mr-2" />
                                                )}
                                                {loading ? 'Saving...' : 'Save Changes'}
                                            </Button>
                                        </div>
                                    </form>
                                </Form>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                    <div className="space-y-1.5 p-4 rounded-xl bg-white/5 border border-white/5">
                                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Full Name</p>
                                        <p className="font-semibold text-lg text-foreground">{user.fullName}</p>
                                    </div>
                                    <div className="space-y-1.5 p-4 rounded-xl bg-white/5 border border-white/5">
                                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Email Address</p>
                                        <p className="font-semibold text-lg text-foreground truncate">{user.email}</p>
                                    </div>
                                    <div className="space-y-1.5 p-4 rounded-xl bg-white/5 border border-white/5">
                                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Account Role</p>
                                        <div className="flex items-center gap-2">
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
                                                {user.role}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="space-y-1.5 p-4 rounded-xl bg-white/5 border border-white/5">
                                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Account ID</p>
                                        <p className="font-mono text-xs text-muted-foreground">{user.id}</p>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="bg-card/50 backdrop-blur-xl border-white/5 shadow-xl lg:hover:border-primary/20 transition-colors">
                        <CardHeader>
                            <CardTitle className="text-lg font-bold flex items-center gap-2">
                                <ShieldCheck className="text-primary h-5 w-5" />
                                Security Settings
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 group cursor-pointer hover:bg-primary/10 transition-colors">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="font-bold text-sm">Two-Factor Authentication</h4>
                                        <p className="text-xs text-muted-foreground mt-1">Enhance your account security with 2FA protocol.</p>
                                    </div>
                                    <div className="bg-primary/10 p-2 rounded-lg group-hover:bg-primary/20 transition-colors">
                                        <Edit2 size={16} className="text-primary" />
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 rounded-xl bg-muted/40 border border-white/5">
                                <h4 className="font-bold text-sm">Last Session Activity</h4>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                    <Calendar size={12} />
                                    <span>Active session started 2 hours ago from your current IP</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
