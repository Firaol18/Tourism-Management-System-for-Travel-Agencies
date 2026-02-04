'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterForm() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        const formData = new FormData(e.currentTarget)
        const data = Object.fromEntries(formData.entries())

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })

            const result = await res.json()

            if (!res.ok) {
                setError(result.error || 'Registration failed')
                setLoading(false)
            } else {
                router.push('/thankyou')
            }
        } catch (err) {
            setError('An error occurred. Please try again.')
            setLoading(false)
        }
    }

    return (
        <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-2xl border border-gray-100">
            <h2 className="text-3xl font-black text-center text-gray-800 mb-8 uppercase tracking-widest">
                Create Account
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700 text-sm font-bold">
                        {error}
                    </div>
                )}

                <div>
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-1">
                        Full Name
                    </label>
                    <input
                        type="text"
                        name="fullName"
                        required
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
                        placeholder="Enter your full name"
                    />
                </div>

                <div>
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-1">
                        Mobile Number
                    </label>
                    <input
                        type="tel"
                        name="mobileNumber"
                        required
                        maxLength={10}
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
                        placeholder="10-digit mobile number"
                    />
                </div>

                <div>
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-1">
                        Email Address
                    </label>
                    <input
                        type="email"
                        name="emailId"
                        required
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
                        placeholder="your@email.com"
                    />
                </div>

                <div>
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-1">
                        Password
                    </label>
                    <input
                        type="password"
                        name="password"
                        required
                        minLength={6}
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
                        placeholder="Minimum 6 characters"
                    />
                </div>

                <p className="text-xs text-gray-500 text-center">
                    By registering you agree to our{' '}
                    <Link href="/page/terms" className="text-primary hover:underline">Terms</Link>
                    {' '}and{' '}
                    <Link href="/page/privacy" className="text-primary hover:underline">Privacy Policy</Link>
                </p>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary hover:bg-primary/90 text-white font-black py-4 rounded-xl transition-all shadow-xl shadow-primary/20 uppercase tracking-widest text-sm disabled:opacity-50"
                >
                    {loading ? 'Creating Account...' : 'Create Account'}
                </button>

                <div className="text-center pt-6 border-t">
                    <p className="text-sm text-gray-600 font-medium">
                        Already have an account?{' '}
                        <Link href="/login" className="text-primary font-bold hover:underline">
                            Sign In
                        </Link>
                    </p>
                </div>
            </form>
        </div>
    )
}
