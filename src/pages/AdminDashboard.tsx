import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Package, Users, FolderTree, DollarSign, ShieldCheck, Settings, LogOut, CheckCircle2, XCircle } from "lucide-react";
import Navbar from "@/components/marketplace/Navbar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useAdminProducts } from "@/hooks/useMarketplace";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

const adminNav = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/admin" },
  { label: "Products", icon: Package, path: "/admin/products" },
  { label: "Vendors", icon: Users, path: "/admin/vendors" },
  { label: "Categories", icon: FolderTree, path: "/admin/categories" },
  { label: "Orders", icon: DollarSign, path: "/admin/orders" },
  { label: "Withdrawals", icon: DollarSign, path: "/admin/withdrawals" },
  { label: "Settings", icon: Settings, path: "/admin/settings" },
];

const AdminDashboard = () => {
  const { pathname } = useLocation();
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const { data: allProducts } = useAdminProducts();
  const queryClient = useQueryClient();

  const pendingProducts = allProducts?.filter(p => p.status === 'pending') || [];

  const handleApprove = async (productId: string) => {
    const { error } = await supabase.from("products").update({ status: "approved" as any }).eq("id", productId);
    if (error) toast.error("Failed to approve");
    else { toast.success("Product approved!"); queryClient.invalidateQueries({ queryKey: ["admin-products"] }); }
  };

  const handleReject = async (productId: string) => {
    const { error } = await supabase.from("products").update({ status: "rejected" as any }).eq("id", productId);
    if (error) toast.error("Failed to reject");
    else { toast.success("Product rejected"); queryClient.invalidateQueries({ queryKey: ["admin-products"] }); }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-24 text-center">
          <h1 className="text-2xl font-bold">Sign in to access admin</h1>
          <Link to="/auth" className="mt-4 inline-block text-primary hover:underline">Sign in</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <aside className="sticky top-16 hidden h-[calc(100vh-64px)] w-[280px] shrink-0 border-r border-border bg-surface p-4 lg:block">
          <div className="mb-6 flex items-center gap-2 px-3">
            <ShieldCheck className="h-4 w-4 text-primary" />
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Admin Panel</p>
          </div>
          <nav className="space-y-1">
            {adminNav.map((item) => {
              const active = pathname === item.path;
              return (
                <Link key={item.path} to={item.path}
                  className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${active ? "border-l-2 border-primary bg-indigo-50 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
                >
                  <item.icon className="h-4 w-4" />{item.label}
                </Link>
              );
            })}
          </nav>
          <div className="absolute bottom-4 left-4 right-4">
            <button onClick={() => { signOut(); navigate("/"); }} className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground">
              <LogOut className="h-4 w-4" /> Sign Out
            </button>
          </div>
        </aside>

        <main className="flex-1 p-6 lg:p-8">
          <h1 className="mb-6 font-display text-2xl font-bold">Admin Dashboard</h1>

          <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { label: "Total Products", value: String(allProducts?.length || 0) },
              { label: "Approved", value: String(allProducts?.filter(p => p.status === 'approved').length || 0) },
              { label: "Pending", value: String(pendingProducts.length) },
              { label: "Rejected", value: String(allProducts?.filter(p => p.status === 'rejected').length || 0) },
            ].map((stat) => (
              <div key={stat.label} className="rounded-lg border border-border bg-card p-5 shadow-ink">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="mt-1 font-display text-2xl font-bold tabular-nums">{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="rounded-lg border border-border bg-card shadow-ink">
            <div className="border-b border-border p-4">
              <h2 className="font-display text-sm font-semibold">Pending Product Approvals</h2>
            </div>
            <div className="divide-y divide-border">
              {pendingProducts.length > 0 ? pendingProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-4">
                  <div>
                    <p className="text-sm font-medium">{product.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {product.categories?.name} · ${product.price} · {new Date(product.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="text-emerald-600 hover:bg-emerald-50" onClick={() => handleApprove(product.id)}>
                      <CheckCircle2 className="mr-1 h-3.5 w-3.5" /> Approve
                    </Button>
                    <Button size="sm" variant="outline" className="text-destructive hover:bg-destructive/10" onClick={() => handleReject(product.id)}>
                      <XCircle className="mr-1 h-3.5 w-3.5" /> Reject
                    </Button>
                  </div>
                </div>
              )) : (
                <div className="p-8 text-center text-sm text-muted-foreground">No pending products</div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
