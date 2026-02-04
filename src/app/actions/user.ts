'use server'

import { prisma } from '@/lib/db'
import { requireAuth } from '@/lib/auth-utils'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import bcrypt from 'bcryptjs'

const ProfileSchema = z.object({
    fullName: z.string().min(1, 'Full Name is required'),
    mobileNumber: z.string().min(10, 'Valid mobile number is required'),
})

const IssueSchema = z.object({
    issue: z.string().min(1, 'Issue type is required'),
    description: z.string().min(1, 'Description is required'),
})

const ChangePasswordSchema = z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(6, 'New password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Confirm password is required'),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
})

export async function updateProfile(formData: FormData) {
    const user = await requireAuth()
    // If the logged-in actor is an admin, update the Admin record instead
    if ((user as any).role === 'admin') {
        try {
            await prisma.admin.update({
                where: { username: user.email! },
                data: {
                    // touch updationDate to record change; admin has no name/mobile fields
                    updationDate: new Date(),
                },
            })
        } catch (error) {
            console.error('Error updating admin profile:', error)
            return { error: 'Failed to update profile' }
        }

        revalidatePath('/admin/profile')
        return { success: true }
    }

    const validatedFields = ProfileSchema.safeParse({
        fullName: formData.get('fullName'),
        mobileNumber: formData.get('mobileNumber'),
    })

    if (!validatedFields.success) {
        return { error: 'Invalid fields', issues: validatedFields.error.issues }
    }

    try {
        await prisma.user.update({
            where: { emailId: user.email! },
            data: {
                fullName: validatedFields.data.fullName,
                mobileNumber: validatedFields.data.mobileNumber,
            },
        })
    } catch (error) {
        console.error('Error updating profile:', error)
        return { error: 'Failed to update profile' }
    }

    revalidatePath('/profile')
    return { success: true }
}

export async function createIssue(formData: FormData) {
    const user = await requireAuth()

    const validatedFields = IssueSchema.safeParse({
        issue: formData.get('issue'),
        description: formData.get('description'),
    })

    if (!validatedFields.success) {
        return { error: 'Invalid fields', issues: validatedFields.error.issues }
    }

    try {
        await prisma.issue.create({
            data: {
                userEmail: user.email!,
                issue: validatedFields.data.issue,
                description: validatedFields.data.description,
            },
        })
    } catch (error) {
        console.error('Error creating issue:', error)
        return { error: 'Failed to create issue' }
    }

    revalidatePath('/issues')
    return { success: true } // Don't redirect, stay on page to show list
}

export async function cancelBooking(bookingId: number) {
    const user = await requireAuth()

    try {
        const booking = await prisma.booking.findUnique({
            where: { id: bookingId },
        })

        if (!booking || booking.userEmail !== user.email) {
            return { error: 'Booking not found or unauthorized' }
        }

        if (booking.status === 1) {
            return { error: 'Cannot cancel confirmed booking' }
        }

        await prisma.booking.update({
            where: { id: bookingId },
            data: {
                status: 2,
                cancelledBy: 'u'
            },
        })
    } catch (error) {
        console.error('Error cancelling booking:', error)
        return { error: 'Failed to cancel booking' }
    }

    revalidatePath('/bookings')
}

export async function changePassword(formData: FormData) {
    const user = await requireAuth()

    const validatedFields = ChangePasswordSchema.safeParse({
        currentPassword: formData.get('currentPassword'),
        newPassword: formData.get('newPassword'),
        confirmPassword: formData.get('confirmPassword'),
    })

    if (!validatedFields.success) {
        return { error: validatedFields.error.issues[0].message }
    }

    const { currentPassword, newPassword } = validatedFields.data

    try {
        const dbUser = await prisma.user.findUnique({
            where: { emailId: user.email! }
        })

        if (!dbUser) return { error: 'User not found' }

        const isMatch = await bcrypt.compare(currentPassword, dbUser.password)
        if (!isMatch) {
            return { error: 'Incorrect current password' }
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10)

        await prisma.user.update({
            where: { emailId: user.email! },
            data: { password: hashedPassword }
        })

    } catch (error) {
        console.error('Error changing password:', error)
        return { error: 'Failed to change password' }
    }

    return { success: true }
}
