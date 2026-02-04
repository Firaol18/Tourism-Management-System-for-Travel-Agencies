import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

interface PageProps {
    params: {
        type: string
    }
}

// Map URL slugs to database types
const PAGE_TYPE_MAP: Record<string, string> = {
    'aboutus': 'aboutus',
    'contact': 'contact',
    'terms': 'terms',
    'privacy': 'privacy',
}

const PAGE_TITLE_MAP: Record<string, string> = {
    'aboutus': 'About Us',
    'contact': 'Contact Us',
    'terms': 'Terms and Conditions',
    'privacy': 'Privacy Policy',
}

export default async function StaticPage({ params }: PageProps) {
    const dbType = PAGE_TYPE_MAP[params.type]

    if (!dbType) {
        notFound()
    }

    const page = await prisma.page.findFirst({
        where: { type: dbType },
    })

    return (
        <>
            <Header />
            <main>
                <div>
                    <div className="bg-gradient-to-r from-primary to-blue-600 text-white py-16">
                        <div className="container mx-auto px-4">
                            <h1 className="text-4xl font-bold">{PAGE_TITLE_MAP[params.type]}</h1>
                        </div>
                    </div>

                    <div className="container mx-auto px-4 py-12">
                        <div className="bg-white rounded-lg shadow-md p-8">
                            {page ? (
                                <div className="prose max-w-none text-gray-700 whitespace-pre-wrap">
                                    {page.detail}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-gray-500">Content coming soon.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    )
}
