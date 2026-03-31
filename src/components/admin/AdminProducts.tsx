import { CheckCircle2, XCircle, Eye, FileJson, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useRef } from "react";
import { useAdminProducts, useCategories } from "@/hooks/useMarketplace";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Link } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const statusColor: Record<string, string> = {
  approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  rejected: "bg-red-50 text-red-700 border-red-200",
  draft: "bg-muted text-muted-foreground border-border",
};

const AdminProducts = () => {
  const { data: products, isLoading } = useAdminProducts();
  const { data: categories } = useCategories();
  const queryClient = useQueryClient();
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Edit dialog state
  const [editOpen, setEditOpen] = useState(false);
  const [editSaving, setEditSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    id: "",
    title: "",
    description: "",
    price: "",
    category_id: "",
    status: "approved",
    featured: false,
    thumbnail_url: "",
    version: "",
    tags: "",
  });

  const openEdit = (p: any) => {
    setEditForm({
      id: p.id,
      title: p.title || "",
      description: p.description || "",
      price: String(p.price ?? ""),
      category_id: p.category_id || "",
      status: p.status || "approved",
      featured: p.featured || false,
      thumbnail_url: p.thumbnail_url || "",
      version: p.version || "",
      tags: Array.isArray(p.tags) ? p.tags.join(", ") : "",
    });
    setEditOpen(true);
  };

  const handleEditSave = async () => {
    setEditSaving(true);
    try {
      await api(`/admin/products/${editForm.id}`, {
        method: "PUT",
        body: {
          title: editForm.title,
          description: editForm.description,
          price: editForm.price,
          category_id: editForm.category_id,
          status: editForm.status,
          featured: editForm.featured,
          thumbnail_url: editForm.thumbnail_url,
          version: editForm.version,
          tags: editForm.tags,
        },
      });
      toast.success("Product updated!");
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      setEditOpen(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to update");
    } finally {
      setEditSaving(false);
    }
  };

  const handleBulkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = async (ev) => {
      try {
        const json = JSON.parse(ev.target?.result as string);
        await api("/vendor/products/bulk", { method: "POST", body: json });
        toast.success("Bulk upload successful!");
        queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      } catch (err: any) {
        toast.error(err.message || "Failed to upload JSON");
      } finally {
        setIsUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    };
    reader.readAsText(file);
  };

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
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">All Products</h1>
        <div className="flex items-center gap-3">
          <input type="file" accept=".json" className="hidden" ref={fileInputRef} onChange={handleBulkUpload} />
          <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
            <FileJson className="mr-2 h-4 w-4" />
            {isUploading ? "Uploading..." : "Bulk Upload JSON"}
          </Button>
        </div>
      </div>
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
                    <Button size="sm" variant="ghost" onClick={() => openEdit(p)}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
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

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} rows={4} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Price ($)</Label>
                <Input type="number" min="0" step="0.01" value={editForm.price} onChange={(e) => setEditForm({ ...editForm, price: e.target.value })} />
              </div>
              <div>
                <Label>Category</Label>
                <Select value={editForm.category_id} onValueChange={(v) => setEditForm({ ...editForm, category_id: v })}>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    {categories?.map((c: any) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Status</Label>
                <Select value={editForm.status} onValueChange={(v) => setEditForm({ ...editForm, status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Version</Label>
                <Input value={editForm.version} onChange={(e) => setEditForm({ ...editForm, version: e.target.value })} />
              </div>
            </div>
            <div>
              <Label>Thumbnail URL</Label>
              <Input value={editForm.thumbnail_url} onChange={(e) => setEditForm({ ...editForm, thumbnail_url: e.target.value })} placeholder="/assets/placeholders/..." />
            </div>
            <div>
              <Label>Tags (comma-separated)</Label>
              <Input value={editForm.tags} onChange={(e) => setEditForm({ ...editForm, tags: e.target.value })} placeholder="react, dashboard, template" />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="featured" checked={editForm.featured} onChange={(e) => setEditForm({ ...editForm, featured: e.target.checked })} className="rounded" />
              <Label htmlFor="featured" className="cursor-pointer">Featured Product</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button onClick={handleEditSave} disabled={editSaving}>
              {editSaving ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminProducts;
