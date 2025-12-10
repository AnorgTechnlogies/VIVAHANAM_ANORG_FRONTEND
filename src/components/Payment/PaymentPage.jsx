// ➡️ Ye page user ko selected plan ka payment complete karne ka option deta hai.


import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CreditCard, Sparkles, ShieldCheck, Loader, ArrowLeft, WifiOff, CheckCircle, Lock } from 'lucide-react';

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedPlan, userBalance } = location.state || {};
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [networkStatus, setNetworkStatus] = useState('online');
  const API_URL = import.meta.env.VITE_API_KEY;

  useEffect(() => {
    console.log("Payment page loaded with plan:", selectedPlan);
    if (!selectedPlan) {
      console.log("No plan selected, redirecting...");
      navigate('/credit-store');
    }
  }, [selectedPlan, navigate]);

  // Check network status
  useEffect(() => {
    const handleOnline = () => setNetworkStatus('online');
    const handleOffline = () => setNetworkStatus('offline');
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Handle PayPal Payment with Credit/Debit Card
  const handlePayPalPayment = async () => {
    console.log("PayPal payment with card initiated");
    
    if (networkStatus === 'offline') {
      setError("No internet connection. Please check your network.");
      return;
    }

    try {
      setLoading(true);
      setError('');

      const token = localStorage.getItem("vivahanamToken");
      if (!token) {
        throw new Error("Authentication required. Please log in again.");
      }

      console.log("Creating PayPal order for card payment...");

      const response = await fetch(`${API_URL}/payment/create-paypal-order`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          planKey: selectedPlan.id,
          planCode: selectedPlan.planCode || selectedPlan.id,
          amount: selectedPlan.price,
          currency: selectedPlan.currency || 'USD'
        }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || "Failed to create payment order");
      }

      console.log("PayPal order created:", data.orderID);

      // Redirect to PayPal for card payment
      if (data.orderID) {
        window.location.href = `https://www.sandbox.paypal.com/checkoutnow?token=${data.orderID}`;
      }
      
    } catch (error) {
      console.error("❌ Payment failed:", error);
      setError(error.message || "Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!selectedPlan) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-600" />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  const Icon = selectedPlan.icon || Sparkles;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8">
      <div className="max-w-md mx-auto px-4">
        {/* Header */}
        <div className="mb-8 text-center">
          <button
            onClick={() => navigate('/credit-store')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 mx-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Plans
          </button>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Complete Payment</h1>
          <p className="text-gray-600">Secure payment processed by PayPal</p>
        </div>

        {/* Network Status */}
        {networkStatus === 'offline' && (
          <div className="mb-6 p-4 bg-red-100 border border-red-300 rounded-xl flex items-center gap-3">
            <WifiOff className="w-5 h-5 text-red-600 flex-shrink-0" />
            <div>
              <p className="font-medium text-red-800">No Internet Connection</p>
              <p className="text-sm text-red-600">Please check your network and try again</p>
            </div>
          </div>
        )}

        {/* Plan Summary Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <Icon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{selectedPlan.name}</h2>
                <p className="text-blue-100">{selectedPlan.tagline}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-white/20 rounded-lg p-3">
                <div className="text-2xl font-bold">${selectedPlan.price}</div>
                <div className="text-blue-100 text-sm">Total Amount</div>
              </div>
              <div className="bg-white/20 rounded-lg p-3">
                <div className="text-2xl font-bold">{selectedPlan.credits}</div>
                <div className="text-blue-100 text-sm">Credits</div>
              </div>
            </div>
          </div>

          {/* Plan Details */}
          <div className="p-6">
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Plan Duration</span>
                <span className="font-semibold">{selectedPlan.validity} {selectedPlan.validityUnit}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Profile Views</span>
                <span className="font-semibold">{selectedPlan.profiles}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Current Balance</span>
                <span className="font-semibold text-blue-600">{userBalance} credits</span>
              </div>
            </div>

            {/* Features */}
            <div className="bg-blue-50 rounded-xl p-4">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Included Features
              </h4>
              <div className="space-y-2">
                {selectedPlan.features.slice(0, 3).map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Payment Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-2 h-6 bg-blue-600 rounded-full"></div>
            <h3 className="text-xl font-bold text-gray-800">Payment Method</h3>
          </div>

          {/* Credit/Debit Card Option */}
          <div className="border-2 border-blue-500 bg-blue-50 rounded-xl p-5 mb-6">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                <CreditCard className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-800 text-lg">Credit/Debit Card</h4>
                <p className="text-sm text-gray-600">Secure payment by PayPal</p>
              </div>
              <div className="flex gap-1">
                <div className="w-6 h-4 bg-blue-500 rounded-sm"></div>
                <div className="w-6 h-4 bg-yellow-400 rounded-sm"></div>
                <div className="w-6 h-4 bg-red-500 rounded-sm"></div>
                <div className="w-6 h-4 bg-blue-800 rounded-sm"></div>
              </div>
            </div>
            
            <p className="text-xs text-gray-600">
              All major credit and debit cards accepted. Your payment is securely processed through PayPal.
            </p>
          </div>

          {/* Payment Button */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl">
              <div className="flex items-center gap-2 text-red-700">
                <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                <p className="text-sm font-medium">{error}</p>
              </div>
            </div>
          )}

          <button
            onClick={handlePayPalPayment}
            disabled={loading || networkStatus === 'offline'}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 text-white py-4 rounded-xl font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:shadow-none disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {loading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                <span>Processing Payment...</span>
              </>
            ) : (
              <>
                <Lock className="w-5 h-5" />
                <span>Pay ${selectedPlan.price}</span>
              </>
            )}
          </button>

          {/* Security Badge */}
          <div className="mt-4 flex items-center justify-center gap-3 text-xs text-gray-500">
            <ShieldCheck className="w-4 h-4 text-green-600" />
            <span>256-bit SSL secured payment</span>
          </div>
        </div>

        {/* Additional Info */}
        <div className="text-center text-xs text-gray-500 space-y-1">
          <p>You will be redirected to PayPal to complete your payment</p>
          <p>All transactions are secure and encrypted</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;