import { useAdminOrders } from "@/hooks/useAdmin";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";

const statusColor: Record<string, string> = {
  completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  refunded: "bg-red-50 text-red-700 border-red-200",
};

const AdminOrders = () => {
  const { data: orders, isLoading } = useAdminOrders();

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold">Orders</h1>
      <div className="rounded-lg border border-border bg-card shadow-ink">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Loading...</TableCell></TableRow>
            ) : orders?.length ? orders.map((o) => (
              <TableRow key={o.id}>
                <TableCell className="font-mono text-xs text-muted-foreground">{o.id.slice(0, 8)}...</TableCell>
                <TableCell className="font-medium">{(o as any).products?.title || "—"}</TableCell>
                <TableCell className="tabular-nums font-medium">${o.amount}</TableCell>
                <TableCell>
                  <span className={`inline-block rounded-full border px-2 py-0.5 text-xs font-medium ${statusColor[o.status] || ""}`}>
                    {o.status}
                  </span>
                </TableCell>
                <TableCell className="text-muted-foreground">{new Date(o.created_at).toLocaleDateString()}</TableCell>
              </TableRow>
            )) : (
              <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No orders yet</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminOrders;
