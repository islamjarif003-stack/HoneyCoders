import { Star, Eye, TrendingUp, Sparkles } from "lucide-react";
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
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="group h-full"
    >
      <Link to={`/product/${product.slug}`} className="block h-full outline-none">
        <div className="card hover-lift h-full flex flex-col p-2">
          
          {/* Inner Image Container */ }
          <div className="relative aspect-[16/10] overflow-hidden rounded-[14px] bg-white ring-1 ring-black/5">
            <motion.img
              src={thumbnail}
              alt={product.title}
              className="h-full w-full object-cover"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
            {/* Soft inset shadow for lighting */}
            <div className="pointer-events-none absolute inset-0 rounded-[14px] shadow-[inset_0_2px_10px_rgba(0,0,0,0.05)]" />
            
            {/* Hover overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-transparent transition-all duration-400 group-hover:bg-[#1F403A]/10 backdrop-blur-[2px] opacity-0 group-hover:opacity-100">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 rounded-full bg-white/95 px-6 py-3 text-[14px] font-bold text-[#1F403A] shadow-elevated border border-white"
              >
                <Eye className="h-4 w-4 text-[#2D7A5F]" /> Quick View
              </motion.div>
            </div>
            
            {/* Featured badge */}
            {product.featured && (
              <motion.span
                className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-white/90 backdrop-blur-md border border-white px-3 py-1.5 text-[11px] font-bold text-[#1F403A] shadow-sm transform-gpu transition-all hover:scale-105"
              >
                <Star className="h-3 w-3 fill-amber-500 text-amber-500" /> Featured
              </motion.span>
            )}
            
            {/* Sales count */}
            {salesCount > 0 && (
              <span className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1.5 text-[11px] font-bold text-[#1F403A] backdrop-blur-md shadow-sm border border-white">
                <TrendingUp className="h-3 w-3 text-[#2D7A5F]" />
                {Number(salesCount).toLocaleString()}
              </span>
            )}
          </div>

          {/* Content Area */}
          <div className="flex flex-1 flex-col px-4 pt-5 pb-3">
            {category && (
              <div className="mb-3">
                <span className="inline-flex items-center rounded-md bg-[#6A7B75]/10 px-2.5 py-1 text-[11px] font-bold tracking-widest uppercase text-[#6A7B75]">
                  {category}
                </span>
              </div>
            )}

            <h3 className="mb-2 line-clamp-1 text-[17px] font-extrabold text-[#1F403A] transition-colors duration-200 group-hover:text-[#10b981] leading-tight" style={{ fontFamily: 'Poppins, sans-serif' }}>
              {product.title}
            </h3>
            
            <p className="mb-6 line-clamp-2 text-[14px] leading-[1.6] text-[#6A7B75] flex-1 font-medium">
              {product.description}
            </p>

            <div className="flex items-end justify-between">
              <div>
                <div className="flex gap-0.5 mb-1">
                  {[1, 2, 3, 4, 5].map(s => (
                    <Star
                      key={s}
                      className={`h-[15px] w-[15px] ${s <= rating ? "fill-amber-400 text-amber-400" : "fill-[#E8E2D7] text-[#E8E2D7]"}`}
                    />
                  ))}
                </div>
                {reviewCount > 0 && (
                  <span className="text-[12px] font-semibold text-[#6A7B75]">({reviewCount} reviews)</span>
                )}
              </div>
              
              <motion.span
                className="bg-[#10b981] text-white shadow-[0_4px_14px_0_rgba(16,185,129,0.39)] transition-colors hover:bg-[#059669] rounded-lg px-5 py-2 text-[16px] font-black tracking-tight"
                whileHover={{ scale: 1.05 }}
              >
                ${product.price}
              </motion.span>
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-black/5 pt-4 text-[13px] font-bold text-[#B9AC9B]">
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 rounded-full bg-[#1F403A]/10 flex items-center justify-center text-[10px] text-[#1F403A]">
                  {vendorName.charAt(0)}
                </div>
                <span className="truncate text-[#1F403A]">{vendorName}</span>
              </div>
              <span className="text-[#6A7B75]">{Number(salesCount).toLocaleString()} sales</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
