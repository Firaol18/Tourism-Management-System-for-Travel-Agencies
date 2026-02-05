"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { StarRating } from "./star-rating"
import { formatDistanceToNow } from "date-fns"
import { User } from "lucide-react"
import Image from "next/image"

interface ReviewCardProps {
    review: {
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
}

export function ReviewCard({ review }: ReviewCardProps) {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                            <User className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                            <p className="font-semibold">{review.user.fullName}</p>
                            <p className="text-sm text-muted-foreground">
                                {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                            </p>
                        </div>
                    </div>
                    <StarRating rating={review.rating} size="sm" />
                </div>
            </CardHeader>
            <CardContent className="space-y-3">
                <h4 className="font-semibold">{review.title}</h4>
                <p className="text-muted-foreground">{review.comment}</p>

                {review.photos && review.photos.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mt-4">
                        {review.photos.map((photo, index) => (
                            <div key={index} className="relative aspect-square rounded-md overflow-hidden">
                                <Image
                                    src={photo}
                                    alt={`Review photo ${index + 1}`}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
