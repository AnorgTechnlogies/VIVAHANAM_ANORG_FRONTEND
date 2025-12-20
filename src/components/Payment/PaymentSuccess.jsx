// Aapka plan activate ho chuka hai, Credits account me add ho gaye hain ,Aap ab premium features use kar sakte ho

import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Sparkles, Download, Share2, Home } from 'lucide-react';
import jsPDF from 'jspdf';


const API_URL = import.meta.env.VITE_API_KEY;

const PaymentSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Initial state (wallet / test cases jahan navigate ke through state aata hai)
  const initialState = location.state || {};

  const [plan, setPlan] = useState(initialState.plan || null);
  const [transactionId, setTransactionId] = useState(initialState.transactionId || null);
  const [credits, setCredits] = useState(initialState.credits || 0);
  const [paymentMethod, setPaymentMethod] = useState(initialState.paymentMethod || 'paypal');
  const [isTest, setIsTest] = useState(initialState.isTest || false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const hasCapturedRef = useRef(false);

  useEffect(() => {
    // Agar state se plan aaya hai (wallet / internal test), toh direct UI dikha do
    if (initialState.plan) {
      return;
    }

    // PayPal redirect ke query params se orderID (token) aur transactionId nikaalo
    const params = new URLSearchParams(location.search);
    const orderID = params.get('token');           // PayPal order ID
    const txIdFromQuery = params.get('transactionId');

    // Agar query params hi nahi mile, toh credit-store pe wapas bhej do
    if (!orderID || !txIdFromQuery) {
      navigate('/credit-store');
      return;
    }

    const token = localStorage.getItem('vivahanamToken');
    if (!token) {
      setError('Session expired. Please login again.');
      return;
    }

    const capturePayment = async () => {
      if (hasCapturedRef.current) return; // StrictMode / double-render se bachne ke liye
      hasCapturedRef.current = true;
      try {
        setLoading(true);
        setError('');

        const response = await fetch(`${API_URL}/payment/capture-paypal-order`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            orderID,
            transactionId: txIdFromQuery,
          }),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || 'Payment capture failed');
        }

        // Backend se summarized plan + transaction data aata hai (buildPlanSummary se)
        const userPlan = data.data?.userPlan || {};
        const updatedTransaction = data.data?.transaction || {};

        // ⚙️ Plan details fully dynamic (MatchmakingPlan / UserPlan se)
        setPlan({
          name: userPlan.planName || userPlan.planCode || 'Purchased Plan',
          tagline: 'Your plan is now active.',
          // buildPlanSummary.price -> amount, fallback transaction amount
          price: userPlan.price || updatedTransaction.amount || 0,
          // buildPlanSummary.validForDays -> plan validity in days
          validity: userPlan.validForDays || '',
          validityUnit: 'days',
        });

        // Credits: sirf NAYA purchased plan dikhana hai (carry-forward mix nahi)
        // Prefer transaction.purchasedProfiles (backend me set kiya gaya),
        // fallback: userPlan.profilesAllocated (current plan ka allocation),
        // last fallback: creditsAllocated (agar kuch bhi na mile).
        setCredits(
          updatedTransaction.purchasedProfiles ??
          userPlan.profilesAllocated ??
          updatedTransaction.creditsAllocated ??
          0
        );

        setTransactionId(updatedTransaction._id || txIdFromQuery);
        setPaymentMethod('paypal');
        setIsTest(false);
      } catch (err) {
        console.error('Payment capture error:', err);
        setError(err.message || 'Payment capture failed. Please contact support.');
      } finally {
        setLoading(false);
      }
    };

    capturePayment();
  }, [initialState.plan, location.search, navigate]);


