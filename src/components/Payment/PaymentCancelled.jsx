// Ye page user ko tab dikhata hai jab user PayPal ya payment screen se payment cancel karke wapas aa jata hai.

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { XCircle } from 'lucide-react';

const PaymentCancelled = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to credit store after 3 seconds
    const timer = setTimeout(() => {
      navigate('/credit-store');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Payment Cancelled</h1>
        <p className="text-gray-600 mb-4">
          Your payment was cancelled. No charges were made to your account.
        </p>
        <p className="text-sm text-gray-500">
          Redirecting you back to the credit store...
        </p>
      </div>
    </div>
  );
};

export default PaymentCancelled;