import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Lock, BookOpen, CheckCircle2 } from "lucide-react";
import { useUnlock } from "../contexts/UnlockContext";
import { useAuth } from "../contexts/AuthContext";

export default function Guides() {
  const { isUnlocked, lowGuidesUnlocked, highGuidesUnlocked } = useUnlock();
  const { isAdmin } = useAuth();
  
  const hardcodedGuides = [
    { id: 1, title: 'Appen Account Guide', description: 'Master the Appen ecosystem and land high-paying AI annotation tasks.', path: 'appen', lessons: 12, tier: 'low' },
    { id: 2, title: 'Outlier Account Guide', description: 'Learn how to navigate Outlier completely.', path: 'outlier', lessons: 10, tier: 'high' },
    { id: 3, title: 'Remotask Account Guide', description: 'Become a top Remotasker.', path: 'remotask', lessons: 8, tier: 'low' },
    { id: 4, title: 'Telus Guide', description: 'Insights for Telus International rating.', path: 'telus', lessons: 14, tier: 'high' },
    { id: 5, title: 'Scale AI Guide', description: 'Advanced tasks via Scale AI.', path: 'scaleai', lessons: 9, tier: 'high' },
    { id: 6, title: 'Clickworker Guide', description: 'Maximize your earnings on Clickworker.', path: 'clickworker', lessons: 7, tier: 'low' }
  ];

  const isLowLocked = (guide: any) => {
    if (isAdmin) return false;
    if (!isUnlocked) return true; // Must unlock platform first
    if (lowGuidesUnlocked) return false;
    return true; // Platform unlocked but guides not purchased
  };

  const isHighLocked = (guide: any) => {
    if (isAdmin) return false;
    if (!isUnlocked) return true;
    if (highGuidesUnlocked) return false;
    return true;
  };

  const lowPayingGuides = hardcodedGuides.filter(g => g.tier === 'low').map(g => ({ ...g, locked: isLowLocked(g) }));
  const highPayingGuides = hardcodedGuides.filter(g => g.tier === 'high').map(g => ({ ...g, locked: isHighLocked(g) }));

  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold mb-4">Job Guides</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Unlock comprehensive guides to boost your success rate and start earning faster
            </p>
          </div>

          {/* Low Paying Guides */}
          <div className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Low Paying Guides</h2>
                <p className="text-muted-foreground">Perfect for beginners - $2</p>
              </div>
              {/* Unlock CTA for low paying guides */}
              {!isUnlocked ? (
                <Link to="/payment">
                  <Button className="bg-primary hover:bg-primary/90">Unlock Platform First - $1</Button>
                </Link>
              ) : !lowGuidesUnlocked ? (
                <a href="https://paystack.shop/pay/0i3uddyszm" target="_blank" rel="noopener noreferrer">
                  <Button className="bg-primary hover:bg-primary/90">Unlock Low Guides - $2</Button>
                </a>
              ) : null}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {lowPayingGuides.map((guide) => (
                <Card key={guide.id} className="border-2 relative overflow-hidden">
                  {guide.locked && (
                    <div className="absolute top-4 right-4 z-10">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Lock className="w-5 h-5 text-primary" />
                      </div>
                    </div>
                  )}
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <BookOpen className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle>{guide.title}</CardTitle>
                    <CardDescription>{guide.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{guide.lessons} lessons</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Lifetime access</span>
                      </div>
                    </div>
                    {guide.locked ? (
                      <div className="space-y-2">
                        {!isUnlocked ? (
                          <Link to="/payment" className="w-full block">
                            <Button variant="outline" className="w-full text-xs">🔐 Unlock Platform First ($1)</Button>
                          </Link>
                        ) : (
                          <a href="https://paystack.shop/pay/0i3uddyszm" target="_blank" rel="noopener noreferrer" className="w-full block">
                            <Button variant="outline" className="w-full text-xs">🔓 Unlock Low Guides ($2)</Button>
                          </a>
                        )}
                      </div>
                    ) : (
                      <Link to={`/guides/${guide.path}`} className="w-full block">
                        <Button variant="outline" className="w-full cursor-pointer hover:bg-primary/10">
                          Start Learning
                        </Button>
                      </Link>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* High Paying Guides */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">High Paying Guides</h2>
                <p className="text-muted-foreground">Advanced opportunities - $5</p>
              </div>
              {/* Unlock CTA for high paying guides */}
              {!isUnlocked ? (
                <Link to="/payment">
                  <Button className="bg-secondary hover:bg-secondary/90">Unlock Platform First - $1</Button>
                </Link>
              ) : !highGuidesUnlocked ? (
                <a href="https://paystack.shop/pay/efowzo7m02" target="_blank" rel="noopener noreferrer">
                  <Button className="bg-secondary hover:bg-secondary/90">Unlock High Guides - $5</Button>
                </a>
              ) : null}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {highPayingGuides.map((guide) => (
                <Card key={guide.id} className="border-2 relative overflow-hidden">
                  {guide.locked && (
                    <div className="absolute top-4 right-4 z-10">
                      <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                        <Lock className="w-5 h-5 text-secondary" />
                      </div>
                    </div>
                  )}
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
                      <BookOpen className="w-6 h-6 text-secondary" />
                    </div>
                    <CardTitle>{guide.title}</CardTitle>
                    <CardDescription>{guide.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{guide.lessons} lessons</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Lifetime access</span>
                      </div>
                    </div>
                    {guide.locked ? (
                      <div className="space-y-2">
                        {!isUnlocked ? (
                          <Link to="/payment" className="w-full block">
                            <Button variant="outline" className="w-full text-xs">🔐 Unlock Platform First ($1)</Button>
                          </Link>
                        ) : (
                          <a href="https://paystack.shop/pay/efowzo7m02" target="_blank" rel="noopener noreferrer" className="w-full block">
                            <Button variant="outline" className="w-full text-xs">🔓 Unlock High Guides ($5)</Button>
                          </a>
                        )}
                      </div>
                    ) : (
                      <Link to={`/guides/${guide.path}`} className="w-full block">
                        <Button variant="outline" className="w-full cursor-pointer hover:bg-secondary/10">
                          Start Learning
                        </Button>
                      </Link>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <Card className="mt-16 border-2 border-accent/20 bg-accent/5">
            <CardContent className="py-12">
              <div className="text-center max-w-2xl mx-auto">
                <h3 className="text-3xl font-bold mb-4">
                  Boost Your Success Rate
                </h3>
                <p className="text-muted-foreground text-lg mb-6">
                  Our guides include application tips, interview preparation, task walkthroughs, and proven strategies to help you get hired faster and earn more.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a href="https://paystack.shop/pay/0i3uddyszm" target="_blank" rel="noopener noreferrer">
                    <Button size="lg" className="bg-primary hover:bg-primary/90">
                      Get Low Paying Guides - $2
                    </Button>
                  </a>
                  <a href="https://paystack.shop/pay/efowzo7m02" target="_blank" rel="noopener noreferrer">
                    <Button size="lg" className="bg-secondary hover:bg-secondary/90">
                      Get High Paying Guides - $5
                    </Button>
                  </a>
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
