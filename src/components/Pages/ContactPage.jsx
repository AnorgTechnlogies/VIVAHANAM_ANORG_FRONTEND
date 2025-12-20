// Contact.jsx
import { useState, useEffect } from "react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { getCountryCallingCode } from "react-phone-number-input";
import { useContactInfo } from "../../utils/useContactInfo"; // Import shared hook
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Contact = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentCountry, setCurrentCountry] = useState("US");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Use shared hook instead of local state
  const { contactInfo, loading: loadingContactInfo } = useContactInfo();

  const API_URL = import.meta.env.VITE_API_KEY;

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    console.log("Submitting form data:", formData);
    
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all required fields.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Show loading toast
    const loadingToast = toast.info("Sending your message...", {
      position: "top-right",
      autoClose: false,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });

    try {
      const response = await fetch(`${API_URL}/admin/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      // Dismiss loading toast
      toast.dismiss(loadingToast);

      if (response.ok) {
        toast.success("Thank you! We'll get back to you soon.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          icon: "✅",
        });
        
        // Reset form
        setFormData({ name: "", email: "", phone: "", message: "" });
      } else {
        throw new Error("Submission failed.");
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      
      toast.error("Something went wrong. Please try again.", {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        icon: "❌",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 py-12 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        style={{ marginTop: "80px" }} // To avoid navbar overlap
      />

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
                    disabled={isSubmitting}
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
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Phone Number
                  </label>
                  <PhoneInput
                    placeholder={`+${getCountryCallingCode(
                      currentCountry
                    )} (555) 000-0000`}
                    value={formData.phone}
                    onChange={(value) =>
                      setFormData({ ...formData, phone: value })
                    }
                    defaultCountry="US"
                    onCountryChange={setCurrentCountry}
                    className="w-full"
                    inputClassName="w-full px-4 py-3 bg-white/70 border-2 border-amber-200 rounded-lg focus:border-amber-500 focus:outline-none transition-colors duration-300"
                    countrySelectClassName="border-2 border-amber-200 rounded-lg focus:border-amber-500"
                    disabled={isSubmitting}
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
                    disabled={isSubmitting}
                  ></textarea>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full px-8 py-4 bg-gradient-to-r from-amber-700 to-amber-800 hover:from-amber-800 hover:to-amber-900 text-white text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    "Send Message"
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Contact Information - NOW USING SHARED HOOK */}
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
                      {loadingContactInfo ? (
                        <p className="text-gray-400">Loading...</p>
                      ) : (
                        <p className="text-gray-600">{contactInfo.phone}</p>
                      )}
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
                      {loadingContactInfo ? (
                        <p className="text-gray-400">Loading...</p>
                      ) : (
                        <p className="text-gray-600">{contactInfo.email}</p>
                      )}
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
                      {loadingContactInfo ? (
                        <p className="text-gray-400">Loading...</p>
                      ) : (
                        <p className="text-gray-600">{contactInfo.office}</p>
                      )}
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

        /* Custom toast styles */
        .Toastify__toast {
          border-radius: 10px;
          font-family: inherit;
        }
        
        .Toastify__toast--success {
          background: linear-gradient(to right, #059669, #10b981);
          color: white;
        }
        
        .Toastify__toast--error {
          background: linear-gradient(to right, #dc2626, #ef4444);
          color: white;
        }
        
        .Toastify__toast--info {
          background: linear-gradient(to right, #3b82f6, #60a5fa);
          color: white;
        }
      `}</style>
    </div>
  );
};

export default Contact;