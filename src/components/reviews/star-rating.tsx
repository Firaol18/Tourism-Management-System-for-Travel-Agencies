"use client"

import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface StarRatingProps {
    rating: number
    maxRating?: number
    size?: "sm" | "md" | "lg"
    interactive?: boolean
    onRatingChange?: (rating: number) => void
}

export function StarRating({
    rating,
    maxRating = 5,
    size = "md",
    interactive = false,
    onRatingChange
}: StarRatingProps) {
    const sizeClasses = {
        sm: "h-4 w-4",
        md: "h-5 w-5",
        lg: "h-6 w-6"
    }

    const handleClick = (value: number) => {
        if (interactive && onRatingChange) {
            onRatingChange(value)
        }
    }

    return (
        <div className="flex items-center gap-1">
            {Array.from({ length: maxRating }).map((_, index) => {
                const starValue = index + 1
                const isFilled = starValue <= rating
                const isHalf = starValue - 0.5 === rating

                return (
                    <button
                        key={index}
                        type="button"
                        onClick={() => handleClick(starValue)}
                        disabled={!interactive}
                        className={cn(
                            "transition-colors",
                            interactive && "cursor-pointer hover:scale-110",
                            !interactive && "cursor-default"
                        )}
                    >
                        <Star
                            className={cn(
                                sizeClasses[size],
                                isFilled && "fill-yellow-400 text-yellow-400",
                                !isFilled && "fill-none text-gray-300"
                            )}
                        />
                    </button>
                )
            })}
        </div>
    )
}

interface RatingDisplayProps {
    rating: number
    totalReviews?: number
    showCount?: boolean
}

export function RatingDisplay({
    rating,
    totalReviews = 0,
    showCount = true
}: RatingDisplayProps) {
    return (
        <div className="flex items-center gap-2">
            <StarRating rating={rating} />
            <span className="text-sm font-medium">{rating.toFixed(1)}</span>
            {showCount && totalReviews > 0 && (
                <span className="text-sm text-muted-foreground">
                    ({totalReviews} {totalReviews === 1 ? "review" : "reviews"})
                </span>
            )}
        </div>
    )
}
