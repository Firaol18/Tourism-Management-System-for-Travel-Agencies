import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { bookingSchema } from '@/lib/validations'

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user || session.user.role !== 'user') {
            return NextResponse.json(
                { error: 'Unauthorized. Please login to book.' },
                { status: 401 }
            )
        }

        const body = await request.json()

        // Validate input
        const validated = bookingSchema.parse(body)

        // Check if package exists
        const packageExists = await prisma.tourPackage.findUnique({
            where: { id: validated.packageId },
        })

        if (!packageExists) {
            return NextResponse.json(
                { error: 'Package not found' },
                { status: 404 }
            )
        }

        // Validate dates
        const fromDate = new Date(validated.fromDate)
        const toDate = new Date(validated.toDate)
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        if (fromDate < today) {
            return NextResponse.json(
                { error: 'From date cannot be in the past' },
                { status: 400 }
            )
        }

        if (toDate <= fromDate) {
            return NextResponse.json(
                { error: 'To date must be after from date' },
                { status: 400 }
            )
        }

        // Create booking
        const booking = await prisma.booking.create({
            data: {
                packageId: validated.packageId,
                userEmail: session.user.email!,
                fromDate: validated.fromDate,
                toDate: validated.toDate,
                comment: validated.comment || '',
                status: 0, // Pending
            },
        })

        return NextResponse.json(
            {
                success: true,
                message: 'Booking created successfully',
                bookingId: booking.id,
            },
            { status: 201 }
        )
    } catch (error: any) {
        if (error.errors) {
            // Zod validation error
            return NextResponse.json(
                { error: error.errors[0].message },
                { status: 400 }
            )
        }

        console.error('Booking error:', error)
        return NextResponse.json(
            { error: 'An error occurred while creating booking' },
            { status: 500 }
        )
    }
}

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        // Get user's bookings if regular user, all bookings if admin
        const bookings = await prisma.booking.findMany({
            where: session.user.role === 'admin' ? {} : { userEmail: session.user.email! },
            include: {
                package: true,
            },
            orderBy: {
                regDate: 'desc',
            },
        })

        return NextResponse.json({ bookings })
    } catch (error) {
        console.error('Get bookings error:', error)
        return NextResponse.json(
            { error: 'An error occurred while fetching bookings' },
            { status: 500 }
        )
    }
}
