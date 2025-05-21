import Breadcrumbnavigation from "../../components/common/breadcrumb navigation/breadcrumb component";
import logo from "../../assets/public/logo.bmp";

const AboutUs = () => {
  return (
    <>
      <Breadcrumbnavigation>About Us</Breadcrumbnavigation>
      <section className="bg-gray-100 text-gray-800 py-16 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <img
            src={logo}
            alt="SajhaBiz"
            className="mx-auto mb-8 w-40 h-40 rounded-full shadow-md"
          />
          <h2 className="text-4xl font-bold text-red-800 mb-4">About SajhaBiz</h2>
          <p className="text-lg">
            <span className="text-red-800 font-semibold">SajhaBiz</span> is a crowdfunding platform that helps local businesses in Nepal
            raise funds and grow. We connect passionate entrepreneurs with everyday supporters who want to make a difference.
          </p>
          <p className="mt-4 text-gray-700">
            By funding local ideas, SajhaBiz promotes innovation, sustainability, and community empowerment across the country.
          </p>
        </div>

        <div className="max-w-5xl mx-auto mt-12">
          <h3 className="text-3xl font-bold text-red-800 text-center mb-6">What We Support</h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              "Local Businesses",
              "Women Entrepreneurs",
              "Youth Startups",
              "Farming & Agriculture",
              "Crafts & Handmade Goods",
              "Tourism & Homestays",
              "Eco-Friendly Projects",
              "Tech & Innovation",
            ].map((item, index) => (
              <li
                key={index}
                className="bg-white shadow-md p-4 rounded-lg flex items-center"
              >
                <span className="text-red-800 mr-2">✔</span> {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="max-w-5xl mx-auto mt-16 text-center">
          <h3 className="text-2xl font-bold text-red-800 mb-4">Why SajhaBiz?</h3>
          <p className="text-gray-700">
            We're focused on local impact, trust, and making fundraising simple for everyone.
          </p>
          <ul className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            {[
              "Built for Nepal",
              "Community Powered",
              "Clear and Transparent",
              "Easy to Use",
              "Real Impact Stories",
            ].map((point, index) => (
              <li key={index} className="flex items-start">
                <span className="text-red-800 mr-2">✔</span> {point}
              </li>
            ))}
          </ul>
        </div>

        <div className="text-center mt-16">
          <h3 className="text-xl font-semibold text-gray-800">Get Involved</h3>
          <p className="text-gray-600 mt-2">
            Join us to support or launch a local business today.
          </p>
          <a
            href="/contact"
            className="mt-4 inline-block bg-red-800 text-white px-6 py-3 rounded-lg shadow hover:bg-red-700 transition"
          >
            Contact Us
          </a>
        </div>
      </section>
    </>
  );
};

export default AboutUs;
