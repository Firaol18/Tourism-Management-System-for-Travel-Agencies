import { requireAdmin } from '@/lib/auth-utils'
import { prisma } from '@/lib/db'
import PackageForm from '@/components/admin/PackageForm'
import { updatePackage } from '@/app/actions/packages'
import { notFound } from 'next/navigation'

interface EditPackagePageProps {
    params: {
        id: string
    }
}

export default async function EditPackagePage({ params }: EditPackagePageProps) {
    await requireAdmin()

    const id = parseInt(params.id)
    if (isNaN(id)) {
        notFound()
    }

    const pkg = await prisma.tourPackage.findUnique({
        where: { id },
    })

    if (!pkg) {
        notFound()
    }

    const updateAction = updatePackage.bind(null, pkg.id)

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Package</h1>
            <PackageForm
                initialData={{
                    ...pkg,
                    packageFeatures: pkg.packageFeatures,
                    // Database might store them differently? PHP code showed simple text inputs.
                    // Prisma schema has them as String.
                    // The form expects exact matching field names to the DB schema derived from props.
                }}
                action={updateAction}
                mode="edit"
            />
        </div>
    )
}
