import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const AdminSettings = () => {
  const [commission, setCommission] = useState("20");
  const [siteName, setSiteName] = useState("SourceStack");

  const handleSave = () => {
    toast.success("Settings saved");
  };

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold">Settings</h1>
      <div className="max-w-lg space-y-6 rounded-lg border border-border bg-card p-6 shadow-ink">
        <div className="space-y-2">
          <Label>Site Name</Label>
          <Input value={siteName} onChange={(e) => setSiteName(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Commission Rate (%)</Label>
          <Input type="number" value={commission} onChange={(e) => setCommission(e.target.value)} min={0} max={100} />
          <p className="text-xs text-muted-foreground">Percentage taken from each sale as platform fee.</p>
        </div>
        <Button onClick={handleSave}>Save Settings</Button>
      </div>
    </div>
  );
};

export default AdminSettings;
