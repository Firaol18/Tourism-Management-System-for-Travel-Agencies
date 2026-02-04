'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginForm() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        const formData = new FormData(e.currentTarget)
        const emailId = formData.get('emailId')
        const password = formData.get('password')

        try {
            const result = await signIn('user-login', {
                redirect: false,
                emailId,
                password,
            })

            if (result?.error) {
                setError('Invalid email or password')
                setLoading(false)
            } else {
                router.push('/packages')
                router.refresh()
            }
        } catch (err) {
            setError('An error occurred. Please try again.')
            setLoading(false)
        }
    }

    return (
        <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-2xl border border-gray-100">
            <h2 className="text-3xl font-black text-center text-gray-800 mb-8 uppercase tracking-widest">
                Sign In
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700 text-sm font-bold">
                        {error}
                    </div>
                )}

                <div>
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-1">
                        Email Address
                    </label>
                    <input
                        type="email"
                        name="emailId"
                        required
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all relative z-50 pointer-events-auto"
                        placeholder="Enter your email"
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
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all relative z-50 pointer-events-auto"
                        placeholder="••••••••"
                    />
                </div>

                <div className="text-right">
                    <Link href="/forgot-password" title="Forgot Password?" className="text-sm font-bold text-primary hover:underline">
                        Forgot Password?
                    </Link>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary hover:bg-primary/90 text-white font-black py-4 rounded-xl transition-all shadow-xl shadow-primary/20 uppercase tracking-widest text-sm disabled:opacity-50"
                >
                    {loading ? 'Signing In...' : 'Sign In'}
                </button>

                <div className="text-center pt-6 border-t">
                    <p className="text-sm text-gray-600 font-medium">
                        Don't have an account?{' '}
                        <Link href="/register" className="text-primary font-bold hover:underline">
                            Create Account
                        </Link>
                    </p>
                </div>
            </form>
        </div>
    )
}
