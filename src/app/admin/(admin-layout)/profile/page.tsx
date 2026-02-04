import { requireAdmin } from '@/lib/auth-utils'
import { prisma } from '@/lib/db'
import ProfileForm from '@/components/profile/ProfileForm'

export default async function AdminProfilePage() {
    const user = await requireAdmin()

    // admin sessions store the username in `email` field (see auth.ts)
    const adminDetails = await prisma.admin.findUnique({ where: { username: user.email } })

    if (!adminDetails) return <div className="p-6">Admin user not found</div>
    return (
        <div className="p-6">
            <div className="bg-[#3F84B1] py-12 min-h-[160px] flex items-center justify-center mb-6">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-white text-3xl font-semibold">TMS-Tourism Management System</h1>
                </div>
            </div>

            <div className="container mx-auto px-4">
                <h2 className="text-2xl font-bold text-green-600 mb-6">Change Password</h2>

                <div className="bg-white p-6 rounded shadow-sm max-w-3xl">
                    <ProfileForm userDetails={{
                        fullName: adminDetails.username,
                        emailId: adminDetails.username,
                        mobileNumber: '',
                        regDate: adminDetails.updationDate,
                        updationDate: adminDetails.updationDate,
                    }} />
                </div>
            </div>
        </div>
    )
}
