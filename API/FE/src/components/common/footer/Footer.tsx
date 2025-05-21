import { Footer } from "flowbite-react";
import { BsFacebook, BsTwitter } from "react-icons/bs";
// Removed GoLaw as it doesn't fit the crowdfunding theme

const Footercomponent = () => {
    return (
        <>
            <Footer container className="bg-emerald-800 dark:bg-gray-900 text-white rounded-t-3xl shadow-lg">
                <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-between">
                        {/* Logo and Brand Info */}
                        <div className="flex flex-col items-center md:items-start text-center md:text-left">
                            <a href="/" className="flex items-center mb-4">

                                <span className="ml-3 text-2xl font-bold text-white dark:text-emerald-300">SajhaBiz</span>
                            </a>
                            <p className="text-sm text-emerald-200 dark:text-gray-400 mt-2">
                                Empowering local dreams, together.
                            </p>
                        </div>

                        {/* Navigation Links */}
                        <div className="text-center md:text-left">
                            <Footer.Title className="text-emerald-300 dark:text-emerald-400 text-lg font-semibold mb-4" title="Navigate" />
                            <Footer.LinkGroup col className="space-y-2">
                                <Footer.Link className="text-emerald-100 hover:text-white dark:text-gray-300 dark:hover:text-white transition-colors duration-200" href="/">Home</Footer.Link>
                                <Footer.Link className="text-emerald-100 hover:text-white dark:text-gray-300 dark:hover:text-white transition-colors duration-200" href="/campaign">Campaigns</Footer.Link>
                                <Footer.Link className="text-emerald-100 hover:text-white dark:text-gray-300 dark:hover:text-white transition-colors duration-200" href="/aboutus">About Us</Footer.Link>
                                <Footer.Link className="text-emerald-100 hover:text-white dark:text-gray-300 dark:hover:text-white transition-colors duration-200" href="/contact">Contact</Footer.Link>
                            </Footer.LinkGroup>
                        </div>

                        {/* Social Media */}
                        <div className="text-center md:text-left">
                            <Footer.Title className="text-emerald-300 dark:text-emerald-400 text-lg font-semibold mb-4" title="Connect With Us" />
                            <div className="flex justify-center md:justify-start space-x-6">
                                <Footer.Icon 
                                    className="text-emerald-100 hover:text-white dark:text-gray-300 dark:hover:text-white transition-colors duration-200 text-2xl" 
                                    href="https://facebook.com/kebinmalla" // Updated link for consistency
                                    icon={BsFacebook}
                                />
                                <Footer.Icon 
                                    className="text-emerald-100 hover:text-white dark:text-gray-300 dark:hover:text-white transition-colors duration-200 text-2xl" 
                                    href="https://twitter.com/kebinmalla" // Updated link for consistency
                                    icon={BsTwitter}
                                />
                                {/* Add more social icons if needed */}
                            </div>
                        </div>
                    </div>

                    <Footer.Divider className="my-8 border-emerald-700 dark:border-gray-700" />

                    {/* Copyright */}
                    <div className="w-full text-center sm:flex sm:items-center sm:justify-center">
                        <Footer.Copyright 
                            className="text-emerald-200 dark:text-gray-400 text-sm" 
                            href="/" // Link to home or your company's website
                            by="SajhaBiz™" // Changed to SajhaBiz
                            year={new Date().getFullYear()} 
                        />
                    </div>
                </div>
            </Footer>
        </>
    );
}

export default Footercomponent;