import { Star } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import type { Product } from "@/data/mockData";

interface ProductCardProps {
  product: Product;
  index?: number;
}

const ProductCard = ({ product, index = 0 }: ProductCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
      whileTap={{ scale: 0.98 }}
    >
      <Link to={`/product/${product.slug}`} className="group block">
        <div className="overflow-hidden rounded-lg border border-border bg-card shadow-ink transition-shadow duration-200 hover:shadow-premium">
          {/* Thumbnail */}
          <div className="relative aspect-[16/10] overflow-hidden">
            <img
              src={product.thumbnail}
              alt={product.title}
              className="h-full w-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
            />
            <div className="pointer-events-none absolute inset-0 rounded-t-lg ring-1 ring-inset ring-foreground/5" />
            {product.featured && (
              <span className="absolute left-3 top-3 rounded-full bg-primary px-2.5 py-0.5 text-xs font-semibold text-primary-foreground">
                Featured
              </span>
            )}
          </div>

          {/* Content */}
          <div className="p-4">
            <div className="mb-1 flex items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground">{product.category}</span>
            </div>
            <h3 className="mb-2 line-clamp-1 text-[15px] font-semibold text-card-foreground">
              {product.title}
            </h3>
            <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
              {product.description}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span className="text-sm font-medium tabular-nums">{product.rating}</span>
                <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
              </div>
              <span className="rounded-full bg-primary px-3 py-1 text-sm font-bold text-primary-foreground">
                ${product.price}
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
              <span>{product.vendor.name}</span>
              <span className="tabular-nums">{product.salesCount.toLocaleString()} sales</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
