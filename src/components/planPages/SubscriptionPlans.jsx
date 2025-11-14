import { useState, useEffect } from "react";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaStar,
  FaRocket,
  FaCrown,
  FaGem,
  FaCcVisa,
  FaCcMastercard,
  FaCcAmex,
  FaCcPaypal,
  FaBitcoin,
  FaGift,
  FaMobileAlt,
  FaTimes,
  FaLock,
  FaUser,
  FaUsers,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const SubscriptionPlans = () => {
  const [billingCycle, setBillingCycle] = useState("payAsYouGo");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const plansData = {
    monthly: [
      {
        id: 1,
        name: "Silver",
        price: "$5",
        originalPrice: "$10",
        description: "Do it yourself - Perfect for couples who want to plan independently.",
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
        popular: false,
        icon: <FaRocket className="text-gray-600 text-4xl" />,
        color: "gray",
        apiData: {
          plan_name: "SILVER",
          payment_amount: 5,
          plan_features: ["Match Making"],
          profile_views: 50
        }
      },
      {
        id: 2,
        name: "Gold",
        price: "$25",
        originalPrice: "$50",
        description: "Enhanced planning with essential wedding services included.",
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
        popular: true,
        icon: <FaStar className="text-yellow-600 text-4xl" />,
        color: "yellow",
        apiData: {
          plan_name: "GOLD",
          payment_amount: 25,
          plan_features: [
            "Priority Match Making",
            "Advanced Compatibility Analysis",
            "Dedicated Wedding Consultant",
            "Venue Shortlisting Service",
            "Vendor Management"
          ],
          profile_views: 200
        }
      },
      {
        id: 3,
        name: "Diamond",
        price: "$50",
        originalPrice: "$100",
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
        popular: false,
        icon: <FaGem className="text-blue-600 text-4xl" />,
        color: "blue",
        apiData: {
          plan_name: "DIAMOND",
          payment_amount: 50,
          plan_features: [
            "Executive Match Making",
            "Personal Matchmaker",
            "Astrology Services",
            "Premium Venue Access",
            "Full Vendor Coordination"
          ],
          profile_views: 500
        }
      },
      {
        id: 4,
        name: "Platinum",
        price: "$75",
        originalPrice: "$150",
        description: "Hassle Free - Complete end-to-end wedding planning and management.",
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
        popular: false,
        icon: <FaCrown className="text-purple-600 text-4xl" />,
        color: "purple",
        apiData: {
          plan_name: "PLATINUM",
          payment_amount: 75,
          plan_features: [
            "VIP Match Making",
            "Dedicated Relationship Manager",
            "Luxury Venue Selection",
            "Complete Wedding Planning",
            "Premium Vendor Network"
          ],
          profile_views: 1000
        }
      },
    ],
    yearly: [
      {
        id: 1,
        name: "Silver",
        price: "$50",
        originalPrice: "$100",
        description: "Do it yourself - Perfect for couples who want to plan independently.",
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
        popular: false,
        icon: <FaRocket className="text-gray-600 text-4xl" />,
        color: "gray",
        apiData: {
          plan_name: "SILVER",
          payment_amount: 50,
          plan_features: ["Match Making"],
          profile_views: 600
        }
      },
      {
        id: 2,
        name: "Gold",
        price: "$240",
        originalPrice: "$480",
        description: "Enhanced planning with essential wedding services included.",
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
        popular: true,
        icon: <FaStar className="text-yellow-600 text-4xl" />,
        color: "yellow",
        apiData: {
          plan_name: "GOLD",
          payment_amount: 240,
          plan_features: [
            "Priority Match Making",
            "Advanced Compatibility Analysis",
            "Dedicated Wedding Consultant",
            "Venue Shortlisting Service",
            "Vendor Management"
          ],
          profile_views: 2400
        }
      },
      {
        id: 3,
        name: "Diamond",
        price: "$480",
        originalPrice: "$960",
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
        popular: false,
        icon: <FaGem className="text-blue-600 text-4xl" />,
        color: "blue",
        apiData: {
          plan_name: "DIAMOND",
          payment_amount: 480,
          plan_features: [
            "Executive Match Making",
            "Personal Matchmaker",
            "Astrology Services",
            "Premium Venue Access",
            "Full Vendor Coordination"
          ],
          profile_views: 6000
        }
      },
      {
        id: 4,
        name: "Platinum",
        price: "$720",
        originalPrice: "$1440",
        description: "Hassle Free - Complete end-to-end wedding planning and management.",
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
        popular: false,
        icon: <FaCrown className="text-purple-600 text-4xl" />,
        color: "purple",
        apiData: {
          plan_name: "PLATINUM",
          payment_amount: 720,
          plan_features: [
            "VIP Match Making",
            "Dedicated Relationship Manager",
            "Luxury Venue Selection",
            "Complete Wedding Planning",
            "Premium Vendor Network"
          ],
          profile_views: 12000
        }
      },
    ],
  };

  const paymentMethods = [
    { name: "Visa", icon: <FaCcVisa className="text-4xl text-blue-600" />, type: "RAZORPAY" },
    { name: "Mastercard", icon: <FaCcMastercard className="text-4xl text-red-600" />, type: "RAZORPAY" },
    { name: "American Express", icon: <FaCcAmex className="text-4xl text-blue-500" />, type: "RAZORPAY" },
    { name: "PayPal", icon: <FaCcPaypal className="text-4xl text-blue-700" />, type: "RAZORPAY" },
    { name: "Crypto", icon: <FaBitcoin className="text-4xl text-orange-500" />, type: "WALLET" },
    { name: "Giftcard", icon: <FaGift className="text-4xl text-pink-600" />, type: "WALLET" },
    { name: "UPI", icon: <FaMobileAlt className="text-4xl text-purple-600" />, type: "UPI" },
  ];

  useEffect(() => {
    // Fetch user data from backend
    const fetchUserData = async () => {
      try {
        // In real app, get from authentication context or API
        const userVivId = "VIV98707"; // This should come from auth context
        
        const response = await fetch(`/api/user/viv/${userVivId}`);
        const result = await response.json();
        
        if (result.success) {
          setUser(result.user);
        } else {
          // Fallback to mock data
          setUser({
            id: 1,
            name: "Rajesh Kumar",
            email: "divyanshu2022d@gmail.com",
            vivId: "VIV98707",
            profileCompleted: 85
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        // Fallback to mock data
        setUser({
          id: 1,
          name: "Rajesh Kumar",
          email: "divyanshu2022d@gmail.com",
          vivId: "VIV98707",
          profileCompleted: 85
        });
      }
    };

    fetchUserData();
  }, []);

  const handleGoForSubscription = (plan) => {
    setSelectedPlan(plan);
    setSelectedPaymentMethod("");
    setShowPaymentModal(true);
  };

  const handleSelectPayment = (method) => {
    setSelectedPaymentMethod(method);
  };

  const handleProceedToPay = async () => {
    if (!selectedPlan || !selectedPaymentMethod || !user) return;

    setIsProcessing(true);

    try {
      // Get payment method type
      const paymentMethodObj = paymentMethods.find(m => m.name === selectedPaymentMethod);
      const paymentMode = paymentMethodObj ? paymentMethodObj.type : "RAZORPAY";

      // Prepare payment data for backend
      const paymentData = {
        userVivId: user.vivId,
        plan_name: selectedPlan.apiData.plan_name,
        payment_mode: paymentMode,
        payment_amount: selectedPlan.apiData.payment_amount,
        plan_features: selectedPlan.apiData.plan_features,
        profile_views: selectedPlan.apiData.profile_views,
        plan_frequency: billingCycle === "monthly" ? "monthly" : "yearly"
      };

      console.log('Sending payment data:', paymentData);

      // Call your backend API to create user plan
      const response = await fetch('/api/userplan/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData)
      });

      const result = await response.json();

      if (result.success) {
        // Payment successful - redirect to dashboard
        setTimeout(() => {
          setIsProcessing(false);
          setShowPaymentModal(false);
          alert(`🎉 ${selectedPlan.name} Plan Activated Successfully!`);
          navigate('/plan-dashboard');
        }, 1500);
      } else {
        throw new Error(result.message || 'Payment failed');
      }
    } catch (error) {
      console.error('Payment Error:', error);
      alert(`Payment failed: ${error.message}`);
      setIsProcessing(false);
    }
  };

  const closeModal = () => {
    setShowPaymentModal(false);
    setSelectedPaymentMethod("");
  };

  const getPlanColor = (color) => {
    const colors = {
      gray: { 
        bg: 'bg-gray-500', 
        hover: 'hover:bg-gray-600', 
        text: 'text-gray-700', 
        border: 'border-gray-300',
        gradient: 'from-gray-500 to-gray-600',
        light: 'bg-gray-50'
      },
      yellow: { 
        bg: 'bg-yellow-500', 
        hover: 'hover:bg-yellow-600', 
        text: 'text-yellow-700', 
        border: 'border-yellow-300',
        gradient: 'from-yellow-500 to-yellow-600',
        light: 'bg-yellow-50'
      },
      blue: { 
        bg: 'bg-blue-500', 
        hover: 'hover:bg-blue-600', 
        text: 'text-blue-700', 
        border: 'border-blue-300',
        gradient: 'from-blue-500 to-blue-600',
        light: 'bg-blue-50'
      },
      purple: { 
        bg: 'bg-purple-500', 
        hover: 'hover:bg-purple-600', 
        text: 'text-purple-700', 
        border: 'border-purple-300',
        gradient: 'from-purple-500 to-purple-600',
        light: 'bg-purple-50'
      }
    };
    return colors[color] || colors.gray;
  };

  // Get current plans based on billing cycle
  const currentPlans = plansData[billingCycle] || plansData.monthly;

  const getBillingDisplay = () => {
    switch (billingCycle) {
      case "payAsYouGo":
        return "Pay As You Go";
      case "monthly":
        return "Monthly";
      case "yearly":
        return "Yearly";
      default:
        return billingCycle;
    }
  };

  const getBillingSuffix = () => {
    switch (billingCycle) {
      case "monthly":
        return "/mo";
      case "yearly":
        return "/yr";
      default:
        return "";
    }
  };

  const getBillingType = () => {
    switch (billingCycle) {
      case "payAsYouGo":
        return "Pay As You Go";
      case "monthly":
        return "Monthly Billing";
      case "yearly":
        return "Yearly Billing";
      default:
        return "Billing";
    }
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
        <p className="text-2xl md:text-3xl mb-8 text-gray-700 font-bold">
          Discover love with plans made for you
        </p>

        {/* Billing Toggle */}
        <div className="flex justify-center items-center gap-4 mb-8 flex-wrap">
          <button
            className={`px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 relative ${
              billingCycle === "payAsYouGo"
                ? "bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-lg"
                : "bg-white text-amber-800 border-2 border-amber-200 hover:border-amber-400"
            }`}
            onClick={() => {
              setBillingCycle("payAsYouGo");
              navigate("/payas");
            }}
          >
            Pay As You Go
            <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
              Best Value
            </span>
          </button>

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
                ? "bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-lg"
                : "bg-white text-amber-800 border-2 border-amber-200 hover:border-amber-400"
            }`}
            onClick={() => setBillingCycle("yearly")}
          >
            Yearly
           
          </button>
        </div>

        {/* Billing Cycle Indicator */}
        <div className="mb-4">
          <p className="text-lg font-semibold text-amber-700">
            Currently showing: <span>{getBillingDisplay()}</span> plans
          </p>
        </div>
      </div>

      {/* Plans Section */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-7xl relative z-10">
        {currentPlans.map((plan, index) => {
          const color = getPlanColor(plan.color);
          
          return (
            <div
              key={`${plan.id}-${billingCycle}`}
              className={`relative rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden ${
                plan.highlight
                  ? "border-4 border-transparent bg-gradient-to-br from-amber-400 via-red-500 to-amber-600 p-[3px] transform scale-105 lg:scale-110"
                  : "border-2 border-amber-200"
              } ${plan.popular ? 'ring-2 ring-yellow-400' : ''}`}
              style={{
                animation: `fadeInUp 0.5s ease-out ${index * 0.15}s backwards`,
              }}
            >
              <div className="bg-white rounded-xl p-6 h-full flex flex-col">
                {plan.popular && (
                  <span className="absolute top-0 right-0 px-4 py-2 text-sm font-bold bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-bl-xl shadow-lg">
                    Most Popular
                  </span>
                )}

                {plan.highlight && (
                  <span className="absolute top-0 left-0 right-0 px-4 py-2 text-sm font-bold bg-gradient-to-r from-red-600 to-red-700 text-white text-center shadow-lg">
                    Best Value
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
                      {getBillingSuffix()}
                    </span>
                  </p>
                  <p className="text-sm text-gray-500 line-through mt-1">
                    {plan.originalPrice}
                  </p>
                </div>

                {/* Profile Views */}
                <div className="flex items-center justify-center mb-4 gap-2 text-sm text-gray-600">
                  <FaUsers className="text-amber-600" />
                  <span>{plan.apiData.profile_views.toLocaleString()} Profile Views</span>
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

                {/* Go for Subscription Button */}
                <button
                  className={`w-full py-3 rounded-lg font-semibold text-white transition-all duration-300 transform hover:scale-105 hover:shadow-lg bg-gradient-to-r ${color.gradient}`}
                  onClick={() => handleGoForSubscription(plan)}
                >
                  Subscribe Now
                </button>

                {/* Plan Type Indicator */}
                <div className="mt-3 text-center">
                  <span className="text-xs font-medium text-amber-600 bg-amber-100 px-2 py-1 rounded-full">
                    {getBillingType()}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedPlan && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slideUp">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-white p-6 rounded-t-3xl relative">
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-2 transition-all duration-300"
              >
                <FaTimes className="text-xl" />
              </button>
              <div className="flex items-center gap-4">
                {selectedPlan.icon}
                <div>
                  <h3 className="text-3xl font-bold">{selectedPlan.name} Plan</h3>
                  <p className="text-amber-100 text-lg mt-1">{selectedPlan.description}</p>
                </div>
              </div>
              <div className="mt-4 bg-white/20 backdrop-blur-sm rounded-xl p-4">
                <div className="flex justify-between items-center">
                  <span className="text-amber-100 font-semibold">Total Amount:</span>
                  <span className="text-4xl font-bold">{selectedPlan.price}</span>
                </div>
                <div className="flex justify-between items-center mt-2 text-amber-200">
                  <span>Billing Cycle:</span>
                  <span className="font-semibold">{getBillingDisplay()}</span>
                </div>
                <div className="flex justify-between items-center mt-2 text-amber-200">
                  <span>Profile Views:</span>
                  <span className="font-semibold">{selectedPlan.apiData.profile_views.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* User Info */}
            <div className="p-6 border-b border-amber-200">
              <div className="flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm">
                <div className="w-12 h-12 bg-gradient-to-r from-amber-600 to-amber-700 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {user?.name?.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{user?.name}</p>
                  <p className="text-sm text-gray-600">VIV ID: {user?.vivId}</p>
                  <p className="text-xs text-amber-600 font-medium">
                    {selectedPlan.name} Plan • {getBillingDisplay()} Subscription
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <FaLock className="text-green-600 text-xl" />
                <h4 className="text-2xl font-bold text-amber-900">Select Payment Method</h4>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                {paymentMethods.map((method) => (
                  <button
                    key={method.name}
                    onClick={() => handleSelectPayment(method.name)}
                    className={`bg-white rounded-xl p-6 border-3 transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
                      selectedPaymentMethod === method.name
                        ? "border-amber-600 bg-amber-50 shadow-lg ring-4 ring-amber-200"
                        : "border-amber-200 hover:border-amber-400"
                    }`}
                  >
                    <div className="flex flex-col items-center gap-3">
                      {method.icon}
                      <span className="text-sm font-semibold text-gray-800">
                        {method.name}
                      </span>
                      {selectedPaymentMethod === method.name && (
                        <FaCheckCircle className="text-green-600 text-xl" />
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {/* Security Notice */}
              <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 mb-6">
                <div className="flex items-start gap-3">
                  <FaLock className="text-green-600 text-xl mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-green-900 mb-1">
                      Secure Payment Gateway
                    </p>
                    <p className="text-xs text-green-800">
                      Your payment information is encrypted and secure. We never store your card details.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={closeModal}
                  className="flex-1 py-4 rounded-xl border-2 border-amber-300 text-amber-800 font-semibold hover:bg-amber-50 transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleProceedToPay}
                  disabled={!selectedPaymentMethod || isProcessing}
                  className={`flex-1 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                    !selectedPaymentMethod || isProcessing
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-gradient-to-r from-amber-600 to-amber-700 text-white hover:from-amber-700 hover:to-amber-800 shadow-lg hover:shadow-xl transform hover:scale-105"
                  }`}
                >
                  {isProcessing ? (
                    <>
                      <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <FaLock />
                      Pay {selectedPlan.price}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto mt-16 relative z-10">
        <h2 className="text-3xl font-bold text-center text-amber-900 mb-8">
          Frequently Asked Questions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              question: "Can I upgrade my plan later?",
              answer: "Yes, you can upgrade your plan at any time. The new features will be available immediately."
            },
            {
              question: "Is there a contract or commitment?",
              answer: "No, all plans are month-to-month. You can cancel anytime without any penalties."
            },
            {
              question: "What payment methods do you accept?",
              answer: "We accept Razorpay, UPI payments, and Wallet transfers for your convenience."
            },
            {
              question: "How do I access my plan features?",
              answer: "After payment, you'll be redirected to your dashboard where all plan features are available."
            }
          ].map((faq, index) => (
            <div key={index} className="bg-white rounded-lg p-6 shadow-sm border border-amber-200">
              <h3 className="font-semibold text-amber-900 mb-2">{faq.question}</h3>
              <p className="text-gray-600 text-sm">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-16 text-center relative z-10 w-full">
        <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-2xl p-8 shadow-lg max-w-4xl mx-auto">
          <p className="text-lg font-semibold text-amber-900 mb-6">
            Accepted Payment Methods
          </p>
          <div className="flex flex-wrap justify-center gap-6 mb-4">
            {paymentMethods.map((method) => (
              <div
                key={method.name}
                className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm hover:scale-105 hover:-translate-y-1 transition-all duration-300"
              >
                {method.icon}
                <span className="text-sm font-medium text-gray-700">
                  {method.name}
                </span>
              </div>
            ))}
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
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-float {
          animation: float linear infinite;
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.4s ease-out;
        }
      `}</style>
    </div>
  );
};

export default SubscriptionPlans;