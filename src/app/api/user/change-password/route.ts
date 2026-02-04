import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { compare, hash } from 'bcryptjs'
import { changePasswordSchema } from '@/lib/validations'

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user || session.user.role !== 'user') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const body = await request.json()

        // Validate input
        const validated = changePasswordSchema.parse(body)

        // Get user
        const user = await prisma.user.findUnique({
            where: { emailId: session.user.email! },
        })

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            )
        }

        // Verify current password
        const isValid = await compare(validated.currentPassword, user.password)

        if (!isValid) {
            return NextResponse.json(
                { error: 'Current password is incorrect' },
                { status: 400 }
            )
        }

        // Hash new password
        const hashedPassword = await hash(validated.newPassword, 12)

        // Update password
        await prisma.user.update({
            where: { emailId: session.user.email! },
            data: {
                password: hashedPassword,
                updationDate: new Date(),
            },
        })

        return NextResponse.json({
            success: true,
            message: 'Password changed successfully',
        })
    } catch (error: any) {
        if (error.errors) {
            // Zod validation error
            return NextResponse.json(
                { error: error.errors[0].message },
                { status: 400 }
            )
        }

        console.error('Change password error:', error)
        return NextResponse.json(
            { error: 'An error occurred while changing password' },
            { status: 500 }
        )
    }
}
