import { Link } from "react-router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { FileText, Scale, Shield, CreditCard, Users, AlertTriangle, Mail } from "lucide-react";

export default function Terms() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <FileText className="h-8 w-8 text-primary" />
              <h1 className="text-4xl font-bold">Terms and Conditions</h1>
            </div>
            <p className="text-muted-foreground text-lg">
              Last updated: March 31, 2026
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="h-5 w-5" />
                Acceptance of Terms
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                By accessing and using WorkAI Academy, you accept and agree to be bound by the terms
                and provision of this agreement. If you do not agree to abide by the above, please do
                not use this service.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Use License</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Permission is granted to temporarily access the materials (information or software)
                on WorkAI Academy's website for personal, non-commercial transitory viewing only.
                This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose or for any public display</li>
                <li>Attempt to decompile or reverse engineer any software contained on the website</li>
                <li>Remove any copyright or other proprietary notations from the materials</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Service Description
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                WorkAI Academy provides:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>AI training job application guides and resources</li>
                <li>Remote work opportunity listings</li>
                <li>Educational content for career development</li>
                <li>Consultation services for professional guidance</li>
                <li>Access to premium content and features</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Terms
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Pricing and Payment</h3>
                <p className="text-muted-foreground">
                  All prices are listed in USD and are subject to change. Payment is processed securely
                  through Paystack. You agree to pay all charges associated with your account.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Refunds</h3>
                <p className="text-muted-foreground">
                  Digital products and services are generally non-refundable. Refunds may be considered
                  on a case-by-case basis within 7 days of purchase for technical issues or service
                  unavailability.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Subscription Services</h3>
                <p className="text-muted-foreground">
                  Subscription services automatically renew unless cancelled. You are responsible for
                  timely payment of all fees.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                User Accounts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                When you create an account with us, you must provide information that is accurate,
                complete, and current at all times. You are responsible for:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Safeguarding your account password</li>
                <li>All activities that occur under your account</li>
                <li>Notifying us immediately of any unauthorized use</li>
                <li>Providing accurate and up-to-date information</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Content and Conduct</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                You agree not to use the service to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe on intellectual property rights</li>
                <li>Transmit harmful or malicious code</li>
                <li>Harass, abuse, or harm others</li>
                <li>Post false or misleading information</li>
                <li>Attempt to gain unauthorized access to our systems</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Intellectual Property</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                The service and its original content, features, and functionality are and will remain
                the exclusive property of WorkAI Academy and its licensors. The service is protected by
                copyright, trademark, and other laws.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Disclaimers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                The information on this website is provided on an 'as is' basis. To the fullest extent
                permitted by law, WorkAI Academy:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Excludes all representations and warranties relating to this website and its contents</li>
                <li>Does not guarantee job placement or income outcomes</li>
                <li>Is not responsible for third-party services or opportunities</li>
                <li>Does not warrant that the service will be uninterrupted or error-free</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Limitation of Liability</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                In no event shall WorkAI Academy, nor its directors, employees, partners, agents,
                suppliers, or affiliates, be liable for any indirect, incidental, special, consequential,
                or punitive damages, including without limitation, loss of profits, data, use, goodwill,
                or other intangible losses.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Termination</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We may terminate or suspend your account immediately, without prior notice or liability,
                for any reason whatsoever, including without limitation if you breach the Terms.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Governing Law</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                These Terms shall be interpreted and governed by the laws of Kenya, without regard to
                its conflict of law provisions. Our failure to enforce any right or provision of these
                Terms will not be considered a waiver of those rights.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Changes to Terms</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time.
                If a revision is material, we will try to provide at least 30 days notice prior to any new
                terms taking effect.
              </p>
            </CardContent>
          </Card>

         

          <div className="text-center mt-8">
            <Link to="/">
              <Button variant="outline">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}