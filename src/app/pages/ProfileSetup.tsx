import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../../lib/supabase";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Loader2, User } from "lucide-react";

const GOALS = [
  "Freelance AI work",
  "Remote work",
  "Supplement income",
  "Full-time AI career",
  "Just exploring",
];

export default function ProfileSetup() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bio, setBio] = useState("");
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const toggleGoal = (goal: string) => {
    setSelectedGoals((prev) =>
      prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    setError("");
    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      full_name: user.user_metadata?.full_name || "",
      email: user.email,
      bio,
      goals: selectedGoals,
      profile_completed: true,
    });
    if (error) {
      setError("Failed to save profile. Please try again.");
      setLoading(false);
    } else {
      navigate("/profile");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="max-w-lg mx-auto py-16 px-4">
        <div className="mb-8 text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Complete Your Profile</h1>
          <p className="text-muted-foreground">Tell us a bit about yourself so we can personalize your experience.</p>
        </div>

        <Card className="border-2">
          <CardHeader>
            <CardTitle>Profile Setup</CardTitle>
            <CardDescription>This only takes a minute!</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
                  {error}
                </div>
              )}

              <div className="space-y-1">
                <Label>Name</Label>
                <Input value={user?.user_metadata?.full_name || ""} disabled className="bg-muted/30" />
                <p className="text-xs text-muted-foreground">This is from your registration.</p>
              </div>

              <div className="space-y-1">
                <Label htmlFor="bio">Short Bio (optional)</Label>
                <Input
                  id="bio"
                  placeholder="e.g., Freelancer from Nigeria interested in AI annotation work"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>What are your goals? (select all that apply)</Label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {GOALS.map((goal) => (
                    <button
                      key={goal}
                      type="button"
                      onClick={() => toggleGoal(goal)}
                      className={`px-3 py-1.5 rounded-full border text-sm transition-colors ${
                        selectedGoals.includes(goal)
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-background border-border text-muted-foreground hover:border-primary/50"
                      }`}
                    >
                      {goal}
                    </button>
                  ))}
                </div>
              </div>

              <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save & Go to My Profile
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
