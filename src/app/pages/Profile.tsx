import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { useUnlock } from "../contexts/UnlockContext";
import { supabase } from "../../lib/supabase";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Loader2, BookOpen, User, Lock, CheckCircle2, Settings } from "lucide-react";
import { Link } from "react-router";


export default function Profile() {
  const { user, isAdmin } = useAuth();
  const { isUnlocked } = useUnlock();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [guides, setGuides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    const fetchProfile = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
        
      const { data: guidesData } = await supabase
        .from("guides")
        .select("*")
        .order("id");
        
      setProfile(data);
      if (guidesData) setGuides(guidesData);
      setLoading(false);
    };
    fetchProfile();
  }, [user, navigate]);

  const unlockedCount = isUnlocked || isAdmin ? guides.length : 0;
  const progressPercent = guides.length > 0 ? Math.round((unlockedCount / guides.length) * 100) : 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="max-w-4xl mx-auto py-16 px-4 space-y-8">

        {/* Profile Card */}
        <Card className="border-2">
          <CardContent className="pt-8 pb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <User className="w-10 h-10 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl font-bold">
                    {profile?.full_name || user?.user_metadata?.full_name || "User"}
                  </h1>
                  {isAdmin && <Badge className="bg-primary/20 text-primary border-primary">Admin</Badge>}
                  {isUnlocked && !isAdmin && <Badge className="bg-green-500/20 text-green-600 border-green-500">Unlocked</Badge>}
                </div>
                <p className="text-muted-foreground mt-1">{user?.email}</p>
                {profile?.bio && (
                  <p className="text-sm text-muted-foreground mt-2 italic">"{profile.bio}"</p>
                )}
                {profile?.goals && profile.goals.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {profile.goals.map((goal: string) => (
                      <span key={goal} className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                        {goal}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <Link to="/profile-setup">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Edit Profile
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Progress Section */}
        <div>
          <h2 className="text-xl font-bold mb-4">Course Progress</h2>
          <Card className="border-2 mb-6">
            <CardContent className="pt-6 pb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium">Guides Unlocked</span>
                <span className="text-sm font-bold text-primary">{unlockedCount} / {guides.length}</span>
              </div>
              <div className="w-full h-3 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-3 rounded-full bg-primary transition-all duration-700"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {isUnlocked || isAdmin
                  ? "🎉 You have full access to all guides!"
                  : "Unlock the platform to access all course materials."}
              </p>
              {!isUnlocked && !isAdmin && (
                <Link to="/payment">
                  <Button className="mt-4 bg-primary hover:bg-primary/90 w-full">
                    Unlock All Guides
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>

          {/* Guide List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {guides.map((guide) => {
              const isAccessible = isUnlocked || isAdmin;
              return (
                <Card key={guide.path} className={`border ${isAccessible ? "border-primary/20" : "border-border opacity-60"}`}>
                  <CardHeader className="pb-3 pt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${isAccessible ? "bg-primary/10" : "bg-muted"}`}>
                          {isAccessible ? (
                            <CheckCircle2 className="w-5 h-5 text-primary" />
                          ) : (
                            <Lock className="w-5 h-5 text-muted-foreground" />
                          )}
                        </div>
                        <div>
                          <CardTitle className="text-sm">{guide.title}</CardTitle>
                          <Badge variant="outline" className="text-xs mt-0.5">
                            {guide.tier === "high" ? "High Paying" : "Low Paying"}
                          </Badge>
                        </div>
                      </div>
                      {isAccessible && (
                        <Link to={`/guides/${guide.path}`}>
                          <Button size="sm" variant="outline" className="flex items-center gap-1">
                            <BookOpen className="w-3 h-3" />
                            Open
                          </Button>
                        </Link>
                      )}
                    </div>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
