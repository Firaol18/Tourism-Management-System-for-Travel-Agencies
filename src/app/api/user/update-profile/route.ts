import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth-utils'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const ProfileSchema = z.object({
    fullName: z.string().min(1, 'Full Name is required').nullable(),
    mobileNumber: z.string().min(10, 'Valid mobile number is required').nullable(),
})

export async function POST(req: Request) {
    const user = await requireAuth()

    const body = await req.json().catch(() => null)
    if (!body) return NextResponse.json({ error: 'Invalid request' }, { status: 400 })

    // If admin, touch updationDate and return
    if ((user as any).role === 'admin') {
        try {
            await prisma.admin.update({ where: { username: user.email! }, data: { updationDate: new Date() } })
            return NextResponse.json({ success: true })
        } catch (err) {
            console.error('Error updating admin profile (api):', err)
            return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
        }
    }

    const parsed = ProfileSchema.safeParse(body)
    if (!parsed.success) {
        return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
    }

    try {
        await prisma.user.update({
            where: { emailId: user.email! },
            data: {
                fullName: parsed.data.fullName || undefined,
                mobileNumber: parsed.data.mobileNumber || undefined,
            },
        })
        return NextResponse.json({ success: true })
    } catch (err) {
        console.error('Error updating user profile (api):', err)
        return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
    }
}
