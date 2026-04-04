'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Product } from '@/lib/supabase'
import { createProduct, updateProduct } from '@/lib/actions'
import ImageUpload from '@/components/admin/ImageUpload'
import { toast } from 'react-hot-toast'

interface ProductFormProps {
  product?: Product
}

const CATEGORIES = [
  'RC Cars',
  'RC Trucks & Crawlers',
  'RC Drones',
  'RC Boats',
  'Spare Parts',
  'Accessories',
  'Batteries & Chargers',
] as const

const CATEGORY_TEMPLATES: Record<string, { name: string; value: string }[]> = {
  'RC Cars': [
    { name: 'Motor Type', value: 'Brushless' },
    { name: 'Top Speed', value: '60 km/h' },
    { name: 'Scale', value: '1/10' },
    { name: 'Drive Type', value: '4WD' },
    { name: 'Control Frequency', value: '2.4GHz' },
    { name: 'Battery', value: 'LiPo 2S' },
    { name: 'Runtime', value: '20-30 min' },
  ],
  'RC Drones': [
    { name: 'Camera', value: '4K' },
    { name: 'Flight Time', value: '30 minutes' },
    { name: 'Weight', value: '<249g' },
    { name: 'Max Range', value: '10 km' },
    { name: 'Obstacle Sensing', value: 'Yes' },
    { name: 'Wind Resistance', value: 'Level 5' },
  ],
}

