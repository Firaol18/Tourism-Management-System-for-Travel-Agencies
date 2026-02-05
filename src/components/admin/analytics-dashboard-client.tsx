"use client"

import { useState, useEffect } from 'react'
import { StatsCards } from '@/components/admin/charts/stats-cards'
import { RevenueChart } from '@/components/admin/charts/revenue-chart'
import { BookingTrendsChart } from '@/components/admin/charts/booking-trends-chart'
import { PopularPackagesChart } from '@/components/admin/charts/popular-packages-chart'
import { UserGrowthChart } from '@/components/admin/charts/user-growth-chart'
import { DateRangePicker } from '@/components/admin/date-range-picker'
import { ExportButtons } from '@/components/admin/export-buttons'
import { DateRange } from 'react-day-picker'

interface AnalyticsDashboardClientProps {
    initialRevenueData: any[]
    initialBookingTrends: any[]
    initialPopularPackages: any[]
    initialUserGrowth: any[]
    initialStats: any
}

export function AnalyticsDashboardClient({
    initialRevenueData,
    initialBookingTrends,
    initialPopularPackages,
    initialUserGrowth,
    initialStats
}: AnalyticsDashboardClientProps) {
    const [revenueData, setRevenueData] = useState(initialRevenueData)
    const [bookingTrends, setBookingTrends] = useState(initialBookingTrends)
    const [popularPackages, setPopularPackages] = useState(initialPopularPackages)
    const [userGrowth, setUserGrowth] = useState(initialUserGrowth)
    const [stats, setStats] = useState(initialStats)
    const [dateRange, setDateRange] = useState<DateRange | undefined>()
    const [isLoading, setIsLoading] = useState(false)

    const handleDateChange = async (range: DateRange | undefined) => {
        setDateRange(range)

        if (!range?.from || !range?.to) {
            // Reset to initial data
            setRevenueData(initialRevenueData)
            setBookingTrends(initialBookingTrends)
            setUserGrowth(initialUserGrowth)
            return
        }

        setIsLoading(true)

        try {
            // Fetch filtered data
            const [revenue, trends, growth] = await Promise.all([
                fetch(`/api/analytics/revenue?from=${range.from.toISOString()}&to=${range.to.toISOString()}`).then(r => r.json()),
                fetch(`/api/analytics/booking-trends?from=${range.from.toISOString()}&to=${range.to.toISOString()}`).then(r => r.json()),
                fetch(`/api/analytics/user-growth?from=${range.from.toISOString()}&to=${range.to.toISOString()}`).then(r => r.json())
            ])

            setRevenueData(revenue)
            setBookingTrends(trends)
            setUserGrowth(growth)
        } catch (error) {
            console.error('Error fetching filtered data:', error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
                    <p className="text-muted-foreground">
                        Overview of your business performance
                    </p>
                </div>
                <div className="flex gap-4">
                    <DateRangePicker onDateChange={handleDateChange} />
                    <ExportButtons
                        revenueData={revenueData}
                        bookingTrends={bookingTrends}
                        popularPackages={popularPackages}
                        userGrowth={userGrowth}
                        stats={stats}
                    />
                </div>
            </div>

            {/* Stats Cards */}
            <StatsCards stats={stats} />

            {/* Charts Grid */}
            <div className="grid gap-6 md:grid-cols-2">
                <RevenueChart data={revenueData} />
                <BookingTrendsChart data={bookingTrends} />
            </div>

            <div className="grid gap-6">
                <PopularPackagesChart data={popularPackages} />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <UserGrowthChart data={userGrowth} />

                {/* Additional Info Card */}
                <div className="bg-muted/50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">Quick Insights</h3>
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Conversion Rate:</span>
                            <span className="font-medium">
                                {stats.totalBookings > 0
                                    ? ((stats.confirmedBookings / stats.totalBookings) * 100).toFixed(1)
                                    : 0}%
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Avg Revenue per Booking:</span>
                            <span className="font-medium">
                                ${stats.confirmedBookings > 0
                                    ? (stats.totalRevenue / stats.confirmedBookings).toFixed(2)
                                    : 0}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Avg Bookings per User:</span>
                            <span className="font-medium">
                                {stats.totalUsers > 0
                                    ? (stats.totalBookings / stats.totalUsers).toFixed(2)
                                    : 0}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Pending Reviews:</span>
                            <span className="font-medium text-yellow-600">
                                {stats.pendingReviews}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {isLoading && (
                <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
                    <div className="bg-background p-4 rounded-lg shadow-lg">
                        Loading filtered data...
                    </div>
                </div>
            )}
        </div>
    )
}
