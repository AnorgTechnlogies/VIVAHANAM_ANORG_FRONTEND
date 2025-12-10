import { useState, useEffect } from "react";

const Overview = ({ user, Balance, checkAuthAndRedirect, navigate, setActiveTab }) => {
  const [featuredMatches, setFeaturedMatches] = useState([]);
  const [recentUnlocks, setRecentUnlocks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({
    totalMatches: 0,
    newMatches: 0,
    profileViews: 0
  });
  const [usageStats, setUsageStats] = useState({
    profileViews: 0,
    creditsUsed: 0,
    lastUnlock: null,
  });

  const API_URL = import.meta.env.VITE_API_KEY;

  useEffect(() => {
    const loadOverviewData = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("vivahanamToken");
        if (!token) {
          setFeaturedMatches([]);
          setRecentUnlocks([]);
          setUsageStats({ profileViews: 0, creditsUsed: 0, lastUnlock: null });
          setStats({ totalMatches: 0, newMatches: 0, profileViews: 0 });
          return;
        }

        const partnerResponse = await fetch(`${API_URL}/user/partners?page=1&limit=6`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const partnerJson = await partnerResponse.json();
        if (!partnerResponse.ok || !partnerJson.success) {
          throw new Error(partnerJson.message || "Unable to load matches");
        }
        const partners = partnerJson.data?.partners || [];
        const pagination = partnerJson.data?.pagination || {};
        setFeaturedMatches(partners.slice(0, 3));

        let unlockStats = { stats: { totalUnlocked: 0, totalCreditsUsed: 0, lastUnlockedAt: null }, history: [] };
        try {
          const unlockResponse = await fetch(`${API_URL}/userplan/unlocks/history?limit=5`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
          const unlockJson = await unlockResponse.json();
          if (unlockResponse.ok && unlockJson.success) {
            unlockStats = {
              stats: unlockJson.data?.stats || unlockStats.stats,
              history: unlockJson.data?.history || [],
            };
          } else {
            console.warn("Unlock history unavailable:", unlockJson.message);
          }
        } catch (unlockError) {
          console.warn("Unlock history error:", unlockError);
        }

        setUsageStats({
          profileViews: unlockStats.stats?.totalUnlocked || 0,
          creditsUsed: unlockStats.stats?.totalCreditsUsed || 0,
          lastUnlock: unlockStats.stats?.lastUnlockedAt || null,
        });
        setRecentUnlocks(unlockStats.history || []);
        setStats({
          totalMatches: pagination.total || partners.length,
          newMatches: Math.min(partners.length, pagination.limit || partners.length),
          profileViews: unlockStats.stats?.totalUnlocked || 0,
        });
      } catch (err) {
        console.error("Overview load error:", err);
        setError(err.message || "Unable to load overview data");
      } finally {
        setLoading(false);
      }
    };

    loadOverviewData();
  }, [API_URL]);

  const handleProfileClick = async () => {
    const ok = await checkAuthAndRedirect();
    if (!ok) return;
    setActiveTab?.("matches");
  };

  // Handle Credit Store navigation - Simply switches to "Balance" tab
  // Works for both logged in and non-logged in users
  const handleBuyCredits = () => {
    // Switch to the Credit Store tab (id: "Balance")
    if (setActiveTab) {
      setActiveTab("Balance");
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-sm border border-blue-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome - {user?.name || "User"}!
            </h1>
            <p className="text-gray-600 mt-1">
              Ready to find your perfect match? Browse profiles and connect with potential partners.
            </p>
          </div>
          <div className={`px-4 py-2 rounded-full ${Balance === 0 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
            <span className="font-semibold">{Balance} Balance Available</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label="Profiles remaining"
          value={Balance}
          helper={Balance === 0 ? "Purchase a plan to continue" : "Ready to unlock more matches"}
          tone={Balance === 0 ? "danger" : "success"}
        />
        <StatCard
          label="Matches available"
          value={stats.totalMatches}
          helper={`${stats.newMatches} new this session`}
        />
        <StatCard
          label="Profiles unlocked"
          value={usageStats.profileViews}
          helper={usageStats.lastUnlock ? `Last unlocked ${new Date(usageStats.lastUnlock).toLocaleString()}` : "Unlock a profile to view full biodata"}
        />
        {/* <StatCard
          label="Profile used"
          value={usageStats.creditsUsed}
          helper="Across your current plan"
        /> */}
      </div>

      {/* Featured Profiles - ONLY SHOW WHEN Balance > 0 */}
      {Balance > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-blue-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-900">Featured Profiles</h3>
            <button 
              onClick={handleProfileClick} 
              className="text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              View All →
            </button>
          </div>

          {loading && featuredMatches.length === 0 ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
              <p className="mt-2 text-gray-600">Loading featured matches...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredMatches.map((profile) => (
                <div
                  key={profile._id || profile.id}
                  className="group relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 cursor-pointer"
                  onClick={() => handleProfileClick(profile._id || profile.id)}
                >
                  <div className="relative h-32 overflow-hidden bg-gradient-to-br from-blue-100 to-blue-200">
                    <img
                      src={profile.image || profile.profileImage || '/placeholder.jpg'}
                      alt={profile.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      style={{ filter: "blur(4px)" }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                    <div className="absolute bottom-3 left-3 text-white">
                      <h4 className="font-bold text-sm">{profile.name}</h4>
                      <p className="text-xs opacity-90">{profile.age} • {profile.profession}</p>
                    </div>
                  </div>
                  <div className="p-3">
                    <div className="flex justify-between items-center text-xs text-gray-600">
                      <span>{profile.religion}</span>
                      <span className="font-semibold text-blue-600">2 Balance</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {featuredMatches.length === 0 && !loading && (
            <div className="text-center py-6">
              <p className="text-gray-500 text-sm">No featured profiles available at the moment.</p>
            </div>
          )}
        </div>
      )}

      {recentUnlocks.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-green-700">Recent activity</p>
              <h3 className="text-lg font-bold text-gray-900">Profiles you recently unlocked</h3>
            </div>
          </div>
          <div className="space-y-3">
            {recentUnlocks.map((entry) => (
              <div key={entry.id} className="flex items-center gap-4 rounded-2xl border border-gray-100 p-4">
                <img
                  src={entry.profile?.profileImage || "/placeholder.jpg"}
                  alt={entry.profile?.name}
                  className="h-12 w-12 rounded-xl object-cover border border-gray-100"
                />
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{entry.profile?.name || "Unlocked profile"}</p>
                  <p className="text-xs text-gray-500">
                    {entry.profile?.formData?.city || entry.profile?.city || "Location hidden"} •{" "}
                    {entry.unlockedAt ? new Date(entry.unlockedAt).toLocaleString() : "Just now"}
                  </p>
                </div>
                <span className="text-xs font-semibold text-green-700 bg-green-50 px-3 py-1 rounded-full">
                  {entry.cost} Profile{entry.cost === 1 ? "" : "s"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Credit Warning - Low Balance */}
      {Balance > 0 && Balance < 5 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0"><span className="text-yellow-400 text-lg">⚠️</span></div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Low Credit Balance</h3>
              <p className="text-sm text-yellow-700 mt-1">
                You have only {Balance} Balance left. Purchase more Balance to continue using premium features.
              </p>
              <button 
                onClick={handleBuyCredits}
                className="mt-2 bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors text-sm"
              >
                Buy Balance Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Zero Balance Warning - Switches to Credit Store tab */}
      {Balance === 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl text-red-600">💰</span>
          </div>
          <h3 className="text-lg font-bold text-red-800 mb-2">Get Started with Balance</h3>
          <p className="text-red-600 mb-4">
            Purchase Balance to unlock profile viewing, send messages, and start connecting with potential matches.
          </p>
          <button 
            onClick={handleBuyCredits}
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold"
          >
            Buy Now
          </button>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ label, value, helper, tone = "neutral" }) => {
  const toneClasses = {
    neutral: "bg-white border-gray-100 text-gray-900",
    success: "bg-green-50 border-green-100 text-green-900",
    danger: "bg-red-50 border-red-100 text-red-900",
  };

  return (
    <div className={`rounded-2xl border p-4 shadow-sm ${toneClasses[tone] || toneClasses.neutral}`}>
      <p className="text-xs uppercase tracking-wide text-gray-500">{label}</p>
      <p className="mt-2 text-3xl font-bold">{value}</p>
      <p className="mt-1 text-xs text-gray-500">{helper}</p>
    </div>
  );
};

export default Overview;