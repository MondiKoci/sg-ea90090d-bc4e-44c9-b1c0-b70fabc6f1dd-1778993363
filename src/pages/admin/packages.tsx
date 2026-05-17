import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { AdminMenu } from "@/components/AdminMenu";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { authService } from "@/services/authService";
import { packageService } from "@/services/packageService";
import type { Package, PackageInclusion } from "@/services/packageService";
import {
  Plus,
  Edit,
  Trash2,
  LogOut,
  CheckCircle2,
  Circle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

type InclusionCategory = "dental" | "accommodation" | "transport" | "translation" | "activities" | "meals" | "warranty" | "support" | "other";

const categoryLabels: Record<InclusionCategory, string> = {
  dental: "Dental Services",
  accommodation: "Accommodation",
  transport: "Transportation",
  translation: "Translation & Assistance",
  activities: "Activities & Tours",
  meals: "Meals",
  warranty: "Warranty & Guarantees",
  support: "Follow-up Support",
  other: "Other Services",
};

export default function AdminPackagesPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);
  const [expandedPackage, setExpandedPackage] = useState<string | null>(null);
  const [packageInclusions, setPackageInclusions] = useState<Record<string, PackageInclusion[]>>({});

  const [formData, setFormData] = useState({
    name: "",
    destination: "",
    price_from: "",
    price_to: "",
    duration_days: "",
    description: "",
    highlights: "",
    published: false,
    display_order: 0,
  });

  const [inclusions, setInclusions] = useState<{
    category: InclusionCategory;
    item_text: string;
    is_premium: boolean;
  }[]>([]);

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
      loadPackages();
    } catch (error) {
      router.push("/admin/login");
    }
  };

  const loadPackages = async () => {
    try {
      const data = await packageService.getAllPackages();
      setPackages(data);
    } catch (error) {
      console.error("Failed to load packages:", error);
      toast({
        title: "Error",
        description: "Failed to load packages",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadPackageInclusions = async (packageId: string) => {
    if (packageInclusions[packageId]) return;

    try {
      const data = await packageService.getPackageInclusions(packageId);
      setPackageInclusions((prev) => ({ ...prev, [packageId]: data }));
    } catch (error) {
      console.error("Failed to load inclusions:", error);
    }
  };

  const handleSignOut = async () => {
    await authService.signOut();
    router.push("/admin/login");
  };

  const handleOpenDialog = (pkg?: Package) => {
    if (pkg) {
      setEditingPackage(pkg);
      setFormData({
        name: pkg.name,
        destination: pkg.destination,
        price_from: pkg.price_from?.toString() || "",
        price_to: pkg.price_to?.toString() || "",
        duration_days: pkg.duration_days?.toString() || "",
        description: pkg.description || "",
        highlights: pkg.highlights || "",
        published: pkg.published || false,
        display_order: pkg.display_order || 0,
      });
      loadPackageInclusionsForEdit(pkg.id);
    } else {
      setEditingPackage(null);
      setFormData({
        name: "",
        destination: "",
        price_from: "",
        price_to: "",
        duration_days: "",
        description: "",
        highlights: "",
        published: false,
        display_order: 0,
      });
      setInclusions([]);
    }
    setIsDialogOpen(true);
  };

  const loadPackageInclusionsForEdit = async (packageId: string) => {
    try {
      const data = await packageService.getPackageInclusions(packageId);
      setInclusions(
        data.map((inc) => ({
          category: inc.category as InclusionCategory,
          item_text: inc.item_text,
          is_premium: inc.is_premium || false,
        }))
      );
    } catch (error) {
      console.error("Failed to load inclusions for edit:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.destination) {
      toast({
        title: "Validation Error",
        description: "Name and destination are required",
        variant: "destructive",
      });
      return;
    }

    try {
      const packageData = {
        name: formData.name,
        destination: formData.destination,
        price_from: formData.price_from ? parseFloat(formData.price_from) : null,
        price_to: formData.price_to ? parseFloat(formData.price_to) : null,
        duration_days: formData.duration_days ? parseInt(formData.duration_days) : null,
        description: formData.description || null,
        highlights: formData.highlights || null,
        published: formData.published,
        display_order: formData.display_order,
        created_by: null,
      };

      if (editingPackage) {
        await packageService.updatePackage(editingPackage.id, packageData);
        
        // Delete existing inclusions and recreate
        const existingInclusions = await packageService.getPackageInclusions(editingPackage.id);
        for (const inc of existingInclusions) {
          await packageService.deleteInclusion(inc.id);
        }
        
        // Add new inclusions
        for (const [index, inc] of inclusions.entries()) {
          await packageService.addInclusion({
            package_id: editingPackage.id,
            category: inc.category,
            item_text: inc.item_text,
            is_premium: inc.is_premium,
            display_order: index,
          });
        }

        toast({ title: "Success", description: "Package updated successfully" });
      } else {
        const packageId = await packageService.createPackage({
          ...packageData,
          inclusions: inclusions.map((inc, index) => ({
            category: inc.category,
            item_text: inc.item_text,
            is_premium: inc.is_premium,
            display_order: index,
          })),
        });

        toast({ title: "Success", description: "Package created successfully" });
      }

      setIsDialogOpen(false);
      loadPackages();
    } catch (error) {
      console.error("Failed to save package:", error);
      toast({
        title: "Error",
        description: "Failed to save package",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this package?")) return;

    try {
      await packageService.deletePackage(id);
      toast({ title: "Success", description: "Package deleted successfully" });
      loadPackages();
    } catch (error) {
      console.error("Failed to delete package:", error);
      toast({
        title: "Error",
        description: "Failed to delete package",
        variant: "destructive",
      });
    }
  };

  const addInclusion = () => {
    setInclusions([
      ...inclusions,
      { category: "dental", item_text: "", is_premium: false },
    ]);
  };

  const updateInclusion = (index: number, field: string, value: any) => {
    const updated = [...inclusions];
    updated[index] = { ...updated[index], [field]: value };
    setInclusions(updated);
  };

  const removeInclusion = (index: number) => {
    setInclusions(inclusions.filter((_, i) => i !== index));
  };

  const toggleExpanded = (packageId: string) => {
    if (expandedPackage === packageId) {
      setExpandedPackage(null);
    } else {
      setExpandedPackage(packageId);
      loadPackageInclusions(packageId);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <AdminMenu />
      
      <main className="flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-sans text-2xl font-bold text-primary">Package Management</h1>
          <div className="flex items-center gap-4">
            <Link href="/admin/patients">
              <Button variant="ghost">Patients</Button>
            </Link>
            <Link href="/admin/gallery">
              <Button variant="ghost">Gallery</Button>
            </Link>
            <Link href="/admin/blog">
              <Button variant="ghost">Blog</Button>
            </Link>
            <Button variant="ghost" onClick={handleSignOut} className="gap-2">
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Dental Tourism Packages</CardTitle>
            <Button onClick={() => handleOpenDialog()} className="gap-2">
              <Plus className="w-4 h-4" />
              Create Package
            </Button>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Loading...</div>
            ) : packages.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No packages yet. Create your first package!
              </div>
            ) : (
              <div className="space-y-4">
                {packages.map((pkg) => (
                  <div key={pkg.id} className="border border-border rounded-lg">
                    <div className="p-4 flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-sans text-lg font-semibold">{pkg.name}</h3>
                          <Badge variant={pkg.published ? "default" : "secondary"}>
                            {pkg.published ? "Published" : "Draft"}
                          </Badge>
                          <Badge variant="outline">{pkg.destination}</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <div>
                            Price: ${pkg.price_from || "N/A"} - ${pkg.price_to || "N/A"}
                          </div>
                          {pkg.duration_days && <div>Duration: {pkg.duration_days} days</div>}
                          {pkg.description && (
                            <p className="line-clamp-2 mt-2">{pkg.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => toggleExpanded(pkg.id)}
                        >
                          {expandedPackage === pkg.id ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleOpenDialog(pkg)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(pkg.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {expandedPackage === pkg.id && packageInclusions[pkg.id] && (
                      <div className="px-4 pb-4 border-t border-border pt-4">
                        <h4 className="font-semibold mb-3">Package Inclusions:</h4>
                        <div className="space-y-4">
                          {Object.entries(
                            packageInclusions[pkg.id].reduce((acc, inc) => {
                              if (!acc[inc.category]) acc[inc.category] = [];
                              acc[inc.category].push(inc);
                              return acc;
                            }, {} as Record<string, PackageInclusion[]>)
                          ).map(([category, items]) => (
                            <div key={category}>
                              <h5 className="font-medium text-sm text-primary mb-2">
                                {categoryLabels[category as InclusionCategory]}
                              </h5>
                              <ul className="space-y-1 ml-4">
                                {items.map((item) => (
                                  <li key={item.id} className="flex items-start gap-2 text-sm">
                                    <CheckCircle2 className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                                    <span className={item.is_premium ? "font-medium text-accent" : ""}>
                                      {item.item_text}
                                      {item.is_premium && " (Premium)"}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingPackage ? "Edit Package" : "Create New Package"}
              </DialogTitle>
              <DialogDescription>
                Build a comprehensive dental tourism package with all inclusions
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Package Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Complete Smile Makeover"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="destination">Destination *</Label>
                  <Input
                    id="destination"
                    value={formData.destination}
                    onChange={(e) =>
                      setFormData({ ...formData, destination: e.target.value })
                    }
                    placeholder="e.g., Istanbul, Turkey"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price_from">Price From ($)</Label>
                  <Input
                    id="price_from"
                    type="number"
                    step="0.01"
                    value={formData.price_from}
                    onChange={(e) =>
                      setFormData({ ...formData, price_from: e.target.value })
                    }
                    placeholder="3500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price_to">Price To ($)</Label>
                  <Input
                    id="price_to"
                    type="number"
                    step="0.01"
                    value={formData.price_to}
                    onChange={(e) =>
                      setFormData({ ...formData, price_to: e.target.value })
                    }
                    placeholder="8500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration_days">Duration (Days)</Label>
                  <Input
                    id="duration_days"
                    type="number"
                    value={formData.duration_days}
                    onChange={(e) =>
                      setFormData({ ...formData, duration_days: e.target.value })
                    }
                    placeholder="7"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="display_order">Display Order</Label>
                  <Input
                    id="display_order"
                    type="number"
                    value={formData.display_order}
                    onChange={(e) =>
                      setFormData({ ...formData, display_order: parseInt(e.target.value) })
                    }
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                  placeholder="Brief overview of the package..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="highlights">Highlights</Label>
                <Textarea
                  id="highlights"
                  value={formData.highlights}
                  onChange={(e) =>
                    setFormData({ ...formData, highlights: e.target.value })
                  }
                  rows={2}
                  placeholder="Key selling points (one per line)"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="published"
                  checked={formData.published}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, published: checked })
                  }
                />
                <Label htmlFor="published">Published (visible to public)</Label>
              </div>

              <div className="border-t border-border pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Package Inclusions</h3>
                  <Button type="button" onClick={addInclusion} size="sm" variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Inclusion
                  </Button>
                </div>

                <div className="space-y-3">
                  {inclusions.map((inclusion, index) => (
                    <div
                      key={index}
                      className="flex gap-2 items-start p-3 border border-border rounded-lg"
                    >
                      <div className="flex-1 grid grid-cols-3 gap-2">
                        <Select
                          value={inclusion.category}
                          onValueChange={(value) =>
                            updateInclusion(index, "category", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(categoryLabels).map(([key, label]) => (
                              <SelectItem key={key} value={key}>
                                {label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <Input
                          value={inclusion.item_text}
                          onChange={(e) =>
                            updateInclusion(index, "item_text", e.target.value)
                          }
                          placeholder="e.g., 3D dental scans"
                          className="col-span-2"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={inclusion.is_premium}
                            onCheckedChange={(checked) =>
                              updateInclusion(index, "is_premium", checked)
                            }
                          />
                          <Label className="text-xs">Premium</Label>
                        </div>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => removeInclusion(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingPackage ? "Update Package" : "Create Package"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}