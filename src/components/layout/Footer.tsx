import Link from 'next/link'

export function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="bg-gray-800 text-white mt-16">
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* About Section */}
                    <div>
                        <h3 className="text-xl font-semibold mb-4">About TMS</h3>
                        <p className="text-gray-300">
                            Tourism Management System offers the best tour packages across Ethiopia and beyond.
                            Book your dream vacation with us today!
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/page/aboutus" className="text-gray-300 hover:text-white">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/packages" className="text-gray-300 hover:text-white">
                                    Tour Packages
                                </Link>
                            </li>
                            <li>
                                <Link href="/page/privacy" className="text-gray-300 hover:text-white">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="/page/terms" className="text-gray-300 hover:text-white">
                                    Terms of Use
                                </Link>
                            </li>
                            <li>
                                <Link href="/page/contact" className="text-gray-300 hover:text-white">
                                    Contact Us
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
                        <ul className="space-y-2 text-gray-300">
                            <li>📞 +1251-920443110</li>
                            <li>📧 info@tms.com</li>
                            <li>📍 Addis Ababa, Ethiopia</li>
                        </ul>
                    </div>
                </div>

                {/* Social Icons & Copyright */}
                <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between">
                    <div className="flex space-x-6 mb-4 md:mb-0">
                        <Link href="#" className="text-gray-400 hover:text-blue-500 transition-colors">
                            <i className="fa fa-facebook text-xl"></i>
                        </Link>
                        <Link href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                            <i className="fa fa-twitter text-xl"></i>
                        </Link>
                        <Link href="#" className="text-gray-400 hover:text-red-500 transition-colors">
                            <i className="fa fa-google-plus text-xl"></i>
                        </Link>
                        <Link href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
                            <i className="fa fa-flickr text-xl"></i>
                        </Link>
                        <Link href="#" className="text-gray-400 hover:text-pink-600 transition-colors">
                            <i className="fa fa-dribbble text-xl"></i>
                        </Link>
                    </div>
                    <p className="text-gray-400 text-sm">
                        &copy; {currentYear} TMS. All Rights Reserved
                    </p>
                </div>
            </div>
        </footer>
    )
}
