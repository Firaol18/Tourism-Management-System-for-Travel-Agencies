'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { enquirySchema } from '@/lib/validations'
import { createEnquiry } from '@/app/actions/public'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

type EnquiryFormData = {
    fullName: string
    emailId: string
    mobileNumber: string
    subject: string
    description: string
}

export default function EnquiryPage() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<EnquiryFormData>({
        resolver: zodResolver(enquirySchema)
    })

    const onSubmit = async (data: EnquiryFormData) => {
        setIsSubmitting(true)
        setError(null)

        try {
            const formData = new FormData()
            Object.entries(data).forEach(([key, value]) => {
                formData.append(key, value)
            })

            const result = await createEnquiry(formData)
            if (result?.error) {
                setError(result.error)
            } else {
                router.push('/thankyou?type=enquiry')
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
            <main>
                <div className="bg-gradient-to-r from-primary to-blue-600 text-white py-16">
                    <div className="container mx-auto px-4">
                        <h1 className="text-4xl font-bold">Enquiry Form</h1>
                        <p className="mt-2 text-lg opacity-90">Send us your questions and we will get back to you soon</p>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-12">
                    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
                        <div className="p-10 border-b bg-gray-50">
                            <h2 className="text-2xl font-bold text-gray-800">Send an Enquiry</h2>
                            <p className="text-gray-500 italic mt-1 font-medium">All fields are required</p>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="p-10 space-y-6">
                            {error && (
                                <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700 animate-fadeIn">
                                    <p className="font-bold">Error</p>
                                    <p>{error}</p>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">Full Name</label>
                                <input
                                    {...register('fullName')}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                                    placeholder="Enter your full name"
                                />
                                {errors.fullName && <p className="mt-1 text-sm text-red-600 font-medium">{errors.fullName.message}</p>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">Email Address</label>
                                    <input
                                        {...register('emailId')}
                                        type="email"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                                        placeholder="email@example.com"
                                    />
                                    {errors.emailId && <p className="mt-1 text-sm text-red-600 font-medium">{errors.emailId.message}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">Mobile Number</label>
                                    <input
                                        {...register('mobileNumber')}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                                        placeholder="1234567890"
                                    />
                                    {errors.mobileNumber && <p className="mt-1 text-sm text-red-600 font-medium">{errors.mobileNumber.message}</p>}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">Subject</label>
                                <input
                                    {...register('subject')}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                                    placeholder="What is this enquiry about?"
                                />
                                {errors.subject && <p className="mt-1 text-sm text-red-600 font-medium">{errors.subject.message}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">Description</label>
                                <textarea
                                    {...register('description')}
                                    rows={5}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                                    placeholder="Detail your question here..."
                                />
                                {errors.description && <p className="mt-1 text-sm text-red-600 font-medium">{errors.description.message}</p>}
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-primary hover:bg-primary/90 text-white font-black py-4 rounded-xl transition-all shadow-xl shadow-primary/20 flex items-center justify-center disabled:opacity-70"
                            >
                                {isSubmitting ? (
                                    <>
                                        <i className="fa fa-spinner fa-spin mr-3"></i>
                                        SENDING...
                                    </>
                                ) : 'SUBMIT ENQUIRY'}
                            </button>
                        </form>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    )
}
