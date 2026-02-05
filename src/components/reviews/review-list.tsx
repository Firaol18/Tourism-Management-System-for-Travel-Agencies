"use client"

import { ReviewCard } from "./review-card"
import { RatingDisplay } from "./star-rating"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Review {
    id: number
    rating: number
    title: string
    comment: string
    photos?: string[]
    createdAt: Date
    user: {
        fullName: string
    }
}

interface ReviewListProps {
    reviews: Review[]
    averageRating: number
    totalReviews: number
}

export function ReviewList({ reviews, averageRating, totalReviews }: ReviewListProps) {
    if (reviews.length === 0) {
        return (
            <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                    No reviews yet. Be the first to review this package!
                </CardContent>
            </Card>
        )
    }

    // Calculate rating distribution
    const ratingDistribution = [5, 4, 3, 2, 1].map(star => ({
        star,
        count: reviews.filter(r => r.rating === star).length,
        percentage: (reviews.filter(r => r.rating === star).length / totalReviews) * 100
    }))

    return (
        <div className="space-y-6">
            {/* Rating Summary */}
            <Card>
                <CardHeader>
                    <CardTitle>Customer Reviews</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Average Rating */}
                        <div className="text-center md:text-left">
                            <div className="text-4xl font-bold mb-2">{averageRating.toFixed(1)}</div>
                            <RatingDisplay rating={averageRating} totalReviews={totalReviews} />
                        </div>

                        {/* Rating Distribution */}
                        <div className="space-y-2">
                            {ratingDistribution.map(({ star, count, percentage }) => (
                                <div key={star} className="flex items-center gap-2">
                                    <span className="text-sm w-12">{star} star</span>
                                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-yellow-400"
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                    <span className="text-sm text-muted-foreground w-12 text-right">
                                        {count}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Individual Reviews */}
            <div className="space-y-4">
                {reviews.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                ))}
            </div>
        </div>
    )
}
