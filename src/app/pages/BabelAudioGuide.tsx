import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useUnlock } from "../contexts/UnlockContext";
import { useAuth } from "../contexts/AuthContext";
import { Navigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { CheckCircle2, Zap, DollarSign, AlertCircle } from "lucide-react";

export default function BabelAudioGuide() {
  const { highGuidesUnlocked, isUnlocked } = useUnlock();
  const { isAdmin } = useAuth();

  if (!isAdmin && !isUnlocked) {
    return <Navigate to="/guides" />;
  }

  if (!isAdmin && !highGuidesUnlocked) {
    return <Navigate to="/guides" />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
              BA
            </div>
            <h1 className="text-4xl font-bold">Getting Started with Babel Audio</h1>
          </div>
          <p className="text-lg text-muted-foreground mb-4">
            A complete training curriculum to help you earn $12-$50/hour recording audio conversations and voice data.
          </p>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/30 px-4 py-2 rounded-lg">
              <DollarSign className="w-5 h-5 text-emerald-600" />
              <span className="font-semibold text-emerald-700 dark:text-emerald-300">$12-$50/hour</span>
            </div>
            <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-950/30 px-4 py-2 rounded-lg">
              <Zap className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-blue-700 dark:text-blue-300">Weekly Payouts</span>
            </div>
          </div>
        </div>

        {/* Module 1 */}
        <Card className="mb-8 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30">
            <CardTitle className="flex items-center gap-2">
              <span className="flex items-center justify-center w-8 h-8 bg-orange-500 text-white rounded-full text-sm font-bold">1</span>
              Introduction to Babel Audio
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div>
              <h3 className="font-semibold mb-2">What is Babel Audio?</h3>
              <p className="text-muted-foreground mb-4">
                Babel Audio collects speech data to train AI models. As a contributor, you earn weekly by recording conversations, reading prompts, or annotating audio. It's flexible, remote work that pays weekly.
              </p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Earnings Breakdown</h4>
              <ul className="space-y-1 text-sm text-blue-800 dark:text-blue-300">
                <li>• <strong>Conversation Recording:</strong> $12-$35/hour (15-30 min calls)</li>
                <li>• <strong>Voice Prompts:</strong> $15-$50/hour (reading scripted lines)</li>
                <li>• <strong>Annotation:</strong> $8-$20/hour (transcribing audio)</li>
              </ul>
            </div>
            <div className="aspect-video bg-black rounded-lg overflow-hidden">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/FHEEs-2uat4?rel=0"
                title="Babel Audio Application Guide"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>
          </CardContent>
        </Card>

        {/* Module 2 */}
        <Card className="mb-8 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30">
            <CardTitle className="flex items-center gap-2">
              <span className="flex items-center justify-center w-8 h-8 bg-blue-500 text-white rounded-full text-sm font-bold">2</span>
              Setting Up Your Workspace
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <p className="text-muted-foreground">
              Quality audio is critical. Poor recordings get flagged and rejected, costing you earnings.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  Essential Equipment
                </h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>✓ USB Microphone ($20-50)</li>
                  <li>✓ Headphones (for monitoring)</li>
                  <li>✓ Stable internet (4+ Mbps)</li>
                </ul>
              </div>
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  Ideal Environment
                </h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>✓ Quiet room (avoid AC, fans)</li>
                  <li>✓ Soft furnishings (curtains, carpet)</li>
                  <li>✓ Away from traffic/pets</li>
                </ul>
              </div>
            </div>
            <div className="aspect-video bg-black rounded-lg overflow-hidden">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/PZKUw30ue2Y?rel=0"
                title="Babel Audio Setup Guide"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>
          </CardContent>
        </Card>

        {/* Module 3 */}
        <Card className="mb-8 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30">
            <CardTitle className="flex items-center gap-2">
              <span className="flex items-center justify-center w-8 h-8 bg-purple-500 text-white rounded-full text-sm font-bold">3</span>
              Understanding Task Types
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-3">
              <div className="border-l-4 border-purple-500 pl-4 py-2">
                <h4 className="font-semibold">Conversation Recording</h4>
                <p className="text-sm text-muted-foreground">15-30 minute calls with another contributor. You earn for answering questions naturally.</p>
              </div>
              <div className="border-l-4 border-pink-500 pl-4 py-2">
                <h4 className="font-semibold">Voice Prompts</h4>
                <p className="text-sm text-muted-foreground">Read scripted lines with proper pronunciation. Highest paying task ($15-50/hr).</p>
              </div>
              <div className="border-l-4 border-indigo-500 pl-4 py-2">
                <h4 className="font-semibold">Annotation</h4>
                <p className="text-sm text-muted-foreground">Transcribe or label audio samples. Lowest pay but more consistent work.</p>
              </div>
            </div>
            <div className="aspect-video bg-black rounded-lg overflow-hidden">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/izSrn83lHNg?rel=0"
                title="Babel Audio Task Types"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>
          </CardContent>
        </Card>

        {/* Module 4 */}
        <Card className="mb-8 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30">
            <CardTitle className="flex items-center gap-2">
              <span className="flex items-center justify-center w-8 h-8 bg-green-500 text-white rounded-full text-sm font-bold">4</span>
              Payment & Earnings
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4">
              <h4 className="font-semibold text-emerald-900 dark:text-emerald-100 mb-3">Payment Details</h4>
              <div className="space-y-2 text-sm text-emerald-800 dark:text-emerald-300">
                <p><strong>Payout Day:</strong> Every Tuesday</p>
                <p><strong>Payment Methods:</strong> PayPal, Venmo, Bank Transfer</p>
                <p><strong>Minimum Payout:</strong> $5 (auto-withdraw if over $50)</p>
                <p><strong>Weekly Earning Potential:</strong> $240-$500 (20 hours/week)</p>
              </div>
            </div>
            <div className="aspect-video bg-black rounded-lg overflow-hidden">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/lYwAQdR_sOw?rel=0"
                title="Babel Audio Earnings Guide"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>
          </CardContent>
        </Card>

        {/* Module 5 */}
        <Card className="mb-8 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/30 dark:to-orange-950/30">
            <CardTitle className="flex items-center gap-2">
              <span className="flex items-center justify-center w-8 h-8 bg-yellow-500 text-white rounded-full text-sm font-bold">5</span>
              Best Practices for Success
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">Audio Quality</h4>
                <ul className="space-y-1 text-sm text-yellow-800 dark:text-yellow-300">
                  <li>✓ Speak clearly and naturally</li>
                  <li>✓ Avoid background noise</li>
                  <li>✓ Maintain consistent volume</li>
                  <li>✓ Don't overlap with partner</li>
                </ul>
              </div>
              <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
                <h4 className="font-semibold text-orange-900 dark:text-orange-100 mb-2">Consistency</h4>
                <ul className="space-y-1 text-sm text-orange-800 dark:text-orange-300">
                  <li>✓ Work 2-3 sessions daily</li>
                  <li>✓ Be online during peak hours</li>
                  <li>✓ Maintain 95%+ acceptance rate</li>
                  <li>✓ Meet all quality standards</li>
                </ul>
              </div>
            </div>
            <div className="aspect-video bg-black rounded-lg overflow-hidden">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/W3g7ypwrlQE?rel=0"
                title="Babel Audio Pro Tips"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>
          </CardContent>
        </Card>

        {/* Module 6 */}
        <Card className="mb-8 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-950/30 dark:to-rose-950/30">
            <CardTitle className="flex items-center gap-2">
              <span className="flex items-center justify-center w-8 h-8 bg-red-500 text-white rounded-full text-sm font-bold">6</span>
              Troubleshooting & Common Pitfalls
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-3">
              <div className="flex gap-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-red-900 dark:text-red-100">Background Noise → Rejected</h4>
                  <p className="text-sm text-red-800 dark:text-red-300">Fix: Use quiet room, turn off fans, mute notifications during recording.</p>
                </div>
              </div>
              <div className="flex gap-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-red-900 dark:text-red-100">Internet Drops → Incomplete Session</h4>
                  <p className="text-sm text-red-800 dark:text-red-300">Fix: Use wired connection, avoid WiFi. Check speed (4+ Mbps minimum).</p>
                </div>
              </div>
              <div className="flex gap-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-red-900 dark:text-red-100">Inconsistent Work → Account Disabled</h4>
                  <p className="text-sm text-red-800 dark:text-red-300">Fix: Maintain steady participation. Even 2-3 sessions/week is better than sporadic work.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Module 7 */}
        <Card className="mb-8 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-950/30 dark:to-blue-950/30">
            <CardTitle className="flex items-center gap-2">
              <span className="flex items-center justify-center w-8 h-8 bg-indigo-500 text-white rounded-full text-sm font-bold">7</span>
              Scaling Up: From Beginner to Top Earner
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold mb-2">Week 1-2: Foundation</h4>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li>• Complete all orientation tasks</li>
                  <li>• Do 1-2 sessions daily to build confidence</li>
                  <li>• Ensure 100% acceptance on first 10 submissions</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Week 3-4: Build Routine</h4>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li>• Increase to 2-3 sessions daily</li>
                  <li>• Target bonus language projects (+$5/session)</li>
                  <li>• Expected: $50-100/week</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Week 5+: Optimize</h4>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li>• Aim for 3-5 sessions daily</li>
                  <li>• Take advanced projects (multi-language, special accents)</li>
                  <li>• Expected: $200-400/week</li>
                </ul>
              </div>
            </div>

            <div className="bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 rounded-lg p-4 mt-4">
              <h4 className="font-semibold text-indigo-900 dark:text-indigo-100 mb-2">Your Weekly Schedule Template</h4>
              <div className="bg-white dark:bg-slate-900 rounded p-3 text-sm font-mono text-muted-foreground">
                <p>Monday-Friday: 2 sessions × $25 = $50/day</p>
                <p>Saturday-Sunday: 3 sessions × $25 = $75/day</p>
                <p>Weekly Total: $340 (on-pace for $1,360/month)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Final Project */}
        <Card className="mb-8 border-2 border-primary overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-primary/20 to-primary/10">
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              Final Project: Mock Recording
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <p className="text-muted-foreground">
              Before your first real session, complete this practice to ensure you're ready:
            </p>
            <ol className="space-y-3">
              <li className="flex gap-3">
                <span className="flex items-center justify-center w-6 h-6 bg-primary text-white rounded-full text-sm font-bold flex-shrink-0">1</span>
                <span>Find a partner or record yourself answering 5 questions naturally (5-10 mins total)</span>
              </li>
              <li className="flex gap-3">
                <span className="flex items-center justify-center w-6 h-6 bg-primary text-white rounded-full text-sm font-bold flex-shrink-0">2</span>
                <span>Review the audio on your computer—check for background noise, clarity, volume</span>
              </li>
              <li className="flex gap-3">
                <span className="flex items-center justify-center w-6 h-6 bg-primary text-white rounded-full text-sm font-bold flex-shrink-0">3</span>
                <span>Compare to Babel's guidelines—would THIS pass quality review?</span>
              </li>
              <li className="flex gap-3">
                <span className="flex items-center justify-center w-6 h-6 bg-primary text-white rounded-full text-sm font-bold flex-shrink-0">4</span>
                <span>Fix any issues and repeat until you're confident</span>
              </li>
            </ol>
            <div className="mt-4 p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-lg">
              <p className="text-sm text-emerald-800 dark:text-emerald-300">
                ✓ <strong>Once complete:</strong> You're ready to apply or start earning within 24-48 hours of approval.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Quick Summary */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>📊 Quick Summary: Your Babel Audio Path</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-2">Module</th>
                    <th className="text-left py-2 px-2">Focus</th>
                    <th className="text-left py-2 px-2">Time</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-3 px-2"><span className="font-semibold">1</span></td>
                    <td className="py-3 px-2">Understand the platform</td>
                    <td className="py-3 px-2">10 mins</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-2"><span className="font-semibold">2</span></td>
                    <td className="py-3 px-2">Setup your workspace</td>
                    <td className="py-3 px-2">30 mins</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-2"><span className="font-semibold">3</span></td>
                    <td className="py-3 px-2">Learn task types</td>
                    <td className="py-3 px-2">15 mins</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-2"><span className="font-semibold">4</span></td>
                    <td className="py-3 px-2">Understand payments</td>
                    <td className="py-3 px-2">5 mins</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-2"><span className="font-semibold">5</span></td>
                    <td className="py-3 px-2">Best practices</td>
                    <td className="py-3 px-2">20 mins</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-2"><span className="font-semibold">6</span></td>
                    <td className="py-3 px-2">Troubleshoot issues</td>
                    <td className="py-3 px-2">10 mins</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-2"><span className="font-semibold">7</span></td>
                    <td className="py-3 px-2">Scale up strategy</td>
                    <td className="py-3 px-2">10 mins</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-muted-foreground text-sm mt-4">
              <strong>Total course time:</strong> ~100 mins (includes videos) | <strong>Expected earnings:</strong> $240-500/week after 4 weeks
            </p>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
