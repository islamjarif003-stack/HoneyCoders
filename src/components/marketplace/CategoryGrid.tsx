import { Code2, Palette, LayoutDashboard, Monitor, Settings, Smartphone, Image, Server, LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useCategories } from "@/hooks/useMarketplace";

const iconMap: Record<string, LucideIcon> = {
  Code2, Palette, LayoutDashboard, Monitor, Settings, Smartphone, Image, Server,
};

const CategoryGrid = () => {
  const { data: categories, isLoading } = useCategories();

  if (isLoading) {
    return (
      <section className="py-16">
        <div className="container">
          <h2 className="mb-8 font-display text-xl font-semibold">Browse by Category</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-20 animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16">
      <div className="container">
        <h2 className="mb-8 font-display text-xl font-semibold">Browse by Category</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {categories?.map((cat, i) => {
            const Icon = iconMap[cat.icon || "Code2"] || Code2;
            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
              >
                <Link
                  to={`/products?category=${cat.slug}`}
                  className="group flex items-center gap-3 rounded-lg border border-border bg-card p-4 shadow-ink transition-all hover:shadow-soft"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-indigo-50 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-card-foreground">{cat.name}</p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
