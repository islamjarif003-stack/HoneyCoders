import { Search, Sparkles } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import heroBg from "@/assets/hero-bg.jpg";

const floatingTags = [
  { label: "React", x: "10%", y: "20%", delay: 0 },
  { label: "Tailwind", x: "80%", y: "15%", delay: 0.5 },
  { label: "TypeScript", x: "85%", y: "75%", delay: 1 },
  { label: "Next.js", x: "5%", y: "70%", delay: 1.5 },
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
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    const currentWord = rotatingWords[wordIndex];
    const speed = isDeleting ? 40 : 80;

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setDisplayText(currentWord.slice(0, charIndex + 1));
        setCharIndex((prev) => prev + 1);
        if (charIndex + 1 === currentWord.length) {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        setDisplayText(currentWord.slice(0, charIndex - 1));
        setCharIndex((prev) => prev - 1);
        if (charIndex - 1 === 0) {
          setIsDeleting(false);
          setWordIndex((prev) => (prev + 1) % rotatingWords.length);
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
    <section ref={ref} className="relative overflow-hidden py-28 md:py-40">
      {/* Parallax Background */}
      <motion.div className="absolute inset-0" style={{ y: bgY }}>
        <img src={heroBg} alt="" className="h-[120%] w-full object-cover opacity-30" />
        <div className="absolute inset-0 gradient-hero opacity-95" />
      </motion.div>

      {/* Animated dot pattern overlay */}
      <div className="absolute inset-0 dot-pattern opacity-20" />

      {/* Animated gradient orbs */}
      <motion.div
        className="absolute -left-32 -top-32 h-96 w-96 rounded-full opacity-15"
        style={{ background: "radial-gradient(circle, hsl(213 94% 68%), transparent 70%)" }}
        animate={{ scale: [1, 1.2, 1], x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full opacity-10"
        style={{ background: "radial-gradient(circle, hsl(217 91% 60%), transparent 70%)" }}
        animate={{ scale: [1.2, 1, 1.2], x: [0, -20, 0], y: [0, 30, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Floating tags */}
      {floatingTags.map((tag) => (
        <motion.div
          key={tag.label}
          className="absolute hidden rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary/70 backdrop-blur-sm md:block"
          style={{ left: tag.x, top: tag.y }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.5, scale: 1, y: [0, -8, 0] }}
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
            className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary backdrop-blur-sm"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>4,821 curated products · Verified by engineers</span>
          </motion.div>

          <motion.h1
            className="mb-5 font-display text-4xl font-bold tracking-tight text-foreground md:text-6xl md:leading-[1.1]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            Need code?{" "}
            <span className="relative inline-block">
              <span className="text-gradient">{displayText}</span>
              <motion.span
                className="ml-0.5 inline-block h-[0.9em] w-[3px] translate-y-[0.1em] rounded-full bg-primary align-middle"
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse" }}
              />
              <span className="absolute -bottom-1 left-0 h-[3px] w-full rounded-full bg-gradient-to-r from-primary via-primary-glow to-primary opacity-50" />
            </span>
          </motion.h1>

          <motion.p
            className="mb-10 text-base text-muted-foreground md:text-lg"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            Web templates, mobile apps, themes & graphics — buy or sell
            <br className="hidden sm:block" />
            on the safest and fastest digital platform.
          </motion.p>

          <motion.form
            onSubmit={handleSearch}
            className="relative mx-auto max-w-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <div className="group relative">
              <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-primary/30 via-primary-glow/15 to-primary/30 opacity-0 blur transition-opacity duration-500 group-focus-within:opacity-100" />
              <div className="relative flex items-center rounded-xl border border-border bg-card shadow-elevated">
                <Search className="ml-4 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="What are you looking for? e.g. Next.js multi-vendor..."
                  className="w-full bg-transparent py-4 pl-3 pr-4 text-[15px] text-foreground outline-none placeholder:text-muted-foreground"
                />
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mr-2 rounded-lg gradient-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow transition-shadow hover:shadow-lg"
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
            <span className="text-xs text-muted-foreground">Popular:</span>
            {["WordPress", "Next.js", "Flutter", "Tailwind", "Laravel"].map((tag, i) => (
              <motion.button
                key={tag}
                onClick={() => { setQuery(tag); navigate(`/products?q=${encodeURIComponent(tag)}`); }}
                className="rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-medium text-muted-foreground transition-all duration-300 hover:border-primary/50 hover:bg-primary/10 hover:text-primary"
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
