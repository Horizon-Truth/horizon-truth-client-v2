import { ResetPasswordForm } from '@/shared/components/auth/ResetPasswordForm';

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/40 to-background px-4 py-12">
      <div className="w-full max-w-md bg-card/80 backdrop-blur-xl border border-border/60 rounded-3xl shadow-2xl overflow-hidden">
        <ResetPasswordForm />
      </div>
    </div>
  );
}
