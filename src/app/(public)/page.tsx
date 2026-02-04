import Link from 'next/link'
import { prisma } from '@/lib/db'
import { formatCurrency } from '@/lib/utils'
import type { TourPackage } from '@/types'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export default async function HomePage() {
    // Fetch top 4 packages
    const packages = await prisma.tourPackage.findMany({
        take: 4,
        orderBy: {
            creationDate: 'desc',
        },
    })

    // Fetch stats
    const [userCount, bookingCount, enquiryCount, packageCount] = await Promise.all([
        prisma.user.count(),
        prisma.booking.count(),
        prisma.enquiry.count(),
        prisma.tourPackage.count(),
    ])

    return (
        <>
            <Header />
            <main>
                {/* Hero Section */}
                <div
                    className="banner bg-cover bg-center py-40 text-center text-white relative"
                    style={{ backgroundImage: "url('/images/3.jpg')" }}
                >
                    <div className="absolute inset-0 bg-black/40"></div>
                    <div className="container mx-auto px-4 relative z-10">
                        <h1 className="text-5xl md:text-6xl font-bold uppercase tracking-tight animate-zoomIn drop-shadow-2xl">
                            TMS - Tourism Management System
                        </h1>
                    </div>
                </div>
                {/* Offers Section (Rupes) */}
                <div className="bg-white py-12 border-b">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="flex items-center space-x-6 animate-fadeInDown">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-primary text-2xl">
                                    <i className="fa fa-usd"></i>
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-800 uppercase">Up to USD. 50 Off</h3>
                                    <p className="text-primary font-bold"><Link href="/offers">TRAVEL SMART</Link></p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-6 animate-fadeInDown">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-primary text-2xl">
                                    <i className="fa fa-h-square"></i>
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-800 uppercase">Up to 70% Off</h3>
                                    <p className="text-primary font-bold"><Link href="/offers">ON HOTELS ACROSS ETHIOPIA</Link></p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-6 animate-fadeInDown">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-primary text-2xl">
                                    <i className="fa fa-mobile"></i>
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-800 uppercase">Flat USD. 50 Off</h3>
                                    <p className="text-primary font-bold"><Link href="/offers">US APP OFFER</Link></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Statistics Section (Routes) */}
                <div className="bg-gray-900 py-16 text-white mt-20">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                            <div className="flex flex-col items-center animate-fadeInRight">
                                <div className="text-4xl mb-4 text-primary">
                                    <i className="fa fa-list-alt"></i>
                                </div>
                                <h3 className="text-4xl font-bold mb-2">{enquiryCount}</h3>
                                <p className="text-gray-400 font-bold uppercase tracking-widest">Enquiries</p>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="text-4xl mb-4 text-primary">
                                    <i className="fa fa-user"></i>
                                </div>
                                <h3 className="text-4xl font-bold mb-2">{userCount}</h3>
                                <p className="text-gray-400 font-bold uppercase tracking-widest">Registered users</p>
                            </div>
                            <div className="flex flex-col items-center animate-fadeInRight">
                                <div className="text-4xl mb-4 text-primary">
                                    <i className="fa fa-ticket"></i>
                                </div>
                                <h3 className="text-4xl font-bold mb-2">{bookingCount}</h3>
                                <p className="text-gray-400 font-bold uppercase tracking-widest">Bookings</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Package List Header */}
                <div className="container mx-auto px-4 mt-20 mb-8">
                    <h2 className="text-4xl font-black text-gray-800 uppercase tracking-tighter mb-8 border-l-8 border-primary pl-6">
                        Package List
                    </h2>
                </div>

                {/* Featured Packages (Horizontal Layout like PHP) */}
                <div className="container mx-auto px-4 mb-20 space-y-8">
                    {packages.map((pkg) => (
                        <div key={pkg.id} className="flex flex-col md:flex-row bg-white rounded-2xl shadow-xl overflow-hidden border hover:shadow-2xl transition-all group">
                            {/* Left: Image */}
                            <div className="md:w-1/4 h-64 md:h-auto overflow-hidden relative">
                                <img
                                    src={`/images/packages/${pkg.packageImage}`}
                                    alt={pkg.packageName}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest shadow-lg">
                                    Featured
                                </div>
                            </div>

                            {/* Middle: Info */}
                            <div className="md:w-1/2 p-8 flex flex-col justify-center">
                                <h3 className="text-2xl font-bold text-gray-800 mb-1 group-hover:text-primary transition-colors">
                                    Package Name: {pkg.packageName}
                                </h3>
                                <p className="text-gray-500 font-bold text-sm uppercase tracking-widest mb-4">
                                    Package Type: {pkg.packageType}
                                </p>
                                <div className="space-y-3">
                                    <p className="text-gray-600 flex items-center">
                                        <b className="mr-2 text-gray-800">Package Location:</b>
                                        <span>{pkg.packageLocation}</span>
                                    </p>
                                    <p className="text-gray-600">
                                        <b className="mr-2 text-gray-800">Features:</b>
                                        <span className="italic">{pkg.packageFeatures}</span>
                                    </p>
                                </div>
                            </div>

                            {/* Right: Price & Button */}
                            <div className="md:w-1/4 p-12 flex flex-col items-center justify-center bg-gray-50 border-l">
                                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Total Cost</p>
                                <h5 className="text-4xl font-black text-primary mb-8">
                                    USD {pkg.packagePrice}
                                </h5>
                                <Link
                                    href={`/packages/${pkg.id}`}
                                    className="w-full text-center bg-primary hover:bg-primary/90 text-white font-black py-4 rounded-xl transition-all shadow-xl shadow-primary/20 uppercase tracking-widest text-sm"
                                >
                                    Details
                                </Link>
                            </div>
                        </div>
                    ))}

                    <div className="pt-12 text-center">
                        <Link
                            href="/packages"
                            className="inline-flex items-center px-12 py-5 bg-gray-900 text-white font-black rounded-2xl hover:bg-gray-800 transition-all shadow-2xl uppercase tracking-widest text-sm group"
                        >
                            View More Packages
                            <i className="fa fa-arrow-right ml-4 group-hover:translate-x-2 transition-transform"></i>
                        </Link>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    )
}
