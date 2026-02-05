import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import { formatCurrency } from '@/lib/utils'
import { getCurrentUser } from '@/lib/auth-utils'
import BookingForm from '@/components/packages/BookingForm'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ReviewList } from '@/components/reviews/review-list'
import { ReviewForm } from '@/components/reviews/review-form'
import { ShareButtons } from '@/components/social/share-buttons'
import { StarRating } from '@/components/reviews/star-rating'

interface PackageDetailsProps {
    params: {
        id: string
    }
}

export default async function PackageDetailsPage({ params }: PackageDetailsProps) {
    const pkgId = parseInt(params.id)
    const pkg = await prisma.tourPackage.findUnique({
        where: { id: pkgId },
    })

    if (!pkg) {
        notFound()
    }

    const user = await getCurrentUser()

    // Fetch Reviews
    const reviews = await prisma.review.findMany({
        where: { packageId: pkgId, isApproved: true },
        include: {
            user: {
                select: { fullName: true }
            }
        },
        orderBy: { createdAt: 'desc' }
    })

    // Calculate ratings
    const totalReviews = reviews.length
    const averageRating = totalReviews > 0
        ? reviews.reduce((acc, curr) => acc + curr.rating, 0) / totalReviews
        : 0

    // Check if user has a confirmed booking for this package
    const userBooking = user ? await prisma.booking.findFirst({
        where: {
            packageId: pkgId,
            userEmail: user.email!,
            status: 1 // Confirmed
        }
    }) : null

    // Check if user has already reviewed
    const userReview = user ? await prisma.review.findFirst({
        where: {
            packageId: pkgId,
            userEmail: user.email!
        }
    }) : null

    return (
        <>
            <Header />
            <main>
                <div className="bg-gradient-to-r from-primary to-blue-600 text-white py-16">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                            <div>
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="bg-white/20 px-3 py-1 rounded text-sm inline-block">{pkg.packageType} Package</span>
                                    {totalReviews > 0 && (
                                        <div className="flex items-center gap-1 bg-black/20 px-3 py-1 rounded">
                                            <StarRating rating={averageRating} size="sm" />
                                            <span className="text-sm font-medium ml-1">({totalReviews} reviews)</span>
                                        </div>
                                    )}
                                </div>
                                <h1 className="text-5xl font-extrabold">{pkg.packageName}</h1>
                                <p className="mt-2 text-xl opacity-90 flex items-center">
                                    <i className="fa fa-map-marker-alt mr-2"></i> {pkg.packageLocation}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm uppercase tracking-widest opacity-80 mb-1">Starting From</p>
                                <p className="text-5xl font-black">{formatCurrency(pkg.packagePrice)}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-12">
                            <div className="rounded-3xl overflow-hidden shadow-2xl h-[400px] md:h-[600px] relative group">
                                <img
                                    src={`/images/packages/${pkg.packageImage}`}
                                    alt={pkg.packageName}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute top-4 right-4">
                                    <ShareButtons
                                        url={`${process.env.NEXTAUTH_URL}/packages/${pkg.id}`}
                                        title={`Check out this amazing tour package: ${pkg.packageName}`}
                                    />
                                </div>
                            </div>

                            <div className="bg-white rounded-3xl p-10 shadow-lg border border-gray-100">
                                <h2 className="text-3xl font-bold mb-8 flex items-center text-gray-800">
                                    <span className="w-10 h-1 bg-primary mr-4"></span>
                                    Package Details
                                </h2>
                                <div className="prose max-w-none text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">
                                    {pkg.packageDetails}
                                </div>
                            </div>

                            <div className="bg-white rounded-3xl p-10 shadow-lg border border-gray-100">
                                <h2 className="text-3xl font-bold mb-8 flex items-center text-gray-800">
                                    <span className="w-10 h-1 bg-primary mr-4"></span>
                                    Included Features
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {pkg.packageFeatures.split(',').map((feature, index) => (
                                        <div key={index} className="flex items-center p-4 bg-gray-50 rounded-xl">
                                            <i className="fa fa-check-circle text-primary mr-3 text-xl"></i>
                                            <span className="text-gray-700 font-medium">{feature.trim()}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Review Section */}
                            <div id="reviews" className="bg-white rounded-3xl p-10 shadow-lg border border-gray-100">
                                <h2 className="text-3xl font-bold mb-8 flex items-center text-gray-800">
                                    <span className="w-10 h-1 bg-primary mr-4"></span>
                                    Reviews & Ratings
                                </h2>

                                <ReviewList
                                    reviews={reviews as any}
                                    averageRating={averageRating}
                                    totalReviews={totalReviews}
                                />

                                {user && userBooking && !userReview && (
                                    <div className="mt-10 border-t pt-10">
                                        <h3 className="text-xl font-bold mb-6">Write a Review</h3>
                                        <ReviewForm packageId={pkg.id} packageName={pkg.packageName} />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Booking Section */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-24 space-y-8">
                                <div className="bg-white rounded-3xl p-10 shadow-2xl border border-gray-100">
                                    <h3 className="text-2xl font-bold mb-6 text-gray-800">Reserve This Trip</h3>
                                    {user ? (
                                        <BookingForm
                                            packageId={pkg.id}
                                            userEmail={user.email!}
                                        />
                                    ) : (
                                        <div className="bg-blue-50 p-8 rounded-2xl text-center">
                                            <p className="text-blue-700 font-bold mb-6">Want to Book This Trip?</p>
                                            <Link
                                                href="/login"
                                                className="block w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-primary/20"
                                            >
                                                Sign In to Reserve
                                            </Link>
                                            <p className="mt-4 text-xs text-blue-500 font-medium">Safe and Secure Booking Guaranteed</p>
                                        </div>
                                    )}
                                </div>

                                <div className="bg-gray-50 rounded-3xl p-8 border border-gray-200">
                                    <h4 className="font-bold text-gray-800 mb-4">Why Book With Us?</h4>
                                    <ul className="space-y-3">
                                        <li className="flex items-start text-sm text-gray-600">
                                            <i className="fa fa-check text-green-500 mt-1 mr-2"></i>
                                            <span>Best Price Guarantee</span>
                                        </li>
                                        <li className="flex items-start text-sm text-gray-600">
                                            <i className="fa fa-check text-green-500 mt-1 mr-2"></i>
                                            <span>Secure Payments</span>
                                        </li>
                                        <li className="flex items-start text-sm text-gray-600">
                                            <i className="fa fa-check text-green-500 mt-1 mr-2"></i>
                                            <span>24/7 Customer Support</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    )
}
