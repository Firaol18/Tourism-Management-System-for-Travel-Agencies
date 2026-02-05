"use client"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useRouter, useSearchParams } from "next/navigation"

export function SortDropdown() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const currentSort = searchParams.get("sort") || "newest"

    const handleSortChange = (value: string) => {
        const params = new URLSearchParams(searchParams)
        if (value === "newest") {
            params.delete("sort")
        } else {
            params.set("sort", value)
        }
        router.push(`?${params.toString()}`)
    }

    return (
        <Select value={currentSort} onValueChange={handleSortChange}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="name-asc">Name: A to Z</SelectItem>
                <SelectItem value="name-desc">Name: Z to A</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
            </SelectContent>
        </Select>
    )
}
