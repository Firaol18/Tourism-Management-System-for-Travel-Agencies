'use client'

import { SessionProvider } from 'next-auth/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import { useEffect } from 'react'

export function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 60 * 1000, // 1 minute
                        refetchOnWindowFocus: false,
                    },
                },
            })
    )

    useEffect(() => {
        if (typeof document === 'undefined') return

        const run = () => {
            try {
                const body = document.body
                if (!body) return
                const attrs = Array.from(body.attributes).map((a) => a.name)
                attrs.forEach((name) => {
                    if (name && (name.indexOf('__processed_') === 0 || name === 'bis_register')) {
                        body.removeAttribute(name)
                    }
                })
            } catch (e) {
                // ignore
            }
        }

        if (document.readyState === 'loading') {
            window.addEventListener('DOMContentLoaded', run, { once: true })
            return () => window.removeEventListener('DOMContentLoaded', run)
        }

        // schedule to ensure body exists and avoid racing with other DOM mutations
        const id = window.setTimeout(run, 0)
        return () => window.clearTimeout(id)
    }, [])

    return (
        <SessionProvider>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </SessionProvider>
    )
}
