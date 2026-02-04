'use client'

import { useState } from 'react'
import { changeAdminPassword } from '@/app/actions/admin'

export default function AdminChangePasswordPage() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    const handleSubmit = async (formData: FormData) => {
        setError('')
        setLoading(true)
        setSuccess(false)

        const result = await changeAdminPassword(formData)

        if (result?.error) {
            setError(result.error)
        } else {
            setSuccess(true)
            // Reset form
            const form = document.getElementById('admin-password-form') as HTMLFormElement
            form?.reset()
        }
        setLoading(false)
    }

    return (
        <div className="p-8 max-w-xl">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Change Admin Password</h1>

            <div className="bg-white rounded-lg shadow-md p-6">
                {success && (
                    <div className="mb-6 bg-green-50 p-4 rounded-md flex items-center">
                        <svg className="h-6 w-6 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <p className="text-green-700 font-medium">Password changed successfully</p>
                    </div>
                )}

                <form id="admin-password-form" action={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="rounded-md bg-red-50 p-4 border-l-4 border-red-400">
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    )}

                    <div>
                        <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                            Current Password
                        </label>
                        <input
                            type="password"
                            id="currentPassword"
                            name="currentPassword"
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                            New Password
                        </label>
                        <input
                            type="password"
                            id="newPassword"
                            name="newPassword"
                            required
                            minLength={6}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                            Confirm New Password
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            required
                            minLength={6}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gray-900 text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Updating...' : 'Change Password'}
                    </button>
                </form>
            </div>
        </div>
    )
}
