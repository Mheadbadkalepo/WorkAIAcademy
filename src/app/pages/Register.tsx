import { useState } from "react";
import { Link } from "react-router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";
import { supabase } from "../../lib/supabase";
import { Loader2, MailCheck } from "lucide-react";

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [registered, setRegistered] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName }
      }
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setRegistered(true);
      setLoading(false);
    }
  };
  if (registered) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <section className="py-20 px-4">
          <div className="max-w-md mx-auto">
            <Card>
              <CardContent className="pt-10 pb-10 text-center space-y-4">
                <div className="flex justify-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <MailCheck className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold">Check Your Email!</h2>
                <p className="text-muted-foreground">
                  We sent a confirmation link to <strong>{email}</strong>. Please open your email and click the link to activate your account before logging in.
                </p>
                <p className="text-sm text-muted-foreground">
                  Didn't receive it? Check your spam folder or{" "}
                  <button
                    onClick={() => setRegistered(false)}
                    className="text-primary hover:underline font-semibold"
                  >
                    try again
                  </button>.
                </p>
                <Link to="/login">
                  <Button className="w-full mt-4 bg-primary hover:bg-primary/90">Go to Login</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="py-20 px-4">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="space-y-1">
              <Badge className="w-fit mx-auto mb-2 bg-accent/10 text-accent-foreground border-accent">
                $1 One-time Access
              </Badge>
              <CardTitle className="text-2xl text-center">Create Account</CardTitle>
              <CardDescription className="text-center">
                Register to unlock WorkAI Academy platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleRegister}>
                {error && (
                  <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
                    {error}
                  </div>
                )}
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    className="mt-2"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    className="mt-2"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a password"
                    className="mt-2"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    className="mt-2"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                  <p className="text-sm text-center text-muted-foreground">
                    📧 <strong>Important:</strong> After creating your account, check your email inbox for a confirmation link before logging in.
                  </p>
                </div>

                <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
                  <p className="text-sm text-center text-muted-foreground">
                    After confirming your email, you can unlock the platform for $1
                  </p>
                </div>

                <Button className="w-full bg-primary hover:bg-primary/90" type="submit" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Account
                </Button>
              </form>

              <div className="mt-6 text-center text-sm">
                <span className="text-muted-foreground">Already have an account? </span>
                <Link to="/login" className="text-primary hover:underline font-semibold">
                  Login here
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
}
