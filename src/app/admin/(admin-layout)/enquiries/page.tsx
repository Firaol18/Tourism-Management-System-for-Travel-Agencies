import { requireAdmin } from '@/lib/auth-utils'
import { prisma } from '@/lib/db'
import { formatDate } from '@/lib/utils'
import { markEnquiryAsRead } from '@/app/actions/enquiries'

export default async function AdminEnquiriesPage() {
    await requireAdmin()

    const enquiries = await prisma.enquiry.findMany({
        orderBy: {
            postingDate: 'desc',
        },
    })

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Manage Enquiries</h1>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {enquiries.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                        No enquiries yet
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Ticket ID
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Mobile / Email
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Subject
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Description
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {enquiries.map((enquiry) => (
                                    <tr key={enquiry.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            #TCKT-{enquiry.id}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {enquiry.fullName}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {enquiry.mobileNumber}
                                            <br />
                                            {enquiry.emailId}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                                            {enquiry.subject}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                                            {enquiry.description}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {formatDate(enquiry.postingDate)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            {enquiry.status === 1 ? (
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                    Read
                                                </span>
                                            ) : (
                                                <form action={markEnquiryAsRead.bind(null, enquiry.id)}>
                                                    <button className="text-blue-600 hover:text-blue-900 font-medium">
                                                        Mark as Read
                                                    </button>
                                                </form>
                                            )}
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
