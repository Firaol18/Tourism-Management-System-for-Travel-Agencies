'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { bookingSchema } from '@/lib/validations'

interface BookingFormProps {
    packageId: number
    userEmail: string
}

export default function BookingForm({ packageId, userEmail }: BookingFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        const formData = new FormData(e.currentTarget)
        const data = {
            packageId,
            fromDate: formData.get('fromDate') as string,
            toDate: formData.get('toDate') as string,
            comment: formData.get('comment') as string,
        }

        try {
            // Validate with Zod
            const validated = bookingSchema.parse(data)

            const response = await fetch('/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(validated),
            })

            const result = await response.json()

            if (!response.ok) {
                setError(result.error || 'Booking failed')
            } else {
                setSuccess(true)
                setTimeout(() => {
                    router.push('/bookings')
                }, 2000)
            }
        } catch (err: any) {
            if (err.errors) {
                setError(err.errors[0].message)
            } else {
                setError('An error occurred. Please try again.')
            }
        } finally {
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                <svg
                    className="mx-auto h-12 w-12 text-green-600 mb-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                    />
                </svg>
                <h4 className="text-lg font-semibold text-green-900 mb-2">Booking Successful!</h4>
                <p className="text-sm text-green-700">Redirecting to your bookings...</p>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <div className="rounded-md bg-red-50 p-3 border-l-4 border-red-400">
                    <p className="text-sm text-red-800">{error}</p>
                </div>
            )}

            <div>
                <label htmlFor="fromDate" className="block text-sm font-medium text-gray-700 mb-1">
                    From Date
                </label>
                <input
                    type="date"
                    id="fromDate"
                    name="fromDate"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                />
            </div>

            <div>
                <label htmlFor="toDate" className="block text-sm font-medium text-gray-700 mb-1">
                    To Date
                </label>
                <input
                    type="date"
                    id="toDate"
                    name="toDate"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                />
            </div>

            <div>
                <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
                    Comment (Optional)
                </label>
                <textarea
                    id="comment"
                    name="comment"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                    placeholder="Any special requests or comments..."
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white py-3 px-4 rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
                {loading ? 'Processing...' : 'Book Now'}
            </button>

            <p className="text-xs text-gray-500 text-center">
                By booking, you agree to our terms and conditions
            </p>
        </form>
    )
}
