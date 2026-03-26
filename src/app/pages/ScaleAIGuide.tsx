import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Navigate } from "react-router";
import { useUnlock } from "../contexts/UnlockContext";
import { Card, CardContent } from "../components/ui/card";

export default function ScaleAIGuide() {
  const { isUnlocked, highGuidesUnlocked } = useUnlock();

  if (!isUnlocked || !highGuidesUnlocked) {
    return <Navigate to="/guides" />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="max-w-4xl mx-auto py-16 px-4">
        <div className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-primary">Scale AI Account Guide</h1>
          <p className="text-xl text-muted-foreground">Navigating the Scale AI tiers, passing domain-specific tests, and scaling your earnings.</p>
        </div>

        <div className="space-y-12">
          <section>
            <h2 className="text-3xl font-bold mb-6 border-b pb-2">Phase 1: The Gateway (Platform Selection)</h2>
            <Card className="mb-6">
              <CardContent className="pt-6 space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Lesson 1: Understanding the Hierarchy</h3>
                  <p className="text-muted-foreground">Scale AI doesn't have a single "login" for everyone.</p>
                  <ul className="list-disc pl-6 mt-2 text-muted-foreground">
                    <li><strong className="text-foreground">The Experts (Outlier):</strong> For those with degrees/specialized skills.</li>
                    <li><strong className="text-foreground">The Generalists (Remotasks):</strong> For data labeling and simpler tasks.</li>
                    <li><strong className="text-foreground">The Corporates (Scale.com):</strong> For full-time roles in San Francisco, London, etc.</li>
                  </ul>
                </div>
                <div className="border-t pt-4">
                  <h3 className="text-xl font-semibold mb-2">Lesson 2: Choosing Your "Niche"</h3>
                  <p className="text-muted-foreground">In 2026, Scale AI looks for three main "pillars": Coding (Python/JS), STEM (Math/Physics), and Humanities (Linguistics/RLHF). Pick the one where you can prove professional expertise.</p>
                </div>
                <div className="border-t pt-4">
                  <h3 className="text-xl font-semibold mb-2">Lesson 3: Creating a "Search-Friendly" Resume</h3>
                  <p className="text-muted-foreground">Scale AI uses their own proprietary AI to scan applications. Ensure your resume includes keywords like "RLHF," "Model Evaluation," "Prompt Engineering," and "Fact-Verification."</p>
                </div>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-6 border-b pb-2">Phase 2: Account Security & Verification</h2>
            <Card className="mb-6">
              <CardContent className="pt-6 space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Lesson 4: The Clean Slate Rule</h3>
                  <p className="text-muted-foreground">Scale AI has a "one person, one account" policy across all its brands. If you have an old Remotasks account, do not create a new Outlier account without closing the old one first. You will be flagged for "Multi-accounting."</p>
                </div>
                <div className="border-t pt-4">
                  <h3 className="text-xl font-semibold mb-2">Lesson 5: Identity Verification (Persona 2026)</h3>
                  <p className="text-muted-foreground">You will undergo a mandatory KYC check.</p>
                  <ul className="list-disc pl-6 mt-2 text-muted-foreground">
                    <li><strong>Action:</strong> Use a smartphone with a high-quality camera.</li>
                    <li><strong className="text-red-500">Tip:</strong> Do not use a VPN or a Proxy during this step, or your account will be "Shadowbanned" before you even start.</li>
                  </ul>
                </div>
                <div className="border-t pt-4">
                  <h3 className="text-xl font-semibold mb-2">Lesson 6: Linking High-Security Payment Methods</h3>
                  <p className="text-muted-foreground">Scale AI prefers PayPal or Airtm. Ensure the name on your payment account matches your ID exactly.</p>
                </div>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-6 border-b pb-2">Phase 3: The Qualification Gauntlet</h2>
            <Card className="mb-6">
              <CardContent className="pt-6 space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Lesson 7: The General Reasoning Exam</h3>
                  <p className="text-muted-foreground">Most applicants start with a logic and writing test. It tests your ability to follow complex, 50-page instruction manuals.</p>
                </div>
                <div className="border-t pt-4">
                  <h3 className="text-xl font-semibold mb-2">Lesson 8: Domain-Specific Testing</h3>
                  <p className="text-muted-foreground">If you applied for a Coding role, you will be given a LeetCode-style test. If you applied for Writing, you'll be asked to "Rewrite an AI response to be more helpful and harmless."</p>
                </div>
                <div className="border-t pt-4">
                  <h3 className="text-xl font-semibold mb-2">Lesson 9: Mastering the "Justification"</h3>
                  <p className="text-muted-foreground">On Scale AI platforms, the answer matters less than the reason why. You must write logical, evidence-based justifications for every choice you make.</p>
                </div>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-6 border-b pb-2">Phase 4: Project Onboarding & Slack</h2>
            <Card className="mb-6">
              <CardContent className="pt-6 space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Lesson 10: The Onboarding "Sandbox"</h3>
                  <p className="text-muted-foreground">Once you pass the exam, you enter a "Sandbox" where you do 5–10 practice tasks. These are often unpaid or paid at a training rate.</p>
                </div>
                <div className="border-t pt-4">
                  <h3 className="text-xl font-semibold mb-2">Lesson 11: Navigating the Dashboard</h3>
                  <p className="text-muted-foreground">Learn to read your "Project Code." Names like "Bulba," "Ostrich," or "Dolphin" represent different AI models you are training.</p>
                </div>
                <div className="border-t pt-4">
                  <h3 className="text-xl font-semibold mb-2">Lesson 12: Joining the Project Slack</h3>
                  <p className="text-muted-foreground">Scale AI runs on Slack. Once assigned to a project, you'll get an invite. Check Slack daily. This is where "Admin" and "Taskers" communicate about bugs or instruction updates.</p>
                </div>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-6 border-b pb-2">Phase 5: Maintaining Quality & Payouts</h2>
            <Card className="mb-6">
              <CardContent className="pt-6 space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Lesson 13: The "Spam" and "Quality" Score</h3>
                  <p className="text-muted-foreground">If your accuracy drops below 80%, you will be "Nudges" or removed.</p>
                  <ul className="list-disc pl-6 mt-2 text-muted-foreground">
                    <li><strong>Tip:</strong> Never rush. Scale AI tracks "Time on Task" to ensure you aren't just clicking buttons.</li>
                  </ul>
                </div>
                <div className="border-t pt-4">
                  <h3 className="text-xl font-semibold mb-2">Lesson 14: Handling the "EQ" (Empty Queue)</h3>
                  <p className="text-muted-foreground">If you have no tasks, don't panic. It usually means a "Batch" has ended. Use this time to check the "Training" tab for new project qualifications.</p>
                </div>
                <div className="border-t pt-4">
                  <h3 className="text-xl font-semibold mb-2">Lesson 15: Weekly Payouts and Taxes</h3>
                  <p className="text-muted-foreground">Scale AI pays every Tuesday/Wednesday. In 2026, you are considered an Independent Contractor. Set aside 20–30% of your earnings for your local taxes.</p>
                </div>
                <div className="border-t pt-4">
                  <h3 className="text-xl font-semibold mb-2">Lesson 16: Scaling to "Tier 3" or Reviewer</h3>
                  <p className="text-muted-foreground">After 1,000 successful tasks, you can apply to be a Reviewer. This increases your pay and gives you a more stable "Job" feel with consistent hours.</p>
                </div>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-6 border-b pb-2">Suggested Video Tutorials (2026)</h2>
            <div className="grid gap-8 md:grid-cols-1">
              <Card>
                <CardContent className="pt-6 flex flex-col h-full">
                  <h3 className="font-semibold mb-2">How To WORK On Scale AI (Quick & Easy)</h3>
                  <p className="text-sm text-muted-foreground mb-4 flex-grow">Shows the latest dashboard and sign-up flow.</p>
                  <div className="aspect-video rounded-lg overflow-hidden border mt-auto">
                    <iframe 
                      width="100%" 
                      height="100%" 
                      src="https://www.youtube.com/embed/ZpVqnIc2Qz8" 
                      title="How To WORK On Scale AI" 
                      frameBorder="0" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      allowFullScreen
                    ></iframe>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 flex flex-col h-full">
                  <h3 className="font-semibold mb-2">How To Get a Job in AI in 2026</h3>
                  <p className="text-sm text-muted-foreground mb-4 flex-grow">Discusses the broader hiring landscape at companies like Scale.</p>
                  <div className="aspect-video rounded-lg overflow-hidden border mt-auto">
                    <iframe 
                      width="100%" 
                      height="100%" 
                      src="https://www.youtube.com/embed/zK9CckQGjx8" 
                      title="Job in AI 2026" 
                      frameBorder="0" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      allowFullScreen
                    ></iframe>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 flex flex-col h-full">
                  <h3 className="font-semibold mb-2">Scale AI: From Onboarding to First Paycheck</h3>
                  <p className="text-sm text-muted-foreground mb-4 flex-grow">Useful for understanding how to handle the Sandbox phase.</p>
                  <div className="aspect-video rounded-lg overflow-hidden border mt-auto">
                    <iframe 
                      width="100%" 
                      height="100%" 
                      src="https://www.youtube.com/embed/v2GXMLbDWt4" 
                      title="Scale AI Onboarding" 
                      frameBorder="0" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      allowFullScreen
                    ></iframe>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

