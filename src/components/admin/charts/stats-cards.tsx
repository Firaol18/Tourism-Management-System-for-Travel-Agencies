"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Users, Package, Calendar, Star, AlertCircle } from "lucide-react"

interface StatsCardsProps {
    stats: {
        totalBookings: number
        confirmedBookings: number
        totalRevenue: number
        totalUsers: number
        totalPackages: number
        pendingReviews: number
    }
}

export function StatsCards({ stats }: StatsCardsProps) {
    const cards = [
        {
            title: "Total Revenue",
            value: `$${stats.totalRevenue.toLocaleString()}`,
            icon: DollarSign,
            color: "text-green-600",
            bgColor: "bg-green-100"
        },
        {
            title: "Total Bookings",
            value: stats.totalBookings.toLocaleString(),
            subtitle: `${stats.confirmedBookings} confirmed`,
            icon: Calendar,
            color: "text-blue-600",
            bgColor: "bg-blue-100"
        },
        {
            title: "Total Users",
            value: stats.totalUsers.toLocaleString(),
            icon: Users,
            color: "text-purple-600",
            bgColor: "bg-purple-100"
        },
        {
            title: "Total Packages",
            value: stats.totalPackages.toLocaleString(),
            icon: Package,
            color: "text-orange-600",
            bgColor: "bg-orange-100"
        },
        {
            title: "Pending Reviews",
            value: stats.pendingReviews.toLocaleString(),
            icon: AlertCircle,
            color: "text-yellow-600",
            bgColor: "bg-yellow-100"
        }
    ]

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {cards.map((card, index) => (
                <Card key={index}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            {card.title}
                        </CardTitle>
                        <div className={`${card.bgColor} p-2 rounded-full`}>
                            <card.icon className={`h-4 w-4 ${card.color}`} />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{card.value}</div>
                        {card.subtitle && (
                            <p className="text-xs text-muted-foreground mt-1">
                                {card.subtitle}
                            </p>
                        )}
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
