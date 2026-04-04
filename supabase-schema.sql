-- Create enum types
CREATE TYPE product_category AS ENUM (
  'RC Cars',
  'RC Trucks & Crawlers',
  'RC Drones',
  'RC Boats',
  'Spare Parts',
  'Accessories',
  'Batteries & Chargers'
);

CREATE TYPE product_badge AS ENUM (
  'none',
  'new',
  'sale',
  'bestseller',
  'soldout'
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category product_category NOT NULL,
  short_descriptor TEXT,
  full_description TEXT,
  regular_price INTEGER NOT NULL,
  sale_price INTEGER,
  images JSONB DEFAULT '[]'::jsonb,
  specs JSONB DEFAULT '[]'::jsonb,
  in_the_box JSONB DEFAULT '[]'::jsonb,
  badge product_badge DEFAULT 'none',
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  stock_quantity INTEGER DEFAULT 0,
  low_stock_threshold INTEGER DEFAULT 3,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for common queries
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_products_featured ON products(is_featured);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_display_order ON products(display_order);
CREATE INDEX idx_products_category ON products(category);

-- Create function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update updated_at
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample products for testing
INSERT INTO products (name, slug, category, short_descriptor, full_description, regular_price, sale_price, images, specs, in_the_box, badge, is_active, is_featured, stock_quantity, display_order) VALUES
(
  'Traxxas Slash 4X4 Ultimate',
  'traxxas-slash-4x4-ultimate',
  'RC Cars',
  'The Ultimate Short Course Racing Machine',
  'The Traxxas Slash 4X4 Ultimate redefines what a short course truck can be. With its brushless power system, aggressive styling, and championship-winning performance, this is the truck that changed everything.',
  89999,
  79999,
  '["https://res.cloudinary.com/dgjnew6rc/image/upload/v1/rc-toys/traxxas-slash-1"]'::jsonb,
  '[{"name":"Motor Type","value":"Brushless VXL-3s"},{"name":"Top Speed","value":"96+ km/h"},{"name":"Scale","value":"1/10"},{"name":"Drive Type","value":"4WD"},{"name":"Control Frequency","value":"2.4GHz"},{"name":"Battery","value":"LiPo 2S-3S"},{"name":"Runtime","value":"20-30 min"}]'::jsonb,
  '["1x Traxxas Slash 4X4 Ultimate","1x TQi 2.4GHz Radio System","1x VXL-3s Brushless ESC","1x Velineon 3500 Motor","1x USB Charger","1x Tool Kit"]'::jsonb,
  'bestseller',
  true,
  true,
  12,
  1
),
(
  'DJI Mini 3 Pro RC Drone',
  'dji-mini-3-pro-rc-drone',
  'RC Drones',
  'Professional 4K Camera Drone Under 249g',
  'The DJI Mini 3 Pro delivers pro-level features in an ultra-portable package. With 4K HDR video, advanced obstacle sensing, and 34 minutes of flight time, it is the perfect drone for content creators.',
  124999,
  NULL,
  '["https://res.cloudinary.com/dgjnew6rc/image/upload/v1/rc-toys/dji-mini-3"]'::jsonb,
  '[{"name":"Camera","value":"4K/60fps HDR"},{"name":"Flight Time","value":"34 minutes"},{"name":"Weight","value":"<249g"},{"name":"Max Range","value":"12 km"},{"name":"Obstacle Sensing","value":"Tri-directional"},{"name":"Wind Resistance","value":"10.7 m/s (Level 5)"}]'::jsonb,
  '["1x DJI Mini 3 Pro","1x RC-N1 Remote Controller","1x Intelligent Flight Battery","1x Two-Way Charging Hub","3x Pairs of Propellers","1x Gimbal Protector"]'::jsonb,
  'new',
  true,
  true,
  8,
  2
);
