import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { packageId, rating, title, comment } = body

        // Validate input
        if (!packageId || !rating || !title || !comment) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        if (rating < 1 || rating > 5) {
            return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 })
        }

        // Check if user has already reviewed this package
        const existingReview = await prisma.review.findFirst({
            where: {
                packageId: parseInt(packageId),
                userEmail: session.user.email
            }
        })

        if (existingReview) {
            return NextResponse.json({ error: 'You have already reviewed this package' }, { status: 400 })
        }

        // Check if user has booked this package
        const booking = await prisma.booking.findFirst({
            where: {
                packageId: parseInt(packageId),
                userEmail: session.user.email,
                status: 1 // Only confirmed bookings
            }
        })

        if (!booking) {
            return NextResponse.json({ error: 'You can only review packages you have booked' }, { status: 403 })
        }

        // Create review
        const review = await prisma.review.create({
            data: {
                packageId: parseInt(packageId),
                userEmail: session.user.email,
                rating: parseInt(rating),
                title,
                comment,
                photos: [],
                isApproved: false
            }
        })

        return NextResponse.json({ success: true, review }, { status: 201 })
    } catch (error) {
        console.error('Error creating review:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const packageId = searchParams.get('packageId')

        if (!packageId) {
            return NextResponse.json({ error: 'Package ID required' }, { status: 400 })
        }

        const reviews = await prisma.review.findMany({
            where: {
                packageId: parseInt(packageId),
                isApproved: true
            },
            include: {
                user: {
                    select: {
                        fullName: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        const averageRating = reviews.length > 0
            ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
            : 0

        return NextResponse.json({
            reviews,
            averageRating,
            totalReviews: reviews.length
        })
    } catch (error) {
        console.error('Error fetching reviews:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
