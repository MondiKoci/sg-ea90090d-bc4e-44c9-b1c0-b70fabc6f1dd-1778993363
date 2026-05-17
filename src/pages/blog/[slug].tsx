import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { blogService } from "@/services/blogService";
import type { BlogPost } from "@/services/blogService";
import { Calendar, Clock, ArrowLeft, User } from "lucide-react";

export default function BlogPostPage() {
  const router = useRouter();
  const { slug } = router.query;
  const [post, setPost] = useState<BlogPost | null>(null);
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
    } catch (error) {
      console.error("Failed to load blog post:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">Loading...</div>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <h1 className="text-2xl font-bold">Post not found</h1>
          <Link href="/blog">
            <Button>Back to Blog</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <SEO
        title={post.meta_title || post.title}
        description={post.meta_description || post.excerpt || `Read our blog post about ${post.title}`}
        image={post.featured_image_url || "/og-image.png"}
        url={`/blog/${post.slug}`}
        type="article"
        author={post.author || "Elite Dental Tourism"}
        publishedDate={post.published_at || post.created_at}
        keywords={post.tags?.join(", ")}
      />
      <div className="min-h-screen bg-background">
        <Navigation />
        
        <main className="py-12">
          <article className="container max-w-4xl">
            <Link href="/blog">
              <Button variant="ghost" className="mb-8 gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Blog
              </Button>
            </Link>

            {/* Featured Image */}
            {post.featured_image_url && (
              <div className="aspect-video bg-muted rounded-2xl overflow-hidden mb-8 shadow-lg">
                <img 
                  src={post.featured_image_url} 
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Post Header */}
            <div className="mb-8">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                {post.category && (
                  <Badge variant="secondary" className="font-sans">
                    {post.category}
                  </Badge>
                )}
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(post.published_at || post.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
                {post.reading_time && (
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {post.reading_time} min read
                  </span>
                )}
                {post.author && (
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {post.author}
                  </span>
                )}
              </div>

              <h1 className="font-sans text-4xl md:text-5xl font-bold mb-4 leading-tight">
                {post.title}
              </h1>

              {post.excerpt && (
                <p className="text-xl text-muted-foreground leading-relaxed">
                  {post.excerpt}
                </p>
              )}
            </div>

            {/* Post Content */}
            <div className="prose prose-lg max-w-none">
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t border-border">
                <h3 className="text-sm font-semibold text-muted-foreground mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, i) => (
                    <Badge key={i} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="mt-16 p-8 bg-accent/10 border border-accent/20 rounded-2xl text-center">
              <h3 className="font-sans text-2xl font-bold mb-4">Ready to Start Your Dental Journey?</h3>
              <p className="text-muted-foreground mb-6">
                Book a free consultation and discover how we can help you achieve your perfect smile.
              </p>
              <Link href="/#book">
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                  Book Free Consultation
                </Button>
              </Link>
            </div>
          </article>
        </main>
        
        <Footer />
      </div>
    </>
  );
}