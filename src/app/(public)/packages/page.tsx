import { prisma } from '@/lib/db'
import Link from 'next/link'
import { formatCurrency } from '@/lib/utils'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export default async function PackagesPage() {
    const packages = await prisma.tourPackage.findMany({
        orderBy: {
            creationDate: 'desc',
        },
    })

    return (
        <>
            <Header />
            {/* Banner */}
            <div className="bg-[#3F84B1] py-12 min-h-[150px] flex items-center justify-center">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-white text-4xl font-['Roboto_Condensed'] font-normal uppercase tracking-wide">
                        TMS- Package List
                    </h1>
                </div>
            </div>

            <div className="py-12 bg-white">
                <div className="container mx-auto px-4">
                    <div className="border-b border-gray-200 mb-8 pb-4">
                        <h3 className="text-gray-800 text-2xl font-bold">Package List</h3>
                    </div>

                    <div className="space-y-8">
                        {packages.length === 0 ? (
                            <div className="text-center py-10">
                                <p className="text-gray-500 text-lg">No packages found.</p>
                            </div>
                        ) : (
                            packages.map((pkg) => (
                                <div key={pkg.id} className="border border-gray-200 rounded-sm p-4 hover:shadow-md transition-shadow">
                                    <div className="flex flex-col md:flex-row gap-6">
                                        {/* Left: Image (col-md-3) */}
                                        <div className="md:w-1/4">
                                            <img
                                                src={`/images/packages/${pkg.packageImage}`}
                                                alt={pkg.packageName}
                                                className="w-full h-auto rounded-sm shadow-sm"
                                            />
                                        </div>

                                        {/* Middle: Details (col-md-6) */}
                                        <div className="md:w-1/2 space-y-2">
                                            <h4 className="text-[#3F84B1] text-xl font-bold">Package Name: {pkg.packageName}</h4>
                                            <h6 className="text-gray-600 font-semibold">Package Type : {pkg.packageType}</h6>
                                            <p className="text-sm">
                                                <b className="font-bold">Package Location :</b> {pkg.packageLocation}
                                            </p>
                                            <p className="text-sm">
                                                <b className="font-bold">Features :</b> {pkg.packageFeatures}
                                            </p>
                                        </div>

                                        {/* Right: Price & Action (col-md-3) */}
                                        <div className="md:w-1/4 flex flex-col items-end justify-between border-l border-gray-100 pl-6">
                                            <h5 className="text-2xl font-bold text-gray-800">
                                                USD {pkg.packagePrice}
                                            </h5>
                                            <Link
                                                href={`/packages/${pkg.id}`}
                                                className="bg-tms-green text-white px-6 py-2 rounded-sm font-bold hover:bg-tms-blue transition-colors mt-4 inline-block text-center"
                                            >
                                                Details
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}
