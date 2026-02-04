import { requireAdmin } from '@/lib/auth-utils'
import { prisma } from '@/lib/db'
import { formatCurrency, formatDate } from '@/lib/utils'
import Link from 'next/link'
import { deletePackage } from '@/app/actions/packages'

export default async function AdminPackagesPage() {
    await requireAdmin()

    const packages = await prisma.tourPackage.findMany({
        orderBy: {
            creationDate: 'desc',
        },
    })

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Manage Packages</h1>
                <Link
                    href="/admin/packages/create"
                    className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90"
                >
                    + Create Package
                </Link>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {packages.length === 0 ? (
                    <div className="p-12 text-center">
                        <p className="text-gray-500 mb-4">No packages yet</p>
                        <Link
                            href="/admin/packages/create"
                            className="inline-block bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90"
                        >
                            Create First Package
                        </Link>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        ID
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Package Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Type
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Location
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Price
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Created
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {packages.map((pkg) => (
                                    <tr key={pkg.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {pkg.id}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {pkg.packageName}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {pkg.packageType}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {pkg.packageLocation}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                                            {formatCurrency(pkg.packagePrice)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {formatDate(pkg.creationDate)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm flex items-center space-x-3">
                                            <Link
                                                href={`/admin/packages/${pkg.id}/edit`}
                                                className="text-blue-600 hover:text-blue-900"
                                            >
                                                Edit
                                            </Link>
                                            <form action={deletePackage.bind(null, pkg.id)}>
                                                <button className="text-red-600 hover:text-red-900">
                                                    Delete
                                                </button>
                                            </form>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}
