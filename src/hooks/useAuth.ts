'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export function useAuth(requireAuth: boolean = true, requireAdmin: boolean = false) {
    const { data: session, status } = useSession()
    const router = useRouter()

    useEffect(() => {
        if (status === 'loading') return

        if (requireAuth && !session) {
            router.push('/login')
        }

        if (requireAdmin && session?.user?.role !== 'admin') {
            router.push('/')
        }
    }, [session, status, requireAuth, requireAdmin, router])

    return {
        session,
        status,
        isAuthenticated: !!session,
        isAdmin: session?.user?.role === 'admin',
        user: session?.user,
    }
}
