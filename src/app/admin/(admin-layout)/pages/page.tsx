import { requireAdmin } from '@/lib/auth-utils'
import { prisma } from '@/lib/db'
import PageEditor from '@/components/admin/PageEditor'

interface AdminPagesPageProps {
    searchParams: {
        type?: string
    }
}

export default async function AdminPagesPage({ searchParams }: AdminPagesPageProps) {
    await requireAdmin()

    const type = searchParams.type || ''

    let pageContent = ''
    if (type) {
        const page = await prisma.page.findFirst({
            where: { type },
        })
        if (page) {
            pageContent = page.detail
        }
    }

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Manage Pages</h1>
            <PageEditor initialContent={pageContent} initialType={type} />
        </div>
    )
}
