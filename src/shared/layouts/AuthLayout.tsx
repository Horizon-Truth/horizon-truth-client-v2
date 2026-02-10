import { Outlet } from 'react-router-dom';

export function AuthLayout() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
            <div className="w-full max-w-md">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-primary">Horizon</h1>
                    <p className="text-muted-foreground mt-2">The ultimate gaming platform</p>
                </div>
                <Outlet />
            </div>
        </div>
    );
}
