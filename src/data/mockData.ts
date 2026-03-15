export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  category: string;
  tags: string[];
  rating: number;
  reviewCount: number;
  salesCount: number;
  vendor: { name: string; avatar: string };
  thumbnail: string;
  screenshots: string[];
  version: string;
  lastUpdated: string;
  featured: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  count: number;
  icon: string;
}

export const categories: Category[] = [
  { id: "1", name: "React Templates", slug: "react-templates", count: 842, icon: "Code2" },
  { id: "2", name: "UI Kits", slug: "ui-kits", count: 534, icon: "Palette" },
  { id: "3", name: "Dashboard Themes", slug: "dashboard-themes", count: 391, icon: "LayoutDashboard" },
  { id: "4", name: "Landing Pages", slug: "landing-pages", count: 267, icon: "Monitor" },
  { id: "5", name: "Admin Panels", slug: "admin-panels", count: 198, icon: "Settings" },
  { id: "6", name: "Mobile Kits", slug: "mobile-kits", count: 156, icon: "Smartphone" },
  { id: "7", name: "Icons & Graphics", slug: "icons-graphics", count: 723, icon: "Image" },
  { id: "8", name: "Backend Modules", slug: "backend-modules", count: 312, icon: "Server" },
];

const thumbnails = [
  "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=375&fit=crop",
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=375&fit=crop",
  "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=600&h=375&fit=crop",
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=375&fit=crop",
  "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&h=375&fit=crop",
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=375&fit=crop",
];

export const products: Product[] = [
  {
    id: "1", title: "Horizon React Dashboard Pro", slug: "horizon-react-dashboard",
    description: "A premium React admin dashboard with 200+ components, dark mode, and Tailwind CSS. Built with TypeScript and optimized for performance.",
    price: 49, category: "Dashboard Themes", tags: ["react", "tailwind", "typescript", "dashboard"],
    rating: 4.8, reviewCount: 234, salesCount: 1847, featured: true,
    vendor: { name: "DevCraft Studio", avatar: "" }, thumbnail: thumbnails[0],
    screenshots: thumbnails.slice(0, 4), version: "3.2.0", lastUpdated: "2026-03-10",
  },
  {
    id: "2", title: "Starter UI Kit — Tailwind Components", slug: "starter-ui-kit",
    description: "450+ handcrafted UI components built with Tailwind CSS. Copy-paste ready for your next project.",
    price: 39, category: "UI Kits", tags: ["tailwind", "components", "ui-kit"],
    rating: 4.9, reviewCount: 412, salesCount: 3201, featured: true,
    vendor: { name: "Pixel Labs", avatar: "" }, thumbnail: thumbnails[1],
    screenshots: thumbnails.slice(1, 5), version: "2.1.0", lastUpdated: "2026-03-08",
  },
  {
    id: "3", title: "SaaSify — Landing Page Template", slug: "saasify-landing",
    description: "High-converting SaaS landing page template with animations, pricing tables, and testimonial sections.",
    price: 29, category: "Landing Pages", tags: ["landing-page", "saas", "framer-motion"],
    rating: 4.7, reviewCount: 189, salesCount: 982, featured: true,
    vendor: { name: "LaunchKit", avatar: "" }, thumbnail: thumbnails[2],
    screenshots: thumbnails.slice(2, 5), version: "1.5.0", lastUpdated: "2026-02-28",
  },
  {
    id: "4", title: "NexAdmin — Enterprise Admin Panel", slug: "nexadmin-enterprise",
    description: "Enterprise-grade admin panel with RBAC, data tables, charts, and form builders. Supports multi-tenancy.",
    price: 79, category: "Admin Panels", tags: ["admin", "enterprise", "rbac"],
    rating: 4.6, reviewCount: 97, salesCount: 543, featured: false,
    vendor: { name: "CodeForge", avatar: "" }, thumbnail: thumbnails[3],
    screenshots: thumbnails.slice(0, 4), version: "4.0.1", lastUpdated: "2026-03-12",
  },
  {
    id: "5", title: "Flavour — Restaurant React Template", slug: "flavour-restaurant",
    description: "Beautiful restaurant template with menu builder, reservation system, and online ordering integration.",
    price: 34, category: "React Templates", tags: ["restaurant", "react", "template"],
    rating: 4.5, reviewCount: 78, salesCount: 421, featured: false,
    vendor: { name: "ThemeVault", avatar: "" }, thumbnail: thumbnails[4],
    screenshots: thumbnails.slice(1, 4), version: "1.2.0", lastUpdated: "2026-02-15",
  },
  {
    id: "6", title: "Iconic — Premium SVG Icon Pack", slug: "iconic-svg-pack",
    description: "2,400+ pixel-perfect SVG icons in 6 styles. Includes React components and Figma file.",
    price: 24, category: "Icons & Graphics", tags: ["icons", "svg", "figma"],
    rating: 4.9, reviewCount: 567, salesCount: 4102, featured: true,
    vendor: { name: "IconSmith", avatar: "" }, thumbnail: thumbnails[5],
    screenshots: thumbnails.slice(0, 3), version: "5.0.0", lastUpdated: "2026-03-01",
  },
  {
    id: "7", title: "AuthKit — Authentication Module", slug: "authkit-module",
    description: "Drop-in authentication module with social login, MFA, email verification, and session management.",
    price: 44, category: "Backend Modules", tags: ["auth", "backend", "security"],
    rating: 4.7, reviewCount: 156, salesCount: 891, featured: false,
    vendor: { name: "SecureDev", avatar: "" }, thumbnail: thumbnails[0],
    screenshots: thumbnails.slice(2, 5), version: "2.3.0", lastUpdated: "2026-03-05",
  },
  {
    id: "8", title: "MobileX — React Native Starter", slug: "mobilex-starter",
    description: "Cross-platform mobile app starter with navigation, state management, and 50+ screens.",
    price: 59, category: "Mobile Kits", tags: ["react-native", "mobile", "starter"],
    rating: 4.4, reviewCount: 63, salesCount: 312, featured: false,
    vendor: { name: "AppForge", avatar: "" }, thumbnail: thumbnails[1],
    screenshots: thumbnails.slice(0, 4), version: "1.8.0", lastUpdated: "2026-02-20",
  },
];
