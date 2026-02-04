import { requireAuth } from '@/lib/auth-utils'
import { prisma } from '@/lib/db'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import ProfileForm from '@/components/profile/ProfileForm'

export default async function ProfilePage({ searchParams }: { searchParams?: { [key: string]: string } }) {
    const user = await requireAuth()

    const userDetails = await prisma.user.findUnique({
        where: { emailId: user.email },
    })

    if (!userDetails) {
        return <div>User not found</div>
    }

    // Debug helper: visit /profile?debug=1 to show session and DB user output
    if (searchParams?.debug === '1') {
        // server-side log
        // eslint-disable-next-line no-console
        console.log('DEBUG /profile', { sessionUser: user, userDetails })
        return (
            <div className="p-8">
                <h2 className="text-2xl font-bold mb-4">Profile Debug</h2>
                <div className="mb-4">
                    <h3 className="font-semibold">Session User</h3>
                    <pre className="bg-gray-100 p-4 rounded">{JSON.stringify(user, null, 2)}</pre>
                </div>
                <div>
                    <h3 className="font-semibold">DB User</h3>
                    <pre className="bg-gray-100 p-4 rounded">{JSON.stringify(userDetails, null, 2)}</pre>
                </div>
            </div>
        )
    }

    // Get statistics
    const [bookingCount, issueCount] = await Promise.all([
        prisma.booking.count({ where: { userEmail: user.email } }),
        prisma.issue.count({ where: { userEmail: user.email } }),
    ])

    return (
        <>
            <Header />
            <div>
                {/* Banner */}
                <div className="bg-[#3F84B1] py-12 min-h-[200px] flex items-center justify-center">
                    <div className="container mx-auto px-4 text-center">
                        <h1 className="text-white text-4xl font-['Roboto_Condensed'] font-normal uppercase tracking-wide">
                            TMS-Tourism Management System
                        </h1>
                    </div>
                </div>

                <div className="py-12 bg-white">
                    <div className="container mx-auto px-4">
                        <h3 className="text-tms-green text-3xl font-bold mb-8">My Profile</h3>

                        <div className="max-w-4xl">
                            <ProfileForm userDetails={{
                                fullName: userDetails.fullName,
                                emailId: userDetails.emailId,
                                mobileNumber: userDetails.mobileNumber,
                                regDate: userDetails.regDate,
                                updationDate: userDetails.updationDate
                            }} />
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}
