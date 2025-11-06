import { useState } from "react";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaStar,
  FaRocket,
  FaCrown,
  FaGem,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const plansData = {
  monthly: [
    {
      id: 1,
      name: "Silver",
      price: "$0",
      description:
        "Do it yourself - Perfect for couples who want to plan independently.",
      features: [
        { text: "Match Making", included: true },
        { text: "Pre-Wedding Consultation", included: false },
        { text: "Auspicious Date Discovery", included: false },
        { text: "Priest Support", included: false },
        { text: "Location Services", included: false },
        { text: "Event Management", included: false },
        { text: "Decoration", included: false },
        { text: "Food/Catering", included: false },
        { text: "Transportation & Logistics", included: false },
        { text: "Marriage Registration", included: false },
      ],
      highlight: false,
      icon: <FaRocket className="text-amber-600 text-4xl" />,
    },
    {
      id: 2,
      name: "Gold",
      price: "$25",
      description:
        "Enhanced planning with essential wedding services included.",
      features: [
        { text: "Match Making", included: true },
        { text: "Pre-Wedding Consultation", included: true },
        { text: "Auspicious Date Discovery", included: true },
        { text: "Priest Support", included: true },
        { text: "Location Services", included: false },
        { text: "Event Management", included: false },
        { text: "Decoration", included: false },
        { text: "Food/Catering", included: false },
        { text: "Transportation & Logistics", included: false },
        { text: "Marriage Registration", included: false },
      ],
      highlight: false,
      icon: <FaStar className="text-amber-600 text-4xl" />,
    },
    {
      id: 3,
      name: "Diamond",
      price: "$50",
      description: "Best Value - Comprehensive planning with location support.",
      features: [
        { text: "Match Making", included: true },
        { text: "Pre-Wedding Consultation", included: true },
        { text: "Auspicious Date Discovery", included: true },
        { text: "Priest Support", included: true },
        { text: "Location Services", included: true },
        { text: "Event Management", included: false },
        { text: "Decoration", included: false },
        { text: "Food/Catering", included: false },
        { text: "Transportation & Logistics", included: false },
        { text: "Marriage Registration", included: false },
      ],
      highlight: true,
      icon: <FaGem className="text-amber-600 text-4xl" />,
    },
    {
      id: 4,
      name: "Platinum",
      price: "$75",
      description:
        "Hassle Free - Complete end-to-end wedding planning and management.",
      features: [
        { text: "Match Making", included: true },
        { text: "Pre-Wedding Consultation", included: true },
        { text: "Auspicious Date Discovery", included: true },
        { text: "Priest Support", included: true },
        { text: "Location Services", included: true },
        { text: "Event Management", included: true },
        { text: "Decoration", included: true },
        { text: "Food/Catering", included: true },
        { text: "Transportation & Logistics", included: true },
        { text: "Marriage Registration", included: true },
      ],
      highlight: false,
      icon: <FaCrown className="text-amber-600 text-4xl" />,
    },
  ],
  yearly: [
    {
      id: 1,
      name: "Silver",
      price: "$0",
      description:
        "Do it yourself - Perfect for couples who want to plan independently.",
      features: [
        { text: "Match Making", included: true },
        { text: "Pre-Wedding Consultation", included: false },
        { text: "Auspicious Date Discovery", included: false },
        { text: "Priest Support", included: false },
        { text: "Location Services", included: false },
        { text: "Event Management", included: false },
        { text: "Decoration", included: false },
        { text: "Food/Catering", included: false },
        { text: "Transportation & Logistics", included: false },
        { text: "Marriage Registration", included: false },
      ],
      highlight: false,
      icon: <FaRocket className="text-amber-600 text-4xl" />,
    },
    {
      id: 2,
      name: "Gold",
      price: "$240",
      description:
        "Enhanced planning with essential wedding services included.",
      features: [
        { text: "Match Making", included: true },
        { text: "Pre-Wedding Consultation", included: true },
        { text: "Auspicious Date Discovery", included: true },
        { text: "Priest Support", included: true },
        { text: "Location Services", included: false },
        { text: "Event Management", included: false },
        { text: "Decoration", included: false },
        { text: "Food/Catering", included: false },
        { text: "Transportation & Logistics", included: false },
        { text: "Marriage Registration", included: false },
      ],
      highlight: false,
      icon: <FaStar className="text-amber-600 text-4xl" />,
    },
    {
      id: 3,
      name: "Diamond",
      price: "$480",
      description: "Best Value - Comprehensive planning with location support.",
      features: [
        { text: "Match Making", included: true },
        { text: "Pre-Wedding Consultation", included: true },
        { text: "Auspicious Date Discovery", included: true },
        { text: "Priest Support", included: true },
        { text: "Location Services", included: true },
        { text: "Event Management", included: false },
        { text: "Decoration", included: false },
        { text: "Food/Catering", included: false },
        { text: "Transportation & Logistics", included: false },
        { text: "Marriage Registration", included: false },
      ],
      highlight: true,
      icon: <FaGem className="text-amber-600 text-4xl" />,
    },
    {
      id: 4,
      name: "Platinum",
      price: "$720",
      description:
        "Hassle Free - Complete end-to-end wedding planning and management.",
      features: [
        { text: "Match Making", included: true },
        { text: "Pre-Wedding Consultation", included: true },
        { text: "Auspicious Date Discovery", included: true },
        { text: "Priest Support", included: true },
        { text: "Location Services", included: true },
        { text: "Event Management", included: true },
        { text: "Decoration", included: true },
        { text: "Food/Catering", included: true },
        { text: "Transportation & Logistics", included: true },
        { text: "Marriage Registration", included: true },
      ],
      highlight: false,
      icon: <FaCrown className="text-amber-600 text-4xl" />,
    },
  ],
  payg: [
    {
      id: 1,
      name: "Silver",
      price: "$0",
      description:
        "Basic access - Pay only for individual services as needed.",
      features: [
        { text: "10 Match Making", included: true },
        { text: "Pre-Wedding Consultation", included: false },
        { text: "Auspicious Date Discovery", included: false },
        { text: "Priest Support", included: false },
        { text: "Location Services", included: false },
        { text: "Event Management", included: false },
        { text: "Decoration", included: false },
        { text: "Food/Catering", included: false },
        { text: "Transportation & Logistics", included: false },
        { text: "Marriage Registration", included: false },
      ],
      highlight: false,
      icon: <FaRocket className="text-amber-600 text-4xl" />,
    },
    {
      id: 2,
      name: "Gold",
      price: "$15",
      description:
        "Pay per essential service - Flexible for targeted needs.",
      features: [
        { text: "50+ Match Making", included: true },
        { text: "Pre-Wedding Consultation", included: true },
        { text: "Auspicious Date Discovery", included: true },
        { text: "Priest Support", included: true },
        { text: "Location Services", included: false },
        { text: "Event Management", included: false },
        { text: "Decoration", included: false },
        { text: "Food/Catering", included: false },
        { text: "Transportation & Logistics", included: false },
        { text: "Marriage Registration", included: false },
      ],
      highlight: false,
      icon: <FaStar className="text-amber-600 text-4xl" />,
    },
    {
      id: 3,
      name: "Diamond",
      price: "$30",
      description: "Best Value - Pay per comprehensive package with location.",
      features: [
        { text: "Match Making", included: true },
        { text: "Pre-Wedding Consultation", included: true },
        { text: "Auspicious Date Discovery", included: true },
        { text: "Priest Support", included: true },
        { text: "Location Services", included: true },
        { text: "Event Management", included: false },
        { text: "Decoration", included: false },
        { text: "Food/Catering", included: false },
        { text: "Transportation & Logistics", included: false },
        { text: "Marriage Registration", included: false },
      ],
      highlight: true,
      icon: <FaGem className="text-amber-600 text-4xl" />,
    },
    {
      id: 4,
      name: "Platinum",
      price: "$50",
      description:
        "Pay per full event - Complete one-time wedding management.",
      features: [
        { text: "Match Making", included: true },
        { text: "Pre-Wedding Consultation", included: true },
        { text: "Auspicious Date Discovery", included: true },
        { text: "Priest Support", included: true },
        { text: "Location Services", included: true },
        { text: "Event Management", included: true },
        { text: "Decoration", included: true },
        { text: "Food/Catering", included: true },
        { text: "Transportation & Logistics", included: true },
        { text: "Marriage Registration", included: true },
      ],
      highlight: false,
      icon: <FaCrown className="text-amber-600 text-4xl" />,
    },
  ],
};

