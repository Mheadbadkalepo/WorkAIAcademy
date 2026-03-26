import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Navigate } from "react-router";
import { useUnlock } from "../contexts/UnlockContext";
import { Card, CardContent } from "../components/ui/card";

export default function OutlierGuide() {
  const { isUnlocked, highGuidesUnlocked } = useUnlock();

  if (!isUnlocked || !highGuidesUnlocked) {
    return <Navigate to="/guides" />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="max-w-4xl mx-auto py-16 px-4">
        <div className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-primary">Outlier Account Guide</h1>
          <p className="text-xl text-muted-foreground">Expert strategies for securing Outlier tasks and avoiding the dreaded EQ.</p>
        </div>

        <div className="space-y-12">
          <section>
            <h2 className="text-3xl font-bold mb-6 border-b pb-2">Phase 1: Preparation and Registration</h2>
            <Card className="mb-6">
              <CardContent className="pt-6 space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Lesson 1: Identifying Your Tier</h3>
                  <p className="text-muted-foreground">Outlier categorizes workers into tiers (Tier 1 to Tier 3+) based on education and experience.</p>
                  <ul className="list-disc pl-6 mt-2 text-muted-foreground">
                    <li><strong className="text-foreground">Generalists:</strong> Usually require a Bachelor's degree.</li>
                    <li><strong className="text-foreground">Experts:</strong> Require a Master's or PhD (e.g., in Math, Law, or Physics) and pay significantly more (up to $50–$75/hr).</li>
                  </ul>
                </div>
                <div className="border-t pt-4">
                  <h3 className="text-xl font-semibold mb-2">Lesson 2: Resume Optimization</h3>
                  <p className="text-muted-foreground">Outlier uses AI to scan your resume before a human ever sees it.</p>
                  <ul className="list-disc pl-6 mt-2 text-muted-foreground">
                    <li><strong className="text-foreground">Keyword Strategy:</strong> Include terms like "Prompt Engineering," "Fact-checking," "RLHF," or specific coding languages (Python, Java) if applicable.</li>
                  </ul>
                </div>
                <div className="border-t pt-4">
                  <h3 className="text-xl font-semibold mb-2">Lesson 3: The Sign-Up Process</h3>
                  <p className="text-muted-foreground">Visit Outlier.ai and sign up. You will need to provide your legal name exactly as it appears on your ID.</p>
                  <ul className="list-disc pl-6 mt-2 text-muted-foreground">
                    <li><strong className="text-red-500">Warning:</strong> Do not use a VPN. Outlier's security system will flag and shadow-ban accounts that hide their true location.</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-6 border-b pb-2">Phase 2: Identity & Verification</h2>
            <Card className="mb-6">
              <CardContent className="pt-6 space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Lesson 4: Phone Verification</h3>
                  <p className="text-muted-foreground">You must verify a permanent mobile number. VOIP numbers (like Google Voice) are usually rejected.</p>
                </div>
                <div className="border-t pt-4">
                  <h3 className="text-xl font-semibold mb-2">Lesson 5: Government ID & Face Scan</h3>
                  <p className="text-muted-foreground">Outlier uses Persona for KYC. You'll need to upload a front/back photo of your ID and perform a live 3D face scan.</p>
                  <ul className="list-disc pl-6 mt-2 text-muted-foreground">
                    <li><strong>Tip:</strong> Ensure you are in a well-lit room; "Blurry ID" is the #1 reason for account rejection.</li>
                  </ul>
                </div>
                <div className="border-t pt-4">
                  <h3 className="text-xl font-semibold mb-2">Lesson 6: Background Check (Project Dependent)</h3>
                  <p className="text-muted-foreground">For high-security or high-pay projects, you may be asked to complete a Checkr background check. This is standard and usually takes 3–5 business days.</p>
                </div>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-6 border-b pb-2">Phase 3: Onboarding & Skill Screening</h2>
            <Card className="mb-6">
              <CardContent className="pt-6 space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Lesson 7: The Initial Screening Assessment</h3>
                  <p className="text-muted-foreground">After your profile is approved, you'll take a general "Reasoning and Writing" test. This evaluates your ability to spot hallucinations (lies) in AI text and your ability to write clear, logical justifications.</p>
                </div>
                <div className="border-t pt-4">
                  <h3 className="text-xl font-semibold mb-2">Lesson 8: Selecting Your Domain</h3>
                  <p className="text-muted-foreground">Once the general test is passed, you'll choose your specific field (e.g., "Creative Writing," "Python Coding," or "STEM"). You will then receive a domain-specific exam.</p>
                </div>
                <div className="border-t pt-4">
                  <h3 className="text-xl font-semibold mb-2">Lesson 9: The Onboarding Course</h3>
                  <p className="text-muted-foreground">Before you can "Task," you must complete a mandatory course (usually 30–60 minutes) on the specific project guidelines.</p>
                  <ul className="list-disc pl-6 mt-2 text-muted-foreground">
                    <li><strong>Note:</strong> This is often paid at a lower "training rate."</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-6 border-b pb-2">Phase 4: Project Assignment & The "EQ" State</h2>
            <Card className="mb-6">
              <CardContent className="pt-6 space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Lesson 10: Understanding "EQ" (Empty Queue)</h3>
                  <p className="text-muted-foreground">"EQ" is the most famous term on Outlier. It means you have no tasks.</p>
                  <ul className="list-disc pl-6 mt-2 text-muted-foreground">
                    <li><strong className="text-foreground">Why it happens:</strong> The project is out of work, you are being moved to a new project, or your quality score dropped.</li>
                  </ul>
                </div>
                <div className="border-t pt-4">
                  <h3 className="text-xl font-semibold mb-2">Lesson 11: Joining the Slack Community</h3>
                  <p className="text-muted-foreground">Once assigned to a project, you will be added to a specific Slack channel.</p>
                  <ul className="list-disc pl-6 mt-2 text-muted-foreground">
                    <li>This is vital. Project Leads (PLs) and Quality Managers (QMs) post updates here that never appear on the main dashboard.</li>
                  </ul>
                </div>
                <div className="border-t pt-4">
                  <h3 className="text-xl font-semibold mb-2">Lesson 12: Communicating with QMs</h3>
                  <p className="text-muted-foreground">If you are stuck in EQ for more than 48 hours, use the Slack channel to politely tag a Quality Manager. Avoid "spamming" the channel; instead, look for the "Daily EQ Thread."</p>
                </div>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-6 border-b pb-2">Phase 5: Working & Weekly Payouts</h2>
            <Card className="mb-6">
              <CardContent className="pt-6 space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Lesson 13: The Payout Cycle (Tuesday/Wednesday)</h3>
                  <p className="text-muted-foreground">Outlier pays weekly for work completed Tuesday through Monday.</p>
                  <ul className="list-disc pl-6 mt-2 text-muted-foreground">
                    <li><strong className="text-foreground">Payment Methods:</strong> PayPal, AirTM, or ACH (Direct Bank Transfer for US users).</li>
                  </ul>
                </div>
                <div className="border-t pt-4">
                  <h3 className="text-xl font-semibold mb-2">Lesson 14: Quality Audits and Reviews</h3>
                  <p className="text-muted-foreground">Every task you submit is reviewed by another human.</p>
                  <ul className="list-disc pl-6 mt-2 text-muted-foreground">
                    <li>If you get a "1/5" score, read the feedback immediately. Too many low scores will lead to a "Project Removal."</li>
                  </ul>
                </div>
                <div className="border-t pt-4">
                  <h3 className="text-xl font-semibold mb-2">Lesson 15: Scaling to Reviewer/Tier 3</h3>
                  <p className="text-muted-foreground">Consistency is rewarded. If you maintain high accuracy, you may be promoted to a Reviewer, which allows you to earn more and gain "Stable Work" status.</p>
                </div>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-6 border-b pb-2">Suggested Video Guides (2026)</h2>
            <div className="grid gap-8 md:grid-cols-1">
              <Card>
                <CardContent className="pt-6 flex flex-col h-full">
                  <h3 className="font-semibold mb-2">How to Create an Outlier Account Step-by-Step</h3>
                  <p className="text-sm text-muted-foreground mb-4 flex-grow">Shows the exact 2026 interface for verification.</p>
                  <div className="aspect-video rounded-lg overflow-hidden border mt-auto">
                    <iframe 
                      width="100%" 
                      height="100%" 
                      src="https://www.youtube.com/embed/InXs6MTxvuw" 
                      title="Create Outlier Account" 
                      frameBorder="0" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      allowFullScreen
                    ></iframe>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 flex flex-col h-full">
                  <h3 className="font-semibold mb-2">Outlier AI: Passing the Reasoning Test</h3>
                  <p className="text-sm text-muted-foreground mb-4 flex-grow">Essential for understanding how to write Justifications.</p>
                  <div className="aspect-video rounded-lg overflow-hidden border mt-auto">
                    <iframe 
                      width="100%" 
                      height="100%" 
                      src="https://www.youtube.com/embed/zh19J7N0kv0" 
                      title="Passing Outlier Test" 
                      frameBorder="0" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      allowFullScreen
                    ></iframe>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 flex flex-col h-full">
                  <h3 className="font-semibold mb-2">Solving the EQ (Empty Queue) Problem</h3>
                  <p className="text-sm text-muted-foreground mb-4 flex-grow">Tips on how to use Slack to get assigned faster.</p>
                  <div className="aspect-video rounded-lg overflow-hidden border mt-auto">
                    <iframe 
                      width="100%" 
                      height="100%" 
                      src="https://www.youtube.com/embed/5UuFv3Y0YxQ" 
                      title="Solving EQ Problem" 
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

