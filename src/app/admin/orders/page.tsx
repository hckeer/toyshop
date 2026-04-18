import type { Metadata } from 'next'
import OrdersClientPage from '@/components/admin/OrdersClientPage'
import { getOrders } from '@/lib/orders'

export const metadata: Metadata = {
  title: 'Orders — RC Toys Nepal Admin',
  description: 'View and manage customer orders',
}

export default async function OrdersPage() {
  const orders = await getOrders()

  return <OrdersClientPage initialOrders={orders} />
}
