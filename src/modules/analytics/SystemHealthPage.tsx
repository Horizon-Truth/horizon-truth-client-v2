import { useSystemHealth } from "@/shared/hooks/useAnalytics";
import {
    Activity,
    Cpu,
    Database,
    Clock,
    Server,
    Zap,
    ShieldCheck,
    AlertTriangle,
    RefreshCw,
    HardDrive
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Progress } from "@/shared/components/ui/progress";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function SystemHealthPage() {
    const { data: health, isLoading, isError, refetch, isFetching } = useSystemHealth();

    const formatUptime = (seconds: number) => {
        const days = Math.floor(seconds / (3600 * 24));
        const hours = Math.floor((seconds % (3600 * 24)) / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        return `${days}d ${hours}h ${minutes}m`;
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                <p className="text-sm font-black uppercase tracking-widest text-muted-foreground animate-pulse">Loading system health...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center">
                <div className="p-6 bg-destructive/10 rounded-full text-destructive">
                    <AlertTriangle size={48} />
                </div>
                <div className="space-y-2">
                    <h3 className="text-2xl font-black italic uppercase">Connection Failed</h3>
                    <p className="text-muted-foreground max-w-md font-medium">Unable to reach the server. System status is unknown.</p>
                </div>
                <Button onClick={() => refetch()} className="rounded-xl font-bold px-8">Retry</Button>
            </div>
        );
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <motion.div
            className="space-y-8 p-1"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-600 uppercase italic">
                        System Health
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1 font-medium italic">
                        Live server status and performance metrics.
                    </p>
                </div>
                <Button
                    onClick={() => {
                        refetch();
                        toast.success("Telemetry data refreshed");
                    }}
                    variant="outline"
                    className="rounded-xl font-bold gap-2 border-2 hover:bg-primary/5 transition-all"
                    disabled={isFetching}
                >
                    <RefreshCw size={16} className={isFetching ? "animate-spin" : ""} />
                    Refresh
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Status Overview Card */}
                <motion.div variants={itemVariants} className="md:col-span-3 bg-card border border-border/40 rounded-[2.5rem] p-8 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none group-hover:opacity-[0.07] transition-opacity">
                        <ShieldCheck size={180} />
                    </div>
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-8 relative z-10">
                        <div className={`p-6 rounded-[2rem] shadow-xl ${health?.status === 'HEALTHY' ? 'bg-emerald-500/10 text-emerald-500 shadow-emerald-500/20' : 'bg-destructive/10 text-destructive shadow-destructive/20'}`}>
                            <Zap size={40} className={health?.status === 'HEALTHY' ? 'animate-pulse' : ''} />
                        </div>
                        <div className="space-y-2">
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Server Status</p>
                            <h3 className={`text-5xl font-black italic tracking-tighter uppercase ${health?.status === 'HEALTHY' ? 'text-emerald-500' : 'text-destructive'}`}>
                                {health?.status}
                            </h3>
                            <div className="flex items-center gap-4 pt-2">
                                <span className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                                    <Clock size={14} className="text-primary" />
                                    Uptime: <span className="text-foreground">{formatUptime(health?.uptime || 0)}</span>
                                </span>
                                <span className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                                    <Server size={14} className="text-primary" />
                                    Version: <span className="text-foreground">{health?.version}</span>
                                </span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Memory Usage Card */}
                <motion.div variants={itemVariants} className="bg-card border border-border/40 rounded-[2.5rem] p-8 space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-500">
                            <Cpu size={24} />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Memory Usage</p>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-end justify-between">
                            <h4 className="text-3xl font-black italic">{health?.memory.heapUsed} <span className="text-sm uppercase font-black text-muted-foreground not-italic">MB</span></h4>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase">Used / {health?.memory.heapTotal}MB Total</p>
                        </div>
                        <div className="space-y-1.5">
                            <Progress value={((health?.memory.heapUsed || 0) / (health?.memory.heapTotal || 1)) * 100} className="h-2 bg-blue-500/10" />
                            <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-muted-foreground opacity-50">
                                <span>Usage</span>
                                <span>{Math.round(((health?.memory.heapUsed || 0) / (health?.memory.heapTotal || 1)) * 100)}%</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Database Connectivity Card */}
                <motion.div variants={itemVariants} className="bg-card border border-border/40 rounded-[2.5rem] p-8 space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="p-3 bg-indigo-500/10 rounded-2xl text-indigo-500">
                            <Database size={24} />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Database</p>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h4 className="text-3xl font-black italic uppercase tracking-tighter">
                                {health?.database}
                            </h4>
                            <Activity size={24} className={health?.database === 'UP' ? 'text-emerald-500' : 'text-destructive'} />
                        </div>
                        <p className="text-[10px] text-muted-foreground font-medium italic leading-relaxed">
                            Database connection is active and responding.
                        </p>
                        <div className="pt-2 flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${health?.database === 'UP' ? 'bg-emerald-500 animate-pulse' : 'bg-destructive'}`} />
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Secure Connection</span>
                        </div>
                    </div>
                </motion.div>

                {/* Resource Metrics Card */}
                <motion.div variants={itemVariants} className="bg-card border border-border/40 rounded-[2.5rem] p-8 space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="p-3 bg-purple-500/10 rounded-2xl text-purple-500">
                            <HardDrive size={24} />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Memory (RSS)</p>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-end justify-between">
                            <h4 className="text-3xl font-black italic">{health?.memory.rss} <span className="text-sm uppercase font-black text-muted-foreground not-italic">MB</span></h4>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-50">Resident Set Size</p>
                        </div>
                        <div className="pt-2">
                            <div className="bg-muted px-3 py-1.5 rounded-lg inline-flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Environment: {health?.environment}</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            <motion.div variants={itemVariants} className="p-8 bg-primary/5 border border-primary/20 rounded-[2.5rem] text-center space-y-4">
                <p className="text-xs font-bold text-primary uppercase tracking-[0.2em] italic">Last checked: {health?.timestamp ? new Date(health.timestamp).toLocaleString() : 'N/A'}</p>
                <p className="text-[10px] text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                    Server health data refreshes automatically every 5 seconds.
                </p>
            </motion.div>
        </motion.div>
    );
}
