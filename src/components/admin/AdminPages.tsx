import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { FileText, Pencil, Eye, Save, X } from "lucide-react";
import { motion } from "framer-motion";

interface SitePage {
  id: string;
  slug: string;
  title: string;
  content: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

const AdminPages = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingPage, setEditingPage] = useState<SitePage | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editPublished, setEditPublished] = useState(true);

  const { data: pages, isLoading } = useQuery({
    queryKey: ["admin-site-pages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_pages")
        .select("*")
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data as SitePage[];
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, title, content, is_published }: { id: string; title: string; content: string; is_published: boolean }) => {
      const { error } = await supabase
        .from("site_pages")
        .update({ title, content, is_published })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-site-pages"] });
      setEditingPage(null);
      toast({ title: "Page updated", description: "Changes saved successfully." });
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const togglePublish = useMutation({
    mutationFn: async ({ id, is_published }: { id: string; is_published: boolean }) => {
      const { error } = await supabase
        .from("site_pages")
        .update({ is_published })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-site-pages"] });
      toast({ title: "Status updated" });
    },
  });

  const startEditing = (page: SitePage) => {
    setEditingPage(page);
    setEditTitle(page.title);
    setEditContent(page.content);
    setEditPublished(page.is_published);
  };

  if (editingPage) {
    return (
      <div>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Edit Page: {editingPage.title}</h2>
            <p className="text-sm text-muted-foreground">Slug: /{editingPage.slug}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setEditingPage(null)}>
              <X className="mr-1.5 h-4 w-4" /> Cancel
            </Button>
            <Button
              size="sm"
              className="gradient-primary text-primary-foreground"
              onClick={() => updateMutation.mutate({ id: editingPage.id, title: editTitle, content: editContent, is_published: editPublished })}
              disabled={updateMutation.isPending}
            >
              <Save className="mr-1.5 h-4 w-4" /> {updateMutation.isPending ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Title</label>
            <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={editPublished} onCheckedChange={setEditPublished} />
            <span className="text-sm">{editPublished ? "Published" : "Draft"}</span>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Content (Markdown)</label>
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              rows={20}
              className="font-mono text-sm"
              placeholder="Write page content in Markdown..."
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold">Site Pages</h2>
        <p className="text-sm text-muted-foreground">Manage your website's static pages — Contact, FAQ, Privacy, Terms</p>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 animate-pulse rounded-lg bg-muted shimmer" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {pages?.map((page, i) => (
            <motion.div
              key={page.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center justify-between rounded-xl border border-border bg-card p-4"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold">{page.title}</h3>
                  <p className="text-xs text-muted-foreground">/{page.slug} · Updated {new Date(page.updated_at).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={page.is_published}
                    onCheckedChange={(checked) => togglePublish.mutate({ id: page.id, is_published: checked })}
                  />
                  <span className={`text-xs font-medium ${page.is_published ? "text-emerald-400" : "text-muted-foreground"}`}>
                    {page.is_published ? "Live" : "Draft"}
                  </span>
                </div>
                <a href={`/page/${page.slug}`} target="_blank" rel="noreferrer">
                  <Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>
                </a>
                <Button variant="ghost" size="icon" onClick={() => startEditing(page)}>
                  <Pencil className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPages;
