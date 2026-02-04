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
                <aside className="w-72 bg-purple-700 text-white min-h-screen sticky top-0 shadow-md">
                    <div className="p-6 border-b border-purple-600 flex items-center">
                        <div className="w-14 h-14 rounded-full bg-purple-900 flex items-center justify-center mr-4">
                            <span className="uppercase font-bold text-lg">A</span>
                        </div>
                        <div>
                            <div className="text-sm text-purple-200">Welcome</div>
                            <div className="font-semibold">Administrator</div>
                        </div>
                    </div>

                    <nav className="p-4">
                        <ul className="space-y-3">
                            <li>
                                <Link href="/admin/dashboard" className="flex items-center px-4 py-3 rounded-lg hover:bg-purple-600 transition">
                                    <svg className="w-5 h-5 mr-3 text-orange-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h18v18H3V3z"></path></svg>
                                    <span>Dashboard</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/admin/packages" className="flex items-center px-4 py-3 rounded-lg hover:bg-purple-600 transition">
                                    <svg className="w-5 h-5 mr-3 text-orange-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V7a2 2 0 00-2-2h-6"></path></svg>
                                    <span>Tour Packages</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/admin/users" className="flex items-center px-4 py-3 rounded-lg hover:bg-purple-600 transition">
                                    <svg className="w-5 h-5 mr-3 text-orange-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 15c2.21 0 4.31.454 6.187 1.255M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                                    <span>Manage Users</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/admin/bookings" className="flex items-center px-4 py-3 rounded-lg hover:bg-purple-600 transition">
                                    <svg className="w-5 h-5 mr-3 text-orange-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7h18M3 12h18M3 17h18"/></svg>
                                    <span>Manage Booking</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/admin/issues" className="flex items-center px-4 py-3 rounded-lg hover:bg-purple-600 transition">
                                    <svg className="w-5 h-5 mr-3 text-orange-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6M9 16h6M9 8h6"/></svg>
                                    <span>Manage Issues</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/admin/enquiries" className="flex items-center px-4 py-3 rounded-lg hover:bg-purple-600 transition">
                                    <svg className="w-5 h-5 mr-3 text-orange-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h6"/></svg>
                                    <span>Manage Enquiries</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/admin/pages" className="flex items-center px-4 py-3 rounded-lg hover:bg-purple-600 transition">
                                    <svg className="w-5 h-5 mr-3 text-orange-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7h18M3 17h18"/></svg>
                                    <span>Manage Pages</span>
                                </Link>
                            </li>
                        </ul>
                    </nav>

                    <div className="mt-auto p-4 border-t border-purple-600">
                        <AdminLogout />
                    </div>
                </aside>

                <main className="flex-1 p-6">{children}</main>
            </div>
        </div>
    )
}
