import { useParams, Link, useNavigate } from "react-router-dom";
import { Star, Download, ShieldCheck, ArrowLeft, Heart, Share2, Sparkles, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Navbar from "@/components/marketplace/Navbar";
import Footer from "@/components/marketplace/Footer";
import { useProduct, useReviews } from "@/hooks/useMarketplace";
import { useAuth } from "@/contexts/AuthContext";
import { products as mockProducts } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { api } from "@/lib/api";

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: dbProduct, isLoading } = useProduct(slug || "");
  const [selectedImage, setSelectedImage] = useState(0);

  const mockProduct = mockProducts.find(p => p.slug === slug);
  const product = dbProduct || mockProduct;
  const isDbProduct = !!dbProduct;
  const { data: reviews } = useReviews(dbProduct?.id || "");

  const screenshots = isDbProduct
    ? (dbProduct.product_screenshots?.map(s => s.url) || [dbProduct.thumbnail_url].filter(Boolean))
    : (mockProduct?.screenshots || []);

  const handleBuy = () => {
    if (!user) { toast.error("Please sign in to purchase"); navigate("/auth"); return; }
    navigate(`/checkout/${isDbProduct ? dbProduct.id : ""}`);
  };

  const handleWishlist = async () => {
    if (!user) { toast.error("Please sign in"); navigate("/auth"); return; }
    if (isDbProduct) {
      try {
        await api("/wishlists", { method: "POST", body: { product_id: dbProduct.id } });
        toast.success("Added to wishlist!");
      } catch (err: any) {
        if (err.message?.includes("duplicate") || err.message?.includes("already")) {
          toast.info("Already in wishlist");
        } else {
          toast.error("Failed");
        }
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-8">
          <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
            <div className="h-96 animate-pulse rounded-xl bg-muted shimmer" />
            <div className="h-80 animate-pulse rounded-xl bg-muted shimmer" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-24 text-center">
          <h1 className="text-2xl font-bold">Product not found</h1>
          <Link to="/products" className="mt-4 inline-block text-primary hover:underline">Back to products</Link>
        </div>
      </div>
    );
  }

  const title = product.title;
  const description = product.description || "";
  const price = product.price;
  const version = isDbProduct ? dbProduct.version : mockProduct?.version;
  const lastUpdated = isDbProduct ? new Date(dbProduct.updated_at).toLocaleDateString() : mockProduct?.lastUpdated;
  const category = isDbProduct ? dbProduct.categories?.name : mockProduct?.category;
  const vendorName = isDbProduct ? "Vendor" : mockProduct?.vendor?.name;
  const tags = isDbProduct ? (dbProduct.tags || []) : (mockProduct?.tags || []);
  const rating = isDbProduct ? 0 : (mockProduct?.rating || 0);
  const reviewCount = isDbProduct ? (reviews?.length || 0) : (mockProduct?.reviewCount || 0);
  const salesCount = isDbProduct ? (dbProduct.sales_count || 0) : (mockProduct?.salesCount || 0);
  const thumbnail = isDbProduct ? dbProduct.thumbnail_url : mockProduct?.thumbnail;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-8">
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
          <Link to="/products" className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground group">
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" /> Back to products
          </Link>
        </motion.div>

        <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="overflow-hidden rounded-xl border border-border shadow-elevated">
              <div className="relative aspect-[16/10]">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={selectedImage}
                    src={screenshots[selectedImage] || thumbnail || "/placeholder.svg"}
                    alt={title}
                    className="h-full w-full object-cover"
                    initial={{ opacity: 0, scale: 1.02 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </AnimatePresence>
                <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-foreground/5" />
              </div>
            </div>
            {screenshots.length > 1 && (
              <div className="mt-4 flex gap-3">
                {screenshots.map((ss, i) => (
                  <motion.button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`overflow-hidden rounded-lg border-2 transition-all duration-300 ${i === selectedImage ? "border-primary shadow-glow" : "border-border hover:border-primary/30"}`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <img src={ss} alt="" className="h-16 w-24 object-cover" />
                  </motion.button>
                ))}
              </div>
            )}

            <motion.div className="mt-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
              <h2 className="mb-4 font-display text-lg font-semibold">Description</h2>
              <p className="text-[15px] leading-relaxed text-muted-foreground">{description}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <motion.span
                    key={tag}
                    className="rounded-full border border-border bg-muted/50 px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-primary/30 hover:text-primary"
                    whileHover={{ scale: 1.05 }}
                  >
                    {tag}
                  </motion.span>
                ))}
              </div>
            </motion.div>

            <div className="mt-10">
              <h2 className="mb-4 font-display text-lg font-semibold">Reviews ({reviewCount})</h2>
              <div className="space-y-4">
                {reviews?.map((review: any, i: number) => (
                  <motion.div
                    key={review.id}
                    className="rounded-xl border border-border bg-card p-5 shadow-ink"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full gradient-primary text-xs font-bold text-primary-foreground">
                          {(review.profiles?.display_name || "U")[0].toUpperCase()}
                        </div>
                        <span className="text-sm font-medium">{review.profiles?.display_name || "User"}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{new Date(review.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="mt-2 flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Star key={j} className={`h-3.5 w-3.5 ${j < review.rating ? "fill-amber-400 text-amber-400" : "text-border"}`} />
                      ))}
                    </div>
                    {review.comment && <p className="mt-2 text-sm text-muted-foreground">{review.comment}</p>}
                  </motion.div>
                ))}
                {(!reviews || reviews.length === 0) && !isDbProduct && (
                  <>
                    {[
                      { name: "Alex M.", rating: 5, comment: "Excellent quality, saved me weeks of development time.", date: "Mar 8, 2026" },
                      { name: "Sarah K.", rating: 4, comment: "Great components. Minor issues with dark mode but vendor fixed quickly.", date: "Feb 22, 2026" },
                    ].map((review, i) => (
                      <motion.div
                        key={i}
                        className="rounded-xl border border-border bg-card p-5 shadow-ink"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full gradient-primary text-xs font-bold text-primary-foreground">{review.name[0]}</div>
                            <span className="text-sm font-medium">{review.name}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">{review.date}</span>
                        </div>
                        <div className="mt-2 flex gap-0.5">
                          {Array.from({ length: 5 }).map((_, j) => (
                            <Star key={j} className={`h-3.5 w-3.5 ${j < review.rating ? "fill-amber-400 text-amber-400" : "text-border"}`} />
                          ))}
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground">{review.comment}</p>
                      </motion.div>
                    ))}
                  </>
                )}
              </div>
            </div>
          </motion.div>

          <div>
            <motion.div
              className="sticky top-24 space-y-5"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="rounded-2xl border border-border bg-card p-6 shadow-elevated gradient-border">
                <h1 className="font-display text-xl font-bold">{title}</h1>
                <div className="mt-2.5 flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-medium tabular-nums">{rating || "—"}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">({reviewCount} reviews)</span>
                  <span className="text-xs text-muted-foreground">·</span>
                  <span className="text-xs tabular-nums text-muted-foreground">{Number(salesCount).toLocaleString()} sales</span>
                </div>
                <div className="mt-6">
                  <span className="text-3xl font-bold tabular-nums text-[#1F403A]">${price}</span>
                </div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button size="lg" onClick={handleBuy} className="mt-5 w-full bg-[#10b981] hover:bg-[#059669] text-white shadow-[0_4px_14px_0_rgba(16,185,129,0.39)] transition-all hover:shadow-lg text-base">
                    <Sparkles className="mr-2 h-4 w-4" /> Buy Now
                  </Button>
                </motion.div>
                <div className="mt-3 flex gap-2">
                  <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button variant="outline" className="w-full hover:bg-[#2D7A5F] hover:text-white hover:border-[#2D7A5F] active:bg-[#236B50] transition-all" onClick={handleWishlist}>
                      <Heart className="mr-1.5 h-4 w-4" />Wishlist
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button variant="outline" size="icon" className="hover:border-primary/30"><Share2 className="h-4 w-4" /></Button>
                  </motion.div>
                </div>
                <div className="mt-6 space-y-3 border-t border-border pt-6">
                  {[
                    { icon: ShieldCheck, text: "Secure checkout with SSL" },
                    { icon: Download, text: "Instant download after purchase" },
                    { icon: CheckCircle2, text: "Lifetime updates included" },
                  ].map(({ icon: Icon, text }) => (
                    <div key={text} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                      <Icon className="h-4 w-4 text-primary" />{text}
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-xl border border-border bg-card p-5 shadow-ink">
                <h3 className="mb-3 text-sm font-semibold">Product Info</h3>
                <dl className="space-y-2.5 text-sm">
                  {[
                    { label: "Version", value: version },
                    { label: "Updated", value: lastUpdated },
                    { label: "Category", value: category },
                    { label: "Vendor", value: vendorName, isPrimary: true },
                  ].map(({ label, value, isPrimary }) => (
                    <div key={label} className="flex justify-between">
                      <dt className="text-muted-foreground">{label}</dt>
                      <dd className={`font-medium tabular-nums ${isPrimary ? "text-primary" : ""}`}>{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetail;
