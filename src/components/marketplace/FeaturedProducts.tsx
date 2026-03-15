import ProductCard from "./ProductCard";
import { useProducts } from "@/hooks/useMarketplace";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { products as mockProducts } from "@/data/mockData";

const FeaturedProducts = () => {
  const { data: dbProducts, isLoading } = useProducts({ featured: true });

  // Fall back to mock data if DB is empty
  const featured = dbProducts?.length ? dbProducts : mockProducts.filter(p => p.featured);

  return (
    <section className="py-16">
      <div className="container">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold">Featured Products</h2>
          <Link to="/products" className="flex items-center gap-1 text-sm font-medium text-primary hover:underline">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-72 animate-pulse rounded-lg bg-muted" />
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
