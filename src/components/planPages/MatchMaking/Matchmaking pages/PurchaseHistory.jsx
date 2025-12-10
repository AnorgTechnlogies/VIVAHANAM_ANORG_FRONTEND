import React, { useEffect, useMemo, useState } from 'react';

const PurchaseHistory = ({ Balance, user }) => {
  const [transactions, setTransactions] = useState([]);
  const [usageHistory, setUsageHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const API_URL = import.meta.env.VITE_API_KEY;

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user?.vivId) return;
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("vivahanamToken");
        const [txRes, unlockRes] = await Promise.all([
          fetch(`${API_URL}/userplan/my-transactions/${user.vivId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }),
          fetch(`${API_URL}/userplan/unlocks/history?limit=10`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }),
        ]);

        const txJson = await txRes.json();
        if (!txRes.ok || !txJson.success) {
          throw new Error(txJson.message || "Unable to load transactions");
        }
        setTransactions(txJson.transactions || txJson.data?.transactions || []);

        const unlockJson = await unlockRes.json();
        if (unlockRes.ok && unlockJson.success) {
          setUsageHistory(unlockJson.data?.history || []);
        }
      } catch (err) {
        console.error("Purchase history error:", err);
        setError(err.message || "Unable to load purchase history");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [API_URL, user?.vivId]);

  const summary = useMemo(() => {
    const totalPurchased = transactions.reduce((sum, tx) => sum + (tx.profilesAllocated || tx.credits || 0), 0);
    const totalUsed = transactions.reduce((sum, tx) => sum + (tx.profilesUsed || 0), 0);
    return {
      totalPurchased,
      totalUsed,
      remaining: Balance,
    };
  }, [transactions, Balance]);

  const formatStatus = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-amber-100 text-amber-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-blue-200 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Purchase History</h3>
          <p className="text-sm text-gray-500">Track your plan activations and Profile usage</p>
        </div>
        {loading && <span className="text-xs text-gray-500">Refreshing…</span>}
      </div>

      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600">Current balance</p>
            <p className="text-2xl font-bold text-blue-700">{Balance} Profile</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Lifetime spend</p>
            <p className="text-lg font-semibold text-gray-900">
              {transactions.reduce((sum, tx) => sum + (tx.payment_amount || 0), 0).toLocaleString(undefined, {
                style: "currency",
                currency: "USD",
              })}
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {transactions.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl text-gray-400">📋</span>
            </div>
            <p className="text-gray-500">No purchase history yet.</p>
            <p className="text-sm text-gray-400 mt-1">Your purchases will appear here once you activate a plan.</p>
          </div>
        ) : (
          transactions.map((tx) => (
            <div key={tx._id} className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h5 className="font-semibold text-gray-900">{tx.planDisplayName || tx.plan_name}</h5>
                  <p className="text-sm text-gray-600">
                    {tx.payment_date ? new Date(tx.payment_date).toLocaleDateString() : "Date unavailable"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {tx.profilesAllocated || tx.profiles || 0} profiles • {tx.profilesRemaining || 0} remaining
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">
                    {(tx.payment_amount || 0).toLocaleString(undefined, { style: "currency", currency: "USD" })}
                  </p>
                  <p className="text-xs text-gray-500">{tx.plan_frequency || "one-time"}</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${formatStatus(tx.payment_status)}`}>
                    {tx.payment_status || "unknown"}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {transactions.length > 0 && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <p className="text-sm text-green-600">Total purchased</p>
            <p className="text-xl font-bold text-green-700">{summary.totalPurchased} Profile</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-600">Total used</p>
            <p className="text-xl font-bold text-blue-700">{summary.totalUsed} Profile</p>
          </div>
          <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
            <p className="text-sm text-amber-600">Remaining</p>
            <p className="text-xl font-bold text-amber-700">{summary.remaining} Profile</p>
          </div>
        </div>
      )}

      {usageHistory.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">Recent unlock activity</h4>
          <div className="space-y-3">
            {usageHistory.map((entry) => (
              <div key={entry.id} className="flex items-center justify-between text-sm text-gray-600">
                <div>
                  <p className="font-semibold text-gray-900">{entry.profile?.name || entry.profile?.vivId}</p>
                  <p className="text-xs text-gray-500">
                    {entry.unlockedAt ? new Date(entry.unlockedAt).toLocaleString() : "Recently"}
                  </p>
                </div>
                <span className="text-xs font-semibold text-blue-700">
                  -{entry.cost} Profile{entry.cost === 1 ? "" : "s"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PurchaseHistory;