import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const bookingId = Number(body.bookingId)
    if (!bookingId) return NextResponse.json({ error: 'Invalid booking id' }, { status: 400 })

    try {
        const booking = await prisma.booking.findUnique({ where: { id: bookingId } })
        if (!booking || booking.userEmail !== session.user.email) {
            return NextResponse.json({ error: 'Booking not found or unauthorized' }, { status: 404 })
        }

        if (booking.status === 1) {
            return NextResponse.json({ error: 'Cannot cancel confirmed booking' }, { status: 400 })
        }

        await prisma.booking.update({ where: { id: bookingId }, data: { status: 2, cancelledBy: 'u' } })

        return NextResponse.json({ success: true })
    } catch (err) {
        console.error('Cancel booking error:', err)
        return NextResponse.json({ error: 'Failed to cancel booking' }, { status: 500 })
    }
}
