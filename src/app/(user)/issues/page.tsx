import { requireAuth } from '@/lib/auth-utils'
import { prisma } from '@/lib/db'
import { formatDate } from '@/lib/utils'
import IssueForm from '@/components/issues/IssueForm'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export default async function IssuesPage() {
    const user = await requireAuth()

    const issues = await prisma.issue.findMany({
        where: { userEmail: user.email },
        orderBy: {
            postingDate: 'desc',
        },
    })

    return (
        <>
            <Header />
            <main className="min-h-screen bg-gray-50">
                <div className="bg-gradient-to-r from-primary to-blue-600 text-white py-12">
                    <div className="container mx-auto px-4">
                        <h1 className="text-4xl font-bold">Issue Tickets</h1>
                        <p className="mt-2 text-lg">Report and track your support requests</p>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        {/* Raise Issue Form */}
                        <div className="lg:col-span-4">
                            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border">
                                <div className="p-8 bg-gray-50 border-b">
                                    <h2 className="text-2xl font-bold text-gray-800">Raise New Issue</h2>
                                    <p className="text-gray-500 text-sm mt-1">Our team will respond within 24 hours</p>
                                </div>
                                <div className="p-8">
                                    <IssueForm userEmail={user.email} />
                                </div>
                            </div>
                        </div>

                        {/* Issue Tickets List */}
                        <div className="lg:col-span-8">
                            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border">
                                <div className="p-8 bg-gray-50 border-b">
                                    <h2 className="text-2xl font-bold text-gray-800">Ticket History</h2>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead className="bg-gray-100 text-gray-600 uppercase text-xs font-black tracking-widest border-b">
                                            <tr>
                                                <th className="px-6 py-4">ID</th>
                                                <th className="px-6 py-4">Issue Type</th>
                                                <th className="px-6 py-4">Description</th>
                                                <th className="px-6 py-4">Reported</th>
                                                <th className="px-6 py-4">Remark</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y text-sm">
                                            {issues.map((issue) => (
                                                <tr key={issue.id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-6 py-4 font-mono font-bold text-gray-400">#TK-{issue.id}</td>
                                                    <td className="px-6 py-4">
                                                        <span className="font-bold text-gray-800">{issue.issue}</span>
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-600 max-w-xs">{issue.description}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{formatDate(issue.postingDate)}</td>
                                                    <td className="px-6 py-4">
                                                        {issue.adminRemark ? (
                                                            <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                                                                <p className="text-green-800 font-medium text-xs leading-relaxed italic">
                                                                    "{issue.adminRemark}"
                                                                </p>
                                                                <p className="text-[10px] text-green-600 mt-2 font-black uppercase">
                                                                    Replied: {issue.adminRemarkDate ? formatDate(issue.adminRemarkDate) : 'N/A'}
                                                                </p>
                                                            </div>
                                                        ) : (
                                                            <span className="text-orange-500 font-black italic uppercase text-[10px] tracking-widest bg-orange-50 px-3 py-1 rounded-full">
                                                                In Review
                                                            </span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                            {issues.length === 0 && (
                                                <tr>
                                                    <td colSpan={5} className="px-6 py-20 text-center text-gray-400 font-medium italic">
                                                        No issue tickets identified.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    )
}
