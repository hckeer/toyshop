'use server'

import { supabaseAdmin } from '@/lib/supabase'
import type { Product } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'

// Helper function to generate slug from name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// Get all products
export async function getProducts() {
  const { data, error } = await supabaseAdmin
    .from('products')
    .select('*')
    .order('display_order', { ascending: true })

  if (error) {
    console.error('Error fetching products:', error)
    return []
  }

  return data as Product[]
}

// Get active products for storefront
export async function getActiveProducts() {
  const { data, error } = await supabaseAdmin
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true })

  if (error) {
    console.error('Error fetching active products:', error)
    return []
  }

  return data as Product[]
}

// Get featured products for homepage
export async function getFeaturedProducts() {
  const { data, error } = await supabaseAdmin
    .from('products')
    .select('*')
    .eq('is_featured', true)
    .eq('is_active', true)
    .order('display_order', { ascending: true })
    .limit(5)

  if (error) {
    console.error('Error fetching featured products:', error)
    return []
  }

  return data as Product[]
}

// Get product by slug
export async function getProductBySlug(slug: string) {
  const { data, error } = await supabaseAdmin
    .from('products')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) {
    console.error('Error fetching product:', error)
    return null
  }

  return data as Product
}

// Get product by ID
export async function getProductById(id: string) {
  const { data, error } = await supabaseAdmin
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching product:', error)
    return null
  }

  return data as Product
}

// Create product
export async function createProduct(productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>) {
  // Generate slug if not provided
  const slug = productData.slug || generateSlug(productData.name)

  // Get max display_order to add new product at the end
  const { data: maxOrder } = await supabaseAdmin
    .from('products')
    .select('display_order')
    .order('display_order', { ascending: false })
    .limit(1)
    .single()

  const display_order = (maxOrder?.display_order || 0) + 1

  const { data, error } = await supabaseAdmin
    .from('products')
    .insert({
      ...productData,
      slug,
      display_order
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating product:', error)
    throw new Error(error.message)
  }

  revalidatePath('/admin/products')
  revalidatePath('/products')
  revalidatePath('/')

  return data as Product
}

// Update product
export async function updateProduct(id: string, productData: Partial<Product>) {
  // If name is being updated, regenerate slug
  if (productData.name) {
    productData.slug = generateSlug(productData.name)
  }

  const { data, error } = await supabaseAdmin
    .from('products')
    .update(productData)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating product:', error)
    throw new Error(error.message)
  }

  revalidatePath('/admin/products')
  revalidatePath('/products')
  revalidatePath('/')

  return data as Product
}

// Delete product
export async function deleteProduct(id: string) {
  const { error } = await supabaseAdmin
    .from('products')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting product:', error)
    throw new Error(error.message)
  }

  revalidatePath('/admin/products')
  revalidatePath('/products')
  revalidatePath('/')

  return { success: true }
}

// Delete multiple products
export async function deleteProducts(ids: string[]) {
  const { error } = await supabaseAdmin
    .from('products')
    .delete()
    .in('id', ids)

  if (error) {
    console.error('Error deleting products:', error)
    throw new Error(error.message)
  }

  revalidatePath('/admin/products')
  revalidatePath('/products')
  revalidatePath('/')

  return { success: true }
}

// Reorder products
export async function reorderProducts(productIds: string[]) {
  // Update display_order for each product
  const updates = productIds.map((id, index) => 
    supabaseAdmin
      .from('products')
      .update({ display_order: index })
      .eq('id', id)
  )

  const results = await Promise.all(updates)

  const errors = results.filter(r => r.error)
  if (errors.length > 0) {
    console.error('Error reordering products:', errors)
    throw new Error('Failed to reorder products')
  }

  revalidatePath('/admin/products')
  revalidatePath('/products')
  revalidatePath('/')

  return { success: true }
}

// Bulk update product status
export async function bulkUpdateProducts(ids: string[], updates: Partial<Product>) {
  const { error } = await supabaseAdmin
    .from('products')
    .update(updates)
    .in('id', ids)

  if (error) {
    console.error('Error bulk updating products:', error)
    throw new Error(error.message)
  }

  revalidatePath('/admin/products')
  revalidatePath('/products')
  revalidatePath('/')

  return { success: true }
}
