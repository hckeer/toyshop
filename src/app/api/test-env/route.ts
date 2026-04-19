import { NextResponse } from 'next/server'

export async function GET() {
  const normalizedHash = process.env.ADMIN_PASSWORD_HASH
    ?.trim()
    ?.replace(/^['"]|['"]$/g, '')
    ?.replace(/\\\$/g, '$')

  return NextResponse.json({
    hasAdminEmail: !!process.env.ADMIN_EMAIL,
    hasAdminPasswordHash: !!process.env.ADMIN_PASSWORD_HASH,
    hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
    adminEmail: process.env.ADMIN_EMAIL,
    // Show first 10 chars for debugging
    passwordHashPreview: normalizedHash?.substring(0, 10),
    passwordHashLength: normalizedHash?.length || 0,
    hashLooksLikeBcrypt: /^\$2[aby]\$\d{2}\$/.test(normalizedHash || '')
  })
}
