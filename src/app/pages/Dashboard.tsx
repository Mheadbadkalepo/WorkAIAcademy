import { Link, useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { LayoutDashboard, BriefcaseBusiness, Globe, BookOpen, DollarSign, User, LogOut, Moon, Sun, ShieldAlert } from "lucide-react";
import { useTheme } from "../components/ThemeProvider";
import { useUnlock } from "../contexts/UnlockContext";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../../lib/supabase";
import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";

export default function Dashboard() {
  const { theme, toggleTheme } = useTheme();
  const { isUnlocked } = useUnlock();
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    activeJobs: 0,
    newJobs: 3,
    applications: 0,
    guidesUnlocked: 0,
    successRate: 0,
  });
  const [activities, setActivities] = useState<any[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) {
        setLoadingStats(false);
        return;
      }

      try {
        // Fetch total active jobs counts
        const { count: aiJobsCount } = await supabase
          .from("ai_jobs")
          .select("*", { count: "exact", head: true });

        const { count: remoteJobsCount } = await supabase
          .from("remote_jobs")
          .select("*", { count: "exact", head: true });

        // Fetch new jobs (added in last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const sevenDaysAgoStr = sevenDaysAgo.toISOString();

        const { count: newAiJobsCount } = await supabase
          .from("ai_jobs")
          .select("*", { count: "exact", head: true })
          .gte("created_at", sevenDaysAgoStr);

        const { count: newRemoteJobsCount } = await supabase
          .from("remote_jobs")
          .select("*", { count: "exact", head: true })
          .gte("created_at", sevenDaysAgoStr);

        // Fetch applications for user
        const { count: applicationsCount } = await supabase
          .from("applications")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id);

        // Calculate guides unlocked
        let finalGuidesCount = 0;
        if (isUnlocked || isAdmin) {
          const { count: allGuidesCount } = await supabase
            .from("guides")
            .select("*", { count: "exact", head: true });
          finalGuidesCount = allGuidesCount || 0;
        } else {
          const { count: guidesUnlockedCount } = await supabase
            .from("user_guides")
            .select("*", { count: "exact", head: true })
            .eq("user_id", user.id);
          finalGuidesCount = guidesUnlockedCount || 0;
        }

        // Fetch user stats (e.g. success rate). Use maybeSingle so we don't throw
        // when the row hasn't been created yet.
        const { data: userStats, error: userStatsError } = await supabase
          .from("user_stats")
          .select("success_rate")
          .eq("user_id", user.id)
          .maybeSingle();

        if (userStatsError) {
          console.warn("Failed to fetch user stats:", userStatsError.message);
        }

        // Fetch recent activities
        const { data: recentActivities } = await supabase
          .from("user_activity")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(5);

        if (recentActivities) {
          setActivities(recentActivities);
        }

        setStats({
          activeJobs: (aiJobsCount || 0) + (remoteJobsCount || 0),
          newJobs: (newAiJobsCount || 0) + (newRemoteJobsCount || 0),
          applications: applicationsCount || 0,
          guidesUnlocked: finalGuidesCount,
          successRate: userStats?.success_rate || 0,
        });
      } catch (error) {
        console.error("Error fetching Dashboard stats:", error);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchStats();
  }, [user, isUnlocked]);

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
            <img src="/logo.png" alt="WorkAI Academy Logo" className="w-9 h-9 object-contain" />
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
          {isAdmin && (
            <Link to="/admin">
              <Button variant="ghost" className="w-full justify-start gap-2 text-primary">
                <ShieldAlert className="w-4 h-4" />
                Admin Panel
              </Button>
            </Link>
          )}
          <Link to="/profile">
            <Button variant="ghost" className="w-full justify-start gap-2">
              <User className="w-4 h-4" />
              Profile
            </Button>
          </Link>
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
            <Card className="flex flex-col h-full">
              <CardHeader className="pb-3 flex-1">
                <CardDescription>Active Jobs</CardDescription>
                <CardTitle className="text-3xl">
                  {loadingStats ? "-" : stats.activeJobs}
                </CardTitle>
              </CardHeader>
              <CardContent className="mt-auto pt-0">
                <Badge className="bg-primary/10 text-primary border-0">+{stats.newJobs} new</Badge>
              </CardContent>
            </Card>

            <Card className="flex flex-col h-full">
              <CardHeader className="pb-3 flex-1">
                <CardDescription>Applications</CardDescription>
                <CardTitle className="text-3xl">
                  {loadingStats ? "-" : stats.applications}
                </CardTitle>
              </CardHeader>
              <CardContent className="mt-auto pt-0">
                <Badge className="bg-secondary/10 text-secondary border-0">In progress</Badge>
              </CardContent>
            </Card>

            <Card className="flex flex-col h-full">
              <CardHeader className="pb-3 flex-1">
                <CardDescription>Guides Unlocked</CardDescription>
                <CardTitle className="text-3xl">
                  {loadingStats ? "-" : stats.guidesUnlocked}
                </CardTitle>
              </CardHeader>
              <CardContent className="mt-auto pt-0">
                {stats.guidesUnlocked > 0 || isUnlocked ? (
                  <Badge className="bg-primary/10 text-primary border-0">All Access</Badge>
                ) : (
                  <Badge className="bg-muted text-muted-foreground border-0">Get started</Badge>
                )}
              </CardContent>
            </Card>

            <Card className="flex flex-col h-full">
              <CardHeader className="pb-3 flex-1">
                <CardDescription>Success Rate</CardDescription>
                <CardTitle className="text-3xl">
                   {loadingStats ? "-" : `${stats.successRate}%`}
                </CardTitle>
              </CardHeader>
              <CardContent className="mt-auto pt-0">
                <Badge className="bg-accent/10 text-accent-foreground border-0">
                  {stats.successRate >= 80 ? 'Excellent' : 'Good'}
                </Badge>
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
                      <Link to="/checkout?product=low_guides&amount=2" className="block w-full">
                        <Button className="w-full bg-primary hover:bg-primary/90" size="sm">
                          Unlock Now
                        </Button>
                      </Link>
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
                      <Link to="/checkout?product=high_guides&amount=5" className="block w-full">
                        <Button className="w-full bg-secondary hover:bg-secondary/90" size="sm">
                          Unlock Now
                        </Button>
                      </Link>
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
                {loadingStats ? (
                  <p className="text-sm text-muted-foreground">Loading activity...</p>
                ) : activities.length > 0 ? (
                  activities.map((activity: any) => (
                    <div key={activity.id} className="flex items-center gap-4">
                      <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{activity.title}</p>
                        {activity.description && <p className="text-sm text-muted-foreground truncate">{activity.description}</p>}
                      </div>
                      <span className="text-sm text-muted-foreground whitespace-nowrap">
                        {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-muted flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">No recent activity</p>
                      <p className="text-sm text-muted-foreground truncate">Apply for jobs or unlock guides to get started</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
