import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { CheckCircle2, Eye, EyeOff, ArrowRight } from "lucide-react";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    setLoading(true);
    try {
      await api("/auth/reset-password", { method: "POST", body: { token, password } });
      setSuccess(true);
      toast.success("Password reset successfully!");
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    }
    setLoading(false);
  };

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <div className="absolute inset-0 dot-pattern opacity-40" />
        <div className="relative rounded-2xl border border-border bg-card/80 p-8 text-center shadow-elevated backdrop-blur-xl">
          <h1 className="font-display text-xl font-bold text-foreground">Invalid Reset Link</h1>
          <p className="mt-2 text-sm text-muted-foreground">No reset token found.</p>
          <Link to="/forgot-password">
            <Button variant="outline" className="mt-4">Request New Link</Button>
          </Link>
        </div>
      </div>
    );
  }

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
          <h1 className="mt-5 font-display text-2xl font-bold">Set new password</h1>
          <p className="mt-1 text-sm text-muted-foreground">Enter your new password below</p>
        </div>

        <motion.div className="rounded-2xl border border-border bg-card/80 p-6 shadow-elevated backdrop-blur-xl">
          {success ? (
            <div className="flex flex-col items-center gap-4 py-4 text-center">
              <CheckCircle2 className="h-12 w-12 text-green-500" />
              <h2 className="font-display text-lg font-semibold">Password Updated!</h2>
              <p className="text-sm text-muted-foreground">You can now sign in with your new password.</p>
              <Link to="/auth">
                <Button className="gradient-primary text-primary-foreground shadow-glow">
                  Sign In <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium">New Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 pr-10 text-sm outline-none transition-all duration-300 focus:border-primary/50 focus:shadow-glow"
                    placeholder="••••••••"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Confirm Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm outline-none transition-all duration-300 focus:border-primary/50 focus:shadow-glow"
                  placeholder="••••••••"
                />
              </div>
              <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                <Button type="submit" disabled={loading} className="w-full gradient-primary text-primary-foreground shadow-glow">
                  {loading ? (
                    <motion.div className="h-4 w-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} />
                  ) : (
                    "Reset Password"
                  )}
                </Button>
              </motion.div>
            </form>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
