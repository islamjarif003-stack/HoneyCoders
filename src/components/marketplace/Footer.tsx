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
      { label: "Contact Us", to: "/page/contact" },
      { label: "FAQ", to: "/page/faq" },
      { label: "Privacy Policy", to: "/page/privacy" },
      { label: "Terms of Service", to: "/page/terms" },
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
              <img src="/hunny-it-logo-1.jpeg" alt="Hunny IT" className="h-8 w-8 rounded-lg object-cover" />
              Hunny IT
            </Link>
            <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
              The largest digital marketplace. Buy, sell, and succeed with premium code.
            </p>
            <div className="flex flex-col gap-2.5 text-xs text-muted-foreground">
              <span className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-primary" /> Bangladesh</span>
              <span className="flex items-center gap-2"><Mail className="h-3.5 w-3.5 text-primary" /> contact@hunnyit.com</span>
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
          className="mt-12 flex flex-wrap justify-center gap-3 border-t border-border pt-8 pb-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          {[
            { 
              name: "Visa", 
              element: (
                <div className="flex h-[42px] w-[76px] shrink-0 cursor-pointer items-center justify-center rounded-md bg-[#1A1F71] px-2.5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#1A1F71]/20">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 66" className="h-auto w-full fill-white drop-shadow-sm">
                    <path d="M81.53 1.58L54.83 64H28.11l16.3-62.42zm92.64.04c-4.62-2-12.97-3.87-23.49-3.87-15.07 0-25.7 7.91-25.75 19.26-.1 10 5.78 14.25 12.3 17.46 6.71 3.3 10.31 5.43 10.32 8.43 0 2.9-3.54 4.2-6.81 4.2-6.97 0-12.25-3.08-16.81-5.34L123.41 64C128.76 66.63 137.53 66.86 145.65 66.86 165.15 60.98 151.24 49.19 151.23 38.14 151.22 28.52 142.23 24.06 135.65 20.83 129.72 17.79 126.01 15.92 125.99 11.93 125.97 8.03 130.47 5.1 136.86 5.1 142.79 5.1 144.84 5.56 150.31 7.27zM113.88 23.2 96.07 64H77.12l-1.39-7.38h-22.1l-3.3 7.38H28.14l31.14-62.42h22.82l31.78 62.42zM61.9 44.2l10.3-27.67 5.92 27.67H61.9z"/>
                  </svg>
                </div>
              )
            },
            { 
              name: "Mastercard", 
              element: (
                <div className="flex h-[42px] w-[76px] shrink-0 cursor-pointer items-center justify-center rounded-md bg-[#1C1C1E] px-2.5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 300" className="h-[26px]">
                    <circle cx="150" cy="150" r="150" fill="#eb001b"/>
                    <circle cx="350" cy="150" r="150" fill="#f79e1a"/>
                    <path fill="#ff5f00" d="M250 279c30.5-35.4 49-103.6 49-129s-18.5-93.6-49-129c-30.5 35.4-49 103.6-49 129s18.5 93.6 49 129z"/>
                  </svg>
                </div>
              )
            },
            { 
              name: "Amex", 
              element: (
                <div className="flex h-[42px] w-[76px] shrink-0 cursor-pointer items-center justify-center rounded-md bg-transparent px-1.5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#2E77BC]/30">
                  <div className="flex h-full w-full items-center justify-center rounded-[3px] bg-[#2E77BC]">
                    <span className="font-sans text-[12px] font-black tracking-wider text-white">AMEX</span>
                  </div>
                </div>
              )
            },
            ...[
              { name: "Alrajhi Capital", src: "/gateways/logo-1.png" },
              { name: "STC Bank", src: "/gateways/logo-2.png" },
              { name: "SNB", src: "/gateways/logo-3.png" },
              { name: "Bank Muscat", src: "/gateways/logo-4.png" },
              { name: "Maybank", src: "/gateways/logo-5.png" },
            ].map(pm => ({
              name: pm.name,
              element: (
                <div className="group flex h-[42px] w-[76px] shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-md bg-white p-1.5 shadow-sm ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:ring-primary/20">
                  <img src={pm.src} alt={pm.name} className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-110 drop-shadow-sm" />
                </div>
              )
            }))
          ].map((pm) => (
            <div key={pm.name} title={pm.name}>
              {pm.element}
            </div>
          ))}
        </motion.div>

        <motion.div
          className="flex flex-col items-center gap-4 pt-4 sm:flex-row sm:justify-between"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-xs text-muted-foreground">© 2026 HunnyCoders. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="/page/privacy" className="text-xs text-muted-foreground transition-colors hover:text-foreground">Privacy Policy</Link>
            <Link to="/page/terms" className="text-xs text-muted-foreground transition-colors hover:text-foreground">Terms of Service</Link>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
