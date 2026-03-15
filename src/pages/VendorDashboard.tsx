import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Package, Upload, DollarSign, BarChart3, Settings, LogOut } from "lucide-react";
import Navbar from "@/components/marketplace/Navbar";

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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        {/* Sidebar */}
        <aside className="sticky top-16 hidden h-[calc(100vh-64px)] w-[280px] shrink-0 border-r border-border bg-surface p-4 lg:block">
          <div className="mb-6 px-3">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Vendor Panel</p>
          </div>
          <nav className="space-y-1">
            {vendorNav.map((item) => {
              const active = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                    active
                      ? "border-l-2 border-primary bg-indigo-50 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="absolute bottom-4 left-4 right-4">
            <button className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground">
              <LogOut className="h-4 w-4" /> Sign Out
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8">
          <h1 className="mb-6 font-display text-2xl font-bold">Vendor Dashboard</h1>
          {/* Stats Cards */}
          <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { label: "Total Sales", value: "$12,847", change: "+12.5%" },
              { label: "Products", value: "24", change: "+3" },
              { label: "Downloads", value: "8,432", change: "+8.2%" },
              { label: "Avg. Rating", value: "4.7", change: "+0.2" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-lg border border-border bg-card p-5 shadow-ink">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="mt-1 font-display text-2xl font-bold tabular-nums">{stat.value}</p>
                <p className="mt-1 text-xs font-medium text-emerald-600">{stat.change}</p>
              </div>
            ))}
          </div>

          {/* Recent Sales Table */}
          <div className="rounded-lg border border-border bg-card shadow-ink">
            <div className="border-b border-border p-4">
              <h2 className="font-display text-sm font-semibold">Recent Sales</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Product</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Buyer</th>
                    <th className="px-4 py-3 text-right font-medium text-muted-foreground">Amount</th>
                    <th className="px-4 py-3 text-right font-medium text-muted-foreground">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { product: "Horizon Dashboard Pro", buyer: "john@example.com", amount: "$49", date: "Mar 15" },
                    { product: "Starter UI Kit", buyer: "sarah@example.com", amount: "$39", date: "Mar 14" },
                    { product: "SaaSify Landing", buyer: "mike@example.com", amount: "$29", date: "Mar 14" },
                    { product: "Horizon Dashboard Pro", buyer: "alice@example.com", amount: "$49", date: "Mar 13" },
                  ].map((sale, i) => (
                    <tr key={i} className="border-b border-border last:border-0">
                      <td className="px-4 py-3 font-medium">{sale.product}</td>
                      <td className="px-4 py-3 text-muted-foreground">{sale.buyer}</td>
                      <td className="px-4 py-3 text-right tabular-nums font-medium">{sale.amount}</td>
                      <td className="px-4 py-3 text-right text-muted-foreground">{sale.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default VendorDashboard;
