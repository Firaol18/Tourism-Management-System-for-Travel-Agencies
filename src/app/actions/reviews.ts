'use server'

import { prisma } from '@/lib/db'
import { requireAuth } from '@/lib/auth-utils'
import { revalidatePath } from 'next/cache'

export async function createReview(data: {
    packageId: number
    rating: number
    title: string
    comment: string
}) {
    const user = await requireAuth()

    try {
        // Check if user has already reviewed this package
        const existingReview = await prisma.review.findFirst({
            where: {
                packageId: data.packageId,
                userEmail: user.email!
            }
        })

        if (existingReview) {
            return { error: 'You have already reviewed this package' }
        }

        // Check if user has booked this package
        const booking = await prisma.booking.findFirst({
            where: {
                packageId: data.packageId,
                userEmail: user.email!,
                status: 1 // Only confirmed bookings
            }
        })

        if (!booking) {
            return { error: 'You can only review packages you have booked' }
        }

        await prisma.review.create({
            data: {
                packageId: data.packageId,
                userEmail: user.email!,
                rating: data.rating,
                title: data.title,
                comment: data.comment,
                photos: [],
                isApproved: false // Requires admin approval
            }
        })

        revalidatePath(`/packages/${data.packageId}`)
        return { success: true }
    } catch (error) {
        console.error('Error creating review:', error)
        return { error: 'Failed to create review' }
    }
}

export async function getPackageReviews(packageId: number) {
    try {
        const reviews = await prisma.review.findMany({
            where: {
                packageId,
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

        return {
            reviews,
            averageRating,
            totalReviews: reviews.length
        }
    } catch (error) {
        console.error('Error fetching reviews:', error)
        return {
            reviews: [],
            averageRating: 0,
            totalReviews: 0
        }
    }
}

export async function approveReview(reviewId: number) {
    const user = await requireAuth()

    if ((user as any).role !== 'admin') {
        return { error: 'Unauthorized' }
    }

    try {
        await prisma.review.update({
            where: { id: reviewId },
            data: { isApproved: true }
        })

        revalidatePath('/admin/reviews')
        return { success: true }
    } catch (error) {
        console.error('Error approving review:', error)
        return { error: 'Failed to approve review' }
    }
}

export async function deleteReview(reviewId: number) {
    const user = await requireAuth()

    if ((user as any).role !== 'admin') {
        return { error: 'Unauthorized' }
    }

    try {
        await prisma.review.delete({
            where: { id: reviewId }
        })

        revalidatePath('/admin/reviews')
        return { success: true }
    } catch (error) {
        console.error('Error deleting review:', error)
        return { error: 'Failed to delete review' }
    }
}
