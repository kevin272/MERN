import { useState } from "react";
import Swal from "sweetalert2";
import { HiChat } from "react-icons/hi";

const Contactform = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("access_key", "391245ab-45de-4efb-8436-ae9156f2d057");
    formData.append("name", name);
    formData.append("email", email);
    formData.append("subject", subject);
    formData.append("message", message);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        Swal.fire("Success!", "Message delivered successfully!", "success");
        setName("");
        setEmail("");
        setSubject("");
        setMessage("");
      } else {
        Swal.fire("Error", "Issue sending your message. Please try again.", "error");
      }
    } catch (error) {
      Swal.fire("Network Error", "Please try again later.", "error");
      console.error("Form submission error:", error);
    }
  };

  return (
    <div className="w-full mb-10">
      {/* Map Section */}
      <div className="border-4 border-emerald-600 rounded-md overflow-hidden shadow-lg mb-6">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1766.4345494903152!2d85.33043919839477!3d27.690440400000032!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xa0fc53efb5683825%3A0x6ed732e3b430f80c!2sSajhaBiz!5e0!3m2!1sen!2snp!4v1749047915460!5m2!1sen!2snp"
          width="100%"
          height="450"
          loading="lazy"
          style={{ border: 0 }}
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          title="SajhaBiz Location"
        ></iframe>
      </div>

      {/* Chat Button */}
      <div className="flex justify-center mb-10">
        <button
          onClick={() => (window.location.href = "/chat/guest")}
          className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white font-semibold py-3 px-8 rounded-full shadow-lg transition-all duration-300 flex items-center gap-3 text-lg"
        >
          <HiChat className="text-xl animate-bounce" />
          Start Live Chat
        </button>
      </div>

      {/* Contact Section */}
      <div className="flex justify-center bg-gray-100 px-4 py-10">
        <div className="bg-white rounded-xl shadow-md p-6 max-w-6xl w-full grid sm:grid-cols-2 gap-12">
          
          {/* Contact Form */}
          <form onSubmit={onSubmit} className="space-y-4 w-full">
            <h2 className="text-2xl font-semibold mb-2">Send us a message</h2>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded-md border border-gray-300 bg-gray-100 py-3 px-4 text-gray-800 text-sm outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-md border border-gray-300 bg-gray-100 py-3 px-4 text-gray-800 text-sm outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white"
            />
            <input
              type="text"
              placeholder="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              className="w-full rounded-md border border-gray-300 bg-gray-100 py-3 px-4 text-gray-800 text-sm outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white"
            />
            <textarea
              placeholder="Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              required
              className="w-full rounded-md border border-gray-300 bg-gray-100 px-4 pt-3 text-gray-800 text-sm outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white"
            />
            <button
              type="submit"
              className="w-full text-white bg-emerald-600 hover:bg-emerald-700 rounded-md text-sm font-semibold py-3 transition-colors duration-300"
            >
              Send Message
            </button>
          </form>

          {/* Right Side Info */}
          <div className="space-y-4 text-gray-700">
            <h2 className="text-3xl font-bold text-emerald-600">Let’s Talk</h2>
            <p className="text-base leading-relaxed">
              Whether you have a question about features, pricing, or anything else, our team is ready to answer all your questions. You can also use the live chat or drop us a message using the form.
            </p>
            <div className="mt-4">
              <p><strong>Email:</strong> support@sajhabiz.com</p>
              <p><strong>Phone:</strong> +977-1-1234567</p>
              <p><strong>Address:</strong> Kathmandu, Nepal</p>
            </div>
            <div className="pt-6">
              <h3 className="text-lg font-semibold">Hours of Operation</h3>
              <p>Monday – Friday: 9am – 6pm</p>
              <p>Saturday – Sunday: Closed</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Contactform;
