import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { blogService } from "@/services/blogService";
import type { Tables } from "@/integrations/supabase/types";
import { Calendar, Clock, ArrowLeft, Share2, Image as ImageIcon } from "lucide-react";

type BlogPost = Tables<"blog_posts">;

export default function BlogPostPage() {
  const router = useRouter();
  const { slug } = router.query;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug && typeof slug === "string") {
      loadPost(slug);
    }
  }, [slug]);

  const loadPost = async (postSlug: string) => {
    try {
      const data = await blogService.getPostBySlug(postSlug);
      setPost(data);
      
      // Load related posts (same category)
      if (data?.category) {
        const allPosts = await blogService.getPublishedPosts();
        const related = allPosts
          .filter(p => p.category === data.category && p.id !== data.id)
          .slice(0, 3);
        setRelatedPosts(related);
      }
    } catch (error) {
      console.error("Failed to load post:", error);
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

  if (loading) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      </>
    );
  }

  if (!post) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold">Post not found</h1>
            <Link href="/blog">
              <Button>Back to Blog</Button>
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO 
        title={`${post.title} - Elite Dental Tourism`}
        description={post.excerpt || ""}
        image={post.featured_image_url || ""}
      />
      <div className="min-h-screen bg-background">
        <Navigation />
        
        <main className="py-8 md:py-16">
          <article className="container max-w-5xl">
            {/* Back Button */}
            <Link href="/blog">
              <Button variant="ghost" className="mb-8 gap-2 hover:gap-3 transition-all">
                <ArrowLeft className="w-4 h-4" />
                Back to Blog
              </Button>
            </Link>

            {/* Featured Image */}
            {post.featured_image_url ? (
              <div className="aspect-[21/9] overflow-hidden rounded-2xl bg-muted mb-12 shadow-2xl">
                <img
                  src={post.featured_image_url}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="aspect-[21/9] overflow-hidden rounded-2xl bg-gradient-to-br from-accent/20 to-accent/5 mb-12 shadow-2xl flex flex-col items-center justify-center">
                <ImageIcon className="w-24 h-24 mb-4 text-muted-foreground opacity-40" />
                <span className="text-sm font-medium text-muted-foreground opacity-60">Featured Image</span>
              </div>
            )}

            {/* Article Header */}
            <div className="max-w-3xl mx-auto mb-12 space-y-6">
              <div className="flex flex-wrap items-center gap-4">
                <Badge className="font-sans text-sm px-4 py-1.5">
                  {post.category || "General"}
                </Badge>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(post.published_at || post.created_at)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{calculateReadingTime(post.content)} min read</span>
                  </div>
                </div>
              </div>

              <h1 className="font-sans text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                {post.title}
              </h1>

              {post.excerpt && (
                <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
                  {post.excerpt}
                </p>
              )}

              {/* Share Button */}
              <div className="pt-6 border-t border-border">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-2"
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: post.title,
                        text: post.excerpt || "",
                        url: window.location.href,
                      });
                    }
                  }}
                >
                  <Share2 className="w-4 h-4" />
                  Share Article
                </Button>
              </div>
            </div>

            {/* Article Content */}
            <div className="max-w-3xl mx-auto">
              <div 
                className="prose prose-lg max-w-none 
                  prose-headings:font-sans prose-headings:font-bold prose-headings:text-foreground
                  prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
                  prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
                  prose-p:text-foreground/90 prose-p:leading-relaxed prose-p:mb-6
                  prose-a:text-accent prose-a:no-underline hover:prose-a:underline prose-a:font-medium
                  prose-strong:text-foreground prose-strong:font-semibold
                  prose-ul:my-6 prose-li:my-2
                  prose-img:rounded-xl prose-img:shadow-lg prose-img:my-8
                  prose-blockquote:border-l-4 prose-blockquote:border-accent prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-muted-foreground"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </div>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <div className="mt-20 pt-12 border-t border-border">
                <div className="mb-12">
                  <h2 className="font-sans text-3xl md:text-4xl font-bold text-foreground mb-4">
                    Related Articles
                  </h2>
                  <div className="h-1 w-24 bg-gradient-to-r from-accent to-accent/50 rounded-full" />
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                  {relatedPosts.map((relatedPost) => (
                    <Link key={relatedPost.id} href={`/blog/${relatedPost.slug}`}>
                      <Card className="h-full border-border hover:border-accent/50 hover:shadow-xl transition-all duration-300 group overflow-hidden">
                        <div className="aspect-video overflow-hidden bg-gradient-to-br from-muted to-muted/50">
                          {relatedPost.featured_image_url ? (
                            <img
                              src={relatedPost.featured_image_url}
                              alt={relatedPost.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground">
                              <ImageIcon className="w-12 h-12 mb-2 opacity-40" />
                              <span className="text-xs font-medium opacity-60">Article Image</span>
                            </div>
                          )}
                        </div>
                        <div className="p-6 space-y-3">
                          <Badge variant="secondary" className="font-sans text-xs">
                            {relatedPost.category || "General"}
                          </Badge>
                          <h3 className="font-sans text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                            {relatedPost.title}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {relatedPost.excerpt}
                          </p>
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </article>
        </main>
        
        <Footer />
      </div>
    </>
  );
}