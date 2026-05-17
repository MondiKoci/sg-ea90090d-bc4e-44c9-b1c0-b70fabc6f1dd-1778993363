import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { authService } from "@/services/authService";
import { galleryService, type BeforeAfterCase } from "@/services/galleryService";
import { ArrowLeft, Plus, Image as ImageIcon, Trash2, Edit } from "lucide-react";

export default function AdminGallery() {
  const router = useRouter();
  const { toast } = useToast();
  const [cases, setCases] = useState<BeforeAfterCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const beforeInputRef = useRef<HTMLInputElement>(null);
  const afterInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    treatment_type: "",
    description: "",
    before_image_url: "",
    after_image_url: "",
    published: true,
    display_order: 0,
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const session = await authService.getCurrentSession();
      if (!session) {
        router.push("/admin/login");
        return;
      }
      loadCases();
    } catch (error) {
      router.push("/admin/login");
    }
  };

  const loadCases = async () => {
    try {
      const data = await galleryService.getAllCases();
      setCases(data);
    } catch (error) {
      toast({ title: "Error", description: "Failed to load cases", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: "before" | "after") => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const url = await galleryService.uploadCaseImage(file, type);
      setFormData(prev => ({
        ...prev,
        [type === "before" ? "before_image_url" : "after_image_url"]: url
      }));
      toast({ title: "Success", description: "Image uploaded successfully" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to upload image", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.before_image_url || !formData.after_image_url || !formData.treatment_type) {
      toast({ title: "Validation Error", description: "Treatment type and both images are required", variant: "destructive" });
      return;
    }

    try {
      await galleryService.createCase(formData);
      toast({ title: "Success", description: "Case added successfully" });
      setIsDialogOpen(false);
      setFormData({
        treatment_type: "",
        description: "",
        before_image_url: "",
        after_image_url: "",
        published: true,
        display_order: 0,
      });
      loadCases();
    } catch (error) {
      toast({ title: "Error", description: "Failed to create case", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string, beforeUrl: string | null, afterUrl: string | null) => {
    if (!confirm("Are you sure you want to delete this case?")) return;

    try {
      if (beforeUrl) await galleryService.deleteCaseImage(beforeUrl).catch(() => {});
      if (afterUrl) await galleryService.deleteCaseImage(afterUrl).catch(() => {});
      await galleryService.deleteCase(id);
      
      toast({ title: "Success", description: "Case deleted successfully" });
      loadCases();
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete case", variant: "destructive" });
    }
  };

  const handleTogglePublish = async (id: string, currentStatus: boolean) => {
    try {
      await galleryService.updateCase(id, { published: !currentStatus });
      loadCases();
    } catch (error) {
      toast({ title: "Error", description: "Failed to update status", variant: "destructive" });
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-card border-b border-border py-4">
        <div className="container flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/patients">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold font-sans">Gallery Management</h1>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" /> Add Case
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl">
              <DialogHeader>
                <DialogTitle>Add Before & After Case</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Treatment Type *</Label>
                  <Input 
                    value={formData.treatment_type}
                    onChange={(e) => setFormData(prev => ({ ...prev, treatment_type: e.target.value }))}
                    placeholder="e.g. Full Mouth Reconstruction"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea 
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Patient presentation and treatment details..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Before Image *</Label>
                    <div className="border-2 border-dashed rounded-lg p-4 text-center">
                      {formData.before_image_url ? (
                        <div className="relative aspect-square">
                          <img src={formData.before_image_url} alt="Before" className="w-full h-full object-cover rounded-md" />
                          <Button 
                            type="button" variant="destructive" size="sm" 
                            className="absolute top-2 right-2"
                            onClick={() => setFormData(prev => ({ ...prev, before_image_url: "" }))}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div>
                          <input 
                            type="file" accept="image/*" className="hidden" ref={beforeInputRef}
                            onChange={(e) => handleImageUpload(e, "before")}
                          />
                          <Button type="button" variant="outline" onClick={() => beforeInputRef.current?.click()} disabled={uploading}>
                            <ImageIcon className="h-4 w-4 mr-2" /> {uploading ? "Uploading..." : "Upload Before"}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>After Image *</Label>
                    <div className="border-2 border-dashed rounded-lg p-4 text-center">
                      {formData.after_image_url ? (
                        <div className="relative aspect-square">
                          <img src={formData.after_image_url} alt="After" className="w-full h-full object-cover rounded-md" />
                          <Button 
                            type="button" variant="destructive" size="sm" 
                            className="absolute top-2 right-2"
                            onClick={() => setFormData(prev => ({ ...prev, after_image_url: "" }))}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div>
                          <input 
                            type="file" accept="image/*" className="hidden" ref={afterInputRef}
                            onChange={(e) => handleImageUpload(e, "after")}
                          />
                          <Button type="button" variant="outline" onClick={() => afterInputRef.current?.click()} disabled={uploading}>
                            <ImageIcon className="h-4 w-4 mr-2" /> {uploading ? "Uploading..." : "Upload After"}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 pt-2">
                  <Switch 
                    id="published" 
                    checked={formData.published}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, published: checked }))}
                  />
                  <Label htmlFor="published">Published (visible on website)</Label>
                </div>

                <Button type="submit" className="w-full" disabled={uploading}>
                  Save Case
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <main className="container py-8">
        <Card>
          <CardHeader>
            <CardTitle>Before & After Cases</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Images</TableHead>
                  <TableHead>Treatment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cases.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                      No cases found. Add one to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  cases.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell>
                        <div className="flex gap-2">
                          <img src={c.before_image_url || ""} alt="Before" className="w-12 h-12 rounded object-cover" />
                          <img src={c.after_image_url || ""} alt="After" className="w-12 h-12 rounded object-cover" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{c.treatment_type}</div>
                        <div className="text-sm text-muted-foreground line-clamp-1">{c.description}</div>
                      </TableCell>
                      <TableCell>
                        <Switch 
                          checked={c.published || false}
                          onCheckedChange={() => handleTogglePublish(c.id, c.published || false)}
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDelete(c.id, c.before_image_url, c.after_image_url)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}