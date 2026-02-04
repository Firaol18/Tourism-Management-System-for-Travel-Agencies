'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createIssue } from '@/app/actions/user'

interface IssueFormProps {
    userEmail: string
}

export default function IssueForm({ userEmail }: IssueFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (formData: FormData) => {
        setError('')
        setLoading(true)

        const result = await createIssue(formData)

        if (result?.error) {
            setError(result.error)
            setLoading(false)
        } else {
            // Reset form and refresh page
            const form = document.getElementById('issue-form') as HTMLFormElement
            form?.reset()
            router.refresh()
            setLoading(false)
        }
    }

    return (
        <form id="issue-form" action={handleSubmit} className="space-y-4">
            {error && (
                <div className="rounded-md bg-red-50 p-3 border-l-4 border-red-400">
                    <p className="text-sm text-red-800">{error}</p>
                </div>
            )}

            <div>
                <label htmlFor="issue" className="block text-sm font-medium text-gray-700 mb-1">
                    Issue Title
                </label>
                <input
                    type="text"
                    id="issue"
                    name="issue"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                    placeholder="Brief title for your issue"
                />
            </div>

            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                </label>
                <textarea
                    id="description"
                    name="description"
                    rows={4}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                    placeholder="Describe your issue in detail..."
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white py-3 px-4 rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
                {loading ? 'Submitting...' : 'Submit Issue'}
            </button>
        </form>
    )
}
