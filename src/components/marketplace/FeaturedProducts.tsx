import ProductCard from "./ProductCard";
import { useProducts } from "@/hooks/useMarketplace";
import { Link } from "react-router-dom";
import { ArrowRight, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { products as mockProducts } from "@/data/mockData";

const FeaturedProducts = () => {
  const { data: dbProducts, isLoading } = useProducts({});
  const featured = dbProducts?.length ? dbProducts.slice(0, 12) : mockProducts.slice(0, 12);

  return (
    <section className="relative py-20">
      {/* Subtle background accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent" />

      <div className="container relative">
        <motion.div
          className="mb-10 flex items-center justify-between"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-primary/8 px-3 py-1 text-xs font-medium text-primary">
              <Zap className="h-3 w-3" /> Hand-picked
            </div>
            <h2 className="font-display text-2xl font-extrabold md:text-3xl text-[#1F403A]" style={{ fontFamily: 'Poppins, sans-serif' }}>Products</h2>
            <p className="mt-1 text-sm text-muted-foreground">Curated by our engineering team</p>
          </div>
          <Link to="/products" className="group flex items-center gap-1.5 text-sm font-medium text-primary transition-all hover:gap-2.5">
            View all <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>

        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-80 animate-pulse rounded-xl bg-muted shimmer" />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;
