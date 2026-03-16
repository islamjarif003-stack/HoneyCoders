import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const VendorSettings = () => {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    api("/auth/me").then((data) => {
      setDisplayName(data.display_name || "");
      setBio(data.bio || "");
      setAvatarUrl(data.avatar_url || "");
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await api("/profile", {
        method: "PUT",
        body: {
          display_name: displayName.trim() || null,
          bio: bio.trim() || null,
          avatar_url: avatarUrl.trim() || null,
        },
      });
      toast.success("Profile updated");
    } catch {
      toast.error("Failed to save");
    }
    setSaving(false);
  };

  if (loading) return <p className="py-8 text-center text-muted-foreground">Loading...</p>;

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold">Settings</h1>
      <div className="mx-auto max-w-lg space-y-6 rounded-lg border border-border bg-card p-6 shadow-ink">
        <div className="space-y-2">
          <Label htmlFor="name">Display Name</Label>
          <Input id="name" value={displayName} onChange={e => setDisplayName(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea id="bio" value={bio} onChange={e => setBio(e.target.value)} rows={4} placeholder="Tell buyers about yourself..." />
        </div>
        <div className="space-y-2">
          <Label htmlFor="avatar">Avatar URL</Label>
          <Input id="avatar" value={avatarUrl} onChange={e => setAvatarUrl(e.target.value)} placeholder="https://..." />
        </div>
        <Button onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save Changes"}</Button>
      </div>
    </div>
  );
};

export default VendorSettings;
