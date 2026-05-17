import { useEffect, useState } from "react";
import Link from "next/link";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { blogService } from "@/services/blogService";
import type { Tables } from "@/integrations/supabase/types";
import { Calendar, Clock, ArrowRight, Image as ImageIcon } from "lucide-react";

type BlogPost = Tables<"blog_posts">;

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [featuredPost, setFeaturedPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const data = await blogService.getPublishedPosts();
      setPosts(data);
      if (data.length > 0) {
        setFeaturedPost(data[0]);
      }
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

  const calculateReadingTime = (content: string) => {
    const words = content ? content.trim().split(/\s+/).length : 0;
    return Math.max(1, Math.ceil(words / 200));
  };

  const otherPosts = posts.slice(1);

  return (
    <>
      <SEO 
        title="Blog - Elite Dental Tourism"
        description="Expert insights, tips, and stories about dental tourism and oral health"
      />
      <div className="min-h-screen bg-background">
        <Navigation />
        
        <main className="pb-24">
          {/* Hero Section with Title */}
          <section className="py-16 md:py-24 bg-gradient-to-b from-card to-background">
            <div className="container">
              <div className="text-center max-w-3xl mx-auto">
                <h1 className="font-sans text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
                  Dental Tourism Blog
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                  Expert insights, patient stories, and everything you need to know about dental tourism
                </p>
              </div>
            </div>
          </section>

          {loading ? (
            <div className="container py-12">
              <div className="text-center text-muted-foreground">Loading posts...</div>
            </div>
          ) : posts.length === 0 ? (
            <div className="container py-12">
              <div className="text-center text-muted-foreground">No blog posts yet</div>
            </div>
          ) : (
            <>
              {/* Featured Post */}
              {featuredPost && (
                <section className="container py-12">
                  <Link href={`/blog/${featuredPost.slug}`}>
                    <Card className="border-border hover:border-accent/50 hover:shadow-2xl transition-all duration-300 overflow-hidden group">
                      <div className="grid md:grid-cols-2 gap-0">
                        {/* Featured Image */}
                        <div className="relative aspect-[4/3] md:aspect-auto overflow-hidden bg-gradient-to-br from-accent/20 to-accent/5">
                          {featuredPost.featured_image_url ? (
                            <img
                              src={featuredPost.featured_image_url}
                              alt={featuredPost.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground">
                              <ImageIcon className="w-16 h-16 mb-3 opacity-40" />
                              <span className="text-sm font-medium opacity-60">Featured Image</span>
                            </div>
                          )}
                          <div className="absolute top-6 left-6">
                            <Badge className="bg-accent text-accent-foreground font-sans shadow-lg">
                              Featured Post
                            </Badge>
                          </div>
                        </div>

                        {/* Content */}
                        <CardContent className="p-8 md:p-12 flex flex-col justify-center">
                          <div className="space-y-6">
                            <div className="flex flex-wrap items-center gap-4">
                              <Badge variant="secondary" className="font-sans">
                                {featuredPost.category || "General"}
                              </Badge>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  <span>{formatDate(featuredPost.published_at || featuredPost.created_at)}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  <span>{calculateReadingTime(featuredPost.content)} min read</span>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-4">
                              <h2 className="font-sans text-3xl md:text-4xl font-bold text-foreground leading-tight group-hover:text-primary transition-colors">
                                {featuredPost.title}
                              </h2>
                              
                              <p className="text-lg text-muted-foreground leading-relaxed line-clamp-3">
                                {featuredPost.excerpt}
                              </p>
                            </div>

                            <Button 
                              variant="outline" 
                              className="w-fit gap-2 border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground group"
                            >
                              Read Full Article
                              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Button>
                          </div>
                        </CardContent>
                      </div>
                    </Card>
                  </Link>
                </section>
              )}

              {/* Other Posts Grid */}
              {otherPosts.length > 0 && (
                <section className="container py-12">
                  <div className="mb-12">
                    <h2 className="font-sans text-3xl md:text-4xl font-bold text-foreground mb-4">
                      Latest Articles
                    </h2>
                    <div className="h-1 w-24 bg-gradient-to-r from-accent to-accent/50 rounded-full" />
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {otherPosts.map((post) => (
                      <Link key={post.id} href={`/blog/${post.slug}`}>
                        <Card className="h-full border-border hover:border-accent/50 hover:shadow-xl transition-all duration-300 group overflow-hidden">
                          {/* Post Image */}
                          <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-muted to-muted/50">
                            {post.featured_image_url ? (
                              <img
                                src={post.featured_image_url}
                                alt={post.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                            ) : (
                              <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground">
                                <ImageIcon className="w-12 h-12 mb-2 opacity-40" />
                                <span className="text-xs font-medium opacity-60">Article Image</span>
                              </div>
                            )}
                          </div>

                          <CardHeader className="space-y-4">
                            <div className="flex items-center gap-3 flex-wrap">
                              <Badge variant="secondary" className="font-sans text-xs">
                                {post.category || "General"}
                              </Badge>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Clock className="w-3 h-3" />
                                <span>{calculateReadingTime(post.content)} min</span>
                              </div>
                            </div>

                            <CardTitle className="font-sans text-xl group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                              {post.title}
                            </CardTitle>
                            
                            <CardDescription className="line-clamp-3 text-sm leading-relaxed">
                              {post.excerpt}
                            </CardDescription>
                          </CardHeader>

                          <CardContent className="pt-0">
                            <div className="flex items-center justify-between pt-4 border-t border-border">
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Calendar className="w-3 h-3" />
                                <span>{formatDate(post.published_at || post.created_at)}</span>
                              </div>
                              <ArrowRight className="w-4 h-4 text-accent group-hover:translate-x-1 transition-transform" />
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </section>
              )}
            </>
          )}
        </main>
        
        <Footer />
      </div>
    </>
  );
}