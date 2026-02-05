'use server'

import { prisma } from '@/lib/db'
import { requireAdmin } from '@/lib/auth-utils'
import { startOfMonth, endOfMonth, subMonths, format } from 'date-fns'

export async function getRevenueData(startDate?: Date, endDate?: Date) {
    await requireAdmin()

    const start = startDate || subMonths(new Date(), 12)
    const end = endDate || new Date()

    try {
        const bookings = await prisma.booking.findMany({
            where: {
                status: 1, // Confirmed bookings only
                regDate: {
                    gte: start,
                    lte: end
                }
            },
            include: {
                package: {
                    select: {
                        packagePrice: true
                    }
                }
            },
            orderBy: {
                regDate: 'asc'
            }
        })

        // Group by month
        const revenueByMonth = bookings.reduce((acc, booking) => {
            const month = format(new Date(booking.regDate), 'MMM yyyy')
            const revenue = booking.totalAmount
                ? Number(booking.totalAmount)
                : booking.package.packagePrice * booking.numberOfPeople

            if (!acc[month]) {
                acc[month] = 0
            }
            acc[month] += revenue

            return acc
        }, {} as Record<string, number>)

        return Object.entries(revenueByMonth).map(([month, revenue]) => ({
            month,
            revenue
        }))
    } catch (error) {
        console.error('Error fetching revenue data:', error)
        return []
    }
}

export async function getBookingTrends(startDate?: Date, endDate?: Date) {
    await requireAdmin()

    const start = startDate || subMonths(new Date(), 12)
    const end = endDate || new Date()

    try {
        const bookings = await prisma.booking.findMany({
            where: {
                regDate: {
                    gte: start,
                    lte: end
                }
            },
            orderBy: {
                regDate: 'asc'
            }
        })

        // Group by month and status
        const trendsByMonth = bookings.reduce((acc, booking) => {
            const month = format(new Date(booking.regDate), 'MMM yyyy')

            if (!acc[month]) {
                acc[month] = { month, confirmed: 0, pending: 0, cancelled: 0 }
            }

            if (booking.status === 1) acc[month].confirmed++
            else if (booking.status === 0) acc[month].pending++
            else if (booking.status === 2) acc[month].cancelled++

            return acc
        }, {} as Record<string, any>)

        return Object.values(trendsByMonth)
    } catch (error) {
        console.error('Error fetching booking trends:', error)
        return []
    }
}

export async function getPopularPackages(limit: number = 10) {
    await requireAdmin()

    try {
        const packages = await prisma.tourPackage.findMany({
            include: {
                _count: {
                    select: {
                        bookings: true
                    }
                },
                reviews: {
                    where: { isApproved: true },
                    select: { rating: true }
                }
            },
            orderBy: {
                bookings: {
                    _count: 'desc'
                }
            },
            take: limit
        })

        return packages.map(pkg => {
            const avgRating = pkg.reviews.length > 0
                ? pkg.reviews.reduce((sum, r) => sum + r.rating, 0) / pkg.reviews.length
                : 0

            return {
                id: pkg.id,
                name: pkg.packageName,
                bookings: pkg._count.bookings,
                revenue: pkg.packagePrice * pkg._count.bookings,
                rating: avgRating,
                views: pkg.viewCount
            }
        })
    } catch (error) {
        console.error('Error fetching popular packages:', error)
        return []
    }
}

export async function getUserGrowth(startDate?: Date, endDate?: Date) {
    await requireAdmin()

    const start = startDate || subMonths(new Date(), 12)
    const end = endDate || new Date()

    try {
        const users = await prisma.user.findMany({
            where: {
                regDate: {
                    gte: start,
                    lte: end
                }
            },
            orderBy: {
                regDate: 'asc'
            }
        })

        // Group by month
        const growthByMonth = users.reduce((acc, user) => {
            const month = format(new Date(user.regDate), 'MMM yyyy')

            if (!acc[month]) {
                acc[month] = { month, newUsers: 0, total: 0 }
            }
            acc[month].newUsers++

            return acc
        }, {} as Record<string, any>)

        // Calculate cumulative total
        let cumulative = 0
        return Object.values(growthByMonth).map((item: any) => {
            cumulative += item.newUsers
            return {
                ...item,
                total: cumulative
            }
        })
    } catch (error) {
        console.error('Error fetching user growth:', error)
        return []
    }
}

export async function getDashboardStats() {
    await requireAdmin()

    try {
        const [
            totalBookings,
            confirmedBookings,
            totalRevenue,
            totalUsers,
            totalPackages,
            pendingReviews
        ] = await Promise.all([
            prisma.booking.count(),
            prisma.booking.count({ where: { status: 1 } }),
            prisma.booking.aggregate({
                where: { status: 1 },
                _sum: { totalAmount: true }
            }),
            prisma.user.count(),
            prisma.tourPackage.count(),
            prisma.review.count({ where: { isApproved: false } })
        ])

        // Calculate total revenue (including old bookings without totalAmount)
        const bookingsWithoutAmount = await prisma.booking.findMany({
            where: {
                status: 1,
                totalAmount: 0
            },
            include: {
                package: {
                    select: { packagePrice: true }
                }
            }
        })

        const additionalRevenue = bookingsWithoutAmount.reduce((sum, b) =>
            sum + (b.package.packagePrice * b.numberOfPeople), 0
        )

        const revenue = Number(totalRevenue._sum.totalAmount || 0) + additionalRevenue

        return {
            totalBookings,
            confirmedBookings,
            totalRevenue: revenue,
            totalUsers,
            totalPackages,
            pendingReviews
        }
    } catch (error) {
        console.error('Error fetching dashboard stats:', error)
        return {
            totalBookings: 0,
            confirmedBookings: 0,
            totalRevenue: 0,
            totalUsers: 0,
            totalPackages: 0,
            pendingReviews: 0
        }
    }
}
