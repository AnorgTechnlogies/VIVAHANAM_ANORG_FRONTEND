// Aapka plan activate ho chuka hai, Credits account me add ho gaye hain ,Aap ab premium features use kar sakte ho

import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Sparkles, Download, Share2, Home } from 'lucide-react';

const PaymentSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { plan, transactionId, credits, paymentMethod, isTest } = location.state || {};

  useEffect(() => {
    if (!plan) {
      navigate('/credit-store');
    }
  }, [plan, navigate]);

  if (!plan) {
    return null;
  }

  const handleDownloadReceipt = () => {
    // Implement receipt download logic
    alert('Receipt download feature coming soon!');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Purchase Successful - Vivahanam',
        text: `I just purchased ${plan.name} with ${credits} credits!`,
        url: window.location.href,
      });
    } else {
      alert('Share feature not supported in your browser');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Success Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-8 text-center text-white">
            <CheckCircle className="w-20 h-20 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
            <p className="text-green-100">Your plan has been activated successfully</p>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Plan Details */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{plan.name}</h2>
              <p className="text-gray-600 mb-4">{plan.tagline}</p>
              
              <div className="inline-flex items-center gap-2 bg-blue-50 rounded-full px-4 py-2 mb-4">
                <Sparkles className="w-5 h-5 text-blue-600" />
                <span className="text-xl font-bold text-blue-600">+{credits} credits</span>
              </div>
            </div>

            {/* Transaction Details */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Transaction Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Transaction ID:</span>
                  <span className="font-mono text-gray-800">{transactionId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Method:</span>
                  <span className="font-semibold text-gray-800">
                    {isTest ? 'Test Mode' : paymentMethod === 'wallet' ? 'Wallet' : 'PayPal'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount Paid:</span>
                  <span className="font-semibold text-gray-800">${plan.price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Validity:</span>
                  <span className="font-semibold text-gray-800">{plan.validity} {plan.validityUnit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-semibold text-gray-800">{new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Test Mode Notice */}
            {isTest && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2 text-yellow-800">
                  <Sparkles className="w-5 h-5" />
                  <span className="font-semibold">Test Mode</span>
                </div>
                <p className="text-yellow-700 text-sm mt-1">
                  This was a demo transaction. No real payment was processed.
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={handleDownloadReceipt}
                className="flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold transition-colors hover:bg-gray-50"
              >
                <Download className="w-4 h-4" />
                Receipt
              </button>
              
              <button
                onClick={handleShare}
                className="flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold transition-colors hover:bg-gray-50"
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
              
              <button
                onClick={() => navigate('/')}
                className="flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-lg font-semibold transition-colors hover:bg-blue-700"
              >
                <Home className="w-4 h-4" />
                Go Home
              </button>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">What's Next?</h3>
          <div className="space-y-3 text-sm text-gray-600">
            <p>✅ Your {credits} credits have been added to your account</p>
            <p>✅ You can now browse profiles and use premium features</p>
            <p>✅ Credits are valid for {plan.validity} days</p>
            <p>✅ Check your updated balance in the top navigation</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;