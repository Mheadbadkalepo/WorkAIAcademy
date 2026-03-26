import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../../lib/supabase";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { Badge } from "../components/ui/badge";

export default function Admin() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("ai_jobs");
  const [data, setData] = useState<any[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Form states
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate("/dashboard");
    }
  }, [user, isAdmin, loading, navigate]);

  const fetchData = async (tab: string) => {
    setIsFetching(true);
    try {
      const { data: result, error } = await supabase.from(tab).select("*").order("id", { ascending: false });
      if (error) {
        console.error("Error fetching data:", error);
      } else {
        setData(result || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchData(activeTab);
    }
  }, [activeTab, isAdmin]);

  const handleDelete = async (id: number) => {
    try {
      const { error } = await supabase.from(activeTab).delete().eq("id", id);
      if (!error) {
        fetchData(activeTab);
      } else {
        alert("Failed to delete record.");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { id, ...saveData } = formData;
      if (editingId) {
        const { error } = await supabase.from(activeTab).update(saveData).eq('id', editingId);
        if (!error) {
          setFormData({});
          setEditingId(null);
          fetchData(activeTab);
        } else {
          console.error("Update error", error);
          alert("Failed to update. Check console or Supabase logs.");
        }
      } else {
        const { error } = await supabase.from(activeTab).insert([saveData]);
        if (!error) {
          setFormData({});
          fetchData(activeTab);
        } else {
          console.error("Insert error", error);
          alert("Failed to insert. Check console or Supabase logs.");
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (item: any) => {
    setEditingId(item.id);
    setFormData(item);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({});
  };

  if (loading || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  const renderAIJobForm = () => (
    <form onSubmit={handleCreateOrUpdate} className="space-y-4 max-w-lg mb-8 p-4 border rounded">
      <h3 className="font-bold text-lg mb-2 flex items-center gap-2"><Plus className="w-4 h-4" /> {editingId ? "Edit AI Job" : "Add AI Job"}</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1"><Label>Company</Label><Input value={formData.company || ""} onChange={e => setFormData({...formData, company: e.target.value})} required/></div>
        <div className="space-y-1"><Label>Title</Label><Input value={formData.title || ""} onChange={e => setFormData({...formData, title: e.target.value})} required/></div>
        <div className="space-y-1"><Label>Type</Label><Input value={formData.type || "Remote"} onChange={e => setFormData({...formData, type: e.target.value})}/></div>
        <div className="space-y-1"><Label>Pay</Label><Input value={formData.pay || ""} onChange={e => setFormData({...formData, pay: e.target.value})}/></div>
        <div className="space-y-1"><Label>Location</Label><Input value={formData.location || "Worldwide"} onChange={e => setFormData({...formData, location: e.target.value})}/></div>
        <div className="space-y-1"><Label>Requirements</Label><Input value={formData.requirements || ""} onChange={e => setFormData({...formData, requirements: e.target.value})}/></div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1"><Label>Description</Label><Input value={formData.description || ""} onChange={e => setFormData({...formData, description: e.target.value})}/></div>
        <div className="space-y-1"><Label>Apply Link URL</Label><Input type="url" placeholder="https://" value={formData.apply_link || ""} onChange={e => setFormData({...formData, apply_link: e.target.value})}/></div>
      </div>
      <div className="flex gap-2">
        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving..." : editingId ? "Update Job" : "Add Job"}</Button>
        {editingId && <Button type="button" variant="outline" onClick={handleCancelEdit}>Cancel</Button>}
      </div>
    </form>
  );

  const renderRemoteJobForm = () => (
    <form onSubmit={handleCreateOrUpdate} className="space-y-4 max-w-lg mb-8 p-4 border rounded">
      <h3 className="font-bold text-lg mb-2 flex items-center gap-2"><Plus className="w-4 h-4" /> {editingId ? "Edit Remote Job" : "Add Remote Job"}</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1"><Label>Company</Label><Input value={formData.company || ""} onChange={e => setFormData({...formData, company: e.target.value})} required/></div>
        <div className="space-y-1"><Label>Title</Label><Input value={formData.title || ""} onChange={e => setFormData({...formData, title: e.target.value})} required/></div>
        <div className="space-y-1"><Label>Type</Label><Input value={formData.type || "Remote"} onChange={e => setFormData({...formData, type: e.target.value})}/></div>
        <div className="space-y-1"><Label>Pay</Label><Input value={formData.pay || ""} onChange={e => setFormData({...formData, pay: e.target.value})}/></div>
        <div className="space-y-1"><Label>Location</Label><Input value={formData.location || "Worldwide"} onChange={e => setFormData({...formData, location: e.target.value})}/></div>
        <div className="space-y-1"><Label>Category</Label><Input value={formData.category || ""} onChange={e => setFormData({...formData, category: e.target.value})}/></div>
        <div className="col-span-2 space-y-1"><Label>Apply Link URL</Label><Input type="url" placeholder="https://" value={formData.apply_link || ""} onChange={e => setFormData({...formData, apply_link: e.target.value})}/></div>
      </div>
      <div className="flex gap-2">
        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving..." : editingId ? "Update Job" : "Add Job"}</Button>
        {editingId && <Button type="button" variant="outline" onClick={handleCancelEdit}>Cancel</Button>}
      </div>
    </form>
  );

  const renderGuidesForm = () => (
    <form onSubmit={handleCreateOrUpdate} className="space-y-4 max-w-lg mb-8 p-4 border rounded">
      <h3 className="font-bold text-lg mb-2 flex items-center gap-2"><Plus className="w-4 h-4" /> {editingId ? "Edit Guide" : "Add Guide"}</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1"><Label>Title</Label><Input value={formData.title || ""} onChange={e => setFormData({...formData, title: e.target.value})} required/></div>
        <div className="space-y-1"><Label>Path (URL slug)</Label><Input value={formData.path || ""} onChange={e => setFormData({...formData, path: e.target.value})}/></div>
        <div className="space-y-1"><Label>Price ($)</Label><Input type="number" value={formData.price || 0} onChange={e => setFormData({...formData, price: Number(e.target.value)})}/></div>
        <div className="space-y-1"><Label>Lessons Count</Label><Input type="number" value={formData.lessons || 0} onChange={e => setFormData({...formData, lessons: Number(e.target.value)})}/></div>
        <div className="space-y-1"><Label>Tier</Label><Input placeholder="low or high" value={formData.tier || "low"} onChange={e => setFormData({...formData, tier: e.target.value})}/></div>
      </div>
      <div className="space-y-1"><Label>Description (Short summary)</Label><Input value={formData.description || ""} onChange={e => setFormData({...formData, description: e.target.value})}/></div>
      <div className="space-y-1">
        <Label>Full Guide Content (Markdown, Tables, and Video Links supported)</Label>
        <textarea 
          value={formData.content || ""} 
          onChange={e => setFormData({...formData, content: e.target.value})}
          className="w-full min-h-[300px] p-3 rounded-md border border-input bg-transparent text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          placeholder="# Phase 1: Foundation&#10;&#10;Lesson 1: Understanding...&#10;&#10;[Watch this video](https://youtube.com/watch?v=...)&#10;Or paste a raw link: https://example.com/video.mp4"
        />
      </div>
      <div className="flex gap-2">
        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving..." : editingId ? "Update Guide" : "Add Guide"}</Button>
        {editingId && <Button type="button" variant="outline" onClick={handleCancelEdit}>Cancel</Button>}
      </div>
    </form>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-7xl mx-auto py-12 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <p className="text-muted-foreground">Manage your content here.</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8">
            <TabsTrigger value="ai_jobs">AI Jobs</TabsTrigger>
            <TabsTrigger value="remote_jobs">Remote Jobs</TabsTrigger>
            <TabsTrigger value="guides">Guides</TabsTrigger>
          </TabsList>

          <TabsContent value="ai_jobs">
            {renderAIJobForm()}
            <div className="space-y-4">
              {isFetching ? <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" /> : data.map(job => (
                <Card key={job.id} className="flex flex-row items-center justify-between p-4 border">
                  <div>
                    <CardTitle className="text-lg">{job.title}</CardTitle>
                    <CardDescription>{job.company} - {job.pay}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEditClick(job)}>Edit</Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(job.id)}><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="remote_jobs">
            {renderRemoteJobForm()}
            <div className="space-y-4">
              {isFetching ? <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" /> : data.map(job => (
                <Card key={job.id} className="flex flex-row items-center justify-between p-4 border">
                  <div>
                    <CardTitle className="text-lg">{job.title}</CardTitle>
                    <CardDescription>{job.company} - {job.category}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEditClick(job)}>Edit</Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(job.id)}><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="guides">
            {renderGuidesForm()}
            <div className="space-y-4">
              {isFetching ? <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" /> : data.map(guide => (
                <Card key={guide.id} className="flex flex-row items-center justify-between p-4 border">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">{guide.title} <Badge>{guide.tier || 'low'} paying</Badge></CardTitle>
                    <CardDescription>${guide.price} - {guide.lessons} lessons</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEditClick(guide)}>Edit</Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(guide.id)}><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
}
