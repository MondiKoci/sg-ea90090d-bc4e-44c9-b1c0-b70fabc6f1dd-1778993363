import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { AdminMenu } from "@/components/AdminMenu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { authService } from "@/services/authService";
import { treatmentService } from "@/services/treatmentService";
import type { Treatment } from "@/services/treatmentService";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AdminTreatmentsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTreatment, setEditingTreatment] = useState<Treatment | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    icon_name: "",
    short_description: "",
    featured_image_url: "",
    hero_image_url: "",
    overview: "",
    benefits: "",
    procedure_steps: "",
    recovery_info: "",
    faq: "",
    price_range_min: "",
    price_range_max: "",
    typical_foreign_price: "",
    savings_percentage: "",
    duration_days: "",
    category: "",
    published: false,
    display_order: "0",
    meta_title: "",
    meta_description: "",
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
      loadTreatments();
    } catch (error) {
      router.push("/admin/login");
    }
  };

  const loadTreatments = async () => {
    try {
      const data = await treatmentService.getAllTreatments();
      setTreatments(data);
    } catch (error) {
      console.error("Failed to load treatments:", error);
      toast({
        title: "Error",
        description: "Failed to load treatments",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      icon_name: "",
      short_description: "",
      featured_image_url: "",
      hero_image_url: "",
      overview: "",
      benefits: "",
      procedure_steps: "",
      recovery_info: "",
      faq: "",
      price_range_min: "",
      price_range_max: "",
      typical_foreign_price: "",
      savings_percentage: "",
      duration_days: "",
      category: "",
      published: false,
      display_order: "0",
      meta_title: "",
      meta_description: "",
    });
    setEditingTreatment(null);
  };

  const handleEdit = (treatment: Treatment) => {
    setEditingTreatment(treatment);
    setFormData({
      title: treatment.title,
      icon_name: treatment.icon_name || "",
      short_description: treatment.short_description || "",
      featured_image_url: treatment.featured_image_url || "",
      hero_image_url: treatment.hero_image_url || "",
      overview: treatment.overview || "",
      benefits: treatment.benefits?.join("\n") || "",
      procedure_steps: treatment.procedure_steps?.join("\n") || "",
      recovery_info: treatment.recovery_info || "",
      faq: treatment.faq ? JSON.stringify(treatment.faq, null, 2) : "",
      price_range_min: treatment.price_range_min?.toString() || "",
      price_range_max: treatment.price_range_max?.toString() || "",
      typical_foreign_price: treatment.typical_foreign_price?.toString() || "",
      savings_percentage: treatment.savings_percentage?.toString() || "",
      duration_days: treatment.duration_days?.toString() || "",
      category: treatment.category || "",
      published: treatment.published || false,
      display_order: treatment.display_order?.toString() || "0",
      meta_title: treatment.meta_title || "",
      meta_description: treatment.meta_description || "",
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) {
      toast({ title: "Validation Error", description: "Title is required", variant: "destructive" });
      return;
    }

    try {
      const slug = treatmentService.generateSlug(formData.title);
      const treatmentData = {
        title: formData.title,
        slug,
        icon_name: formData.icon_name || null,
        short_description: formData.short_description || null,
        featured_image_url: formData.featured_image_url || null,
        hero_image_url: formData.hero_image_url || null,
        overview: formData.overview || null,
        benefits: formData.benefits ? formData.benefits.split("\n").filter(b => b.trim()) : null,
        procedure_steps: formData.procedure_steps ? formData.procedure_steps.split("\n").filter(s => s.trim()) : null,
        recovery_info: formData.recovery_info || null,
        faq: formData.faq ? JSON.parse(formData.faq) : null,
        price_range_min: formData.price_range_min ? parseFloat(formData.price_range_min) : null,
        price_range_max: formData.price_range_max ? parseFloat(formData.price_range_max) : null,
        typical_foreign_price: formData.typical_foreign_price ? parseFloat(formData.typical_foreign_price) : null,
        savings_percentage: formData.savings_percentage ? parseInt(formData.savings_percentage) : null,
        duration_days: formData.duration_days ? parseInt(formData.duration_days) : null,
        category: formData.category || null,
        published: formData.published,
        display_order: parseInt(formData.display_order) || 0,
        meta_title: formData.meta_title || null,
        meta_description: formData.meta_description || null,
      };

      if (editingTreatment) {
        await treatmentService.updateTreatment(editingTreatment.id, treatmentData as any);
        toast({ title: "Success", description: "Treatment updated successfully" });
      } else {
        await treatmentService.createTreatment(treatmentData as any);
        toast({ title: "Success", description: "Treatment created successfully" });
      }

      setIsDialogOpen(false);
      resetForm();
      loadTreatments();
    } catch (error) {
      console.error("Failed to save treatment:", error);
      toast({
        title: "Error",
        description: "Failed to save treatment",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this treatment?")) return;

    try {
      await treatmentService.deleteTreatment(id);
      toast({ title: "Success", description: "Treatment deleted successfully" });
      loadTreatments();
    } catch (error) {
      console.error("Failed to delete treatment:", error);
      toast({
        title: "Error",
        description: "Failed to delete treatment",
        variant: "destructive",
      });
    }
  };

  const handleTogglePublish = async (treatment: Treatment) => {
    try {
      await treatmentService.updateTreatment(treatment.id, {
        published: !treatment.published,
      });
      loadTreatments();
    } catch (error) {
      console.error("Failed to toggle publish:", error);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background flex">
      <AdminMenu />
      
      <main className="flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <Link href="/admin/patients">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Admin
            </Button>
          </Link>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Treatment
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingTreatment ? "Edit Treatment" : "Add New Treatment"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label htmlFor="title">Treatment Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g., Dental Implants"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="icon_name">Icon Name (Lucide)</Label>
                    <Input
                      id="icon_name"
                      value={formData.icon_name}
                      onChange={(e) => setFormData({ ...formData, icon_name: e.target.value })}
                      placeholder="e.g., Sparkles"
                    />
                  </div>

                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      placeholder="e.g., Cosmetic"
                    />
                  </div>

                  <div className="col-span-2">
                    <Label htmlFor="short_description">Short Description</Label>
                    <Textarea
                      id="short_description"
                      value={formData.short_description}
                      onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                      rows={2}
                      placeholder="Brief summary for card display"
                    />
                  </div>

                  <div className="col-span-2">
                    <Label htmlFor="overview">Overview</Label>
                    <Textarea
                      id="overview"
                      value={formData.overview}
                      onChange={(e) => setFormData({ ...formData, overview: e.target.value })}
                      rows={4}
                      placeholder="Detailed treatment description"
                    />
                  </div>

                  <div className="col-span-2">
                    <Label htmlFor="benefits">Benefits (one per line)</Label>
                    <Textarea
                      id="benefits"
                      value={formData.benefits}
                      onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                      rows={3}
                      placeholder="Long-lasting results&#10;Natural appearance&#10;Improved confidence"
                    />
                  </div>

                  <div className="col-span-2">
                    <Label htmlFor="procedure_steps">Procedure Steps (one per line)</Label>
                    <Textarea
                      id="procedure_steps"
                      value={formData.procedure_steps}
                      onChange={(e) => setFormData({ ...formData, procedure_steps: e.target.value })}
                      rows={3}
                      placeholder="Initial consultation&#10;Treatment planning&#10;Procedure&#10;Follow-up"
                    />
                  </div>

                  <div className="col-span-2">
                    <Label htmlFor="recovery_info">Recovery Information</Label>
                    <Textarea
                      id="recovery_info"
                      value={formData.recovery_info}
                      onChange={(e) => setFormData({ ...formData, recovery_info: e.target.value })}
                      rows={3}
                      placeholder="Expected recovery time and care instructions"
                    />
                  </div>

                  <div className="col-span-2">
                    <Label htmlFor="faq">FAQ (JSON format)</Label>
                    <Textarea
                      id="faq"
                      value={formData.faq}
                      onChange={(e) => setFormData({ ...formData, faq: e.target.value })}
                      rows={4}
                      placeholder='[{"question": "How long does it last?", "answer": "10-15 years"}]'
                    />
                  </div>

                  <div>
                    <Label htmlFor="price_min">Price Range Min ($)</Label>
                    <Input
                      id="price_min"
                      type="number"
                      value={formData.price_range_min}
                      onChange={(e) => setFormData({ ...formData, price_range_min: e.target.value })}
                      placeholder="800"
                    />
                  </div>

                  <div>
                    <Label htmlFor="price_max">Price Range Max ($)</Label>
                    <Input
                      id="price_max"
                      type="number"
                      value={formData.price_range_max}
                      onChange={(e) => setFormData({ ...formData, price_range_max: e.target.value })}
                      placeholder="1200"
                    />
                  </div>

                  <div>
                    <Label htmlFor="foreign_price">Typical Foreign Price ($)</Label>
                    <Input
                      id="foreign_price"
                      type="number"
                      value={formData.typical_foreign_price}
                      onChange={(e) => setFormData({ ...formData, typical_foreign_price: e.target.value })}
                      placeholder="4000"
                    />
                  </div>

                  <div>
                    <Label htmlFor="savings_percentage">Savings Percentage (%)</Label>
                    <Input
                      id="savings_percentage"
                      type="number"
                      value={formData.savings_percentage}
                      onChange={(e) => setFormData({ ...formData, savings_percentage: e.target.value })}
                      placeholder="70"
                    />
                  </div>

                  <div>
                    <Label htmlFor="duration">Duration (days)</Label>
                    <Input
                      id="duration"
                      type="number"
                      value={formData.duration_days}
                      onChange={(e) => setFormData({ ...formData, duration_days: e.target.value })}
                      placeholder="5"
                    />
                  </div>

                  <div>
                    <Label htmlFor="display_order">Display Order</Label>
                    <Input
                      id="display_order"
                      type="number"
                      value={formData.display_order}
                      onChange={(e) => setFormData({ ...formData, display_order: e.target.value })}
                      placeholder="0"
                    />
                  </div>

                  <div className="col-span-2">
                    <Label htmlFor="featured_image">Featured Image URL</Label>
                    <Input
                      id="featured_image"
                      value={formData.featured_image_url}
                      onChange={(e) => setFormData({ ...formData, featured_image_url: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>

                  <div className="col-span-2">
                    <Label htmlFor="hero_image">Hero Image URL</Label>
                    <Input
                      id="hero_image"
                      value={formData.hero_image_url}
                      onChange={(e) => setFormData({ ...formData, hero_image_url: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>

                  <div className="col-span-2">
                    <Label htmlFor="meta_title">SEO Title</Label>
                    <Input
                      id="meta_title"
                      value={formData.meta_title}
                      onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                      placeholder="Optional custom SEO title"
                    />
                  </div>

                  <div className="col-span-2">
                    <Label htmlFor="meta_description">SEO Description</Label>
                    <Textarea
                      id="meta_description"
                      value={formData.meta_description}
                      onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                      rows={2}
                      placeholder="Optional custom SEO description"
                    />
                  </div>

                  <div className="col-span-2 flex items-center gap-2">
                    <Switch
                      id="published"
                      checked={formData.published}
                      onCheckedChange={(checked) => setFormData({ ...formData, published: checked })}
                    />
                    <Label htmlFor="published">Published</Label>
                  </div>
                </div>

                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingTreatment ? "Update" : "Create"} Treatment
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </main>
    </div>
  );
}