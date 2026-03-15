import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Product = Tables<"products"> & {
  categories?: Tables<"categories"> | null;
  vendor_profile?: Tables<"profiles"> | null;
  product_screenshots?: Tables<"product_screenshots">[];
};

export const useProducts = (filters?: { category?: string; query?: string; featured?: boolean }) => {
  return useQuery({
    queryKey: ["products", filters],
    queryFn: async () => {
      let q = supabase
        .from("products")
        .select("*, categories(*), product_screenshots(*)")
        .eq("status", "approved")
        .order("created_at", { ascending: false });

      if (filters?.category) {
        q = q.eq("categories.slug", filters.category);
      }
      if (filters?.query) {
        q = q.or(`title.ilike.%${filters.query}%,description.ilike.%${filters.query}%`);
      }
      if (filters?.featured) {
        q = q.eq("featured", true);
      }

      const { data, error } = await q;
      if (error) throw error;
      
      // Filter out products that don't match category join
      if (filters?.category) {
        return (data as unknown as Product[]).filter(p => p.categories?.slug === filters.category);
      }
      return data as unknown as Product[];
    },
  });
};

export const useProduct = (slug: string) => {
  return useQuery({
    queryKey: ["product", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*, categories(*), profiles!products_vendor_id_fkey(*), product_screenshots(*)")
        .eq("slug", slug)
        .single();
      if (error) throw error;
      return data as Product;
    },
    enabled: !!slug,
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("sort_order");
      if (error) throw error;
      return data;
    },
  });
};

export const useReviews = (productId: string) => {
  return useQuery({
    queryKey: ["reviews", productId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("*, profiles!reviews_user_id_fkey(display_name, avatar_url)")
        .eq("product_id", productId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!productId,
  });
};

export const useMyOrders = () => {
  return useQuery({
    queryKey: ["my-orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*, products(title, version, thumbnail_url, slug)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
};

export const useVendorProducts = () => {
  return useQuery({
    queryKey: ["vendor-products"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");
      const { data, error } = await supabase
        .from("products")
        .select("*, categories(*)")
        .eq("vendor_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
};

export const useVendorOrders = () => {
  return useQuery({
    queryKey: ["vendor-orders"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");
      // Get vendor's product ids first
      const { data: products } = await supabase
        .from("products")
        .select("id")
        .eq("vendor_id", user.id);
      if (!products?.length) return [];
      const productIds = products.map(p => p.id);
      const { data, error } = await supabase
        .from("orders")
        .select("*, products(title)")
        .in("product_id", productIds)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
};

export const useAdminProducts = () => {
  return useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*, categories(*), profiles!products_vendor_id_fkey(display_name)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
};
