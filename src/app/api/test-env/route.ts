import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    hasAdminEmail: !!process.env.ADMIN_EMAIL,
    hasAdminPasswordHash: !!process.env.ADMIN_PASSWORD_HASH,
    hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
    adminEmail: process.env.ADMIN_EMAIL,
    // Show first 10 chars for debugging
    passwordHashPreview: process.env.ADMIN_PASSWORD_HASH?.substring(0, 10),
    passwordHashLength: process.env.ADMIN_PASSWORD_HASH?.length || 0,
    fullHash: process.env.ADMIN_PASSWORD_HASH // Temporary for debugging
  })
}
