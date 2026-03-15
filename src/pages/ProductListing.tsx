import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal, Grid3X3, List } from "lucide-react";
import Navbar from "@/components/marketplace/Navbar";
import Footer from "@/components/marketplace/Footer";
import ProductCard from "@/components/marketplace/ProductCard";
import { products, categories } from "@/data/mockData";
import { Button } from "@/components/ui/button";

const ProductListing = () => {
  const [searchParams] = useSearchParams();
  const categorySlug = searchParams.get("category");
  const query = searchParams.get("q")?.toLowerCase() || "";
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);

  const filtered = products.filter((p) => {
    const matchesCategory = !categorySlug || categories.find(c => c.slug === categorySlug)?.name === p.category;
    const matchesQuery = !query || p.title.toLowerCase().includes(query) || p.description.toLowerCase().includes(query) || p.tags.some(t => t.includes(query));
    const matchesPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
    return matchesCategory && matchesQuery && matchesPrice;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold">
              {categorySlug ? categories.find(c => c.slug === categorySlug)?.name || "Products" : query ? `Results for "${query}"` : "All Products"}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">{filtered.length} products found</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm"><SlidersHorizontal className="mr-1.5 h-3.5 w-3.5" />Filters</Button>
            <Button variant="ghost" size="icon"><Grid3X3 className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon"><List className="h-4 w-4" /></Button>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <aside className="hidden w-64 shrink-0 lg:block">
            <div className="sticky top-24 space-y-6">
              <div>
                <h3 className="mb-3 text-sm font-semibold">Categories</h3>
                <div className="space-y-1">
                  {categories.map((cat) => (
                    <a
                      key={cat.id}
                      href={`/products?category=${cat.slug}`}
                      className={`flex items-center justify-between rounded-md px-3 py-2 text-sm transition-colors ${
                        categorySlug === cat.slug
                          ? "bg-indigo-50 font-medium text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      <span>{cat.name}</span>
                      <span className="tabular-nums text-xs">{cat.count}</span>
                    </a>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="mb-3 text-sm font-semibold">Price Range</h3>
                <div className="flex items-center gap-2">
                  <input type="number" min={0} max={100} value={priceRange[0]} onChange={e => setPriceRange([+e.target.value, priceRange[1]])} className="w-20 rounded-md border border-border bg-surface px-2 py-1.5 text-sm" />
                  <span className="text-muted-foreground">—</span>
                  <input type="number" min={0} max={200} value={priceRange[1]} onChange={e => setPriceRange([priceRange[0], +e.target.value])} className="w-20 rounded-md border border-border bg-surface px-2 py-1.5 text-sm" />
                </div>
              </div>
              <div>
                <h3 className="mb-3 text-sm font-semibold">Rating</h3>
                {[4, 3, 2].map((r) => (
                  <label key={r} className="flex cursor-pointer items-center gap-2 py-1 text-sm text-muted-foreground hover:text-foreground">
                    <input type="checkbox" className="rounded border-border" />
                    {r}+ stars
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
            {filtered.length === 0 && (
              <div className="py-24 text-center">
                <p className="text-lg font-medium text-muted-foreground">No products found.</p>
                <p className="mt-1 text-sm text-muted-foreground">Try adjusting your filters or search query.</p>
              </div>
            )}
            {/* Pagination */}
            <div className="mt-10 flex items-center justify-center gap-2">
              {[1, 2, 3].map((p) => (
                <Button key={p} variant={p === 1 ? "default" : "outline"} size="sm" className="h-9 w-9 p-0 tabular-nums">
                  {p}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductListing;
