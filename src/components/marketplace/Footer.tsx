import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="border-t border-border bg-surface py-12">
    <div className="container">
      <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
        <div>
          <div className="mb-4 flex items-center gap-2 font-display text-lg font-bold">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
              <span className="text-xs font-bold text-primary-foreground">S</span>
            </div>
            SourceStack
          </div>
          <p className="text-sm text-muted-foreground">The engine room for modern builders.</p>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold">Marketplace</h4>
          <nav className="flex flex-col gap-2">
            <Link to="/products" className="text-sm text-muted-foreground hover:text-foreground">Browse All</Link>
            <Link to="/products?category=react-templates" className="text-sm text-muted-foreground hover:text-foreground">Templates</Link>
            <Link to="/products?category=ui-kits" className="text-sm text-muted-foreground hover:text-foreground">UI Kits</Link>
          </nav>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold">For Vendors</h4>
          <nav className="flex flex-col gap-2">
            <Link to="/vendor" className="text-sm text-muted-foreground hover:text-foreground">Sell Products</Link>
            <Link to="/vendor" className="text-sm text-muted-foreground hover:text-foreground">Dashboard</Link>
          </nav>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold">Support</h4>
          <nav className="flex flex-col gap-2">
            <span className="text-sm text-muted-foreground">Help Center</span>
            <span className="text-sm text-muted-foreground">Terms of Service</span>
            <span className="text-sm text-muted-foreground">Privacy Policy</span>
          </nav>
        </div>
      </div>
      <div className="mt-10 border-t border-border pt-6 text-center text-xs text-muted-foreground">
        © 2026 SourceStack. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
