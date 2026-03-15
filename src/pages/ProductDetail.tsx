import { useParams, Link, useNavigate } from "react-router-dom";
import { Star, Download, ShieldCheck, ArrowLeft, Heart, Share2 } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import Navbar from "@/components/marketplace/Navbar";
import Footer from "@/components/marketplace/Footer";
import { useProduct, useReviews } from "@/hooks/useMarketplace";
import { useAuth } from "@/contexts/AuthContext";
import { products as mockProducts } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: dbProduct, isLoading } = useProduct(slug || "");
  const [selectedImage, setSelectedImage] = useState(0);

  // Fallback to mock data
  const mockProduct = mockProducts.find(p => p.slug === slug);
  const product = dbProduct || mockProduct;
  const isDbProduct = !!dbProduct;

  const { data: reviews } = useReviews(dbProduct?.id || "");

  const screenshots = isDbProduct
    ? (dbProduct.product_screenshots?.map(s => s.url) || [dbProduct.thumbnail_url].filter(Boolean))
    : (mockProduct?.screenshots || []);

  const handleBuy = () => {
    if (!user) {
      toast.error("Please sign in to purchase");
      navigate("/auth");
      return;
    }
    navigate(`/checkout/${isDbProduct ? dbProduct.id : ""}`);
  };

  const handleWishlist = async () => {
    if (!user) {
      toast.error("Please sign in to add to wishlist");
      navigate("/auth");
      return;
    }
    if (isDbProduct) {
      const { error } = await supabase.from("wishlists").insert({ user_id: user.id, product_id: dbProduct.id });
      if (error?.code === "23505") toast.info("Already in your wishlist");
      else if (error) toast.error("Failed to add to wishlist");
      else toast.success("Added to wishlist!");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-8">
          <div className="h-96 animate-pulse rounded-lg bg-muted" />
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
        <Link to="/products" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to products
        </Link>

        <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
            <div className="overflow-hidden rounded-lg border border-border shadow-ink">
              <div className="relative aspect-[16/10]">
                <img src={screenshots[selectedImage] || thumbnail || "/placeholder.svg"} alt={title} className="h-full w-full object-cover" />
                <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-foreground/5" />
              </div>
            </div>
            {screenshots.length > 1 && (
              <div className="mt-4 flex gap-3">
                {screenshots.map((ss, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`overflow-hidden rounded-md border-2 transition-colors ${i === selectedImage ? "border-primary" : "border-border"}`}
                  >
                    <img src={ss} alt="" className="h-16 w-24 object-cover" />
                  </button>
                ))}
              </div>
            )}

            <div className="mt-10">
              <h2 className="mb-4 font-display text-lg font-semibold">Description</h2>
              <p className="text-[15px] leading-relaxed text-muted-foreground">{description}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">{tag}</span>
                ))}
              </div>
            </div>

            <div className="mt-10">
              <h2 className="mb-4 font-display text-lg font-semibold">Reviews ({reviewCount})</h2>
              <div className="space-y-4">
                {reviews?.map((review) => (
                  <div key={review.id} className="rounded-lg border border-border bg-card p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{(review as any).profiles?.display_name || "User"}</span>
                      <span className="text-xs text-muted-foreground">{new Date(review.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="mt-2 flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Star key={j} className={`h-3.5 w-3.5 ${j < review.rating ? "fill-amber-400 text-amber-400" : "text-border"}`} />
                      ))}
                    </div>
                    {review.comment && <p className="mt-2 text-sm text-muted-foreground">{review.comment}</p>}
                  </div>
                ))}
                {(!reviews || reviews.length === 0) && !isDbProduct && (
                  <>
                    {[
                      { name: "Alex M.", rating: 5, comment: "Excellent quality, saved me weeks of development time.", date: "Mar 8, 2026" },
                      { name: "Sarah K.", rating: 4, comment: "Great components. Minor issues with dark mode but vendor fixed quickly.", date: "Feb 22, 2026" },
                    ].map((review, i) => (
                      <div key={i} className="rounded-lg border border-border bg-card p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-50 text-sm font-semibold text-primary">{review.name[0]}</div>
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
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          </motion.div>

          <div>
            <div className="sticky top-24 space-y-6">
              <div className="rounded-lg border border-border bg-card p-6 shadow-soft">
                <h1 className="font-display text-xl font-bold">{title}</h1>
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-medium tabular-nums">{rating || "—"}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">({reviewCount} reviews)</span>
                  <span className="text-xs text-muted-foreground">·</span>
                  <span className="text-xs tabular-nums text-muted-foreground">{Number(salesCount).toLocaleString()} sales</span>
                </div>
                <div className="mt-6 text-3xl font-bold tabular-nums">${price}</div>
                <Button size="lg" onClick={handleBuy} className="mt-4 w-full bg-primary text-primary-foreground hover:bg-indigo-700">Buy Now</Button>
                <div className="mt-3 flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={handleWishlist}><Heart className="mr-1.5 h-4 w-4" />Wishlist</Button>
                  <Button variant="outline" size="icon"><Share2 className="h-4 w-4" /></Button>
                </div>
                <div className="mt-6 space-y-3 border-t border-border pt-6">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground"><ShieldCheck className="h-4 w-4 text-primary" />Secure checkout with SSL</div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground"><Download className="h-4 w-4 text-primary" />Instant download after purchase</div>
                </div>
              </div>
              <div className="rounded-lg border border-border bg-card p-4">
                <h3 className="mb-3 text-sm font-semibold">Product Info</h3>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between"><dt className="text-muted-foreground">Version</dt><dd className="tabular-nums font-medium">{version}</dd></div>
                  <div className="flex justify-between"><dt className="text-muted-foreground">Updated</dt><dd className="font-medium">{lastUpdated}</dd></div>
                  <div className="flex justify-between"><dt className="text-muted-foreground">Category</dt><dd className="font-medium">{category}</dd></div>
                  <div className="flex justify-between"><dt className="text-muted-foreground">Vendor</dt><dd className="font-medium text-primary">{vendorName}</dd></div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetail;
