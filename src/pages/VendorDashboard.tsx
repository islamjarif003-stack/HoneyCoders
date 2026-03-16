import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Package, Upload, DollarSign, BarChart3, Settings, LogOut, Menu, X } from "lucide-react";
import Navbar from "@/components/marketplace/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import VendorOverview from "@/components/vendor/VendorOverview";
import VendorProducts from "@/components/vendor/VendorProducts";
import VendorUpload from "@/components/vendor/VendorUpload";
import VendorSales from "@/components/vendor/VendorSales";
import VendorAnalytics from "@/components/vendor/VendorAnalytics";
import VendorSettings from "@/components/vendor/VendorSettings";

const vendorNav = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/vendor" },
  { label: "Products", icon: Package, path: "/vendor/products" },
  { label: "Upload Product", icon: Upload, path: "/vendor/upload" },
  { label: "Sales & Earnings", icon: DollarSign, path: "/vendor/sales" },
  { label: "Analytics", icon: BarChart3, path: "/vendor/analytics" },
  { label: "Settings", icon: Settings, path: "/vendor/settings" },
];

const VendorDashboard = () => {
  const { pathname } = useLocation();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-24 text-center">
          <h1 className="text-2xl font-bold">Sign in to access the vendor panel</h1>
          <Link to="/auth" className="mt-4 inline-block text-primary hover:underline">Sign in</Link>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    if (pathname === "/vendor/products") return <VendorProducts />;
    if (pathname === "/vendor/upload") return <VendorUpload />;
    if (pathname === "/vendor/sales") return <VendorSales />;
    if (pathname === "/vendor/analytics") return <VendorAnalytics />;
    if (pathname === "/vendor/settings") return <VendorSettings />;
    return <VendorOverview />;
  };

  const NavItems = ({ onItemClick }: { onItemClick?: () => void }) => (
    <nav className="space-y-1">
      {vendorNav.map((item) => {
        const active = pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            onClick={onItemClick}
            className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
              active ? "border-l-2 border-primary bg-indigo-50 text-primary dark:bg-primary/10" : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <item.icon className="h-4 w-4" />{item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Mobile top bar */}
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-background px-4 py-3 lg:hidden">
        <p className="text-sm font-semibold text-foreground">Vendor Panel</p>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-muted-foreground hover:text-foreground">
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-20 bg-background/80 backdrop-blur-sm lg:hidden" onClick={() => setMobileMenuOpen(false)}>
          <div className="absolute left-0 top-[calc(64px+49px)] w-[280px] h-[calc(100vh-113px)] border-r border-border bg-card p-4 shadow-lg" onClick={(e) => e.stopPropagation()}>
            <NavItems onItemClick={() => setMobileMenuOpen(false)} />
            <div className="mt-6 border-t border-border pt-4">
              <button onClick={() => { signOut(); navigate("/"); }} className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground">
                <LogOut className="h-4 w-4" /> Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex">
        {/* Desktop sidebar */}
        <aside className="sticky top-16 hidden h-[calc(100vh-64px)] w-[280px] shrink-0 border-r border-border bg-surface p-4 lg:block">
          <div className="mb-6 px-3">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Vendor Panel</p>
          </div>
          <NavItems />
          <div className="absolute bottom-4 left-4 right-4">
            <button onClick={() => { signOut(); navigate("/"); }} className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground">
              <LogOut className="h-4 w-4" /> Sign Out
            </button>
          </div>
        </aside>

        <main className="flex-1 p-4 lg:p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default VendorDashboard;
