'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { updatePage } from '@/app/actions/pages'

const PAGE_TYPES = [
    { value: 'terms', label: 'Terms and Conditions' },
    { value: 'privacy', label: 'Privacy And Policy' },
    { value: 'aboutus', label: 'About US' },
    { value: 'contact', label: 'Contact Us' },
]

interface PageEditorProps {
    initialContent: string
    initialType: string
}

export default function PageEditor({ initialContent, initialType }: PageEditorProps) {
    const router = useRouter()
    const [content, setContent] = useState(initialContent)
    const [isSaving, setIsSaving] = useState(false)
    const [message, setMessage] = useState('')

    // Update local state when prop changes (loading new page type)
    useEffect(() => {
        setContent(initialContent)
        setMessage('')
    }, [initialContent, initialType])

    const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const type = e.target.value
        if (type) {
            router.push(`/admin/pages?type=${type}`)
        } else {
            router.push('/admin/pages')
        }
    }

    const handleSave = async () => {
        if (!initialType) return

        setIsSaving(true)
        setMessage('')

        try {
            await updatePage(initialType, content)
            setMessage('Page data updated successfully')
        } catch (error) {
            setMessage('Error updating page')
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Page
                </label>
                <select
                    value={initialType}
                    onChange={handleTypeChange}
                    className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                    <option value="">***Select One***</option>
                    {PAGE_TYPES.map((type) => (
                        <option key={type.value} value={type.value}>
                            {type.label}
                        </option>
                    ))}
                </select>
            </div>

            {initialType && (
                <>
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Page Details
                        </label>
                        <div className="mb-2 text-sm text-gray-500">
                            Selected Page: <span className="font-semibold text-gray-900">{PAGE_TYPES.find(t => t.value === initialType)?.label}</span>
                        </div>
                        <textarea
                            rows={10}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono text-sm"
                            placeholder="Enter page content here..."
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90 disabled:opacity-50 transition-colors"
                        >
                            {isSaving ? 'Updating...' : 'Update'}
                        </button>
                        {message && (
                            <span className={`text-sm ${message.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>
                                {message}
                            </span>
                        )}
                    </div>
                </>
            )}
        </div>
    )
}
