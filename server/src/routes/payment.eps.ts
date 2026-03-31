import { Router, Request, Response } from "express";
import { query } from "../db";
import { authenticate, AuthRequest } from "../middleware/auth";
import { generateEpsHash } from "../utils/epsCrypto";

const router = Router();

const EPS_BASE_URL = "https://pgapi.eps.com.bd/v1";

// Helper: Get EPS settings from database
async function getEpsSettings(): Promise<Record<string, string>> {
  const { rows } = await query(
    "SELECT setting_key, setting_value FROM payment_settings WHERE setting_key LIKE 'eps_%'"
  );
  const settings: Record<string, string> = {};
  rows.forEach((r: any) => {
    settings[r.setting_key] = r.setting_value;
  });
  return settings;
}

// Helper: Get EPS Bearer Token
async function getEpsToken(settings: Record<string, string>): Promise<string> {
  const userName = settings.eps_username;
  const password = settings.eps_password;
  const hashKey = settings.eps_hash_key;

  if (!userName || !password || !hashKey) {
    throw new Error("EPS payment gateway is not configured. Please set credentials in Admin Settings.");
  }

  const xHash = generateEpsHash(hashKey, userName);

  const response = await fetch(`${EPS_BASE_URL}/Auth/GetToken`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-hash": xHash,
    },
    body: JSON.stringify({ userName, password }),
  });

  const data = await response.json() as { token: string; errorMessage?: string; errorCode?: string };

  if (data.errorMessage || data.errorCode) {
    throw new Error(`EPS Auth Error: ${data.errorMessage || data.errorCode}`);
  }

  return data.token;
}

// Generate unique merchant transaction ID (minimum 10 digits)
function generateMerchantTransactionId(): string {
  const now = new Date();
  const pad = (n: number, len = 2) => String(n).padStart(len, "0");
  return (
    now.getFullYear().toString() +
    pad(now.getMonth() + 1) +
    pad(now.getDate()) +
    pad(now.getHours()) +
    pad(now.getMinutes()) +
    pad(now.getSeconds()) +
    pad(now.getMilliseconds(), 3)
  );
}

