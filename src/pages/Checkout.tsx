import { ShieldCheck, CreditCard, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const Checkout = () => (
  <div className="flex min-h-screen items-center justify-center bg-background p-4">
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-xl"
    >
      <div className="mb-6 text-center">
        <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
          <span className="text-sm font-bold text-primary-foreground">S</span>
        </div>
        <h1 className="font-display text-xl font-bold">Checkout</h1>
        <div className="mt-1 flex items-center justify-center gap-1 text-xs text-muted-foreground">
          <Lock className="h-3 w-3" /> Secure SSL Encrypted
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card p-6 shadow-soft">
        {/* Order Summary */}
        <div className="mb-6 border-b border-border pb-6">
          <h2 className="mb-3 text-sm font-semibold">Order Summary</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Horizon React Dashboard Pro</p>
              <p className="text-xs text-muted-foreground">by DevCraft Studio · v3.2.0</p>
            </div>
            <span className="text-lg font-bold tabular-nums">$49</span>
          </div>
        </div>

        {/* Payment Form */}
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Email</label>
            <input type="email" placeholder="you@example.com" className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none transition-shadow focus:ring-2 focus:ring-primary/20" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Card Details</label>
            <div className="flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2.5">
              <CreditCard className="h-4 w-4 text-muted-foreground" />
              <input type="text" placeholder="4242 4242 4242 4242" className="flex-1 border-0 bg-transparent text-sm outline-none" />
              <input type="text" placeholder="MM/YY" className="w-16 border-0 bg-transparent text-right text-sm outline-none" />
              <input type="text" placeholder="CVC" className="w-12 border-0 bg-transparent text-right text-sm outline-none" />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Coupon Code</label>
            <div className="flex gap-2">
              <input type="text" placeholder="Enter coupon" className="flex-1 rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none" />
              <Button variant="outline" size="sm">Apply</Button>
            </div>
          </div>
        </div>

        <div className="mt-6 border-t border-border pt-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="tabular-nums font-medium">$49.00</span>
          </div>
          <div className="mt-4 flex items-center justify-between text-lg font-bold">
            <span>Total</span>
            <span className="tabular-nums">$49.00</span>
          </div>
        </div>

        <Button size="lg" className="mt-6 w-full bg-primary text-primary-foreground hover:bg-indigo-700">
          Pay $49.00
        </Button>

        <div className="mt-4 flex items-center justify-center gap-1 text-xs text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5" />
          Payments processed securely via Stripe
        </div>
      </div>
    </motion.div>
  </div>
);

export default Checkout;
