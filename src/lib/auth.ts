import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'

function normalizeEnvValue(value?: string) {
  if (!value) return ''
  return value
    .trim()
    .replace(/^['"]|['"]$/g, '')
    .replace(/\\\$/g, '$')
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const adminEmail = normalizeEnvValue(process.env.ADMIN_EMAIL).toLowerCase()
        const adminPassword = normalizeEnvValue(process.env.ADMIN_PASSWORD)
        const adminPasswordHash = normalizeEnvValue(process.env.ADMIN_PASSWORD_HASH)
        const providedEmail = credentials.email.trim().toLowerCase()

        if (!adminEmail || (!adminPassword && !adminPasswordHash)) {
          console.error('Admin auth env vars are not set correctly')
          return null
        }

        if (providedEmail !== adminEmail) {
          return null
        }

        let passwordValid = false
        if (adminPassword) {
          passwordValid = credentials.password === adminPassword
        } else if (/^\$2[aby]\$\d{2}\$/.test(adminPasswordHash)) {
          passwordValid = await bcrypt.compare(credentials.password, adminPasswordHash)
        } else {
          // Backward compatibility for environments that still store plain password in ADMIN_PASSWORD_HASH.
          passwordValid = credentials.password === adminPasswordHash
        }

        if (!passwordValid) {
          return null
        }

        // Return admin user
        return {
          id: '1',
          email: adminEmail,
          name: 'Admin'
        }
      }
    })
  ],
  pages: {
    signIn: '/admin/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
}
