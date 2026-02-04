'use server'

import { prisma } from '@/lib/db'
import { requireAdmin } from '@/lib/auth-utils'
import { revalidatePath } from 'next/cache'

export async function getPage(type: string) {
    await requireAdmin()
    const page = await prisma.page.findFirst({
        where: { type },
    })
    return page
}

export async function updatePage(type: string, detail: string) {
    await requireAdmin()

    const existingPage = await prisma.page.findFirst({
        where: { type },
    })

    if (existingPage) {
        await prisma.page.update({
            where: { id: existingPage.id },
            data: { detail },
        })
    } else {
        await prisma.page.create({
            data: { type, detail },
        })
    }

    revalidatePath('/admin/pages')
}
