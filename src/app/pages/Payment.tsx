import { useState } from "react";
import { Link } from "react-router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Smartphone, CreditCard, Wallet, Loader2, CheckCircle2 } from "lucide-react";
import { useUnlock } from "../contexts/UnlockContext";
import confetti from "canvas-confetti";
import { usePaystackPayment } from "react-paystack";

export default function Payment() {
  const [paymentMethod, setPaymentMethod] = useState("card"); // default to custom card UI
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const { setUnlocked } = useUnlock();

  const paystackConfig = {
    reference: (new Date()).getTime().toString(),
    email: email,
    amount: 100, // 100 cents = $1.00 Paystack parses amount in subunits. Note: Depending on the country, USD amount=100 might mean 100 cents. If it's Kobo it means 1 Naira.
    currency: "USD",
    publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
  };

  const initializePayment = usePaystackPayment(paystackConfig);

  const onSuccess = async (reference: any) => {
    setProcessing(true);
    try {
      const res = await fetch(`/api/verify?reference=${reference.reference}`);
      const data = await res.json();
      
      if (data.data && data.data.status === 'success') {
        setProcessing(false);
        setSuccess(true);
        setUnlocked(true);
        confetti({
          particleCount: 150,
          spread: 100,
          origin: { y: 0.6 }
        });
      } else {
        alert("Payment verification failed.");
        setProcessing(false);
      }
    } catch(err) {
      console.error(err);
      alert("Error verifying payment");
      setProcessing(false);
    }
  };

  const onClose = () => {
    // User closed the modal
  };

  const handlePayment = () => {
    if (paymentMethod === "paystack") {
      if (!email) {
        alert("Please provide an email address");
        return;
      }
      initializePayment({ onSuccess, onClose });
    } else if (paymentMethod === "card") {
      if (!email || !cardNumber || !expiry || !cvv) {
        alert("Please fill in all card details and email address");
        return;
      }

      const [month, year] = expiry.split('/');
      if (!month || !year || month.length !== 2 || year.length !== 2) {
         alert("Invalid expiry format. Use MM/YY");
         return;
      }

      setProcessing(true);
      fetch('/api/charge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          amount: "100", // Paystack expects lowest denomination (cents)
          card: {
            number: cardNumber.replace(/\s/g, ''),
            cvv: cvv,
            expiry_month: month,
            expiry_year: "20" + year
          }
        })
      }).then(res => res.json())
        .then(data => {
          if (data.data?.status === 'success' || data.status === true) {
             setProcessing(false);
             setSuccess(true);
             setUnlocked(true);
             confetti({
               particleCount: 150,
               spread: 100,
               origin: { y: 0.6 }
             });
          } else {
             alert("Card charge failed: " + (data.message || data.data?.message || JSON.stringify(data)));
             setProcessing(false);
          }
        })
        .catch(err => {
           console.error(err);
           alert("Error processing card over our secure network.");
           setProcessing(false);
        });
    } else {
      setProcessing(true);
      setTimeout(() => {
        setProcessing(false);
        setSuccess(true);
        setUnlocked(true);
        confetti({
          particleCount: 150,
          spread: 100,
          origin: { y: 0.6 }
        });
      }, 3000);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="py-20 px-4">
          <div className="max-w-md mx-auto text-center">
            <Card className="border-2 border-accent">
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
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (processing) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="py-20 px-4">
          <div className="max-w-md mx-auto text-center">
            <Card>
              <CardContent className="pt-12 pb-8">
                <Loader2 className="w-16 h-16 animate-spin text-primary mx-auto mb-6" />
                <h2 className="text-2xl font-bold mb-3">Processing Payment...</h2>
                <p className="text-muted-foreground">
                  {paymentMethod === "mpesa" && "Please check your phone for the M-Pesa prompt"}
                  {paymentMethod === "paystack" && "Processing your payment via Paystack"}
                  {paymentMethod === "card" && "Processing your card payment"}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Unlock WorkAI Academy</h1>
            <p className="text-xl text-muted-foreground">
              Choose your payment method
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Platform Access</span>
                      <span className="font-bold">$1.00</span>
                    </div>
                    <div className="border-t border-border pt-4">
                      <div className="flex items-center justify-between text-lg">
                        <span className="font-semibold">Total</span>
                        <span className="font-bold text-2xl">$1.00</span>
                      </div>
                    </div>
                    <div className="bg-accent/10 rounded-lg p-4 mt-4">
                      <p className="text-sm text-muted-foreground">
                        One-time payment. Lifetime access to the platform.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Payment Methods */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Payment Method</CardTitle>
                  <CardDescription>Select your preferred payment option</CardDescription>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    <div className="space-y-4">
                      <div className={`flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        paymentMethod === "mpesa" ? "border-primary bg-primary/5" : "border-border"
                      }`}>
                        <RadioGroupItem value="mpesa" id="mpesa" />
                        <Label htmlFor="mpesa" className="flex items-center gap-3 cursor-pointer flex-1">
                          <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                            <Smartphone className="w-5 h-5 text-accent-foreground" />
                          </div>
                          <div>
                            <p className="font-semibold">M-Pesa STK Push</p>
                            <p className="text-sm text-muted-foreground">Pay with your mobile money</p>
                          </div>
                        </Label>
                      </div>

                      <div className={`flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        paymentMethod === "paystack" ? "border-primary bg-primary/5" : "border-border"
                      }`}>
                        <RadioGroupItem value="paystack" id="paystack" />
                        <Label htmlFor="paystack" className="flex items-center gap-3 cursor-pointer flex-1">
                          <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                            <Wallet className="w-5 h-5 text-secondary" />
                          </div>
                          <div>
                            <p className="font-semibold">Paystack</p>
                            <p className="text-sm text-muted-foreground">Secure payment via Paystack</p>
                          </div>
                        </Label>
                      </div>

                      <div className={`flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        paymentMethod === "card" ? "border-primary bg-primary/5" : "border-border"
                      }`}>
                        <RadioGroupItem value="card" id="card" />
                        <Label htmlFor="card" className="flex items-center gap-3 cursor-pointer flex-1">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <CreditCard className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-semibold">Credit/Debit Card</p>
                            <p className="text-sm text-muted-foreground">Pay with your card</p>
                          </div>
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>

                  {/* Payment Details */}
                  <div className="mt-8 space-y-4">
                    {paymentMethod === "mpesa" && (
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            placeholder="0712345678"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className="mt-2"
                          />
                        </div>
                        <p className="text-sm text-muted-foreground">
                          You will receive an M-Pesa prompt on your phone
                        </p>
                      </div>
                    )}

                    {paymentMethod === "paystack" && (
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="email">Email Address</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="your@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-2"
                          />
                        </div>
                        <p className="text-sm text-muted-foreground">
                          You will be securely redirected to Paystack to complete your payment
                        </p>
                      </div>
                    )}

                    {paymentMethod === "card" && (
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="email-card">Email Address</Label>
                          <Input 
                            id="email-card" 
                            type="email" 
                            placeholder="your@email.com" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-2" 
                          />
                        </div>
                        <div>
                          <Label htmlFor="cardNumber">Card Number</Label>
                          <Input 
                            id="cardNumber" 
                            placeholder="1234 5678 9012 3456" 
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            className="mt-2" 
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="expiry">Expiry Date</Label>
                            <Input 
                              id="expiry" 
                              placeholder="MM/YY" 
                              value={expiry}
                              onChange={(e) => setExpiry(e.target.value)}
                              className="mt-2" 
                            />
                          </div>
                          <div>
                            <Label htmlFor="cvv">CVV</Label>
                            <Input 
                              id="cvv" 
                              placeholder="123" 
                              value={cvv}
                              onChange={(e) => setCvv(e.target.value)}
                              className="mt-2" 
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    <Button
                      className="w-full bg-primary hover:bg-primary/90"
                      size="lg"
                      onClick={handlePayment}
                    >
                      Pay $1 and Unlock
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
