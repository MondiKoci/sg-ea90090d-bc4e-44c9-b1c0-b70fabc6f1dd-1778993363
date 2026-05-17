-- Create before_after_cases table
CREATE TABLE IF NOT EXISTS before_after_cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  treatment_type TEXT NOT NULL,
  description TEXT,
  before_image_url TEXT,
  after_image_url TEXT,
  display_order INTEGER DEFAULT 0,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  featured_image_url TEXT,
  author TEXT,
  category TEXT,
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- RLS policies for before_after_cases
ALTER TABLE before_after_cases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_cases" ON before_after_cases
  FOR SELECT
  USING (published = true);

CREATE POLICY "auth_all_cases" ON before_after_cases
  FOR ALL
  USING (auth.uid() IS NOT NULL);

-- RLS policies for blog_posts
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_published_posts" ON blog_posts
  FOR SELECT
  USING (published = true);

CREATE POLICY "auth_all_posts" ON blog_posts
  FOR ALL
  USING (auth.uid() IS NOT NULL);

-- Create indexes
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_published ON blog_posts(published, published_at DESC);
CREATE INDEX idx_cases_order ON before_after_cases(display_order, created_at DESC);