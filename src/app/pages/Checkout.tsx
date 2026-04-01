import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { useUnlock } from "../contexts/UnlockContext";
import Navbar from "../components/Navbar";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import Footer from "../components/Footer";
import { Loader2 } from "lucide-react";
import PaymentModal from "../components/PaymentModal";
import PaymentSuccessModal from "../components/PaymentSuccessModal";

export default function Checkout() {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { refreshUnlocks } = useUnlock();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [cancelled, setCancelled] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [orderTrackingId, setOrderTrackingId] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successReferenceCode, setSuccessReferenceCode] = useState<string>("");
  const [productUnlocked, setProductUnlocked] = useState<string>("");

  const product = searchParams.get("product");
  const amountStr = searchParams.get("amount");
  const amount = amountStr ? parseFloat(amountStr) : 0;

  useEffect(() => {
    if (!user) {
      // Must be logged in to checkout
      navigate("/login?redirect=" + encodeURIComponent(window.location.pathname + window.location.search));
      return;
    }

    if (!product || !amount || isNaN(amount)) {
      setError("Invalid checkout parameters.");
      return;
    }
  }, [user, product, amount, navigate]);

  const initiatePayment = async () => {
    if (!product || !amount || isNaN(amount) || !user) return;
    setCancelled(false);
    setError(null);
    const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), 15000);
      try {
        const response = await fetch("/api/pesapal-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({
            amount,
            product,
            email: user.email,
            phone: user.user_metadata?.phone || "",
            description: `Unlock ${product.replace("_", " ")}`,
            metadata: { user_id: user.id }
          })
        });

        if (!response.ok) {
          const errorText = await response.text();
          setError(errorText || "Payment endpoint returned an error.");
          return;
        }

        const data = await response.json();
        
        if (data.redirect_url) {
          setOrderTrackingId(data.order_tracking_id);
          setPaymentUrl(data.redirect_url);
        } else {
          setError(data.error || "Failed to initialize secure checkout");
        }
      } catch (err) {
        console.error(err);
        if (err instanceof DOMException && err.name === "AbortError") {
          setError("Payment request timed out. Please refresh and try again.");
        } else {
          setError("Network error communicating with payment gateway.");
        }
      } finally {
        window.clearTimeout(timeout);
      }
    };

  useEffect(() => {
    if (user && product && amount && !isNaN(amount)) {
      initiatePayment();
    }
  }, [user, product, amount]);

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="py-32 px-4 flex justify-center items-center">
        <Card className="max-w-md w-full text-center">
          <CardContent className="pt-12 pb-12">
            {error ? (
              <div className="space-y-4 w-full">
                <div className="p-4 bg-destructive/10 text-destructive rounded-lg flex flex-col gap-2">
                  <p className="font-semibold">{error}</p>
                </div>
                <Button className="w-full" onClick={initiatePayment}>
                  Try Again
                </Button>
                <Button variant="outline" className="w-full" onClick={() => navigate("/dashboard")}>
                  Return to Dashboard
                </Button>
              </div>
            ) : cancelled ? (
              <div className="space-y-4 w-full">
                <div className="p-4 bg-muted text-muted-foreground rounded-lg">
                  <p className="font-semibold">Payment was cancelled.</p>
                </div>
                <Button className="w-full" onClick={initiatePayment}>
                  Try Again
                </Button>
                <Button variant="outline" className="w-full" onClick={() => navigate("/dashboard")}>
                  Return to Dashboard
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <Loader2 className="w-16 h-16 animate-spin text-primary mx-auto mb-6" />
                <h2 className="text-2xl font-bold">Secure Checkout</h2>
                <p className="text-muted-foreground">
                  Redirecting you to PesaPal...
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <PaymentModal 
        url={paymentUrl} 
        referenceCode={orderTrackingId || ""}
        onClose={() => {
          setPaymentUrl(null);
          setCancelled(true);
        }}
        onSuccess={async () => {
          if (!orderTrackingId) return;

          setSuccessReferenceCode(orderTrackingId);
          setProductUnlocked(product || "");

          // Poll payment status endpoint until success or timeout
          const verifyPaymentStatus = async () => {
            const maxRetries = 12;
            const intervalMs = 2000;
            for (let attempt = 0; attempt < maxRetries; attempt++) {
              try {
                const response = await fetch(`/api/payment-status?order_tracking_id=${orderTrackingId}`);
                if (response.ok) {
                  const data = await response.json();
                  if (data.payment?.status === 'success') {
                    return true;
                  }
                }
              } catch (err) {
                console.error('Payment status check error', err);
              }
              await new Promise((resolve) => setTimeout(resolve, intervalMs));
            }
            return false;
          };

          const isVerified = await verifyPaymentStatus();
          if (!isVerified) {
            setError('Payment still pending; please try again shortly.');
            return;
          }

          await refreshUnlocks();
          setShowSuccessModal(true);
        }}
      />
      <PaymentSuccessModal
        isOpen={showSuccessModal}
        referenceCode={successReferenceCode}
        productUnlocked={productUnlocked}
        onClose={() => {
          setShowSuccessModal(false);
          setPaymentUrl(null);
          navigate("/dashboard");
        }}
        onContinue={() => {
          setShowSuccessModal(false);
          setPaymentUrl(null);
          navigate("/dashboard");
        }}
      />
      <Footer />
    </div>
  );
}
