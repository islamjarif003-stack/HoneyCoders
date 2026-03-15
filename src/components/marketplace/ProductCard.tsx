import { Star } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface ProductCardProduct {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  price: number;
  category?: string;
  categories?: { name: string } | null;
  rating?: number;
  reviewCount?: number;
  salesCount?: number;
  sales_count?: number | null;
  vendor?: { name: string };
  thumbnail?: string;
  thumbnail_url?: string | null;
  featured?: boolean | null;
}

interface ProductCardProps {
  product: ProductCardProduct;
  index?: number;
}

const ProductCard = ({ product, index = 0 }: ProductCardProps) => {
  const thumbnail = product.thumbnail_url || product.thumbnail || "/placeholder.svg";
  const category = product.categories?.name || product.category || "";
  const rating = product.rating || 0;
  const reviewCount = product.reviewCount || 0;
  const salesCount = product.sales_count || product.salesCount || 0;
  const vendorName = product.vendor?.name || "Vendor";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
      whileTap={{ scale: 0.98 }}
    >
      <Link to={`/product/${product.slug}`} className="group block">
        <div className="overflow-hidden rounded-lg border border-border bg-card shadow-ink transition-shadow duration-200 hover:shadow-premium">
          <div className="relative aspect-[16/10] overflow-hidden">
            <img src={thumbnail} alt={product.title} className="h-full w-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105" />
            <div className="pointer-events-none absolute inset-0 rounded-t-lg ring-1 ring-inset ring-foreground/5" />
            {product.featured && (
              <span className="absolute left-3 top-3 rounded-full bg-primary px-2.5 py-0.5 text-xs font-semibold text-primary-foreground">Featured</span>
            )}
          </div>
          <div className="p-4">
            <div className="mb-1"><span className="text-xs font-medium text-muted-foreground">{category}</span></div>
            <h3 className="mb-2 line-clamp-1 text-[15px] font-semibold text-card-foreground">{product.title}</h3>
            <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">{product.description}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span className="text-sm font-medium tabular-nums">{rating || "—"}</span>
                {reviewCount > 0 && <span className="text-xs text-muted-foreground">({reviewCount})</span>}
              </div>
              <span className="rounded-full bg-primary px-3 py-1 text-sm font-bold text-primary-foreground">${product.price}</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
              <span>{vendorName}</span>
              <span className="tabular-nums">{Number(salesCount).toLocaleString()} sales</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
