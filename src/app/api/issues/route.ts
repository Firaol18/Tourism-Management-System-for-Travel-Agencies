import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { issueSchema } from '@/lib/validations'

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user || session.user.role !== 'user') {
            return NextResponse.json(
                { error: 'Unauthorized. Please login to submit issues.' },
                { status: 401 }
            )
        }

        const body = await request.json()

        // Validate input
        const validated = issueSchema.parse(body)

        // Create issue
        const issue = await prisma.issue.create({
            data: {
                userEmail: session.user.email!,
                issue: validated.issue,
                description: validated.description,
            },
        })

        return NextResponse.json(
            {
                success: true,
                message: 'Issue submitted successfully',
                issueId: issue.id,
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

        console.error('Issue creation error:', error)
        return NextResponse.json(
            { error: 'An error occurred while submitting issue' },
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

        // Get user's issues if regular user, all issues if admin
        const issues = await prisma.issue.findMany({
            where: session.user.role === 'admin' ? {} : { userEmail: session.user.email! },
            orderBy: {
                postingDate: 'desc',
            },
        })

        return NextResponse.json({ issues })
    } catch (error) {
        console.error('Get issues error:', error)
        return NextResponse.json(
            { error: 'An error occurred while fetching issues' },
            { status: 500 }
        )
    }
}
