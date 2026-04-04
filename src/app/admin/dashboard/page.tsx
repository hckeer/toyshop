import Link from 'next/link'
import { supabaseAdmin } from '@/lib/supabase'

async function getStats() {
  const { data: products, error } = await supabaseAdmin
    .from('products')
    .select('stock_quantity, low_stock_threshold')

  if (error) {
    console.error('Error fetching stats:', error)
    return {
      total: 0,
      inStock: 0,
      lowStock: 0,
      outOfStock: 0
    }
  }

  const total = products?.length || 0
  const inStock = products?.filter(p => p.stock_quantity > 0).length || 0
  const lowStock = products?.filter(
    p => p.stock_quantity > 0 && p.stock_quantity <= p.low_stock_threshold
  ).length || 0
  const outOfStock = products?.filter(p => p.stock_quantity === 0).length || 0

  return {
    total,
    inStock,
    lowStock,
    outOfStock
  }
}

export default async function AdminDashboard() {
  const stats = await getStats()

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="text-4xl font-[family-name:var(--font-bebas)] tracking-wide mb-2">
          Dashboard
        </h1>
        <p className="text-gray-400">Manage your RC Toys Nepal inventory</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Products */}
        <div className="bg-[#0D0D10] border border-white/5 rounded-lg p-6">
          <div className="text-gray-400 text-sm mb-2">Total Products</div>
          <div className="text-5xl font-[family-name:var(--font-bebas)] text-[#FF2D00]">
            {stats.total}
          </div>
        </div>

        {/* In Stock */}
        <div className="bg-[#0D0D10] border border-white/5 rounded-lg p-6">
          <div className="text-gray-400 text-sm mb-2">In Stock</div>
          <div className="text-5xl font-[family-name:var(--font-bebas)] text-green-500">
            {stats.inStock}
          </div>
        </div>

        {/* Low Stock */}
        <div className="bg-[#0D0D10] border border-white/5 rounded-lg p-6">
          <div className="text-gray-400 text-sm mb-2">Low Stock</div>
          <div className="text-5xl font-[family-name:var(--font-bebas)] text-amber-500">
            {stats.lowStock}
          </div>
        </div>

        {/* Out of Stock */}
        <div className="bg-[#0D0D10] border border-white/5 rounded-lg p-6">
          <div className="text-gray-400 text-sm mb-2">Out of Stock</div>
          <div className="text-5xl font-[family-name:var(--font-bebas)] text-red-500">
            {stats.outOfStock}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h2 className="text-2xl font-[family-name:var(--font-bebas)] tracking-wide">
          Quick Actions
        </h2>
        
        <div className="flex flex-wrap gap-4">
          <Link
            href="/admin/products/new"
            className="px-8 py-4 bg-gradient-to-r from-[#FF2D00] to-[#FF6B00] 
                     hover:from-[#E62900] hover:to-[#FF8C00]
                     text-white font-medium rounded-lg transition-all duration-200
                     flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add New Product
          </Link>

          <Link
            href="/admin/products"
            className="px-8 py-4 border border-gray-700 hover:border-[#FF2D00] 
                     text-gray-300 hover:text-white font-medium rounded-lg transition-colors"
          >
            Manage Products
          </Link>
        </div>
      </div>

      {/* Recent Activity / Tips */}
      <div className="bg-[#0D0D10] border border-white/5 rounded-lg p-6">
        <h3 className="text-xl font-[family-name:var(--font-bebas)] tracking-wide mb-4">
          Getting Started
        </h3>
        <ul className="space-y-3 text-gray-400 text-sm">
          <li className="flex items-start gap-2">
            <span className="text-[#FF2D00] mt-1">•</span>
            <span>Add products with high-quality images for the best customer experience</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#FF2D00] mt-1">•</span>
            <span>Use the Featured toggle to showcase products on your homepage</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#FF2D00] mt-1">•</span>
            <span>Drag and reorder products to control how they appear on the storefront</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#FF2D00] mt-1">•</span>
            <span>Keep stock quantities updated to show accurate availability</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
