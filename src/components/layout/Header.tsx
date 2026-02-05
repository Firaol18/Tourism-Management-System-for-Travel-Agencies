import Link from 'next/link'
import { getCurrentUser } from '@/lib/auth-utils'
import AuthLinks from './AuthLinks'

import { LanguageSwitcher } from './language-switcher'

export async function Header() {
    const user = await getCurrentUser()

    return (
        <header>
            {/* Top Header */}
            <div className="bg-tms-blue h-9 flex items-center">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between text-[13px] font-semibold text-white">
                        <ul className="flex items-center space-x-3">
                            <li>
                                <Link href="/" className="hover:opacity-80">
                                    <i className="fa fa-home text-xl"></i>
                                </Link>
                            </li>
                            {user && user.role !== 'admin' && (
                                <>
                                    <li>
                                        <Link href="/profile/edit" className="hover:opacity-80">
                                            My Profile
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/change-password" className="hover:opacity-80">
                                            Change Password
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/bookings" className="hover:opacity-80">
                                            My Tour History
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/issues" className="hover:opacity-80">
                                            Issue Tickets
                                        </Link>
                                    </li>
                                </>
                            )}
                            {!user && (
                                <li>
                                    <Link href="/admin/login" className="hover:opacity-80">
                                        Admin Login
                                    </Link>
                                </li>
                            )}
                        </ul>

                        <div className="flex items-center space-x-4">
                            <ul className="flex items-center space-x-3">
                                <AuthLinks user={user ? { name: user.name, email: user.email } : null} />
                            </ul>
                            <LanguageSwitcher />
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Header */}
            <div className="bg-white py-4 border-b">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between">
                        <div className="logo">
                            <Link href="/" className="text-[2em] font-['Oswald'] font-normal text-tms-blue tracking-wider">
                                Tourism <span className="text-tms-green">Management System</span>
                            </Link>
                        </div>

                        <div className="flex items-center space-x-3 font-semibold text-sm text-[#1f8dd6]">
                            <i className="fa fa-lock text-3xl"></i>
                            <div className="leading-tight uppercase">
                                SAFE & <br /> SECURE
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <div className="bg-tms-green py-2 shadow-sm">
                <div className="container mx-auto px-4">
                    <nav>
                        <ul className="flex items-center space-x-6 text-[15px] font-normal text-white">
                            <li>
                                <Link href="/" className="hover:text-black transition-colors">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href="/page/aboutus" className="hover:text-black transition-colors">
                                    About
                                </Link>
                            </li>
                            <li>
                                <Link href="/packages" className="hover:text-black transition-colors">
                                    Tour Packages
                                </Link>
                            </li>
                            <li>
                                <Link href="/page/privacy" className="hover:text-black transition-colors">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="/page/terms" className="hover:text-black transition-colors">
                                    Terms of Use
                                </Link>
                            </li>
                            <li>
                                <Link href="/page/contact" className="hover:text-black transition-colors">
                                    Contact Us
                                </Link>
                            </li>
                            {user && (
                                <li className="flex items-center">
                                    <span className="opacity-80 mr-1">Need Help?</span>
                                    <Link href="/issues" className="hover:text-black transition-colors font-semibold">
                                        / Write Us
                                    </Link>
                                </li>
                            )}
                            {!user && (
                                <li>
                                    <Link href="/enquiry" className="hover:text-black transition-colors">
                                        Enquiry
                                    </Link>
                                </li>
                            )}
                        </ul>
                    </nav>
                </div>
            </div>
        </header>
    )
}
