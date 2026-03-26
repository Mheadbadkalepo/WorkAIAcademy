import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Navigate } from "react-router";
import { useUnlock } from "../contexts/UnlockContext";
import { Card, CardContent } from "../components/ui/card";

export default function TelusGuide() {
  const { isUnlocked, highGuidesUnlocked } = useUnlock();

  if (!isUnlocked || !highGuidesUnlocked) {
    return <Navigate to="/guides" />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="max-w-4xl mx-auto py-16 px-4">
        <div className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-primary">Telus AI Account Guide</h1>
          <p className="text-xl text-muted-foreground">Mastering the challenging open-book exams and navigating Telus projects.</p>
        </div>

        <div className="space-y-12">
          <section>
            <h2 className="text-3xl font-bold mb-6 border-b pb-2">Phase 1: Application and Pre-Screening</h2>
            <Card className="mb-6">
              <CardContent className="pt-6 space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Lesson 1: Choosing the Right Role</h3>
                  <p className="text-muted-foreground">Telus has three main categories:</p>
                  <ul className="list-disc pl-6 mt-2 text-muted-foreground">
                    <li><strong className="text-foreground">Rater/Assessor:</strong> Evaluating search engine results (most common).</li>
                    <li><strong className="text-foreground">Data Analyst:</strong> Working with maps, photos, or specialized data.</li>
                    <li><strong className="text-foreground">AI Community:</strong> Short-term tasks like video or audio recording.</li>
                  </ul>
                </div>
                <div className="border-t pt-4">
                  <h3 className="text-xl font-semibold mb-2">Lesson 2: Resume and Geography Check</h3>
                  <p className="text-muted-foreground">Telus is strict about residency. You must typically have lived in your country for the last 3–5 consecutive years. Ensure your resume highlights your familiarity with local culture, news, and search trends.</p>
                </div>
                <div className="border-t pt-4">
                  <h3 className="text-xl font-semibold mb-2">Lesson 3: The Application Form</h3>
                  <p className="text-muted-foreground">When applying, you'll answer pre-screening questions about your hardware (PC/Smartphone) and internet speed. Use a Gmail address for the application, as most projects require a Google-integrated environment.</p>
                </div>
                <div className="border-t pt-4">
                  <h3 className="text-xl font-semibold mb-2">Lesson 4: The "First Email" Wait</h3>
                  <p className="text-muted-foreground">After applying, you may not hear back for 1 to 3 weeks. If your profile is a match, you'll receive an invitation to the Terms and Conditions and a request for a government ID scan for verification.</p>
                </div>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-6 border-b pb-2">Phase 2: The "Open Book" Exam (The Hardest Part)</h2>
            <Card className="mb-6">
              <CardContent className="pt-6 space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Lesson 5: Receiving the Guidelines</h3>
                  <p className="text-muted-foreground">Once verified, Telus will send you a PDF (often 150+ pages) for the Search Quality Rating exam. Do not click the exam link yet. You usually have 7 days to complete the exam once you start.</p>
                </div>
                <div className="border-t pt-4">
                  <h3 className="text-xl font-semibold mb-2">Lesson 6: Part 1 - Theoretical Knowledge</h3>
                  <p className="text-muted-foreground">The first part of the exam is a True/False test based on the guidelines. It tests your understanding of concepts like Needs Met and Page Quality.</p>
                </div>
                <div className="border-t pt-4">
                  <h3 className="text-xl font-semibold mb-2">Lesson 7: Part 2 - Page Quality (PQ)</h3>
                  <p className="text-muted-foreground">You will be asked to rate the quality of websites. You must identify "Main Content," "Supplemental Content," and "Advertisements," then assign a rating from Lowest to Highest.</p>
                </div>
                <div className="border-t pt-4">
                  <h3 className="text-xl font-semibold mb-2">Lesson 8: Part 3 - Needs Met (NM)</h3>
                  <p className="text-muted-foreground">This is the most critical part. You are given a user query (e.g., "how to bake a cake") and a result. You must rate how well that result satisfies the user's intent on a scale from Fails to Meet to Fully Meets.</p>
                </div>
                <div className="border-t pt-4">
                  <h3 className="text-xl font-semibold mb-2">Lesson 9: Exam Strategy & Retakes</h3>
                  <p className="text-muted-foreground">The exam is open-book. Keep the PDF guidelines open on a second monitor or printed out. If you fail, Telus often (but not always) offers one retake after a 2-week cooling-off period.</p>
                </div>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-6 border-b pb-2">Phase 3: Onboarding and Systems</h2>
            <Card className="mb-6">
              <CardContent className="pt-6 space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Lesson 10: The Welcome Pack and I-9/ID Verification</h3>
                  <p className="text-muted-foreground">Once you pass, you'll receive a "Welcome to the Program" email. You will complete your final employment paperwork and, in some regions, a background check.</p>
                </div>
                <div className="border-t pt-4">
                  <h3 className="text-xl font-semibold mb-2">Lesson 11: Setting Up the Rating Portal</h3>
                  <p className="text-muted-foreground">You will be given access to a specific portal (like RaterHub). This is where you will perform all your daily tasks. You'll also set up your "Work" Gmail account provided by Telus.</p>
                </div>
                <div className="border-t pt-4">
                  <h3 className="text-xl font-semibold mb-2">Lesson 12: Time Tracking and Invoicing</h3>
                  <p className="text-muted-foreground">Telus uses an internal time-tracking system (Geoworker). You must manually enter your hours worked each day. Accuracy is key—if your task time doesn't match your logged hours, it can lead to flags.</p>
                </div>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-6 border-b pb-2">Phase 4: Working and Payment</h2>
            <Card className="mb-6">
              <CardContent className="pt-6 space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Lesson 13: The Quality Feedback Loop</h3>
                  <p className="text-muted-foreground">Every month, Telus releases "Feedback" where they grade your work against their master ratings. If your scores are consistently low, you will be required to take mandatory training or may be removed from the project.</p>
                </div>
                <div className="border-t pt-4">
                  <h3 className="text-xl font-semibold mb-2">Lesson 14: Payment via Hyperwallet</h3>
                  <p className="text-muted-foreground">Telus typically pays monthly (or bi-weekly in some regions). Payments are processed through Hyperwallet, where you can then transfer the funds to your Bank Account, PayPal, or via Wire Transfer.</p>
                </div>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-6 border-b pb-2">Suggested Video Resources</h2>
            <div className="grid gap-8 md:grid-cols-1">
              <Card>
                <CardContent className="pt-6 flex flex-col h-full">
                  <h3 className="font-semibold mb-2">Telus Rater Exam Prep (3-Part Guide)</h3>
                  <p className="text-sm text-muted-foreground mb-4 flex-grow">A deep dive into the 3 exam parts from a 5-year veteran.</p>
                  <div className="aspect-video rounded-lg overflow-hidden border mt-auto">
                    <iframe 
                      width="100%" 
                      height="100%" 
                      src="https://www.youtube.com/embed/BHX-6o3KAic" 
                      title="Telus Rater Exam Prep" 
                      frameBorder="0" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      allowFullScreen
                    ></iframe>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 flex flex-col h-full">
                  <h3 className="font-semibold mb-2">Understanding Needs Met & Page Quality</h3>
                  <p className="text-sm text-muted-foreground mb-4 flex-grow">Essential for passing the hardest part of the qualification.</p>
                  <div className="aspect-video rounded-lg overflow-hidden border mt-auto">
                    <iframe 
                      width="100%" 
                      height="100%" 
                      src="https://www.youtube.com/embed/Yp9uQ8WvB6I" 
                      title="Understanding Needs Met" 
                      frameBorder="0" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      allowFullScreen
                    ></iframe>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 flex flex-col h-full">
                  <h3 className="font-semibold mb-2">Telus Payment Proof & Setup</h3>
                  <p className="text-sm text-muted-foreground mb-4 flex-grow">Shows how the Hyperwallet and Geoworker systems look.</p>
                  <div className="aspect-video rounded-lg overflow-hidden border mt-auto">
                    <iframe 
                      width="100%" 
                      height="100%" 
                      src="https://www.youtube.com/embed/g9u_J9B7M1M" 
                      title="Telus Payment Proof" 
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

