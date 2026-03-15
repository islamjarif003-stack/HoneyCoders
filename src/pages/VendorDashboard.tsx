import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Package, Upload, DollarSign, BarChart3, Settings, LogOut } from "lucide-react";
import Navbar from "@/components/marketplace/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { useVendorProducts, useVendorOrders } from "@/hooks/useMarketplace";

const vendorNav = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/vendor" },
  { label: "Products", icon: Package, path: "/vendor/products" },
  { label: "Upload Product", icon: Upload, path: "/vendor/upload" },
  { label: "Sales & Earnings", icon: DollarSign, path: "/vendor/sales" },
  { label: "Analytics", icon: BarChart3, path: "/vendor/analytics" },
  { label: "Settings", icon: Settings, path: "/vendor/settings" },
];

const VendorDashboard = () => {
  const { pathname } = useLocation();
  const { user, isVendor, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const { data: products } = useVendorProducts();
  const { data: orders } = useVendorOrders();

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-24 text-center">
          <h1 className="text-2xl font-bold">Sign in to access the vendor panel</h1>
          <Link to="/auth" className="mt-4 inline-block text-primary hover:underline">Sign in</Link>
        </div>
      </div>
    );
  }

  const totalSales = orders?.reduce((sum, o) => sum + Number(o.amount), 0) || 0;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <aside className="sticky top-16 hidden h-[calc(100vh-64px)] w-[280px] shrink-0 border-r border-border bg-surface p-4 lg:block">
          <div className="mb-6 px-3">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Vendor Panel</p>
          </div>
          <nav className="space-y-1">
            {vendorNav.map((item) => {
              const active = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                    active ? "border-l-2 border-primary bg-indigo-50 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
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
          <h1 className="mb-6 font-display text-2xl font-bold">Vendor Dashboard</h1>
          <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { label: "Total Sales", value: `$${totalSales.toLocaleString()}` },
              { label: "Products", value: String(products?.length || 0) },
              { label: "Orders", value: String(orders?.length || 0) },
              { label: "Avg. Rating", value: "—" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-lg border border-border bg-card p-5 shadow-ink">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="mt-1 font-display text-2xl font-bold tabular-nums">{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="rounded-lg border border-border bg-card shadow-ink">
            <div className="border-b border-border p-4">
              <h2 className="font-display text-sm font-semibold">Recent Sales</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Product</th>
                    <th className="px-4 py-3 text-right font-medium text-muted-foreground">Amount</th>
                    <th className="px-4 py-3 text-right font-medium text-muted-foreground">Status</th>
                    <th className="px-4 py-3 text-right font-medium text-muted-foreground">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders?.slice(0, 10).map((order) => (
                    <tr key={order.id} className="border-b border-border last:border-0">
                      <td className="px-4 py-3 font-medium">{(order as any).products?.title || "—"}</td>
                      <td className="px-4 py-3 text-right tabular-nums font-medium">${order.amount}</td>
                      <td className="px-4 py-3 text-right">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${order.status === 'completed' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                  {(!orders || orders.length === 0) && (
                    <tr><td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">No sales yet</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default VendorDashboard;
