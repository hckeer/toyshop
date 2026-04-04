import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Admin client with service role key for server-side operations
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Database types
export type Product = {
  id: string
  name: string
  slug: string
  category: 'RC Cars' | 'RC Trucks & Crawlers' | 'RC Drones' | 'RC Boats' | 'Spare Parts' | 'Accessories' | 'Batteries & Chargers'
  short_descriptor: string | null
  full_description: string | null
  regular_price: number
  sale_price: number | null
  images: string[]
  specs: { name: string; value: string }[]
  in_the_box: string[]
  badge: 'none' | 'new' | 'sale' | 'bestseller' | 'soldout'
  is_active: boolean
  is_featured: boolean
  stock_quantity: number
  low_stock_threshold: number
  display_order: number
  created_at: string
  updated_at: string
}
