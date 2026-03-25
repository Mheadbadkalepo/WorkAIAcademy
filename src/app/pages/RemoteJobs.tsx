import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Search, MapPin, Clock, DollarSign } from "lucide-react";
import { useUnlock } from "../contexts/UnlockContext";
import { motion } from "motion/react";
import { Link } from "react-router";

export default function RemoteJobs() {
  const { isUnlocked } = useUnlock();
  const jobs = [
    {
      id: 1,
      company: "Clickworker",
      title: "Micro Task Worker",
      type: "Remote",
      pay: "$8-$12/hour",
      location: "Worldwide",
      category: "Micro Tasks",
    },
    {
      id: 2,
      company: "Remotasks",
      title: "Task Specialist",
      type: "Remote",
      pay: "$10-$15/hour",
      location: "Global",
      category: "Data Entry",
    },
    {
      id: 3,
      company: "Various Platforms",
      title: "Virtual Assistant",
      type: "Remote",
      pay: "$12-$20/hour",
      location: "Multiple regions",
      category: "Administrative",
    },
    {
      id: 4,
      company: "Freelance Platforms",
      title: "Content Writer",
      type: "Remote",
      pay: "$15-$30/hour",
      location: "Worldwide",
      category: "Writing",
    },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">Remote Jobs</h1>
            <p className="text-xl text-muted-foreground">
              Find legitimate remote work opportunities with flexible hours
            </p>
          </div>

          {/* Search */}
          <div className="flex gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input placeholder="Search remote jobs..." className="pl-10" />
            </div>
            <Button>Search</Button>
          </div>

          {/* Job Listings */}
          <div className="relative">
            {!isUnlocked && (
              <div className="absolute inset-0 bg-background/80 backdrop-blur-md z-10 rounded-2xl flex items-center justify-center -m-4 p-4">
                <Card className="border-2 border-secondary max-w-md w-full">
                  <CardHeader>
                    <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-4">
                      <span className="text-4xl">🔒</span>
                    </div>
                    <CardTitle className="text-2xl text-center">Premium Access Required</CardTitle>
                    <CardDescription className="text-center">
                      Join WorkAI Academy to view these listings
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <a href="https://paystack.shop/pay/r2d6a4fmb1" target="_blank" rel="noopener noreferrer" className="block w-full">
                      <Button className="w-full bg-secondary hover:bg-secondary/90" size="lg">
                        Unlock for $1
                      </Button>
                    </a>
                  </CardContent>
                </Card>
              </div>
            )}
            
            <motion.div 
              className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${!isUnlocked ? "blur-sm pointer-events-none" : ""}`}
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
                  <Card className="border-2 hover:border-secondary/50 transition-all h-full flex flex-col">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <CardTitle className="mb-1">{job.title}</CardTitle>
                          <CardDescription>{job.company}</CardDescription>
                        </div>
                        <Badge className="bg-secondary/10 text-secondary border-secondary">
                          {job.category}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="flex flex-col flex-1 pb-6">
                      <div className="space-y-3 mb-6 flex-1">
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
                          <span>Flexible schedule</span>
                        </div>
                      </div>

                      <Button className="w-full bg-secondary hover:bg-secondary/90 mt-auto">
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
