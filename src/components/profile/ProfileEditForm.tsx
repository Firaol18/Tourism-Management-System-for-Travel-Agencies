"use client"

import React, { useState } from 'react'

export default function ProfileEditForm({ userDetails }: { userDetails: { fullName: string, mobileNumber: string, emailId: string } }) {
    const [status, setStatus] = useState<{ type: 'success'|'error', message: string } | null>(null)
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)
        setStatus(null)

        const fd = new FormData(e.currentTarget)
        const payload = {
            fullName: fd.get('fullName') as string | null,
            mobileNumber: fd.get('mobileNumber') as string | null,
        }

        try {
            const res = await fetch('/api/user/update-profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(payload),
            })
            const result = await res.json()
            if (!res.ok) {
                setStatus({ type: 'error', message: result.error || 'Failed to update profile' })
            } else {
                setStatus({ type: 'success', message: 'Profile Updated Successfully' })
            }
        } catch (err) {
            setStatus({ type: 'error', message: 'Failed to update profile' })
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {status && (
                <div className={`p-2.5 mb-5 bg-white border-l-4 shadow-sm ${status.type === 'success' ? 'border-[#5cb85c]' : 'border-[#dd3d36]'}`}>
                    <strong className="uppercase">{status.type === 'success' ? 'SUCCESS' : 'ERROR'}</strong>: {status.message}
                </div>
            )}

            <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input name="fullName" defaultValue={userDetails.fullName} required className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2" />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
                <input name="mobileNumber" defaultValue={userDetails.mobileNumber} required maxLength={10} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2" />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Email Address (Read-only)</label>
                <input value={userDetails.emailId} readOnly className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 bg-gray-100 text-gray-500 cursor-not-allowed" />
            </div>

            <div className="flex items-center justify-end space-x-4 pt-4 border-t">
                <a href="/profile" className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">Cancel</a>
                <button type="submit" disabled={loading} className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90">{loading ? 'Saving...' : 'Save Changes'}</button>
            </div>
        </form>
    )
}
