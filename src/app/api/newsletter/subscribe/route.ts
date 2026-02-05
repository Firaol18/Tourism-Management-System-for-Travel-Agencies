import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { email } = body

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 })
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
        }

        // Check if already subscribed
        const existing = await prisma.newsletter.findUnique({
            where: { email }
        })

        if (existing) {
            if (existing.isActive) {
                return NextResponse.json({ error: 'Email already subscribed' }, { status: 400 })
            } else {
                // Reactivate subscription
                await prisma.newsletter.update({
                    where: { email },
                    data: { isActive: true }
                })
                return NextResponse.json({ success: true, message: 'Subscription reactivated' })
            }
        }

        // Create new subscription
        await prisma.newsletter.create({
            data: { email }
        })

        return NextResponse.json({ success: true, message: 'Successfully subscribed' }, { status: 201 })
    } catch (error) {
        console.error('Error subscribing to newsletter:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
