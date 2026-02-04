import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { compare } from 'bcryptjs'
import { prisma } from '@/lib/db'

export const authOptions: NextAuthOptions = {
    session: {
        strategy: 'jwt',
    },
    pages: {
        signIn: '/login',
        signOut: '/login',
        error: '/login',
    },
    providers: [
        CredentialsProvider({
            id: 'user-login',
            name: 'User Credentials',
            credentials: {
                emailId: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.emailId || !credentials?.password) {
                    throw new Error('Email and password are required')
                }

                const user = await prisma.user.findUnique({
                    where: { emailId: credentials.emailId },
                })

                if (!user) {
                    throw new Error('Invalid email or password')
                }

                // Check if password is empty (needs reset)
                if (!user.password || user.password === '') {
                    throw new Error('Please reset your password')
                }

                const isValid = await compare(credentials.password, user.password)

                if (!isValid) {
                    throw new Error('Invalid email or password')
                }

                return {
                    id: user.id.toString(),
                    email: user.emailId,
                    name: user.fullName,
                    role: 'user',
                }
            },
        }),
        CredentialsProvider({
            id: 'admin-login',
            name: 'Admin Credentials',
            credentials: {
                username: { label: 'Username', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.username || !credentials?.password) {
                    throw new Error('Username and password are required')
                }

                const admin = await prisma.admin.findUnique({
                    where: { username: credentials.username },
                })

                if (!admin) {
                    throw new Error('Invalid username or password')
                }

                // Check if password is empty (needs reset)
                if (!admin.password || admin.password === '') {
                    throw new Error('Please set your admin password')
                }

                const isValid = await compare(credentials.password, admin.password)

                if (!isValid) {
                    throw new Error('Invalid username or password')
                }

                return {
                    id: admin.id.toString(),
                    email: admin.username,
                    name: admin.username,
                    role: 'admin',
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
                token.role = user.role
            }
            return token
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string
                session.user.role = token.role as 'user' | 'admin'
            }
            return session
        },
    },
}
