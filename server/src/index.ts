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
import epsPaymentRoutes from "./routes/payment.eps";

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
app.use("/api/payment/eps", epsPaymentRoutes);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.listen(PORT, async () => {
  console.log(`🚀 SourceStack API running on http://localhost:${PORT}`);
  
  // Auto-initialize DB schema (Commented out to prevent errors on restart)
  // try {
  //   import('./db').then(async ({ pool }) => {
  //     try {
  //       const schema = fs.readFileSync(path.join(process.cwd(), "schema.sql"), "utf8");
  //       await pool.query(schema);
  //       console.log("✅ Database schema synchronized.");
  //     } catch (err) {
  //       console.error("❌ Failed to synchronize database schema:", err);
  //     }
  //   });
  // } catch (err) {
  //   console.warn("Could not import DB for auto-initialization.");
  // }
});
