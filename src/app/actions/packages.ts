'use server'

import { prisma } from '@/lib/db'
import { requireAdmin } from '@/lib/auth-utils'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { writeFile, unlink } from 'fs/promises'
import path from 'path'
import { z } from 'zod'

const PackageSchema = z.object({
    packageName: z.string().min(1, 'Package Name is required'),
    packageType: z.string().min(1, 'Package Type is required'),
    packageLocation: z.string().min(1, 'Location is required'),
    packagePrice: z.coerce.number().min(0, 'Price must be a positive number'),
    packageFeatures: z.string().min(1, 'Features are required'),
    packageDetails: z.string().min(1, 'Details are required'),
})

async function saveImage(file: File): Promise<string> {
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Create unique filename
    const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`
    const relativePath = `/images/packages/${filename}`
    const absolutePath = path.join(process.cwd(), 'public', 'images', 'packages', filename)

    await writeFile(absolutePath, buffer)
    return filename
}

export async function createPackage(formData: FormData) {
    await requireAdmin()

    const validatedFields = PackageSchema.safeParse({
        packageName: formData.get('packageName'),
        packageType: formData.get('packageType'),
        packageLocation: formData.get('packageLocation'),
        packagePrice: formData.get('packagePrice'),
        packageFeatures: formData.get('packageFeatures'),
        packageDetails: formData.get('packageDetails'),
    })

    if (!validatedFields.success) {
        return { error: 'Invalid fields', issues: validatedFields.error.issues }
    }

    const imageFile = formData.get('packageImage') as File
    if (!imageFile || imageFile.size === 0) {
        return { error: 'Package Image is required' }
    }

    try {
        const imageName = await saveImage(imageFile)

        await prisma.tourPackage.create({
            data: {
                ...validatedFields.data,
                packageImage: imageName,
            },
        })
    } catch (error) {
        console.error('Error creating package:', error)
        return { error: 'Failed to create package' }
    }

    revalidatePath('/admin/packages')
    redirect('/admin/packages')
}

export async function updatePackage(id: number, formData: FormData) {
    await requireAdmin()

    const validatedFields = PackageSchema.safeParse({
        packageName: formData.get('packageName'),
        packageType: formData.get('packageType'),
        packageLocation: formData.get('packageLocation'),
        packagePrice: formData.get('packagePrice'),
        packageFeatures: formData.get('packageFeatures'),
        packageDetails: formData.get('packageDetails'),
    })

    if (!validatedFields.success) {
        return { error: 'Invalid fields', issues: validatedFields.error.issues }
    }

    try {
        const data: any = { ...validatedFields.data }

        // Handle image update if a new file is provided
        const imageFile = formData.get('packageImage') as File
        if (imageFile && imageFile.size > 0) {
            data.packageImage = await saveImage(imageFile)
        }

        await prisma.tourPackage.update({
            where: { id },
            data,
        })
    } catch (error) {
        console.error('Error updating package:', error)
        return { error: 'Failed to update package' }
    }

    revalidatePath('/admin/packages')
    redirect('/admin/packages')
}

export async function deletePackage(id: number) {
    await requireAdmin()

    try {
        await prisma.tourPackage.delete({
            where: { id },
        })
    } catch (error) {
        console.error('Error deleting package:', error)
        return { error: 'Failed to delete package' }
    }

    revalidatePath('/admin/packages')
}
