import { requireAdmin } from '@/lib/auth-utils'
import PackageForm from '@/components/admin/PackageForm'
import { createPackage } from '@/app/actions/packages'

export default async function CreatePackagePage() {
    await requireAdmin()

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Create Package</h1>
            <PackageForm action={createPackage} mode="create" />
        </div>
    )
}
