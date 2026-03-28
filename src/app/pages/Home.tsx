import { Link } from "react-router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Sparkles, BriefcaseBusiness, GraduationCap, Shield, Zap, Target, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";

const testimonials = [
  {
    id: 1,
    name: "Michael Wanjala",
    role: "Data Annotator at Outlier AI",
    initials: "MW",
    text: "WorkAI Academy helped me land my first AI training job. The application guides are comprehensive and helped me avoid common pitfalls.",
    color: "primary"
  },
  {
    id: 2,
    name: "Acquiller Jenkins",
    role: "AI Trainer at Scale AI",
    initials: "AJ",
    text: "Amazing platform! I got accepted into Scale AI within a week of following the premium guides. The interview prep was spot on.",
    color: "secondary"
  },
  {
    id: 3,
    name: "David Ochieng",
    role: "Remote Task Specialist",
    initials: "DO",
    text: "The one dollar investment was the best decision I made. I'm now earning a consistent income completing tasks remotely.",
    color: "accent"
  },
  {
    id: 4,
    name: "Priya Sharma",
    role: "Prompt Engineer at Telus",
    initials: "PS",
    text: "I had no prior experience, but the step-by-step walkthroughs were easy to follow. I just passed my qualification exams!",
    color: "primary"
  },
  {
    id: 5,
    name: "Jessica Taylor",
    role: "Evaluator at Appen",
    initials: "JT",
    text: "The guides saved me so much time. Having all verified requirements in one place means I spend less time searching and more time earning.",
    color: "secondary"
  },
  {
    id: 6,
    name: "Ahmed Hassan",
    role: "AI Quality Assurance",
    initials: "AH",
    text: "Highly recommend the Guides pack. The strategies for maximizing hourly rates have consistently increased my weekly earnings.",
    color: "accent"
  }
];

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors py-1.5 px-4 text-sm">
              Start Your AI Career Today
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Train, Apply, and Get AI Remote Jobs
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Unlock verified AI training jobs, remote work guides, and interview preparation. Start your journey to financial freedom with AI remote work.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" className="bg-primary hover:bg-primary/90 w-full sm:w-auto">
                  Get Started
                </Button>
              </Link>
              <Link to="/register">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-2">
                  Unlock Platform ($1)
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Unlock Banner */}
      <section className="py-8 px-4 bg-accent/5 border-y border-accent/20">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-lg mb-3">
            🔓 One-time $1 access required to unlock the WorkAI Academy platform
          </p>
          <Link to="/register">
            <Button className="bg-primary hover:bg-primary/90">
              Unlock Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-muted-foreground text-lg">
              Comprehensive resources for your AI remote work journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="border-2 hover:border-primary/50 transition-all">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <BriefcaseBusiness className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>AI Training Jobs</CardTitle>
                <CardDescription>
                  Access verified AI training opportunities from top platforms like Outlier AI, Telus AI, and Scale AI.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-secondary/50 transition-all">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-secondary" />
                </div>
                <CardTitle>Remote Work Opportunities</CardTitle>
                <CardDescription>
                  Find legitimate remote jobs with flexible hours that fit your lifestyle and schedule.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-accent/50 transition-all">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  <GraduationCap className="w-6 h-6 text-accent-foreground" />
                </div>
                <CardTitle>Interview Preparation</CardTitle>
                <CardDescription>
                  Get ready for AI job interviews with our comprehensive guides and practice materials.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-all">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>AI Job Guides</CardTitle>
                <CardDescription>
                  Step-by-step guides for applying to and succeeding in AI training jobs.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-secondary/50 transition-all">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-secondary" />
                </div>
                <CardTitle>Secure Payments</CardTitle>
                <CardDescription>
                  Multiple payment options including M-Pesa, Paystack, and card payments.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-accent/50 transition-all">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6 text-accent-foreground" />
                </div>
                <CardTitle>Premium Resources</CardTitle>
                <CardDescription>
                  Access exclusive guides, templates, and resources to accelerate your success.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-muted-foreground text-lg">
              Choose the plan that fits your goals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-2">
              <CardHeader>
                <CardTitle>Starter Access</CardTitle>
                <CardDescription>Get access to the platform</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">$1</span>
                  <span className="text-muted-foreground"> one-time</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    <span>Dashboard access</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    <span>AI job listings</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    <span>Remote jobs</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    <span>Basic resources</span>
                  </li>
                </ul>
                <Link to="/pricing" className="block mt-6">
                  <Button className="w-full" variant="outline">View Details</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-primary">Recommended</Badge>
              </div>
              <CardHeader>
                <CardTitle>Low Paying Guides</CardTitle>
                <CardDescription>Perfect for beginners</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">$2</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    <span>Beginner AI training guides</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    <span>Appen guide</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    <span>Remotasks guide</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    <span>Clickworker guide</span>
                  </li>
                </ul>
                <Link to="/pricing" className="block mt-6">
                  <Button className="w-full bg-primary hover:bg-primary/90">View Details</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <CardTitle>High Paying Guides</CardTitle>
                <CardDescription>Advanced opportunities</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">$5</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    <span>Outlier AI guide</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    <span>Telus AI guide</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    <span>Scale AI guide</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    <span>Premium guides</span>
                  </li>
                </ul>
                <Link to="/pricing" className="block mt-6">
                  <Button className="w-full" variant="outline">View Details</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Success Stories
            </h2>
            <p className="text-muted-foreground text-lg">
              Join thousands of successful AI remote workers
            </p>
          </div>

          <div className="relative overflow-hidden w-full py-4 -mx-4 px-4">
            <motion.div 
              className="flex gap-6 w-max"
              animate={{ x: ["0%", "-50%"] }}
              transition={{
                repeat: Infinity,
                ease: "linear",
                duration: 30,
              }}
            >
              {[...testimonials, ...testimonials].map((t, index) => (
                <Card key={`${t.id}-${index}`} className="w-[350px] flex-shrink-0">
                  <CardContent className="pt-6 h-full flex flex-col justify-between">
                    <div className="mb-4">
                      <div className="flex items-center gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className="text-accent">★</span>
                        ))}
                      </div>
                      <p className="text-muted-foreground italic line-clamp-4">"{t.text}"</p>
                    </div>
                    <div className="flex items-center gap-3 mt-auto">
                      <div className={`w-10 h-10 rounded-full bg-${t.color}/10 flex items-center justify-center`}>
                        <span className={`font-semibold text-${t.color === 'accent' ? 'accent-foreground' : t.color}`}>{t.initials}</span>
                      </div>
                      <div>
                        <p className="font-semibold">{t.name}</p>
                        <p className="text-sm text-muted-foreground">{t.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
