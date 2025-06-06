import { Footer } from "flowbite-react";
import { BsFacebook, BsTwitter } from "react-icons/bs";

const Footercomponent = () => {
    return (
        <Footer container className="bg-emerald-800 dark:bg-gray-900 text-white rounded-t-2xl shadow-lg py-8 px-4">
            <div className="w-full max-w-7xl mx-auto"> 
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-between items-start">
                    {/* Brand Info */}
                    <div className="flex flex-col items-center md:items-start text-center md:text-left">
                        <a href="/" className="flex justify-center md:justify-start items-center mb-2">
                            <img
                                className="w-16 h-16 object-contain rounded-full border-2 border-emerald-500 shadow-md"
                                src="https://placehold.co/64x64/d1fae5/065f46?text=SB" // Smaller placeholder logo
                                alt="SajhaBiz Logo"
                            />
                            <span className="ml-3 text-2xl font-bold text-white dark:text-emerald-300">SajhaBiz</span>
                        </a>
                        <p className="text-sm text-emerald-200 dark:text-gray-400 mt-2 max-w-xs">
                            Empowering local dreams, connecting communities, fostering growth.
                        </p>
                    </div>

                    {/* Navigation Links */}
                    <div className="flex flex-col items-center md:items-start text-center md:text-left">
                        <h3 className="text-emerald-300 dark:text-emerald-400 text-lg font-semibold mb-4">Navigate</h3>
                        <div className="flex flex-col gap-2"> 
                            <a href="/" className="text-sm text-emerald-100 hover:text-white dark:text-gray-300 dark:hover:text-white transition-colors duration-200">Home</a>
                            <a href="/campaign" className="text-sm text-emerald-100 hover:text-white dark:text-gray-300 dark:hover:text-white">Campaigns</a>
                            <a href="/aboutus" className="text-sm text-emerald-100 hover:text-white dark:text-gray-300 dark:hover:text-white">About Us</a>
                            <a href="/contact" className="text-sm text-emerald-100 hover:text-white dark:text-gray-300 dark:hover:text-white">Contact</a>
                        </div>
                    </div>

                    {/* Social Media */}
                    <div className="flex flex-col items-center md:items-end text-center md:text-right">
                        <h3 className="text-emerald-300 dark:text-emerald-400 text-lg font-semibold mb-4">Connect</h3>
                        <div className="flex justify-center md:justify-end gap-4">
                            <a href="https://facebook.com/sajhabiz" target="_blank" rel="noopener noreferrer" className="text-2xl text-emerald-100 hover:text-white dark:text-gray-300 dark:hover:text-white transition-colors duration-200">
                                <BsFacebook />
                            </a>
                            <a href="https://twitter.com/sajhabiz" target="_blank" rel="noopener noreferrer" className="text-2xl text-emerald-100 hover:text-white dark:text-gray-300 dark:hover:text-white transition-colors duration-200">
                                <BsTwitter />
                            </a>
                        </div>
                    </div>
                </div>

                <Footer.Divider className="my-8 border-emerald-700 dark:border-gray-700" />

                {/* Copyright */}
                <div className="w-full text-center">
                    <Footer.Copyright
                        href="/"
                        by="SajhaBiz™"
                        year={new Date().getFullYear()}
                        className="text-sm text-emerald-200 dark:text-gray-400"
                    />
                </div>
            </div>
        </Footer>
    );
};

export default Footercomponent;