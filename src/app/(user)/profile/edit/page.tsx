import { requireAuth } from '@/lib/auth-utils'
import { prisma } from '@/lib/db'
import Link from 'next/link'
import ProfileEditForm from '@/components/profile/ProfileEditForm'

export default async function EditProfilePage() {
    const user = await requireAuth()

    const userDetails = await prisma.user.findUnique({
        where: { emailId: user.email },
    })

    if (!userDetails) {
        return <div>User not found</div>
    }

    return (
        <div>
            <div className="bg-gradient-to-r from-primary to-blue-600 text-white py-12">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl font-bold">Edit Profile</h1>
                    <p className="mt-2 text-lg">Update your personal information</p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
                    <ProfileEditForm userDetails={{ fullName: userDetails.fullName, mobileNumber: userDetails.mobileNumber, emailId: userDetails.emailId }} />
                </div>
            </div>
        </div>
    )
}
