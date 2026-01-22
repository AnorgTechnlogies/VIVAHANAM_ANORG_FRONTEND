import { useCallback, useEffect, useState } from "react";
import {
  Clock,
  Eye,
  MapPin,
  Mail,
  Phone,
  RefreshCw,
  User,
  X,
  Lock,
} from "lucide-react";

const UnlockedProfiles = ({
  user,
  // checkAuthAndRedirect,
  navigate,
  setActiveTab,
}) => {
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedProfile, setSelectedProfile] = useState(null);

  const API_URL = import.meta.env.VITE_API_KEY;

  // Check if user is authenticated and fully registered
  const isUserAuthenticatedAndRegistered = user && user.profileCompleted;

  // Function to redirect to Credit Store
  const handlePurchaseMore = useCallback(() => {
    if (setActiveTab) {
      // If we have setActiveTab prop, use it to switch to Balance tab (Credit Store)
      setActiveTab("Balance");
    } else {
      // Fallback: navigate to the credit store route
      navigate("/pay-as-you-go/credit-store");
    }
  }, [setActiveTab, navigate]);

  const fetchHistory = useCallback(
    async (page = 1, reset = false) => {
      if (!isUserAuthenticatedAndRegistered) return;

      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("vivahanamToken");
        const response = await fetch(
          `${API_URL}/userplan/unlocks/history?page=${page}&limit=20`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );
        const data = await response.json();
        if (!response.ok || !data.success) {
          throw new Error(data.message || "Unable to load unlock history");
        }

        const nextHistory = data.data?.history || [];
        setHistory((prev) =>
          reset || page === 1 ? nextHistory : [...prev, ...nextHistory],
        );
        setStats(data.data?.stats || null);
        setPagination(
          data.data?.pagination || {
            page: 1,
            totalPages: 1,
            total: nextHistory.length,
          },
        );
      } catch (err) {
        console.error("Unlock page error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [API_URL, isUserAuthenticatedAndRegistered],
  );

  useEffect(() => {
    if (isUserAuthenticatedAndRegistered) {
      fetchHistory(1, true);
    }
  }, [fetchHistory, isUserAuthenticatedAndRegistered]);

  const handleViewProfile = async (profile) => {
    if (!isUserAuthenticatedAndRegistered) {
      handlePurchaseMore();
      return;
    }

    const partnerId = profile?._id || profile?.id;
    if (!partnerId) return;
    try {
      const token = localStorage.getItem("vivahanamToken");
      const response = await fetch(
        `${API_URL}/userplan/unlocked/${partnerId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to load profile");
      }
      setSelectedProfile(data.data || profile);
    } catch (err) {
      console.error("View unlocked profile error:", err);
      setError(err.message);
    }
  };

  // Show Get Started section if user is not authenticated or not fully registered
  if (!isUserAuthenticatedAndRegistered) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-amber-200 p-8 text-center">
        <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center rounded-full bg-amber-50 border border-amber-100">
          <Lock className="w-10 h-10 text-amber-600" />
        </div>
        <h3 className="text-xl font-bold text-amber-700 mb-2">
          Get Started with Balance
        </h3>
        <p className="text-amber-600 mb-6">
          Purchase Balance to unlock profile viewing, send messages, and start
          connecting with potential matches.
        </p>
        <button
          onClick={handlePurchaseMore}
          className="bg-amber-600 hover:bg-amber-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
        >
          Buy Now
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="bg-white rounded-2xl shadow-sm border border-blue-100 p-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
            Unlocked profiles
          </p>
          <h2 className="text-2xl font-semibold text-gray-900">
            Profiles you've already Unlocked
          </h2>
        </div>
        <button
          onClick={() => fetchHistory(1, true)}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl border border-blue-200 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50 disabled:opacity-60"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </header>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <section className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Profiles unlocked"
          value={stats?.totalUnlocked || 0}
          helper="Lifetime unlocks"
        />
        {/* <StatCard label="Profile used" value={stats?.totalCreditsUsed || 0} helper="Spent on unlocks" /> */}
        <StatCard
          label="Last unlocked"
          value={
            stats?.lastUnlockedAt
              ? new Date(stats.lastUnlockedAt).toLocaleString()
              : "Not yet"
          }
          helper="Timestamp"
        />
      </section>

      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Unlocked profiles ({pagination.total || history.length})
          </h3>
        </div>

        {history.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-500">
            {loading
              ? "Loading unlocked profiles..."
              : "You haven't unlocked any profiles yet."}
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {history.map((entry) => (
              <article
                key={entry.id}
                className="flex flex-col gap-3 p-5 md:flex-row md:items-center md:justify-between"
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <img
                    src={entry.profile?.profileImage || "/placeholder.jpg"}
                    alt={entry.profile?.name || entry.profile?.vivId}
                    className="h-14 w-14 rounded-2xl object-cover border border-gray-100"
                  />
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900">
                      {entry.profile?.name || "Profile"}
                    </p>
                    <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {entry.profile?.formData?.city ||
                          entry.profile?.city ||
                          "Location hidden"}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {entry.unlockedAt
                          ? new Date(entry.unlockedAt).toLocaleString()
                          : "Just now"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right text-sm text-gray-600">
                    <p>
                      Cost:{" "}
                      <span className="font-semibold text-gray-900">
                        {entry.cost}
                      </span>{" "}
                      Profile
                      {entry.cost === 1 ? "" : "s"}
                    </p>
                    {entry.plan?.name && (
                      <p className="text-xs text-gray-500">{entry.plan.name}</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleViewProfile(entry.profile)}
                    className="inline-flex items-center gap-2 rounded-xl border border-green-200 px-4 py-2 text-sm font-semibold text-green-700 hover:bg-green-50"
                  >
                    <Eye className="w-4 h-4" />
                    View profile
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        {pagination.page < pagination.totalPages && (
          <div className="p-4 text-center">
            <button
              onClick={() => fetchHistory(pagination.page + 1)}
              disabled={loading}
              className="rounded-xl bg-blue-600 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? "Loading..." : "Load more"}
            </button>
          </div>
        )}
      </section>

      {selectedProfile && (
        <UnlockedProfileDetails
          profile={selectedProfile}
          onClose={() => setSelectedProfile(null)}
        />
      )}
    </div>
  );
};

const StatCard = ({ label, value, helper }) => (
  <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
    <p className="text-xs uppercase tracking-wide text-gray-500">{label}</p>
    <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>
    <p className="text-xs text-gray-500">{helper}</p>
  </div>
);

const UnlockedProfileDetails = ({ profile, onClose }) => {
  const formData = profile.formData || {};
  const formatValue = (value) => {
    if (Array.isArray(value)) return value.join(", ");
    if (value === null || value === undefined) return "N/A";
    if (typeof value === "object") return JSON.stringify(value);
    return value;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-gray-100 p-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-green-700">
              Unlocked profile
            </p>
            <h3 className="text-2xl font-bold text-gray-900">{profile.name}</h3>
            <p className="text-sm text-gray-500">VIV ID: {profile.vivId}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full border border-gray-200 p-2 text-gray-500 hover:text-gray-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid gap-6 p-6 lg:grid-cols-[260px,1fr]">
          <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 text-center">
            <img
              src={profile.profileImage || "/placeholder.jpg"}
              alt={profile.name}
              className="mx-auto h-28 w-28 rounded-2xl object-cover border border-white shadow"
            />
            <div className="mt-4 space-y-2 text-sm text-gray-600">
              <InfoChip
                icon={<User className="w-4 h-4" />}
                label={formData.gender || profile.gender || "Not shared"}
              />
              <InfoChip
                icon={<MapPin className="w-4 h-4" />}
                label={formData.city || profile.city || "Location hidden"}
              />
              <InfoChip
                icon={<Mail className="w-4 h-4" />}
                label={profile.email || "Hidden"}
              />
              <InfoChip
                icon={<Phone className="w-4 h-4" />}
                label={formData.mobileNo || "Hidden"}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field
                label="Religion"
                value={formData.religion || profile.religion}
              />
              <Field
                label="Marital status"
                value={formData.maritalStatus || profile.maritalStatus}
              />
              <Field
                label="Occupation"
                value={formData.occupation || profile.occupation}
              />
              <Field label="Education" value={formData.educationLevel} />
            </div>
            <div className="rounded-2xl border border-gray-100 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
                Full biodata
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {Object.entries(formData)
                  .filter(
                    ([key]) =>
                      key !== "additionalImages" &&
                      key !== "additionalImageUrls",
                  ) // दोनों variations को filter करें
                  .map(([key, value]) => (
                    <Field
                      key={key}
                      label={prettifyLabel(key)}
                      value={formatValue(value)}
                    />
                  ))}
                {Object.keys(formData).filter(
                  (key) =>
                    key !== "additionalImages" && key !== "additionalImageUrls",
                ).length === 0 && (
                  <p className="text-sm text-gray-500">
                    No extra biodata available for this user.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Field = ({ label, value }) => (
  <div>
    <p className="text-xs uppercase tracking-wide text-gray-500">{label}</p>
    <p className="text-sm font-semibold text-gray-900">
      {value || "Not shared"}
    </p>
  </div>
);

const InfoChip = ({ icon, label }) => (
  <span className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-700">
    {icon}
    {label}
  </span>
);

const prettifyLabel = (key) =>
  key
    .replace(/([A-Z])/g, " $1")
    .replace(/[_-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^./, (c) => c.toUpperCase());

export default UnlockedProfiles;
