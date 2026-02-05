"use client"

import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

interface ExportButtonsProps {
    revenueData: Array<{ month: string; revenue: number }>
    bookingTrends: Array<{ month: string; confirmed: number; pending: number; cancelled: number }>
    popularPackages: Array<{ name: string; bookings: number; revenue: number; rating: number; views: number }>
    userGrowth: Array<{ month: string; newUsers: number; total: number }>
    stats: {
        totalBookings: number
        confirmedBookings: number
        totalRevenue: number
        totalUsers: number
        totalPackages: number
        pendingReviews: number
    }
}

export function ExportButtons({
    revenueData,
    bookingTrends,
    popularPackages,
    userGrowth,
    stats
}: ExportButtonsProps) {

    const exportToPDF = () => {
        const doc = new jsPDF()

        // Title
        doc.setFontSize(20)
        doc.text('Analytics Report', 14, 20)
        doc.setFontSize(10)
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 28)

        // Summary Stats
        doc.setFontSize(14)
        doc.text('Summary Statistics', 14, 40)
        autoTable(doc, {
            startY: 45,
            head: [['Metric', 'Value']],
            body: [
                ['Total Revenue', `$${stats.totalRevenue.toLocaleString()}`],
                ['Total Bookings', stats.totalBookings.toString()],
                ['Confirmed Bookings', stats.confirmedBookings.toString()],
                ['Total Users', stats.totalUsers.toString()],
                ['Total Packages', stats.totalPackages.toString()],
                ['Pending Reviews', stats.pendingReviews.toString()]
            ]
        })

        // Revenue Data
        const revenueY = (doc as any).lastAutoTable.finalY + 10
        doc.setFontSize(14)
        doc.text('Revenue by Month', 14, revenueY)
        autoTable(doc, {
            startY: revenueY + 5,
            head: [['Month', 'Revenue']],
            body: revenueData.map(item => [item.month, `$${item.revenue.toLocaleString()}`])
        })

        // Popular Packages
        const packagesY = (doc as any).lastAutoTable.finalY + 10
        doc.setFontSize(14)
        doc.text('Top Packages', 14, packagesY)
        autoTable(doc, {
            startY: packagesY + 5,
            head: [['Package', 'Bookings', 'Revenue', 'Rating']],
            body: popularPackages.map(pkg => [
                pkg.name,
                pkg.bookings.toString(),
                `$${pkg.revenue.toLocaleString()}`,
                pkg.rating.toFixed(1)
            ])
        })

        doc.save('analytics-report.pdf')
    }

    const exportToCSV = () => {
        let csv = 'Tourism Management System - Analytics Report\n'
        csv += `Generated on: ${new Date().toLocaleString()}\n\n`

        // Summary Stats
        csv += 'SUMMARY STATISTICS\n'
        csv += 'Metric,Value\n'
        csv += `Total Revenue,$${stats.totalRevenue.toLocaleString()}\n`
        csv += `Total Bookings,${stats.totalBookings}\n`
        csv += `Confirmed Bookings,${stats.confirmedBookings}\n`
        csv += `Total Users,${stats.totalUsers}\n`
        csv += `Total Packages,${stats.totalPackages}\n`
        csv += `Pending Reviews,${stats.pendingReviews}\n\n`

        // Revenue Data
        csv += 'REVENUE BY MONTH\n'
        csv += 'Month,Revenue\n'
        revenueData.forEach(item => {
            csv += `${item.month},$${item.revenue}\n`
        })
        csv += '\n'

        // Booking Trends
        csv += 'BOOKING TRENDS\n'
        csv += 'Month,Confirmed,Pending,Cancelled\n'
        bookingTrends.forEach(item => {
            csv += `${item.month},${item.confirmed},${item.pending},${item.cancelled}\n`
        })
        csv += '\n'

        // Popular Packages
        csv += 'TOP PACKAGES\n'
        csv += 'Package,Bookings,Revenue,Rating,Views\n'
        popularPackages.forEach(pkg => {
            csv += `"${pkg.name}",${pkg.bookings},$${pkg.revenue},${pkg.rating.toFixed(1)},${pkg.views}\n`
        })
        csv += '\n'

        // User Growth
        csv += 'USER GROWTH\n'
        csv += 'Month,New Users,Total Users\n'
        userGrowth.forEach(item => {
            csv += `${item.month},${item.newUsers},${item.total}\n`
        })

        // Download
        const blob = new Blob([csv], { type: 'text/csv' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'analytics-report.csv'
        a.click()
        window.URL.revokeObjectURL(url)
    }

    return (
        <div className="flex gap-2">
            <Button onClick={exportToPDF} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export PDF
            </Button>
            <Button onClick={exportToCSV} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export CSV
            </Button>
        </div>
    )
}
