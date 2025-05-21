import  { useState } from "react";
import Swal from 'sweetalert2';

const Contactform = () => {

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [subject, setSubject] = useState<string>("");

  const onSubmit = async (event: any) => {
    event.preventDefault();

    // Create a new FormData object to send the form data
    const formData = new FormData(event.target);

    // Manually append the form fields to the FormData object
    formData.append("access_key", "391245ab-45de-4efb-8436-ae9156f2d057");
    formData.append("name", name);
    formData.append("email", email);
    formData.append("subject", subject);
    formData.append("message", message);

    // Log form data before submission for debugging
    console.log("Form data being sent:", {
      name,
      email,
      subject,
      message
    });

    try {
      // Send the form data using Fetch API to Web3Forms endpoint
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      // Parse the response from the Web3Forms API
      const data = await response.json();
      console.log(data); // Log the API response for debugging

      if (data.success) {
        Swal.fire({
          title: "Success!",
          text: "Message delivered successfully!",
          icon: "success",
        });
      } else {
        Swal.fire({
          title: "Error",
          text: "There was an issue sending your message. Please try again.",
          icon: "error",
        });
      }
    } catch (error) {
      // Handle network or other errors
      console.error("Error submitting form:", error);
      Swal.fire({
        title: "Error",
        text: "There was a network error. Please try again later.",
        icon: "error",
      });
    }
  };

  return (
    <>
      <br />
      <div className="w-full h-34 mb-6">
      <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3533.363592545476!2d85.33885467377107!3d27.67515512691364!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb19002dc0e4ff%3A0xd2ce8e53498f4917!2sLegacy%20Legal%20Services!5e0!3m2!1sen!2snp!4v1745997637819!5m2!1sen!2snp" width="1500" height="250"  allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
      </div>

      <div className="grid sm:grid-cols-2 items-start gap-16 p-4 mx-auto max-w-4xl bg-white font-[sans-serif]">
        <div>
          <h1 className="text-red-800 text-3xl font-extrabold">Let's Talk</h1>
          <p className="text-sm text-gray-500 mt-4 text-justify">
            We’re here to help answer your questions. Judicial matters can be
            complicated, our experts are on hand to help inform you of every
            aspect regarding your topic. We take great pride in using our
            expertise for you and look forward to hearing from you.
          </p>

          <div className="mt-12">
            <h2 className="text-gray-800 text-base font-bold">Email</h2>
            <ul className="mt-4">
              <li className="flex items-center">
                <div className="bg-[#e6e6e6cf] h-10 w-10 rounded-full flex items-center justify-center shrink-0 animate-bounce">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20px"
                    height="20px"
                    fill="#C62828"
                    viewBox="0 0 479.058 479.058"
                  >
                    <path d="M434.146 59.882H44.912C20.146 59.882 0 80.028 0 104.794v269.47c0 24.766 20.146 44.912 44.912 44.912h389.234c24.766 0 44.912-20.146 44.912-44.912v-269.47c0-24.766-20.146-44.912-44.912-44.912zm0 29.941c2.034 0 3.969.422 5.738 1.159L239.529 264.631 39.173 90.982a14.902 14.902 0 0 1 5.738-1.159zm0 299.411H44.912c-8.26 0-14.971-6.71-14.971-14.971V122.615l199.778 173.141c2.822 2.441 6.316 3.655 9.81 3.655s6.988-1.213 9.81-3.655l199.778-173.141v251.649c-.001 8.26-6.711 14.97-14.971 14.97z" />
                  </svg>
                </div>
                <a href="mailto:info@legacylegal.com.np" className="text-red-800 text-sm ml-4">
                  <small className="block">Mail</small>
                  <strong>legacylegal12345@gmail.com</strong>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Contact Form */}
        <form onSubmit={onSubmit} className="ml-auto space-y-4">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-md py-3 px-4 bg-gray-100 text-gray-800 text-sm outline-red-800 focus:bg-transparent"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md py-3 px-4 bg-gray-100 text-gray-800 text-sm outline-red-800 focus:bg-transparent"
          />
          <input
            type="text"
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full rounded-md py-3 px-4 bg-gray-100 text-gray-800 text-sm outline-red-800 focus:bg-transparent"
          />
          <textarea
            placeholder="Message"
            rows={6}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full rounded-md px-4 bg-gray-100 text-gray-800 text-sm pt-3 outline-red-800 focus:bg-transparent"
          ></textarea>
          <button
            type="submit"
            className="text-white bg-red-800 hover:bg-red-600 tracking-wide rounded-md text-sm px-4 py-3 w-full !mt-6"
          >
            Send
          </button>
        </form>
        
      </div>
    </>
  );
};

export default Contactform;
