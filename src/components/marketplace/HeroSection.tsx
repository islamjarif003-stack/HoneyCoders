import { Search, Sparkles } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import heroBg from "@/assets/hero-bg.jpg";

const floatingTags = [
  { label: "React", x: "10%", y: "20%", delay: 0 },
  { label: "Tailwind", x: "80%", y: "15%", delay: 0.5 },
  { label: "TypeScript", x: "85%", y: "75%", delay: 1 },
  { label: "Next.js", x: "5%", y: "70%", delay: 1.5 },
];

const HeroSection = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) navigate(`/products?q=${encodeURIComponent(query)}`);
  };

  return (
    <section ref={ref} className="relative overflow-hidden py-28 md:py-40">
      {/* Parallax Background */}
      <motion.div className="absolute inset-0" style={{ y: bgY }}>
        <img src={heroBg} alt="" className="h-[120%] w-full object-cover" />
        <div className="absolute inset-0 gradient-hero opacity-85" />
      </motion.div>

      {/* Animated dot pattern overlay */}
      <div className="absolute inset-0 dot-pattern opacity-30" />

      {/* Animated gradient orbs */}
      <motion.div
        className="absolute -left-32 -top-32 h-96 w-96 rounded-full opacity-20"
        style={{ background: "radial-gradient(circle, hsl(250 90% 72%), transparent 70%)" }}
        animate={{ scale: [1, 1.2, 1], x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full opacity-15"
        style={{ background: "radial-gradient(circle, hsl(239 84% 67%), transparent 70%)" }}
        animate={{ scale: [1.2, 1, 1.2], x: [0, -20, 0], y: [0, 30, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Floating tags */}
      {floatingTags.map((tag) => (
        <motion.div
          key={tag.label}
          className="absolute hidden rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary-foreground/70 backdrop-blur-sm md:block"
          style={{ left: tag.x, top: tag.y }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.6, scale: 1, y: [0, -8, 0] }}
          transition={{ delay: tag.delay + 0.8, duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          {tag.label}
        </motion.div>
      ))}

      <motion.div className="container relative z-10" style={{ opacity }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-2xl text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary-foreground/90 backdrop-blur-sm"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>4,821 curated products · Verified by engineers</span>
          </motion.div>

          <motion.h1
            className="mb-5 font-display text-4xl font-bold tracking-tight text-primary-foreground md:text-6xl md:leading-[1.1]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            The engine room for{" "}
            <span className="text-gradient">modern builders.</span>
          </motion.h1>

          <motion.p
            className="mb-10 text-lg text-slate-300/90"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            Premium React templates, UI kits, and backend modules.
            <br className="hidden sm:block" />
            Ship faster with production-ready code.
          </motion.p>

          <motion.form
            onSubmit={handleSearch}
            className="relative mx-auto max-w-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <div className="group relative">
              <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-primary/40 via-primary-glow/20 to-primary/40 opacity-0 blur transition-opacity duration-500 group-focus-within:opacity-100" />
              <div className="relative flex items-center rounded-xl border-0 bg-surface/95 shadow-elevated backdrop-blur-xl">
                <Search className="ml-4 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search templates, UI kits, modules..."
                  className="w-full bg-transparent py-4 pl-3 pr-4 text-[15px] text-foreground outline-none placeholder:text-muted-foreground"
                />
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mr-2 rounded-lg gradient-primary px-5 py-2 text-sm font-medium text-primary-foreground shadow-glow transition-shadow hover:shadow-lg"
                >
                  Search
                </motion.button>
              </div>
            </div>
          </motion.form>

          <motion.div
            className="mt-6 flex flex-wrap items-center justify-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.5 }}
          >
            <span className="text-xs text-slate-400/80">Popular:</span>
            {["React Dashboard", "Tailwind UI", "Admin Panel", "SaaS Template"].map((tag, i) => (
              <motion.button
                key={tag}
                onClick={() => { setQuery(tag); navigate(`/products?q=${encodeURIComponent(tag)}`); }}
                className="rounded-full border border-slate-500/20 bg-slate-500/10 px-3.5 py-1.5 text-xs font-medium text-slate-300 backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:bg-primary/20 hover:text-primary-foreground"
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + i * 0.1 }}
              >
                {tag}
              </motion.button>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroSection;
