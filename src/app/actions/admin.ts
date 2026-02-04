'use server'

import { prisma } from '@/lib/db'
import { requireAdmin } from '@/lib/auth-utils'
import { z } from 'zod'
import bcrypt from 'bcryptjs'

const ChangePasswordSchema = z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(1, 'New password is required'),
    confirmPassword: z.string().min(1, 'Confirm password is required'),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
})

export async function changeAdminPassword(formData: FormData) {
    const user = await requireAdmin()

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
        // Determine which admin table/column to use.
        // Based on schema.prisma: model Admin { username, password } using map("admin")
        // auth-utils requireAdmin fetches from 'admin' table.

        const admin = await prisma.admin.findUnique({
            where: { username: user.name! },
        })

        if (!admin) {
            return { error: 'Admin not found' }
        }

        // In the PHP app, it might not use bcrypt for admin?
        // Let's check check-admin.js or similar to see how admin password was verified initially.
        // The previous context "create-admin.js" used bcrypt.hash.
        // So we assume bcrypt.

        const isMatch = await bcrypt.compare(currentPassword, admin.password)
        if (!isMatch) {
            return { error: 'Incorrect current password' }
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10)

        await prisma.admin.update({
            where: { id: admin.id },
            data: { password: hashedPassword },
        })

    } catch (error) {
        console.error('Error changing admin password:', error)
        return { error: 'Failed to change password' }
    }

    return { success: true }
}
