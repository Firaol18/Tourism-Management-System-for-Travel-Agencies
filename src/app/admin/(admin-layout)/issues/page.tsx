import { requireAdmin } from '@/lib/auth-utils'
import { prisma } from '@/lib/db'
import { formatDate } from '@/lib/utils'

export default async function AdminIssuesPage() {
    await requireAdmin()

    const issues = await prisma.issue.findMany({
        orderBy: {
            postingDate: 'desc',
        },
    })

    return (
        <div className="p-8">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Manage Issues</h1>
                <p className="text-gray-600 mt-2">View and resolve support tickets</p>
            </div>

            {issues.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-12 text-center">
                    <p className="text-gray-500">No issues submitted yet</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {issues.map((issue) => (
                        <div key={issue.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900">
                                            Issue #{issue.id}: {issue.issue}
                                        </h3>
                                        <p className="text-sm text-gray-600 mt-1">
                                            From: {issue.userEmail} • Posted on {formatDate(issue.postingDate)}
                                        </p>
                                    </div>
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-semibold ${issue.adminRemark
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-yellow-100 text-yellow-800'
                                            }`}
                                    >
                                        {issue.adminRemark ? 'Resolved' : 'Pending'}
                                    </span>
                                </div>

                                <div className="mb-4">
                                    <p className="text-sm text-gray-600 mb-1">Description:</p>
                                    <p className="text-gray-700">{issue.description}</p>
                                </div>

                                {issue.adminRemark ? (
                                    <div className="bg-green-50 border-l-4 border-green-400 p-4">
                                        <p className="text-sm font-semibold text-green-900 mb-1">
                                            Your Response:
                                        </p>
                                        <p className="text-sm text-green-800">{issue.adminRemark}</p>
                                        {issue.adminRemarkDate && (
                                            <p className="text-xs text-green-700 mt-2">
                                                Responded on {formatDate(issue.adminRemarkDate)}
                                            </p>
                                        )}
                                    </div>
                                ) : (
                                    <div className="bg-gray-50 border-l-4 border-gray-300 p-4">
                                        <p className="text-sm font-semibold text-gray-700 mb-2">
                                            Add Response:
                                        </p>
                                        <textarea
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                                            rows={3}
                                            placeholder="Enter your response..."
                                        />
                                        <button className="mt-2 bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90">
                                            Submit Response
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
