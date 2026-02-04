'use client'

import { useState } from 'react'
import { formatDate } from '@/lib/utils'

interface ProfileFormProps {
    userDetails: {
        fullName: string
        emailId: string
        mobileNumber: string
        regDate: Date
        updationDate: Date | null
    }
}

export default function ProfileForm({ userDetails }: ProfileFormProps) {
    const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null)
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)
        setStatus(null)

        try {
            const form = e.currentTarget
            const fd = new FormData(form)
            const payload = {
                fullName: fd.get('fullName') as string | null,
                mobileNumber: fd.get('mobileNumber') as string | null,
            }

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
        <form onSubmit={handleSubmit} className="space-y-4">
            {status && (
                <div className={`p-2.5 mb-5 bg-white border-l-4 shadow-sm ${status.type === 'success'
                    ? 'border-[#5cb85c]'
                    : 'border-[#dd3d36]'
                    }`}>
                    <strong className="uppercase">{status.type === 'success' ? 'SUCCESS' : 'ERROR'}</strong>: {status.message}
                </div>
            )}

            <div className="space-y-4 max-w-[350px]">
                <div>
                    <b className="block mb-1">Name</b>
                    <input
                        type="text"
                        name="fullName"
                        defaultValue={userDetails.fullName}
                        required
                        className="w-full p-2 border border-gray-200 outline-none text-sm"
                    />
                </div>

                <div>
                    <b className="block mb-1">Mobile Number</b>
                    <input
                        type="tel"
                        name="mobileNumber"
                        defaultValue={userDetails.mobileNumber}
                        required
                        maxLength={10}
                        className="w-full p-2 border border-gray-200 outline-none text-sm"
                    />
                </div>

                <div>
                    <b className="block mb-1">Email Id</b>
                    <input
                        type="email"
                        value={userDetails.emailId}
                        readOnly
                        className="w-full p-2 border border-gray-200 bg-gray-50 outline-none text-sm cursor-default"
                    />
                </div>

                <div>
                    <b className="block mb-1">Last Updation Date : </b>
                    <span className="text-sm">{userDetails.updationDate ? formatDate(userDetails.updationDate) : '0000-00-00 00:00:00'}</span>
                </div>

                <div>
                    <b className="block mb-1">Reg Date :</b>
                    <span className="text-sm">{formatDate(userDetails.regDate)}</span>
                </div>

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-tms-blue text-white py-1.5 px-3 rounded-md text-sm hover:bg-tms-green transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Updating...' : 'Updtae'}
                    </button>
                </div>
            </div>
        </form>
    )
}
