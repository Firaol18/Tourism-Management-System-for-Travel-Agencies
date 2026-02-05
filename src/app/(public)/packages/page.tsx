import { prisma } from '@/lib/db'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { SearchBar } from '@/components/packages/search-bar'
import { FilterSidebar } from '@/components/packages/filter-sidebar'
import { SortDropdown } from '@/components/packages/sort-dropdown'
import { Pagination } from '@/components/ui/pagination'
import { PackageSkeleton } from '@/components/ui/package-skeleton'
import { formatCurrency } from '@/lib/utils'
import { Suspense } from 'react'

interface PackagesPageProps {
    searchParams: {
        page?: string
        search?: string
        minPrice?: string
        maxPrice?: string
        types?: string
        sort?: string
    }
}

export default async function PackagesPage({ searchParams }: PackagesPageProps) {
    const page = Number(searchParams.page) || 1
    const limit = 6
    const skip = (page - 1) * limit

    // Build filter query
    const where: any = {}

    if (searchParams.search) {
        where.OR = [
            { packageName: { contains: searchParams.search, mode: 'insensitive' } },
            { packageLocation: { contains: searchParams.search, mode: 'insensitive' } },
        ]
    }

    if (searchParams.minPrice || searchParams.maxPrice) {
        where.packagePrice = {}
        if (searchParams.minPrice) where.packagePrice.gte = Number(searchParams.minPrice)
        if (searchParams.maxPrice) where.packagePrice.lte = Number(searchParams.maxPrice)
    }

    if (searchParams.types) {
        const types = searchParams.types.split(',')
        where.packageType = { in: types }
    }

    // Build sort query
    let orderBy: any = { creationDate: 'desc' }

    if (searchParams.sort) {
        switch (searchParams.sort) {
            case 'price_asc':
                orderBy = { packagePrice: 'asc' }
                break
            case 'price_desc':
                orderBy = { packagePrice: 'desc' }
                break
            case 'name_asc':
                orderBy = { packageName: 'asc' }
                break
            case 'name_desc':
                orderBy = { packageName: 'desc' }
                break
        }
    }

    // Fetch data
    const [packages, total] = await Promise.all([
        prisma.tourPackage.findMany({
            where,
            orderBy,
            skip,
            take: limit,
        }),
        prisma.tourPackage.count({ where }),
    ])

    const totalPages = Math.ceil(total / limit)

    return (
        <>
            <Header />
            {/* Banner */}
            <div className="bg-[#3F84B1] py-12 min-h-[150px] flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[#3F84B1] opacity-90"></div>
                <div className="container mx-auto px-4 text-center relative z-10">
                    <h1 className="text-white text-4xl font-['Roboto_Condensed'] font-normal uppercase tracking-wide">
                        TMS- Package List
                    </h1>
                </div>
            </div>

            <div className="py-12 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Sidebar Filters */}
                        <div className="w-full lg:w-1/4">
                            <Suspense>
                                <FilterSidebar />
                            </Suspense>
                        </div>

                        {/* Main Content */}
                        <div className="w-full lg:w-3/4">
                            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6 sticky top-20 z-20">
                                <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                                    <div className="w-full md:w-2/3">
                                        <Suspense>
                                            <SearchBar />
                                        </Suspense>
                                    </div>
                                    <div className="w-full md:w-1/3 flex justify-end">
                                        <Suspense>
                                            <SortDropdown />
                                        </Suspense>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-4 text-sm text-gray-500">
                                Showing {packages.length} of {total} packages
                            </div>

                            <div className="space-y-6">
                                {packages.length === 0 ? (
                                    <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
                                        <div className="mb-4 text-gray-300">
                                            <i className="fa fa-search text-6xl"></i>
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-800 mb-2">No packages found</h3>
                                        <p className="text-gray-500">Try adjusting your search or filters to find what you're looking for.</p>
                                    </div>
                                ) : (
                                    packages.map((pkg) => (
                                        <div key={pkg.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow group">
                                            <div className="flex flex-col md:flex-row h-full">
                                                {/* Image */}
                                                <div className="md:w-1/3 lg:w-1/4 h-64 md:h-auto overflow-hidden relative">
                                                    <img
                                                        src={`/images/packages/${pkg.packageImage}`}
                                                        alt={pkg.packageName}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                    />
                                                    <div className="absolute top-4 left-4">
                                                        <span className="bg-tms-green text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
                                                            {pkg.packageType}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Details */}
                                                <div className="p-6 md:w-2/3 lg:w-1/2 flex flex-col justify-center border-r border-gray-100">
                                                    <h3 className="text-xl font-bold text-[#3F84B1] mb-2 group-hover:text-tms-green transition-colors">
                                                        {pkg.packageName}
                                                    </h3>
                                                    <div className="flex items-center text-gray-500 text-sm mb-4">
                                                        <i className="fa fa-map-marker-alt mr-2 text-tms-green"></i>
                                                        {pkg.packageLocation}
                                                    </div>
                                                    <p className="text-gray-600 line-clamp-3 mb-4 text-sm leading-relaxed">
                                                        {pkg.packageDetails}
                                                    </p>
                                                    <div className="mb-2">
                                                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Features:</span>
                                                        <span className="text-sm text-gray-700 ml-2">{pkg.packageFeatures}</span>
                                                    </div>
                                                </div>

                                                {/* Price & Action */}
                                                <div className="p-6 md:w-1/3 lg:w-1/4 flex flex-col items-center justify-center bg-gray-50 border-t md:border-t-0 md:border-l border-gray-100">
                                                    <p className="text-sm text-gray-500 mb-1">Starting from</p>
                                                    <h4 className="text-3xl font-bold text-gray-800 mb-6">
                                                        {formatCurrency(pkg.packagePrice)}
                                                    </h4>
                                                    <Link
                                                        href={`/packages/${pkg.id}`}
                                                        className="w-full bg-tms-green hover:bg-green-600 text-white py-3 px-6 rounded font-semibold text-center transition-all shadow-md hover:shadow-lg transform hover:-translate-y-1"
                                                    >
                                                        View Details
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            <div className="mt-10 flex justify-center">
                                <Pagination totalPages={totalPages} currentPage={page} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}
