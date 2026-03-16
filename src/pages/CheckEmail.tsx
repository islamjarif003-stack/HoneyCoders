import { useSearchParams, Link } from "react-router-dom";
import { useState } from "react";
import { api } from "@/lib/api";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Mail, ArrowLeft } from "lucide-react";

const CheckEmail = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";
  const [resending, setResending] = useState(false);

  const handleResend = async () => {
    if (!email) return;
    setResending(true);
    try {
      await api("/auth/resend-verification", { method: "POST", body: { email } });
      toast.success("Verification email sent! Check your inbox.");
    } catch (err: any) {
      toast.error(err.message || "Failed to resend");
    }
    setResending(false);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background p-4">
      <div className="absolute inset-0 dot-pattern opacity-40" />
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-sm"
      >
        <div className="mb-8 text-center">
          <Link to="/" className="group inline-flex items-center gap-2.5 font-display text-xl font-bold">
            <motion.div
              className="flex h-9 w-9 items-center justify-center rounded-lg gradient-primary shadow-glow"
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <span className="text-sm font-bold text-primary-foreground">S</span>
            </motion.div>
            SourceStack
          </Link>
        </div>

        <motion.div className="rounded-2xl border border-border bg-card/80 p-8 shadow-elevated backdrop-blur-xl">
          <div className="flex flex-col items-center gap-5 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Mail className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold">Check your email</h1>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                We've sent a verification link to{" "}
                {email ? <strong className="text-foreground">{email}</strong> : "your email"}.
                Click the link to activate your account.
              </p>
            </div>

            <div className="w-full space-y-3 pt-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={handleResend}
                disabled={resending || !email}
              >
                {resending ? "Sending..." : "Resend verification email"}
              </Button>
              <Link to="/auth" className="block">
                <Button variant="ghost" className="w-full text-muted-foreground">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back to Sign In
                </Button>
              </Link>
            </div>

            <p className="text-xs text-muted-foreground">
              Didn't receive the email? Check your spam folder or try resending.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default CheckEmail;
