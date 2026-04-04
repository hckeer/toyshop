import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'

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
          console.log('Missing credentials')
          return null
        }

        // Check if credentials match admin user
        const adminEmail = process.env.ADMIN_EMAIL
        const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH

        console.log('Auth attempt:', {
          providedEmail: credentials.email,
          adminEmail,
          hasPasswordHash: !!adminPasswordHash
        })

        if (credentials.email !== adminEmail) {
          console.log('Email mismatch')
          return null
        }

        // Verify password
        const passwordValid = await bcrypt.compare(
          credentials.password,
          adminPasswordHash!
        )

        console.log('Password valid:', passwordValid)

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
