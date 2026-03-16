import { Download, FileArchive, Clock, Package } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "@/components/marketplace/Navbar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useMyOrders } from "@/hooks/useMarketplace";

const UserLibrary = () => {
  const { user } = useAuth();
  const { data: orders, isLoading } = useMyOrders();

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-24 text-center">
          <h1 className="text-2xl font-bold">Sign in to access your library</h1>
          <Link to="/auth" className="mt-4 inline-block text-primary hover:underline">Sign in</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="mb-2 font-display text-2xl font-bold">My Library</h1>
          <p className="mb-8 text-sm text-muted-foreground">Download your purchased products below.</p>
        </motion.div>

        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-20 animate-pulse rounded-xl bg-muted shimmer" />
            ))}
          </div>
        ) : orders?.length ? (
          <div className="space-y-4">
            {orders.map((order, i) => (
              <motion.div
                key={order.id}
                className="group flex items-center justify-between rounded-xl border border-border bg-card p-5 shadow-ink transition-all duration-300 hover:shadow-elevated hover:border-primary/20"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <div className="flex items-center gap-4">
                  <motion.div
                    className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/8 text-primary transition-all duration-300 group-hover:gradient-primary group-hover:text-primary-foreground group-hover:shadow-glow"
                    whileHover={{ rotate: 5 }}
                  >
                    <FileArchive className="h-6 w-6" />
                  </motion.div>
                  <div>
                    <h3 className="text-sm font-semibold">{(order as any).products?.title || "Product"}</h3>
                    <div className="mt-1.5 flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{new Date(order.created_at).toLocaleDateString()}</span>
                      <span className="tabular-nums font-medium">${order.amount}</span>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${order.status === 'completed' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                </div>
                {order.status === 'completed' && (
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button size="sm" className="gradient-primary text-primary-foreground shadow-glow transition-shadow hover:shadow-lg">
                      <Download className="mr-1.5 h-3.5 w-3.5" /> Download
                    </Button>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            className="py-24 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div
              className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/8 text-primary"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Package className="h-8 w-8" />
            </motion.div>
            <p className="text-lg font-medium text-muted-foreground">Your library is empty.</p>
            <p className="mt-1 text-sm text-muted-foreground">Start building with our top-rated kits.</p>
            <Link to="/products">
              <Button className="mt-6 gradient-primary text-primary-foreground shadow-glow">Browse products</Button>
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default UserLibrary;
