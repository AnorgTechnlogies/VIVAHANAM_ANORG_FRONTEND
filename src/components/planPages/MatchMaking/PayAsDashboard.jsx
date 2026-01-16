//final implementation of Pay As You Go Matchmaking Dashboard with sidebar and multiple tabs

import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Overview from "./Matchmaking pages/Overview";
import BrowseMatches from "./Matchmaking pages/BrowseMatches";
import CreditStore from "./Matchmaking pages/PurchaseStore";
import PurchaseHistory from "./Matchmaking pages/PurchaseHistory";
import UnlockedProfiles from "./Matchmaking pages/UnlockedProfiles";
import AuthPage from "../../Pages/SignUp";

const PayAsYouGoDashboard = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("Balance");
  const [Balance, setBalance] = useState(0);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [planSummary, setPlanSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const API_URL = import.meta.env.VITE_API_KEY;

  useEffect(() => {
    if (showAuthModal) {
      // Modal open → scroll lock
      document.body.style.overflow = "hidden";
    } else {
      // Modal close → scroll unlock
      document.body.style.overflow = "auto";
    }

    // Cleanup on unmount (optional, safe)
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showAuthModal]);

  const fetchUserProfile = useCallback(async () => {
    const token = localStorage.getItem("vivahanamToken");
    if (!token) {
      setUser(null);
      setLoading(false);
      return null;
    }
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}/user/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to load profile");
      }
      setUser(data.user);
      return data.user;
    } catch (err) {
      console.error("Failed to load user profile:", err);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  const fetchPlanSummary = useCallback(async () => {
    const token = localStorage.getItem("vivahanamToken");
    if (!token) {
      setPlanSummary(null);
      setBalance(0);
      return null;
    }
    try {
      const response = await fetch(`${API_URL}/userplan/summary`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to load plan summary");
      }
      setPlanSummary(data.data.plan);
      setBalance(data.data.plan?.profilesRemaining || 0);
      return data.data.plan;
    } catch (err) {
      console.error("Plan summary error:", err);
      setPlanSummary(null);
      setBalance(0);
      return null;
    }
  }, [API_URL]);

  useEffect(() => {
    fetchUserProfile();
    fetchPlanSummary();
  }, [fetchUserProfile, fetchPlanSummary]);

  // Authentication functions
  const checkAuthAndRedirect = useCallback(
    async (options = {}) => {
      const { redirectTo = "/payas", pendingPlan } = options;
      const token = localStorage.getItem("vivahanamToken");

      // 🔴 USER NOT LOGGED IN → POPUP OPEN
      if (!token) {
        if (pendingPlan) {
          localStorage.setItem(
            "vivahanamPendingPlan",
            JSON.stringify({
              plan: pendingPlan,
              redirectTo,
              savedAt: Date.now(),
            })
          );
        }

        // ✅ sirf modal show karo
        setShowAuthModal(true);
        return false; // stop here
      }

      // 🟡 user logged in — check profile complete
      const ensuredUser = user || (await fetchUserProfile());

      if (ensuredUser && !ensuredUser.profileCompleted) {
        if (pendingPlan) {
          localStorage.setItem(
            "vivahanamPendingPlan",
            JSON.stringify({
              plan: pendingPlan,
              redirectTo,
              savedAt: Date.now(),
            })
          );
        }

        navigate("/register", { 
          state: { 
            redirectTo,
            fromPayAsYouGo: true 
          } 
        });
        return false;
      }

      return true;
    },
    [fetchUserProfile, navigate, user]
  );

  const handleAuthSuccess = () => {
    setShowAuthModal(false); // remove modal
    fetchUserProfile();
    fetchPlanSummary();
    setTimeout(() => {
      window.scrollTo(0, 0); // reset scroll
    }, 100);
  };

  const closeAuthModal = () => {
    setShowAuthModal(false);
  };

  const upgradePlan = async () => {
    const ok = await checkAuthAndRedirect();
    if (!ok) return;
    navigate("/gold");
  };

  const handlePlanUpdated = async (overrideSummary) => {
    if (overrideSummary) {
      setPlanSummary(overrideSummary);
      setBalance(overrideSummary?.profilesRemaining || 0);
      return;
    }
    const freshSummary = await fetchPlanSummary();
    if (freshSummary) {
      setPlanSummary(freshSummary);
      setBalance(freshSummary?.profilesRemaining || 0);
    }
  };

  // Render active tab content
  const renderActiveTab = () => {
    const commonProps = {
      user,
      Balance,
      setBalance,
      checkAuthAndRedirect,
      navigate,
      planSummary,
      refreshPlanSummary: handlePlanUpdated,
      setActiveTab,
    };

    switch (activeTab) {
      case "overview":
        return <Overview {...commonProps} />;
      case "matches":
        return <BrowseMatches {...commonProps} />;
      case "unlocks":
        return <UnlockedProfiles {...commonProps} />;
      case "features":
        return <BuyFeatures {...commonProps} />;
      case "Balance":
        return <CreditStore {...commonProps} />;
      case "history":
        return <PurchaseHistory {...commonProps} />;
      default:
        return <CreditStore {...commonProps} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-amber-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-600 font-semibold">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-amber-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-lg w-full text-center">
          <h2 className="text-2xl font-bold text-red-700 mb-3">
            Dashboard is unavailable right now. Please try again.
          </h2>
          <br />
          <button
            onClick={() => {
              fetchUserProfile();
              fetchPlanSummary();
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-100 mt-14">
      {/* Header */}

      <div className="max-w-8xl mx-auto py-6 bg-amber-100 sm:px-8 lg:px-10">
        <div className="px-6 py-6 sm:px-0">
          <div className="grid grid-cols-1 xl:grid-cols-8 gap-8">
            {/* Sidebar - Increased width */}
            <div className="xl:col-span-2">
              <Sidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                Balance={Balance}
                user={user}
                upgradePlan={upgradePlan}
              />
            </div>

            {/* Main Content - Adjusted width */}
            <div className="xl:col-span-6">{renderActiveTab()}</div>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          {/* signup component */}
          <AuthPage
            onSuccess={handleAuthSuccess}
            onClose={closeAuthModal}
          />
        </div>
      )}
    </div>
  );
};

export default PayAsYouGoDashboard;