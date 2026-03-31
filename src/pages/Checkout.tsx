import { useState, useEffect } from "react";
import { ShieldCheck, Lock, Sparkles, ArrowLeft, Loader2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface Product {
  id: string;
  title: string;
  price: number;
  version?: string;
  thumbnail_url?: string;
  vendor_id?: string;
}

const Checkout = () => {
  const { productId } = useParams<{ productId: string }>();
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load product data
  useEffect(() => {
    if (!productId) {
      setError("No product selected.");
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${productId}`);
        if (!res.ok) throw new Error("Product not found.");
        const data = await res.json();
        setProduct(data);
      } catch (e: any) {
        setError(e.message || "Failed to load product.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  // Handle EPS payment
  const handlePayment = async () => {
    if (!user || !token) {
      toast.error("Please sign in to make a purchase.");
      navigate("/auth");
      return;
    }

    if (!product) return;

    setPaying(true);
    try {
      const res = await fetch("/api/payment/eps/init", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId: product.id }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Payment initialization failed.");
      }

      if (data.redirectUrl) {
        // Redirect user to EPS Payment Portal
        window.location.href = data.redirectUrl;
      } else {
        throw new Error("No redirect URL received from payment gateway.");
      }
    } catch (e: any) {
      toast.error(e.message || "Payment failed. Please try again.");
      setPaying(false);
    }
  };

  // Loading
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Error
  if (error || !product) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
        <AlertTriangle className="mb-4 h-12 w-12 text-amber-500" />
        <h1 className="text-xl font-bold">{error || "Product not found"}</h1>
        <Link to="/products" className="mt-4 text-sm text-primary hover:underline">
          Back to products
        </Link>
      </div>
    );
  }

  const price = Number(product.price);

  return (
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
            <motion.div whileHover={{ scale: 1.1, rotate: 5 }}>
              <img src="/hunny-it-logo-1.jpeg" alt="Hunny IT" className="h-9 w-9 rounded-lg object-cover" />
            </motion.div>
            Hunny IT
          </Link>
          <h1 className="mt-4 font-display text-xl font-bold">Checkout</h1>
          <div className="mt-1 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
            <Lock className="h-3 w-3" /> Secure Payment via EPS Gateway
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
            <div className="flex items-center gap-4">
              {product.thumbnail_url && (
                <img
                  src={product.thumbnail_url}
                  alt={product.title}
                  className="h-14 w-14 rounded-lg border border-border object-cover"
                />
              )}
              <div className="flex-1">
                <p className="text-sm font-semibold">{product.title}</p>
                {product.version && (
                  <p className="mt-0.5 text-xs text-muted-foreground">Version {product.version}</p>
                )}
              </div>
              <span className="text-lg font-bold tabular-nums text-gradient">
                ${price.toFixed(2)}
              </span>
            </div>
          </motion.div>

          {/* Price Breakdown */}
          <motion.div
            className="border-t border-border pt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="tabular-nums font-medium">${price.toFixed(2)}</span>
            </div>
            <div className="mt-4 flex items-center justify-between text-lg font-bold">
              <span>Total</span>
              <span className="tabular-nums text-gradient">${price.toFixed(2)}</span>
            </div>
          </motion.div>

          {/* Pay Button */}
          <motion.div whileHover={{ scale: paying ? 1 : 1.01 }} whileTap={{ scale: paying ? 1 : 0.99 }} className="mt-6">
            <Button
              size="lg"
              onClick={handlePayment}
              disabled={paying}
              className="w-full gradient-primary text-primary-foreground shadow-glow transition-shadow hover:shadow-lg text-base"
            >
              {paying ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Redirecting to Payment...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Pay ${price.toFixed(2)}
                </>
              )}
            </Button>
          </motion.div>

          {/* Secure badge */}
          <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5" />
            Payments processed securely via EPS Payment Gateway
          </div>

          {!user && (
            <div className="mt-3 rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 text-center">
              <p className="text-xs text-amber-600 dark:text-amber-400">
                You need to <Link to="/auth" className="font-semibold underline">sign in</Link> before making a purchase.
              </p>
            </div>
          )}
        </div>

        <div className="mt-4 text-center">
          <Link to="/products" className="group inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" /> Back to products
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Checkout;
