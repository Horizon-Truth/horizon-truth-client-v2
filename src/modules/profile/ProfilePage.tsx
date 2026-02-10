import { useAuthStore } from '@/store/auth.store';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/shared/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { ShieldCheck, Mail, User as UserIcon, Calendar } from 'lucide-react';

const ProfilePage = () => {
    const { user } = useAuthStore();

    if (!user) return null;

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-extrabold tracking-tight">User Profile</h2>
                    <p className="text-muted-foreground mt-1">Manage your account details and security settings.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Column: Avatar & Quick Info */}
                <Card className="md:col-span-1 h-fit bg-card/50 backdrop-blur-xl border-white/5 shadow-xl">
                    <CardContent className="pt-8">
                        <div className="flex flex-col items-center text-center">
                            <div className="relative p-1 rounded-full bg-gradient-to-br from-primary to-primary/20 shadow-2xl shadow-primary/20">
                                <Avatar className="h-24 w-24 border-4 border-card">
                                    <AvatarImage src={user.avatarUrl} alt={user.fullName} />
                                    <AvatarFallback className="text-2xl font-bold bg-muted/50">
                                        {user.fullName.split(" ").map(n => n[0]).join("").toUpperCase()}
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
                                    <span>{user.email}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                    <UserIcon size={16} className="text-primary/70" />
                                    <span>@{user.username || user.fullName.toLowerCase().replace(/\s+/g, '')}</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Right Column: Detailed Info */}
                <div className="md:col-span-2 space-y-6">
                    <Card className="bg-card/50 backdrop-blur-xl border-white/5 shadow-xl">
                        <CardHeader>
                            <CardTitle className="text-lg font-bold">Personal Information</CardTitle>
                            <CardDescription>Core details associated with your identity on Horizon Truth.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Full Name</p>
                                    <p className="font-medium text-foreground">{user.fullName}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Email Address</p>
                                    <p className="font-medium text-foreground">{user.email}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Account Role</p>
                                    <div className="flex items-center gap-2">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
                                            {user.role}
                                        </span>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Account ID</p>
                                    <p className="font-mono text-[10px] text-muted-foreground">{user.id}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-card/50 backdrop-blur-xl border-white/5 shadow-xl">
                        <CardHeader>
                            <CardTitle className="text-lg font-bold flex items-center gap-2">
                                <ShieldCheck className="text-primary h-5 w-5" />
                                Security Settings
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                                <h4 className="font-bold text-sm">Two-Factor Authentication</h4>
                                <p className="text-xs text-muted-foreground mt-1">Enhance your account security with 2FA protocol.</p>
                                <button className="mt-3 text-xs font-bold text-primary hover:underline">Configure Now &rarr;</button>
                            </div>
                            <div className="p-4 rounded-xl bg-muted/40 border border-white/5">
                                <h4 className="font-bold text-sm">Last Session Activity</h4>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                    <Calendar size={12} />
                                    <span>Active session started 2 hours ago from London, UK</span>
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
