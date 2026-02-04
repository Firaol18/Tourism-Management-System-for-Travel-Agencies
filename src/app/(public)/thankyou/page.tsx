import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import Link from 'next/link'
import { cookies } from 'next/headers'

export default function ThankYouPage({ searchParams }: { searchParams?: { msg?: string | string[] } }) {
    // Prefer query string `msg`, then cookie `msg` (mirrors PHP session behavior)
    const rawMsg = searchParams?.msg
    const queryMsg = Array.isArray(rawMsg) ? rawMsg[0] : rawMsg
    const cookieStore = cookies()
    const cookieMsg = cookieStore.get('msg')?.value ?? null
    const msg = queryMsg || cookieMsg || null

    return (
        <>
            <Header />
            <main className="min-h-screen flex items-center justify-center bg-gray-50 py-20 px-4">
                <div className="max-w-md w-full bg-white p-12 rounded-2xl shadow-2xl text-center border border-gray-100">
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl">
                        <i className="fa fa-check"></i>
                    </div>
                    <h1 className="text-3xl font-black text-gray-800 uppercase tracking-widest mb-4">Confirmation</h1>
                    <div className="card p-4">
                        <h4 className="text-lg">{msg || 'Thank you. Your action was successful.'}</h4>
                    </div>
                    <div className="mt-3">
                        <Link href="/" className="btn btn-primary inline-block mt-4 bg-primary text-white font-bold px-6 py-2 rounded">
                            Back to Home
                        </Link>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    )
}
