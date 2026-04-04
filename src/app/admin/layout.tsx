'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session } = useSession()
  const pathname = usePathname()

  // Don't show nav on login page
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-[#050505]">
      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-[#0D0D10]/90 border-b border-white/5">
        <div className="max-w-[1920px] mx-auto px-6 py-4 flex items-center justify-between">
          {/* Left: Logo */}
          <div>
            <h1 className="text-2xl font-[family-name:var(--font-bebas)] tracking-wide">
              RC TOYS NEPAL — <span className="text-[#FF2D00]">ADMIN</span>
            </h1>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-4">
            <Link
              href="/"
              target="_blank"
              className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1"
            >
              View Site
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </Link>
            
            <button
              onClick={() => signOut({ callbackUrl: '/admin/login' })}
              className="px-4 py-2 text-sm border border-gray-700 hover:border-[#FF2D00] text-gray-300 hover:text-white rounded-lg transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-[1920px] mx-auto p-6">
        {children}
      </main>
    </div>
  )
}