export default function ProductForm({ product }: ProductFormProps) {
  const router = useRouter()
  const isEditing = !!product
  const [saving, setSaving] = useState(false)

  // Form state
  const [name, setName] = useState(product?.name || '')
  const [category, setCategory] = useState<typeof CATEGORIES[number]>(product?.category || 'RC Cars')
  const [shortDescriptor, setShortDescriptor] = useState(product?.short_descriptor || '')
  const [fullDescription, setFullDescription] = useState(product?.full_description || '')
  const [regularPrice, setRegularPrice] = useState(product?.regular_price || 0)
  const [salePrice, setSalePrice] = useState<number | ''>(product?.sale_price || '')
  const [images, setImages] = useState<string[]>(product?.images || [])
  const [specs, setSpecs] = useState<{ name: string; value: string }[]>(
    product?.specs || [{ name: '', value: '' }]
  )
  const [inTheBox, setInTheBox] = useState<string[]>(
    product?.in_the_box || ['']
  )
  const [badge, setBadge] = useState<Product['badge']>(product?.badge || 'none')
  const [isActive, setIsActive] = useState(product?.is_active ?? true)
  const [isFeatured, setIsFeatured] = useState(product?.is_featured || false)
  const [stockQuantity, setStockQuantity] = useState(product?.stock_quantity || 0)
  const [lowStockThreshold, setLowStockThreshold] = useState(product?.low_stock_threshold || 3)

  const handleSubmit = async (isDraft: boolean) => {
    if (!name || !category || regularPrice <= 0) {
      toast.error('Please fill in all required fields')
      return
    }

    if (images.length === 0) {
      toast.error('Please upload at least one product image')
      return
    }

    setSaving(true)
    try {
      const productData = {
        name,
        slug: '', // Will be auto-generated
        category,
        short_descriptor: shortDescriptor,
        full_description: fullDescription,
        regular_price: regularPrice,
        sale_price: salePrice || null,
        images,
        specs: specs.filter(s => s.name && s.value),
        in_the_box: inTheBox.filter(item => item.trim()),
        badge,
        is_active: isDraft ? false : isActive,
        is_featured: isFeatured,
        stock_quantity: stockQuantity,
        low_stock_threshold: lowStockThreshold,
        display_order: product?.display_order || 0,
      }

      if (isEditing) {
        await updateProduct(product.id, productData)
        toast.success('Product updated successfully')
      } else {
        await createProduct(productData as any)
        toast.success('Product created successfully')
      }

      router.push('/admin/products')
      router.refresh()
    } catch (error: any) {
      console.error('Save error (full):', error)
      console.error('Save error message:', error?.message)
      console.error('Save error cause:', error?.cause)
      console.error('Save error stack:', error?.stack)
      toast.error(error.message || 'Failed to save product — check browser console (F12) for details')
    } finally {
      setSaving(false)
    }
  }

  const addSpec = () => {
    setSpecs([...specs, { name: '', value: '' }])
  }

  const updateSpec = (index: number, field: 'name' | 'value', value: string) => {
    const newSpecs = [...specs]
    newSpecs[index][field] = value
    setSpecs(newSpecs)
  }

  const removeSpec = (index: number) => {
    setSpecs(specs.filter((_, i) => i !== index))
  }

  const useTemplate = () => {
    const template = CATEGORY_TEMPLATES[category]
    if (template) {
      setSpecs(template)
    }
  }

  const addBoxItem = () => {
    setInTheBox([...inTheBox, ''])
  }

  const updateBoxItem = (index: number, value: string) => {
    const newItems = [...inTheBox]
    newItems[index] = value
    setInTheBox(newItems)
  }

  const removeBoxItem = (index: number) => {
    setInTheBox(inTheBox.filter((_, i) => i !== index))
  }

  const savings = regularPrice && salePrice ? regularPrice - Number(salePrice) : 0

  return (
    <div className="max-w-4xl space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-[family-name:var(--font-bebas)] tracking-wide mb-2">
          {isEditing ? 'Edit Product' : 'Add New Product'}
        </h1>
        <p className="text-gray-400">
          {isEditing ? `Editing: ${product.name}` : 'Create a new product for your catalog'}
        </p>
      </div>

      <form className="space-y-8">
        {/* Section 1: Basic Info */}
        <div className="bg-[#0D0D10] border border-white/5 rounded-lg p-6 space-y-4">
          <h2 className="text-2xl font-[family-name:var(--font-bebas)] tracking-wide border-b border-white/10 pb-2">
            Basic Information
          </h2>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Product Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Traxxas Slash 4X4 Ultimate"
              className="w-full px-4 py-3 bg-[#050505] border border-gray-800 rounded-lg
                       focus:outline-none focus:border-[#FF2D00] text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as typeof CATEGORIES[number])}
              className="w-full px-4 py-3 bg-[#050505] border border-gray-800 rounded-lg
                       focus:outline-none focus:border-[#FF2D00] text-white"
              required
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Short Descriptor
            </label>
            <input
              type="text"
              value={shortDescriptor}
              onChange={(e) => setShortDescriptor(e.target.value)}
              placeholder="e.g., The Ultimate Short Course Racing Machine"
              className="w-full px-4 py-3 bg-[#050505] border border-gray-800 rounded-lg
                       focus:outline-none focus:border-[#FF2D00] text-white"
            />
            <p className="mt-1 text-xs text-gray-500">One line shown under product name</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Full Description
            </label>
            <textarea
              value={fullDescription}
              onChange={(e) => setFullDescription(e.target.value)}
              placeholder="Detailed product description..."
              rows={6}
              className="w-full px-4 py-3 bg-[#050505] border border-gray-800 rounded-lg
                       focus:outline-none focus:border-[#FF2D00] text-white resize-none"
            />
          </div>
        </div>

        {/* Section 2: Pricing */}
        <div className="bg-[#0D0D10] border border-white/5 rounded-lg p-6 space-y-4">
          <h2 className="text-2xl font-[family-name:var(--font-bebas)] tracking-wide border-b border-white/10 pb-2">
            Pricing
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Regular Price (NPR) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">NPR</span>
                <input
                  type="number"
                  value={regularPrice}
                  onChange={(e) => setRegularPrice(Number(e.target.value))}
                  min="0"
                  placeholder="0"
                  className="w-full pl-16 pr-4 py-3 bg-[#050505] border border-gray-800 rounded-lg
                           focus:outline-none focus:border-[#FF2D00] text-white"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Sale Price (NPR)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">NPR</span>
                <input
                  type="number"
                  value={salePrice}
                  onChange={(e) => setSalePrice(e.target.value ? Number(e.target.value) : '')}
                  min="0"
                  placeholder="Leave empty if no sale"
                  className="w-full pl-16 pr-4 py-3 bg-[#050505] border border-gray-800 rounded-lg
                           focus:outline-none focus:border-[#FF2D00] text-white"
                />
              </div>
              {savings > 0 && (
                <p className="mt-2 text-sm text-green-500">
                  Save NPR {savings.toLocaleString()}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Section 3: Images */}
        <div className="bg-[#0D0D10] border border-white/5 rounded-lg p-6 space-y-4">
          <h2 className="text-2xl font-[family-name:var(--font-bebas)] tracking-wide border-b border-white/10 pb-2">
            Product Images <span className="text-red-500">*</span>
          </h2>

          <ImageUpload images={images} onChange={setImages} maxImages={10} />

          <p className="text-xs text-gray-500">
            First image will be the main product image. Drag to reorder.
          </p>
        </div>

        {/* Section 4: Specs */}
        <div className="bg-[#0D0D10] border border-white/5 rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <h2 className="text-2xl font-[family-name:var(--font-bebas)] tracking-wide">
              Key Highlights / Specs
            </h2>
            {CATEGORY_TEMPLATES[category] && (
              <button
                type="button"
                onClick={useTemplate}
                className="text-sm px-3 py-1 border border-gray-700 hover:border-[#FF2D00]
                         text-gray-300 hover:text-white rounded transition-colors"
              >
                Use {category} Template
              </button>
            )}
          </div>

          <div className="space-y-3">
            {specs.map((spec, index) => (
              <div key={index} className="flex gap-3">
                <input
                  type="text"
                  value={spec.name}
                  onChange={(e) => updateSpec(index, 'name', e.target.value)}
                  placeholder="Spec name (e.g., Motor Type)"
                  className="flex-1 px-4 py-2 bg-[#050505] border border-gray-800 rounded-lg
                           focus:outline-none focus:border-[#FF2D00] text-white"
                />
                <input
                  type="text"
                  value={spec.value}
                  onChange={(e) => updateSpec(index, 'value', e.target.value)}
                  placeholder="Value (e.g., Brushless)"
                  className="flex-1 px-4 py-2 bg-[#050505] border border-gray-800 rounded-lg
                           focus:outline-none focus:border-[#FF2D00] text-white"
                />
                <button
                  type="button"
                  onClick={() => removeSpec(index)}
                  className="px-3 py-2 border border-gray-700 hover:border-red-500
                           text-gray-300 hover:text-red-400 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addSpec}
            className="text-sm px-4 py-2 border border-gray-700 hover:border-[#FF2D00]
                     text-gray-300 hover:text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Spec
          </button>
        </div>

        {/* Section 5: In The Box */}
        <div className="bg-[#0D0D10] border border-white/5 rounded-lg p-6 space-y-4">
          <h2 className="text-2xl font-[family-name:var(--font-bebas)] tracking-wide border-b border-white/10 pb-2">
            What's In The Box
          </h2>

          <div className="space-y-3">
            {inTheBox.map((item, index) => (
              <div key={index} className="flex gap-3">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => updateBoxItem(index, e.target.value)}
                  placeholder="e.g., 1x RC Car Body"
                  className="flex-1 px-4 py-2 bg-[#050505] border border-gray-800 rounded-lg
                           focus:outline-none focus:border-[#FF2D00] text-white"
                />
                <button
                  type="button"
                  onClick={() => removeBoxItem(index)}
                  className="px-3 py-2 border border-gray-700 hover:border-red-500
                           text-gray-300 hover:text-red-400 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addBoxItem}
            className="text-sm px-4 py-2 border border-gray-700 hover:border-[#FF2D00]
                     text-gray-300 hover:text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Item
          </button>
        </div>

        {/* Section 6: Badges & Visibility */}
        <div className="bg-[#0D0D10] border border-white/5 rounded-lg p-6 space-y-4">
          <h2 className="text-2xl font-[family-name:var(--font-bebas)] tracking-wide border-b border-white/10 pb-2">
            Badges & Visibility
          </h2>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Badge
            </label>
            <div className="flex flex-wrap gap-3">
              {(['none', 'new', 'sale', 'bestseller', 'soldout'] as const).map(badgeOption => (
                <button
                  key={badgeOption}
                  type="button"
                  onClick={() => setBadge(badgeOption)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium uppercase transition-colors
                    ${badge === badgeOption
                      ? 'bg-[#FF2D00] text-white'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10'
                    }`}
                >
                  {badgeOption === 'none' ? 'No Badge' : badgeOption}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between py-3 border-t border-white/5">
            <div>
              <div className="font-medium">Active (Visible on site)</div>
              <div className="text-sm text-gray-400">Product will be visible to customers</div>
            </div>
            <button
              type="button"
              onClick={() => setIsActive(!isActive)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                ${isActive ? 'bg-[#FF2D00]' : 'bg-gray-700'}`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                  ${isActive ? 'translate-x-6' : 'translate-x-1'}`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between py-3 border-t border-white/5">
            <div>
              <div className="font-medium">Featured</div>
              <div className="text-sm text-gray-400">Show in homepage featured section</div>
            </div>
            <button
              type="button"
              onClick={() => setIsFeatured(!isFeatured)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                ${isFeatured ? 'bg-[#FF2D00]' : 'bg-gray-700'}`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                  ${isFeatured ? 'translate-x-6' : 'translate-x-1'}`}
              />
            </button>
          </div>
        </div>

        {/* Section 7: Stock */}
        <div className="bg-[#0D0D10] border border-white/5 rounded-lg p-6 space-y-4">
          <h2 className="text-2xl font-[family-name:var(--font-bebas)] tracking-wide border-b border-white/10 pb-2">
            Inventory
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Stock Quantity
              </label>
              <input
                type="number"
                value={stockQuantity}
                onChange={(e) => setStockQuantity(Number(e.target.value))}
                min="0"
                className="w-full px-4 py-3 bg-[#050505] border border-gray-800 rounded-lg
                         focus:outline-none focus:border-[#FF2D00] text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Low Stock Alert Threshold
              </label>
              <input
                type="number"
                value={lowStockThreshold}
                onChange={(e) => setLowStockThreshold(Number(e.target.value))}
                min="0"
                className="w-full px-4 py-3 bg-[#050505] border border-gray-800 rounded-lg
                         focus:outline-none focus:border-[#FF2D00] text-white"
              />
              <p className="mt-1 text-xs text-gray-500">
                Alert when stock drops to this level
              </p>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex flex-wrap gap-4 items-center justify-between pt-4 border-t border-white/10">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 text-gray-400 hover:text-white transition-colors"
          >
            Cancel
          </button>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => handleSubmit(true)}
              disabled={saving}
              className="px-6 py-3 border border-gray-700 hover:border-gray-500
                       text-gray-300 hover:text-white rounded-lg transition-colors
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save as Draft
            </button>

            <button
              type="button"
              onClick={() => handleSubmit(false)}
              disabled={saving}
              className="px-8 py-3 bg-gradient-to-r from-[#FF2D00] to-[#FF6B00]
                       hover:from-[#E62900] hover:to-[#FF8C00]
                       text-white font-medium rounded-lg transition-all duration-200
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : (isEditing ? 'Update Product' : 'Publish Product')}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
