import { NextResponse } from 'next/server'

export async function GET() {
  const normalizedPassword = process.env.ADMIN_PASSWORD
    ?.trim()
    ?.replace(/^['"]|['"]$/g, '')
    ?.replace(/\\\$/g, '$')
  const normalizedHash = process.env.ADMIN_PASSWORD_HASH
    ?.trim()
    ?.replace(/^['"]|['"]$/g, '')
    ?.replace(/\\\$/g, '$')

  return NextResponse.json({
    hasAdminEmail: !!process.env.ADMIN_EMAIL,
    hasAdminPassword: !!process.env.ADMIN_PASSWORD,
    hasAdminPasswordHash: !!process.env.ADMIN_PASSWORD_HASH,
    hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
    adminEmail: process.env.ADMIN_EMAIL,
    passwordPreview: normalizedPassword?.substring(0, 3),
    passwordLength: normalizedPassword?.length || 0,
    passwordHashPreview: normalizedHash?.substring(0, 10),
    passwordHashLength: normalizedHash?.length || 0,
    hashLooksLikeBcrypt: /^\$2[aby]\$\d{2}\$/.test(normalizedHash || ''),
    authMode: normalizedPassword ? 'plain' : normalizedHash ? 'hash' : 'unset'
  })
}
