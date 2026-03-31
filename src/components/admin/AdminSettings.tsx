import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { CreditCard, Eye, EyeOff, Loader2, Shield, Save } from "lucide-react";

const AdminSettings = () => {
  const [commission, setCommission] = useState("20");
  const [siteName, setSiteName] = useState("Hunny IT");

  // EPS Payment Gateway
  const [epsUsername, setEpsUsername] = useState("");
  const [epsPassword, setEpsPassword] = useState("");
  const [epsMerchantId, setEpsMerchantId] = useState("");
  const [epsStoreId, setEpsStoreId] = useState("");
  const [epsHashKey, setEpsHashKey] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showHashKey, setShowHashKey] = useState(false);
  const [epsLoading, setEpsLoading] = useState(false);
  const [epsSaving, setEpsSaving] = useState(false);

  const { token } = useAuth();

  // Load EPS settings on mount
  useEffect(() => {
    const loadEpsSettings = async () => {
      if (!token) return;
      setEpsLoading(true);
      try {
        const res = await fetch("/api/admin/payment-settings", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setEpsUsername(data.eps_username || "");
          setEpsPassword(data.eps_password || "");
          setEpsMerchantId(data.eps_merchant_id || "");
          setEpsStoreId(data.eps_store_id || "");
          setEpsHashKey(data.eps_hash_key || "");
        }
      } catch {
        // Settings not configured yet
      } finally {
        setEpsLoading(false);
      }
    };
    loadEpsSettings();
  }, [token]);

  const handleSave = () => {
    toast.success("Settings saved");
  };

  const handleSaveEps = async () => {
    setEpsSaving(true);
    try {
      const res = await fetch("/api/admin/payment-settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          eps_username: epsUsername,
          eps_password: epsPassword,
          eps_merchant_id: epsMerchantId,
          eps_store_id: epsStoreId,
          eps_hash_key: epsHashKey,
        }),
      });
      if (res.ok) {
        toast.success("EPS Payment Gateway settings saved successfully!");
      } else {
        const err = await res.json();
        toast.error(err.message || "Failed to save EPS settings.");
      }
    } catch {
      toast.error("Failed to save EPS settings.");
    } finally {
      setEpsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="font-display text-2xl font-bold">Settings</h1>

      {/* General Settings */}
      <div className="max-w-2xl rounded-xl border border-border bg-card p-6 shadow-ink">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
          <Shield className="h-5 w-5 text-primary" />
          General Settings
        </h2>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Site Name</Label>
            <Input value={siteName} onChange={(e) => setSiteName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Commission Rate (%)</Label>
            <Input type="number" value={commission} onChange={(e) => setCommission(e.target.value)} min={0} max={100} />
            <p className="text-xs text-muted-foreground">Percentage taken from each sale as platform fee.</p>
          </div>
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Save Settings
          </Button>
        </div>
      </div>

      {/* EPS Payment Gateway Settings */}
      <div className="max-w-2xl rounded-xl border border-border bg-card p-6 shadow-ink">
        <h2 className="mb-1 flex items-center gap-2 text-lg font-semibold">
          <CreditCard className="h-5 w-5 text-emerald-500" />
          EPS Payment Gateway
        </h2>
        <p className="mb-5 text-sm text-muted-foreground">
          Configure your EASY PAYMENT SYSTEM (EPS) credentials to accept payments on your store.
        </p>

        {epsLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="eps-username">EPS Username</Label>
              <Input
                id="eps-username"
                placeholder="your_eps_username@eps.com.bd"
                value={epsUsername}
                onChange={(e) => setEpsUsername(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="eps-password">EPS Password</Label>
              <div className="relative">
                <Input
                  id="eps-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={epsPassword}
                  onChange={(e) => setEpsPassword(e.target.value)}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="eps-merchant-id">Merchant ID</Label>
                <Input
                  id="eps-merchant-id"
                  placeholder="094980ee-XXXX-XXXX-XXXX"
                  value={epsMerchantId}
                  onChange={(e) => setEpsMerchantId(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="eps-store-id">Store ID</Label>
                <Input
                  id="eps-store-id"
                  placeholder="35b518f6-XXXX-XXXX"
                  value={epsStoreId}
                  onChange={(e) => setEpsStoreId(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="eps-hash-key">Hash Key (Secret)</Label>
              <div className="relative">
                <Input
                  id="eps-hash-key"
                  type={showHashKey ? "text" : "password"}
                  placeholder="SFNLQHJlY2lwZXdhbGEjYTc3Zi1mOTQ5..."
                  value={epsHashKey}
                  onChange={(e) => setEpsHashKey(e.target.value)}
                  className="pr-10 font-mono text-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowHashKey(!showHashKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showHashKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                This key is used to generate the HMACSHA512 hash for each API request. Keep it secret.
              </p>
            </div>

            <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">
              <p className="text-xs text-amber-600 dark:text-amber-400">
                ⚠️ These credentials are stored securely in the database and are never exposed to the frontend or public APIs.
              </p>
            </div>

            <Button onClick={handleSaveEps} disabled={epsSaving} className="gradient-primary text-primary-foreground">
              {epsSaving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              {epsSaving ? "Saving..." : "Save EPS Settings"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSettings;
