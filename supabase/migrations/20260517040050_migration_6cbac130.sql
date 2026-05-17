-- Create packages table
CREATE TABLE IF NOT EXISTS packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  destination TEXT NOT NULL,
  price_from DECIMAL(10,2) NULL,
  price_to DECIMAL(10,2) NULL,
  duration_days INTEGER NULL,
  description TEXT NULL,
  highlights TEXT NULL,
  published BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Create package_inclusions table for customizable checklist items
CREATE TABLE IF NOT EXISTS package_inclusions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id UUID NOT NULL REFERENCES packages(id) ON DELETE CASCADE,
  category TEXT NOT NULL CHECK (category IN ('dental', 'accommodation', 'transport', 'translation', 'activities', 'meals', 'warranty', 'support', 'other')),
  item_text TEXT NOT NULL,
  is_premium BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_packages_published ON packages(published, display_order, created_at DESC);
CREATE INDEX idx_packages_destination ON packages(destination);
CREATE INDEX idx_package_inclusions_package_id ON package_inclusions(package_id, display_order);

-- Enable RLS
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE package_inclusions ENABLE ROW LEVEL SECURITY;

-- RLS policies for packages
CREATE POLICY "public_read_published_packages" ON packages
  FOR SELECT
  TO public
  USING (published = true);

CREATE POLICY "auth_all_packages" ON packages
  FOR ALL
  TO public
  USING (auth.uid() IS NOT NULL);

-- RLS policies for package_inclusions
CREATE POLICY "public_read_published_inclusions" ON package_inclusions
  FOR SELECT
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM packages 
      WHERE packages.id = package_inclusions.package_id 
      AND packages.published = true
    )
  );

CREATE POLICY "auth_all_inclusions" ON package_inclusions
  FOR ALL
  TO public
  USING (auth.uid() IS NOT NULL);