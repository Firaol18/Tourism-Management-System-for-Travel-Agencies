import { requireAdmin } from '@/lib/auth-utils'
import { prisma } from '@/lib/db'
import { formatDate } from '@/lib/utils'

export default async function AdminBookingsPage() {
    await requireAdmin()

    const bookings = await prisma.booking.findMany({
        include: {
            package: true,
        },
        orderBy: {
            regDate: 'desc',
        },
    })

    return (
        <div className="p-8">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Manage Bookings</h1>
                <p className="text-gray-600 mt-2">View and manage all customer bookings</p>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {bookings.length === 0 ? (
                    <div className="p-12 text-center">
                        <p className="text-gray-500">No bookings yet</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Booking ID
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        User Email
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Package
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        From - To
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Booking Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {bookings.map((booking) => {
                                    const statusInfo = getStatusInfo(booking.status, booking.cancelledBy)

                                    return (
                                        <tr key={booking.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                #{booking.id}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {booking.userEmail}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {booking.package.packageName}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {formatDate(booking.fromDate)} - {formatDate(booking.toDate)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {formatDate(booking.regDate)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusInfo.className}`}>
                                                    {statusInfo.label}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm space-x-3">
                                                {booking.status === 0 && (
                                                    <>
                                                        <button className="text-green-600 hover:text-green-900 font-medium">
                                                            Confirm
                                                        </button>
                                                        <button className="text-red-600 hover:text-red-900 font-medium">
                                                            Cancel
                                                        </button>
                                                    </>
                                                )}
                                                {booking.status !== 0 && (
                                                    <span className="text-gray-400">-</span>
                                                )}
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}

function getStatusInfo(status: number, cancelledBy: string | null) {
    if (status === 0) {
        return {
            label: 'Pending',
            className: 'bg-yellow-100 text-yellow-800',
        }
    } else if (status === 1) {
        return {
            label: 'Confirmed',
            className: 'bg-green-100 text-green-800',
        }
    } else if (status === 2) {
        const cancelledByUser = cancelledBy === 'u'
        return {
            label: cancelledByUser ? 'Cancelled by User' : 'Cancelled by Admin',
            className: 'bg-red-100 text-red-800',
        }
    }
    return {
        label: 'Unknown',
        className: 'bg-gray-100 text-gray-800',
    }
}
