import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export default async function DebugProfile() {
    const session = await getServerSession(authOptions)

    if (!session) {
        return (
            <div className="p-8">
                <h2 className="text-xl font-bold">No session</h2>
                <p>Please log in and try again.</p>
            </div>
        )
    }

    const userEmail = session.user?.email as string | undefined
    const user = userEmail ? await prisma.user.findUnique({ where: { emailId: userEmail } }) : null

    return (
        <div className="p-8">
            <h2 className="text-2xl font-bold mb-4">Debug Profile</h2>
            <div className="mb-4">
                <h3 className="font-semibold">Session</h3>
                <pre className="bg-gray-100 p-4 rounded">{JSON.stringify(session, null, 2)}</pre>
            </div>
            <div>
                <h3 className="font-semibold">User record (database)</h3>
                <pre className="bg-gray-100 p-4 rounded">{JSON.stringify(user, null, 2)}</pre>
            </div>
        </div>
    )
}
