import { requireAdmin } from '@/lib/auth-utils'
import Link from 'next/link'
import AdminLogout from '@/components/admin/AdminLogout'
import AdminProfileDropdown from '@/components/admin/AdminProfileDropdown'

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    await requireAdmin()

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Admin Header */}
            <header className="bg-gray-900 text-white">
                <div className="px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold">TMS Admin Panel</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Link href="/" className="hover:text-gray-300">
                                View Site
                            </Link>
                            <AdminProfileDropdown name="Administrator" />
                        </div>
                    </div>
                </div>
            </header>

            {/* Content area with left sidebar */}
            <div className="flex">
                <aside className="w-64 bg-gray-800 text-white min-h-screen sticky top-0">
                    <div className="p-6 border-b border-gray-700">
                        <h2 className="text-lg font-bold">Admin</h2>
                    </div>
                    <nav className="p-4">
                        <ul className="space-y-2">
                            <li>
                                <Link href="/admin/dashboard" className="block px-3 py-2 rounded hover:bg-gray-700">
                                    Dashboard
                                </Link>
                            </li>
                            <li>
                                <Link href="/admin/packages" className="block px-3 py-2 rounded hover:bg-gray-700">
                                    Tour Packages
                                </Link>
                            </li>
                            <li>
                                <Link href="/admin/users" className="block px-3 py-2 rounded hover:bg-gray-700">
                                    Manage Users
                                </Link>
                            </li>
                            <li>
                                <Link href="/admin/bookings" className="block px-3 py-2 rounded hover:bg-gray-700">
                                    Manage Booking
                                </Link>
                            </li>
                            <li>
                                <Link href="/admin/issues" className="block px-3 py-2 rounded hover:bg-gray-700">
                                    Manage Issues
                                </Link>
                            </li>
                            <li>
                                <Link href="/admin/enquiries" className="block px-3 py-2 rounded hover:bg-gray-700">
                                    Manage Enquiries
                                </Link>
                            </li>
                            <li>
                                <Link href="/admin/pages" className="block px-3 py-2 rounded hover:bg-gray-700">
                                    Manage Pages
                                </Link>
                            </li>
                            
                        </ul>
                    </nav>
                </aside>

                <main className="flex-1 p-6">{children}</main>
            </div>
        </div>
    )
}
