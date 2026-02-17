import { Link } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function DashboardPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Dashboard Overview</h2>
                    <p className="text-muted-foreground mt-1">Welcome to the Horizon Truth management console.</p>
                </div>
                <Button asChild className="rounded-xl h-11 px-6 font-bold shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 transition-all active:scale-95">
                    <Link to="/report">
                        <AlertTriangle className="mr-2 h-4 w-4" />
                        Report Incident
                    </Link>
                </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {["Total Revenue", "Subscriptions", "Active Users", "Active Now"].map((item) => (
                    <div key={item} className="rounded-xl border bg-card p-6 text-card-foreground shadow">
                        <h3 className="text-sm font-medium">{item}</h3>
                        <div className="text-2xl font-bold">$45,231.89</div>
                        <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
