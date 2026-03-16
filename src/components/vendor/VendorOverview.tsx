import { useVendorProducts, useVendorOrders } from "@/hooks/useMarketplace";
import { Link } from "react-router-dom";
import { DollarSign, Package, ShoppingCart } from "lucide-react";

const VendorOverview = () => {
  const { data: products } = useVendorProducts();
  const { data: orders } = useVendorOrders();

  const totalSales = orders?.reduce((sum, o) => sum + Number(o.amount), 0) || 0;

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold">Vendor Dashboard</h1>
      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Total Sales", value: `$${totalSales.toLocaleString()}`, icon: DollarSign },
          { label: "Products", value: String(products?.length || 0), icon: Package },
          { label: "Orders", value: String(orders?.length || 0), icon: ShoppingCart },
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
    </div>
  );
};

export default VendorOverview;
