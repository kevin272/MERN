import { useState } from "react";
import Swal from "sweetalert2";

const Contactform = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [subject, setSubject] = useState<string>("");

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Create FormData manually using state
    const formData = new FormData();
    formData.append("access_key", "391245ab-45de-4efb-8436-ae9156f2d057");
    formData.append("name", name);
    formData.append("email", email);
    formData.append("subject", subject);
    formData.append("message", message);

    console.log("Form data being sent:", {
      name,
      email,
      subject,
      message,
    });

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log("API Response:", data);

      if (data.success) {
        Swal.fire({
          title: "Success!",
          text: "Message delivered successfully!",
          icon: "success",
        });

        // Reset form fields
        setName("");
        setEmail("");
        setSubject("");
        setMessage("");
      } else {
        Swal.fire({
          title: "Error",
          text: "There was an issue sending your message. Please try again.",
          icon: "error",
        });
      }
    } catch (error) {
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
        {/* Styled Google Map */}
        <div
          style={{
            border: "3px solid #28a745",
            borderRadius: "8px",
            overflow: "hidden",
            boxShadow: "0 0 10px rgba(40, 167, 69, 0.4)",
            margin: "20px 0",
          }}
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1766.4345494903152!2d85.33043919839477!3d27.690440400000032!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xa0fc53efb5683825%3A0x6ed732e3b430f80c!2sSajhaBiz!5e0!3m2!1sen!2snp!4v1749047915460!5m2!1sen!2snp"
            width="100%"
            height="450"
            style={{ border: "0" }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>

        {/* Contact Form */}
        <div className="grid sm:grid-cols-2 items-start gap-16 p-4 mx-auto max-w-4xl bg-white font-[sans-serif]">
          <form onSubmit={onSubmit} className="ml-auto space-y-4 w-full">
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md py-3 px-4 bg-gray-100 text-gray-300 text-sm outline-green-300 focus:bg-transparent"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md py-3 px-4 bg-gray-100 text-gray-300 text-sm outline-green-300 focus:bg-transparent"
              required
            />
            <input
              type="text"
              placeholder="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full rounded-md py-3 px-4 bg-gray-100 text-gray-300 text-sm outline-green-300 focus:bg-transparent"
              required
            />
            <textarea
              placeholder="Message"
              rows={6}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full rounded-md px-4 bg-gray-100 text-gray-300 text-sm pt-3 outline-green-300 focus:bg-transparent"
              required
            ></textarea>
            <button
              type="submit"
              className="text-white bg-green-300 hover:bg-green-600 tracking-wide rounded-md text-sm px-4 py-3 w-full !mt-6"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Contactform;
