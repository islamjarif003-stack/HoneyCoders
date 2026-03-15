import { Download, FileArchive, Clock } from "lucide-react";
import Navbar from "@/components/marketplace/Navbar";
import { Button } from "@/components/ui/button";

const UserLibrary = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <div className="container py-8">
      <h1 className="mb-6 font-display text-2xl font-bold">My Library</h1>
      <p className="mb-8 text-sm text-muted-foreground">Download your purchased products below.</p>

      <div className="space-y-4">
        {[
          { title: "Horizon React Dashboard Pro", version: "3.2.0", purchased: "Mar 15, 2026", size: "12.4 MB" },
          { title: "Starter UI Kit", version: "2.1.0", purchased: "Mar 10, 2026", size: "8.7 MB" },
        ].map((item, i) => (
          <div key={i} className="flex items-center justify-between rounded-lg border border-border bg-card p-5 shadow-ink">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-md bg-indigo-50 text-primary">
                <FileArchive className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-sm font-semibold">{item.title}</h3>
                <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                  <span>v{item.version}</span>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{item.purchased}</span>
                  <span>{item.size}</span>
                </div>
              </div>
            </div>
            <Button size="sm" className="bg-primary text-primary-foreground hover:bg-indigo-700">
              <Download className="mr-1.5 h-3.5 w-3.5" /> Download
            </Button>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default UserLibrary;
