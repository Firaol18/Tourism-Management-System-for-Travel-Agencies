import { requireAdmin } from '@/lib/auth-utils'
import { prisma } from '@/lib/db'
import { formatDate } from '@/lib/utils'

export default async function AdminUsersPage() {
    await requireAdmin()

    const users = await prisma.user.findMany({
        orderBy: {
            regDate: 'desc',
        },
    })

    return (
        <div className="p-8">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Manage Users</h1>
                <p className="text-gray-600 mt-2">View all registered users</p>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {users.length === 0 ? (
                    <div className="p-12 text-center">
                        <p className="text-gray-500">No users registered yet</p>
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
                                        Full Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Email
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Mobile
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Registration Date
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {users.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {user.id}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {user.fullName}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {user.emailId}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {user.mobileNumber}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {formatDate(user.regDate)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <div className="mt-4 text-sm text-gray-600">
                Total Users: {users.length}
            </div>
        </div>
    )
}
