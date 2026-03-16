import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, Send, MapPin, Phone, Mail } from "lucide-react";
import { useState } from "react";

const footerLinks = [
  {
    title: "Marketplace",
    links: [
      { label: "Browse All", to: "/products" },
      { label: "Templates", to: "/products?category=react-templates" },
      { label: "UI Kits", to: "/products?category=ui-kits" },
      { label: "Mobile Apps", to: "/products?category=mobile" },
      { label: "Graphics", to: "/products?category=graphics" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Contact Us", to: "#" },
      { label: "FAQ", to: "#" },
      { label: "Privacy Policy", to: "#" },
      { label: "Terms of Service", to: "#" },
      { label: "Sell Products", to: "/vendor" },
    ],
  },
];

const Footer = () => {
  const [email, setEmail] = useState("");

  return (
    <footer className="relative border-t border-border bg-card overflow-hidden">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-64 w-[600px] rounded-full bg-primary/5 blur-[100px]" />

      <div className="container relative py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Link to="/" className="mb-5 flex items-center gap-2.5 font-display text-lg font-bold">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary shadow-glow">
                <span className="text-xs font-bold text-primary-foreground">S</span>
              </div>
              SourceStack
            </Link>
            <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
              The largest digital marketplace. Buy, sell, and succeed with premium code.
            </p>
            <div className="flex flex-col gap-2.5 text-xs text-muted-foreground">
              <span className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-primary" /> San Francisco, CA</span>
              <span className="flex items-center gap-2"><Phone className="h-3.5 w-3.5 text-primary" /> +1 (555) 123-4567</span>
              <span className="flex items-center gap-2"><Mail className="h-3.5 w-3.5 text-primary" /> hello@sourcestack.dev</span>
            </div>
          </motion.div>

          {/* Links */}
          {footerLinks.map((section, i) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (i + 1) * 0.1 }}
            >
              <h4 className="mb-4 text-sm font-semibold">{section.title}</h4>
              <nav className="flex flex-col gap-2.5">
                {section.links.map((link) => (
                  <Link
                    key={link.label}
                    to={link.to}
                    className="group flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                    <ArrowUpRight className="h-3 w-3 opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                ))}
              </nav>
            </motion.div>
          ))}

          {/* Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h4 className="mb-4 text-sm font-semibold">Newsletter</h4>
            <p className="mb-4 text-xs text-muted-foreground">Stay updated with new products & offers!</p>
            <div className="flex overflow-hidden rounded-lg border border-border bg-surface">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                className="flex-1 bg-transparent px-3 py-2.5 text-sm outline-none placeholder:text-muted-foreground"
              />
              <button className="gradient-primary px-3 text-primary-foreground transition-all hover:opacity-90">
                <Send className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">Follow us on</p>
            <div className="mt-2 flex gap-3">
              {["Twitter", "GitHub", "Discord", "YouTube"].map((social) => (
                <motion.a
                  key={social}
                  href="#"
                  className="text-xs text-muted-foreground transition-colors hover:text-primary"
                  whileHover={{ y: -2 }}
                >
                  {social}
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          className="mt-12 flex flex-col items-center gap-4 border-t border-border pt-8 sm:flex-row sm:justify-between"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-xs text-muted-foreground">© 2026 SourceStack. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="text-xs text-muted-foreground transition-colors hover:text-foreground">Privacy Policy</a>
            <a href="#" className="text-xs text-muted-foreground transition-colors hover:text-foreground">Terms of Service</a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
