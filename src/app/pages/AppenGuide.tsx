import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Navigate } from "react-router";
import { useUnlock } from "../contexts/UnlockContext";
import { Card, CardContent } from "../components/ui/card";

export default function AppenGuide() {
  const { isUnlocked, lowGuidesUnlocked } = useUnlock();

  if (!isUnlocked || !lowGuidesUnlocked) {
    return <Navigate to="/guides" />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="max-w-4xl mx-auto py-16 px-4">
        <div className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-primary">Appen Account Guide</h1>
          <p className="text-xl text-muted-foreground">Master the Appen ecosystem and land high-paying AI annotation tasks.</p>
        </div>

        <div className="space-y-12">
          <section>
            <h2 className="text-3xl font-bold mb-6 border-b pb-2">Phase 1: Foundation and Account Setup</h2>
            <Card className="mb-6">
              <CardContent className="pt-6 space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Lesson 1: Understanding the Appen Ecosystem</h3>
                  <p className="text-muted-foreground">Appen isn't just one site. There is Appen China (mostly for AI data collection) and Appen Global/ADAP (Search Evaluation, Transcription, and Data Labeling). Decide which one fits your region and skills best. Most global users start with the standard Appen Contributor Portal.</p>
                </div>
                <div className="border-t pt-4">
                  <h3 className="text-xl font-semibold mb-2">Lesson 2: Creating Your Account</h3>
                  <p className="text-muted-foreground">Go to the Appen Sign-Up page. Use a professional email address.</p>
                  <ul className="list-disc pl-6 mt-2 text-muted-foreground">
                    <li>Tip: If you don't receive the verification link, check your spam or try to "resend" from the login page (maximum 3 attempts).</li>
                  </ul>
                </div>
                <div className="border-t pt-4">
                  <h3 className="text-xl font-semibold mb-2">Lesson 3: Building a "High-Value" Profile</h3>
                  <p className="text-muted-foreground">Appen's algorithms match you to projects based on your profile.</p>
                  <ul className="list-disc pl-6 mt-2 text-muted-foreground">
                    <li>List all languages you speak fluently.</li>
                    <li>Under "Education" and "Prior Experience," include keywords like "Data Entry," "Transcription," "Search Evaluation," or "Linguistic Analysis."</li>
                  </ul>
                </div>
                <div className="border-t pt-4">
                  <h3 className="text-xl font-semibold mb-2">Lesson 4: Selecting Your Payment Method (Payoneer)</h3>
                  <p className="text-muted-foreground">Appen primarily pays through Payoneer. You must link a verified Payoneer account to your Appen profile before you can be assigned to paid projects. Do this early, as verification can take a few days.</p>
                </div>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-6 border-b pb-2">Phase 2: Project Scouting and Application</h2>
            <Card className="mb-6">
              <CardContent className="pt-6 space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Lesson 5: Navigating the Projects Dashboard</h3>
                  <p className="text-muted-foreground">Once logged in, click on the "All Projects" tab. You will see a list of available tasks ranging from 5-minute surveys to long-term "Part-time" roles.</p>
                </div>
                <div className="border-t pt-4">
                  <h3 className="text-xl font-semibold mb-2">Lesson 6: Decoding Project Requirements</h3>
                  <p className="text-muted-foreground">Before clicking "Apply," read the project description carefully. Some require specific hardware (Android vs. iOS), while others require you to be a resident of a specific country for at least 5 years.</p>
                </div>
                <div className="border-t pt-4">
                  <h3 className="text-xl font-semibold mb-2">Lesson 7: The Application Queue</h3>
                  <p className="text-muted-foreground">When you apply, your status will change to "Applied." It can stay here for weeks.</p>
                  <ul className="list-disc pl-6 mt-2 text-muted-foreground">
                    <li>Strategy: Apply to at least 5–10 projects to increase your chances of a "Qualification" invite.</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-6 border-b pb-2">Phase 3: Passing the Exams</h2>
            <Card className="mb-6">
              <CardContent className="pt-6 space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Lesson 8: Studying the General Guidelines</h3>
                  <p className="text-muted-foreground">For major projects (like Search Evaluation), Appen provides a PDF of guidelines (often 100+ pages). Treat this as your bible. Do not take the exam until you have read it at least twice.</p>
                </div>
                <div className="border-t pt-4">
                  <h3 className="text-xl font-semibold mb-2">Lesson 9: Mastering "Search Intent" and "Relevance"</h3>
                  <p className="text-muted-foreground">Most exams test your ability to understand what a user wants when they type a query.</p>
                  <ul className="list-disc pl-6 mt-2 text-muted-foreground">
                    <li><strong className="text-foreground">Navigational:</strong> Looking for a specific site.</li>
                    <li><strong className="text-foreground">Informational:</strong> Looking for a fact.</li>
                    <li><strong className="text-foreground">Transactional:</strong> Looking to buy.</li>
                  </ul>
                </div>
                <div className="border-t pt-4">
                  <h3 className="text-xl font-semibold mb-2">Lesson 10: Taking the Qualification Exam</h3>
                  <p className="text-muted-foreground">Exams are usually split into 3 parts (Theoretical, Page Quality, and Needs Met).</p>
                  <ul className="list-disc pl-6 mt-2 text-muted-foreground">
                    <li>Strict Adherence: Even if you think a result is "good," if the guidelines say it's "low quality" because of a specific rule, follow the guidelines.</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-6 border-b pb-2">Phase 4: Working and Scaling</h2>
            <Card className="mb-6">
              <CardContent className="pt-6 space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Lesson 11: Onboarding and "Quiz Mode"</h3>
                  <p className="text-muted-foreground">Once you pass the exam, you'll enter "Quiz Mode" on the project. You must maintain a high accuracy (usually 80%+) on "Gold Data" (hidden test questions) to stay on the project.</p>
                </div>
                <div className="border-t pt-4">
                  <h3 className="text-xl font-semibold mb-2">Lesson 12: Maintaining Quality and Getting Paid</h3>
                  <p className="text-muted-foreground">Check your "Invoices" tab regularly. Appen usually generates invoices automatically once a month, which are then paid out to your Payoneer 14–30 days later.</p>
                </div>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-6 border-b pb-2">Suggested Video Guide</h2>
            <Card className="bg-accent/10 border-accent/20">
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold mb-2">Appen Tutorial for Beginners</h3>
                <p className="text-muted-foreground mb-4">This video provides a visual walkthrough of the sign-up process and explains how to navigate the dashboard to find AI training jobs.</p>
                <a href="#" className="text-primary hover:underline font-semibold">Watch Video Tutorial Options &rarr;</a>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-6 border-b pb-2">Video Guides</h2>
            <div className="grid gap-8 md:grid-cols-1">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2">Appen Tutorial for Beginners</h3>
                  <p className="text-sm text-muted-foreground mb-4">A visual walkthrough of the sign-up process and dashboard navigation.</p>
                  <div className="aspect-video rounded-lg overflow-hidden border">
                    <iframe 
                      width="100%" 
                      height="100%" 
                      src="https://www.youtube.com/embed/Kebj-a9wS9k" 
                      title="Appen Tutorial for Beginners" 
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

