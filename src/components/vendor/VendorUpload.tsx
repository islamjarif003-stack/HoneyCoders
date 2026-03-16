import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useCategories } from "@/hooks/useMarketplace";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

const VendorUpload = () => {
  const { user } = useAuth();
  const { data: categories } = useCategories();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [version, setVersion] = useState("1.0.0");
  const [tags, setTags] = useState("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [productFile, setProductFile] = useState<File | null>(null);
  const [screenshots, setScreenshots] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const generateSlug = (text: string) =>
    text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + "-" + Date.now().toString(36);

  const uploadFile = async (file: File, bucket: string, path: string) => {
    const { error } = await supabase.storage.from(bucket).upload(path, file);
    if (error) throw error;
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent, asDraft: boolean) => {
    e.preventDefault();
    if (!user) return;
    if (!title.trim()) { toast.error("Title is required"); return; }
    if (!price || Number(price) < 0) { toast.error("Valid price is required"); return; }

    setSubmitting(true);
    try {
      const slug = generateSlug(title);
      let thumbnailUrl: string | null = null;
      let fileUrl: string | null = null;

      if (thumbnail) {
        thumbnailUrl = await uploadFile(thumbnail, "product-images", `thumbnails/${user.id}/${slug}-${thumbnail.name}`);
      }
      if (productFile) {
        const { error } = await supabase.storage.from("product-files").upload(`${user.id}/${slug}-${productFile.name}`, productFile);
        if (error) throw error;
        fileUrl = `${user.id}/${slug}-${productFile.name}`;
      }

      const { data: product, error } = await supabase.from("products").insert({
        title: title.trim(),
        slug,
        description: description.trim() || null,
        price: Number(price),
        category_id: categoryId || null,
        vendor_id: user.id,
        version,
        tags: tags ? tags.split(",").map(t => t.trim()).filter(Boolean) : [],
        thumbnail_url: thumbnailUrl,
        file_url: fileUrl,
        status: asDraft ? "draft" as any : "pending" as any,
      }).select().single();

      if (error) throw error;

      // Upload screenshots
      if (screenshots.length > 0 && product) {
        for (let i = 0; i < screenshots.length; i++) {
          const ssUrl = await uploadFile(screenshots[i], "product-images", `screenshots/${user.id}/${slug}-ss-${i}-${screenshots[i].name}`);
          await supabase.from("product_screenshots").insert({
            product_id: product.id,
            url: ssUrl,
            sort_order: i,
          });
        }
      }

      toast.success(asDraft ? "Saved as draft" : "Product submitted for review");
      queryClient.invalidateQueries({ queryKey: ["vendor-products"] });
      navigate("/vendor/products");
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    } finally {
      setSubmitting(false);
    }
  };

  const removeScreenshot = (idx: number) => setScreenshots(prev => prev.filter((_, i) => i !== idx));

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold">Upload Product</h1>
      <form className="mx-auto max-w-2xl space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Product Title *</Label>
          <Input id="title" value={title} onChange={e => setTitle(e.target.value)} placeholder="My Awesome Template" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="desc">Description</Label>
          <Textarea id="desc" value={description} onChange={e => setDescription(e.target.value)} rows={5} placeholder="Describe your product..." />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="price">Price ($) *</Label>
            <Input id="price" type="number" min="0" step="0.01" value={price} onChange={e => setPrice(e.target.value)} placeholder="29.00" />
          </div>
          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
              <SelectContent>
                {categories?.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="version">Version</Label>
            <Input id="version" value={version} onChange={e => setVersion(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input id="tags" value={tags} onChange={e => setTags(e.target.value)} placeholder="react, dashboard, ui-kit" />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Thumbnail Image</Label>
          <div className="flex items-center gap-3">
            <label className="flex cursor-pointer items-center gap-2 rounded-md border border-dashed border-border px-4 py-3 text-sm text-muted-foreground hover:border-primary hover:text-primary">
              <ImageIcon className="h-4 w-4" />
              {thumbnail ? thumbnail.name : "Choose thumbnail"}
              <input type="file" accept="image/*" className="hidden" onChange={e => setThumbnail(e.target.files?.[0] || null)} />
            </label>
            {thumbnail && <Button type="button" variant="ghost" size="sm" onClick={() => setThumbnail(null)}><X className="h-4 w-4" /></Button>}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Product File (ZIP, RAR, etc.)</Label>
          <div className="flex items-center gap-3">
            <label className="flex cursor-pointer items-center gap-2 rounded-md border border-dashed border-border px-4 py-3 text-sm text-muted-foreground hover:border-primary hover:text-primary">
              <Upload className="h-4 w-4" />
              {productFile ? productFile.name : "Choose file"}
              <input type="file" className="hidden" onChange={e => setProductFile(e.target.files?.[0] || null)} />
            </label>
            {productFile && <Button type="button" variant="ghost" size="sm" onClick={() => setProductFile(null)}><X className="h-4 w-4" /></Button>}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Screenshots (up to 5)</Label>
          <div className="flex flex-wrap gap-2">
            {screenshots.map((f, i) => (
              <div key={i} className="flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs">
                {f.name}
                <button type="button" onClick={() => removeScreenshot(i)}><X className="h-3 w-3" /></button>
              </div>
            ))}
            {screenshots.length < 5 && (
              <label className="flex cursor-pointer items-center gap-1 rounded-md border border-dashed border-border px-3 py-2 text-xs text-muted-foreground hover:border-primary">
                <ImageIcon className="h-3 w-3" /> Add
                <input type="file" accept="image/*" className="hidden" onChange={e => {
                  if (e.target.files?.[0]) setScreenshots(prev => [...prev, e.target.files![0]]);
                }} />
              </label>
            )}
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button type="button" variant="outline" disabled={submitting} onClick={e => handleSubmit(e, true)}>
            Save as Draft
          </Button>
          <Button type="button" disabled={submitting} onClick={e => handleSubmit(e, false)}>
            {submitting ? "Uploading..." : "Submit for Review"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default VendorUpload;
