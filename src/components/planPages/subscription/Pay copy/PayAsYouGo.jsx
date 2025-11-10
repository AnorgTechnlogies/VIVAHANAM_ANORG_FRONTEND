import { useState } from "react";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaStar,
  FaRocket,
  FaCrown,
  FaGem,
  FaCreditCard,
  FaDollarSign,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const paygPlansData = [
  {
    id: 1,
    name: "Basic Match",
    price: "$5",
    description: "Get 5 premium matches instantly. Perfect for quick browsing.",
    features: [
      { text: "5 Premium Profiles", included: true },
      { text: "Detailed Match Insights", included: true },
      { text: "Icebreaker Messages", included: false },
      { text: "Priority Support", included: false },
      { text: "Unlimited Swipes", included: false },
    ],
    highlight: false,
    icon: <FaRocket className="text-blue-600 text-4xl" />,
    route: "/dashboard/basic-match",
  },
  {
    id: 2,
    name: "Advanced Consultation",
    price: "$15",
    description: "One-on-one session with match experts for personalized advice.",
    features: [
      { text: "30-Min Expert Call", included: true },
      { text: "Custom Profile Review", included: true },
      { text: "Auspicious Date Check", included: true },
      { text: "Priest Recommendation", included: false },
      { text: "Location Suggestions", included: false },
    ],
    highlight: true,
    icon: <FaStar className="text-blue-600 text-4xl" />,
    route: "/dashboard/advanced-consultation",
  },
  {
    id: 3,
    name: "Full Service Package",
    price: "$30",
    description: "Complete wedding planning service for one event phase.",
    features: [
      { text: "Event Management", included: true },
      { text: "Decoration Setup", included: true },
      { text: "Catering Coordination", included: true },
      { text: "Transportation", included: true },
      { text: "Registration Assistance", included: true },
    ],
    highlight: false,
    icon: <FaCrown className="text-blue-600 text-4xl" />,
    route: "/dashboard/full-service",
  },
];

const PayAsYouGo = () => {
  const navigate = useNavigate();

  const handleBuyNow = (route) => {
    console.log(`Navigating to ${route} for purchase`);
    navigate(route);
  };

  // const handlePaymentClick = () => {
  //   console.log("Navigate to payment methods");
  //   // Add your payment-method navigation logic here if needed
  // };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-50 via-indigo-50 to-blue-50 pt-40">
      {/* Floating particles background effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-blue-400/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.8}s`,
              animationDuration: `${4 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <div className="text-center w-full max-w-7xl mb-12 relative z-10">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-blue-900">
          Pay As You Go Services
        </h2>
        <p className="text-2xl md:text-3xl mb-8 text-gray-700 font-bold">
          Get exactly what you need, when you need it. No commitments, just results.
        </p>
        <p className="text-lg md:text-xl mb-8 text-gray-600">
          Flexible one-time purchases for your wedding journey. Instant access, pay only for services used.
        </p>

        <div className="flex justify-center items-center gap-4 mb-8">
          <FaDollarSign className="text-3xl text-blue-600" />
          <span className="text-2xl font-bold text-blue-900">No Subscription Required</span>
          <FaCreditCard className="text-3xl text-blue-600" />
        </div>

        <button className="px-8 py-4 bg-gradient-to-r from-blue-700 to-blue-800 text-white rounded-lg font-semibold hover:from-blue-800 hover:to-blue-900 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          <FaGem className="inline mr-2" /> Explore Free Matches First
        </button>
      </div>

      {/* Plans Section */}
      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl relative z-10">
        {paygPlansData.map((plan, index) => (
          <div
            key={plan.id}
            className={`relative rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden ${
              plan.highlight
                ? "border-4 border-transparent bg-gradient-to-br from-blue-400 via-indigo-500 to-blue-600 p-[3px] transform scale-105 lg:scale-110"
                : "border-2 border-blue-200"
            }`}
            style={{
              animation: `fadeInUp 0.5s ease-out ${index * 0.15}s backwards`,
            }}
          >
            <div className="bg-white rounded-xl p-6 h-full flex flex-col">
              {plan.highlight && (
                <span className="absolute top-0 right-0 px-4 py-2 text-sm font-bold bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-bl-xl shadow-lg">
                  Best Pick
                </span>
              )}

              <div className="flex items-center justify-center mb-4 mt-2">
                {plan.icon}
              </div>

              <h4 className="text-2xl font-bold mb-3 text-center text-blue-900">
                {plan.name}
              </h4>

              <p className="text-sm mb-4 leading-relaxed text-center text-gray-600 min-h-[3rem]">
                {plan.description}
              </p>

              <div className="text-center mb-6">
                <p className="text-5xl font-bold text-blue-900">
                  {plan.price}
                </p>
              </div>

              <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 mx-auto mb-6 rounded-full"></div>

              <ul className="space-y-3 mb-6 flex-grow">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm">
                    {feature.included ? (
                      <FaCheckCircle className="text-green-600 mt-0.5 flex-shrink-0" />
                    ) : (
                      <FaTimesCircle className="text-gray-400 mt-0.5 flex-shrink-0" />
                    )}
                    <span
                      className={
                        feature.included ? "text-gray-700" : "text-gray-400"
                      }
                    >
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Buy Now Button */}
              <button
                className="w-full py-3 mb-3 rounded-lg bg-gradient-to-r from-blue-700 to-blue-800 text-white font-semibold hover:from-blue-800 hover:to-blue-900 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                onClick={() => handleBuyNow(plan.route)}
              >
                Buy Now
              </button>
{/* 
              <button
                onClick={handlePaymentClick}
                className="w-full py-3 rounded-lg bg-white border-2 border-blue-700 text-blue-800 font-semibold hover:bg-blue-50 transition-all duration-300 transform hover:scale-105"
              >
                View Payment Methods
              </button> */}

              <p className="text-xs mt-3 text-center text-gray-500">
                Instant access after purchase
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-16 text-center relative z-10">
        <div className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-2xl p-8 shadow-lg max-w-4xl mx-auto">
          <p className="text-lg font-semibold text-blue-900 mb-6">
            Instant Payment & Access
          </p>
          <div className="flex flex-wrap justify-center gap-6 mb-4">
            {["Visa", "Mastercard", "American Express", "Paypal", "Crypto", "UPI"].map(
              (method) => (
                <div
                  key={method}
                  className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm hover:scale-105 hover:-translate-y-1 transition-all duration-300"
                >
                  <FaCreditCard className="text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">
                    {method}
                  </span>
                </div>
              )
            )}
          </div>
          <p className="text-xs text-gray-600">
            Secure one-time payments with 24/7 support
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) translateX(0px);
            opacity: 0.2;
          }
          50% {
            transform: translateY(-30px) translateX(20px);
            opacity: 0.5;
          }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-float {
          animation: float linear infinite;
        }
      `}</style>
    </div>
  );
};

export default PayAsYouGo;