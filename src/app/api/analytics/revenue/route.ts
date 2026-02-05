import { NextResponse } from 'next/server'
import { getRevenueData } from '@/app/actions/analytics'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const from = searchParams.get('from')
        const to = searchParams.get('to')

        const startDate = from ? new Date(from) : undefined
        const endDate = to ? new Date(to) : undefined

        const data = await getRevenueData(startDate, endDate)
        return NextResponse.json(data)
    } catch (error) {
        console.error('Error in revenue API:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
