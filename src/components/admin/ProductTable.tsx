'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import type { Product } from '@/lib/supabase'
import { deleteProduct, deleteProducts, bulkUpdateProducts, reorderProducts } from '@/lib/actions'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface ProductTableProps {
  initialProducts: Product[]
}

function SortableRow({ product, isSelected, onToggleSelect, onDelete }: {
  product: Product
  isSelected: boolean
  onToggleSelect: (id: string) => void
  onDelete: (id: string) => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: product.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const stockColor = 
    product.stock_quantity === 0 ? 'text-red-500' :
    product.stock_quantity <= product.low_stock_threshold ? 'text-amber-500' :
    'text-green-500'

  return (
    <tr ref={setNodeRef} style={style} className="border-b border-gray-800 hover:bg-white/5">
      <td className="px-4 py-3">
        <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-gray-500 hover:text-white">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
            <path d="M7 2a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
          </svg>
        </button>
      </td>
      <td className="px-4 py-3">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onToggleSelect(product.id)}
          className="w-4 h-4 text-[#FF2D00] bg-gray-700 border-gray-600 rounded focus:ring-[#FF2D00]"
        />
      </td>
      <td className="px-4 py-3">
        {product.images[0] ? (
          <img src={product.images[0]} alt={product.name} className="w-12 h-12 object-cover rounded" />
        ) : (
          <div className="w-12 h-12 bg-gray-800 rounded flex items-center justify-center text-gray-600 text-xs">
            No image
          </div>
        )}
      </td>
      <td className="px-4 py-3 font-medium">{product.name}</td>
      <td className="px-4 py-3">
        <span className="px-2 py-1 bg-white/10 rounded text-xs">{product.category}</span>
      </td>
      <td className="px-4 py-3">
        NPR {product.sale_price || product.regular_price}
        {product.sale_price && (
          <span className="text-gray-500 line-through ml-2 text-sm">
            NPR {product.regular_price}
          </span>
        )}
      </td>
      <td className={`px-4 py-3 font-medium ${stockColor}`}>
        {product.stock_quantity}
      </td>
      <td className="px-4 py-3">
        {product.badge !== 'none' && (
          <span className="px-2 py-1 bg-[#FF2D00]/20 text-[#FF2D00] rounded text-xs uppercase">
            {product.badge}
          </span>
        )}
      </td>
      <td className="px-4 py-3">
        <span className={`px-2 py-1 rounded text-xs ${
          product.is_active 
            ? 'bg-green-500/20 text-green-500' 
            : 'bg-gray-500/20 text-gray-500'
        }`}>
          {product.is_active ? 'Active' : 'Hidden'}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <Link
            href={`/admin/products/${product.id}/edit`}
            className="px-3 py-1 text-sm border border-gray-700 hover:border-[#FF2D00] 
                     text-gray-300 hover:text-white rounded transition-colors"
          >
            Edit
          </Link>
          <button
            onClick={() => onDelete(product.id)}
            className="px-3 py-1 text-sm border border-gray-700 hover:border-red-500 
                     text-gray-300 hover:text-red-400 rounded transition-colors"
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  )
}

