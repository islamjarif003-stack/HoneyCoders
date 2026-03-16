import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const footerLinks = [
  {
    title: "Marketplace",
    links: [
      { label: "Browse All", to: "/products" },
      { label: "Templates", to: "/products?category=react-templates" },
      { label: "UI Kits", to: "/products?category=ui-kits" },
    ],
  },
  {
    title: "For Vendors",
    links: [
      { label: "Sell Products", to: "/vendor" },
      { label: "Dashboard", to: "/vendor" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help Center", to: "#" },
      { label: "Terms of Service", to: "#" },
      { label: "Privacy Policy", to: "#" },
    ],
  },
];

const Footer = () => (
  <footer className="relative border-t border-border bg-surface overflow-hidden">
    {/* Subtle gradient accent */}
    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-64 w-[600px] rounded-full bg-primary/5 blur-[100px]" />

    <div className="container relative py-16">
      <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
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
          <p className="text-sm leading-relaxed text-muted-foreground">
            The engine room for modern builders. Premium code, verified quality.
          </p>
        </motion.div>

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
          {["Twitter", "GitHub", "Discord"].map((social) => (
            <motion.a
              key={social}
              href="#"
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
              whileHover={{ y: -2 }}
            >
              {social}
            </motion.a>
          ))}
        </div>
      </motion.div>
    </div>
  </footer>
);

export default Footer;
