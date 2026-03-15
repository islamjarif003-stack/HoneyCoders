import { Search, ShoppingCart, User, Menu, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, profile, signOut, isVendor, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

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
          <Link to="/products" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Browse</Link>
          <Link to="/products?category=react-templates" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Templates</Link>
          <Link to="/products?category=ui-kits" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">UI Kits</Link>
          {(isVendor || isAdmin) && (
            <Link to="/vendor" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Sell</Link>
          )}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-1 rounded-md border border-border bg-surface px-3 py-1.5 md:flex">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input type="text" placeholder="Search products..." className="w-48 border-0 bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
            <kbd className="rounded border border-border px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">⌘K</kbd>
          </div>
          
          {user && (
            <Link to="/library">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-4 w-4" />
              </Button>
            </Link>
          )}

          {isAdmin && (
            <Link to="/admin">
              <Button variant="ghost" size="sm" className="hidden text-sm md:inline-flex">Admin</Button>
            </Link>
          )}

          {(isVendor || isAdmin) && (
            <Link to="/vendor">
              <Button variant="outline" size="sm" className="hidden text-sm md:inline-flex">Vendor Panel</Button>
            </Link>
          )}

          {user ? (
            <div className="flex items-center gap-2">
              <span className="hidden text-sm font-medium md:inline">{profile?.display_name || user.email}</span>
              <Button variant="ghost" size="icon" onClick={handleSignOut}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Link to="/auth">
              <Button size="sm" className="bg-primary text-primary-foreground hover:bg-indigo-700">
                <User className="mr-1.5 h-3.5 w-3.5" />Sign In
              </Button>
            </Link>
          )}

          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
      {mobileOpen && (
        <div className="border-t border-border bg-surface p-4 md:hidden">
          <nav className="flex flex-col gap-3">
            <Link to="/products" className="text-sm font-medium text-muted-foreground" onClick={() => setMobileOpen(false)}>Browse</Link>
            {user && <Link to="/library" className="text-sm font-medium text-muted-foreground" onClick={() => setMobileOpen(false)}>My Library</Link>}
            {(isVendor || isAdmin) && <Link to="/vendor" className="text-sm font-medium text-muted-foreground" onClick={() => setMobileOpen(false)}>Vendor</Link>}
            {isAdmin && <Link to="/admin" className="text-sm font-medium text-muted-foreground" onClick={() => setMobileOpen(false)}>Admin</Link>}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