export default function ProductTable({ initialProducts }: ProductTableProps) {
  const router = useRouter()
  const [products, setProducts] = useState(initialProducts)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter
      return matchesSearch && matchesCategory
    })
  }, [products, searchQuery, categoryFilter])

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = products.findIndex(p => p.id === active.id)
    const newIndex = products.findIndex(p => p.id === over.id)

    const newProducts = arrayMove(products, oldIndex, newIndex)
    setProducts(newProducts)

    try {
      await reorderProducts(newProducts.map(p => p.id))
      toast.success('Products reordered')
      router.refresh()
    } catch (error) {
      console.error('Reorder error:', error)
      toast.error('Failed to reorder products')
      setProducts(products) // Revert on error
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      await deleteProduct(id)
      setProducts(products.filter(p => p.id !== id))
      toast.success('Product deleted')
      router.refresh()
    } catch (error) {
      console.error('Delete error:', error)
      toast.error('Failed to delete product')
    }
  }

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return
    if (!confirm(`Delete ${selectedIds.length} selected products?`)) return

    try {
      await deleteProducts(selectedIds)
      setProducts(products.filter(p => !selectedIds.includes(p.id)))
      setSelectedIds([])
      toast.success(`${selectedIds.length} products deleted`)
      router.refresh()
    } catch (error) {
      console.error('Bulk delete error:', error)
      toast.error('Failed to delete products')
    }
  }

  const handleBulkUpdate = async (updates: { is_active?: boolean }) => {
    if (selectedIds.length === 0) return

    try {
      await bulkUpdateProducts(selectedIds, updates)
      setProducts(products.map(p => 
        selectedIds.includes(p.id) ? { ...p, ...updates } : p
      ))
      toast.success(`${selectedIds.length} products updated`)
      router.refresh()
    } catch (error) {
      console.error('Bulk update error:', error)
      toast.error('Failed to update products')
    }
  }

  const toggleSelect = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const toggleSelectAll = () => {
    setSelectedIds(prev =>
      prev.length === filteredProducts.length ? [] : filteredProducts.map(p => p.id)
    )
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex flex-1 gap-4 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-2 bg-[#0D0D10] border border-gray-800 rounded-lg 
                     focus:outline-none focus:border-[#FF2D00] text-white"
          />
          
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 bg-[#0D0D10] border border-gray-800 rounded-lg 
                     focus:outline-none focus:border-[#FF2D00] text-white"
          >
            <option value="all">All Categories</option>
            <option value="RC Cars">RC Cars</option>
            <option value="RC Trucks & Crawlers">RC Trucks & Crawlers</option>
            <option value="RC Drones">RC Drones</option>
            <option value="RC Boats">RC Boats</option>
            <option value="Spare Parts">Spare Parts</option>
            <option value="Accessories">Accessories</option>
            <option value="Batteries & Chargers">Batteries & Chargers</option>
          </select>
        </div>

        <Link
          href="/admin/products/new"
          className="px-6 py-2 bg-gradient-to-r from-[#FF2D00] to-[#FF6B00] 
                   hover:from-[#E62900] hover:to-[#FF8C00]
                   text-white font-medium rounded-lg transition-all duration-200
                   flex items-center gap-2 whitespace-nowrap"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Product
        </Link>
      </div>

      {/* Bulk Actions */}
      {selectedIds.length > 0 && (
        <div className="flex items-center gap-4 p-4 bg-[#0D0D10] border border-white/10 rounded-lg">
          <span className="text-sm text-gray-400">
            {selectedIds.length} selected
          </span>
          <button
            onClick={() => handleBulkUpdate({ is_active: true })}
            className="px-3 py-1 text-sm border border-gray-700 hover:border-green-500 
                     text-gray-300 hover:text-green-400 rounded transition-colors"
          >
            Set Active
          </button>
          <button
            onClick={() => handleBulkUpdate({ is_active: false })}
            className="px-3 py-1 text-sm border border-gray-700 hover:border-gray-500 
                     text-gray-300 hover:text-gray-400 rounded transition-colors"
          >
            Set Hidden
          </button>
          <button
            onClick={handleBulkDelete}
            className="px-3 py-1 text-sm border border-gray-700 hover:border-red-500 
                     text-gray-300 hover:text-red-400 rounded transition-colors"
          >
            Delete Selected
          </button>
        </div>
      )}

      {/* Table */}
      <div className="bg-[#0D0D10] border border-white/5 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-white/5">
              <tr>
                <th className="px-4 py-3 text-left text-gray-400 font-medium w-12"></th>
                <th className="px-4 py-3 text-left text-gray-400 font-medium w-12">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === filteredProducts.length && filteredProducts.length > 0}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 text-[#FF2D00] bg-gray-700 border-gray-600 rounded focus:ring-[#FF2D00]"
                  />
                </th>
                <th className="px-4 py-3 text-left text-gray-400 font-medium">Image</th>
                <th className="px-4 py-3 text-left text-gray-400 font-medium">Name</th>
                <th className="px-4 py-3 text-left text-gray-400 font-medium">Category</th>
                <th className="px-4 py-3 text-left text-gray-400 font-medium">Price</th>
                <th className="px-4 py-3 text-left text-gray-400 font-medium">Stock</th>
                <th className="px-4 py-3 text-left text-gray-400 font-medium">Badge</th>
                <th className="px-4 py-3 text-left text-gray-400 font-medium">Status</th>
                <th className="px-4 py-3 text-left text-gray-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-4 py-12 text-center text-gray-500">
                    No products found
                  </td>
                </tr>
              ) : (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={filteredProducts.map(p => p.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {filteredProducts.map((product) => (
                      <SortableRow
                        key={product.id}
                        product={product}
                        isSelected={selectedIds.includes(product.id)}
                        onToggleSelect={toggleSelect}
                        onDelete={handleDelete}
                      />
                    ))}
                  </SortableContext>
                </DndContext>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Results count */}
      <div className="text-sm text-gray-400 text-center">
        Showing {filteredProducts.length} of {products.length} products
      </div>
    </div>
  )
}
