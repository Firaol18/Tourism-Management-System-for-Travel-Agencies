'use server'

import { prisma } from '@/lib/db'

interface SearchParams {
    search?: string
    minPrice?: string
    maxPrice?: string
    types?: string
    locations?: string
    sort?: string
    page?: string
}

export async function getPackagesWithFilters(params: SearchParams) {
    const {
        search,
        minPrice,
        maxPrice,
        types,
        locations,
        sort = 'newest',
        page = '1'
    } = params

    const pageSize = 9
    const skip = (parseInt(page) - 1) * pageSize

    // Build where clause
    const where: any = {}

    if (search) {
        where.OR = [
            { packageName: { contains: search, mode: 'insensitive' } },
            { packageLocation: { contains: search, mode: 'insensitive' } },
            { packageType: { contains: search, mode: 'insensitive' } }
        ]
    }

    if (minPrice || maxPrice) {
        where.packagePrice = {}
        if (minPrice) where.packagePrice.gte = parseInt(minPrice)
        if (maxPrice) where.packagePrice.lte = parseInt(maxPrice)
    }

    if (types) {
        const typeArray = types.split(',').filter(Boolean)
        if (typeArray.length > 0) {
            where.packageType = { in: typeArray }
        }
    }

    if (locations) {
        const locationArray = locations.split(',').filter(Boolean)
        if (locationArray.length > 0) {
            where.packageLocation = { in: locationArray }
        }
    }

    // Build orderBy clause
    let orderBy: any = { creationDate: 'desc' }

    switch (sort) {
        case 'price-low':
            orderBy = { packagePrice: 'asc' }
            break
        case 'price-high':
            orderBy = { packagePrice: 'desc' }
            break
        case 'name-asc':
            orderBy = { packageName: 'asc' }
            break
        case 'name-desc':
            orderBy = { packageName: 'desc' }
            break
        case 'popular':
            orderBy = { viewCount: 'desc' }
            break
        default:
            orderBy = { creationDate: 'desc' }
    }

    try {
        const [packages, total] = await Promise.all([
            prisma.tourPackage.findMany({
                where,
                orderBy,
                skip,
                take: pageSize,
                include: {
                    reviews: {
                        where: { isApproved: true },
                        select: { rating: true }
                    },
                    _count: {
                        select: { bookings: true }
                    }
                }
            }),
            prisma.tourPackage.count({ where })
        ])

        // Calculate average rating for each package
        const packagesWithRatings = packages.map(pkg => {
            const avgRating = pkg.reviews.length > 0
                ? pkg.reviews.reduce((sum, r) => sum + r.rating, 0) / pkg.reviews.length
                : 0

            return {
                ...pkg,
                averageRating: avgRating,
                totalReviews: pkg.reviews.length,
                totalBookings: pkg._count.bookings
            }
        })

        return {
            packages: packagesWithRatings,
            total,
            pages: Math.ceil(total / pageSize),
            currentPage: parseInt(page)
        }
    } catch (error) {
        console.error('Error fetching packages:', error)
        return {
            packages: [],
            total: 0,
            pages: 0,
            currentPage: 1
        }
    }
}

export async function getFilterOptions() {
    try {
        const [types, locations, priceRange] = await Promise.all([
            prisma.tourPackage.findMany({
                select: { packageType: true },
                distinct: ['packageType']
            }),
            prisma.tourPackage.findMany({
                select: { packageLocation: true },
                distinct: ['packageLocation']
            }),
            prisma.tourPackage.aggregate({
                _min: { packagePrice: true },
                _max: { packagePrice: true }
            })
        ])

        return {
            types: types.map(t => t.packageType).sort(),
            locations: locations.map(l => l.packageLocation).sort(),
            minPrice: priceRange._min.packagePrice || 0,
            maxPrice: priceRange._max.packagePrice || 10000
        }
    } catch (error) {
        console.error('Error fetching filter options:', error)
        return {
            types: [],
            locations: [],
            minPrice: 0,
            maxPrice: 10000
        }
    }
}
