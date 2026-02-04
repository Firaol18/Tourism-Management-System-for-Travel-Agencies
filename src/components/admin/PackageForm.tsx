'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

// Schema matching the server-side validation
const FormSchema = z.object({
    packageName: z.string().min(1, 'Package Name is required'),
    packageType: z.string().min(1, 'Package Type is required'),
    packageLocation: z.string().min(1, 'Location is required'),
    packagePrice: z.coerce.number().min(0, 'Price must be a positive number'),
    packageFeatures: z.string().min(1, 'Features are required'),
    packageDetails: z.string().min(1, 'Details are required'),
})

type FormValues = z.infer<typeof FormSchema>

interface PackageFormProps {
    initialData?: FormValues & { id?: number; packageImage?: string }
    action: (formData: FormData) => Promise<any>
    mode: 'create' | 'edit'
}

export default function PackageForm({ initialData, action, mode }: PackageFormProps) {
    const [error, setError] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [imagePreview, setImagePreview] = useState<string | null>(
        initialData?.packageImage ? `/images/packages/${initialData.packageImage}` : null
    )

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            packageName: initialData?.packageName || '',
            packageType: initialData?.packageType || '',
            packageLocation: initialData?.packageLocation || '',
            packagePrice: initialData?.packagePrice || 0,
            packageFeatures: initialData?.packageFeatures || '',
            packageDetails: initialData?.packageDetails || '',
        },
    })

    const onSubmit = async (data: FormValues) => {
        setIsSubmitting(true)
        setError(null)

        const formData = new FormData()
        Object.entries(data).forEach(([key, value]) => {
            formData.append(key, value.toString())
        })

        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
        if (fileInput?.files?.[0]) {
            formData.append('packageImage', fileInput.files[0])
        }

        // Client-side validation for image on create
        if (mode === 'create' && (!fileInput?.files?.[0])) {
            setError('Package Image is required')
            setIsSubmitting(false)
            return
        }

        try {
            const result = await action(formData)
            if (result?.error) {
                setError(result.error)
                setIsSubmitting(false)
            }
        } catch (e) {
            setError('An unexpected error occurred')
            setIsSubmitting(false)
        }
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 rounded-lg shadow">
            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                    <p className="text-red-700">{error}</p>
                </div>
            )}

            <div className="grid grid-cols-1 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Package Name</label>
                    <input
                        {...register('packageName')}
                        type="text"
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="e.g. Family Package"
                    />
                    {errors.packageName && <p className="mt-1 text-sm text-red-600">{errors.packageName.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Package Type</label>
                    <input
                        {...register('packageType')}
                        type="text"
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="e.g. Family Package / Couple Package"
                    />
                    {errors.packageType && <p className="mt-1 text-sm text-red-600">{errors.packageType.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Package Location</label>
                    <input
                        {...register('packageLocation')}
                        type="text"
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="e.g. Kerala"
                    />
                    {errors.packageLocation && <p className="mt-1 text-sm text-red-600">{errors.packageLocation.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Package Price (USD)</label>
                    <input
                        {...register('packagePrice')}
                        type="number"
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="0"
                    />
                    {errors.packagePrice && <p className="mt-1 text-sm text-red-600">{errors.packagePrice.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Package Features</label>
                    <input
                        {...register('packageFeatures')}
                        type="text"
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="e.g. Free Pickup-drop facility"
                    />
                    {errors.packageFeatures && <p className="mt-1 text-sm text-red-600">{errors.packageFeatures.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Package Details</label>
                    <textarea
                        {...register('packageDetails')}
                        rows={5}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Detailed description..."
                    />
                    {errors.packageDetails && <p className="mt-1 text-sm text-red-600">{errors.packageDetails.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Package Image</label>
                    {imagePreview && (
                        <div className="mb-4 relative w-64 h-40 rounded overflow-hidden border">
                            <Image
                                src={imagePreview}
                                alt="Preview"
                                fill
                                className="object-cover"
                            />
                        </div>
                    )}
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {mode === 'edit' && <p className="text-xs text-gray-500 mt-1">Leave empty to keep existing image</p>}
                </div>
            </div>

            <div className="flex items-center justify-end space-x-4 pt-4 border-t">
                <Link
                    href="/admin/packages"
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                    Cancel
                </Link>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                    {isSubmitting ? 'Saving...' : mode === 'create' ? 'Create' : 'Update'}
                </button>
            </div>
        </form>
    )
}
