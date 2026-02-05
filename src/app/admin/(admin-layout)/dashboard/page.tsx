import { requireAdmin } from '@/lib/auth-utils'
import {
    getRevenueData,
    getBookingTrends,
    getPopularPackages,
    getUserGrowth,
    getDashboardStats
} from '@/app/actions/analytics'
import { AnalyticsDashboardClient } from '@/components/admin/analytics-dashboard-client'

export default async function AdminDashboard() {
    await requireAdmin()

    // Fetch all analytics data
    const [revenueData, bookingTrends, popularPackages, userGrowth, stats] = await Promise.all([
        getRevenueData(),
        getBookingTrends(),
        getPopularPackages(10),
        getUserGrowth(),
        getDashboardStats()
    ])

    return (
        <div className="p-6">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-md p-6 mb-8 flex items-center justify-between text-white shadow-lg">
                <div>
                    <h2 className="text-2xl font-bold">TOURISM MANAGEMENT SYSTEM</h2>
                    <p className="opacity-90">Admin Dashboard & Analytics</p>
                </div>
                <div className="text-right">
                    <div className="font-medium">Welcome Admin</div>
                    <div className="text-sm opacity-80">System Administrator</div>
                </div>
            </div>

            <AnalyticsDashboardClient
                initialRevenueData={revenueData}
                initialBookingTrends={bookingTrends}
                initialPopularPackages={popularPackages}
                initialUserGrowth={userGrowth}
                initialStats={stats}
            />
        </div>
    )
}
