import { Search, Sparkles, ArrowRight, Zap } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import heroBg from "@/assets/hero-bg.jpg"; // Keep if it's a generic image, but will lower opacity heavily

const floatingTags = [
  { label: "⚡ Next.js", x: "8%", y: "22%", delay: 0 },
  { label: "🎨 Flutter", x: "78%", y: "14%", delay: 0.5 },
  { label: "🔷 TypeScript", x: "83%", y: "72%", delay: 1 },
  { label: "🌿 Laravel", x: "4%", y: "68%", delay: 1.5 },
];

const rotatingWords = ["modern builders.", "startup founders.", "creative devs.", "product teams."];

const HeroSection = () => {
  const [query, setQuery] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [displayText, setDisplayText] = useState("");
  const navigate = useNavigate();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "28%"]);

  useEffect(() => {
    const currentWord = rotatingWords[wordIndex];
    const speed = isDeleting ? 35 : 75;
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setDisplayText(currentWord.slice(0, charIndex + 1));
        setCharIndex(p => p + 1);
        if (charIndex + 1 === currentWord.length) setTimeout(() => setIsDeleting(true), 2200);
      } else {
        setDisplayText(currentWord.slice(0, charIndex - 1));
        setCharIndex(p => p - 1);
        if (charIndex - 1 === 0) {
          setIsDeleting(false);
          setWordIndex(p => (p + 1) % rotatingWords.length);
        }
      }
    }, speed);
    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, wordIndex]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) navigate(`/products?q=${encodeURIComponent(query)}`);
  };

  return (
    <section ref={ref} className="relative overflow-hidden py-28 md:py-44 noise-overlay">
      {/* Background */}
      <motion.div className="absolute inset-0" style={{ y: bgY }}>
        <img src={heroBg} alt="" className="h-[120%] w-full object-cover opacity-5 mix-blend-multiply" />
        <div className="absolute inset-0 bg-transparent" />
      </motion.div>

      {/* Grid pattern */}
      <div className="absolute inset-0 grid-pattern opacity-100 mix-blend-multiply" />

      {/* Ambient glow orbs mapping to new palette */}
      <motion.div
        className="absolute -left-48 -top-48 h-[600px] w-[600px] rounded-full opacity-30 animate-pulse-glow"
        style={{ background: "radial-gradient(circle, #2D7A5F 0%, transparent 65%)" }}
        animate={{ scale: [1, 1.1, 1], x: [0, 20, 0], y: [0, -10, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="bg-glow -bottom-40 -right-40"
        animate={{ scale: [1.1, 1, 1.1], x: [0, -20, 0], y: [0, 25, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Deep premium background mesh is handled globally, so just keep the overlays for extra depth */}
      <div className="absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
        <div className="bg-glow" />
        <div className="bg-glow-orange opacity-40" />
      </div>

      {/* Floating tech tags */}
      {floatingTags.map((tag) => (
        <motion.div
          key={tag.label}
          className="absolute hidden rounded-2xl border border-black/5 bg-white/40 px-4 py-2 text-xs font-semibold text-[#1F403A] backdrop-blur-md shadow-soft md:block"
          style={{ left: tag.x, top: tag.y }}
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: [0.7, 1, 0.7], scale: 1, y: [0, -12, 0] }}
          transition={{ delay: tag.delay + 0.6, duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          {tag.label}
        </motion.div>
      ))}

      <motion.div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-3xl text-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mx-auto mb-8 inline-flex items-center gap-2 rounded-full border border-[#2D7A5F]/15 bg-white/40 px-5 py-2.5 text-xs font-semibold text-[#1F403A] backdrop-blur-md shadow-soft"
          >
            <Sparkles className="h-4 w-4 text-[#2D7A5F]" />
            <span>4,821 curated products · Verified by engineers</span>
            <Zap className="h-3.5 w-3.5 text-amber-500 opacity-80" />
          </motion.div>

          {/* Headline */}
          <motion.h1
            className="mb-6 text-4xl font-extrabold tracking-tight text-[#1F403A] md:text-6xl md:leading-[1.1] lg:text-7xl"
            style={{ fontFamily: 'Poppins, sans-serif' }}
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            Need code?{" "}
            <br className="hidden sm:block" />
            <span className="relative inline-block mt-2">
              <span className="text-gradient drop-shadow-sm">{displayText}</span>
              <motion.span
                className="ml-1 inline-block h-[0.8em] w-[4px] translate-y-[0.1em] rounded-full bg-[#2D7A5F] align-middle"
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.55, repeat: Infinity, repeatType: "reverse" }}
              />
            </span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            className="mb-10 text-[17px] font-semibold text-[#1F403A]/80 md:text-[19px] leading-relaxed max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            Web templates, mobile apps, themes & graphics — buy or sell
            <br className="hidden sm:block" />
            on the safest and fastest digital marketplace.
          </motion.p>

          {/* Search */}
          <motion.form
            onSubmit={handleSearch}
            className="relative mx-auto max-w-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.6 }}
          >
            <div className="group relative">
              <div className="absolute -inset-[3px] rounded-2xl bg-[#2D7A5F]/10 opacity-0 blur-md transition-opacity duration-500 group-focus-within:opacity-100" />
              <div className="flex h-16 w-full items-center gap-3 rounded-[20px] bg-white/85 p-2 shadow-[0_10px_40px_-10px_rgba(31,64,58,0.1)] backdrop-blur-2xl border border-white transition-all focus-within:ring-2 focus-within:ring-[#2D7A5F]/30 focus-within:bg-white/95">
                <Search className="ml-4 h-6 w-6 text-[#1F403A]/60" />
                <input
                  type="text"
                  placeholder="Search templates, UI kits, plugins..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="h-full flex-1 bg-transparent px-2 text-[16px] font-medium text-[#1F403A] outline-none placeholder:text-[#1F403A]/40"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSearch(e);
                    }
                  }}
                />
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className="mr-2.5 flex items-center gap-2 rounded-xl bg-[#2D7A5F] px-6 py-3 text-[15px] font-bold text-white shadow-glow transition-all hover:bg-[#236B50] hover:shadow-lg"
                >
                  Search
                  <ArrowRight className="h-4 w-4" />
                </motion.button>
              </div>
            </div>
          </motion.form>

          {/* Tag filters */}
          <motion.div
            className="mt-8 flex flex-wrap items-center justify-center gap-2.5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.88, duration: 0.5 }}
          >
            <span className="text-[13px] text-[#1F403A] font-bold tracking-wider uppercase mr-2.5 opacity-90">Trending:</span>
            {["WordPress", "Next.js", "Flutter", "Tailwind", "Laravel"].map((tag, i) => (
              <motion.button
                key={tag}
                onClick={() => { setQuery(tag); navigate(`/products?q=${encodeURIComponent(tag)}`); }}
                className="relative overflow-hidden rounded-full bg-white/85 backdrop-blur-md px-5 py-2 text-[13px] font-bold text-[#1F403A] shadow-sm ring-1 ring-white transition-all duration-300 hover:ring-[#2D7A5F]/40 hover:bg-white hover:text-[#2D7A5F] hover:shadow-md"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + i * 0.08 }}
              >
                {tag}
              </motion.button>
            ))}
          </motion.div>

          {/* Stats row */}
          <motion.div
            className="mt-14 flex items-center justify-center gap-10"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.5 }}
          >
            {[
              { value: "4.8K+", label: "Premium Products" },
              { value: "1.2K+", label: "Verified Vendors" },
              { value: "98%", label: "Customer Satisfaction" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-black text-[#1F403A]" style={{ fontFamily: 'Poppins, sans-serif' }}>{stat.value}</div>
                <div className="text-[14px] font-bold text-[#1F403A]/70 mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[var(--background)] to-transparent" />
    </section>
  );
};

export default HeroSection;
