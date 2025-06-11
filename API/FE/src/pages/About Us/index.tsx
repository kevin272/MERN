import Breadcrumbnavigation from "../../components/common/breadcrumb navigation/breadcrumb component";
import logo from "../../assets/logo.svg";
import { HiHeart, HiShieldCheck, HiUsers } from "react-icons/hi";

const AboutUs = () => {
  return (
    <>
      {/* Breadcrumb Navigation */}
      <Breadcrumbnavigation>About Us</Breadcrumbnavigation>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-emerald-50 to-green-100 dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-gray-200 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <img
            src={logo}
            alt="SajhaBiz Logo"
            className="mx-auto mb-6 w-28 h-28 object-cover rounded-full shadow-md border-4 border-emerald-300 dark:border-emerald-600"
          />
          <h1 className="text-5xl font-extrabold text-emerald-800 dark:text-emerald-300 mb-4">
            Empowering Local Dreams
          </h1>
          <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            SajhaBiz is Nepal’s grassroots crowdfunding platform built to support small businesses, big ideas, and resilient communities.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900 border-t border-emerald-100 dark:border-gray-800">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-emerald-800 dark:text-emerald-300 mb-4">
            Our Mission
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            To fuel entrepreneurship and community progress through transparent, impactful, and inclusive crowdfunding.
          </p>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-20 bg-gradient-to-bl from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-emerald-800 dark:text-emerald-300 text-center mb-12">
            What We Stand For
          </h3>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Value 1 */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-emerald-100 dark:border-gray-700 text-center">
              <HiHeart className="text-4xl text-emerald-600 dark:text-emerald-400 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-emerald-700 dark:text-emerald-300 mb-2">
                Local First
              </h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                We focus on enabling Nepali entrepreneurs and initiatives that build communities from the ground up.
              </p>
            </div>

            {/* Value 2 */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-emerald-100 dark:border-gray-700 text-center">
              <HiShieldCheck className="text-4xl text-emerald-600 dark:text-emerald-400 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-emerald-700 dark:text-emerald-300 mb-2">
                Transparency
              </h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                We uphold trust by offering secure, honest, and traceable funding journeys for every campaign.
              </p>
            </div>

            {/* Value 3 */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-emerald-100 dark:border-gray-700 text-center">
              <HiUsers className="text-4xl text-emerald-600 dark:text-emerald-400 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-emerald-700 dark:text-emerald-300 mb-2">
                Unity & Impact
              </h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                SajhaBiz brings together people, stories, and support to make long-term economic and social impact.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-emerald-700 dark:bg-emerald-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-bold mb-4">Join the Movement</h3>
          <p className="text-base mb-6">
            Whether you're ready to support, create, or grow — SajhaBiz is your platform to make a difference in Nepal.
          </p>
          <a
            href="/contact"
            className="inline-block bg-white text-emerald-800 px-6 py-3 rounded-full shadow-lg 
                       hover:bg-emerald-50 transition duration-300 transform hover:scale-105 
                       font-semibold text-base border-2 border-emerald-800 dark:border-emerald-300"
          >
            Connect With Us
          </a>
        </div>
      </section>
    </>
  );
};

export default AboutUs;
