import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PlanPage = () => {
  const [currentPlan, setCurrentPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // YOUR NEVER-EXPIRING TOKEN (UPDATE IF NEEDED)
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTEwMWNhYzQyOTZiYTYzMDg2YTM4ZTciLCJlbWFpbCI6ImRpdnlhbnNodTIwMjJkQGdtYWlsLmNvbSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzYyNzEyMzQ1LCJleHAiOjE4MDAwMDAwMDB9.SUPER_LONG_LIFE_TOKEN";

  const userVivId = "VIV2022";

  const plans = [
    { name: "PayAsGo", price: 299, features: ["10 Views", "5 Interests", "3 Messages"] },
    { name: "Silver", price: 799, features: ["Unlimited Views", "50 Interests", "Chat"] },
    { name: "Gold", price: 999, features: ["Featured Profile", "Priority Support", "30 Days"] },
    { name: "Platinum", price: 14999, features: ["Video Call", "Astrologer", "VIP Badge", "1 Year"] }
  ];

  useEffect(() => {
    checkMyPlan();
  }, []);

  const checkMyPlan = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/userplan/my-plan", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCurrentPlan(res.data.plan);
      setMessage(`Active Plan: ${res.data.plan?.plan_name || "Free"}`);
    } catch (err) {
      setMessage("Failed to load plan");
    }
  };

  const buyPlan = async (planName, amount) => {
    setLoading(true);
    setMessage("Activating plan...");

    try {
      const res = await axios.post("http://localhost:5000/api/userplan/create", {
        userVivId,
        plan_name: planName,
        payment_mode: "UPI",
        payment_amount: amount,
        plan_features: plans.find(p => p.name === planName).features
      }, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
      });

      setCurrentPlan(res.data.data);
      setMessage(`SUCCESS! ${planName} Activated!`);
    } catch (err) {
      setMessage(`ERROR: ${err.response?.data?.message || "Try again"}`);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-100 py-12 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-5xl font-bold text-purple-800 mb-2">Divyanshu Singh</h1>
        <p className="text-2xl text-pink-600 font-bold">VIV2022</p>

        {currentPlan && (
          <div className="my-8 p-6 bg-white rounded-2xl shadow-2xl inline-block">
            <p className="text-3xl font-bold text-green-600">
              Active: {currentPlan.plan_name} {currentPlan.isActive ? "ACTIVE" : ""}
            </p>
          </div>
        )}

        {message && (
          <div className={`mt-4 text-xl font-bold p-4 rounded-lg ${message.includes('SUCCESS') ? 'bg-green-500 text-white' : message.includes('ERROR') ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'}`}>
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
          {plans.map((plan) => (
            <div key={plan.name} className="bg-white rounded-3xl shadow-2xl p-8 hover:shadow-pink-500/50 transition-all hover:scale-105">
              <h2 className="text-4xl font-bold text-purple-700">{plan.name}</h2>
              <p className="text-6xl font-bold text-pink-600 my-6">₹{plan.price}</p>
              
              <ul className="text-left mb-8 space-y-3">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-center text-gray-700">
                    <span className="text-green-500 text-2xl mr-3">Check</span> {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => buyPlan(plan.name, plan.price)}
                disabled={loading}
                className={`w-full py-5 rounded-full text-white font-bold text-2xl transition-all ${
                  plan.name === "Platinum"
                    ? "bg-gradient-to-r from-yellow-500 to-red-600 hover:from-yellow-600 hover:to-red-700"
                    : "bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                }`}
              >
                {loading ? "Please Wait..." : `Buy ${plan.name}`}
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={checkMyPlan}
          className="mt-12 bg-green-600 hover:bg-green-700 text-white px-16 py-6 rounded-full text-3xl font-bold shadow-2xl"
        >
          Refresh My Plan
        </button>
      </div>
    </div>
  );
};

export default PlanPage;