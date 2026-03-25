import { Link, useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { LayoutDashboard, BriefcaseBusiness, Globe, BookOpen, DollarSign, User, LogOut, Moon, Sun } from "lucide-react";
import { useTheme } from "../components/ThemeProvider";
import { useUnlock } from "../contexts/UnlockContext";
import { supabase } from "../../lib/supabase";

export default function Dashboard() {
  const { theme, toggleTheme } = useTheme();
  const { isUnlocked } = useUnlock();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-sidebar p-4 flex flex-col">
        <div className="mb-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold">W</span>
            </div>
            <span className="font-bold text-lg">WorkAI Academy</span>
          </Link>
        </div>

        <nav className="flex-1 space-y-2">
          <Link to="/dashboard">
            <Button variant="default" className="w-full justify-start gap-2 bg-primary">
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Button>
          </Link>
          <Link to="/ai-jobs">
            <Button variant="ghost" className="w-full justify-start gap-2">
              <BriefcaseBusiness className="w-4 h-4" />
              AI Jobs
            </Button>
          </Link>
          <Link to="/remote-jobs">
            <Button variant="ghost" className="w-full justify-start gap-2">
              <Globe className="w-4 h-4" />
              Remote Jobs
            </Button>
          </Link>
          <Link to="/guides">
            <Button variant="ghost" className="w-full justify-start gap-2">
              <BookOpen className="w-4 h-4" />
              Low Paying Guides
            </Button>
          </Link>
          <Link to="/guides">
            <Button variant="ghost" className="w-full justify-start gap-2">
              <DollarSign className="w-4 h-4" />
              High Paying Guides
            </Button>
          </Link>
        </nav>

        <div className="space-y-2 pt-4 border-t border-border">
          <Button variant="ghost" className="w-full justify-start gap-2">
            <User className="w-4 h-4" />
            Profile
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start gap-2"
            onClick={toggleTheme}
          >
            {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            {theme === "light" ? "Dark Mode" : "Light Mode"}
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2 text-destructive hover:text-destructive" onClick={handleLogout}>
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Welcome back!</h1>
            <p className="text-muted-foreground">Here's what's happening with your AI remote work journey</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Active Jobs</CardDescription>
                <CardTitle className="text-3xl">24</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge className="bg-primary/10 text-primary border-0">+3 new</Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Applications</CardDescription>
                <CardTitle className="text-3xl">12</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge className="bg-secondary/10 text-secondary border-0">In progress</Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Guides Unlocked</CardDescription>
                <CardTitle className="text-3xl">{isUnlocked ? "6" : "0"}</CardTitle>
              </CardHeader>
              <CardContent>
                {isUnlocked ? (
                  <Badge className="bg-primary/10 text-primary border-0">All Access</Badge>
                ) : (
                  <Badge className="bg-muted text-muted-foreground border-0">Get started</Badge>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Success Rate</CardDescription>
                <CardTitle className="text-3xl">85%</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge className="bg-accent/10 text-accent-foreground border-0">Excellent</Badge>
              </CardContent>
            </Card>
          </div>

          {/* Recent Jobs */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Recent AI Jobs</CardTitle>
                <CardDescription>Latest opportunities for you</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <BriefcaseBusiness className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">AI Training - Outlier</h4>
                      <p className="text-sm text-muted-foreground">$15-$20/hour</p>
                    </div>
                    <Link to="/ai-jobs">
                      <Button size="sm" variant="outline">View</Button>
                    </Link>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
                      <BriefcaseBusiness className="w-5 h-5 text-secondary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">Data Annotation - Scale AI</h4>
                      <p className="text-sm text-muted-foreground">$18-$25/hour</p>
                    </div>
                    <Link to="/ai-jobs">
                      <Button size="sm" variant="outline">View</Button>
                    </Link>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <BriefcaseBusiness className="w-5 h-5 text-accent-foreground" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">AI Evaluator - Telus AI</h4>
                      <p className="text-sm text-muted-foreground">$12-$18/hour</p>
                    </div>
                    <Link to="/ai-jobs">
                      <Button size="sm" variant="outline">View</Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recommended Guides</CardTitle>
                <CardDescription>Boost your success rate</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg border-2 border-primary/20 bg-primary/5">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold">Low Paying Guides</h4>
                      <Badge className="bg-primary">{isUnlocked ? "Unlocked" : "$2"}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Perfect for beginners. Includes Appen, Remotasks, and Clickworker guides.
                    </p>
                    {isUnlocked ? (
                      <Link to="/guides">
                        <Button className="w-full bg-primary hover:bg-primary/90" size="sm" variant="outline">
                          View Guides
                        </Button>
                      </Link>
                    ) : (
                      <a href="https://paystack.shop/pay/0i3uddyszm" target="_blank" rel="noopener noreferrer" className="block w-full">
                        <Button className="w-full bg-primary hover:bg-primary/90" size="sm">
                          Unlock Now
                        </Button>
                      </a>
                    )}
                  </div>

                  <div className="p-4 rounded-lg border-2 border-secondary/20 bg-secondary/5">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold">High Paying Guides</h4>
                      <Badge className="bg-secondary">{isUnlocked ? "Unlocked" : "$5"}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Advanced opportunities. Outlier AI, Telus AI, and Scale AI guides.
                    </p>
                    {isUnlocked ? (
                      <Link to="/guides">
                        <Button className="w-full bg-secondary hover:bg-secondary/90" size="sm" variant="outline">
                          View Guides
                        </Button>
                      </Link>
                    ) : (
                      <a href="https://paystack.shop/pay/efowzo7m02" target="_blank" rel="noopener noreferrer" className="block w-full">
                        <Button className="w-full bg-secondary hover:bg-secondary/90" size="sm">
                          Unlock Now
                        </Button>
                      </a>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Activity Section */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest actions on the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <div className="flex-1">
                    <p className="font-medium">Account unlocked</p>
                    <p className="text-sm text-muted-foreground">Welcome to WorkAI Academy!</p>
                  </div>
                  <span className="text-sm text-muted-foreground">Just now</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-muted"></div>
                  <div className="flex-1">
                    <p className="font-medium">Profile created</p>
                    <p className="text-sm text-muted-foreground">Your profile is ready</p>
                  </div>
                  <span className="text-sm text-muted-foreground">2 mins ago</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
