import Link from 'next/link'
import dynamic from 'next/dynamic'
import ChatToggle from '@/components/ChatToggle'

import { NewsletterForm } from '@/components/social/newsletter-form'

const Chatbot = dynamic(() => import('@/components/Chatbot'), { ssr: false })

export function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <>
            <footer className="bg-slate-900 text-slate-100 mt-16">
                <div className="max-w-7xl mx-auto px-6 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                        {/* About Section */}
                        <div>
                            <h3 className="text-2xl font-semibold mb-4 text-white">About TMS</h3>
                            <p className="text-slate-400 leading-relaxed">
                                Tourism Management System offers the best tour packages across Ethiopia and beyond.
                                Book your dream vacation with us today!
                            </p>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h3 className="text-2xl font-semibold mb-4 text-white">Quick Links</h3>
                            <ul className="space-y-2">
                                <li>
                                    <Link href="/page/aboutus" className="text-slate-400 hover:text-blue-500 transition-colors">
                                        About Us
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/packages" className="text-slate-400 hover:text-blue-500 transition-colors">
                                        Tour Packages
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/page/privacy" className="text-slate-400 hover:text-blue-500 transition-colors">
                                        Privacy Policy
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/page/terms" className="text-slate-400 hover:text-blue-500 transition-colors">
                                        Terms of Use
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/page/contact" className="text-slate-400 hover:text-blue-500 transition-colors">
                                        Contact Us
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Contact Info */}
                        <div>
                            <h3 className="text-2xl font-semibold mb-4 text-white">Contact Us</h3>
                            <ul className="space-y-2 text-slate-400">
                                <li>📞 +251-920443110</li>
                                <li>📧 info@tms.com</li>
                                <li>📍 Addis Ababa, Ethiopia</li>
                            </ul>
                        </div>

                        {/* Newsletter */}
                        <div>
                            <h3 className="text-2xl font-semibold mb-4 text-white">Newsletter</h3>
                            <div className="text-slate-900">
                                <NewsletterForm />
                            </div>
                        </div>
                    </div>

                    {/* Social Icons & Copyright */}
                    <div className="border-t border-slate-800 mt-10 pt-8 flex flex-col md:flex-row items-center justify-between">
                        <div className="flex space-x-5 mb-4 md:mb-0">
                            <ChatToggle />
                            <Link href="#" className="text-slate-400 hover:text-blue-600 transition-colors">
                                <i className="fa fa-facebook text-xl"></i>
                            </Link>
                            <Link href="#" className="text-slate-400 hover:text-sky-400 transition-colors">
                                <i className="fa fa-twitter text-xl"></i>
                            </Link>
                            <Link href="#" className="text-slate-400 hover:text-red-500 transition-colors">
                                <i className="fa fa-google-plus text-xl"></i>
                            </Link>
                            <Link href="#" className="text-slate-400 hover:text-indigo-500 transition-colors">
                                <i className="fa fa-flickr text-xl"></i>
                            </Link>
                            <Link href="#" className="text-slate-400 hover:text-pink-500 transition-colors">
                                <i className="fa fa-dribbble text-xl"></i>
                            </Link>
                        </div>
                        <p className="text-slate-500 text-sm">
                            &copy; {currentYear} TMS. All Rights Reserved
                        </p>
                    </div>
                </div>
            </footer>
            <Chatbot />
        </>
    )
}
