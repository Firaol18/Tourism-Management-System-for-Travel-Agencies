"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CancelBookingButton({ bookingId }: { bookingId: number }) {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    async function handleCancel() {
        if (!confirm('Are you sure you want to cancel this booking?')) return
        setLoading(true)
        try {
            const res = await fetch('/api/user/cancel', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ bookingId }),
            })
            const result = await res.json()
            if (!res.ok) {
                alert(result.error || 'Failed to cancel booking')
            } else {
                // refresh page data
                router.refresh()
            }
        } catch (err) {
            console.error(err)
            alert('Failed to cancel booking')
        } finally {
            setLoading(false)
        }
    }

    return (
        <button onClick={handleCancel} disabled={loading} className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">
            {loading ? 'Cancelling...' : 'Cancel'}
        </button>
    )
}
