import { useVendorOrders } from "@/hooks/useMarketplace";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { DollarSign, TrendingUp } from "lucide-react";

const VendorSales = () => {
  const { data: orders, isLoading } = useVendorOrders();

  const totalEarnings = orders?.filter(o => o.status === "completed").reduce((s, o) => s + Number(o.amount), 0) || 0;
  const pendingEarnings = orders?.filter(o => o.status === "pending").reduce((s, o) => s + Number(o.amount), 0) || 0;
  const completedOrders = orders?.filter(o => o.status === "completed").length || 0;

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold">Sales & Earnings</h1>
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-border bg-card p-5 shadow-ink">
          <div className="flex items-center gap-2 text-sm text-muted-foreground"><DollarSign className="h-4 w-4" /> Total Earnings</div>
          <p className="mt-1 font-display text-2xl font-bold tabular-nums text-emerald-600">${totalEarnings.toLocaleString()}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-5 shadow-ink">
          <div className="flex items-center gap-2 text-sm text-muted-foreground"><TrendingUp className="h-4 w-4" /> Pending</div>
          <p className="mt-1 font-display text-2xl font-bold tabular-nums text-amber-600">${pendingEarnings.toLocaleString()}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-5 shadow-ink">
          <div className="flex items-center gap-2 text-sm text-muted-foreground"><DollarSign className="h-4 w-4" /> Completed Sales</div>
          <p className="mt-1 font-display text-2xl font-bold tabular-nums">{completedOrders}</p>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card shadow-ink">
        <div className="border-b border-border p-4">
          <h2 className="font-display text-sm font-semibold">All Orders</h2>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground">Loading...</TableCell></TableRow>
            ) : orders?.length ? orders.map(o => (
              <TableRow key={o.id}>
                <TableCell className="font-medium">{(o as any).products?.title || "—"}</TableCell>
                <TableCell className="tabular-nums font-medium">${o.amount}</TableCell>
                <TableCell>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${o.status === "completed" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                    {o.status}
                  </span>
                </TableCell>
                <TableCell className="text-muted-foreground">{new Date(o.created_at).toLocaleDateString()}</TableCell>
              </TableRow>
            )) : (
              <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground">No sales yet</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default VendorSales;
