import { Search, ShoppingCart, User, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold text-foreground">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
            <span className="text-sm font-bold text-primary-foreground">S</span>
          </div>
          SourceStack
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link to="/products" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Browse
          </Link>
          <Link to="/products?category=react-templates" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Templates
          </Link>
          <Link to="/products?category=ui-kits" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            UI Kits
          </Link>
          <Link to="/vendor" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Sell
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-1 rounded-md border border-border bg-surface px-3 py-1.5 md:flex">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search products..."
              className="w-48 border-0 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            <kbd className="rounded border border-border px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">⌘K</kbd>
          </div>
          <Button variant="ghost" size="icon" className="relative">
            <ShoppingCart className="h-4 w-4" />
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
              2
            </span>
          </Button>
          <Link to="/admin">
            <Button variant="ghost" size="sm" className="hidden text-sm md:inline-flex">
              Admin
            </Button>
          </Link>
          <Link to="/vendor">
            <Button variant="outline" size="sm" className="hidden text-sm md:inline-flex">
              Vendor Panel
            </Button>
          </Link>
          <Button size="sm" className="bg-primary text-primary-foreground hover:bg-indigo-700">
            <User className="mr-1.5 h-3.5 w-3.5" />
            Sign In
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
      {mobileOpen && (
        <div className="border-t border-border bg-surface p-4 md:hidden">
          <nav className="flex flex-col gap-3">
            <Link to="/products" className="text-sm font-medium text-muted-foreground" onClick={() => setMobileOpen(false)}>Browse</Link>
            <Link to="/vendor" className="text-sm font-medium text-muted-foreground" onClick={() => setMobileOpen(false)}>Sell</Link>
            <Link to="/admin" className="text-sm font-medium text-muted-foreground" onClick={() => setMobileOpen(false)}>Admin</Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
