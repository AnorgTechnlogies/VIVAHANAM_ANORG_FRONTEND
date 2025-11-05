import { useState, useEffect } from "react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

import { getCountryCallingCode } from "react-phone-number-input"; // Add this import

const Contact = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentCountry, setCurrentCountry] = useState("US");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    console.log("Form submitted:", formData);
    // Add your form submission logic here
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 py-12 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-amber-400/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.7}s`,
              animationDuration: `${5 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      {/* Decorative gradient circles */}
      <div className="absolute top-20 right-10 w-64 h-64 bg-gradient-to-br from-red-300/20 to-orange-300/20 rounded-full blur-3xl animate-pulse-slow"></div>
      <div
        className="absolute bottom-20 left-10 w-80 h-80 bg-gradient-to-br from-amber-300/20 to-yellow-300/20 rounded-full blur-3xl animate-pulse-slow"
        style={{ animationDelay: "1s" }}
      ></div>

      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Header Section */}
        <div
          className={`text-center mb-12 lg:mb-16 transition-all duration-1000 ${
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-10"
          }`}
        >
          <div className="inline-flex items-center space-x-3 mb-6 pt-10">
            <div className="h-1 w-12 bg-gradient-to-r from-amber-500 to-red-600"></div>
            <span className="text-amber-700 text-lg font-semibold tracking-wider uppercase">
              Get In Touch
            </span>
            <div className="h-1 w-12 bg-gradient-to-l from-amber-500 to-red-600"></div>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-amber-900 mb-4">
            Contact Us
          </h1>

          <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto">
            We're here to help you begin your journey to finding your perfect
            match
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Contact Form */}
          <div
            className={`transition-all duration-1000 delay-200 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-10"
            }`}
          >
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-xl p-6 sm:p-8 lg:p-10 border-2 border-amber-200">
              <h2 className="text-2xl sm:text-3xl font-bold text-amber-900 mb-6">
                Send us a Message
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/70 border-2 border-amber-200 rounded-lg focus:border-amber-500 focus:outline-none transition-colors duration-300"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/70 border-2 border-amber-200 rounded-lg focus:border-amber-500 focus:outline-none transition-colors duration-300"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Phone Number
                  </label>
                  <PhoneInput
                    placeholder={`+${getCountryCallingCode(
                      currentCountry
                    )} (555) 000-0000`} // Dynamic placeholder
                    value={formData.phone}
                    onChange={(value) =>
                      setFormData({ ...formData, phone: value })
                    }
                    defaultCountry="US" // Defaults to US (North America), but users can change it
                    onCountryChange={setCurrentCountry} // Track country changes to update placeholder
                    className="w-full" // Your width class
                    inputClassName="w-full px-4 py-3 bg-white/70 border-2 border-amber-200 rounded-lg focus:border-amber-500 focus:outline-none transition-colors duration-300" // Your input styling
                    // Optional: Add country select styling
                    countrySelectClassName="border-2 border-amber-200 rounded-lg focus:border-amber-500"
                    // Optional: Limit to specific countries if needed (e.g., ['US', 'CA', 'GB', 'IN'])
                    // countries={['US', 'CA', 'GB', 'IN']}
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-3 bg-white/70 border-2 border-amber-200 rounded-lg focus:border-amber-500 focus:outline-none transition-colors duration-300 resize-none"
                    placeholder="Tell us more about your inquiry..."
                  ></textarea>
                </div>

                <button
                  onClick={handleSubmit}
                  className="w-full px-8 py-4 bg-gradient-to-r from-amber-700 to-amber-800 hover:from-amber-800 hover:to-amber-900 text-white text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                >
                  Send Message
                </button>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div
            className={`transition-all duration-1000 delay-400 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-10"
            }`}
          >
            <div className="space-y-6">
              {/* Contact Details Card */}
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-xl p-6 sm:p-8 border-2 border-amber-200">
                <h2 className="text-2xl sm:text-3xl font-bold text-amber-900 mb-6">
                  Contact Information
                </h2>

                <div className="space-y-6">
                  {/* Phone */}
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-600 to-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        ></path>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 text-lg">Phone</h3>
                      <p className="text-gray-600">+1 888 768 8289</p>
                      {/* <p className="text-gray-600">Mon-Fri 9AM-6PM EST</p> */}
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-600 to-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        ></path>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 text-lg">Email</h3>
                      <p className="text-gray-600">
                        ourdivinethoughts@gmail.com
                      </p>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-600 to-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        ></path>
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        ></path>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 text-lg">
                        Office
                      </h3>
                      <p className="text-gray-600">North America</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Why Contact Us Card */}
              <div className="bg-gradient-to-br from-amber-700 to-amber-800 rounded-2xl shadow-xl p-6 sm:p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">Why Contact Us?</h3>
                <ul className="space-y-3">
                  <li className="flex items-start space-x-3">
                    <svg
                      className="w-6 h-6 flex-shrink-0 mt-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <span>Expert matrimonial consultation</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <svg
                      className="w-6 h-6 flex-shrink-0 mt-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <span>Personalized matchmaking services</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <svg
                      className="w-6 h-6 flex-shrink-0 mt-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <span>Traditional ritual guidance</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <svg
                      className="w-6 h-6 flex-shrink-0 mt-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <span>24/7 customer support</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-40px) translateX(30px);
            opacity: 0.6;
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        .animate-float {
          animation: float linear infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Contact;
