import React, { useEffect, useState } from "react";
import { Sparkles, Crown, Star, Zap, Eye, ShieldCheck, Timer, Info, X, CreditCard, Loader, WifiOff, CheckCircle } from "lucide-react";

const PENDING_PLAN_KEY = "vivahanamPendingPlan";

const PLAN_THEMES = {
  starter: { gradient: "from-green-500 via-green-600 to-emerald-600", icon: Star, iconColor: "text-green-500" },
  standard: { gradient: "from-blue-500 via-blue-600 to-indigo-600", icon: Sparkles, iconColor: "text-blue-500" },
  monthly: { gradient: "from-emerald-500 via-green-600 to-teal-600", icon: Sparkles, iconColor: "text-emerald-500" },
  premium: { gradient: "from-purple-500 via-purple-600 to-pink-600", icon: Crown, iconColor: "text-purple-500" },
  family: { gradient: "from-amber-500 via-orange-600 to-red-600", icon: Zap, iconColor: "text-amber-500" },
  default: { gradient: "from-slate-500 via-slate-600 to-slate-700", icon: Sparkles, iconColor: "text-slate-300" },
};

const FALLBACK_PLANS = [
  {
    id: "starter",
    name: "Starter Pack",
    tagline: "Perfect for beginners",
    price: 30,
    credits: 10,
    profiles: 10,
    users: 1,
    validity: 60,
    validityUnit: "days",
    popular: false,
    features: ["10 Profile Views", "Basic Matching", "Email Support", "60 Days Validity"],
    gradient: "from-green-500 via-green-600 to-emerald-600",
    icon: Star,
    iconColor: "text-green-500",
    currency: "USD",
    creditRate: "$3.00 per profile",
    summary: [
      "10 credits valid for 60 days",
      "Perfect for users starting their journey",
      "Basic matching features included"
    ]
  },
  {
    id: "standard",
    name: "Standard Pack",
    tagline: "Great value for regular users",
    price: 60,
    credits: 25,
    profiles: 25,
    users: 1,
    validity: 120,
    validityUnit: "days",
    popular: false,
    features: ["25 Profile Views", "Advanced Matching", "Priority Support", "4 Months Validity"],
    gradient: "from-blue-500 via-blue-600 to-indigo-600",
    icon: Sparkles,
    iconColor: "text-blue-500",
    currency: "USD",
    creditRate: "$2.40 per profile",
    summary: [
      "25 credits valid for 120 days",
      "Best value for active users",
      "Priority customer support"
    ]
  },
  {
    id: "premium",
    name: "Premium Pack",
    tagline: "Maximum features unlocked",
    price: 120,
    credits: 60,
    profiles: 60,
    users: 1,
    validity: 180,
    validityUnit: "days",
    popular: false,
    features: ["60 Profile Views", "Premium Matching", "24/7 Support", "6 Months Validity", "Profile Highlight"],
    gradient: "from-purple-500 via-purple-600 to-pink-600",
    icon: Crown,
    iconColor: "text-purple-500",
    currency: "USD",
    creditRate: "$2.00 per profile",
    summary: [
      "60 credits valid for 180 days",
      "Premium features unlocked",
      "24/7 dedicated support"
    ]
  },
  {
    id: "family",
    name: "Family Pack",
    tagline: "Best value for families",
    price: 400,
    credits: 300,
    profiles: 300,
    users: 5,
    validity: 365,
    validityUnit: "days",
    popular: false,
    bestValue: true,
    features: ["300 Profile Views", "Family Management", "Dedicated Manager", "1 Year Validity", "All Premium Features"],
    gradient: "from-amber-500 via-orange-600 to-red-600",
    icon: Zap,
    iconColor: "text-amber-500",
    currency: "USD",
    creditRate: "$1.33 per profile",
    summary: [
      "300 credits valid for 1 year",
      "Family management for up to 5 users",
      "Dedicated account manager"
    ]
  }
];

// Enhanced fetch with timeout
const enhancedFetch = async (url, options = {}, timeout = 10000) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};

