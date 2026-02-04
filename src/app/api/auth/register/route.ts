import { NextRequest, NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { prisma } from '@/lib/db'
import { registerSchema } from '@/lib/validations'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        // Validate input
        const validated = registerSchema.parse(body)

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { emailId: validated.emailId },
        })

        if (existingUser) {
            return NextResponse.json(
                { error: 'Email already registered' },
                { status: 400 }
            )
        }

        // Hash password
        const hashedPassword = await hash(validated.password, 12)

        // Create user
        const user = await prisma.user.create({
            data: {
                fullName: validated.fullName,
                mobileNumber: validated.mobileNumber,
                emailId: validated.emailId,
                password: hashedPassword,
            },
        })

        return NextResponse.json(
            {
                success: true,
                message: 'Account created successfully',
                userId: user.id,
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

        console.error('Registration error:', error)
        return NextResponse.json(
            { error: 'An error occurred during registration' },
            { status: 500 }
        )
    }
}
