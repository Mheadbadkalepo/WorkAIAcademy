import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Navigate, useParams } from "react-router";
import { useUnlock } from "../contexts/UnlockContext";
import { useAuth } from "../contexts/AuthContext";
import { Card, CardContent } from "../components/ui/card";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";

export default function GuideDetail() {
  const { slug } = useParams();
  const { isUnlocked } = useUnlock();
  const { user, isAdmin } = useAuth();
  const [guide, setGuide] = useState<any>(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGuide = async () => {
      const { data, error } = await supabase.from('guides').select('*').eq('path', slug).single();
      if (!error && data) {
        setGuide(data);
        
        // Evaluate Access Permissions
        if (isUnlocked || isAdmin) {
          setHasAccess(true);
        } else if (user) {
          const { data: ugData } = await supabase
            .from('user_guides')
            .select('*')
            .eq('user_id', user.id)
            .eq('guide_id', data.id)
            .single();
            
          if (ugData) {
            setHasAccess(true);
          }
        }
      }
      setLoading(false);
    };
    
    fetchGuide();
  }, [slug, isUnlocked, isAdmin, user]);

  if (!loading && !hasAccess) {
    return <Navigate to="/guides" />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!guide) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <main className="max-w-4xl mx-auto py-16 px-4 text-center">
          <h1 className="text-3xl font-bold">Guide Not Found</h1>
          <p className="text-muted-foreground mt-4">The guide you are looking for does not exist.</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="max-w-4xl mx-auto py-16 px-4">
        <div className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-primary">{guide.title}</h1>
          <p className="text-xl text-muted-foreground">{guide.description}</p>
        </div>
        
        {guide.content ? (
          <Card className="border-2">
            <CardContent className="pt-6">
              <ReactMarkdown 
                components={{
                  h1: ({node, ...props}: any) => <h1 className="text-4xl font-bold mt-8 mb-4 border-b pb-2" {...props} />,
                  h2: ({node, ...props}: any) => <h2 className="text-3xl font-bold mt-8 mb-4 border-b pb-2" {...props} />,
                  h3: ({node, ...props}: any) => <h3 className="text-2xl font-semibold mt-6 mb-3" {...props} />,
                  h4: ({node, ...props}: any) => <h4 className="text-xl font-semibold mt-4 mb-2" {...props} />,
                  p: ({node, ...props}: any) => <p className="text-muted-foreground leading-7 mb-4" {...props} />,
                  ul: ({node, ...props}: any) => <ul className="list-disc pl-6 mb-4 text-muted-foreground space-y-2" {...props} />,
                  ol: ({node, ...props}: any) => <ol className="list-decimal pl-6 mb-4 text-muted-foreground space-y-2" {...props} />,
                  li: ({node, ...props}: any) => <li className="" {...props} />,
                  blockquote: ({node, ...props}: any) => <blockquote className="border-l-4 border-primary pl-4 italic my-4 text-muted-foreground bg-primary/5 py-2 rounded-r" {...props} />,
                }}
              >
                {guide.content}
              </ReactMarkdown>
            </CardContent>
          </Card>
        ) : (
          <div className="text-center text-muted-foreground py-12 border rounded-lg bg-accent/5">
            This guide is empty. Add content via the Admin panel.
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
