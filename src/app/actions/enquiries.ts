'use server'

import { prisma } from '@/lib/db'
import { requireAdmin } from '@/lib/auth-utils'
import { revalidatePath } from 'next/cache'

export async function markEnquiryAsRead(id: number) {
    await requireAdmin()

    try {
        await prisma.enquiry.update({
            where: { id },
            data: { status: 1 },
        })
    } catch (error) {
        console.error('Error updating enquiry:', error)
        return { error: 'Failed to update enquiry' }
    }

    revalidatePath('/admin/enquiries')
}
