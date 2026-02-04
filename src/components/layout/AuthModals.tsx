'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface ModalProps {
    isOpen: boolean
    onClose: () => void
}

interface AuthModalProps extends ModalProps {
    onSwitchToSignUp?: () => void
    onSwitchToSignIn?: () => void
}

export function SignInModal({ isOpen, onClose }: AuthModalProps) {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    if (!isOpen) return null

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        const result = await signIn('user-login', {
            redirect: false,
            emailId: email,
            password: password,
        })

        if (result?.error) {
            setError('Invalid Details')
            setLoading(false)
        } else {
            onClose()
            router.push('/packages')
            router.refresh()
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 pointer-events-none">
            <div className="bg-white w-full max-w-2xl rounded-sm overflow-hidden relative animate-in fade-in zoom-in duration-200 z-[9999] pointer-events-auto">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-2xl text-gray-400 hover:text-gray-600 z-10"
                >
                    &times;
                </button>

                <div className="p-8">
                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Login Left */}
                        <div className="w-full md:w-[42%] flex flex-col justify-center border-b md:border-b-0 md:border-r border-gray-100 pb-8 md:pb-0 md:pr-8">
                            <ul className="space-y-4">
                                <li>
                                    <a href="#" className="flex items-center justify-center gap-2 bg-[#3b5998] text-white py-3 px-4 hover:opacity-80 transition-opacity rounded-sm">
                                        <i className="fa fa-facebook"></i> Facebook
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="flex items-center justify-center gap-2 bg-[#dc4e41] text-white py-3 px-4 hover:opacity-80 transition-opacity rounded-sm">
                                        <i className="fa fa-google"></i> Google
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* Login Right */}
                        <div className="w-full md:w-[51%]">
                            <form onSubmit={handleSubmit}>
                                <h3 className="text-tms-green text-lg font-normal mb-4">Signin with your account</h3>
                                {error && (
                                    <p className="text-red-500 text-sm mb-4">{error}</p>
                                )}
                                <div className="space-y-4">
                                    <input
                                        type="text"
                                        placeholder="Enter your Email"
                                        required
                                        className="w-full p-2.5 border border-gray-200 outline-none text-sm"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                    <input
                                        type="password"
                                        placeholder="Password"
                                        required
                                        className="w-full p-2.5 border border-gray-200 outline-none text-sm"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <div className="mt-4">
                                        <Link href="/forgot-password" className="text-tms-green text-xs hover:underline ml-0" onClick={onClose}>
                                            Forgot password
                                        </Link>
                                    </div>
                                    <input
                                        type="submit"
                                        value={loading ? "SIGNING IN..." : "SIGNIN"}
                                        disabled={loading}
                                        className="w-full mt-4 bg-tms-green text-white text-xl py-2.5 cursor-pointer hover:bg-tms-blue transition-colors disabled:opacity-50"
                                    />
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="mt-8 pt-4 border-t border-gray-100">
                        <p className="text-[#A9A8A8] text-xs leading-relaxed">
                            By logging in you agree to our <Link href="/page/terms" className="text-tms-green hover:underline" onClick={onClose}>Terms and Conditions</Link> and <Link href="/page/privacy" className="text-tms-green hover:underline" onClick={onClose}>Privacy Policy</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export function SignUpModal({ isOpen, onClose }: AuthModalProps) {
    const router = useRouter()
    const [formData, setFormData] = useState({
        fullName: '',
        mobileNumber: '',
        emailId: '',
        password: '',
    })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    if (!isOpen) return null

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })

            const result = await res.json()

            if (!res.ok) {
                setError(result.error || 'Something went wrong')
                setLoading(false)
            } else {
                onClose()
                router.push('/thankyou')
            }
        } catch (err) {
            setError('An error occurred. Please try again.')
            setLoading(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 pointer-events-none">
            <div className="bg-white w-full max-w-2xl rounded-sm overflow-hidden relative animate-in fade-in zoom-in duration-200 z-[9999] pointer-events-auto">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-2xl text-gray-400 hover:text-gray-600 z-10"
                >
                    &times;
                </button>

                <div className="p-8">
                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Login Left */}
                        <div className="w-full md:w-[42%] flex flex-col justify-center border-b md:border-b-0 md:border-r border-gray-100 pb-8 md:pb-0 md:pr-8">
                            <ul className="space-y-4">
                                <li>
                                    <a href="#" className="flex items-center justify-center gap-2 bg-[#3b5998] text-white py-3 px-4 hover:opacity-80 transition-opacity rounded-sm">
                                        <i className="fa fa-facebook"></i> Facebook
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="flex items-center justify-center gap-2 bg-[#dc4e41] text-white py-3 px-4 hover:opacity-80 transition-opacity rounded-sm">
                                        <i className="fa fa-google"></i> Google
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* Login Right */}
                        <div className="w-full md:w-[51%]">
                            <form onSubmit={handleSubmit}>
                                <h3 className="text-tms-green text-lg font-normal mb-1">Create your account</h3>
                                {error && (
                                    <p className="text-red-500 text-sm mb-2">{error}</p>
                                )}
                                <div className="space-y-4">
                                    <input
                                        type="text"
                                        name="fullName"
                                        placeholder="Full Name"
                                        required
                                        className="w-full p-2.5 border border-gray-200 outline-none text-sm"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                    />
                                    <input
                                        type="text"
                                        name="mobileNumber"
                                        placeholder="Mobile number"
                                        maxLength={10}
                                        required
                                        className="w-full p-2.5 border border-gray-200 outline-none text-sm"
                                        value={formData.mobileNumber}
                                        onChange={handleChange}
                                    />
                                    <input
                                        type="email"
                                        name="emailId"
                                        placeholder="Email id"
                                        required
                                        className="w-full p-2.5 border border-gray-200 outline-none text-sm"
                                        value={formData.emailId}
                                        onChange={handleChange}
                                    />
                                    <input
                                        type="password"
                                        name="password"
                                        placeholder="Password"
                                        required
                                        className="w-full p-2.5 border border-gray-200 outline-none text-sm"
                                        value={formData.password}
                                        onChange={handleChange}
                                    />
                                    <input
                                        type="submit"
                                        value={loading ? "CREATING..." : "CREATE ACCOUNT"}
                                        disabled={loading}
                                        className="w-full mt-4 bg-tms-green text-white text-xl py-2.5 cursor-pointer hover:bg-tms-blue transition-colors disabled:opacity-50"
                                    />
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="mt-8 pt-4 border-t border-gray-100">
                        <p className="text-[#A9A8A8] text-xs leading-relaxed">
                            By logging in you agree to our <Link href="/page/terms" className="text-tms-green hover:underline" onClick={onClose}>Terms and Conditions</Link> and <Link href="/page/privacy" className="text-tms-green hover:underline" onClick={onClose}>Privacy Policy</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
