"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface FilterSidebarProps {
    minPrice?: number
    maxPrice?: number
    packageTypes?: string[]
    locations?: string[]
}

export function FilterSidebar({
    minPrice = 0,
    maxPrice = 10000,
    packageTypes = [],
    locations = []
}: FilterSidebarProps) {
    const router = useRouter()
    const searchParams = useSearchParams()

    const [priceRange, setPriceRange] = useState<[number, number]>([
        Number(searchParams.get("minPrice")) || minPrice,
        Number(searchParams.get("maxPrice")) || maxPrice
    ])

    const [selectedTypes, setSelectedTypes] = useState<string[]>(
        searchParams.get("types")?.split(",").filter(Boolean) || []
    )

    const [selectedLocations, setSelectedLocations] = useState<string[]>(
        searchParams.get("locations")?.split(",").filter(Boolean) || []
    )

    const applyFilters = () => {
        const params = new URLSearchParams(searchParams)

        if (priceRange[0] > minPrice) {
            params.set("minPrice", priceRange[0].toString())
        } else {
            params.delete("minPrice")
        }

        if (priceRange[1] < maxPrice) {
            params.set("maxPrice", priceRange[1].toString())
        } else {
            params.delete("maxPrice")
        }

        if (selectedTypes.length > 0) {
            params.set("types", selectedTypes.join(","))
        } else {
            params.delete("types")
        }

        if (selectedLocations.length > 0) {
            params.set("locations", selectedLocations.join(","))
        } else {
            params.delete("locations")
        }

        params.delete("page") // Reset to first page
        router.push(`?${params.toString()}`)
    }

    const clearFilters = () => {
        setPriceRange([minPrice, maxPrice])
        setSelectedTypes([])
        setSelectedLocations([])
        router.push("/packages")
    }

    const hasActiveFilters =
        priceRange[0] > minPrice ||
        priceRange[1] < maxPrice ||
        selectedTypes.length > 0 ||
        selectedLocations.length > 0

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>Filters</CardTitle>
                    {hasActiveFilters && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearFilters}
                            className="h-8 px-2"
                        >
                            <X className="h-4 w-4 mr-1" />
                            Clear
                        </Button>
                    )}
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Price Range */}
                <div className="space-y-4">
                    <Label>Price Range</Label>
                    <Slider
                        min={minPrice}
                        max={maxPrice}
                        step={100}
                        value={priceRange}
                        onValueChange={setPriceRange}
                        className="w-full"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                        <span>${priceRange[0]}</span>
                        <span>${priceRange[1]}</span>
                    </div>
                </div>

                {/* Package Types */}
                {packageTypes.length > 0 && (
                    <div className="space-y-3">
                        <Label>Package Type</Label>
                        {packageTypes.map((type) => (
                            <div key={type} className="flex items-center space-x-2">
                                <Checkbox
                                    id={`type-${type}`}
                                    checked={selectedTypes.includes(type)}
                                    onCheckedChange={(checked) => {
                                        if (checked) {
                                            setSelectedTypes([...selectedTypes, type])
                                        } else {
                                            setSelectedTypes(selectedTypes.filter(t => t !== type))
                                        }
                                    }}
                                />
                                <label
                                    htmlFor={`type-${type}`}
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                >
                                    {type}
                                </label>
                            </div>
                        ))}
                    </div>
                )}

                {/* Locations */}
                {locations.length > 0 && (
                    <div className="space-y-3">
                        <Label>Location</Label>
                        {locations.map((location) => (
                            <div key={location} className="flex items-center space-x-2">
                                <Checkbox
                                    id={`location-${location}`}
                                    checked={selectedLocations.includes(location)}
                                    onCheckedChange={(checked) => {
                                        if (checked) {
                                            setSelectedLocations([...selectedLocations, location])
                                        } else {
                                            setSelectedLocations(selectedLocations.filter(l => l !== location))
                                        }
                                    }}
                                />
                                <label
                                    htmlFor={`location-${location}`}
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                >
                                    {location}
                                </label>
                            </div>
                        ))}
                    </div>
                )}

                <Button onClick={applyFilters} className="w-full">
                    Apply Filters
                </Button>
            </CardContent>
        </Card>
    )
}
