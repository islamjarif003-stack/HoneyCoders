import { CheckCircle2, XCircle, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAdminProducts } from "@/hooks/useMarketplace";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Link } from "react-router-dom";

const statusColor: Record<string, string> = {
  approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  rejected: "bg-red-50 text-red-700 border-red-200",
  draft: "bg-muted text-muted-foreground border-border",
};

const AdminProducts = () => {
  const { data: products, isLoading } = useAdminProducts();
  const queryClient = useQueryClient();

  const handleStatus = async (id: string, status: "approved" | "rejected") => {
    try {
      await api(`/admin/products/${id}/status`, { method: "PATCH", body: { status } });
      toast.success(`Product ${status}`);
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    } catch {
      toast.error("Failed to update");
    }
  };

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold">All Products</h1>
      <div className="rounded-lg border border-border bg-card shadow-ink">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Loading...</TableCell></TableRow>
            ) : products?.length ? products.map((p: any) => (
              <TableRow key={p.id}>
                <TableCell className="font-medium">{p.title}</TableCell>
                <TableCell className="text-muted-foreground">{p.categories?.name || "—"}</TableCell>
                <TableCell className="tabular-nums">${p.price}</TableCell>
                <TableCell>
                  <span className={`inline-block rounded-full border px-2 py-0.5 text-xs font-medium ${statusColor[p.status] || ""}`}>
                    {p.status}
                  </span>
                </TableCell>
                <TableCell className="text-muted-foreground">{new Date(p.created_at).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Link to={`/product/${p.slug}`}>
                      <Button size="sm" variant="ghost"><Eye className="h-3.5 w-3.5" /></Button>
                    </Link>
                    {p.status !== "approved" && (
                      <Button size="sm" variant="ghost" className="text-emerald-600" onClick={() => handleStatus(p.id, "approved")}>
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      </Button>
                    )}
                    {p.status !== "rejected" && (
                      <Button size="sm" variant="ghost" className="text-destructive" onClick={() => handleStatus(p.id, "rejected")}>
                        <XCircle className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No products yet</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminProducts;
