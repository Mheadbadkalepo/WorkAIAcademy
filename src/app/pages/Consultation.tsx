import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Clock, Loader2, Lock, Mail, Video } from "lucide-react";
import { motion } from "motion/react";
import { usePaystackPayment } from "react-paystack";
import { useAuth } from "../contexts/AuthContext";
import { useUnlock } from "../contexts/UnlockContext";
import { supabase } from "../../lib/supabase";

declare global {
  interface Window {
    Calendly?: {
      initPopupWidget: (options: { url: string }) => void;
    };
  }
}

const CALENDLY_SCRIPT_SRC = "https://assets.calendly.com/assets/external/widget.js";
const CALENDLY_CSS_HREF = "https://assets.calendly.com/assets/external/widget.css";

/** KES per 1 USD — set `VITE_USD_TO_KES` in `.env` to match your Paystack settlement rate. */
const USD_TO_KES_RATE =
  Number.parseFloat(String(import.meta.env.VITE_USD_TO_KES || "")) || 130;

function usdToKesShillings(usd: number): number {
  return Math.max(1, Math.round(usd * USD_TO_KES_RATE));
}

/** Paystack expects KES in the smallest unit (cents): whole shillings × 100. */
function usdToPaystackKesAmount(usd: number): number {
  return usdToKesShillings(usd) * 100;
}

type ConsultProduct = "consultation_20min" | "consultation_30min" | "consultation_60min";

type ConsultPackage = {
  id: string;
  title: string;
  amountUsd: number;
  duration: string;
  description: string;
  scheduleLabel: string;
  calendlyUrl: string;
  product: ConsultProduct;
  highlight: boolean;
};

const PACKAGES: ConsultPackage[] = [
  {
    id: "20",
    title: "20 Minute Call",
    amountUsd: 5,
    duration: "20 min",
    description: "Quick consultation for fast guidance",
    scheduleLabel: "Schedule 20 minutes",
    calendlyUrl: "https://calendly.com/workaiacademyofficial/new-meeting",
    product: "consultation_20min",
    highlight: false,
  },
  {
    id: "30",
    title: "30 Minute Call",
    amountUsd: 8,
    duration: "30 min",
    description: "Perfect for detailed help and support",
    scheduleLabel: "Schedule 30 minutes",
    calendlyUrl: "https://calendly.com/workaiacademyofficial/30min",
    product: "consultation_30min",
    highlight: true,
  },
  {
    id: "60",
    title: "1 Hour Call",
    amountUsd: 10,
    duration: "1 hour",
    description: "Full private consultation session",
    scheduleLabel: "Schedule 1 hour",
    calendlyUrl: "https://calendly.com/workaiacademyofficial/1-hour-meeting",
    product: "consultation_60min",
    highlight: false,
  },
];

function packageIsPaid(pkg: ConsultPackage, consult20: boolean, consult30: boolean, consult60: boolean): boolean {
  if (pkg.product === "consultation_20min") return consult20;
  if (pkg.product === "consultation_30min") return consult30;
  return consult60;
}

