'use client'

import { useState, useTransition } from 'react'
import type { Order } from '@/lib/orders'
import { updateOrderStatus, deleteOrder } from '@/lib/orders'
import { useRouter } from 'next/navigation'

const STATUS_LABELS: Record<Order['status'], string> = {
  pending: 'Pending',
  processing: 'Processing',
  completed: 'Completed',
  cancelled: 'Cancelled',
}

const STATUS_COLORS: Record<Order['status'], { bg: string; text: string; border: string }> = {
  pending: { bg: 'rgba(255,140,0,0.1)', text: '#FF8C00', border: 'rgba(255,140,0,0.3)' },
  processing: { bg: 'rgba(0,150,255,0.1)', text: '#4A9FFF', border: 'rgba(0,150,255,0.3)' },
  completed: { bg: 'rgba(0,200,83,0.1)', text: '#00C853', border: 'rgba(0,200,83,0.3)' },
  cancelled: { bg: 'rgba(255,45,0,0.1)', text: '#FF4422', border: 'rgba(255,45,0,0.3)' },
}

const STATUS_FLOW: Record<Order['status'], Order['status']> = {
  pending: 'processing',
  processing: 'completed',
  completed: 'pending',
  cancelled: 'pending',
}

type FilterStatus = 'all' | Order['status']

