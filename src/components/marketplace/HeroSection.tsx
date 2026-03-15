import { Search } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) navigate(`/products?q=${encodeURIComponent(query)}`);
  };

  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      <div className="absolute inset-0">
        <img src={heroBg} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-foreground/70" />
      </div>
      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-2xl text-center"
        >
          <h1 className="mb-4 font-display text-4xl font-bold tracking-tight text-primary-foreground md:text-5xl">
            The engine room for modern builders.
          </h1>
          <p className="mb-8 text-lg text-slate-300">
            4,821 curated React templates, UI kits, and backend modules. Verified by our engineering team.
          </p>
          <form onSubmit={handleSearch} className="relative mx-auto max-w-lg">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search templates, UI kits, modules..."
              className="w-full rounded-lg border-0 bg-surface py-3.5 pl-12 pr-4 text-[15px] shadow-premium outline-none ring-1 ring-border transition-shadow placeholder:text-muted-foreground focus:ring-2 focus:ring-primary"
            />
          </form>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs text-slate-400">Popular:</span>
            {["React Dashboard", "Tailwind UI", "Admin Panel", "SaaS Template"].map((tag) => (
              <button
                key={tag}
                onClick={() => { setQuery(tag); navigate(`/products?q=${encodeURIComponent(tag)}`); }}
                className="rounded-full border border-slate-500/30 px-3 py-1 text-xs text-slate-300 transition-colors hover:border-primary hover:text-primary-foreground"
              >
                {tag}
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
