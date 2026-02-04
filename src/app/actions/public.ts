'use server'

import { prisma } from '@/lib/db'
import { z } from 'zod'
import { redirect } from 'next/navigation'

const EnquirySchema = z.object({
    fullName: z.string().min(1, 'Full Name is required'),
    emailId: z.string().email('Invalid email address'),
    mobileNumber: z.string().min(10, 'Valid mobile number is required'),
    subject: z.string().min(1, 'Subject is required'),
    description: z.string().min(1, 'Description is required'),
})

const ResetPasswordSchema = z.object({
    email: z.string().email('Invalid email address'),
    mobileNumber: z.string().min(10, 'Valid mobile number is required'),
    newPassword: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Confirm password is required'),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
})

export async function checkEmailAvailability(email: string) {
    const user = await prisma.user.findUnique({
        where: { emailId: email },
    })
    return { exists: !!user }
}

export async function resetPassword(formData: FormData) {
    const validatedFields = ResetPasswordSchema.safeParse({
        email: formData.get('email'),
        mobileNumber: formData.get('mobileNumber'),
        newPassword: formData.get('newPassword'),
        confirmPassword: formData.get('confirmPassword'),
    })

    if (!validatedFields.success) {
        return { error: 'Invalid fields', issues: validatedFields.error.issues }
    }

    const { email, mobileNumber, newPassword } = validatedFields.data

    try {
        const user = await prisma.user.findFirst({
            where: {
                emailId: email,
                mobileNumber: mobileNumber
            },
        })

        if (!user) {
            return { error: 'Invalid Email or Mobile Number' }
        }

        const hashedPassword = await import('bcryptjs').then(m => m.hash(newPassword, 10))

        await prisma.user.update({
            where: { id: user.id },
            data: { password: hashedPassword },
        })

    } catch (error) {
        console.error('Error resetting password:', error)
        return { error: 'Failed to reset password' }
    }

    return { success: true }
}

export async function createEnquiry(formData: FormData) {
    const validatedFields = EnquirySchema.safeParse({
        fullName: formData.get('fullName'),
        emailId: formData.get('email'),
        mobileNumber: formData.get('mobileNumber'),
        subject: formData.get('subject'),
        description: formData.get('description'),
    })

    if (!validatedFields.success) {
        return { error: 'Invalid fields', issues: validatedFields.error.issues }
    }

    try {
        await prisma.enquiry.create({
            data: {
                ...validatedFields.data,
                status: 0, // Pending
            },
        })
    } catch (error) {
        console.error('Error creating enquiry:', error)
        return { error: 'Failed to submit enquiry' }
    }

    return { success: true }
}
