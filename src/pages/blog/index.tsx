import { useEffect, useState } from "react";
import Link from "next/link";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { blogService } from "@/services/blogService";
import type { BlogPost } from "@/services/blogService";
import { Calendar, Clock, ArrowRight } from "lucide-react";

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const data = await blogService.getPublishedPosts();
      setPosts(data);
    } catch (error) {
      console.error("Failed to load blog posts:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO
        title="Dental Tourism Blog & Guides"
        description="Expert insights, patient stories, and comprehensive guides about dental tourism, treatments, and international dental care. Learn how to save on quality dental work abroad."
        url="/blog"
        type="website"
        keywords="dental tourism blog, dental care guides, patient testimonials, dental treatment information, international dentistry articles"
      />
      <div className="min-h-screen bg-background">
        <Navigation />
        
        <main className="py-20">
          <div className="container max-w-6xl">
            <div className="text-center mb-16">
              <h1 className="font-sans text-4xl md:text-5xl font-bold mb-4">
                Dental Tourism Blog
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Expert insights, patient stories, and guides to help you make informed decisions about your dental care journey
              </p>
            </div>

            {loading ? (
              <div className="text-center py-12">Loading posts...</div>
            ) : posts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No blog posts published yet.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                  <Link key={post.id} href={`/blog/${post.slug}`}>
                    <Card className="h-full hover:shadow-xl hover:border-accent/50 transition-all duration-300 cursor-pointer group">
                      {post.featured_image_url && (
                        <div className="aspect-video bg-muted overflow-hidden">
                          <img 
                            src={post.featured_image_url} 
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      )}
                      <CardHeader>
                        <div className="flex items-center gap-2 mb-2">
                          {post.category && (
                            <Badge variant="secondary" className="font-sans text-xs">
                              {post.category}
                            </Badge>
                          )}
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(post.published_at || post.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <CardTitle className="font-sans group-hover:text-primary transition-colors line-clamp-2">
                          {post.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="line-clamp-3 mb-4">
                          {post.excerpt}
                        </CardDescription>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
}