const Plans = () => {
  const [billingCycle, setBillingCycle] = useState("monthly");

  const Navigate = useNavigate();

  const handlePaymentClick = () => {
    console.log("Navigate to payment methods");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-amber-50 via-orange-50 to-amber-50 pt-40">
      {/* Floating particles background effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-amber-400/20 rounded-full animate-float"
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
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-amber-900">
          Choose Your Perfect Plan
        </h2>
        <p className="text-lg md:text-xl mb-8 text-gray-700">
          Find love with our flexible plans. Try risk-free for 14 days, no
          credit card needed.
        </p>

        {/* Billing Toggle - Updated to include PAYG */}
        <div className="flex justify-center items-center gap-4 mb-8 flex-wrap">
          <button
            className={`px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
              billingCycle === "monthly"
                ? "bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-lg"
                : "bg-white text-amber-800 border-2 border-amber-200 hover:border-amber-400"
            }`}
            onClick={() => setBillingCycle("monthly")}
          >
            Monthly
          </button>
          <button
            className={`px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 relative ${
              billingCycle === "yearly"
                ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg"
                : "bg-white text-red-700 border-2 border-red-200 hover:border-red-400"
            }`}
            onClick={() => setBillingCycle("yearly")}
          >
            Yearly
            <span className="ml-2 px-2 py-1 bg-amber-400 text-amber-900 text-xs font-bold rounded">
              Save 20%
            </span>
          </button>
          <button
            className={`px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
              billingCycle === "payg"
                ? "bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg"
                : "bg-white text-green-800 border-2 border-green-200 hover:border-green-400"
            }`}
            onClick={() => setBillingCycle("payg")}
          >
            Pay As You Go
            <span className="ml-2 px-2 py-1 bg-green-400 text-green-900 text-xs font-bold rounded">
              Flexible
            </span>
          </button>
        </div>

        <button className="px-8 py-4 bg-gradient-to-r from-amber-700 to-amber-800 text-white rounded-lg font-semibold hover:from-amber-800 hover:to-amber-900 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          <FaGem className="inline mr-2" /> Start Free - 10 Profiles/Month
        </button>
      </div>

      {/* Plans Section - Fixed grid to show all 4 plans */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-7xl relative z-10">
        {plansData[billingCycle].map((plan, index) => (
          <div
            key={`${plan.id}-${billingCycle}`}
            className={`relative rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden ${
              plan.highlight
                ? "border-4 border-transparent bg-gradient-to-br from-amber-400 via-red-500 to-amber-600 p-[3px] transform scale-105 lg:scale-110"
                : "border-2 border-amber-200"
            }`}
            style={{
              animation: `fadeInUp 0.5s ease-out ${index * 0.15}s backwards`,
            }}
          >
            <div className="bg-white rounded-xl p-6 h-full flex flex-col">
              {plan.highlight && (
                <span className="absolute top-0 right-0 px-4 py-2 text-sm font-bold bg-gradient-to-r from-red-600 to-red-700 text-white rounded-bl-xl shadow-lg">
                  Most Popular
                </span>
              )}

              <div className="flex items-center justify-center mb-4 mt-2">
                {plan.icon}
              </div>

              <h4 className="text-2xl font-bold mb-3 text-center text-amber-900">
                {plan.name}
              </h4>

              <p className="text-sm mb-4 leading-relaxed text-center text-gray-600 min-h-[3rem]">
                {plan.description}
              </p>

              <div className="text-center mb-6">
                <p className="text-5xl font-bold text-amber-900">
                  {plan.price}
                  <span className="text-lg font-normal text-gray-600">
                    {billingCycle === "payg" ? "/service" : billingCycle === "monthly" ? "/mo" : "/yr"}
                  </span>
                </p>
              </div>

              <div className="w-20 h-1 bg-gradient-to-r from-amber-500 to-red-600 mx-auto mb-6 rounded-full"></div>

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

              <button className="w-full py-3 mb-3 rounded-lg bg-gradient-to-r from-amber-700 to-amber-800 text-white font-semibold hover:from-amber-800 hover:to-amber-900 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105" onClick={() => {Navigate('/register')}}>
                {billingCycle === "payg" ? "Buy Now" : "Start 14-Day Free Trial"}
              </button>

              <button
                onClick={handlePaymentClick}
                className="w-full py-3 rounded-lg bg-white border-2 border-amber-700 text-amber-800 font-semibold hover:bg-amber-50 transition-all duration-300 transform hover:scale-105"
              >
                View Payment Methods
              </button>

              <p className="text-xs mt-3 text-center text-gray-500">
                {billingCycle === "payg" ? "One-time payment per service" : "No credit card required"}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-16 text-center relative z-10">
        <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-2xl p-8 shadow-lg max-w-4xl mx-auto">
          <p className="text-lg font-semibold text-amber-900 mb-6">
            Accepted Payment Methods
          </p>
          <div className="flex flex-wrap justify-center gap-6 mb-4">
            {["Visa", "Mastercard", "American Express", "Paypal", "Crypto"].map(
              (method) => (
                <div
                  key={method}
                  className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm hover:scale-105 hover:-translate-y-1 transition-all duration-300"
                >
                  <FaGem className="text-amber-600" />
                  <span className="text-sm font-medium text-gray-700">
                    {method}
                  </span>
                </div>
              )
            )}
          </div>
          <p className="text-xs text-gray-600">
            Secure payments with industry-standard encryption
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

export default Plans;