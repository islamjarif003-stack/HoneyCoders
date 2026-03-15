import Navbar from "@/components/marketplace/Navbar";
import HeroSection from "@/components/marketplace/HeroSection";
import CategoryGrid from "@/components/marketplace/CategoryGrid";
import FeaturedProducts from "@/components/marketplace/FeaturedProducts";
import Footer from "@/components/marketplace/Footer";

const Index = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <HeroSection />
    <CategoryGrid />
    <FeaturedProducts />
    <Footer />
  </div>
);

export default Index;
