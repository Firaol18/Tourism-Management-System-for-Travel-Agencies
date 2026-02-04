import Link from 'next/link'
import { Suspense } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

function ThankYouContent() {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-lg w-full text-center border">
                <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                    <i className="fa fa-check text-5xl"></i>
                </div>
                <h1 className="text-4xl font-black text-gray-800 mb-4 uppercase tracking-tighter">Request Received!</h1>
                <p className="text-gray-600 text-lg mb-10 font-medium leading-relaxed">
                    Thank you for reaching out! Your submission has been securely processed and is currently being reviewed by our travel experts.
                </p>
                <div className="space-y-4">
                    <Link
                        href="/"
                        className="block w-full bg-primary hover:bg-primary/90 text-white font-black py-4 rounded-xl transition-all shadow-xl shadow-primary/20 tracking-widest uppercase text-sm"
                    >
                        Back to Home
                    </Link>
                    <Link
                        href="/packages"
                        className="block w-full bg-gray-50 hover:bg-gray-100 text-gray-700 font-black py-4 rounded-xl transition-all border tracking-widest uppercase text-sm"
                    >
                        Browse Packages
                    </Link>
                </div>
                <p className="mt-8 text-xs text-gray-400 font-bold uppercase tracking-widest">Safe & Secure Booking • TMS</p>
            </div>
        </div>
    )
}

export default function ThankYouPage() {
    return (
        <>
            <Header />
            <Suspense fallback={<div className="h-screen flex items-center justify-center">Loading...</div>}>
                <ThankYouContent />
            </Suspense>
            <Footer />
        </>
    )
}
