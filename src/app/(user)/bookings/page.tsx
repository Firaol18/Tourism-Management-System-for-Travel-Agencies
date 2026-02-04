import { requireAuth } from '@/lib/auth-utils'
import { prisma } from '@/lib/db'
import { formatDate } from '@/lib/utils'
import { cancelBooking } from '@/app/actions/user'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import CancelBookingButton from '@/components/bookings/CancelBookingButton'

export default async function BookingsPage() {
    const user = await requireAuth()

    const bookings = await prisma.booking.findMany({
        where: { userEmail: user.email },
        include: {
            package: true,
        },
        orderBy: {
            regDate: 'desc',
        },
    })

    return (
        <>
            <Header />
            <main className="min-h-screen bg-gray-50">
                <div className="bg-gradient-to-r from-primary to-blue-600 text-white py-12">
                    <div className="container mx-auto px-4">
                        <h1 className="text-4xl font-bold">My Tour History</h1>
                        <p className="mt-2 text-lg">Manage your bookings and tour records</p>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-12">
                    <div className="bg-white rounded-xl shadow-md overflow-hidden border">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 text-gray-600 uppercase text-sm font-bold tracking-widest border-b">
                                    <tr>
                                        <th className="px-6 py-4">App ID</th>
                                        <th className="px-6 py-4">Package Name</th>
                                        <th className="px-6 py-4">From</th>
                                        <th className="px-6 py-4">To</th>
                                        <th className="px-6 py-4">Comment</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4">Booking Date</th>
                                        <th className="px-6 py-4">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y text-gray-700">
                                    {bookings.map((booking) => (
                                        <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 font-mono font-bold text-gray-500">#BK-{booking.id}</td>
                                            <td className="px-6 py-4 font-bold text-gray-800">{booking.package.packageName}</td>
                                            <td className="px-6 py-4">{booking.fromDate}</td>
                                            <td className="px-6 py-4">{booking.toDate}</td>
                                            <td className="px-6 py-4 text-sm max-w-xs truncate">{booking.comment}</td>
                                            <td className="px-6 py-4 font-bold">
                                                {booking.status === 0 && <span className="text-blue-500">Pending</span>}
                                                {booking.status === 1 && <span className="text-green-500">Confirmed</span>}
                                                {booking.status === 2 && (
                                                    <span className="text-red-500">
                                                        Cancelled ({booking.cancelledBy === 'u' ? 'You' : 'Admin'})
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">{formatDate(booking.regDate)}</td>
                                            <td className="px-6 py-4">
                                                {booking.status === 0 && (
                                                    <>
                                                        {/* Client-side cancel button handles confirm and calls API */}
                                                        <CancelBookingButton bookingId={booking.id} />
                                                    </>
                                                )}
                                                {booking.status !== 0 && (
                                                    <span className="block text-gray-400 font-medium italic">No actions</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    {bookings.length === 0 && (
                                        <tr>
                                            <td colSpan={8} className="px-6 py-20 text-center text-gray-400 font-medium italic">
                                                No booking history found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    )
}
