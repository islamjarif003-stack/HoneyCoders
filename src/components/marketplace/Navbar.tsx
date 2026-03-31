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
  { label: "Sell", to: "/vendor" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, profile, signOut, isVendor, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchVal, setSearchVal] = useState("");

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) navigate(`/products?q=${encodeURIComponent(searchVal)}`);
  };

  return (
    <header className="sticky top-0 z-50 glass-strong shadow-sm border-b border-white/40">
      <div className="container flex h-[70px] items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="group flex items-center gap-2.5 font-display text-xl font-bold shrink-0">
          <motion.div
            whileHover={{ scale: 1.05, rotate: 2 }}
            whileTap={{ scale: 0.95 }}
            className="relative"
          >
            <img src="/hunny-it-logo-1.jpeg" alt="Hunny IT" className="h-9 w-9 rounded-xl object-cover shadow-soft" />
            <div className="absolute inset-0 rounded-xl ring-2 ring-[#2D7A5F]/0 group-hover:ring-[#2D7A5F]/30 transition-all duration-300" />
          </motion.div>
          <span className="hidden sm:inline text-primary-dark">
            Hunny <span className="text-gradient">IT</span>
          </span>
        </Link>

        {/* Center Nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="link-underline rounded-lg px-3.5 py-2 text-[15px] font-medium text-secondary-soft transition-all duration-200 hover:text-primary-dark hover:bg-black/5"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <motion.form
            onSubmit={handleSearch}
            className={`hidden items-center gap-2 rounded-xl border px-3 py-2 transition-all duration-300 md:flex ${
              searchFocused
                ? "border-[#2D7A5F]/40 bg-white/70 shadow-glow w-64"
                : "border-black/5 bg-white/40 w-52"
            }`}
          >
            <Search className={`h-4 w-4 shrink-0 transition-colors ${searchFocused ? "text-[#2D7A5F]" : "text-[#6A7B75]"}`} />
            <input
              type="text"
              value={searchVal}
              onChange={e => setSearchVal(e.target.value)}
              placeholder="Search products..."
              className="w-full border-0 bg-transparent text-[14px] text-primary-dark outline-none placeholder:text-[#6A7B75]/70"
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
            <kbd className="hidden items-center gap-0.5 rounded border border-black/10 bg-black/5 px-1.5 py-0.5 font-mono text-[10px] text-[#6A7B75] md:flex">
              <Command className="h-2.5 w-2.5" />K
            </kbd>
          </motion.form>

          {user && (
            <Link to="/library">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button variant="ghost" size="icon" className="relative text-[#1F403A] hover:bg-black/5 rounded-full">
                  <ShoppingCart className="h-[18px] w-[18px]" />
                </Button>
              </motion.div>
            </Link>
          )}

          {isAdmin && (
            <Link to="/admin">
              <Button variant="ghost" size="sm" className="hidden text-xs font-semibold text-[#1F403A] hover:text-[#2D7A5F] hover:bg-black/5 md:inline-flex rounded-xl">
                Admin
              </Button>
            </Link>
          )}

          {(isVendor || isAdmin) && (
            <Link to="/vendor">
              <Button
                variant="outline"
                size="sm"
                className="hidden text-[13px] font-semibold md:inline-flex border-[#1F403A]/20 bg-transparent text-[#1F403A] hover:border-[#2D7A5F]/40 hover:bg-[#2D7A5F]/10 hover:text-[#2D7A5F] rounded-xl transition-all duration-300 shadow-sm"
              >
                Vendor Panel
              </Button>
            </Link>
          )}

          {user ? (
            <div className="flex items-center gap-2">
              <motion.div
                className="hidden items-center gap-2 rounded-full border border-black/5 bg-white/50 px-3 py-1.5 md:flex cursor-pointer shadow-sm transition-all"
                whileHover={{ borderColor: "rgba(219,114,82,0.3)", backgroundColor: "rgba(255,255,255,0.8)" }}
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full gradient-primary text-[11px] font-bold text-white shadow-glow">
                  {(profile?.display_name || user.email || "U")[0].toUpperCase()}
                </div>
                <span className="text-[14px] font-semibold text-primary-dark">{profile?.display_name || user.email}</span>
              </motion.div>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button variant="ghost" size="icon" onClick={handleSignOut} className="text-[#1F403A] hover:text-[#2D7A5F] hover:bg-[#2D7A5F]/10 rounded-full">
                  <LogOut className="h-[18px] w-[18px]" />
                </Button>
              </motion.div>
            </div>
          ) : (
            <Link to="/auth">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button
                  className="bg-[#2D7A5F] text-white rounded-xl px-5 py-4.5 h-10 shadow-glow transition-all hover:shadow-lg hover:-translate-y-0.5 hover:bg-[#236B50] font-semibold text-[14px]"
                >
                  <User className="mr-2 h-4 w-4" />
                  Sign In
                </Button>
              </motion.div>
            </Link>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-[#1F403A] hover:bg-black/5"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-black/5 bg-[#ECE1CF] md:hidden shadow-elevated"
          >
            <nav className="flex flex-col gap-1 p-4">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.to}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    to={link.to}
                    className="block rounded-xl px-4 py-3 text-[15px] font-semibold text-primary-dark transition-colors hover:bg-white/60 hover:text-[#2D7A5F]"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              {user && (
                <Link to="/library" className="block rounded-xl px-4 py-3 text-[15px] font-semibold text-primary-dark hover:bg-white/60" onClick={() => setMobileOpen(false)}>
                  My Library
                </Link>
              )}
              {(isVendor || isAdmin) && (
                <Link to="/vendor" className="block rounded-xl px-4 py-3 text-[15px] font-semibold text-primary-dark hover:bg-white/60" onClick={() => setMobileOpen(false)}>
                  Vendor Panel
                </Link>
              )}
              {isAdmin && (
                <Link to="/admin" className="block rounded-xl px-4 py-3 text-[15px] font-semibold text-primary-dark hover:bg-white/60" onClick={() => setMobileOpen(false)}>
                  Admin
                </Link>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