// POST /api/payment/eps/init — Initialize EPS Payment
router.post("/init", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { productId } = req.body;
    const userId = req.userId;

    if (!productId || !userId) {
      return res.status(400).json({ message: "Missing productId or user authentication." });
    }

    // 1. Fetch real product from DB to get actual price (prevent tampering)
    const { rows: products } = await query("SELECT * FROM products WHERE id = $1 AND status = 'approved'", [productId]);
    if (!products.length) {
      return res.status(404).json({ message: "Product not found or not available." });
    }
    const product = products[0];

    // 2. Fetch user profile info
    const { rows: profiles } = await query(
      "SELECT p.*, u.email FROM profiles p JOIN users u ON u.id = p.user_id WHERE p.user_id = $1",
      [userId]
    );
    const profile = profiles[0] || {};

    // 3. Get EPS settings from DB
    const settings = await getEpsSettings();
    const merchantId = settings.eps_merchant_id;
    const storeId = settings.eps_store_id;
    const hashKey = settings.eps_hash_key;

    if (!merchantId || !storeId || !hashKey) {
      return res.status(500).json({ message: "EPS payment gateway is not configured." });
    }

    // 4. Get EPS token
    const token = await getEpsToken(settings);

    // 5. Generate unique IDs
    const merchantTransactionId = generateMerchantTransactionId();
    const customerOrderId = `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    // 6. Build frontend return URLs
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:8080";
    const successUrl = `${frontendUrl}/payment/status?status=success&mtxnId=${merchantTransactionId}`;
    const failUrl = `${frontendUrl}/payment/status?status=fail&mtxnId=${merchantTransactionId}`;
    const cancelUrl = `${frontendUrl}/payment/status?status=cancel&mtxnId=${merchantTransactionId}`;

    // 7. Create pending order in DB
    await query(
      `INSERT INTO orders (buyer_id, product_id, amount, status, merchant_transaction_id)
       VALUES ($1, $2, $3, 'pending', $4)`,
      [userId, productId, product.price, merchantTransactionId]
    );

    // 8. Generate x-hash with merchantTransactionId
    const xHash = generateEpsHash(hashKey, merchantTransactionId);

    // 9. Call EPS InitializeEPS
    const epsPayload = {
      storeId,
      CustomerOrderId: customerOrderId,
      merchantTransactionId,
      transactionTypeId: 1, // Web
      financialEntityId: 0,
      transitionStatusId: 0,
      // Convert USD to BDT (assuming 1 USD = 120 BDT)
      totalAmount: Number((Number(product.price) * 120).toFixed(2)),
      ipAddress: (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "0.0.0.0",
      version: "1",
      successUrl,
      failUrl,
      cancelUrl,
      customerName: profile.display_name || "Customer",
      customerEmail: profile.email || "",
      CustomerAddress: "N/A",
      CustomerAddress2: "",
      CustomerCity: "Dhaka",
      CustomerState: "Dhaka",
      CustomerPostcode: "1200",
      CustomerCountry: "BD",
      CustomerPhone: "",
      ShipmentName: "",
      ShipmentAddress: "",
      ShipmentAddress2: "",
      ShipmentCity: "",
      ShipmentState: "",
      ShipmentPostcode: "",
      ShipmentCountry: "BD",
      ValueA: productId,
      ValueB: userId,
      ValueC: "",
      ValueD: "",
      ShippingMethod: "NO",
      NoOfItem: "1",
      ProductName: product.title,
      ProductProfile: "general",
      ProductCategory: "Digital Product",
    };

    const epsResponse = await fetch(`${EPS_BASE_URL}/EPSEngine/InitializeEPS`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-hash": xHash,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(epsPayload),
    });

    const epsData = await epsResponse.json() as {
      RedirectURL?: string; TransactionId?: string;
      ErrorMessage?: string; ErrorCode?: string;
    };

    if (epsData.ErrorMessage || epsData.ErrorCode) {
      return res.status(400).json({
        message: `EPS Error: ${epsData.ErrorMessage || epsData.ErrorCode}`,
      });
    }

    // 10. Return redirect URL to frontend
    res.json({
      redirectUrl: epsData.RedirectURL,
      transactionId: epsData.TransactionId,
      merchantTransactionId,
    });
  } catch (err: any) {
    console.error("EPS Init Error:", err);
    res.status(500).json({ message: err.message || "Payment initialization failed." });
  }
});

// GET /api/payment/eps/verify — Verify EPS Transaction
router.get("/verify", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { mtxnId } = req.query;

    if (!mtxnId) {
      return res.status(400).json({ message: "Missing merchantTransactionId." });
    }

    const merchantTransactionId = mtxnId as string;

    // 1. Find the order
    const { rows: orders } = await query(
      "SELECT * FROM orders WHERE merchant_transaction_id = $1",
      [merchantTransactionId]
    );
    if (!orders.length) {
      return res.status(404).json({ message: "Order not found." });
    }
    const order = orders[0];

    // If already verified, return cached status
    if (order.status === "completed") {
      return res.json({
        status: "Success",
        merchantTransactionId,
        epsTransactionId: order.eps_transaction_id,
        totalAmount: order.amount,
        paymentMethod: order.payment_method,
      });
    }

    // 2. Get EPS settings & token
    const settings = await getEpsSettings();
    const hashKey = settings.eps_hash_key;
    if (!hashKey) {
      return res.status(500).json({ message: "EPS not configured." });
    }
    const token = await getEpsToken(settings);

    // 3. Generate hash & call verify
    const xHash = generateEpsHash(hashKey, merchantTransactionId);

    const epsResponse = await fetch(
      `${EPS_BASE_URL}/EPSEngine/CheckMerchantTransactionStatus?merchantTransactionId=${merchantTransactionId}`,
      {
        method: "GET",
        headers: {
          "x-hash": xHash,
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const epsData = await epsResponse.json() as {
      Status?: string; MerchantTransactionId?: string; EpsTransactionId?: string;
      TotalAmount?: string; FinancialEntity?: string; TransactionDate?: string;
      ErrorCode?: string; ErrorMessage?: string;
    };

    // 4. Update order based on EPS status
    if (epsData.Status === "Success") {
      await query(
        `UPDATE orders SET status = 'completed', eps_transaction_id = $1, payment_method = $2
         WHERE merchant_transaction_id = $3`,
        [epsData.EpsTransactionId, epsData.FinancialEntity || "EPS", merchantTransactionId]
      );

      // Update product sales count
      await query(
        "UPDATE products SET sales_count = sales_count + 1 WHERE id = $1",
        [order.product_id]
      );
    } else if (epsData.Status === "Failed" || epsData.Status === "Cancelled") {
      await query(
        "UPDATE orders SET status = 'refunded' WHERE merchant_transaction_id = $1",
        [merchantTransactionId]
      );
    }

    res.json({
      status: epsData.Status,
      merchantTransactionId: epsData.MerchantTransactionId,
      epsTransactionId: epsData.EpsTransactionId,
      totalAmount: epsData.TotalAmount,
      paymentMethod: epsData.FinancialEntity,
      transactionDate: epsData.TransactionDate,
    });
  } catch (err: any) {
    console.error("EPS Verify Error:", err);
    res.status(500).json({ message: err.message || "Verification failed." });
  }
});

export default router;
