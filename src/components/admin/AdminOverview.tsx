import { CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAdminProducts } from "@/hooks/useMarketplace";
import { useAdminOrders } from "@/hooks/useAdmin";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

const AdminOverview = () => {
  const { data: allProducts } = useAdminProducts();
  const { data: allOrders } = useAdminOrders();
  const queryClient = useQueryClient();

  const pendingProducts = allProducts?.filter((p) => p.status === "pending") || [];
  const totalRevenue = allOrders?.reduce((s, o) => s + Number(o.amount), 0) || 0;

  const handleApprove = async (id: string) => {
    const { error } = await supabase.from("products").update({ status: "approved" as any }).eq("id", id);
    if (error) toast.error("Failed");
    else { toast.success("Approved!"); queryClient.invalidateQueries({ queryKey: ["admin-products"] }); }
  };

  const handleReject = async (id: string) => {
    const { error } = await supabase.from("products").update({ status: "rejected" as any }).eq("id", id);
    if (error) toast.error("Failed");
    else { toast.success("Rejected"); queryClient.invalidateQueries({ queryKey: ["admin-products"] }); }
  };

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold">Admin Dashboard</h1>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Total Products", value: String(allProducts?.length || 0) },
          { label: "Approved", value: String(allProducts?.filter((p) => p.status === "approved").length || 0) },
          { label: "Pending", value: String(pendingProducts.length) },
          { label: "Total Revenue", value: `$${totalRevenue.toLocaleString()}` },
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
                  {(product as any).categories?.name} · ${product.price} · {new Date(product.created_at).toLocaleDateString()}
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
    </div>
  );
};

export default AdminOverview;
