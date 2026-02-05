import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

export function PackageSkeleton() {
    return (
        <Card className="overflow-hidden">
            <Skeleton className="h-48 w-full rounded-none" />
            <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2 mt-2" />
            </CardHeader>
            <CardContent>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full mt-2" />
                <Skeleton className="h-4 w-2/3 mt-2" />
            </CardContent>
            <CardFooter className="flex justify-between">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-10 w-24" />
            </CardFooter>
        </Card>
    )
}

export function PackageListSkeleton({ count = 6 }: { count?: number }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: count }).map((_, i) => (
                <PackageSkeleton key={i} />
            ))}
        </div>
    )
}
