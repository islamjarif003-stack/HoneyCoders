import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const categories = [
  "UI Kits",
  "Landing Pages",
  "Mobile Apps",
  "Dashboard Themes",
  "Icons & Graphics",
  "Backend Code"
];

const vendorNames = ["Pixel Labs", "DevCraft Studio", "CodeForge", "LaunchKit", "ThemeVault", "IconSmith", "SecureDev", "AppForge", "UI8 Creators", "Hunny Originals"];

const generators = {
  "UI Kits": {
    prefixes: ["Clean", "Minimal", "Glass", "Pro", "Ultra", "Neo"],
    suffixes: ["UI", "Design System", "Components", "Interface Kit"],
    desc: "A comprehensive UI kit built with modern design principles. Includes hundreds of components, auto-layout support, and global styles."
  },
  "Landing Pages": {
    prefixes: ["SaaS", "Crypto", "Agency", "Startup", "App", "Product"],
    suffixes: ["Landing", "Promo Page", "Waitlist", "Template"],
    desc: "High-converting landing page template optimized for speed and SEO. Features smooth animations and responsive design."
  },
  "Mobile Apps": {
    prefixes: ["E-commerce", "Social", "Fitness", "Finance", "Delivery", "Chat"],
    suffixes: ["App UI", "React Native Kit", "Flutter Template", "Mobile Kit"],
    desc: "Production-ready mobile application template. Cross-platform support with clean architecture and state management."
  },
  "Dashboard Themes": {
    prefixes: ["Admin", "Analytics", "CRM", "Sales", "Crypto", "Project"],
    suffixes: ["Dashboard", "Panel", "Admin Template", "Web App"],
    desc: "Feature-rich admin dashboard theme with charts, tables, and authentications screens. Dark mode included."
  },
  "Icons & Graphics": {
    prefixes: ["Essential", "Outline", "Solid", "Duotone", "Crafted", "Premium"],
    suffixes: ["Icons", "Illustration Pack", "Vectors", "Shapes"],
    desc: "Carefully crafted vector graphics and icons. Fully customizable shapes available in multiple formats (SVG, PNG, Figma)."
  },
  "Backend Code": {
    prefixes: ["Auth", "Payment", "GraphQL", "REST", "Socket", "Storage"],
    suffixes: ["API", "Module", "Boilerplate", "Microservice"],
    desc: "Scalable backend solution. Well-documented codebase with tests, CI/CD setup, and database schemas."
  }
};

const allMockups = [
  "/assets/placeholders/ui_kits.png", "/assets/placeholders/ui_kits_scene_1.png", "/assets/placeholders/ui_kits_scene_2.png",
  "/assets/placeholders/landing_pages.png", "/assets/placeholders/landing_pages_scene_1.png", "/assets/placeholders/landing_pages_scene_2.png",
  "/assets/placeholders/mobile_apps.png", "/assets/placeholders/mobile_apps_scene_1.png", "/assets/placeholders/mobile_apps_scene_2.png",
  "/assets/placeholders/dashboard_themes.png", "/assets/placeholders/dashboard_themes_scene_1.png", "/assets/placeholders/dashboard_themes_scene_2.png",
  "/assets/placeholders/icons_graphics.png", "/assets/placeholders/icons_graphics_scene_1.png", "/assets/placeholders/icons_graphics_scene_2.png",
  "/assets/placeholders/backend_code.png", "/assets/placeholders/backend_code_scene_1.png"
];

const getCategoryMockups = (cat) => {
  const m = {
    "UI Kits": [0, 1, 2],
    "Landing Pages": [3, 4, 5],
    "Mobile Apps": [6, 7, 8],
    "Dashboard Themes": [9, 10, 11],
    "Icons & Graphics": [12, 13, 14],
    "Backend Code": [15, 16]
  };
  return m[cat].map(idx => allMockups[idx]);
};

const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomFloat = (min, max) => (Math.random() * (max - min) + min).toFixed(1);

const shuffle = (array) => {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
};
    
const generateProducts = (count) => {
  const products = [];
  
  for (let i = 1; i <= count; i++) {
    const category = categories[i % categories.length];
    const gen = generators[category];
    const title = `${getRandom(gen.prefixes)} ${getRandom(gen.suffixes)} ${getRandomInt(1, 9)}`;
    const slug = title.toLowerCase().replace(/\s+/g, '-');
    
    // Pick thumbnail strictly from category pool
    const catPool = getCategoryMockups(category);
    const thumbnail = getRandom(catPool);
    
    // Pick 3 more distinct screenshots from all mockups, excluding the thumbnail
    let remainingPool = shuffle([...allMockups].filter(img => img !== thumbnail));
    const screenshots = [remainingPool[0], remainingPool[1], remainingPool[2]];

    products.push({
      id: i.toString(),
      title,
      slug,
      description: gen.desc,
      price: getRandomInt(19, 99),
      category,
      tags: [category.toLowerCase().replace(/\s/g, ''), "premium", "digital"],
      rating: parseFloat(getRandomFloat(4.0, 5.0)),
      reviewCount: getRandomInt(10, 500),
      salesCount: getRandomInt(50, 5000),
      vendor: { name: getRandom(vendorNames), avatar: "" },
      thumbnail,
      screenshots,
      version: `${getRandomInt(1, 5)}.${getRandomInt(0, 9)}.0`,
      lastUpdated: new Date(Date.now() - getRandomInt(0, 10000000000)).toISOString().split('T')[0],
      featured: i <= 8 // make the first 8 featured
    });
  }
  
  return products;
};

const products = generateProducts(50);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dir = path.join(__dirname);
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

fs.writeFileSync(path.join(dir, 'products.json'), JSON.stringify(products, null, 2));
console.log('Successfully generated 50 products in seed_data/products.json with LoremFlickr images.');
