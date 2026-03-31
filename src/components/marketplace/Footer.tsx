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
      { label: "Refund Policy", to: "/page/refund-policy" },
      { label: "Terms of Service", to: "/page/terms" },
      { label: "Sell Products", to: "/vendor" },
    ],
  },
];

const Footer = () => {
  const [email, setEmail] = useState("");

  return (
    <footer className="relative border-t border-white/60 bg-white/40 glass-strong overflow-hidden mt-10">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-64 w-[600px] rounded-full bg-[#1F403A]/5 blur-[120px]" />

      <div className="container relative py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Link to="/" className="mb-5 flex items-center gap-2.5 font-display text-xl font-bold text-[#1F403A]">
              <img src="/hunny-it-logo-1.jpeg" alt="Hunny IT" className="h-9 w-9 rounded-xl object-cover shadow-sm" />
              Hunny IT
            </Link>
            <p className="mb-5 text-[14px] leading-relaxed text-[#6A7B75]">
              The largest digital marketplace. Buy, sell, and succeed with premium code.
            </p>
            <div className="flex flex-col gap-2.5 text-[13px] text-[#1F403A] font-medium">
              <span className="flex items-center gap-2.5"><MapPin className="h-4 w-4 text-[#2D7A5F]" /> Bangladesh</span>
              <span className="flex items-center gap-2.5"><Mail className="h-4 w-4 text-[#2D7A5F]" /> contact@hunnyit.com</span>
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
              <h4 className="mb-5 text-[15px] font-bold text-[#1F403A]">{section.title}</h4>
              <nav className="flex flex-col gap-3">
                {section.links.map((link) => (
                  <Link
                    key={link.label}
                    to={link.to}
                    className="group flex items-center gap-1.5 text-[14px] text-[#6A7B75] font-medium transition-colors hover:text-[#2D7A5F]"
                  >
                    {link.label}
                    <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
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
            <h4 className="mb-5 text-[15px] font-bold text-[#1F403A]">Newsletter</h4>
            <p className="mb-4 text-[13px] font-medium text-[#6A7B75]">Stay updated with new products & offers!</p>
            <div className="flex overflow-hidden rounded-2xl bg-white/60 p-1.5 shadow-sm border border-white focus-within:ring-2 focus-within:ring-[#2D7A5F]/20 transition-all focus-within:bg-white/90">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                className="flex-1 bg-transparent px-3 text-[14px] font-medium text-[#1F403A] outline-none placeholder:text-[#6A7B75]/70"
              />
              <button className="btn-primary px-5 py-2.5 text-[14px] font-bold">
                <Send className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-5 text-[13px] font-semibold text-[#1F403A]">Follow us on</p>
            <div className="mt-3 flex gap-3.5">
              {["Twitter", "GitHub", "Discord", "YouTube"].map((social) => (
                <motion.a
                  key={social}
                  href="#"
                  className="rounded-lg bg-white/60 p-2 text-[#6A7B75] shadow-sm transition-all hover:bg-[#2D7A5F] hover:text-white"
                  whileHover={{ y: -3 }}
                >
                  <span className="text-[11px] font-bold uppercase tracking-wider">{social.substring(0,2)}</span>
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          className="mt-14 flex flex-wrap justify-center gap-3.5 border-t border-black/5 pt-10 pb-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          {[
            { 
              name: "Visa", 
              element: (
                <div className="flex h-[44px] w-[78px] shrink-0 cursor-pointer items-center justify-center rounded-xl bg-white px-2 shadow-sm border border-black/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-[#1A1F71]/30">
                  <span className="font-sans text-[1.25rem] font-black italic tracking-widest text-[#1A1F71] drop-shadow-sm transition-transform duration-300 hover:scale-105">VISA</span>
                </div>
              )
            },
            { 
              name: "Mastercard", 
              element: (
                <div className="flex h-[44px] w-[78px] shrink-0 cursor-pointer items-center justify-center rounded-xl bg-white px-2 shadow-sm border border-black/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-[#eb001b]/30">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 300" className="h-[28px] drop-shadow-sm transition-transform duration-300 hover:scale-110">
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
                <div className="flex h-[44px] w-[78px] shrink-0 cursor-pointer items-center justify-center rounded-xl bg-white p-0 shadow-sm border border-black/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-[#2E77BC]/30">
                  <div className="flex h-[34px] w-[64px] items-center justify-center rounded bg-[#2E77BC] transition-transform duration-300 hover:scale-105">
                    <span className="font-sans text-[11px] font-black tracking-[0.15em] text-white drop-shadow-sm">AMEX</span>
                  </div>
                </div>
              )
            },
            ...([
              { name: "Alrajhi Capital", src: "/gateways/alrajhi.svg" },
              { name: "STC Bank", src: "/gateways/stc.svg" },
              { name: "SNB", src: "/gateways/snb.svg" },
              { name: "Bank Muscat", src: "/gateways/bankmuscat.svg" },
              { name: "Maybank", src: "/gateways/maybank.svg" },
            ] as const).map(pm => ({
              name: pm.name,
              element: (
                <div className="group flex h-[44px] w-[78px] shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-xl bg-white shadow-sm border border-black/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-[#2D7A5F]/30">
                  <img 
                    src={pm.src} 
                    alt={pm.name} 
                    className="h-[65%] w-[65%] object-contain transition-transform duration-300 group-hover:scale-110" 
                  />
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
          <p className="text-[13px] font-medium text-[#6A7B75]">© 2026 HunnyCoders. All rights reserved.</p>
          <div className="flex gap-5">
            <Link to="/page/privacy" className="text-[13px] font-medium text-[#6A7B75] transition-colors hover:text-[#2D7A5F]">Privacy Policy</Link>
            <Link to="/page/refund-policy" className="text-[13px] font-medium text-[#6A7B75] transition-colors hover:text-[#2D7A5F]">Refund Policy</Link>
            <Link to="/page/terms" className="text-[13px] font-medium text-[#6A7B75] transition-colors hover:text-[#2D7A5F]">Terms of Service</Link>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