export default function OrdersClientPage({ initialOrders }: { initialOrders: Order[] }) {
  const router = useRouter()
  const [orders, setOrders] = useState(initialOrders)
  const [filter, setFilter] = useState<FilterStatus>('all')
  const [isPending, startTransition] = useTransition()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const filtered = filter === 'all' ? orders : orders.filter((o) => o.status === filter)

  const counts: Record<FilterStatus, number> = {
    all: orders.length,
    pending: orders.filter((o) => o.status === 'pending').length,
    processing: orders.filter((o) => o.status === 'processing').length,
    completed: orders.filter((o) => o.status === 'completed').length,
    cancelled: orders.filter((o) => o.status === 'cancelled').length,
  }

  function handleStatusToggle(order: Order) {
    const next = STATUS_FLOW[order.status]
    // Optimistic update
    setOrders((prev) =>
      prev.map((o) => (o.id === order.id ? { ...o, status: next } : o))
    )
    startTransition(async () => {
      const result = await updateOrderStatus(order.id, next)
      if (!result.success) {
        // Rollback
        setOrders((prev) =>
          prev.map((o) => (o.id === order.id ? { ...o, status: order.status } : o))
        )
      }
    })
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this order? This cannot be undone.')) return
    setDeletingId(id)
    const result = await deleteOrder(id)
    if (result.success) {
      setOrders((prev) => prev.filter((o) => o.id !== id))
    }
    setDeletingId(null)
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleString('en-NP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div style={{ minHeight: '70vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '1.75rem' }}>
        <h1
          style={{
            fontSize: '2rem',
            fontWeight: 800,
            color: 'rgba(255,255,255,0.95)',
            letterSpacing: '-0.01em',
            marginBottom: '0.25rem',
            fontFamily: 'var(--font-heading), sans-serif',
          }}
        >
          Customer Orders
        </h1>
        <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.35)' }}>
          {orders.length} total orders — manage by advancing status
        </p>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {((['all', 'pending', 'processing', 'completed', 'cancelled'] as FilterStatus[])).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            style={{
              padding: '0.45rem 1rem',
              borderRadius: 999,
              fontSize: '0.78rem',
              fontWeight: filter === s ? 600 : 400,
              border: filter === s
                ? '1px solid rgba(255,45,0,0.4)'
                : '1px solid rgba(255,255,255,0.08)',
              background: filter === s ? 'rgba(255,45,0,0.12)' : 'rgba(255,255,255,0.03)',
              color: filter === s ? '#FF5533' : 'rgba(255,255,255,0.4)',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {s === 'all' ? 'All' : STATUS_LABELS[s]}
            <span
              style={{
                marginLeft: '0.4rem',
                fontSize: '0.7rem',
                color: filter === s ? '#FF5533' : 'rgba(255,255,255,0.25)',
              }}
            >
              {counts[s]}
            </span>
          </button>
        ))}
      </div>

      {/* Orders Table / List */}
      {filtered.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '4rem 2rem',
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 12,
          }}
        >
          <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.9rem' }}>
            No orders{filter !== 'all' ? ` with status "${STATUS_LABELS[filter as Order['status']]}"` : ''} yet.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {filtered.map((order) => {
            const sc = STATUS_COLORS[order.status]
            return (
              <div
                key={order.id}
                style={{
                  background: 'rgba(255,255,255,0.025)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 12,
                  padding: '1.1rem 1.25rem',
                  display: 'grid',
                  gridTemplateColumns: '1fr 160px 160px 130px auto',
                  alignItems: 'center',
                  gap: '1rem',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.025)')}
              >
                {/* Customer + Product */}
                <div>
                  <p
                    style={{
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      color: 'rgba(255,255,255,0.9)',
                      marginBottom: '0.2rem',
                    }}
                  >
                    {order.customer_name}
                  </p>
                  <p
                    style={{
                      fontSize: '0.78rem',
                      color: 'rgba(255,255,255,0.35)',
                      marginBottom: '0.15rem',
                    }}
                  >
                    📱 {order.phone} · 📍 {order.location}
                  </p>
                  <p
                    style={{
                      fontSize: '0.78rem',
                      color: 'rgba(255,140,0,0.75)',
                      fontWeight: 600,
                    }}
                  >
                    {order.product_name}
                  </p>
                  {order.notes && (
                    <p
                      style={{
                        fontSize: '0.72rem',
                        color: 'rgba(255,255,255,0.25)',
                        marginTop: '0.2rem',
                        fontStyle: 'italic',
                      }}
                    >
                      "{order.notes}"
                    </p>
                  )}
                </div>

                {/* Date */}
                <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', whiteSpace: 'nowrap' }}>
                  {formatDate(order.created_at)}
                </p>

                {/* Status badge */}
                <div>
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '0.3rem 0.85rem',
                      borderRadius: 999,
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      letterSpacing: '0.06em',
                      background: sc.bg,
                      color: sc.text,
                      border: `1px solid ${sc.border}`,
                      textTransform: 'uppercase',
                    }}
                  >
                    {STATUS_LABELS[order.status]}
                  </span>
                </div>

                {/* Advance status button */}
                <button
                  onClick={() => handleStatusToggle(order)}
                  disabled={isPending}
                  title={`Advance to ${STATUS_LABELS[STATUS_FLOW[order.status]]}`}
                  style={{
                    padding: '0.4rem 0.85rem',
                    borderRadius: 8,
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: 'rgba(255,255,255,0.55)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    whiteSpace: 'nowrap',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.12)'
                    e.currentTarget.style.color = 'rgba(255,255,255,0.9)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
                    e.currentTarget.style.color = 'rgba(255,255,255,0.55)'
                  }}
                >
                  → {STATUS_LABELS[STATUS_FLOW[order.status]]}
                </button>

                {/* Delete */}
                <button
                  onClick={() => handleDelete(order.id)}
                  disabled={deletingId === order.id}
                  title="Delete order"
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 8,
                    background: 'rgba(255,45,0,0.06)',
                    border: '1px solid rgba(255,45,0,0.15)',
                    color: 'rgba(255,60,30,0.5)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s',
                    flexShrink: 0,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255,45,0,0.15)'
                    e.currentTarget.style.color = '#FF4422'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255,45,0,0.06)'
                    e.currentTarget.style.color = 'rgba(255,60,30,0.5)'
                  }}
                >
                  {deletingId === order.id ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ animation: 'spin 0.7s linear infinite' }}>
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.3" />
                      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>
              </div>
            )
          })}
        </div>
      )}

      {/* Spin animation */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
