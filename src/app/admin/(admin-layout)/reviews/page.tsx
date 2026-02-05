import { requireAdmin } from '@/lib/auth-utils'
import { prisma } from '@/lib/db'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { StarRating } from '@/components/reviews/star-rating'
import { formatDistanceToNow } from 'date-fns'
import { Check, X } from 'lucide-react'
import { approveReview, deleteReview } from '@/app/actions/reviews'
import { revalidatePath } from 'next/cache'

export default async function AdminReviewsPage() {
    await requireAdmin()

    const [pendingReviews, approvedReviews] = await Promise.all([
        prisma.review.findMany({
            where: { isApproved: false },
            include: {
                user: { select: { fullName: true, emailId: true } },
                package: { select: { packageName: true } }
            },
            orderBy: { createdAt: 'desc' }
        }),
        prisma.review.findMany({
            where: { isApproved: true },
            include: {
                user: { select: { fullName: true, emailId: true } },
                package: { select: { packageName: true } }
            },
            orderBy: { createdAt: 'desc' },
            take: 20
        })
    ])

    async function handleApprove(reviewId: number) {
        'use server'
        await approveReview(reviewId)
        revalidatePath('/admin/reviews')
    }

    async function handleDelete(reviewId: number) {
        'use server'
        await deleteReview(reviewId)
        revalidatePath('/admin/reviews')
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Review Management</h1>
                <p className="text-muted-foreground">Moderate package reviews</p>
            </div>

            {/* Pending Reviews */}
            <div className="space-y-4">
                <h2 className="text-2xl font-semibold">
                    Pending Reviews ({pendingReviews.length})
                </h2>

                {pendingReviews.length === 0 ? (
                    <Card>
                        <CardContent className="py-8 text-center text-muted-foreground">
                            No pending reviews
                        </CardContent>
                    </Card>
                ) : (
                    pendingReviews.map((review) => (
                        <Card key={review.id}>
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="space-y-1">
                                        <CardTitle className="text-lg">{review.package.packageName}</CardTitle>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <span>{review.user.fullName}</span>
                                            <span>•</span>
                                            <span>{review.user.emailId}</span>
                                            <span>•</span>
                                            <span>{formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}</span>
                                        </div>
                                    </div>
                                    <Badge variant="secondary">Pending</Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <StarRating rating={review.rating} />
                                <div>
                                    <h4 className="font-semibold mb-1">{review.title}</h4>
                                    <p className="text-muted-foreground">{review.comment}</p>
                                </div>
                                <div className="flex gap-2">
                                    <form action={handleApprove.bind(null, review.id)}>
                                        <Button type="submit" size="sm" variant="default">
                                            <Check className="h-4 w-4 mr-1" />
                                            Approve
                                        </Button>
                                    </form>
                                    <form action={handleDelete.bind(null, review.id)}>
                                        <Button type="submit" size="sm" variant="destructive">
                                            <X className="h-4 w-4 mr-1" />
                                            Reject
                                        </Button>
                                    </form>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            {/* Approved Reviews */}
            <div className="space-y-4">
                <h2 className="text-2xl font-semibold">
                    Approved Reviews ({approvedReviews.length})
                </h2>

                {approvedReviews.map((review) => (
                    <Card key={review.id}>
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                    <CardTitle className="text-lg">{review.package.packageName}</CardTitle>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <span>{review.user.fullName}</span>
                                        <span>•</span>
                                        <span>{formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}</span>
                                    </div>
                                </div>
                                <Badge variant="default">Approved</Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <StarRating rating={review.rating} />
                            <div>
                                <h4 className="font-semibold mb-1">{review.title}</h4>
                                <p className="text-muted-foreground">{review.comment}</p>
                            </div>
                            <form action={handleDelete.bind(null, review.id)}>
                                <Button type="submit" size="sm" variant="outline">
                                    <X className="h-4 w-4 mr-1" />
                                    Delete
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
