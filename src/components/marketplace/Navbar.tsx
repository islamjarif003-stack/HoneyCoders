import { Search, ShoppingCart, User, Menu, LogOut, X, Command } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "Browse", to: "/products" },
  { label: "Templates", to: "/products?category=react-templates" },
  { label: "UI Kits", to: "/products?category=ui-kits" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, profile, signOut, isVendor, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [searchFocused, setSearchFocused] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 glass-strong">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link to="/" className="group flex items-center gap-2.5 font-display text-xl font-bold text-foreground">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            <img src="/hunny-it-logo-1.jpeg" alt="Hunny IT" className="h-8 w-8 rounded-lg object-cover" />
          </motion.div>
          <span className="hidden sm:inline">Hunny IT</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="link-underline rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
          {(isVendor || isAdmin) && (
            <Link to="/vendor" className="link-underline rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Sell
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-2">
          <motion.div
            className={`hidden items-center gap-1.5 rounded-lg border bg-surface px-3 py-1.5 transition-all duration-300 md:flex ${searchFocused ? "border-primary/50 shadow-glow" : "border-border"}`}
          >
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search products..."
              className="w-48 border-0 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
            <kbd className="flex items-center gap-0.5 rounded border border-border px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
              <Command className="h-2.5 w-2.5" />K
            </kbd>
          </motion.div>
          
          {user && (
            <Link to="/library">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingCart className="h-4 w-4" />
                </Button>
              </motion.div>
            </Link>
          )}

          {isAdmin && (
            <Link to="/admin">
              <Button variant="ghost" size="sm" className="hidden text-sm md:inline-flex">Admin</Button>
            </Link>
          )}

          {(isVendor || isAdmin) && (
            <Link to="/vendor">
              <Button variant="outline" size="sm" className="hidden text-sm md:inline-flex hover:border-primary/50 hover:shadow-glow transition-all">Vendor Panel</Button>
            </Link>
          )}

          {user ? (
            <div className="flex items-center gap-2">
              <motion.div
                className="hidden items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 md:flex"
                whileHover={{ borderColor: "hsl(239 84% 67% / 0.3)" }}
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full gradient-primary text-[10px] font-bold text-primary-foreground">
                  {(profile?.display_name || user.email || "U")[0].toUpperCase()}
                </div>
                <span className="text-sm font-medium">{profile?.display_name || user.email}</span>
              </motion.div>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button variant="ghost" size="icon" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </motion.div>
            </div>
          ) : (
            <Link to="/auth">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button size="sm" className="gradient-primary text-primary-foreground shadow-glow transition-shadow hover:shadow-lg">
                  <User className="mr-1.5 h-3.5 w-3.5" />Sign In
                </Button>
              </motion.div>
            </Link>
          )}

          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-border bg-surface md:hidden"
          >
            <nav className="flex flex-col gap-1 p-4">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.to}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    to={link.to}
                    className="block rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              {user && (
                <Link to="/library" className="block rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground" onClick={() => setMobileOpen(false)}>
                  My Library
                </Link>
              )}
              {(isVendor || isAdmin) && <Link to="/vendor" className="block rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground" onClick={() => setMobileOpen(false)}>Vendor</Link>}
              {isAdmin && <Link to="/admin" className="block rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground" onClick={() => setMobileOpen(false)}>Admin</Link>}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
