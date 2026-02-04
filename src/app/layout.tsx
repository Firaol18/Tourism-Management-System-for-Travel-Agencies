import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from '@/components/providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'TMS - Tourism Management System',
    description: 'Book your dream tour packages with TMS',
    keywords: ['tourism', 'travel', 'tour packages', 'booking'],
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" />
            </head>
            <body className={inter.className}>
                <Providers>{children}</Providers>
            </body>
        </html>
    )
}
