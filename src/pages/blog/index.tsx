import { useEffect, useState } from "react";
import Link from "next/link";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { blogService } from "@/services/blogService";
import type { Tables } from "@/integrations/supabase/types";
import { Calendar, Clock } from "lucide-react";

type BlogPost = Tables<"blog_posts">;

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
      console.error("Failed to load posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  return (
    <>
      <SEO 
        title="Blog - Elite Dental Tourism"
        description="Expert insights, tips, and stories about dental tourism and oral health"
      />
      <div className="min-h-screen bg-background">
        <Navigation />
        
        <main className="py-24">
          <div className="container">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <h1 className="font-sans text-4xl md:text-5xl font-bold text-foreground mb-6">
                Dental Tourism Blog
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                Expert insights, patient stories, and everything you need to know about dental tourism
              </p>
            </div>

            {loading ? (
              <div className="text-center text-muted-foreground">Loading posts...</div>
            ) : posts.length === 0 ? (
              <div className="text-center text-muted-foreground">No blog posts yet</div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                {posts.map((post) => (
                  <Link key={post.id} href={`/blog/${post.slug}`}>
                    <Card className="h-full border-border hover:border-accent/50 hover:shadow-xl transition-all duration-300 group overflow-hidden">
                      {post.featured_image_url && (
                        <div className="aspect-video overflow-hidden bg-muted">
                          <img
                            src={post.featured_image_url}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <CardHeader>
                        <div className="flex items-center gap-2 mb-3">
                          <Badge variant="secondary" className="font-sans text-xs">
                            {post.category}
                          </Badge>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            <span>{post.reading_time_minutes} min read</span>
                          </div>
                        </div>
                        <CardTitle className="font-sans text-xl group-hover:text-primary transition-colors line-clamp-2">
                          {post.title}
                        </CardTitle>
                        <CardDescription className="line-clamp-2">
                          {post.excerpt}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(post.published_at || post.created_at)}</span>
                        </div>
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