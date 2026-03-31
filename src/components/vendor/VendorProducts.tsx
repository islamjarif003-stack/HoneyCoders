import { useVendorProducts } from "@/hooks/useMarketplace";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Eye, Edit, Plus, FileJson } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState, useRef } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

const statusColor: Record<string, string> = {
  approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  rejected: "bg-red-50 text-red-700 border-red-200",
  draft: "bg-muted text-muted-foreground border-border",
};

const VendorProducts = () => {
  const { data: products, isLoading } = useVendorProducts();
  const queryClient = useQueryClient();
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleBulkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = async (ev) => {
      try {
        const json = JSON.parse(ev.target?.result as string);
        await api("/vendor/products/bulk", {
          method: "POST",
          body: json
        });
        toast.success("Bulk upload successful!");
        queryClient.invalidateQueries({ queryKey: ["vendor-products"] });
      } catch (err: any) {
        toast.error(err.message || "Failed to upload JSON");
      } finally {
        setIsUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    };
    reader.readAsText(file);
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">My Products</h1>
        <div className="flex items-center gap-3">
          <input type="file" accept=".json" className="hidden" ref={fileInputRef} onChange={handleBulkUpload} />
          <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
            <FileJson className="mr-2 h-4 w-4" />
            {isUploading ? "Uploading..." : "Bulk Upload JSON"}
          </Button>
          <Link to="/vendor/upload">
            <Button size="sm"><Plus className="mr-2 h-4 w-4" />Add Product</Button>
          </Link>
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
            ) : products?.length ? products.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-medium">{p.title}</TableCell>
                <TableCell className="text-muted-foreground">{(p as any).categories?.name || "—"}</TableCell>
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
                  </div>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No products yet. <Link to="/vendor/upload" className="text-primary hover:underline">Upload your first product</Link></TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default VendorProducts;
