import { Component, type ErrorInfo, type ReactNode } from "react";
import { Button } from "@/shared/components/ui/button";
import { AlertTriangle, Home, RefreshCcw } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = "/";
  };

  private handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center bg-background">
          <div className="relative mb-8">
            <div className="absolute -inset-4 bg-destructive/20 blur-xl rounded-full animate-pulse" />
            <div className="relative w-20 h-20 bg-destructive/10 border-2 border-destructive/20 rounded-3xl flex items-center justify-center">
              <AlertTriangle className="w-10 h-10 text-destructive" />
            </div>
          </div>
          
          <h1 className="text-3xl font-black tracking-tight mb-2 uppercase italic">Protocol Interruption</h1>
          <p className="text-muted-foreground max-w-md mb-8 font-medium">
            The mission interface encountered an unexpected anomaly. System integrity remains stable, but a restart may be required.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={this.handleReload}
              className="rounded-2xl h-12 px-8 font-bold gap-2 shadow-lg shadow-primary/20"
            >
              <RefreshCcw className="w-4 h-4" />
              Reinitialize
            </Button>
            <Button 
              variant="outline" 
              onClick={this.handleReset}
              className="rounded-2xl h-12 px-8 font-bold gap-2 border-2"
            >
              <Home className="w-4 h-4" />
              Return to Base
            </Button>
          </div>

          {import.meta.env.DEV && (
            <div className="mt-12 p-4 bg-muted/50 rounded-xl border text-left max-w-2xl overflow-auto">
              <p className="text-xs font-mono text-destructive mb-2 uppercase font-bold tracking-widest">Debug Trace</p>
              <pre className="text-[10px] font-mono whitespace-pre-wrap opacity-70">
                {this.state.error?.stack}
              </pre>
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
