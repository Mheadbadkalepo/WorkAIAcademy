import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Navigate } from "react-router";
import { useUnlock } from "../contexts/UnlockContext";
import { Card, CardContent } from "../components/ui/card";

export default function ClickworkerGuide() {
  const { isUnlocked } = useUnlock();
  
  if (!isUnlocked) {
    return <Navigate to="/guides" />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="max-w-4xl mx-auto py-16 px-4">
        <div className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-primary">Clickworker Account Guide</h1>
          <p className="text-xl text-muted-foreground">Unlocking UHRS and managing your payout cycles for consistent earnings.</p>
        </div>

        <div className="space-y-12">
          <section>
            <h2 className="text-3xl font-bold mb-6 border-b pb-2">Phase 1: Account Creation & Setup</h2>
            <Card className="mb-6">
              <CardContent className="pt-6 space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Lesson 1: Choosing Your Device (App vs. Desktop)</h3>
                  <p className="text-muted-foreground">In 2026, Clickworker has two distinct paths.</p>
                  <ul className="list-disc pl-6 mt-2 text-muted-foreground">
                    <li><strong className="text-foreground">The App:</strong> Best for quick photo/video tasks and "Store Checks."</li>
                    <li><strong className="text-foreground">The Desktop:</strong> Necessary for the heavy-lifting UHRS tasks.</li>
                    <li><strong>Action:</strong> Download the Clickworker app on Android or iOS and register there first; it's often faster than the web browser route.</li>
                  </ul>
                </div>
                <div className="border-t pt-4">
                  <h3 className="text-xl font-semibold mb-2">Lesson 2: The Truthful Profile Rule</h3>
                  <p className="text-muted-foreground">Clickworker uses a vetting algorithm. If your profile claims you are a native English speaker but your assessment shows otherwise, your account may be flagged.</p>
                  <ul className="list-disc pl-6 mt-2 text-muted-foreground">
                    <li>Fill out your hobbies, skills, and languages completely.</li>
                    <li><strong>Pro Tip:</strong> Add all languages you are truly fluent in, as this unlocks "Search Relevance" tasks in those specific languages.</li>
                  </ul>
                </div>
                <div className="border-t pt-4">
                  <h3 className="text-xl font-semibold mb-2">Lesson 3: Setting Up Weekly Payments</h3>
                  <p className="text-muted-foreground">Clickworker pays automatically once you hit the minimum threshold ($10 for PayPal/Payoneer).</p>
                  <ul className="list-disc pl-6 mt-2 text-muted-foreground">
                    <li>Go to "Payment Details" and link your Payoneer or PayPal.</li>
                    <li><strong className="text-red-500">Security Note:</strong> After changing payment details, your account will be on a security hold for 2–3 days. Do this immediately so it doesn't delay your first pay run.</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-6 border-b pb-2">Phase 2: The Gateway to Big Earnings</h2>
            <Card className="mb-6">
              <CardContent className="pt-6 space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Lesson 4: Passing the Assessments</h3>
                  <p className="text-muted-foreground">You won't see many jobs until you pass the base assessments.</p>
                  <ul className="list-disc pl-6 mt-2 text-muted-foreground">
                    <li>Go to the "Assessments" tab.</li>
                    <li>The most important one is the <strong>English Language Assessment</strong>. You usually need an 80% or higher to pass. You often only get one shot, so take it in a quiet room.</li>
                  </ul>
                </div>
                <div className="border-t pt-4">
                  <h3 className="text-xl font-semibold mb-2">Lesson 5: Unlocking UHRS (The "Job" Maker)</h3>
                  <p className="text-muted-foreground">This is where the real "job" begins. Look for an assessment titled "Qualify for UHRS." This will guide you through creating a unique Microsoft Live ID (e.g., cw_12345@outlook.com) specifically for Clickworker.</p>
                  <ul className="list-disc pl-6 mt-2 text-muted-foreground">
                    <li>Once passed, you will see a "UHRS" banner on your dashboard. This is your portal to thousands of small tasks.</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-6 border-b pb-2">Phase 3: Working and Quality Control</h2>
            <Card className="mb-6">
              <CardContent className="pt-6 space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Lesson 6: Navigating HitApps</h3>
                  <p className="text-muted-foreground">Inside UHRS, tasks are called HitApps.</p>
                  <ul className="list-disc pl-6 mt-2 text-muted-foreground">
                    <li><strong className="text-foreground">Training is Mandatory:</strong> Always do the "Train" mode first. It gives you feedback on why your answer was right or wrong.</li>
                    <li><strong className="text-foreground">Read the Guidelines:</strong> Every HitApp has a PDF link. Open it in a separate tab and keep it visible while you work.</li>
                  </ul>
                </div>
                <div className="border-t pt-4">
                  <h3 className="text-xl font-semibold mb-2">Lesson 7: Monitoring Your Spam Score</h3>
                  <p className="text-muted-foreground">Clickworker/UHRS uses "Spam Hits" to test you. If you answer too many incorrectly or work too fast, you will be "Disabled" (kicked off) from that specific task.</p>
                  <ul className="list-disc pl-6 mt-2 text-muted-foreground">
                    <li>Keep your Spam Accuracy above 0.80 (80%).</li>
                    <li>If it drops, stop working on that HitApp for 24 hours to let the score reset.</li>
                  </ul>
                </div>
                <div className="border-t pt-4">
                  <h3 className="text-xl font-semibold mb-2">Lesson 8: Managing the Payout Cycle</h3>
                  <p className="text-muted-foreground">Clickworker has a "Waiting Period" for quality assurance.</p>
                  <ul className="list-disc pl-6 mt-2 text-muted-foreground">
                    <li><strong className="text-foreground">UHRS Earnings:</strong> These move to your Clickworker balance every Monday but remain "Pending" for 39 days.</li>
                    <li><strong className="text-foreground">App Tasks:</strong> These usually become "Payable" much faster (often 7–14 days).</li>
                    <li><strong>Tip:</strong> Check your "Account History" to see the exact date your money becomes "Payable."</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-6 border-b pb-2">Suggested Video Guides (2026 Updates)</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardContent className="pt-6 flex flex-col h-full">
                  <h3 className="font-semibold mb-2">Clickworker Review & Full Walkthrough</h3>
                  <p className="text-sm text-muted-foreground mb-4 flex-grow">Best for seeing the current 2026 dashboard layout.</p>
                  <div className="aspect-video rounded-lg overflow-hidden border mt-auto">
                    <iframe 
                      width="100%" 
                      height="100%" 
                      src="https://www.youtube.com/embed/_EI25NLfnXA" 
                      title="Clickworker Review" 
                      frameBorder="0" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      allowFullScreen
                    ></iframe>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 flex flex-col h-full">
                  <h3 className="font-semibold mb-2">How to Pass UHRS Assessments 2026</h3>
                  <p className="text-sm text-muted-foreground mb-4 flex-grow">Critical for setting up the Microsoft Live ID correctly.</p>
                  <div className="aspect-video rounded-lg overflow-hidden border mt-auto">
                    <iframe 
                      width="100%" 
                      height="100%" 
                      src="https://www.youtube.com/embed/CjS-ZLD020M" 
                      title="Pass UHRS Assessments" 
                      frameBorder="0" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      allowFullScreen
                    ></iframe>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 flex flex-col h-full">
                  <h3 className="font-semibold mb-2">Clickworker Pay Proof & Strategy</h3>
                  <p className="text-sm text-muted-foreground mb-4 flex-grow">Helpful for understanding the 39-day payment delay.</p>
                  <div className="aspect-video rounded-lg overflow-hidden border mt-auto">
                    <iframe 
                      width="100%" 
                      height="100%" 
                      src="https://www.youtube.com/embed/gBBdybkPEW0" 
                      title="Clickworker Pay Proof" 
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
