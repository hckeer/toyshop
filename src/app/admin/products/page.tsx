import { getProducts } from '@/lib/actions'
import ProductTable from '@/components/admin/ProductTable'

export default async function ProductsPage() {
  const products = await getProducts()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-[family-name:var(--font-bebas)] tracking-wide mb-2">
          Manage Products
        </h1>
        <p className="text-gray-400">
          Add, edit, and organize your product catalog
        </p>
      </div>

      <ProductTable initialProducts={products} />
    </div>
  )
}
