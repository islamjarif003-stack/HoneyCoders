import { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { ArrowLeft, Mail } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api("/auth/forgot-password", { method: "POST", body: { email } });
      setSent(true);
      toast.success("Check your email for the reset link!");
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    }
    setLoading(false);
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
          <h1 className="mt-5 font-display text-2xl font-bold">Reset your password</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Enter your email and we'll send you a reset link
          </p>
        </div>

        <motion.div className="rounded-2xl border border-border bg-card/80 p-6 shadow-elevated backdrop-blur-xl">
          {sent ? (
            <div className="flex flex-col items-center gap-4 py-4 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="font-display text-lg font-semibold">Check your email</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  If an account exists for <strong>{email}</strong>, you'll receive a password reset link.
                </p>
              </div>
              <Link to="/auth">
                <Button variant="outline" size="sm" className="mt-2">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back to Sign In
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm outline-none transition-all duration-300 focus:border-primary/50 focus:shadow-glow"
                  placeholder="you@example.com"
                />
              </div>
              <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                <Button type="submit" disabled={loading} className="w-full gradient-primary text-primary-foreground shadow-glow">
                  {loading ? (
                    <motion.div className="h-4 w-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} />
                  ) : (
                    "Send Reset Link"
                  )}
                </Button>
              </motion.div>
            </form>
          )}
        </motion.div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          <Link to="/auth" className="font-medium text-primary transition-colors hover:text-primary/80">
            <ArrowLeft className="mr-1 inline h-3 w-3" /> Back to Sign In
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
