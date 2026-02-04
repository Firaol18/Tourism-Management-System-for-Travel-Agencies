'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { changePasswordSchema } from '@/lib/validations'
// Use API endpoint instead of calling server action directly from client
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export default function ChangePasswordPage() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(changePasswordSchema)
    })

    const onSubmit = async (data: any) => {
        setIsSubmitting(true)
        setError(null)
        setSuccess(null)

        try {
            try {
                const res = await fetch('/api/user/change-password', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({
                        currentPassword: data.currentPassword,
                        newPassword: data.newPassword,
                        confirmPassword: data.confirmPassword,
                    }),
                })

                const result = await res.json()

                if (!res.ok) {
                    setError(result.error || 'Failed to change password')
                } else {
                    setSuccess(result.message || 'Password changed successfully!')
                    reset()
                }
            } catch (err) {
                setError('Something went wrong. Please try again.')
            }
        } catch (err) {
            setError('Something went wrong. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <>
            <Header />
            <main className="min-h-screen bg-gray-50">
                <div className="bg-gradient-to-r from-primary to-blue-600 text-white py-12">
                    <div className="container mx-auto px-4">
                        <h1 className="text-4xl font-bold">Change Password</h1>
                        <p className="mt-2 text-lg">Keep your account secure</p>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-12">
                    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border">
                        <div className="p-8 bg-gray-50 border-b">
                            <h2 className="text-2xl font-bold text-gray-800">Update Security Credentials</h2>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
                            {error && (
                                <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700 animate-fadeIn">
                                    <p className="font-bold">Error</p>
                                    <p>{error}</p>
                                </div>
                            )}

                            {success && (
                                <div className="bg-green-50 border-l-4 border-green-500 p-4 text-green-700 animate-fadeIn">
                                    <p className="font-bold">Success</p>
                                    <p>{success}</p>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">Current Password</label>
                                <input
                                    {...register('currentPassword')}
                                    type="password"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                                    placeholder="••••••••"
                                />
                                {errors.currentPassword && <p className="mt-1 text-sm text-red-600 font-medium">{(errors.currentPassword as any).message}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">New Password</label>
                                <input
                                    {...register('newPassword')}
                                    type="password"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                                    placeholder="••••••••"
                                />
                                {errors.newPassword && <p className="mt-1 text-sm text-red-600 font-medium">{(errors.newPassword as any).message}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">Confirm New Password</label>
                                <input
                                    {...register('confirmPassword')}
                                    type="password"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                                    placeholder="••••••••"
                                />
                                {errors.confirmPassword && <p className="mt-1 text-sm text-red-600 font-medium">{(errors.confirmPassword as any).message}</p>}
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-primary hover:bg-primary/90 text-white font-black py-4 rounded-xl transition-all shadow-xl shadow-primary/20 flex items-center justify-center disabled:opacity-70"
                            >
                                {isSubmitting ? (
                                    <>
                                        <i className="fa fa-spinner fa-spin mr-3"></i>
                                        UPDATING...
                                    </>
                                ) : 'UPDATE PASSWORD'}
                            </button>
                        </form>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    )
}
