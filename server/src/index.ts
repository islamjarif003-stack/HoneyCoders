import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

dotenv.config();

import authRoutes from "./routes/auth";
import productRoutes from "./routes/products";
import categoryRoutes from "./routes/categories";
import vendorRoutes from "./routes/vendor";
import adminRoutes from "./routes/admin";
import orderRoutes from "./routes/orders";
import pageRoutes from "./routes/pages";
import wishlistRoutes from "./routes/wishlists";
import profileRoutes from "./routes/profile";

const app = express();
const PORT = process.env.PORT || 4000;

// Ensure upload directories exist
const uploadDir = process.env.UPLOAD_DIR || "./uploads";
["thumbnails", "screenshots", "product-files"].forEach((dir) => {
  const fullPath = path.join(uploadDir, dir);
  if (!fs.existsSync(fullPath)) fs.mkdirSync(fullPath, { recursive: true });
});

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(uploadDir));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/vendor", vendorRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/pages", pageRoutes);
app.use("/api/wishlists", wishlistRoutes);
app.use("/api/profile", profileRoutes);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 SourceStack API running on http://localhost:${PORT}`);
});