export default function Consultation() {
  const { user } = useAuth();
  const { refreshUnlocks, consult20Paid, consult30Paid, consult60Paid } = useUnlock();
  const [processingId, setProcessingId] = useState<string | null>(null);

  const initializeConsultPayment = usePaystackPayment({
    publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || "",
    email: user?.email || "",
    amount: 10000,
    currency: "KES",
  });

  useEffect(() => {
    let link = document.getElementById("calendly-widget-css") as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.id = "calendly-widget-css";
      link.rel = "stylesheet";
      link.href = CALENDLY_CSS_HREF;
      document.head.appendChild(link);
    }

    let script = document.getElementById("calendly-widget-js") as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.id = "calendly-widget-js";
      script.src = CALENDLY_SCRIPT_SRC;
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const recordConsultationPayment = async (
    reference: string,
    method: string,
    pkg: ConsultPackage,
  ) => {
    if (!user) return;

    const accessPayload: Record<string, string | boolean> = {
      user_id: user.id,
      updated_at: new Date().toISOString(),
    };
    if (pkg.product === "consultation_20min") accessPayload.consult_20_paid = true;
    if (pkg.product === "consultation_30min") accessPayload.consult_30_paid = true;
    if (pkg.product === "consultation_60min") accessPayload.consult_60_paid = true;

    const { error: accessError } = await supabase.from("user_access").upsert(accessPayload, { onConflict: "user_id" });
    if (accessError) {
      console.error("Failed to persist consultation access:", accessError.message);
    }

    const { error: paymentError } = await supabase.from("payment_records").upsert(
      {
        user_id: user.id,
        payment_reference: reference,
        payment_method: method,
        product: pkg.product,
        amount: usdToKesShillings(pkg.amountUsd),
        currency: "KES",
        status: "success",
      },
      { onConflict: "payment_reference" },
    );
    if (paymentError) {
      console.error("Failed to save consultation payment:", paymentError.message);
    }

    await refreshUnlocks();
  };

  const handlePaystackSuccess = async (pkg: ConsultPackage, paystackResponse: { reference: string }) => {
    setProcessingId(pkg.id);
    try {
      const res = await fetch(`/api/verify?reference=${encodeURIComponent(paystackResponse.reference)}`);
      const data = await res.json();
      if (data.data && data.data.status === "success") {
        await recordConsultationPayment(paystackResponse.reference, "paystack", pkg);
      } else {
        alert("Payment verification failed. If you were charged, contact support with your reference.");
      }
    } catch (e) {
      console.error(e);
      alert("Error verifying payment.");
    } finally {
      setProcessingId(null);
    }
  };

  const startConsultationPayment = (pkg: ConsultPackage) => {
    if (!user?.email) {
      alert("Please sign in with an email address to pay.");
      return;
    }
    if (!import.meta.env.VITE_PAYSTACK_PUBLIC_KEY) {
      alert("Payment is not configured. Please try again later.");
      return;
    }

    const reference = `consult_${pkg.product}_${Date.now()}_${user.id.slice(0, 8)}`;

    initializeConsultPayment({
      config: {
        email: user.email,
        amount: usdToPaystackKesAmount(pkg.amountUsd),
        reference,
        currency: "KES",
        metadata: {
          user_id: user.id,
          product: pkg.product,
          amount_usd: pkg.amountUsd,
          amount_kes: usdToKesShillings(pkg.amountUsd),
        },
      },
      onSuccess: (response: { reference?: string } | string) => {
        const ref =
          typeof response === "string" ? response : response?.reference;
        if (ref) void handlePaystackSuccess(pkg, { reference: ref });
      },
      onClose: () => {},
    });
  };

  const openCalendlyPopup = useCallback((url: string) => {
    const run = () => {
      if (typeof window !== "undefined" && window.Calendly) {
        window.Calendly.initPopupWidget({ url });
        return true;
      }
      return false;
    };

    if (run()) return;

    let attempts = 0;
    const maxAttempts = 50;
    const t = window.setInterval(() => {
      attempts += 1;
      if (run() || attempts >= maxAttempts) {
        window.clearInterval(t);
        if (attempts >= maxAttempts && !window.Calendly) {
          window.open(url, "_blank", "noopener,noreferrer");
        }
      }
    }, 100);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <header className="relative overflow-hidden border-b border-border bg-gradient-to-b from-primary/5 via-background to-background">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,hsl(var(--primary)/0.15),transparent)] pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 md:py-24 text-center">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 hover:bg-primary/15">
            Private video calls
          </Badge>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Work AI Academy Consultation
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Talk directly with our expert team in a private video call
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
            Book a 1-on-1 Consultation
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg mb-4">
            Checkout is in <strong className="text-foreground font-semibold">Kenyan Shillings (KES)</strong> via
            Paystack (priced from USD at the rate in settings). After payment, pick a time in Calendly.
          </p>
          {!user && (
            <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
              <Lock className="w-4 h-4" />
              <span>
                <Link to="/login" className="text-primary font-medium hover:underline">
                  Sign in
                </Link>{" "}
                to complete payment and unlock scheduling.
              </span>
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {PACKAGES.map((pkg, index) => {
            const paid = packageIsPaid(pkg, consult20Paid, consult30Paid, consult60Paid);
            const busy = processingId === pkg.id;

            return (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08, duration: 0.4 }}
                className={pkg.highlight ? "md:-mt-2 md:mb-2" : ""}
              >
                <Card
                  className={`h-full flex flex-col border-2 shadow-lg shadow-black/5 dark:shadow-black/20 rounded-2xl transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 ${
                    pkg.highlight
                      ? "border-primary/40 ring-2 ring-primary/20 bg-gradient-to-b from-primary/5 to-card"
                      : "border-border hover:border-primary/30"
                  }`}
                >
                  <CardHeader className="pb-4 space-y-3">
                    {pkg.highlight && (
                      <Badge className="w-fit bg-primary text-primary-foreground">Most popular</Badge>
                    )}
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-xl sm:text-2xl leading-tight">{pkg.title}</CardTitle>
                      <div className="text-right shrink-0">
                        <span className="text-2xl sm:text-3xl font-bold text-primary tabular-nums block">
                          Ksh {usdToKesShillings(pkg.amountUsd).toLocaleString()}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          ≈ ${pkg.amountUsd} USD @ {USD_TO_KES_RATE} KES/USD
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4 shrink-0" />
                      <span>{pkg.duration}</span>
                      <span className="text-border">|</span>
                      <span className="flex items-center gap-1">
                        <Video className="w-4 h-4 shrink-0" />
                        Video call
                      </span>
                    </div>
                    <CardDescription className="text-base leading-relaxed">
                      {pkg.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="mt-auto pt-0 pb-6 space-y-3">
                    {!user ? (
                      <Button
                        type="button"
                        size="lg"
                        className={`w-full rounded-xl text-base font-semibold ${
                          pkg.highlight
                            ? "bg-primary hover:bg-primary/90"
                            : "bg-secondary text-secondary-foreground hover:bg-secondary/90"
                        }`}
                        asChild
                      >
                        <Link to="/login">Sign in to pay & schedule</Link>
                      </Button>
                    ) : paid ? (
                      <Button
                        type="button"
                        size="lg"
                        className={`w-full rounded-xl text-base font-semibold transition-transform hover:scale-[1.02] active:scale-[0.98] ${
                          pkg.highlight
                            ? "bg-primary hover:bg-primary/90 shadow-md"
                            : "bg-secondary text-secondary-foreground hover:bg-secondary/90"
                        }`}
                        disabled={busy}
                        onClick={() => openCalendlyPopup(pkg.calendlyUrl)}
                      >
                        {pkg.scheduleLabel}
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        size="lg"
                        className={`w-full rounded-xl text-base font-semibold transition-transform hover:scale-[1.02] active:scale-[0.98] ${
                          pkg.highlight
                            ? "bg-primary hover:bg-primary/90 shadow-md"
                            : "bg-secondary text-secondary-foreground hover:bg-secondary/90"
                        }`}
                        disabled={busy}
                        onClick={() => startConsultationPayment(pkg)}
                      >
                        {busy ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            Verifying…
                          </>
                        ) : (
                          "Book Consultation"
                        )}
                      </Button>
                    )}
                    {user && paid && (
                      <p className="text-xs text-center text-muted-foreground">
                        Your payment is on file—you can open scheduling whenever you are ready.
                      </p>
                    )}
                    {user && !paid && (
                      <p className="text-xs text-center text-muted-foreground">
                        After Paystack confirms, we save your access in your account so only you can schedule this
                        tier.
                      </p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <section className="mt-16 sm:mt-20 rounded-2xl border border-border bg-muted/30 p-8 sm:p-10 text-center max-w-3xl mx-auto">
          <h3 className="text-lg font-semibold mb-2 flex items-center justify-center gap-2">
            <Mail className="w-5 h-5 text-primary" />
            Questions before booking?
          </h3>
          <p className="text-muted-foreground text-sm sm:text-base mb-4">
            Reach out anytime—we typically reply within one business day.
          </p>
          <a
            href="mailto:workaiacademyofficial@gmail.com"
            className="inline-flex text-primary font-medium hover:underline break-all"
          >
            workaiacademyofficial@gmail.com
          </a>
        </section>
      </main>

      <Footer />
    </div>
  );
}
