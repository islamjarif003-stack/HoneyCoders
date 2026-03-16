import { ShieldCheck, CreditCard, Lock, Sparkles, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Checkout = () => (
  <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background p-4">
    {/* Background effects */}
    <div className="absolute inset-0 dot-pattern opacity-30" />
    <motion.div
      className="absolute left-1/2 top-1/4 h-[400px] w-[400px] -translate-x-1/2 rounded-full opacity-[0.06]"
      style={{ background: "radial-gradient(circle, hsl(239 84% 67%), transparent 70%)" }}
      animate={{ scale: [1, 1.2, 1] }}
      transition={{ duration: 6, repeat: Infinity }}
    />

    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full max-w-xl"
    >
      <div className="mb-6 text-center">
        <Link to="/" className="group inline-flex items-center gap-2 font-display text-lg font-bold">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            <img src="/hunny-it-logo-1.jpeg" alt="Hunny IT" className="h-9 w-9 rounded-lg object-cover" />
          </motion.div>
          Hunny IT
        </Link>
        <h1 className="mt-4 font-display text-xl font-bold">Checkout</h1>
        <div className="mt-1 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
          <Lock className="h-3 w-3" /> Secure SSL Encrypted
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card/80 p-6 shadow-elevated backdrop-blur-xl gradient-border">
        {/* Order Summary */}
        <motion.div
          className="mb-6 rounded-xl border border-border bg-muted/30 p-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Order Summary</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold">Horizon React Dashboard Pro</p>
              <p className="mt-0.5 text-xs text-muted-foreground">by DevCraft Studio · v3.2.0</p>
            </div>
            <span className="text-lg font-bold tabular-nums text-gradient">$49</span>
          </div>
        </motion.div>

        {/* Payment Form */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div>
            <label className="mb-1.5 block text-sm font-medium">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm outline-none transition-all duration-300 focus:border-primary/50 focus:shadow-glow"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Card Details</label>
            <div className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3.5 py-2.5 transition-all duration-300 focus-within:border-primary/50 focus-within:shadow-glow">
              <CreditCard className="h-4 w-4 text-muted-foreground" />
              <input type="text" placeholder="4242 4242 4242 4242" className="flex-1 border-0 bg-transparent text-sm outline-none" />
              <input type="text" placeholder="MM/YY" className="w-16 border-0 bg-transparent text-right text-sm outline-none" />
              <input type="text" placeholder="CVC" className="w-12 border-0 bg-transparent text-right text-sm outline-none" />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Coupon Code</label>
            <div className="flex gap-2">
              <input type="text" placeholder="Enter coupon" className="flex-1 rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm outline-none transition-all duration-300 focus:border-primary/50 focus:shadow-glow" />
              <Button variant="outline" size="sm" className="hover:border-primary/30">Apply</Button>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="mt-6 border-t border-border pt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="tabular-nums font-medium">$49.00</span>
          </div>
          <div className="mt-4 flex items-center justify-between text-lg font-bold">
            <span>Total</span>
            <span className="tabular-nums text-gradient">$49.00</span>
          </div>
        </motion.div>

        <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} className="mt-6">
          <Button size="lg" className="w-full gradient-primary text-primary-foreground shadow-glow transition-shadow hover:shadow-lg text-base">
            <Sparkles className="mr-2 h-4 w-4" /> Pay $49.00
          </Button>
        </motion.div>

        <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5" />
          Payments processed securely via Stripe
        </div>
      </div>

      <div className="mt-4 text-center">
        <Link to="/products" className="group inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
          <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" /> Back to products
        </Link>
      </div>
    </motion.div>
  </div>
);

export default Checkout;
