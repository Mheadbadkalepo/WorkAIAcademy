import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Search, MapPin, Clock, DollarSign, ExternalLink, Lock } from "lucide-react";
import { useUnlock } from "../contexts/UnlockContext";
import { motion } from "motion/react";
import { Link } from "react-router";

export default function AIJobs() {
  const { isUnlocked } = useUnlock();

  const jobs = [
    {
      id: 1,
      company: "Outlier AI",
      title: "AI Training Specialist",
      type: "Remote",
      pay: "$15-$20/hour",
      location: "Worldwide",
      requirements: "Bachelor's degree, English proficiency",
      description: "Train AI models through data annotation and evaluation tasks.",
    },
    {
      id: 2,
      company: "Scale AI",
      title: "Data Annotation Expert",
      type: "Remote",
      pay: "$18-$25/hour",
      location: "Global",
      requirements: "Detail-oriented, computer literacy",
      description: "Annotate images, text, and videos for AI model training.",
    },
    {
      id: 3,
      company: "Telus AI",
      title: "AI Evaluator",
      type: "Remote",
      pay: "$12-$18/hour",
      location: "Multiple regions",
      requirements: "Attention to detail, reliable internet",
      description: "Evaluate and rate AI-generated content for quality.",
    },
    {
      id: 4,
      company: "Appen",
      title: "AI Trainer",
      type: "Remote",
      pay: "$10-$15/hour",
      location: "Worldwide",
      requirements: "Native language skills, basic tech knowledge",
      description: "Complete various AI training tasks and micro-tasks.",
    },
  ];

  if (!isUnlocked) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="relative">
              <div className="absolute inset-0 bg-background/80 backdrop-blur-md z-10 rounded-2xl flex items-center justify-center">
                <Card className="border-2 border-primary max-w-md">
                  <CardHeader>
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <span className="text-4xl">🔒</span>
                    </div>
                    <CardTitle className="text-2xl">Unlock WorkAI Academy</CardTitle>
                    <CardDescription>
                      Access AI jobs, remote work guides, and premium resources for just $1
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 mb-6 text-left">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                        <span className="text-sm">AI training jobs</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                        <span className="text-sm">Remote work listings</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                        <span className="text-sm">Interview preparation</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                        <span className="text-sm">Job guides</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                        <span className="text-sm">Dashboard access</span>
                      </div>
                    </div>
                    <a href="https://paystack.shop/pay/r2d6a4fmb1" target="_blank" rel="noopener noreferrer" className="block w-full">
                      <Button className="w-full bg-primary hover:bg-primary/90" size="lg">
                        Unlock for $1
                      </Button>
                    </a>
                  </CardContent>
                </Card>
              </div>

              <div className="blur-sm pointer-events-none">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <Card key={i} className="h-48"></Card>
                  ))}
                </div>
              </div>
            </div>
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
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">AI Training Jobs</h1>
            <p className="text-xl text-muted-foreground">
              Discover verified AI training opportunities from top platforms
            </p>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input placeholder="Search jobs..." className="pl-10" />
            </div>
            <Select>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Pay Rate" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Rates</SelectItem>
                <SelectItem value="low">$10-$15/hr</SelectItem>
                <SelectItem value="medium">$15-$20/hr</SelectItem>
                <SelectItem value="high">$20+/hr</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Company" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Companies</SelectItem>
                <SelectItem value="outlier">Outlier AI</SelectItem>
                <SelectItem value="scale">Scale AI</SelectItem>
                <SelectItem value="telus">Telus AI</SelectItem>
                <SelectItem value="appen">Appen</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Job Listings */}
          <motion.div 
            className="grid grid-cols-1 gap-6"
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.1 } }
            }}
          >
            {jobs.map((job) => (
              <motion.div 
                key={job.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
              >
                <Card className="border-2 hover:border-primary/50 transition-all">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center">
                          <span className="font-bold text-primary text-lg">
                            {job.company[0]}
                          </span>
                        </div>
                        <div>
                          <CardTitle className="text-xl mb-1">{job.title}</CardTitle>
                          <CardDescription className="text-base">{job.company}</CardDescription>
                        </div>
                      </div>
                      <Badge className="bg-accent/10 text-accent-foreground border-accent">
                        {job.type}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{job.description}</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="flex items-center gap-2 text-sm">
                        <DollarSign className="w-4 h-4 text-muted-foreground" />
                        <span>{job.pay}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span>Flexible hours</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-semibold mb-2">Requirements:</h4>
                      <p className="text-sm text-muted-foreground">{job.requirements}</p>
                    </div>

                    <div className="flex gap-3">
                      <Button className="bg-primary hover:bg-primary/90">
                        Apply Now
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </Button>
                      <Button variant="outline">
                        View Guide
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Section */}
          <Card className="mt-12 border-2 border-accent/20 bg-accent/5">
            <CardContent className="py-8">
              <div className="text-center max-w-2xl mx-auto">
                <h3 className="text-2xl font-bold mb-3">
                  Need help getting started?
                </h3>
                <p className="text-muted-foreground mb-6">
                  Unlock our comprehensive guides to increase your chances of getting hired
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button className="bg-primary hover:bg-primary/90">
                    Low Paying Guides - $2
                  </Button>
                  <Button className="bg-secondary hover:bg-secondary/90">
                    High Paying Guides - $5
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
}
