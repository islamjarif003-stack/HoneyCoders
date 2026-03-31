import { Code2, Palette, LayoutDashboard, Monitor, Settings, Smartphone, Image, Server, LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useCategories } from "@/hooks/useMarketplace";

const iconMap: Record<string, LucideIcon> = {
  Code2, Palette, LayoutDashboard, Monitor, Settings, Smartphone, Image, Server,
};

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 16, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const CategoryGrid = () => {
  const { data: categories, isLoading } = useCategories();

  if (isLoading) {
    return (
      <section className="py-20">
        <div className="container">
          <div className="mb-10 text-center">
            <h2 className="font-display text-2xl font-bold">Browse by Category</h2>
            <p className="mt-2 text-sm text-muted-foreground">Find the perfect starting point for your next project</p>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-24 animate-pulse rounded-xl bg-muted shimmer" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-20">
      <div className="container">
        <motion.div
          className="mb-10 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-display text-2xl font-bold md:text-3xl">Browse by Category</h2>
          <p className="mt-2 text-sm text-muted-foreground">Find the perfect starting point for your next project</p>
        </motion.div>
        <motion.div
          className="grid grid-cols-2 gap-4 sm:grid-cols-3"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
        >
          {categories?.slice(0, 6).map((cat) => {
            const Icon = iconMap[cat.icon || "Code2"] || Code2;
            return (
              <motion.div key={cat.id} variants={item}>
                <Link
                  to={`/products?category=${cat.slug}`}
                  className="card group relative flex items-center gap-4 overflow-hidden p-5 transition-all duration-300 hover:shadow-elevated hover:border-[#2D7A5F]/20 hover:-translate-y-1"
                >
                  {/* Hover gradient bg */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#2D7A5F]/0 to-[#2D7A5F]/0 transition-all duration-500 group-hover:from-[#2D7A5F]/5 group-hover:to-transparent" />
                  <motion.div
                    className="relative flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-xl bg-white/60 text-[#1F403A] border border-black/5 shadow-sm transition-all duration-300 group-hover:bg-[#2D7A5F] group-hover:text-white group-hover:shadow-glow group-hover:border-[#2D7A5F]"
                    whileHover={{ rotate: 5, scale: 1.05 }}
                  >
                    <Icon className="h-5 w-5" />
                  </motion.div>
                  <div className="relative">
                    <p className="text-[15px] font-bold text-[#1F403A] group-hover:text-[#2D7A5F] transition-colors" style={{ fontFamily: 'Poppins, sans-serif' }}>{cat.name}</p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default CategoryGrid;
