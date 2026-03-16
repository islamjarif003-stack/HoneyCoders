import Navbar from "@/components/marketplace/Navbar";
import HeroSection from "@/components/marketplace/HeroSection";
import TechMarquee from "@/components/marketplace/TechMarquee";
import CategoryGrid from "@/components/marketplace/CategoryGrid";
import FeaturedProducts from "@/components/marketplace/FeaturedProducts";
import FeatureCards from "@/components/marketplace/FeatureCards";
import VendorCTA from "@/components/marketplace/VendorCTA";
import Footer from "@/components/marketplace/Footer";

const Index = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <HeroSection />
    <TechMarquee />
    <CategoryGrid />
    <FeaturedProducts />
    <FeatureCards />
    <VendorCTA />
    <Footer />
  </div>
);

export default Index;
