import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Navigate } from "react-router";
import { useUnlock } from "../contexts/UnlockContext";
import { Card, CardContent } from "../components/ui/card";

export default function RemotaskGuide() {
  const { isUnlocked, lowGuidesUnlocked } = useUnlock();

  if (!isUnlocked || !lowGuidesUnlocked) {
    return <Navigate to="/guides" />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="max-w-4xl mx-auto py-16 px-4">
        <div className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-primary">Remotask Account Guide</h1>
          <p className="text-xl text-muted-foreground">Your complete blueprint to maximizing earnings and maintaining high Trust Scores.</p>
        </div>

        <div className="space-y-12">
          <section>
            <h2 className="text-3xl font-bold mb-6 border-b pb-2">Phase 1: Account Setup & Security</h2>
            <Card className="mb-6">
              <CardContent className="pt-6 space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Lesson 1: The One-Account Rule</h3>
                  <p className="text-muted-foreground">Remotasks is extremely strict about multiple accounts. Create only one account using your legal name and a permanent email address.</p>
                  <ul className="list-disc pl-6 mt-2 text-muted-foreground">
                    <li><strong className="text-red-500">Critical Tip:</strong> Use the same email address for Remotasks that you use for your PayPal or Airtm account to ensure seamless weekly payments.</li>
                  </ul>
                </div>
                <div className="border-t pt-4">
                  <h3 className="text-xl font-semibold mb-2">Lesson 2: Identity Verification (Persona)</h3>
                  <p className="text-muted-foreground">Modern Remotasks requires a "Double Verification" process. You will need to verify your phone number via SMS and complete a KYC (Know Your Customer) check using a service called Persona. Have a valid government ID (Passport, ID card, or Driver's License) ready for the facial scan.</p>
                </div>
                <div className="border-t pt-4">
                  <h3 className="text-xl font-semibold mb-2">Lesson 3: Linking Your Payment Method</h3>
                  <p className="text-muted-foreground">Remotasks pays out every Thursday. To receive funds, you must link a verified PayPal or Airtm account. In regions like Kenya, you can then move these funds from PayPal to M-Pesa. There is no minimum withdrawal limit, which is a huge plus for beginners.</p>
                </div>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-6 border-b pb-2">Phase 2: Training & The "Trust Score"</h2>
            <Card className="mb-6">
              <CardContent className="pt-6 space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Lesson 4: The Introduction to Remotasks Course</h3>
                  <p className="text-muted-foreground">Your dashboard will initially be empty except for a mandatory "Intro" course. This takes about 5–20 minutes and covers the basic rules of the platform. You must pass the quiz at the end to unlock the rest of the site.</p>
                </div>
                <div className="border-t pt-4">
                  <h3 className="text-xl font-semibold mb-2">Lesson 5: Choosing Your "Learning Path"</h3>
                  <p className="text-muted-foreground">Don't try to learn everything at once. Focus on one category initially:</p>
                  <ul className="list-disc pl-6 mt-2 text-muted-foreground">
                    <li><strong className="text-foreground">2D/3D Annotation:</strong> Higher pay but steeper learning curve (LiDAR).</li>
                    <li><strong className="text-foreground">Language/RLHF:</strong> Evaluating AI responses (great if you have strong English skills).</li>
                    <li><strong className="text-foreground">Categorization:</strong> Simple but lower-paying.</li>
                  </ul>
                </div>
                <div className="border-t pt-4">
                  <h3 className="text-xl font-semibold mb-2">Lesson 6: The Qualification Exams</h3>
                  <p className="text-muted-foreground">Each project has its own "Bootcamp" or training module.</p>
                  <ul className="list-disc pl-6 mt-2 text-muted-foreground">
                    <li>Read the instructions twice before starting.</li>
                    <li>Many exams allow retakes, but if you fail too many times, that project may be permanently locked for you.</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-6 border-b pb-2">Phase 3: Working & Scaling Income</h2>
            <Card className="mb-6">
              <CardContent className="pt-6 space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Lesson 7: Navigating "No Tasks Available"</h3>
                  <p className="text-muted-foreground">The most common complaint is an empty dashboard. To fix this:</p>
                  <ul className="list-disc pl-6 mt-2 text-muted-foreground">
                    <li>Complete more training modules to "unlock" more projects.</li>
                    <li>Work during US peak hours (usually late night/early morning in GMT+3 regions) when new batches of tasks are often uploaded.</li>
                  </ul>
                </div>
                <div className="border-t pt-4">
                  <h3 className="text-xl font-semibold mb-2">Lesson 8: Maintaining Your Accuracy (The Gold Standard)</h3>
                  <p className="text-muted-foreground">Remotasks uses "Gold Tasks" (hidden test questions). If your accuracy drops below a certain threshold (usually 70–80%), you will be "disabled" from the project. Speed is secondary; accuracy is king.</p>
                </div>
                <div className="border-t pt-4">
                  <h3 className="text-xl font-semibold mb-2">Lesson 9: Joining the Community (Slack/Discord)</h3>
                  <p className="text-muted-foreground">Once you are active on projects, you'll often get an invite to a project-specific Slack or Discord. This is where you get real-time updates on task availability and can ask "Taskers" or "Reviewers" for help on difficult guidelines.</p>
                </div>
                <div className="border-t pt-4">
                  <h3 className="text-xl font-semibold mb-2">Lesson 10: Advancing to Reviewer Status</h3>
                  <p className="text-muted-foreground">The real money is in Reviewing. Once you have a high enough accuracy and volume on a project, you may be promoted to a Reviewer. Reviewers earn significantly more per hour ($15–$20+ in some technical niches) because they check the work of other taskers.</p>
                </div>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-6 border-b pb-2">Suggested Video Tutorials (2026)</h2>
            <div className="grid gap-8 md:grid-cols-1">
              <Card>
                <CardContent className="pt-6 flex flex-col h-full">
                  <h3 className="font-semibold mb-2">Remotasks Tutorial for Beginners</h3>
                  <p className="text-sm text-muted-foreground mb-4 flex-grow">Visual guide to the sign-up and ID verification steps.</p>
                  <div className="aspect-video rounded-lg overflow-hidden border mt-auto">
                    <iframe 
                      width="100%" 
                      height="100%" 
                      src="https://www.youtube.com/embed/UNRJ1HkwCWU" 
                      title="Remotasks Tutorial for Beginners" 
                      frameBorder="0" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      allowFullScreen
                    ></iframe>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 flex flex-col h-full">
                  <h3 className="font-semibold mb-2">Remotasks Review: How Much Can You Earn?</h3>
                  <p className="text-sm text-muted-foreground mb-4 flex-grow">Explains the difference between 2D tasks and LiDAR pay rates.</p>
                  <div className="aspect-video rounded-lg overflow-hidden border mt-auto">
                    <iframe 
                      width="100%" 
                      height="100%" 
                      src="https://www.youtube.com/embed/SOUwG0nj-7A" 
                      title="Remotasks Review" 
                      frameBorder="0" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      allowFullScreen
                    ></iframe>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 flex flex-col h-full">
                  <h3 className="font-semibold mb-2">How to Pass Remotasks Exams</h3>
                  <p className="text-sm text-muted-foreground mb-4 flex-grow">Tips on reading guidelines and passing the RLHF/Rating tests.</p>
                  <div className="aspect-video rounded-lg overflow-hidden border mt-auto">
                    <iframe 
                      width="100%" 
                      height="100%" 
                      src="https://www.youtube.com/embed/tvY-Sa5HanM" 
                      title="How to Pass Remotasks Exams" 
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

