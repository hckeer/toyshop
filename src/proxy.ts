import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const hasSessionToken =
    !!request.cookies.get('__Secure-next-auth.session-token') ||
    !!request.cookies.get('next-auth.session-token')

  if (hasSessionToken) {
    return NextResponse.next()
  }

  const loginUrl = new URL('/admin/login', request.url)
  loginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname)
  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: ['/admin/((?!login).*)']
}
