import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { AdminMenu } from "@/components/AdminMenu";
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
import { blogService, type BlogPost } from "@/services/blogService";
import { ArrowLeft, Plus, Image as ImageIcon, Trash2, Edit } from "lucide-react";

export default function AdminBlog() {
  const router = useRouter();
  const { toast } = useToast();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    excerpt: "",
    content: "",
    featured_image_url: "",
    published: false,
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
      loadPosts();
    } catch (error) {
      router.push("/admin/login");
    }
  };

  const loadPosts = async () => {
    try {
      const data = await blogService.getAllPosts();
      setPosts(data);
    } catch (error) {
      toast({ title: "Error", description: "Failed to load blog posts", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const url = await blogService.uploadBlogImage(file);
      setFormData(prev => ({ ...prev, featured_image_url: url }));
      toast({ title: "Success", description: "Image uploaded successfully" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to upload image", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      toast({ title: "Validation Error", description: "Title and content are required", variant: "destructive" });
      return;
    }

    try {
      const session = await authService.getCurrentSession();
      const slug = blogService.generateSlug(formData.title);
      
      await blogService.createPost({
        ...formData,
        slug,
        author: session?.user?.id,
        published_at: formData.published ? new Date().toISOString() : null,
      } as any);
      
      toast({ title: "Success", description: "Post added successfully" });
      setIsDialogOpen(false);
      setFormData({
        title: "",
        category: "",
        excerpt: "",
        content: "",
        featured_image_url: "",
        published: false,
      });
      loadPosts();
    } catch (error) {
      toast({ title: "Error", description: "Failed to create post", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string, imageUrl: string | null) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      if (imageUrl) await blogService.deleteBlogImage(imageUrl).catch(() => {});
      await blogService.deletePost(id);
      
      toast({ title: "Success", description: "Post deleted successfully" });
      loadPosts();
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete post", variant: "destructive" });
    }
  };

  const handleTogglePublish = async (id: string, currentStatus: boolean) => {
    try {
      await blogService.updatePost(id, { 
        published: !currentStatus,
        published_at: !currentStatus ? new Date().toISOString() : null
      });
      loadPosts();
    } catch (error) {
      toast({ title: "Error", description: "Failed to update status", variant: "destructive" });
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-background flex">
      <AdminMenu />
      
      <main className="flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/admin/patients">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold font-sans">Blog Management</h1>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" /> Create Post
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create Blog Post</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Title *</Label>
                    <Input 
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Input 
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      placeholder="e.g. Treatments"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Excerpt</Label>
                  <Textarea 
                    value={formData.excerpt}
                    onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                    placeholder="Short summary for the blog list..."
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Featured Image</Label>
                  <div className="flex items-center gap-4">
                    {formData.featured_image_url && (
                      <img src={formData.featured_image_url} alt="Featured" className="w-16 h-16 object-cover rounded" />
                    )}
                    <div className="relative">
                      <input 
                        type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={handleImageUpload}
                      />
                      <Button type="button" variant="outline" disabled={uploading}>
                        <ImageIcon className="h-4 w-4 mr-2" /> {uploading ? "Uploading..." : "Select Image"}
                      </Button>
                    </div>
                    {formData.featured_image_url && (
                      <Button type="button" variant="ghost" className="text-destructive" onClick={() => setFormData(prev => ({ ...prev, featured_image_url: "" }))}>
                        Remove
                      </Button>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Content (HTML supported) *</Label>
                  <Textarea 
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="<p>Write your post content here...</p>"
                    className="font-mono text-sm"
                    rows={12}
                    required
                  />
                </div>

                <div className="flex items-center space-x-2 pt-2">
                  <Switch 
                    id="published" 
                    checked={formData.published}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, published: checked }))}
                  />
                  <Label htmlFor="published">Publish immediately</Label>
                </div>

                <Button type="submit" className="w-full" disabled={uploading}>
                  Save Post
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                      No blog posts found. Create one to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  posts.map((post) => (
                    <TableRow key={post.id}>
                      <TableCell className="font-medium">{post.title}</TableCell>
                      <TableCell>{post.category}</TableCell>
                      <TableCell>
                        {new Date(post.created_at || "").toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Switch 
                            checked={post.published || false}
                            onCheckedChange={() => handleTogglePublish(post.id, post.published || false)}
                          />
                          <span className="text-sm text-muted-foreground">
                            {post.published ? "Published" : "Draft"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDelete(post.id, post.featured_image_url)}
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