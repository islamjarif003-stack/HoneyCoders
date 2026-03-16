import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCategories } from "@/hooks/useMarketplace";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const AdminCategories = () => {
  const { data: categories, isLoading } = useCategories();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", slug: "", icon: "", sort_order: 0 });

  const resetForm = () => { setForm({ name: "", slug: "", icon: "", sort_order: 0 }); setEditId(null); };

  const handleOpen = (cat?: any) => {
    if (cat) {
      setEditId(cat.id);
      setForm({ name: cat.name, slug: cat.slug, icon: cat.icon || "", sort_order: cat.sort_order || 0 });
    } else {
      resetForm();
    }
    setOpen(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.slug) { toast.error("Name and slug required"); return; }
    if (editId) {
      const { error } = await supabase.from("categories").update({
        name: form.name, slug: form.slug, icon: form.icon || null, sort_order: form.sort_order,
      }).eq("id", editId);
      if (error) toast.error("Failed to update");
      else toast.success("Category updated");
    } else {
      const { error } = await supabase.from("categories").insert({
        name: form.name, slug: form.slug, icon: form.icon || null, sort_order: form.sort_order,
      });
      if (error) toast.error("Failed to create");
      else toast.success("Category created");
    }
    queryClient.invalidateQueries({ queryKey: ["categories"] });
    setOpen(false);
    resetForm();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this category?")) return;
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) toast.error("Failed to delete");
    else { toast.success("Category deleted"); queryClient.invalidateQueries({ queryKey: ["categories"] }); }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">Categories</h1>
        <Button size="sm" onClick={() => handleOpen()}><Plus className="mr-1.5 h-3.5 w-3.5" />Add Category</Button>
      </div>

      <div className="rounded-lg border border-border bg-card shadow-ink">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Icon</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Order</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Loading...</TableCell></TableRow>
            ) : categories?.length ? categories.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="text-xl">{c.icon || "📦"}</TableCell>
                <TableCell className="font-medium">{c.name}</TableCell>
                <TableCell className="text-muted-foreground font-mono text-xs">{c.slug}</TableCell>
                <TableCell className="tabular-nums">{c.sort_order}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button size="sm" variant="ghost" onClick={() => handleOpen(c)}><Pencil className="h-3.5 w-3.5" /></Button>
                    <Button size="sm" variant="ghost" className="text-destructive" onClick={() => handleDelete(c.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No categories yet</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editId ? "Edit Category" : "New Category"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value, slug: editId ? form.slug : e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") })} placeholder="React Templates" />
            </div>
            <div>
              <Label>Slug</Label>
              <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="react-templates" />
            </div>
            <div>
              <Label>Icon (emoji)</Label>
              <Input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} placeholder="⚛️" />
            </div>
            <div>
              <Label>Sort Order</Label>
              <Input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editId ? "Update" : "Create"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCategories;
