import { useAdminWithdrawals } from "@/hooks/useAdmin";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle } from "lucide-react";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";

const statusColor: Record<string, string> = {
  approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  paid: "bg-blue-50 text-blue-700 border-blue-200",
  rejected: "bg-red-50 text-red-700 border-red-200",
};

const AdminWithdrawals = () => {
  const { data: withdrawals, isLoading } = useAdminWithdrawals();
  const queryClient = useQueryClient();

  const handleStatus = async (id: string, status: "approved" | "rejected" | "paid") => {
    try {
      await api(`/admin/withdrawals/${id}/status`, { method: "PATCH", body: { status } });
      toast.success(`Withdrawal ${status}`);
      queryClient.invalidateQueries({ queryKey: ["admin-withdrawals"] });
    } catch {
      toast.error("Failed to update");
    }
  };

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold">Withdrawals</h1>
      <div className="rounded-lg border border-border bg-card shadow-ink">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Loading...</TableCell></TableRow>
            ) : withdrawals?.length ? withdrawals.map((w: any) => (
              <TableRow key={w.id}>
                <TableCell className="font-mono text-xs text-muted-foreground">{w.id.slice(0, 8)}...</TableCell>
                <TableCell className="tabular-nums font-medium">${w.amount}</TableCell>
                <TableCell>
                  <span className={`inline-block rounded-full border px-2 py-0.5 text-xs font-medium ${statusColor[w.status] || ""}`}>
                    {w.status}
                  </span>
                </TableCell>
                <TableCell className="text-muted-foreground max-w-[200px] truncate">{w.notes || "—"}</TableCell>
                <TableCell className="text-muted-foreground">{new Date(w.created_at).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  {w.status === "pending" && (
                    <div className="flex justify-end gap-1">
                      <Button size="sm" variant="ghost" className="text-emerald-600" onClick={() => handleStatus(w.id, "approved")}>
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      </Button>
                      <Button size="sm" variant="ghost" className="text-destructive" onClick={() => handleStatus(w.id, "rejected")}>
                        <XCircle className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  )}
                  {w.status === "approved" && (
                    <Button size="sm" variant="outline" onClick={() => handleStatus(w.id, "paid")}>Mark Paid</Button>
                  )}
                </TableCell>
              </TableRow>
            )) : (
              <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No withdrawals yet</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminWithdrawals;