// Plan Summary Modal Component
const PlanSummaryModal = ({ plan, onClose }) => {
  if (!plan) return null;

  const Icon = plan.icon || Sparkles;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex-shrink-0 flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg bg-gradient-to-r ${plan.gradient}`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{plan.name} - Plan Details & Policies</h2>
              <p className="text-gray-600">Complete information about this plan</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-amber-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Plan Overview</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-gray-600">Profiles Included</span>
                    <span className="text-xl font-bold text-amber-600">{plan.profiles}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-gray-600">Price</span>
                    <span className="text-xl font-bold text-gray-800">${plan.price}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-gray-600">Validity Period</span>
                    <span className="text-lg font-semibold text-gray-700">
                      {plan.validity} {plan.validityUnit}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-gray-600">Users</span>
                    <span className="text-lg font-semibold text-gray-700">3</span>
                  </div>
                  {plan.creditRate && (
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-gray-600">Cost per Profile</span>
                      <span className="text-lg font-semibold text-amber-600">{plan.creditRate}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-amber-800 mb-3">Plan Benefits</h3>
                <ul className="space-y-2">
                  {plan.summary.map((point, index) => (
                    <li key={index} className="flex items-start gap-3 text-amber-700">
                      <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Plan Features</h3>
                <div className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-amber-500 rounded-full flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-amber-800 mb-3">📋 Plan Policies & Terms</h3>
                <div className="space-y-4 text-amber-700">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong>Refund Policy:</strong> All plan purchases are final and non-refundable.
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Timer className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong>Validity Period:</strong> Plan credits are valid for {plan.validity} days from purchase.
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong>Credit Usage:</strong> Each profile view costs 1 credit.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-shrink-0 flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors font-medium"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};

// Payment Page Component
const PaymentPage = ({ selectedPackage, onBack, onPaymentComplete }) => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const API_URL = import.meta.env.VITE_API_KEY;

  const handlePayPalPayment = async () => {
    if (!selectedPackage) return;

    try {
      setLoading(true);
      setErrorMessage("");

      const token = localStorage.getItem("vivahanamToken");
      if (!token) {
        throw new Error("Authentication required. Please log in again.");
      }

      const response = await enhancedFetch(`${API_URL}/payment/create-paypal-order`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          planKey: selectedPackage.id,
          planCode: selectedPackage.planCode || selectedPackage.id,
          amount: selectedPackage.price,
          currency: selectedPackage.currency || 'USD'
        }),
      }, 15000);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response:', errorText);
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || "Failed to create PayPal order");
      }
      
      console.log('✅ PayPal order created successfully:', data);
      
      // Redirect to PayPal approval URL
      if (data.approvalUrl) {
        window.location.href = data.approvalUrl;
      } else if (data.orderID) {
        window.location.href = `https://www.sandbox.paypal.com/checkoutnow?token=${data.orderID}`;
      } else {
        throw new Error('No PayPal approval URL received');
      }
      
      return data;
    } catch (error) {
      console.error("❌ PayPal order creation failed:", error);
      let errorMessage = "Payment failed. Please try again.";
      
      if (error.name === 'AbortError') {
        errorMessage = "Request timeout. Please check your connection and try again.";
      } else if (error.message.includes('Failed to fetch')) {
        errorMessage = "Network error. Please check your internet connection.";
      } else if (error.message.includes('Authentication')) {
        errorMessage = "Session expired. Please log in again.";
      } else if (error.message.includes('credentials')) {
        errorMessage = "Payment system temporarily unavailable. Please contact support.";
      } else {
        errorMessage = error.message || errorMessage;
      }
      
      setErrorMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const Icon = selectedPackage?.icon || Sparkles;

  return (
    <div className="min-h-screen bg-amber-100 py-8 px-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-amber-600 hover:text-amber-700 mb-6"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Plans
          </button>
          
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Complete Payment</h1>
          <p className="text-gray-600">Secure payment for your selected plan</p>
        </div>

        {/* Plan Summary Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border border-amber-200">
          <div className="flex items-center gap-4 mb-4">
            <div className={`p-3 rounded-xl bg-gradient-to-r ${selectedPackage?.gradient || 'from-amber-500 to-amber-600'}`}>
              <Icon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">{selectedPackage?.name}</h2>
              <p className="text-gray-600 text-sm">{selectedPackage?.tagline}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center p-3 bg-amber-50 rounded-lg">
              <div className="text-2xl font-bold text-amber-600">{selectedPackage?.profiles}</div>
              <div className="text-sm text-gray-600">Profiles</div>
            </div>
            <div className="text-center p-3 bg-amber-50 rounded-lg">
              <div className="text-2xl font-bold text-amber-600">{selectedPackage?.validity}</div>
              <div className="text-sm text-gray-600">Days</div>
            </div>
          </div>

          <div className="text-center p-4 bg-amber-50 rounded-xl">
            <div className="text-3xl font-bold text-gray-800">${selectedPackage?.price}</div>
            <div className="text-sm text-gray-600">Total Amount</div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Method</h3>
          
          <div className="border-2 border-amber-500 bg-amber-50 rounded-xl p-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-8 bg-amber-900 rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">PayPal</span>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-800">Pay with PayPal</p>
                <p className="text-xs text-gray-600">Secure payment processed through PayPal</p>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
              <div className="flex items-center gap-2">
                <X className="w-4 h-4 text-red-600 flex-shrink-0" />
                <p className="text-sm text-red-700">{errorMessage}</p>
              </div>
            </div>
          )}

          {/* PayPal Button */}
          <button
            onClick={handlePayPalPayment}
            disabled={loading}
            className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-gray-400 text-white py-4 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl disabled:shadow-none disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {loading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                <span>Processing Payment...</span>
              </>
            ) : (
              <>
                <div className="w-6 h-6 bg-white rounded flex items-center justify-center">
                  <span className="text-amber-600 font-bold text-xs">P</span>
                </div>
                <span>Pay ${selectedPackage?.price} with PayPal</span>
              </>
            )}
          </button>
        </div>

        {/* Security Notice */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <ShieldCheck className="w-4 h-4" />
            <span>Secure SSL encrypted payment</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const CreditStore = ({ user, Balance, setBalance, checkAuthAndRedirect, navigate, planSummary, refreshPlanSummary }) => {
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [showPaymentPage, setShowPaymentPage] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState("");
  const [plans, setPlans] = useState(FALLBACK_PLANS);
  const [catalogLoading, setCatalogLoading] = useState(false);
  const [catalogError, setCatalogError] = useState("");
  const [networkStatus, setNetworkStatus] = useState('online');
  const [showPlanSummary, setShowPlanSummary] = useState(false);
  const [selectedPlanSummary, setSelectedPlanSummary] = useState(null);
  const API_URL = import.meta.env.VITE_API_KEY;

  // Check network status
  useEffect(() => {
    const handleOnline = () => {
      setNetworkStatus('online');
    };
    
    const handleOffline = () => {
      setNetworkStatus('offline');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Fetch plan catalog
  useEffect(() => {
    const fetchPlanCatalog = async () => {
      if (networkStatus === 'offline') {
        setCatalogError("No internet connection. Showing offline pricing.");
        setPlans(FALLBACK_PLANS);
        return;
      }

      setCatalogLoading(true);
      setCatalogError("");
      try {
        const token = localStorage.getItem("vivahanamToken");
        const response = await enhancedFetch(`${API_URL}/userplan/catalog`, {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json",
          },
        }, 15000);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (!data.success) {
          throw new Error(data.message || "Unable to load plans");
        }

        const normalized = (data.data?.plans || []).map((plan) => {
          const key = (plan.planCode || plan.id || "").toLowerCase();
          const theme = PLAN_THEMES[key] || PLAN_THEMES.default;
          const profiles = plan.profiles || plan.profilesAllocated;
          const price = plan.price || plan.planPrice;
          
          return {
            id: key,
            name: plan.planName || plan.planDisplayName || plan.displayName || plan.planCode,
            tagline: plan.tagline || plan.description || "Access premium matchmaking tools",
            price: price,
            credits: profiles,
            profiles: profiles,
            users: plan.users || 1,
            validity: plan.validityDays || plan.validForDays || 30,
            validityUnit: "days",
            popular: key === "standard",
            bestValue: key === "family",
            features: plan.features || plan.plan_features || [],
            gradient: theme.gradient,
            icon: theme.icon,
            iconColor: theme.iconColor,
            planCode: plan.planCode,
            currency: plan.currency || plan.planCurrency || "USD",
            creditRate: `$${(price / profiles).toFixed(2)} per profile`,
            summary: plan.summary || [
              `${profiles} credits valid for ${plan.validityDays || 30} days`,
              "Access all premium features during validity period"
            ]
          };
        });
        setPlans(normalized.length > 0 ? normalized : FALLBACK_PLANS);
      } catch (err) {
        console.warn("Plan catalog fallback:", err);
        setCatalogError(err.message || "Showing offline pricing");
        setPlans(FALLBACK_PLANS);
      } finally {
        setCatalogLoading(false);
      }
    };

    fetchPlanCatalog();
  }, [API_URL, networkStatus]);

  const handleBuyPlan = async (plan) => {
    const ok = await checkAuthAndRedirect({
      redirectTo: "/payas",
      pendingPlan: plan,
    });
    if (!ok) return;
    if (networkStatus === 'offline') {
      alert("No internet connection. Please check your network and try again.");
      return;
    }
    setSelectedPackage(plan);
    setShowPaymentPage(true);
  };

  // Resume pending purchase after login/registration
  useEffect(() => {
    const rawPending = localStorage.getItem(PENDING_PLAN_KEY);
    if (!rawPending) return;
    if (!user || !user.profileCompleted) return;

    try {
      const parsed = JSON.parse(rawPending);
      const pendingPlan = parsed?.plan;
      if (!pendingPlan) {
        localStorage.removeItem(PENDING_PLAN_KEY);
        return;
      }

      const matchedPlan =
        plans.find(
          (plan) =>
            plan.id === pendingPlan.id ||
            plan.planCode === pendingPlan.planCode ||
            plan.planCode === pendingPlan.id ||
            plan.id === pendingPlan.planCode
        ) || pendingPlan;

      if (networkStatus === "offline") return;

      setSelectedPackage(matchedPlan);
      setShowPaymentPage(true);
      localStorage.removeItem(PENDING_PLAN_KEY);
    } catch (err) {
      console.warn("Failed to resume pending plan:", err);
      localStorage.removeItem(PENDING_PLAN_KEY);
    }
  }, [plans, user, networkStatus]);

  const handleShowPlanSummary = (plan) => {
    setSelectedPlanSummary(plan);
    setShowPlanSummary(true);
  };

  const handleBackFromPayment = () => {
    setShowPaymentPage(false);
    setSelectedPackage(null);
  };

  // If we're on the payment page, render the PaymentPage component
  if (showPaymentPage && selectedPackage) {
    return (
      <PaymentPage
        selectedPackage={selectedPackage}
        onBack={handleBackFromPayment}
        onPaymentComplete={() => {
          setShowPaymentPage(false);
          setSelectedPackage(null);
        }}
      />
    );
  }

  // Otherwise render the main credit store
  return (
    <div className="min-h-screen bg-amber-100 py-4 sm:py-8 px-3 sm:px-4">
      <div className="max-w-6xl mx-auto">
        {/* Network Status Banner */}
        {networkStatus === 'offline' && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg flex items-center justify-center gap-2">
            <WifiOff className="w-4 h-4 text-red-600" />
            <span className="text-sm text-red-700 font-medium">You are currently offline</span>
          </div>
        )}
        
        {/* Header Section */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-3xl font-bold text-gray-800 mb-2">
            Plan Store
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
            Choose the perfect plan to unlock premium features and connect with potential matches
          </p>
          
          {/* Balance Display */}
          <div className="inline-flex items-center gap-2 bg-white rounded-lg px-4 py-2 sm:px-6 sm:py-3 shadow-sm border border-amber-200">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
            <div>
              <span className="text-xs sm:text-sm text-gray-600">Profiles remaining:</span>
              <span className="text-lg sm:text-xl font-bold text-amber-600 ml-1 sm:ml-2">
                {Balance}
              </span>
            </div>
          </div>
          
          {planSummary && (
            <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
              <div className="flex items-center gap-1 sm:gap-2">
                <ShieldCheck className="w-3 h-3 sm:w-4 sm:h-4 text-amber-600" />
                <span>{planSummary.planName}</span>
              </div>
              {planSummary.expiresAt && (
                <div className="flex items-center gap-1 sm:gap-2">
                  <Timer className="w-3 h-3 sm:w-4 sm:h-4 text-amber-600" />
                  <span>
                    Expires on{" "}
                    {new Date(planSummary.expiresAt).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          )}
          
          {purchaseSuccess && (
            <div className="mt-3 sm:mt-4 bg-green-50 border border-green-200 text-green-700 rounded-lg px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm">
              {purchaseSuccess}
            </div>
          )}
          
          <div className="mt-3 sm:mt-4 flex items-center gap-1 sm:gap-2 text-xs text-gray-500">
            <Info className="w-3 h-3 sm:w-4 sm:h-4 text-amber-500" />
            <span className="text-xs">Each profile view costs 1 profile. Choose a plan that fits your needs.</span>
          </div>
        </div>

       
        
        {catalogLoading ? (
          <div className="py-8 sm:py-12 text-center text-xs sm:text-sm text-gray-500">
            <Loader className="w-8 h-8 sm:w-12 sm:h-12 animate-spin mx-auto mb-2 sm:mb-3 text-amber-600" />
            Loading plans...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12 max-w-7xl mx-auto">
            {plans.map((plan) => {
              const Icon = plan.icon || Sparkles;
              const isFamilyPlan = plan.id === "family";
              const isBestValue = plan.bestValue;

              return (
                <div
                  key={plan.id}
                  className={`relative bg-white rounded-lg sm:rounded-xl overflow-hidden transition-all duration-200 hover:shadow-lg h-full flex flex-col
                    ${isFamilyPlan ? 'border-3 border-green-500 shadow-md' : 'border border-amber-200'}
                  `}
                >
                  {/* BEST VALUE badge - ONLY for Family plan */}
                  {isBestValue && isFamilyPlan && (
                    <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-center py-1.5 text-xs font-bold z-10">
                      ✨ BEST VALUE
                    </div>
                  )}

                  <div className={`p-4 sm:p-5 flex-1 flex flex-col ${isBestValue && isFamilyPlan ? 'mt-6 sm:mt-7' : ''}`}>
                    {/* Plan Header */}
                    <div className="text-center mb-4">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-1">{plan.name}</h3>
                      <p className="text-xs text-gray-500">{plan.tagline}</p>
                    </div>

                    {/* Profiles Display */}
                    <div className="text-center mb-4">
                      <div className={`text-3xl sm:text-4xl font-bold mb-1 ${isFamilyPlan ? 'text-green-600' : 'text-amber-600'}`}>
                        {plan.profiles}
                      </div>
                      <div className="text-sm text-gray-600 font-medium">Profiles</div>
                    </div>

                    {/* Price Display */}
                    <div className="text-center mb-4">
                      <div className="text-2xl sm:text-3xl font-bold text-gray-800">
                        ${plan.price}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {plan.validity} days validity
                      </div>
                      {plan.creditRate && (
                        <div className={`text-xs font-medium mt-1 ${isFamilyPlan ? 'text-green-600' : 'text-amber-600'}`}>
                          {plan.creditRate}
                        </div>
                      )}
                    </div>

                    {/* Features List */}
                    <div className="space-y-2 mb-3 flex-1">
                      {plan.features.slice(0, 3).map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 text-xs text-gray-600">
                          <span className={`text-xs ${isFamilyPlan ? 'text-green-500' : 'text-amber-500'}`}>✓</span>
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2">
                      {/* Purchase Button */}
                      <button
                        onClick={() => handleBuyPlan(plan)}
                        disabled={networkStatus === 'offline'}
                        className={`w-full py-3 rounded-lg font-semibold text-white transition-colors text-sm
                          ${isFamilyPlan 
                            ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700' 
                            : 'bg-amber-600 hover:bg-amber-700'
                          }
                          ${networkStatus === 'offline' ? 'opacity-50 cursor-not-allowed' : ''}
                        `}
                      >
                        {networkStatus === 'offline' ? 'Offline' : 'Purchase Plan'}
                      </button>

                      {/* View Details Button */}
                      <button
                        onClick={() => handleShowPlanSummary(plan)}
                        className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg font-medium transition-colors text-xs border
                          ${isFamilyPlan 
                            ? 'text-green-700 hover:text-green-800 hover:bg-green-50 border-green-300' 
                            : 'text-gray-600 hover:text-gray-800 hover:bg-amber-100 border-amber-300'
                          }
                        `}
                      >
                        <Eye className="w-4 h-4" />
                        View Plan Details & Policies
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Plan Summary Modal */}
      {showPlanSummary && selectedPlanSummary && (
        <PlanSummaryModal 
          plan={selectedPlanSummary} 
          onClose={() => {
            setShowPlanSummary(false);
            setSelectedPlanSummary(null);
          }} 
        />
      )}
    </div>
  );
};

export default CreditStore;