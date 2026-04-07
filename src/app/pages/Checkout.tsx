import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { useUnlock } from "../contexts/UnlockContext";
import Navbar from "../components/Navbar";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import Footer from "../components/Footer";
import { Loader2 } from "lucide-react";
import PaymentSuccessModal from "../components/PaymentSuccessModal";

declare global {
  interface Window {
    PaystackPop?: any;
  }
}

export default function Checkout() {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { refreshUnlocks } = useUnlock();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [cancelled, setCancelled] = useState(false);
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

    try {
      const handler = window.PaystackPop.setup({
        key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
        email: user.email,
        amount: amount * 100, // Cents
        currency: 'USD',
        metadata: {
          user_id: user.id,
          product: product
        },
        callback: function (response: any) {
           setSuccessReferenceCode(response.reference || "paystack-auth");
           setProductUnlocked(product);
           refreshUnlocks();
           setShowSuccessModal(true);
        },
        onClose: function () {
           setCancelled(true);
        }
      });
      handler.openIframe();
    } catch (err) {
      console.error(err);
      setError("Error initializing payment gateway.");
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
                  Redirecting you to Paystack securely...
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <PaymentSuccessModal
        isOpen={showSuccessModal}
        referenceCode={successReferenceCode}
        productUnlocked={productUnlocked}
        onClose={() => {
          setShowSuccessModal(false);
          navigate("/dashboard");
        }}
        onContinue={() => {
          setShowSuccessModal(false);
          navigate("/dashboard");
        }}
      />
      <Footer />
    </div>
  );
}
