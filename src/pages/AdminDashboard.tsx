import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Package, Users, UserCog, FolderTree, DollarSign, ShieldCheck, Settings, LogOut, FileText } from "lucide-react";
import Navbar from "@/components/marketplace/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import AdminOverview from "@/components/admin/AdminOverview";
import AdminProducts from "@/components/admin/AdminProducts";
import AdminVendors from "@/components/admin/AdminVendors";
import AdminUsers from "@/components/admin/AdminUsers";
import AdminCategories from "@/components/admin/AdminCategories";
import AdminOrders from "@/components/admin/AdminOrders";
import AdminWithdrawals from "@/components/admin/AdminWithdrawals";
import AdminSettings from "@/components/admin/AdminSettings";
import AdminPages from "@/components/admin/AdminPages";

const adminNav = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/admin" },
  { label: "Products", icon: Package, path: "/admin/products" },
  { label: "Users", icon: UserCog, path: "/admin/users" },
  { label: "Vendors", icon: Users, path: "/admin/vendors" },
  { label: "Categories", icon: FolderTree, path: "/admin/categories" },
  { label: "Orders", icon: DollarSign, path: "/admin/orders" },
  { label: "Withdrawals", icon: DollarSign, path: "/admin/withdrawals" },
  { label: "Pages", icon: FileText, path: "/admin/pages" },
  { label: "Settings", icon: Settings, path: "/admin/settings" },
];

const AdminDashboard = () => {
  const { pathname } = useLocation();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-24 text-center">
          <h1 className="text-2xl font-bold">Sign in to access admin</h1>
          <Link to="/auth" className="mt-4 inline-block text-primary hover:underline">Sign in</Link>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (pathname) {
      case "/admin/products": return <AdminProducts />;
      case "/admin/users": return <AdminUsers />;
      case "/admin/vendors": return <AdminVendors />;
      case "/admin/categories": return <AdminCategories />;
      case "/admin/orders": return <AdminOrders />;
      case "/admin/withdrawals": return <AdminWithdrawals />;
      case "/admin/pages": return <AdminPages />;
      case "/admin/settings": return <AdminSettings />;
      default: return <AdminOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <aside className="sticky top-16 hidden h-[calc(100vh-64px)] w-[280px] shrink-0 border-r border-border bg-surface p-4 lg:block">
          <div className="mb-6 flex items-center gap-2 px-3">
            <ShieldCheck className="h-4 w-4 text-primary" />
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Admin Panel</p>
          </div>
          <nav className="space-y-1">
            {adminNav.map((item) => {
              const active = pathname === item.path;
              return (
                <Link key={item.path} to={item.path}
                  className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${active ? "border-l-2 border-primary bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
                >
                  <item.icon className="h-4 w-4" />{item.label}
                </Link>
              );
            })}
          </nav>
          <div className="absolute bottom-4 left-4 right-4">
            <button onClick={() => { signOut(); navigate("/"); }} className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground">
              <LogOut className="h-4 w-4" /> Sign Out
            </button>
          </div>
        </aside>

        <main className="flex-1 p-6 lg:p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
