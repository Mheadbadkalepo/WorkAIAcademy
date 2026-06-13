import { Link } from "react-router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { CheckCircle2, AlertTriangle } from "lucide-react";
import { getGuidePrices, PRICE_INCREASE_DATE } from "../../lib/pricing";
import { motion } from "motion/react";

export default function Pricing() {
  const { low: lowPrice, high: highPrice, isAfterIncrease } = getGuidePrices();

  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Price Increase Warning Banner with Heartbeat animation */}
          {!isAfterIncrease && (
            <motion.div 
              className="mb-12 p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 flex items-center gap-3 max-w-3xl mx-auto text-left shadow-md"
              animate={{
                scale: [1, 1.015, 1],
                borderColor: [
                  "rgba(245, 158, 11, 0.3)",
                  "rgba(245, 158, 11, 0.7)",
                  "rgba(245, 158, 11, 0.3)"
                ],
                boxShadow: [
                  "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
                  "0 10px 20px -3px rgba(245, 158, 11, 0.15), 0 4px 6px -2px rgba(245, 158, 11, 0.05)",
                  "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)"
                ]
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <motion.div
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 1.25, repeat: Infinity, ease: "easeInOut" }}
              >
                <AlertTriangle className="w-6 h-6 text-amber-500 shrink-0" />
              </motion.div>
              <div>
                <p className="font-semibold text-amber-950 dark:text-amber-200">
                  Price Increase Scheduled for June 12, 2026
                </p>
                <p className="text-sm text-amber-900/80 dark:text-amber-200/80">
                  Lifetime access to Low Paying Guides and High Paying Guides will increase to <strong className="text-foreground">$15</strong> and <strong className="text-foreground">$20</strong> respectively. Buy today to lock in the current rates!
                </p>
              </div>
            </motion.div>
          )}

          <div className="text-center mb-12">
            <Badge className="mb-4 bg-accent/10 text-accent-foreground border-accent">
              Simple Pricing
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Choose Your Path
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Start with $2.50 platform access, then unlock specific guides based on your goals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Starter Access */}
            <Card className="border-2 hover:border-primary/50 transition-all">
              <CardHeader>
                <CardTitle>Starter Access</CardTitle>
                <CardDescription>Unlock the platform</CardDescription>
                <div className="mt-4">
                  <span className="text-5xl font-bold">$2.50</span>
                  <span className="text-muted-foreground text-lg"> one-time</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Access to platform</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Dashboard access</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>AI job listings</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Remote jobs directory</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Basic resources</span>
                  </div>
                </div>
                <Link to="/checkout?product=platform&amount=2.5" className="block w-full">
                  <Button className="w-full bg-primary hover:bg-primary/90">
                    Unlock Platform
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Low Paying Guides */}
            <Card className="border-2 border-primary relative shadow-lg scale-105">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                <Badge className="bg-primary text-primary-foreground">Recommended</Badge>
                {!isAfterIncrease && (
                  <Badge className="bg-destructive text-destructive-foreground border-destructive hover:bg-destructive/90">Price rising soon</Badge>
                )}
              </div>
              <CardHeader>
                <CardTitle>Low Paying Guides</CardTitle>
                <CardDescription>Perfect for beginners</CardDescription>
                <div className="mt-4 flex flex-col">
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-bold">${lowPrice}</span>
                    <span className="text-muted-foreground text-sm font-normal">one-time</span>
                  </div>
                  {!isAfterIncrease && (
                    <span className="text-xs text-destructive font-semibold mt-1">
                      (Rises to $15 on June 12)
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Beginner AI training guides</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Appen complete guide</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Remotasks step-by-step</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Clickworker walkthrough</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Basic remote work tips</span>
                  </div>
                </div>
                <Link to={`/checkout?product=low_guides&amount=${lowPrice}`} className="block w-full">
                  <Button className="w-full bg-primary hover:bg-primary/90">
                    Unlock Guides
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* High Paying Guides */}
            <Card className="border-2 hover:border-secondary/50 transition-all relative">
              {!isAfterIncrease && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-destructive text-destructive-foreground border-destructive hover:bg-destructive/90">Price rising soon</Badge>
                </div>
              )}
              <CardHeader>
                <CardTitle>High Paying Guides</CardTitle>
                <CardDescription>Advanced opportunities</CardDescription>
                <div className="mt-4 flex flex-col">
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-bold">${highPrice}</span>
                    <span className="text-muted-foreground text-sm font-normal">one-time</span>
                  </div>
                  {!isAfterIncrease && (
                    <span className="text-xs text-destructive font-semibold mt-1">
                      (Rises to $20 on June 12)
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Outlier AI complete guide</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Telus AI walkthrough</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Scale AI application guide</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Advanced AI jobs</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Premium job guides</span>
                  </div>
                </div>
                <Link to={`/checkout?product=high_guides&amount=${highPrice}`} className="block w-full">
                  <Button className="w-full bg-secondary hover:bg-secondary/90">
                    Unlock Premium
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* FAQ Section */}
          <div className="mt-20 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Why do I need to pay $2.50?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    The $2.50 platform access fee helps us maintain the platform, verify job listings, and provide quality resources. It's a one-time payment that gives you lifetime access.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">What payment methods do you accept?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    We accept all major payment methods including Mobile Money and Cards securely via Paystack.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Can I buy guides separately?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Yes! After unlocking the platform for $2.50, you can purchase Low Paying Guides (${lowPrice}) or High Paying Guides (${highPrice}) based on your needs.
                  </p>
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
