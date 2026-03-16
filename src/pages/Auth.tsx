import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Eye, EyeOff, ArrowRight } from "lucide-react";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) toast.error(error.message);
      else { toast.success("Welcome back!"); navigate("/"); }
    } else {
      const { error } = await supabase.auth.signUp({
        email, password,
        options: { data: { display_name: displayName }, emailRedirectTo: window.location.origin },
      });
      if (error) toast.error(error.message);
      else toast.success("Account created! Check your email to verify.");
    }
    setLoading(false);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background p-4">
      {/* Background effects */}
      <div className="absolute inset-0 dot-pattern opacity-40" />
      <motion.div
        className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full opacity-[0.07]"
        style={{ background: "radial-gradient(circle, hsl(239 84% 67%), transparent 70%)" }}
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute -bottom-40 -right-40 h-[400px] w-[400px] rounded-full opacity-[0.05]"
        style={{ background: "radial-gradient(circle, hsl(250 90% 72%), transparent 70%)" }}
        animate={{ scale: [1.1, 1, 1.1] }}
        transition={{ duration: 10, repeat: Infinity }}
      />

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
          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? "login" : "signup"}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="mt-5 font-display text-2xl font-bold">
                {isLogin ? "Welcome back" : "Create an account"}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {isLogin ? "Sign in to your account" : "Join the marketplace"}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        <motion.div
          className="rounded-2xl border border-border bg-card/80 p-6 shadow-elevated backdrop-blur-xl"
          layout
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence>
              {!isLogin && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">Display Name</label>
                    <input
                      type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)}
                      required={!isLogin}
                      className="w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm outline-none transition-all duration-300 focus:border-primary/50 focus:shadow-glow"
                      placeholder="Your name"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Email</label>
              <input
                type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                className="w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm outline-none transition-all duration-300 focus:border-primary/50 focus:shadow-glow"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)}
                  required minLength={6}
                  className="w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 pr-10 text-sm outline-none transition-all duration-300 focus:border-primary/50 focus:shadow-glow"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
              <Button type="submit" disabled={loading} className="w-full gradient-primary text-primary-foreground shadow-glow transition-shadow hover:shadow-lg">
                {loading ? (
                  <motion.div className="h-4 w-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} />
                ) : (
                  <span className="flex items-center gap-2">
                    {isLogin ? "Sign In" : "Create Account"}
                    <ArrowRight className="h-4 w-4" />
                  </span>
                )}
              </Button>
            </motion.div>
          </form>
        </motion.div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button onClick={() => setIsLogin(!isLogin)} className="font-medium text-primary transition-colors hover:text-primary/80">
            {isLogin ? "Sign up" : "Sign in"}
          </button>
        </p>
      </motion.div>
    </div>
  );
};

export default Auth;
