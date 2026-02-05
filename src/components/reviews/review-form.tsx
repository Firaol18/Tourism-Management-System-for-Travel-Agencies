"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { StarRating } from "./star-rating"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface ReviewFormProps {
    packageId: number
    packageName: string
}

export function ReviewForm({ packageId, packageName }: ReviewFormProps) {
    const router = useRouter()
    const [rating, setRating] = useState(0)
    const [title, setTitle] = useState("")
    const [comment, setComment] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (rating === 0) {
            toast.error("Please select a rating")
            return
        }

        setIsSubmitting(true)

        try {
            const response = await fetch("/api/reviews", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    packageId,
                    rating,
                    title,
                    comment
                })
            })

            if (response.ok) {
                toast.success("Review submitted! It will be visible after admin approval.")
                setRating(0)
                setTitle("")
                setComment("")
                router.refresh()
            } else {
                const data = await response.json()
                toast.error(data.error || "Failed to submit review")
            }
        } catch (error) {
            toast.error("An error occurred. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Write a Review for {packageName}</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label>Your Rating *</Label>
                        <StarRating
                            rating={rating}
                            interactive
                            onRatingChange={setRating}
                            size="lg"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="title">Review Title *</Label>
                        <Input
                            id="title"
                            placeholder="Summarize your experience"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            maxLength={200}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="comment">Your Review *</Label>
                        <Textarea
                            id="comment"
                            placeholder="Share your experience with this package..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            required
                            rows={5}
                            maxLength={1000}
                        />
                        <p className="text-xs text-muted-foreground">
                            {comment.length}/1000 characters
                        </p>
                    </div>

                    <Button type="submit" disabled={isSubmitting} className="w-full">
                        {isSubmitting ? "Submitting..." : "Submit Review"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
