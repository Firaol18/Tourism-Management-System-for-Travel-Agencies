"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface BookingTrendsChartProps {
    data: Array<{
        month: string
        confirmed: number
        pending: number
        cancelled: number
    }>
}

export function BookingTrendsChart({ data }: BookingTrendsChartProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Booking Trends</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="month"
                            tick={{ fontSize: 12 }}
                            angle={-45}
                            textAnchor="end"
                            height={80}
                        />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="confirmed" fill="#22c55e" name="Confirmed" />
                        <Bar dataKey="pending" fill="#eab308" name="Pending" />
                        <Bar dataKey="cancelled" fill="#ef4444" name="Cancelled" />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}
