import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index.tsx";
import ProductListing from "./pages/ProductListing.tsx";
import ProductDetail from "./pages/ProductDetail.tsx";
import VendorDashboard from "./pages/VendorDashboard.tsx";
import AdminDashboard from "./pages/AdminDashboard.tsx";
import Checkout from "./pages/Checkout.tsx";
import UserLibrary from "./pages/UserLibrary.tsx";
import Auth from "./pages/Auth.tsx";
import VerifyEmail from "./pages/VerifyEmail.tsx";
import SitePage from "./pages/SitePage.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/products" element={<ProductListing />} />
            <Route path="/product/:slug" element={<ProductDetail />} />
            <Route path="/vendor" element={<VendorDashboard />} />
            <Route path="/vendor/*" element={<VendorDashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/*" element={<AdminDashboard />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/checkout/:productId" element={<Checkout />} />
            <Route path="/library" element={<UserLibrary />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/page/:slug" element={<SitePage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
