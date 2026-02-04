import { requireAdmin } from '@/lib/auth-utils'
import { prisma } from '@/lib/db'
import Link from 'next/link'

export default async function AdminDashboard() {
    await requireAdmin()

    // Get statistics
    const [userCount, packageCount, bookingCount, enquiryCount, issueCount] = await Promise.all([
        prisma.user.count(),
        prisma.tourPackage.count(),
        prisma.booking.count(),
        prisma.enquiry.count(),
        prisma.issue.count(),
    ])

    const [pendingBookings, resolvedIssues] = await Promise.all([
        prisma.booking.count({ where: { status: 0 } }),
        prisma.issue.count({ where: { adminRemark: { not: null } } }),
    ])

    return (
        <div className="p-6">
            {/* Top banner similar to PHP admin */}
            <div className="bg-green-400 rounded-md p-6 mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">TOURISM MANAGEMENT SYSTEM</h2>
                <div className="text-right">
                    <div className="text-white font-medium">Welcome</div>
                    <div className="text-white/90 text-sm">Administrator</div>
                </div>
            </div>

            <nav className="mb-4 text-sm text-gray-600">Home &gt;</nav>

            {/* Colored statistic tiles in one row (responsive) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                <div className="rounded p-6 text-center text-white" style={{ background: '#ef5350' }}>
                    <div className="text-2xl mb-3">👤</div>
                    <div className="uppercase">User</div>
                    <div className="text-3xl font-bold mt-2">{userCount}</div>
                </div>

                <div className="rounded p-6 text-center text-white" style={{ background: '#29b6f6' }}>
                    <div className="text-2xl mb-3">📘</div>
                    <div className="uppercase">Bookings</div>
                    <div className="text-3xl font-bold mt-2">{bookingCount}</div>
                </div>

                <div className="rounded p-6 text-center text-white" style={{ background: '#8bc34a' }}>
                    <div className="text-2xl mb-3">📁</div>
                    <div className="uppercase">Enquiries</div>
                    <div className="text-3xl font-bold mt-2">{enquiryCount}</div>
                </div>

                <div className="rounded p-6 text-center text-white" style={{ background: '#9c27b0' }}>
                    <div className="text-2xl mb-3">💼</div>
                    <div className="uppercase">Toatal packages</div>
                    <div className="text-3xl font-bold mt-2">{packageCount}</div>
                </div>

                <div className="rounded p-6 text-center text-white" style={{ background: '#cddc39' }}>
                    <div className="text-2xl mb-3">📂</div>
                    <div className="uppercase">Issues Riaised</div>
                    <div className="text-3xl font-bold mt-2">{issueCount}</div>
                </div>
            </div>

            <div className="bg-white p-4 rounded shadow-sm">
                <p className="text-sm text-gray-500">© 2016 TMS. All Rights Reserved | TMS</p>
            </div>
        </div>
    )
}

function StatCard({
    title,
    value,
    icon,
    color,
}: {
    title: string
    value: number
    icon: string
    color: string
}) {
    const colorClasses = {
        blue: 'bg-blue-500',
        green: 'bg-green-500',
        purple: 'bg-purple-500',
        orange: 'bg-orange-500',
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-gray-600 text-sm">{title}</p>
                    <p className="text-3xl font-bold mt-2">{value}</p>
                </div>
                <div className={`${colorClasses[color as keyof typeof colorClasses]} w-16 h-16 rounded-full flex items-center justify-center text-3xl`}>
                    {icon}
                </div>
            </div>
        </div>
    )
}

function ManagementCard({
    title,
    description,
    href,
    icon,
}: {
    title: string
    description: string
    href: string
    icon: string
}) {
    return (
        <Link
            href={href}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
            <div className="text-4xl mb-3">{icon}</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-600 text-sm">{description}</p>
        </Link>
    )
}
