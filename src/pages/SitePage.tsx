import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/marketplace/Navbar";
import Footer from "@/components/marketplace/Footer";
import { motion } from "framer-motion";

const SitePage = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: page, isLoading } = useQuery({
    queryKey: ["site-page", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_pages")
        .select("*")
        .eq("slug", slug!)
        .eq("is_published", true)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  const renderMarkdown = (content: string) => {
    return content
      .split("\n")
      .map((line, i) => {
        if (line.startsWith("### ")) return <h3 key={i} className="mt-6 mb-2 text-lg font-semibold">{line.slice(4)}</h3>;
        if (line.startsWith("## ")) return <h2 key={i} className="mt-8 mb-3 text-2xl font-bold">{line.slice(3)}</h2>;
        if (line.startsWith("- ")) return <li key={i} className="ml-4 text-muted-foreground">{line.slice(2)}</li>;
        if (line.startsWith("**") && line.endsWith("**")) return <p key={i} className="font-semibold text-foreground">{line.slice(2, -2)}</p>;
        if (line.trim() === "") return <br key={i} />;
        // Handle inline bold
        const parts = line.split(/(\*\*[^*]+\*\*)/g);
        return (
          <p key={i} className="text-muted-foreground leading-relaxed">
            {parts.map((part, j) =>
              part.startsWith("**") && part.endsWith("**")
                ? <strong key={j} className="text-foreground">{part.slice(2, -2)}</strong>
                : part
            )}
          </p>
        );
      });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container max-w-3xl py-16 md:py-24">
        {isLoading ? (
          <div className="space-y-4">
            <div className="h-10 w-64 animate-pulse rounded-lg bg-muted shimmer" />
            <div className="h-4 w-full animate-pulse rounded bg-muted shimmer" />
            <div className="h-4 w-3/4 animate-pulse rounded bg-muted shimmer" />
          </div>
        ) : page ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="mb-8 font-display text-3xl font-bold md:text-4xl">{page.title}</h1>
            <div className="prose-dark space-y-1">
              {renderMarkdown(page.content)}
            </div>
          </motion.div>
        ) : (
          <div className="text-center py-20">
            <h1 className="text-2xl font-bold">Page not found</h1>
            <p className="mt-2 text-muted-foreground">The page you're looking for doesn't exist.</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default SitePage;
