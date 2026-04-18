'use server'

import { supabaseAdmin } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'

export type Order = {
  id: string
  product_id: string | null
  product_name: string
  product_slug: string | null
  customer_name: string
  phone: string
  location: string
  notes: string | null
  status: 'pending' | 'processing' | 'completed' | 'cancelled'
  created_at: string
}

export type SubmitOrderInput = {
  product_id?: string
  product_name: string
  product_slug?: string
  customer_name: string
  phone: string
  location: string
  notes?: string
}

// Submit a new order from storefront
export async function submitOrder(data: SubmitOrderInput): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabaseAdmin.from('orders').insert({
    product_id: data.product_id || null,
    product_name: data.product_name,
    product_slug: data.product_slug || null,
    customer_name: data.customer_name,
    phone: data.phone,
    location: data.location,
    notes: data.notes || null,
    status: 'pending',
  })

  if (error) {
    console.error('Error submitting order:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/admin/orders')
  return { success: true }
}

// Get all orders (admin only)
export async function getOrders(): Promise<Order[]> {
  const { data, error } = await supabaseAdmin
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching orders:', error)
    return []
  }

  return data as Order[]
}

// Update order status (admin only)
export async function updateOrderStatus(
  id: string,
  status: Order['status']
): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabaseAdmin
    .from('orders')
    .update({ status })
    .eq('id', id)

  if (error) {
    console.error('Error updating order status:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/admin/orders')
  return { success: true }
}

// Delete order (admin only)
export async function deleteOrder(id: string): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabaseAdmin
    .from('orders')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting order:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/admin/orders')
  return { success: true }
}
