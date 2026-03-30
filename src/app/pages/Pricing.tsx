import { Link } from "react-router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { CheckCircle2 } from "lucide-react";

export default function Pricing() {
  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-accent/10 text-accent-foreground border-accent">
              Simple Pricing
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Choose Your Path
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Start with $1 platform access, then unlock specific guides based on your goals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Starter Access */}
            <Card className="border-2 hover:border-primary/50 transition-all">
              <CardHeader>
                <CardTitle>Starter Access</CardTitle>
                <CardDescription>Unlock the platform</CardDescription>
                <div className="mt-4">
                  <span className="text-5xl font-bold">$1</span>
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
                <Link to="/checkout?product=platform&amount=1" className="block w-full">
                  <Button className="w-full bg-primary hover:bg-primary/90">
                    Unlock Platform
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Low Paying Guides */}
            <Card className="border-2 border-primary relative shadow-lg scale-105">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground">Recommended</Badge>
              </div>
              <CardHeader>
                <CardTitle>Low Paying Guides</CardTitle>
                <CardDescription>Perfect for beginners</CardDescription>
                <div className="mt-4">
                  <span className="text-5xl font-bold">$2</span>
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
                <Link to="/checkout?product=low_guides&amount=2" className="block w-full">
                  <Button className="w-full bg-primary hover:bg-primary/90">
                    Unlock Guides
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* High Paying Guides */}
            <Card className="border-2 hover:border-secondary/50 transition-all">
              <CardHeader>
                <CardTitle>High Paying Guides</CardTitle>
                <CardDescription>Advanced opportunities</CardDescription>
                <div className="mt-4">
                  <span className="text-5xl font-bold">$5</span>
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
                <Link to="/checkout?product=high_guides&amount=5" className="block w-full">
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
                  <CardTitle className="text-lg">Why do I need to pay $1?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    The $1 platform access fee helps us maintain the platform, verify job listings, and provide quality resources. It's a one-time payment that gives you lifetime access.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">What payment methods do you accept?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    We accept all major payment methods including Mobile Money and Cards securely via PesaPal.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Can I buy guides separately?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Yes! After unlocking the platform for $1, you can purchase Low Paying Guides ($2) or High Paying Guides ($5) based on your needs.
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
