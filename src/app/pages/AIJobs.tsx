import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Search, MapPin, Clock, DollarSign, ExternalLink } from "lucide-react";
import { useUnlock } from "../contexts/UnlockContext";
import { motion } from "motion/react";
import { Link } from "react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabase";
import { Loader2 } from "lucide-react";

function parseHourlyPay(pay: string | null | undefined): number | null {
  if (!pay) return null;
  const m = pay.replace(/,/g, "").match(/(\d+(\.\d+)?)/);
  if (!m) return null;
  return parseFloat(m[1]);
}

function matchesPayFilter(payStr: string | null | undefined, filter: string): boolean {
  if (filter === "all") return true;
  const n = parseHourlyPay(payStr);
  if (n == null) return false;
  if (filter === "low") return n >= 10 && n < 15;
  if (filter === "medium") return n >= 15 && n < 20;
  if (filter === "high") return n >= 20;
  return true;
}

function matchesCompany(company: string | null | undefined, filter: string): boolean {
  if (filter === "all") return true;
  const c = (company || "").toLowerCase();
  const map: Record<string, string[]> = {
    outlier: ["outlier"],
    scale: ["scale"],
    telus: ["telus"],
    appen: ["appen"],
  };
  const needles = map[filter];
  return needles?.some((n) => c.includes(n)) ?? false;
}

export default function AIJobs() {
  const { isUnlocked } = useUnlock();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [payFilter, setPayFilter] = useState("all");
  const [companyFilter, setCompanyFilter] = useState("all");
  const [applied, setApplied] = useState({ search: "", pay: "all", company: "all" });

  const applyFilters = () => {
    setApplied({
      search: searchInput.trim(),
      pay: payFilter,
      company: companyFilter,
    });
  };

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      if (applied.search) {
        const q = applied.search.toLowerCase();
        const hay = [job.title, job.company, job.description, job.requirements]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (!matchesPayFilter(job.pay, applied.pay)) return false;
      if (!matchesCompany(job.company, applied.company)) return false;
      return true;
    });
  }, [jobs, applied]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data, error } = await supabase.from('ai_jobs').select('*').order('id', { ascending: false });
        if (!error && data) setJobs(data);
      } catch (err) {
        console.error("Error fetching AI jobs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

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
                    <Link to="/checkout?product=platform&amount=1" className="block w-full">
                      <Button className="w-full bg-primary hover:bg-primary/90" size="lg">
                        Unlock for $1
                      </Button>
                    </Link>
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
          <div className="flex flex-col md:flex-row gap-4 mb-8 md:items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search jobs..."
                className="pl-10"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && applyFilters()}
              />
            </div>
            <Select value={payFilter} onValueChange={setPayFilter}>
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
            <Select value={companyFilter} onValueChange={setCompanyFilter}>
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
            <Button type="button" className="w-full md:w-auto shrink-0" onClick={applyFilters}>
              Search
            </Button>
          </div>

          {/* Job Listings */}
          {loading ? (
             <div className="flex justify-center py-12">
               <Loader2 className="w-8 h-8 animate-spin text-primary" />
             </div>
          ) : jobs.length === 0 ? (
             <div className="text-center py-12 text-muted-foreground">
               No AI jobs found. Add some from the Admin Panel.
             </div>
          ) : filteredJobs.length === 0 ? (
             <div className="text-center py-12 text-muted-foreground">
               No jobs match your search or filters. Try different keywords or reset filters.
             </div>
          ) : (
             <motion.div 
               className="grid grid-cols-1 gap-6"
               initial="hidden"
               animate="visible"
               variants={{
                 visible: { transition: { staggerChildren: 0.1 } }
               }}
             >
               {filteredJobs.map((job) => (
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
                            {(job.company || "?")[0]}
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

                    <a href={job.apply_link || "#"} target="_blank" rel="noopener noreferrer" className="block">
                      <Button className="bg-primary hover:bg-primary/90 w-full">
                        Apply Now
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </Button>
                    </a>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
          )}

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
                  <Link to="/guides">
                    <Button className="bg-primary hover:bg-primary/90 w-full sm:w-auto">
                      Low Paying Guides - $2
                    </Button>
                  </Link>
                  <Link to="/guides">
                    <Button className="bg-secondary hover:bg-secondary/90 w-full sm:w-auto">
                      High Paying Guides - $5
                    </Button>
                  </Link>
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
