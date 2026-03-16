import { useVendorOrders, useVendorProducts } from "@/hooks/useMarketplace";
import { BarChart3, Package, ShoppingCart, Star } from "lucide-react";

const VendorAnalytics = () => {
  const { data: orders } = useVendorOrders();
  const { data: products } = useVendorProducts();

  const totalRevenue = orders?.reduce((s, o) => s + Number(o.amount), 0) || 0;
  const completedOrders = orders?.filter(o => o.status === "completed").length || 0;
  const pendingOrders = orders?.filter(o => o.status === "pending").length || 0;
  const approvedProducts = products?.filter(p => p.status === "approved").length || 0;
  const pendingProducts = products?.filter(p => p.status === "pending").length || 0;

  // Group sales by month
  const monthlySales: Record<string, number> = {};
  orders?.forEach(o => {
    const month = new Date(o.created_at).toLocaleDateString("en-US", { year: "numeric", month: "short" });
    monthlySales[month] = (monthlySales[month] || 0) + Number(o.amount);
  });

  const months = Object.entries(monthlySales).slice(-6);
  const maxSale = Math.max(...months.map(([, v]) => v), 1);

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold">Analytics</h1>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Total Revenue", value: `$${totalRevenue.toLocaleString()}`, icon: BarChart3, color: "text-primary" },
          { label: "Completed Orders", value: String(completedOrders), icon: ShoppingCart, color: "text-emerald-600" },
          { label: "Pending Orders", value: String(pendingOrders), icon: ShoppingCart, color: "text-amber-600" },
          { label: "Active Products", value: `${approvedProducts} / ${products?.length || 0}`, icon: Package, color: "text-primary" },
        ].map(stat => (
          <div key={stat.label} className="rounded-lg border border-border bg-card p-5 shadow-ink">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <stat.icon className="h-4 w-4" /> {stat.label}
            </div>
            <p className={`mt-1 font-display text-2xl font-bold tabular-nums ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-border bg-card p-6 shadow-ink">
        <h2 className="mb-4 font-display text-sm font-semibold">Revenue (Last 6 Months)</h2>
        {months.length > 0 ? (
          <div className="flex items-end gap-3" style={{ height: 200 }}>
            {months.map(([month, val]) => (
              <div key={month} className="flex flex-1 flex-col items-center gap-1">
                <span className="text-xs font-medium tabular-nums">${val}</span>
                <div className="w-full rounded-t bg-primary/80" style={{ height: `${(val / maxSale) * 160}px`, minHeight: 4 }} />
                <span className="text-[10px] text-muted-foreground">{month}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="py-8 text-center text-muted-foreground">No data yet</p>
        )}
      </div>

      <div className="mt-6 rounded-lg border border-border bg-card p-6 shadow-ink">
        <h2 className="mb-4 font-display text-sm font-semibold">Product Status Breakdown</h2>
        <div className="grid gap-3 sm:grid-cols-4">
          {[
            { label: "Approved", count: approvedProducts, cls: "text-emerald-600" },
            { label: "Pending", count: pendingProducts, cls: "text-amber-600" },
            { label: "Draft", count: products?.filter(p => p.status === "draft").length || 0, cls: "text-muted-foreground" },
            { label: "Rejected", count: products?.filter(p => p.status === "rejected").length || 0, cls: "text-destructive" },
          ].map(s => (
            <div key={s.label} className="text-center">
              <p className={`font-display text-2xl font-bold ${s.cls}`}>{s.count}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VendorAnalytics;
