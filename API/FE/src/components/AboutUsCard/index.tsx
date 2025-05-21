const AboutUs = () => {
  return (
    // Outer container to center the card and provide a subtle background
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-green-100 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-6">
      {/* The main About Us card */}
      <div className="w-full max-w-3xl bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden
                      border border-emerald-100 dark:border-gray-700
                      transform transition-all duration-300 hover:scale-103">
        {/* Card Header / Logo */}
        <div className="p-6 sm:p-8 text-center border-b border-emerald-100 dark:border-gray-700">
          <img
            src="https://placehold.co/100x100/d1fae5/065f46?text=SajhaBiz"
            alt="SajhaBiz Logo"
            className="mx-auto mb-4 w-24 h-24 object-cover rounded-full shadow-md border-3 border-emerald-300 dark:border-emerald-700"
          />
          <h2 className="text-3xl font-extrabold text-emerald-800 dark:text-emerald-300 mb-2">
            About <span className="text-emerald-600 dark:text-emerald-400">SajhaBiz</span>
          </h2>
        </div>

        {/* Card Body / Description */}
        <div className="p-6 sm:p-8 text-center">
          <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300 mb-6">
            SajhaBiz empowers local Nepali businesses through community-driven crowdfunding. We connect innovative ideas with passionate supporters to foster sustainable growth and positive impact across the nation.
          </p>

          {/* Call to Action Button */}
          <a
            href="/aboutus"
            className="inline-block bg-emerald-700 text-white px-6 py-3 rounded-full shadow-lg 
                       hover:bg-emerald-800 transition duration-300 transform hover:scale-105 
                       font-semibold text-base border-2 border-emerald-700 dark:border-emerald-900"
          >
            Learn More
          </a>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
