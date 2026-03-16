import { Star, Eye } from "lucide-react";
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -6 }}
      className="group"
    >
      <Link to={`/product/${product.slug}`} className="block">
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-ink transition-all duration-500 group-hover:shadow-elevated group-hover:border-primary/20">
          <div className="relative aspect-[16/10] overflow-hidden">
            <motion.img
              src={thumbnail}
              alt={product.title}
              className="h-full w-full object-cover"
              whileHover={{ scale: 1.08 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            />
            {/* Hover overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-foreground/0 transition-all duration-500 group-hover:bg-foreground/30">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileHover={{ opacity: 1, scale: 1 }}
                className="opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              >
                <div className="flex items-center gap-2 rounded-full bg-surface/90 px-4 py-2 text-sm font-medium text-foreground shadow-elevated backdrop-blur-sm">
                  <Eye className="h-4 w-4" /> Preview
                </div>
              </motion.div>
            </div>
            <div className="pointer-events-none absolute inset-0 rounded-t-xl ring-1 ring-inset ring-foreground/5" />
            {product.featured && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.08 + 0.3 }}
                className="absolute left-3 top-3 rounded-full gradient-primary px-3 py-1 text-xs font-semibold text-primary-foreground shadow-glow"
              >
                ✨ Featured
              </motion.span>
            )}
          </div>
          <div className="p-4">
            <div className="mb-1.5">
              <span className="rounded-full bg-primary/8 px-2 py-0.5 text-[11px] font-medium tracking-wide uppercase text-primary">{category}</span>
            </div>
            <h3 className="mb-1.5 line-clamp-1 text-[15px] font-semibold text-card-foreground transition-colors group-hover:text-primary">{product.title}</h3>
            <p className="mb-3 line-clamp-2 text-[13px] leading-relaxed text-muted-foreground">{product.description}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map(s => (
                    <Star key={s} className={`h-3 w-3 ${s <= (rating || 0) ? "fill-amber-400 text-amber-400" : "text-border"}`} />
                  ))}
                </div>
                {reviewCount > 0 && <span className="text-[11px] text-muted-foreground">({reviewCount})</span>}
              </div>
              <motion.span
                className="rounded-lg gradient-primary px-3 py-1 text-sm font-bold text-primary-foreground shadow-sm"
                whileHover={{ scale: 1.05 }}
              >
                ${product.price}
              </motion.span>
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-border pt-3 text-[11px] text-muted-foreground">
              <span className="font-medium">{vendorName}</span>
              <span className="tabular-nums">{Number(salesCount).toLocaleString()} sales</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