const generateReceiptPDF = () => {
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Pure White Background
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Red Accent Header Bar
  doc.setFillColor(220, 38, 38); // red-600
  doc.rect(0, 0, pageWidth, 40, 'F');

  // Vivahanam Logo/Text in White on Red Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(28);
  doc.setTextColor(255, 255, 255);
  doc.text('Vivahanam', pageWidth / 2, 25, { align: 'center' });

  // Tagline below header
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.setTextColor(255,255,255);
  doc.text('Trusted Matrimony Platform', pageWidth / 2, 35, { align: 'center' });

  // Official Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(0, 0, 0); // Black
  doc.text('OFFICIAL PAYMENT RECEIPT', pageWidth / 2, 55, { align: 'center' });

  doc.setFontSize(10);
  doc.setTextColor(80, 80, 80);
  doc.text('(Not a Tax Invoice)', pageWidth / 2, 62, { align: 'center' });

  // Subtle gray line separator
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.5);
  doc.line(20, 70, pageWidth - 20, 70);

  // Credits Highlight Box (subtle red background)
  doc.setFillColor(254, 242, 242); // red-100
  doc.roundedRect(30, 80, pageWidth - 60, 30, 8, 8, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(220, 38, 38); // red-600
  doc.text(`+${credits} Profile Credits Activated`, pageWidth / 2, 98, { align: 'center' });

  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text('Your premium plan is now active!', pageWidth / 2, 108, { align: 'center' });

  // Details Table-like Layout
  let y = 130;
  const addRow = (label, value, valueBold = false) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(70, 70, 70);
    doc.text(label + ':', 30, y);

    doc.setFont('helvetica', valueBold ? 'bold' : 'normal');
    doc.setTextColor(0, 0, 0); // Black
    doc.text(String(value), pageWidth - 30, y, { align: 'right' });

    y += 12;
  };

  addRow('Transaction ID', transactionId || 'N/A', true);
  addRow('Plan Name', plan.name, true);
  addRow('Amount Paid', `$${parseFloat(plan.price || 0).toFixed(2)}`, true);
  // addRow('Credits Added', `${credits} Profiles`, true);
  addRow('Purchased Credits', `${credits} Profiles`, true);
  addRow('Validity', `${plan.validity} ${plan.validityUnit}`);
  addRow('Payment Method', isTest ? 'Test Mode (Demo)' : paymentMethod === 'wallet' ? 'Wallet' : 'PayPal');
  addRow('Purchase Date', new Date().toLocaleDateString('en-IN', {
    day: '2-digit', month: 'long', year: 'numeric'
  }) + ' at ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

  // Footer
  doc.setDrawColor(200, 200, 200);
  doc.line(20, pageHeight - 50, pageWidth - 20, pageHeight - 50);

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(11);
  doc.setTextColor(100, 100, 100);
  doc.text('Thank you for choosing Vivahanam', pageWidth / 2, pageHeight - 35, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('This is a system-generated receipt • support@vivahanam.com', pageWidth / 2, pageHeight - 25, { align: 'center' });

  return doc;
};

const handleDownloadReceipt = () => {
  const doc = generateReceiptPDF();
  doc.save(`Vivahanam_Receipt_${transactionId}.pdf`);
};




 const handleShare = async () => {
  const doc = generateReceiptPDF();
  const blob = doc.output('blob');

  const file = new File(
    [blob],
    `Vivahanam_Receipt_${transactionId}.pdf`,
    { type: 'application/pdf' }
  );

  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    await navigator.share({
      title: 'Vivahanam Payment Receipt',
      text: 'Here is my payment receipt from Vivahanam',
      files: [file],
    });
  } else {
    doc.save(`Vivahanam_Receipt_${transactionId}.pdf`);
    alert('PDF downloaded. Please share manually.');
  }
};


  // Loading state jab capture chal raha ho
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 rounded-full border-4 border-green-500 border-t-transparent animate-spin mb-4" />
          <p className="text-gray-700 font-semibold">Processing your payment, please wait...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 py-50">
        <div className="max-w-lg mx-auto px-4">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Payment Issue</h1>
            <p className="text-gray-700 mb-6">{error}</p>
            <button
              onClick={() => navigate('/credit-store')}
              className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700"
            >
              Back to Credit Store
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Agar abhi bhi plan nahi mila (fallback safety), toh kuch na dikhaao
  if (!plan) {
    return null;
  }

  return (
    <div className="min-h-screen bg-amber-100 py-21">
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
                <span className="text-xl font-bold text-blue-600">+{credits} Profiles</span>
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