-- Create treatments table
CREATE TABLE IF NOT EXISTS treatments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  icon_name VARCHAR(100),
  short_description TEXT,
  featured_image_url TEXT,
  hero_image_url TEXT,
  
  -- Content sections
  overview TEXT,
  benefits TEXT[],
  procedure_steps TEXT[],
  recovery_info TEXT,
  faq JSONB,
  
  -- Pricing and savings
  price_range_min DECIMAL(10,2),
  price_range_max DECIMAL(10,2),
  typical_foreign_price DECIMAL(10,2),
  savings_percentage INTEGER,
  
  -- Meta
  duration_days INTEGER,
  category VARCHAR(100),
  published BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  
  -- SEO
  meta_title VARCHAR(255),
  meta_description TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_treatments_published ON treatments(published, display_order);
CREATE INDEX IF NOT EXISTS idx_treatments_slug ON treatments(slug);
CREATE INDEX IF NOT EXISTS idx_treatments_category ON treatments(category);

-- RLS policies for treatments (public read, authenticated write)
ALTER TABLE treatments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_treatments" ON treatments;
CREATE POLICY "public_read_treatments" ON treatments
  FOR SELECT
  TO public
  USING (true);

DROP POLICY IF EXISTS "auth_all_treatments" ON treatments;
CREATE POLICY "auth_all_treatments" ON treatments
  FOR ALL
  TO public
  USING (auth.uid() IS NOT NULL);