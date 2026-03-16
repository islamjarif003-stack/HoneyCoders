import { useState } from "react";
import { useAllUsers } from "@/hooks/useAdmin";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { ShieldCheck, ShieldOff, KeyRound, Trash2, UserCheck, UserX } from "lucide-react";

const callAdminApi = async (body: Record<string, any>) => {
  const { data: { session } } = await supabase.auth.getSession();
  const res = await supabase.functions.invoke("admin-users", { body });
  if (res.error) throw new Error(res.error.message);
  if (res.data?.error) throw new Error(res.data.error);
  return res.data;
};

const AdminUsers = () => {
  const { data: users, isLoading } = useAllUsers();
  const queryClient = useQueryClient();
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [confirmAction, setConfirmAction] = useState<{ type: string; userId: string; label: string } | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleRoleToggle = async (userId: string, role: string, currentlyHas: boolean) => {
    try {
      setProcessing(true);
      await callAdminApi({ action: "update_role", userId, role, add: !currentlyHas });
      toast.success(`Role ${!currentlyHas ? "added" : "removed"}`);
      queryClient.invalidateQueries({ queryKey: ["admin-all-users"] });
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleStatusChange = async (userId: string, status: string) => {
    try {
      setProcessing(true);
      await callAdminApi({ action: "update_status", userId, status });
      toast.success(`Account ${status}`);
      queryClient.invalidateQueries({ queryKey: ["admin-all-users"] });
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setProcessing(false);
    }
  };

  const handlePasswordReset = async (userId: string) => {
    try {
      setProcessing(true);
      const result = await callAdminApi({ action: "reset_password", userId });
      toast.success("Password reset link generated");
      if (result?.link) {
        navigator.clipboard.writeText(result.link);
        toast.info("Reset link copied to clipboard");
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setProcessing(false);
      setConfirmAction(null);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      setProcessing(true);
      await callAdminApi({ action: "delete_user", userId });
      toast.success("User deleted");
      queryClient.invalidateQueries({ queryKey: ["admin-all-users"] });
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setProcessing(false);
      setConfirmAction(null);
    }
  };

  const statusBadge = (status: string) => {
    const styles: Record<string, string> = {
      active: "bg-emerald-50 text-emerald-700 border-emerald-200",
      suspended: "bg-red-50 text-red-700 border-red-200",
    };
    return (
      <span className={`inline-block rounded-full border px-2 py-0.5 text-xs font-medium ${styles[status] || "bg-muted text-muted-foreground border-border"}`}>
        {status}
      </span>
    );
  };

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold">User Management</h1>
      <div className="rounded-lg border border-border bg-card shadow-ink">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Roles</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Loading...</TableCell></TableRow>
            ) : users?.length ? users.map((u: any) => (
              <TableRow key={u.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={u.avatar_url || ""} />
                      <AvatarFallback className="bg-primary/10 text-primary text-xs">
                        {(u.display_name || "U")[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{u.display_name || "Unnamed"}</p>
                      <p className="text-xs text-muted-foreground">{u.user_id?.slice(0, 8)}...</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {(u.roles || []).map((r: string) => (
                      <Badge key={r} variant="outline" className="text-xs">
                        {r}
                      </Badge>
                    ))}
                    {(!u.roles || u.roles.length === 0) && <span className="text-xs text-muted-foreground">none</span>}
                  </div>
                </TableCell>
                <TableCell>{statusBadge(u.account_status || "active")}</TableCell>
                <TableCell className="text-muted-foreground">{new Date(u.created_at).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button size="sm" variant="ghost" title="Manage" onClick={() => setSelectedUser(u)}>
                      <ShieldCheck className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      size="sm" variant="ghost"
                      title={u.account_status === "suspended" ? "Activate" : "Suspend"}
                      className={u.account_status === "suspended" ? "text-emerald-600" : "text-amber-600"}
                      disabled={processing}
                      onClick={() => handleStatusChange(u.user_id, u.account_status === "suspended" ? "active" : "suspended")}
                    >
                      {u.account_status === "suspended" ? <UserCheck className="h-3.5 w-3.5" /> : <UserX className="h-3.5 w-3.5" />}
                    </Button>
                    <Button size="sm" variant="ghost" title="Reset Password"
                      onClick={() => setConfirmAction({ type: "reset", userId: u.user_id, label: u.display_name || "this user" })}>
                      <KeyRound className="h-3.5 w-3.5" />
                    </Button>
                    <Button size="sm" variant="ghost" className="text-destructive" title="Delete"
                      onClick={() => setConfirmAction({ type: "delete", userId: u.user_id, label: u.display_name || "this user" })}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No users found</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Role Management Dialog */}
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage Roles — {selectedUser?.display_name}</DialogTitle>
            <DialogDescription>Toggle roles for this user</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-4">
            {["admin", "vendor", "user"].map(role => {
              const has = selectedUser?.roles?.includes(role);
              return (
                <div key={role} className="flex items-center justify-between rounded-md border border-border px-4 py-3">
                  <div>
                    <p className="font-medium capitalize">{role}</p>
                    <p className="text-xs text-muted-foreground">
                      {role === "admin" ? "Full system access" : role === "vendor" ? "Can sell products" : "Standard user"}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant={has ? "destructive" : "default"}
                    disabled={processing}
                    onClick={() => handleRoleToggle(selectedUser.user_id, role, has)}
                  >
                    {has ? "Remove" : "Add"}
                  </Button>
                </div>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirm Action Dialog */}
      <Dialog open={!!confirmAction} onOpenChange={() => setConfirmAction(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {confirmAction?.type === "delete" ? "Delete User" : "Reset Password"}
            </DialogTitle>
            <DialogDescription>
              {confirmAction?.type === "delete"
                ? `Are you sure you want to permanently delete "${confirmAction?.label}"? This cannot be undone.`
                : `Generate a password reset link for "${confirmAction?.label}"?`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmAction(null)}>Cancel</Button>
            <Button
              variant={confirmAction?.type === "delete" ? "destructive" : "default"}
              disabled={processing}
              onClick={() => {
                if (confirmAction?.type === "delete") handleDeleteUser(confirmAction.userId);
                else if (confirmAction) handlePasswordReset(confirmAction.userId);
              }}
            >
              {processing ? "Processing..." : confirmAction?.type === "delete" ? "Delete" : "Generate Link"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminUsers;
