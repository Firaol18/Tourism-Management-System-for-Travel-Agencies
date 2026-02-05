"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface PopularPackagesChartProps {
    data: Array<{
        id: number
        name: string
        bookings: number
        revenue: number
        rating: number
        views: number
    }>
}

export function PopularPackagesChart({ data }: PopularPackagesChartProps) {
    // Truncate long names for display
    const chartData = data.map(pkg => ({
        ...pkg,
        displayName: pkg.name.length > 20 ? pkg.name.substring(0, 20) + '...' : pkg.name
    }))

    return (
        <Card>
            <CardHeader>
                <CardTitle>Top 10 Popular Packages</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={chartData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" tick={{ fontSize: 12 }} />
                        <YAxis
                            dataKey="displayName"
                            type="category"
                            width={150}
                            tick={{ fontSize: 11 }}
                        />
                        <Tooltip
                            formatter={(value: number, name: string) => {
                                if (name === 'bookings') return [value, 'Bookings']
                                if (name === 'revenue') return [`$${value.toLocaleString()}`, 'Revenue']
                                return [value, name]
                            }}
                        />
                        <Legend />
                        <Bar dataKey="bookings" fill="#3b82f6" name="Bookings" />
                    </BarChart>
                </ResponsiveContainer>

                {/* Detailed Table */}
                <div className="mt-6 overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b">
                                <th className="text-left py-2">Package</th>
                                <th className="text-right py-2">Bookings</th>
                                <th className="text-right py-2">Revenue</th>
                                <th className="text-right py-2">Rating</th>
                                <th className="text-right py-2">Views</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((pkg) => (
                                <tr key={pkg.id} className="border-b">
                                    <td className="py-2">{pkg.name}</td>
                                    <td className="text-right">{pkg.bookings}</td>
                                    <td className="text-right">${pkg.revenue.toLocaleString()}</td>
                                    <td className="text-right">{pkg.rating.toFixed(1)} ⭐</td>
                                    <td className="text-right">{pkg.views}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    )
}
