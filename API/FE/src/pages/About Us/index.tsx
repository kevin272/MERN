import Breadcrumbnavigation from "../../components/common/breadcrumb navigation/breadcrumb component";
import logo from "../../assets/public/logo.svg"
const AboutUs = () => {
  return (
    <>
    <Breadcrumbnavigation> About Us</Breadcrumbnavigation>
    <section className="bg-gray-100 text-gray-800 py-16 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
        
        <div className="md:w-1/2">
          <img
            src={logo}
            alt="Legacy Legal Services"
            className="w-full rounded-lg shadow-lg"
          />
        </div>

        <div className="md:w-1/2">
          <h2 className="text-4xl font-bold text-red-800">About Us</h2>
          <p className="mt-4 text-lg">
            Since <strong>1984</strong>, <span className="text-red-800 font-semibold">Legacy Legal Services</span> has been a 
            distinguished provider of legal expertise in Nepal, offering more than <strong>40 years</strong> of trusted counsel and advocacy. 
            Our name, <strong>Legacy</strong>, represents our commitment to excellence and our aspiration to pass on a tradition of trust, 
            integrity, and legal expertise to future generations.
          </p>

          <p className="mt-4 text-md text-gray-700">
            We specialize in <strong>litigation</strong> and <strong>arbitration</strong>, handling complex disputes across multiple sectors. 
            Whether representing clients in domestic or international arbitration, we ensure efficient and effective legal solutions.
          </p>
        </div>
      </div>

      {/* Practice Areas */}
      <div className="max-w-6xl mx-auto mt-12">
        <h3 className="text-3xl font-bold text-red-800 text-left">Our Key Areas of Practice</h3>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {[
            "Development Project Disputes",
            "Infrastructure Project Litigation",
            "Banking and Finance Disputes",
            "Corporate and Commercial Litigation",
            "Commercial Mediation",
            "Debt Recovery and Insolvency Matters",
            "Real Estate and Construction Disputes",
            "Employment and Labor Law Cases",
            "Intellectual Property Disputes",
            "Domestic and International Arbitration",
          ].map((practice, index) => (
            <div key={index} className="flex items-center bg-white shadow-md rounded-lg p-4">
              <span className="text-red-800 text-lg font-semibold">✔</span>
              <p className="ml-3 text-gray-800">{practice}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-16">
        <h3 className="text-3xl font-bold text-red-800 text-left">Why Legacy Legal Services?</h3>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {[
            { title: "Proven Track Record", description: "Four decades of successful practice and long-standing client relationships." },
            { title: "Sector-Specific Expertise", description: "Litigation across infrastructure, finance, and corporate sectors." },
            { title: "Arbitration Specialists", description: "Expertise in resolving disputes through domestic and international arbitration." },
            { title: "Tailored Solutions", description: "Client-focused strategies aimed at achieving optimal outcomes." },
            { title: "A Legacy of Trust", description: "Consistent delivery of reliable, discreet, and effective legal solutions." },
          ].map((point, index) => (
            <div key={index} className="p-6 bg-white shadow-md rounded-lg">
              <h4 className="text-lg font-semibold text-red-800">{point.title}</h4>
              <p className="mt-2 text-gray-700">{point.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center mt-16">
        <h3 className="text-2xl font-semibold text-gray-800">Get in Touch</h3>
        <p className="text-gray-600 mt-2">
          Contact us today to explore how we can assist with your legal needs.
        </p>
        <a href="/contact" className="mt-4 inline-block bg-red-800 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-red-700 transition">
          Contact Us
        </a>
      </div>
    </section></>
  );
};

export default AboutUs;
