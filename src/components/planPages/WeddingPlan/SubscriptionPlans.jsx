// Final Version of SubscriptionPlans.jsx with Back Button in Header

import { useState, useEffect } from "react";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaStar,
  FaCrown,
  FaGem,
  FaExclamationTriangle,
  FaTimes,
  FaPhone,
  FaHeart,
  FaCalendarAlt,
  FaUserTie,
  FaMapMarkerAlt,
  FaCalendar,
  FaPalette,
  FaUtensils,
  FaCar,
  FaFileContract,
  FaArrowLeft,
} from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";

const SubscriptionPlans = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showContactPopup, setShowContactPopup] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isWeddingFormComplete, setIsWeddingFormComplete] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Helpers to store form completion per user (avoids mixing across accounts)
  const getUserKey = (userInfo) => {
    if (!userInfo) return null;
    return userInfo._id || userInfo.email || userInfo.vivId || "guest";
  };

  const getFormMap = () => {
    try {
      return (
        JSON.parse(localStorage.getItem("vivahanamWeddingFormSubmittedMap")) ||
        {}
      );
    } catch {
      return {};
    }
  };

  const isFormCompleteForUser = (userInfo) => {
    const key = getUserKey(userInfo);
    if (!key) return false;
    const map = getFormMap();
    return !!map[key];
  };

  const setFormCompleteForUser = (userInfo) => {
    const key = getUserKey(userInfo);
    if (!key) return;
    const map = getFormMap();
    map[key] = true;
    localStorage.setItem(
      "vivahanamWeddingFormSubmittedMap",
      JSON.stringify(map)
    );
  };

  // Plan data without React elements for navigation
  const planDataForNavigation = [
    {
      id: 2,
      name: "Gold",
      description:
        "Enhanced planning with essential wedding services included.",
      color: "yellow",
      highlight: false,
      popular: true,
      premium: false,
    },
    {
      id: 3,
      name: "Diamond",
      description: "Best Value - Comprehensive planning with location support.",
      color: "blue",
      highlight: true,
      popular: false,
      premium: false,
    },
    {
      id: 4,
      name: "Platinum",
      description:
        "Hassle Free - Complete end-to-end wedding planning and management.",
      color: "purple",
      highlight: false,
      popular: false,
      premium: true,
    },
  ];

  // Complete plans data with icons for display
  const plansData = [
    {
      id: 2,
      name: "Gold",
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
      popular: true,
      icon: <FaStar className="text-yellow-600 text-2xl" />,
      color: "yellow",
    },
    {
      id: 3,
      name: "Diamond",
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
      icon: <FaGem className="text-blue-600 text-2xl" />,
      color: "blue",
    },
    {
      id: 4,
      name: "Platinum",
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
      popular: false,
      premium: true,
      icon: <FaCrown className="text-purple-600 text-2xl" />,
      color: "purple",
    },
  ];

  // Detailed features data
  const detailedFeatures = [
    {
      id: 1,
      title: "Match Making",
      icon: <FaHeart className="text-xl text-red-500" />,
      description:
        "Find your perfect life partner through advanced compatibility matching.",
      details: [
        "Personalized preferences",
        "Compatibility analysis",
        "Verified profiles",
        "Secure communication",
        "Family matching",
      ],
      benefits: "Save time finding the right match",
    },
    {
      id: 2,
      title: "Pre-Wedding Consultation",
      icon: <FaCalendarAlt className="text-xl text-blue-500" />,
      description: "Expert guidance to prepare you for your big day.",
      details: [
        "One-on-one sessions",
        "Budget planning",
        "Timeline creation",
        "Vendor recommendations",
        "Planning checklist",
      ],
      benefits: "Start with confidence and clear direction",
    },
    {
      id: 3,
      title: "Auspicious Date Discovery",
      icon: <FaCalendar className="text-xl text-green-500" />,
      description: "Perfect wedding date based on astrological calculations.",
      details: [
        "Astrological analysis",
        "Multiple date options",
        "Tradition consideration",
        "Weather analysis",
        "Venue coordination",
      ],
      benefits: "Begin on an auspicious note",
    },
    {
      id: 4,
      title: "Priest Support",
      icon: <FaUserTie className="text-xl text-purple-500" />,
      description: "Experienced priests for traditional ceremonies.",
      details: [
        "Certified priests",
        "Tradition expertise",
        "Ceremony customization",
        "Ritual guidance",
        "Multilingual services",
      ],
      benefits: "Authentic and meaningful ceremonies",
    },
    {
      id: 5,
      title: "Location Services",
      icon: <FaMapMarkerAlt className="text-xl text-orange-500" />,
      description: "Find and book the perfect venue for your wedding.",
      details: [
        "Curated selection",
        "Site visits",
        "Budget options",
        "Capacity planning",
        "Contract negotiation",
      ],
      benefits: "Discover your dream venue",
    },
    {
      id: 6,
      title: "Event Management",
      icon: <FaCrown className="text-xl text-amber-500" />,
      description: "Professional coordination for seamless execution.",
      details: [
        "Day-of coordination",
        "Vendor management",
        "Timeline execution",
        "Guest management",
        "Emergency support",
      ],
      benefits: "Relax while professionals handle details",
    },
    {
      id: 7,
      title: "Decoration",
      icon: <FaPalette className="text-xl text-pink-500" />,
      description: "Transform your venue into a magical space.",
      details: [
        "Theme-based decor",
        "Floral arrangements",
        "Lighting design",
        "Stage setup",
        "Personalized touches",
      ],
      benefits: "Create unforgettable visual memories",
    },
    {
      id: 8,
      title: "Food/Catering",
      icon: <FaUtensils className="text-xl text-red-400" />,
      description: "Exquisite culinary experiences for all guests.",
      details: [
        "Menu customization",
        "Multiple cuisines",
        "Tasting sessions",
        "Dietary accommodation",
        "Professional staff",
      ],
      benefits: "Memorable dining experience",
    },
    {
      id: 9,
      title: "Transportation & Logistics",
      icon: <FaCar className="text-xl text-gray-600" />,
      description: "Smooth transportation solutions for everyone.",
      details: [
        "Guest transport",
        "Bride & groom vehicles",
        "Parking management",
        "Outstation coordination",
        "Logistics planning",
      ],
      benefits: "Hassle-free movement",
    },
    {
      id: 10,
      title: "Marriage Registration",
      icon: <FaFileContract className="text-xl text-green-600" />,
      description: "Complete assistance with legal documentation.",
      details: [
        "Document preparation",
        "Appointment scheduling",
        "Legal guidance",
        "Certificate collection",
        "Follow-up support",
      ],
      benefits: "Legal formalities handled efficiently",
    },
  ];

  useEffect(() => {
    const token = localStorage.getItem("vivahanamToken");
    const hasToken = !!token;
    setIsAuthenticated(hasToken);

    if (hasToken) {
      fetchUserData();
    } else {
      setLoading(false);
      setIsWeddingFormComplete(false);
    }

    // If redirected from form submission, show contact popup and mark completion for this user
    if (location.state?.formSubmitted && location.state?.selectedPlan) {
      const plan = location.state.selectedPlan;
      const planWithIcon = {
        ...plan,
        icon: getPlanIcon(plan.name),
      };
      setSelectedPlan(planWithIcon);
      setShowContactPopup(true);

      // If we already know the user (from local storage), mark completion for them
      const localUser = (() => {
        try {
          return JSON.parse(localStorage.getItem("vivahanamUser"));
        } catch {
          return null;
        }
      })();
      if (localUser) {
        setFormCompleteForUser(localUser);
        setIsWeddingFormComplete(true);
      }
    }
  }, [location]);

  // Helper function to get plan icon based on name
  const getPlanIcon = (planName) => {
    switch (planName) {
      case "Gold":
        return <FaStar className="text-yellow-600 text-2xl" />;
      case "Diamond":
        return <FaGem className="text-blue-600 text-2xl" />;
      case "Platinum":
        return <FaCrown className="text-purple-600 text-2xl" />;
      default:
        return <FaStar className="text-yellow-600 text-2xl" />;
    }
  };

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("vivahanamToken");
      if (!token) {
        throw new Error("No authentication token found. Please log in.");
      }

      const response = await fetch(`${import.meta.env.VITE_API_KEY}/user/me`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch user info");
      }

      if (data.success) {
        setUser(data.user);
        setIsAuthenticated(true);
        setIsWeddingFormComplete(isFormCompleteForUser(data.user));
        // Also verify against backend status to avoid stale local data
        checkWeddingFormStatus();
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setIsAuthenticated(false);
      setIsWeddingFormComplete(false);
    } finally {
      setLoading(false);
    }
  };

  const checkWeddingFormStatus = async () => {
    try {
      const token = localStorage.getItem("vivahanamToken");
      if (!token) return;

      const response = await fetch(
        `${import.meta.env.VITE_API_KEY}/user/wedding-form/status`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (response.ok && data.success) {
        setIsWeddingFormComplete(!!data.completed);
        if (data.completed && data.data) {
          // best-effort store for local cache
          setFormCompleteForUser(data.data);
        }
      }
    } catch (error) {
      console.error("Error checking wedding form status:", error);
    }
  };

  const handleGoForSubscription = (plan) => {
    // Create a plain object for navigation (without React elements)
    const planForNavigation = planDataForNavigation.find(
      (p) => p.id === plan.id
    );
    const planWithIcon = {
      ...planForNavigation,
      icon: getPlanIcon(plan.name),
    };

    // Not authenticated -> send to auth page, then to wedding form with selected plan
    if (!isAuthenticated) {
      navigate("/signup", {
        state: {
          redirectTo: "/Wedding-Service-Form",
          selectedPlan: planForNavigation,
          from: location.pathname,
        },
      });

      return;
    }

    // Authenticated but form not complete -> send to form
    if (!isWeddingFormComplete) {
      navigate("/Wedding-Service-Form", {
        state: {
          selectedPlan: planForNavigation,
        },
      });
      return;
    }

    // Auth + form done -> show consultant contact popup
    setSelectedPlan(planWithIcon);
    setShowContactPopup(true);
  };

  const closeContactPopup = () => {
    setShowContactPopup(false);
    setSelectedPlan(null);
  };

  // Auth flow is handled by navigating to /signup; no inline popup required

  const handleBackClick = () => {
    navigate("/PlanHomePage");
  };

  const getPlanColor = (color) => {
    const colors = {
      yellow: {
        gradient: "from-yellow-500 to-yellow-600",
      },
      blue: {
        gradient: "from-blue-500 to-blue-600",
      },
      purple: {
        gradient: "from-purple-500 to-purple-600",
      },
    };
    return colors[color] || colors.yellow;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-amber-50 via-orange-50 to-amber-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading subscription plans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-amber-50 via-orange-50 to-amber-50 pt-24">
      {/* Contact Consultant Popup */}
      {showContactPopup && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-auto transform transition-all duration-300 scale-100">
            <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-white p-6 rounded-t-2xl relative">
              <button
                onClick={closeContactPopup}
                className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-1 transition-all duration-300"
              >
                <FaTimes className="text-lg" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <FaPhone className="text-xl" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Contact Consultant</h3>
                  <p className="text-amber-100 text-sm mt-1">
                    {selectedPlan?.name} Plan Selected
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="text-center mb-6">
                <p className="text-gray-700 text-lg font-semibold mb-4">
                  Please contact our consultant via the given number:
                </p>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
                  <p className="text-2xl font-bold text-amber-700">
                    +1 214 836 4935
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Available 24/7</p>
                </div>
                <p className="text-gray-600 text-sm">
                  Thank you for submitting your wedding service form! Our
                  wedding consultant will guide you through the subscription
                  process and answer any questions you may have about the{" "}
                  {selectedPlan?.name} plan.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={closeContactPopup}
                  className="flex-1 py-3 rounded-xl border border-amber-300 text-amber-800 font-semibold text-sm hover:bg-amber-50 transition-all duration-300"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    window.open("tel:+1 214 836 4935");
                    closeContactPopup();
                  }}
                  className="flex-1 py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 shadow-md transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <FaPhone className="text-xs" />
                  Call Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header with Back Button */}

      <div className="w-full max-w-6xl mb-12 relative z-10">
        <div className="flex items-center justify-between mb-4">
          {/* Back Button - Always visible */}
          <button
            onClick={handleBackClick}
            className="flex items-center gap-2 text-amber-800 px-1 py-2 transition-all duration-300 font-semibold whitespace-nowrap"
          >
            <FaArrowLeft className="text-amber-700" />
            <span className="hidden sm:inline">Back to Plan</span>
            <span className="sm:hidden">Back</span>
          </button>

          {/* Center Title - Takes available space */}
          <div className="flex-1 text-center px-2">
            <h2 className="text-xl sm:text-2xl md:text-4xl font-bold text-amber-900 truncate">
              Choose Your Perfect Plan
            </h2>
          </div>

          {/* Empty div for balance - can adjust width for mobile */}
          <div className="w-12 sm:w-24"></div>
        </div>

        <p className="text-lg md:text-2xl text-center text-gray-700 font-semibold">
          Your Soulmate Wedding Plan
        </p>
      </div>

      {/* Plans Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl relative z-10 mb-16">
        {plansData.map((plan) => {
          const color = getPlanColor(plan.color);

          return (
            <div
              key={plan.id}
              className={`relative rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden min-h-[650px] flex flex-col group cursor-pointer transform hover:-translate-y-2 ${
                plan.highlight
                  ? "border-2 border-transparent bg-gradient-to-br from-amber-400 via-red-500 to-amber-600 p-[2px] transform scale-105 hover:scale-110"
                  : "border border-amber-200 hover:border-amber-400"
              } ${
                plan.popular
                  ? "ring-2 ring-yellow-400 hover:ring-yellow-500"
                  : ""
              }`}
            >
              <div className="bg-white rounded-xl p-6 h-full flex flex-col flex-grow relative overflow-hidden">
                {/* Premium Badge - Only for Platinum */}
                {plan.premium && (
                  <span className="absolute top-0 right-0 px-4 py-2 text-sm font-bold bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-bl-xl transform transition-all duration-300 group-hover:scale-110">
                    PREMIUM
                  </span>
                )}

                {plan.popular && (
                  <span className="absolute top-0 right-0 px-4 py-2 text-sm font-bold bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-bl-xl transform transition-all duration-300 group-hover:scale-110">
                    Popular
                  </span>
                )}

                {plan.highlight && (
                  <span className="absolute top-0 right-0 px-4 py-2 text-sm font-bold bg-gradient-to-r from-red-500 to-red-600 text-white rounded-bl-xl transform transition-all duration-300 group-hover:scale-110">
                    Best Value
                  </span>
                )}

                {/* Hover gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-transparent group-hover:from-amber-50/20 group-hover:via-orange-50/10 group-hover:to-amber-50/30 transition-all duration-500 pointer-events-none"></div>

                <div className="flex items-center justify-center mb-4 mt-2 transform transition-all duration-300 group-hover:scale-110">
                  {plan.icon}
                </div>

                <h4 className="text-2xl font-bold mb-4 text-center text-amber-900 transform transition-all duration-300 group-hover:text-amber-800">
                  {plan.name}
                </h4>

                <p className="text-base mb-6 leading-relaxed text-center text-gray-600 min-h-[3rem] transform transition-all duration-300 group-hover:text-gray-800">
                  {plan.description}
                </p>

                <div className="w-20 h-1 bg-gradient-to-r from-amber-500 to-red-600 mx-auto mb-6 rounded-full transform transition-all duration-300 group-hover:w-24 group-hover:from-amber-600 group-hover:to-red-700"></div>

                <ul className="space-y-3 mb-8 flex-grow text-sm relative">
                  {plan.features.map((feature, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3 transform transition-all duration-300 group-hover:translate-x-1"
                      style={{ transitionDelay: `${idx * 50}ms` }}
                    >
                      {feature.included ? (
                        <FaCheckCircle className="text-green-600 mt-0.5 flex-shrink-0 text-base transform transition-all duration-300 group-hover:scale-125 group-hover:text-green-700" />
                      ) : (
                        <FaTimesCircle className="text-gray-400 mt-0.5 flex-shrink-0 text-base transform transition-all duration-300 group-hover:scale-125" />
                      )}
                      <span
                        className={`transform transition-all duration-300 ${
                          feature.included
                            ? "text-gray-800 font-medium group-hover:text-gray-900 group-hover:font-semibold"
                            : "text-gray-400 group-hover:text-gray-500"
                        }`}
                      >
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Subscribe Button */}
                <div className="mt-auto pt-4 relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  <button
                    className={`w-full py-4 rounded-xl font-bold text-white transition-all duration-300 text-lg bg-gradient-to-r ${color.gradient} hover:shadow-xl transform hover:scale-105 relative overflow-hidden group-hover:shadow-lg group-hover:from-amber-700 group-hover:to-amber-800`}
                    onClick={() => handleGoForSubscription(plan)}
                  >
                    <span className="relative z-10">Select Plan</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Features Section */}
      <div className="w-full max-w-6xl relative z-10 mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-amber-900">
            Our Comprehensive Services
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Discover all the features we offer to make your wedding planning
            seamless and memorable
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {detailedFeatures.map((feature) => (
            <div
              key={feature.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-amber-300 group p-5"
            >
              {/* Feature Icon and Title */}
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-amber-50 rounded-lg flex items-center justify-center group-hover:bg-amber-100 transition-all duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-amber-900">
                  {feature.title}
                </h3>
              </div>

              {/* Feature Description */}
              <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                {feature.description}
              </p>

              {/* Feature Details */}
              <ul className="space-y-2 mb-4">
                {feature.details.map((detail, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <FaCheckCircle className="text-green-500 mt-0.5 flex-shrink-0 text-xs" />
                    <span className="text-gray-700 text-xs">{detail}</span>
                  </li>
                ))}
              </ul>

              {/* Benefits */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-md p-3 border border-amber-200">
                <p className="text-amber-800 text-xs font-semibold text-center">
                  {feature.benefits}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlans;
