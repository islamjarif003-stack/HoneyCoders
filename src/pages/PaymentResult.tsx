import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, AlertTriangle, Loader2, Download, ArrowLeft, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/marketplace/Navbar";

interface VerifyResult {
  status: string;
  merchantTransactionId: string;
  epsTransactionId: string;
  totalAmount: string;
  paymentMethod: string;
  transactionDate: string;
}

const PaymentResult = () => {
  const [searchParams] = useSearchParams();
  const status = searchParams.get("status");
  const mtxnId = searchParams.get("mtxnId");

  const { token } = useAuth();
  const [verifyResult, setVerifyResult] = useState<VerifyResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyPayment = async () => {
      if (!mtxnId || !token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/payment/eps/verify?mtxnId=${mtxnId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (res.ok) {
          setVerifyResult(data);
        } else {
          setError(data.message || "Verification failed.");
        }
      } catch {
        setError("Could not verify payment. Please contact support.");
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [mtxnId, token]);

  const isSuccess = status === "success" && verifyResult?.status === "Success";
  const isFail = status === "fail" || verifyResult?.status === "Failed";
  const isCancel = status === "cancel" || verifyResult?.status === "Cancelled";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="flex items-center justify-center px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md"
        >
          <div className="rounded-2xl border border-border bg-card/80 p-8 shadow-elevated backdrop-blur-xl text-center">
            {loading ? (
              <div className="py-10">
                <Loader2 className="mx-auto h-10 w-10 animate-spin text-primary" />
                <p className="mt-4 text-sm text-muted-foreground">Verifying your payment...</p>
              </div>
            ) : isSuccess ? (
              <>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                >
                  <CheckCircle2 className="mx-auto h-16 w-16 text-emerald-500" />
                </motion.div>
                <h1 className="mt-4 font-display text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  Payment Successful!
                </h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  Your payment has been processed successfully. You can now download your product.
                </p>

                {verifyResult && (
                  <div className="mt-6 space-y-2 rounded-xl border border-border bg-muted/30 p-4 text-left text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Transaction ID</span>
                      <span className="font-mono text-xs font-medium">{verifyResult.epsTransactionId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Amount</span>
                      <span className="font-semibold">${verifyResult.totalAmount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Payment Method</span>
                      <span className="font-medium">{verifyResult.paymentMethod}</span>
                    </div>
                    {verifyResult.transactionDate && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Date</span>
                        <span className="font-medium">{verifyResult.transactionDate}</span>
                      </div>
                    )}
                  </div>
                )}

                <div className="mt-6 flex flex-col gap-3">
                  <Link to="/library">
                    <Button className="w-full gradient-primary text-primary-foreground">
                      <Download className="mr-2 h-4 w-4" />
                      Go to My Library
                    </Button>
                  </Link>
                  <Link to="/products">
                    <Button variant="outline" className="w-full">
                      <ShoppingBag className="mr-2 h-4 w-4" />
                      Continue Shopping
                    </Button>
                  </Link>
                </div>
              </>
            ) : isFail ? (
              <>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                >
                  <XCircle className="mx-auto h-16 w-16 text-red-500" />
                </motion.div>
                <h1 className="mt-4 font-display text-2xl font-bold text-red-600 dark:text-red-400">
                  Payment Failed
                </h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  Unfortunately, your payment could not be processed. Please try again or use a different payment method.
                </p>
                <div className="mt-6 flex flex-col gap-3">
                  <Link to="/products">
                    <Button className="w-full">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back to Products
                    </Button>
                  </Link>
                </div>
              </>
            ) : isCancel ? (
              <>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                >
                  <AlertTriangle className="mx-auto h-16 w-16 text-amber-500" />
                </motion.div>
                <h1 className="mt-4 font-display text-2xl font-bold text-amber-600 dark:text-amber-400">
                  Payment Cancelled
                </h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  You cancelled the payment. No charges were made. You can try again anytime.
                </p>
                <div className="mt-6 flex flex-col gap-3">
                  <Link to="/products">
                    <Button className="w-full">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back to Products
                    </Button>
                  </Link>
                </div>
              </>
            ) : (
              <>
                <AlertTriangle className="mx-auto h-16 w-16 text-amber-500" />
                <h1 className="mt-4 font-display text-xl font-bold">Unknown Status</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  {error || "We couldn't determine the status of your payment. Please contact support."}
                </p>
                <Link to="/products" className="mt-6 inline-block">
                  <Button>Back to Products</Button>
                </Link>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PaymentResult;
