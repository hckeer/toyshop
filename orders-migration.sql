-- Add orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  product_slug TEXT,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  location TEXT NOT NULL,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for admin queries
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

-- Allow public inserts (customers placing orders), admin reads via service role
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Policy: anyone can insert (storefront order submission)
CREATE POLICY "Allow public order inserts"
  ON orders FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Policy: only authenticated (admin) can read/update/delete
CREATE POLICY "Allow admin full access"
  ON orders FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
