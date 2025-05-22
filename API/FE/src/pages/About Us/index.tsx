import Breadcrumbnavigation from "../../components/common/breadcrumb navigation/breadcrumb component";
import logo from "../../assets/logo.svg"; // Adjust the path as necessary

const AboutUs = () => {
  return (
    <>
      {/* Breadcrumb Navigation */}
      <Breadcrumbnavigation>About Us</Breadcrumbnavigation>

      {/* Main Content Section */}
      <section className="bg-gradient-to-br from-emerald-50 to-green-100 dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-gray-200 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Company Introduction */}
          <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-xl border border-emerald-100 dark:border-gray-700 mb-12">
            <img
              src={logo} // Adjust the path as necessary
              alt="SajhaBiz Logo"
              className="mx-auto mb-6 w-32 h-32 object-cover rounded-full shadow-lg border-4 border-emerald-300 dark:border-emerald-700"
            />
            <h2 className="text-4xl font-extrabold text-emerald-800 dark:text-emerald-300 mb-4">
              About <span className="text-emerald-600 dark:text-emerald-400">SajhaBiz</span>
            </h2>
            <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
              SajhaBiz is a dedicated crowdfunding platform empowering local businesses and entrepreneurs across Nepal. We connect innovative ideas with community support to foster growth and sustainable development.
            </p>
          </div>

          {/* Core Values / What We Do */}
          <div className="mb-12">
            <h3 className="text-3xl font-bold text-emerald-800 dark:text-emerald-300 mb-8">
              Our Commitment
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 shadow-md p-5 rounded-xl border border-emerald-100 dark:border-gray-700">
                <h4 className="text-xl font-semibold text-emerald-700 dark:text-emerald-400 mb-2">
                  Community Impact
                </h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  We believe in strengthening local economies by funding grassroots projects.
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 shadow-md p-5 rounded-xl border border-emerald-100 dark:border-gray-700">
                <h4 className="text-xl font-semibold text-emerald-700 dark:text-emerald-400 mb-2">
                  Transparency & Trust
                </h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Ensuring a clear and reliable platform for all users.
                </p>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="bg-emerald-700 dark:bg-emerald-900 text-white p-8 rounded-2xl shadow-xl">
            <h3 className="text-2xl font-bold mb-4">Join Our Journey</h3>
            <p className="text-base mb-6">
              Be part of Nepal's growth story. Support a local business or launch your own vision today.
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
        </div>
      </section>
    </>
  );
};

export default AboutUs;