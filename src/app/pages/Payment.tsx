import { useState } from "react";
import { Link } from "react-router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Smartphone, CreditCard, Loader2, CheckCircle2, ShieldCheck } from "lucide-react";
import { useUnlock } from "../contexts/UnlockContext";
import { useAuth } from "../contexts/AuthContext";
import PaymentModal from "../components/PaymentModal";

export default function Payment() {
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);

  const { setUnlocked, refreshUnlocks } = useUnlock();
  const { user } = useAuth();

  // URL flag to show success (handled by pesapal callback)
  const isSuccess = window.location.search.includes("success=true") || window.location.search.includes("payment=complete");

  const handlePayment = async () => {
    if (!email) {
      setError("Please provide an email address");
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const response = await fetch('/api/pesapal-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: 1.00,
          product: "platform",
          email: email || user?.email,
          phone: phoneNumber || user?.user_metadata?.phone || "",
          description: "Unlock WorkAI Academy Platform",
          metadata: { user_id: user?.id || null }
        })
      });

      const data = await response.json();

      if (data.redirect_url) {
        setPaymentUrl(data.redirect_url);
        setProcessing(false);
      } else {
        setError(data.error || "Failed to initialize secure checkout");
        setProcessing(false);
      }
    } catch (err) {
      console.error(err);
      setError("Error communicating with payment gateway.");
      setProcessing(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="py-20 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <Card className="border-2 border-accent mb-8">
              <CardContent className="pt-12 pb-8">
                <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-12 h-12 text-accent" />
                </div>
                <h1 className="text-3xl font-bold mb-3">Payment Successful!</h1>
                <p className="text-xl text-muted-foreground mb-8">
                  Welcome to WorkAI Academy
                </p>
                <Link to="/dashboard">
                  <Button className="bg-primary hover:bg-primary/90" size="lg">
                    Go to Dashboard
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Upsell Cards */}
            <h2 className="text-2xl font-bold mb-6">Upgrade Your Access</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Card className="border-2 border-primary/20 hover:border-primary/50 transition-colors">
                <CardContent className="pt-8 pb-6">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">📘</span>
                  </div>
                  <CardTitle className="mb-2">Low Paying Guides</CardTitle>
                  <CardDescription className="mb-4">
                    Appen, Remotask & Clickworker
                  </CardDescription>
                  <p className="text-3xl font-bold text-primary mb-4">$2</p>
                  <Link to="/checkout?product=low_guides&amount=2" className="block">
                    <Button className="w-full bg-primary hover:bg-primary/90">
                      Unlock Low Guides
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="border-2 border-secondary/20 hover:border-secondary/50 transition-colors">
                <CardContent className="pt-8 pb-6">
                  <div className="w-14 h-14 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">📕</span>
                  </div>
                  <CardTitle className="mb-2">High Paying Guides</CardTitle>
                  <CardDescription className="mb-4">
                    Outlier, Telus & Scale AI
                  </CardDescription>
                  <p className="text-3xl font-bold text-secondary mb-4">$5</p>
                  <Link to="/checkout?product=high_guides&amount=5" className="block">
                    <Button className="w-full bg-secondary hover:bg-secondary/90">
                      Unlock High Guides
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (processing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background/50 backdrop-blur-sm fixed inset-0 z-50">
        <Loader2 className="w-16 h-16 animate-spin text-primary mb-6" />
        <h2 className="text-2xl font-bold mb-3">Connecting to PesaPal...</h2>
        <p className="text-muted-foreground">Please wait while we prepare your secure checkout</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Unlock WorkAI Academy</h1>
            <p className="text-xl text-muted-foreground">
              Choose your payment method securely via PesaPal
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24 border-2 border-primary/10">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Platform Access</span>
                      <span className="font-bold text-foreground">$1.00</span>
                    </div>
                    <div className="border-t border-border pt-4">
                      <div className="flex items-center justify-between text-lg">
                        <span className="font-semibold">Total</span>
                        <span className="font-bold text-2xl text-primary">$1.00</span>
                      </div>
                    </div>
                    <div className="bg-primary/5 rounded-lg p-4 mt-4 flex gap-3 items-start">
                      <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <p className="text-sm text-foreground/80 leading-relaxed">
                        One-time payment for lifetime access to the academy platform.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Payment Flow */}
            <div className="lg:col-span-2">
              <Card className="border-2 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    Payment details
                  </CardTitle>
                  <CardDescription>We support Cards and Mobile Money across Africa</CardDescription>
                </CardHeader>
                <CardContent>
                  {error && (
                    <div className="mb-6 p-4 bg-destructive/10 text-destructive rounded-lg text-sm font-medium">
                      {error}
                    </div>
                  )}

                  <div className="space-y-6">
                    <div className="grid gap-2">
                      <Label htmlFor="email" className="text-base">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-12"
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="phone" className="text-base">Phone Number (Optional)</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="e.g +254 700 000 000"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="h-12"
                      />
                    </div>

                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="pt-4 grid sm:grid-cols-2 gap-4">
                      <Label
                        htmlFor="card"
                        className={`flex flex-col items-center justify-between rounded-xl border-2 p-4 cursor-pointer hover:bg-accent/5 hover:border-primary/50 ${paymentMethod === "card" ? "border-primary bg-primary/5" : "border-muted"
                          }`}
                      >
                        <RadioGroupItem value="card" id="card" className="sr-only" />
                        <CreditCard className="mb-3 h-8 w-8 text-primary" />
                        <span className="font-medium">Credit/Debit Card</span>
                        <span className="text-xs text-muted-foreground mt-1 text-center">Visa & Mastercard</span>
                      </Label>

                      <Label
                        htmlFor="mpesa"
                        className={`flex flex-col items-center justify-between rounded-xl border-2 p-4 cursor-pointer hover:bg-accent/5 hover:border-primary/50 ${paymentMethod === "mpesa" ? "border-primary bg-primary/5" : "border-muted"
                          }`}
                      >
                        <RadioGroupItem value="mpesa" id="mpesa" className="sr-only" />
                        <Smartphone className="mb-3 h-8 w-8 text-primary" />
                        <span className="font-medium">Mobile Money</span>
                        <span className="text-xs text-muted-foreground mt-1 text-center">M-Pesa, Airtel, MTN</span>
                      </Label>
                    </RadioGroup>

                    <div className="pt-6">
                      <Button
                        className="w-full text-lg h-14 bg-primary hover:bg-primary/90 shadow-md"
                        onClick={handlePayment}
                        disabled={processing}
                      >
                        {processing ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : "Proceed to Secure Checkout"}
                      </Button>
                      <p className="text-center text-xs text-muted-foreground mt-4 flex items-center justify-center gap-1.5">
                        <ShieldCheck className="w-4 h-4" />
                        Payments processed securely by PesaPal
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <PaymentModal
        url={paymentUrl}
        onClose={() => setPaymentUrl(null)}
      />
      <Footer />
    </div>
  );
}
