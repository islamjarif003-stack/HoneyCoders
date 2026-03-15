import { Download, FileArchive, Clock } from "lucide-react";
import { Link } from "react-router-dom";
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
        <h1 className="mb-6 font-display text-2xl font-bold">My Library</h1>
        <p className="mb-8 text-sm text-muted-foreground">Download your purchased products below.</p>

        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-20 animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        ) : orders?.length ? (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="flex items-center justify-between rounded-lg border border-border bg-card p-5 shadow-ink">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-md bg-indigo-50 text-primary">
                    <FileArchive className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold">{(order as any).products?.title || "Product"}</h3>
                    <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{new Date(order.created_at).toLocaleDateString()}</span>
                      <span className="tabular-nums">${order.amount}</span>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${order.status === 'completed' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                </div>
                {order.status === 'completed' && (
                  <Button size="sm" className="bg-primary text-primary-foreground hover:bg-indigo-700">
                    <Download className="mr-1.5 h-3.5 w-3.5" /> Download
                  </Button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="py-24 text-center">
            <p className="text-lg font-medium text-muted-foreground">Your library is empty.</p>
            <p className="mt-1 text-sm text-muted-foreground">Start building with our top-rated kits.</p>
            <Link to="/products" className="mt-4 inline-block text-primary hover:underline">Browse products</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserLibrary;
