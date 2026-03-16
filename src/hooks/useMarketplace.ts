import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export type Product = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  price: number;
  category_id: string | null;
  vendor_id: string;
  status: string;
  featured: boolean | null;
  thumbnail_url: string | null;
  file_url: string | null;
  version: string | null;
  tags: string[] | null;
  sales_count: number | null;
  created_at: string;
  updated_at: string;
  categories?: { id: string; name: string; slug: string; icon: string | null; sort_order: number | null } | null;
  vendor_profile?: { display_name: string | null; avatar_url: string | null } | null;
  product_screenshots?: { id: string; url: string; sort_order: number | null }[];
};

export const useProducts = (filters?: { category?: string; query?: string; featured?: boolean }) => {
  return useQuery({
    queryKey: ["products", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.category) params.set("category", filters.category);
      if (filters?.query) params.set("q", filters.query);
      if (filters?.featured) params.set("featured", "true");
      const qs = params.toString();
      return api<Product[]>(`/products${qs ? `?${qs}` : ""}`);
    },
  });
};

export const useProduct = (slug: string) => {
  return useQuery({
    queryKey: ["product", slug],
    queryFn: () => api<Product>(`/products/${slug}`),
    enabled: !!slug,
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => api("/categories"),
  });
};

export const useReviews = (productId: string) => {
  return useQuery({
    queryKey: ["reviews", productId],
    queryFn: () => api(`/products/${productId}/reviews`),
    enabled: !!productId,
  });
};

export const useMyOrders = () => {
  return useQuery({
    queryKey: ["my-orders"],
    queryFn: () => api("/orders/mine"),
  });
};

export const useVendorProducts = () => {
  return useQuery({
    queryKey: ["vendor-products"],
    queryFn: () => api("/vendor/products"),
  });
};

export const useVendorOrders = () => {
  return useQuery({
    queryKey: ["vendor-orders"],
    queryFn: () => api("/vendor/orders"),
  });
};

export const useAdminProducts = () => {
  return useQuery({
    queryKey: ["admin-products"],
    queryFn: () => api("/admin/products"),
  });
};
