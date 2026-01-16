import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Briefcase,
  Cake,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Eye,
  Filter,
  Heart,
  History,
  Lock,
  Mail,
  MapPin,
  Phone,
  RefreshCw,
  Search,
  Unlock,
  User,
  Users,
  X,
  ZoomIn,
  ChevronUp,
  ChevronDown as ChevronDownIcon,
} from "lucide-react";

const RANGE_DEFAULT_LIMITS = {
  ageRange: { min: 18, max: 60 },
  heightRange: { min: 48, max: 84 },
};

const buildInitialFilters = (config) => {
  const defaults = {};
  config.forEach((filter) => {
    defaults[filter.key] = [];
  });
  return defaults;
};

const BrowseMatches = ({
  user,
  Balance,
  setBalance,
  checkAuthAndRedirect,
  navigate,
  planSummary,
  refreshPlanSummary,
  setActiveTab,
}) => {
  const API_URL = import.meta.env.VITE_API_KEY;
  const tabsRef = useRef(null);

  const [filterConfig, setFilterConfig] = useState([]);
  const [rangeDefaults, setRangeDefaults] = useState(RANGE_DEFAULT_LIMITS);
  const [filters, setFilters] = useState({});
  const [matches, setMatches] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedFilterTab, setSelectedFilterTab] = useState("gender");
  const [showFilters, setShowFilters] = useState(false);
  const [animateContent, setAnimateContent] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unlockError, setUnlockError] = useState("");
  const [unlockingId, setUnlockingId] = useState(null);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [filtersLoaded, setFiltersLoaded] = useState(false);

  // Add state for image viewer
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [profileImages, setProfileImages] = useState([]);

  // Get user-specific localStorage key to prevent cross-account unlock sharing
  const getUserSpecificStorageKey = useCallback(() => {
    const userId = user?._id || user?.id || user?.email || "anonymous";
    return `vivahanamUnlockedProfiles_${userId}`;
  }, [user]);

  // Track current user ID to detect user changes
  const [currentUserId, setCurrentUserId] = useState(null);

  // Use localStorage to persist unlocked profiles - USER-SPECIFIC KEY to prevent cross-account sharing
  const [unlockedProfileIds, setUnlockedProfileIds] = useState(() => {
    // Initialize empty - will be populated from backend
    return new Set();
  });

  const [unlockHistory, setUnlockHistory] = useState([]);
  const [historyStats, setHistoryStats] = useState(null);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [profileToUnlock, setProfileToUnlock] = useState(null);

  // Check if user is authenticated and fully registered
  const isUserAuthenticatedAndRegistered = useMemo(() => {
    return user && user.profileCompleted;
  }, [user]);

  // Clear localStorage and reset state when user changes (prevents cross-account unlock sharing)
  useEffect(() => {
    const userId = user?._id || user?.id || user?.email;
    if (userId && userId !== currentUserId) {
      // User has changed - clear old localStorage data
      if (currentUserId) {
        try {
          const oldKey = `vivahanamUnlockedProfiles_${currentUserId}`;
          localStorage.removeItem(oldKey);
          // Also remove old non-user-specific key for backward compatibility cleanup
          localStorage.removeItem("vivahanamUnlockedProfiles");
        } catch (err) {
          console.error("Error clearing old user localStorage:", err);
        }
      }
      // Reset state for new user (will be populated from backend via fetchUnlockHistory)
      setUnlockedProfileIds(new Set());
      setUnlockHistory([]);
      setHistoryStats(null);
      setCurrentUserId(userId);

      // Optionally load cached data for current user (will be replaced by backend data anyway)
      try {
        const storageKey = `vivahanamUnlockedProfiles_${userId}`;
        const saved = localStorage.getItem(storageKey);
        if (saved) {
          const parsed = JSON.parse(saved);
          // Only use as temporary cache - backend fetch will replace this
          setUnlockedProfileIds(new Set(parsed));
        }
      } catch (err) {
        console.error("Error loading user-specific localStorage:", err);
      }
    }
  }, [user, currentUserId]);

  // Persist unlocked profile IDs to user-specific localStorage whenever they change
  useEffect(() => {
    if (!currentUserId) return; // Don't save if user not identified
    try {
      const storageKey = getUserSpecificStorageKey();
      localStorage.setItem(
        storageKey,
        JSON.stringify(Array.from(unlockedProfileIds))
      );
    } catch (err) {
      console.error("Error saving unlocked profiles:", err);
    }
  }, [unlockedProfileIds, currentUserId, getUserSpecificStorageKey]);

  // Function to redirect to Credit Store
  const handlePurchaseMore = useCallback(() => {
    if (setActiveTab) {
      setActiveTab("Balance");
    } else {
      navigate("/pay-as-you-go/credit-store");
    }
  }, [setActiveTab, navigate]);

  const hydrateFilterConfig = (dynamicFilters = [], ranges = {}) => {
    const allowedFields = [
      "userType",
      "diet",
      "gender",
      "motherTongue",
      "caste",
      "zodiacsign",
      "gotra",
      "country",
      "fieldofstudy",
      "educationlevel",
      "occupation",
      "height",
      "citizenshipstatus",
      "hobbies",
      "languages",
      "religion",
      "indianReligious",
    ];

    const excludedKeys = [
      "preferredReligion",
      "preferredCaste",
      "preferredMotherTongue",
      "preferredEducation",
      "preferredLocation",
      "preferredheight",
      "preferredLanguages",
      "preferredHeight",
      "preferredAge",
      "preferredOccupation",
      "preferredGender",
      "preferredDiet",
      "showmobile",
      "profileVisibility",
      "photoVisibility",
      "mobileVisibility",
      "emailVisibility",
    ];

    const config = dynamicFilters
      .filter((cfg) => {
        if (!cfg?.key) return false;
        if (excludedKeys.includes(cfg.key)) return false;
        if (!allowedFields.includes(cfg.key)) return false;
        if (
          !cfg.options ||
          !Array.isArray(cfg.options) ||
          cfg.options.length === 0
        )
          return false;
        return true;
      })
      .map((cfg) => {
        const processedOptions = cfg.options
          .filter((opt) => {
            if (typeof opt === "object" && opt.isActive === false) return false;
            return true;
          })
          .map((opt) => {
            if (typeof opt === "string") {
              return { label: opt, value: opt };
            }
            const value = opt.value || opt.label || "";
            const label = opt.label || opt.value || "";
            return { label, value };
          })
          .filter((opt) => opt.value && opt.label);

        return {
          key: cfg.key,
          label: cfg.label || cfg.key,
          options: processedOptions,
        };
      });

    return {
      config,
      ranges: {
        ageRange: ranges.ageRange || RANGE_DEFAULT_LIMITS.ageRange,
        heightRange: ranges.heightRange || RANGE_DEFAULT_LIMITS.heightRange,
      },
    };
  };

  const fetchUnlockHistory = useCallback(async () => {
    if (!isUserAuthenticatedAndRegistered) return;
    setHistoryLoading(true);
    setHistoryError("");
    try {
      const token = localStorage.getItem("vivahanamToken");
      if (!token) {
        setUnlockHistory([]);
        setHistoryStats(null);
        // Don't clear unlockedProfileIds from localStorage on token absence
        return;
      }

      const response = await fetch(
        `${API_URL}/userplan/unlocks/history?limit=100`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to load unlock history");
      }

      // Extract all unlocked profile IDs from history - ONLY from backend (user-specific)
      const ids = new Set();
      const history = data.data?.history || [];

      history.forEach((entry) => {
        if (entry.profile?._id) ids.add(entry.profile._id);
        if (entry.profile?.id) ids.add(entry.profile.id);
        if (entry.targetUserId) ids.add(entry.targetUserId);
      });

      // Replace with backend data ONLY (don't merge with localStorage to prevent cross-account sharing)
      setUnlockedProfileIds(ids);

      setUnlockHistory(history);
      setHistoryStats(data.data?.stats || null);
    } catch (err) {
      console.error("Unlock history error:", err);
      setHistoryError(err.message);
    } finally {
      setHistoryLoading(false);
    }
  }, [API_URL, isUserAuthenticatedAndRegistered]);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const token = localStorage.getItem("vivahanamToken");
        if (!token) {
          setFiltersLoaded(true);
          return;
        }
        const response = await fetch(`${API_URL}/user/partners/filters`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) throw new Error("Unable to load filters");
        const data = await response.json();
        if (!data.success)
          throw new Error(data.message || "Unable to load filters");

        const { config, ranges } = hydrateFilterConfig(
          data.data?.filters || [],
          data.data?.ranges || {}
        );

        config.sort((a, b) => a.label.localeCompare(b.label));

        setFilterConfig(config);
        setRangeDefaults(ranges);
        setFilters(buildInitialFilters(config));

        if (config.length > 0) {
          const genderFilter = config.find((f) => f.key === "gender");
          setSelectedFilterTab(genderFilter ? "gender" : config[0].key);
        }
      } catch (err) {
        console.error("Filter load error:", err);
        setFilterConfig([]);
        setFilters({});
      } finally {
        setFiltersLoaded(true);
      }
    };

    if (isUserAuthenticatedAndRegistered) {
      fetchFilters();
    }
  }, [API_URL, isUserAuthenticatedAndRegistered]);

  useEffect(() => {
    if (isUserAuthenticatedAndRegistered) {
      fetchUnlockHistory();
    }
  }, [fetchUnlockHistory, isUserAuthenticatedAndRegistered]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    setAnimateContent(false);
    const timer = setTimeout(() => setAnimateContent(true), 60);
    return () => clearTimeout(timer);
  }, [selectedFilterTab]);

  const buildParams = (query, appliedFilters, page, limit = 9) => {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("limit", limit.toString());

    if (query?.trim()) {
      params.append("search", query.trim());
    }

    filterConfig.forEach(({ key }) => {
      const value = appliedFilters[key];
      if (Array.isArray(value) && value.length > 0) {
        value.forEach((entry) => {
          const filterValue =
            typeof entry === "string" ? entry : entry.value || entry;
          if (filterValue && filterValue.trim()) {
            params.append(key, filterValue.trim());
          }
        });
      } else if (value && typeof value === "string" && value.trim()) {
        params.append(key, value.trim());
      }
    });

    return params;
  };

  const fetchPartners = async (page, query, appliedFilters) => {
    const params = buildParams(query, appliedFilters, page);
    const token = localStorage.getItem("vivahanamToken");
    const response = await fetch(
      `${API_URL}/user/partners?${params.toString()}`,
      {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok)
      throw new Error(`Failed to load partners (${response.status})`);

    const data = await response.json();
    if (!data.success) throw new Error(data.message || "Unexpected response");

    return {
      partners: data.data?.partners || [],
      pagination: data.data?.pagination || { page, totalPages: 1, total: 0 },
    };
  };

  useEffect(() => {
    if (!filtersLoaded || !isUserAuthenticatedAndRegistered) return;

    const loadPartners = async () => {
      setLoading(true);
      setError(null);
      try {
        const { partners, pagination } = await fetchPartners(
          1,
          debouncedSearch,
          filters
        );
        setMatches(partners);
        setPagination(pagination);
      } catch (err) {
        console.error("Partner fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadPartners();
  }, [
    API_URL,
    debouncedSearch,
    filters,
    filtersLoaded,
    isUserAuthenticatedAndRegistered,
  ]);

  const loadMorePartners = async () => {
    if (
      pagination.page >= pagination.totalPages ||
      loading ||
      !isUserAuthenticatedAndRegistered
    )
      return;
    setLoading(true);
    try {
      const { partners, pagination: nextPagination } = await fetchPartners(
        pagination.page + 1,
        debouncedSearch,
        filters
      );
      setMatches((prev) => [...prev, ...partners]);
      setPagination(nextPagination);
    } catch (err) {
      console.error("Load more error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filterKey) => (e) => {
    const value = e.target.value;
    setFilters((prev) => {
      const existing = prev[filterKey] || [];
      const exists = existing.includes(value);
      const updated = exists
        ? existing.filter((entry) => entry !== value)
        : [...existing, value];
      return { ...prev, [filterKey]: updated };
    });
  };

  const handleRangeChange = (rangeKey, bound) => (e) => {
    const val = Number(e.target.value);
    setFilters((prev) => ({
      ...prev,
      [rangeKey]: { ...prev[rangeKey], [bound]: val },
    }));
  };

  const clearFilters = () => {
    setFilters(buildInitialFilters(filterConfig));
    setShowFilters(false);
  };

  const handleUnlockProfile = async (partner) => {
    if (!isUserAuthenticatedAndRegistered) {
      handlePurchaseMore();
      return;
    }

    if (Balance === 0) {
      handlePurchaseMore();
      return;
    }

    try {
      setUnlockError("");
      const partnerId = partner._id || partner.id;
      setUnlockingId(partnerId);
      const token = localStorage.getItem("vivahanamToken");
      const response = await fetch(`${API_URL}/userplan/unlock`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ partnerId: partner._id || partner.id }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || "Unable to unlock profile");
      }

      const data = await response.json();
      const unlockedProfile = data.data?.profile || partner;
      const newlyUnlocked = !data.data?.alreadyUnlocked;
      const unlockCost = data.data?.cost ?? 1;

      // Add to unlocked profiles set
      setUnlockedProfileIds((prev) => {
        const next = new Set(prev);
        next.add(partnerId);
        return next;
      });

      // Also update the match in the list to show as unlocked
      setMatches((prev) =>
        prev.map((p) => {
          const pid = p._id || p.id;
          if (pid === partnerId) {
            return { ...p, isUnlocked: true };
          }
          return p;
        })
      );

      setSelectedProfile(unlockedProfile);

      if (newlyUnlocked) {
        const newEntry = {
          id: data.data?.unlockId || partnerId,
          unlockedAt: new Date().toISOString(),
          cost: unlockCost,
          plan: data.data?.plan
            ? {
                id: data.data.plan.planId,
                code: data.data.plan.planCode || data.data.plan.planName,
                name: data.data.plan.planName || data.data.plan.planCode,
              }
            : null,
          profile: unlockedProfile,
        };
        setUnlockHistory((prev) => [newEntry, ...prev].slice(0, 100));
        setHistoryStats((prev) => ({
          ...prev,
          totalUnlocked: (prev?.totalUnlocked || 0) + 1,
          totalCreditsUsed: (prev?.totalCreditsUsed || 0) + unlockCost,
          lastUnlockedAt: newEntry.unlockedAt,
        }));
      }

      if (data.data?.plan) {
        setBalance(data.data.plan.profilesRemaining ?? Balance - 1);
        refreshPlanSummary?.(data.data.plan);
      } else if (newlyUnlocked) {
        setBalance((prev) => Math.max(prev - 1, 0));
      }
    } catch (err) {
      console.error("Unlock profile error:", err);
      setUnlockError(err.message);
    } finally {
      setUnlockingId(null);
    }
  };

  const handleViewUnlockedProfile = async (partner) => {
    const partnerId = partner?._id || partner?.id;
    if (!partnerId) return;

    // Always verify with backend API - don't trust localStorage alone
    try {
      const token = localStorage.getItem("vivahanamToken");
      const response = await fetch(
        `${API_URL}/userplan/unlocked/${partnerId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (!response.ok || !data.success) {
        // Show the error message to user
        const errorMessage = data.message || "Unable to load unlocked profile";
        setUnlockError(errorMessage);
        // Don't set selectedProfile if unlock failed - user needs to unlock first
        setSelectedProfile(null);

        // If user hasn't unlocked, show unlock prompt
        if (
          errorMessage.includes("not unlocked") ||
          errorMessage.includes("You have not unlocked")
        ) {
          setProfileToUnlock(partner);
          setShowConfirm(true);
        }
        return;
      }
      // Profile is unlocked - clear any previous errors and show profile
      setUnlockError("");
      setSelectedProfile(data.data || partner);
    } catch (err) {
      console.error("View unlocked profile error:", err);
      const errorMessage = err.message || "Unable to load unlocked profile";
      setUnlockError(errorMessage);
      setSelectedProfile(null);

      // If user hasn't unlocked, show unlock prompt
      if (
        errorMessage.includes("not unlocked") ||
        errorMessage.includes("You have not unlocked")
      ) {
        setProfileToUnlock(partner);
        setShowConfirm(true);
      }
    }
  };

  // New functions for confirmation popup
  const initiateUnlock = (partner) => {
    setProfileToUnlock(partner);
    setShowConfirm(true);
  };

  const confirmUnlock = () => {
    if (profileToUnlock) {
      handleUnlockProfile(profileToUnlock);
    }
    setShowConfirm(false);
    setProfileToUnlock(null);
  };

  const cancelUnlock = () => {
    setShowConfirm(false);
    setProfileToUnlock(null);
  };

  // Function to handle image click - show HD image viewer
  const handleImageClick = (profile) => {
    if (!profile || !unlockedProfileIds.has(profile._id || profile.id)) {
      // If not unlocked, prompt user to unlock
      initiateUnlock(profile);
      return;
    }

    // Get all images for this profile
    const images = [];
    
    // Add main profile image
    if (profile.profileImage) {
      images.push(profile.profileImage);
    }
    
    // Add additional images from formData or other fields
    const formData = profile.formData || {};
    if (formData.additionalImages && Array.isArray(formData.additionalImages)) {
      images.push(...formData.additionalImages.filter(img => img));
    }
    
    // If no images, use placeholder
    if (images.length === 0) {
      images.push("/placeholder.jpg");
    }
    
    setProfileImages(images);
    setCurrentImageIndex(0);
    setShowImageViewer(true);
  };

  // Function to navigate through images
  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === profileImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? profileImages.length - 1 : prevIndex - 1
    );
  };

  // Close image viewer
  const closeImageViewer = () => {
    setShowImageViewer(false);
    setCurrentImageIndex(0);
    setProfileImages([]);
  };

  const activeFilterCount = useMemo(() => {
    return filterConfig.reduce((count, { key }) => {
      const selection = filters[key];
      return Array.isArray(selection) && selection.length > 0
        ? count + 1
        : count;
    }, 0);
  }, [filterConfig, filters]);

  // Get tab icon function from PartnersPage
  const getTabIcon = (key) => {
    switch (key) {
      case "userType":
        return <User className="w-4 h-4" />;
      case "diet":
        return <Cake className="w-4 h-4" />;
      case "gender":
        return <Users className="w-4 h-4" />;
      case "motherTongue":
      case "languages":
        return <Users className="w-4 h-4" />;
      case "caste":
        return <Users className="w-4 h-4" />;
      case "zodiacsign":
        return <Heart className="w-4 h-4" />;
      case "gotra":
        return <User className="w-4 h-4" />;
      case "country":
        return <MapPin className="w-4 h-4" />;
      case "fieldofstudy":
      case "educationlevel":
        return <Briefcase className="w-4 h-4" />;
      case "occupation":
        return <Briefcase className="w-4 h-4" />;
      case "height":
        return <User className="w-4 h-4" />;
      case "citizenshipstatus":
        return <MapPin className="w-4 h-4" />;
      case "hobbies":
        return <Heart className="w-4 h-4" />;
      case "religion":
      case "indianReligious":
        return <User className="w-4 h-4" />;
      default:
        return <Filter className="w-4 h-4" />;
    }
  };

  // Filter tabs with icons
  const filterTabs = useMemo(() => {
    return filterConfig.map((tab) => ({
      key: tab.key,
      label: tab.label,
      icon: getTabIcon(tab.key),
    }));
  }, [filterConfig]);

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

  // Show purchase plan section if user has no balance
  if (Balance <= 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-amber-200 p-8 text-center">
        <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center rounded-full bg-amber-50 border border-amber-100">
          <Lock className="w-10 h-10 text-amber-600" />
        </div>
        <h3 className="text-xl font-bold text-amber-700 mb-2">
          Purchase a Plan to Browse Matches
        </h3>
        <p className="text-amber-600 mb-6">
          Purchase any matchmaking plan to start exploring matches.
        </p>
        <button
          onClick={handlePurchaseMore}
          className="bg-amber-600 hover:bg-amber-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
        >
          Buy Plan
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Image Viewer Modal */}
      {showImageViewer && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4">
          <div className="relative w-full max-w-6xl max-h-[90vh]">
            {/* Close button */}
            <button
              onClick={closeImageViewer}
              className="absolute top-4 right-4 z-10 text-white hover:text-amber-400 transition-colors bg-black/50 rounded-full p-2"
              aria-label="Close image viewer"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Zoom/HD indicator */}
            <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-black/50 text-white px-3 py-1.5 rounded-full">
              {/* <ZoomIn className="w-4 h-4" /> */}
              {/* <span className="text-sm font-semibold">HD View</span> */}
            </div>

            {/* Main Image */}
            <div className="relative h-[70vh] flex items-center justify-center">
              {/* Previous button */}
              {profileImages.length > 1 && (
                <button
                  onClick={prevImage}
                  className="absolute left-4 z-10 text-white hover:text-amber-400 transition-colors bg-black/50 rounded-full p-3"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              )}

              {/* Image */}
              <img
                src={profileImages[currentImageIndex]}
                alt={`Profile image ${currentImageIndex + 1}`}
                className="max-h-full max-w-full object-contain rounded-lg"
              />

              {/* Next button */}
              {profileImages.length > 1 && (
                <button
                  onClick={nextImage}
                  className="absolute right-4 z-10 text-white hover:text-amber-400 transition-colors bg-black/50 rounded-full p-3"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              )}

              {/* Image counter */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1.5 rounded-full">
                <span className="text-sm font-semibold">
                  {currentImageIndex + 1} / {profileImages.length}
                </span>
              </div>
            </div>

            {/* Thumbnail strip */}
            {profileImages.length > 1 && (
              <div className="mt-4 flex justify-center gap-2 overflow-x-auto py-2">
                {profileImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      currentImageIndex === index
                        ? "border-amber-500 scale-110"
                        : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                    aria-label={`View image ${index + 1}`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <header className="bg-white rounded-2xl shadow-sm border border-amber-100 p-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-600" />
            Browse Matches
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl border border-amber-200 bg-amber-50 text-amber-700 text-sm font-semibold">
            Profiles remaining: {Balance}
          </div>
          <button
            onClick={handlePurchaseMore}
            className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
          >
            Purchase More
          </button>
        </div>
      </header>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border border-gray-200 rounded-xl py-3 pl-12 pr-4 focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        </div>

        <div className="space-y-4">
          <button
            onClick={() => setShowFilters((prev) => !prev)}
            className={`w-full flex flex-col sm:flex-row sm:items-center gap-3 px-5 py-4 rounded-2xl border-2 transition-all ${
              showFilters
                ? "bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-lg"
                : "bg-white border-amber-200 text-gray-700 hover:border-amber-400 hover:shadow-lg"
            }`}
          >
            <div className="flex items-center gap-3 text-left">
              <Filter className="w-5 h-5" />
              <div>
                <p className="font-semibold">Advanced Filters</p>
                <p className="text-xs opacity-90">
                  {activeFilterCount === 0
                    ? "No filters applied"
                    : `${activeFilterCount} filters active`}
                </p>
              </div>
            </div>
            {activeFilterCount > 0 && (
              <span className="bg-white text-amber-600 text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-md">
                {activeFilterCount}
              </span>
            )}
            <ChevronDown
              className={`ml-auto w-5 h-5 transition-transform ${
                showFilters ? "rotate-180" : ""
              }`}
            />
          </button>

          {showFilters && (
            <div className="bg-white rounded-3xl shadow-2xl border border-amber-100 animate-popup-lift overflow-hidden">
              <div className="flex justify-between items-center mb-6 px-6 pt-6">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <Filter className="w-5 h-5 text-amber-600" />
                  Filter Partners
                </h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-amber-600 hover:text-amber-700 font-semibold flex items-center gap-1 bg-amber-50 px-3 py-1.5 rounded-full transition-all hover:bg-amber-100 shadow-sm"
                >
                  <X className="w-4 h-4" />
                  Clear All
                </button>
              </div>

              {/* Tab Headers - Horizontal scroll with Arrow Navigation */}
              <div className="relative px-6 pb-4 mb-6">
                {/* Arrow Buttons */}
                <button
                  onClick={() =>
                    tabsRef.current?.scrollBy({
                      left: -200,
                      behavior: "smooth",
                    })
                  }
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white rounded-full p-1.5 shadow-md hover:shadow-lg transition-all border border-gray-200"
                >
                  <ChevronLeft className="w-4 h-4 text-gray-600 hover:text-amber-600" />
                </button>
                <button
                  onClick={() =>
                    tabsRef.current?.scrollBy({ left: 200, behavior: "smooth" })
                  }
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white rounded-full p-1.5 shadow-md hover:shadow-lg transition-all border border-gray-200"
                >
                  <ChevronRight className="w-4 h-4 text-gray-600 hover:text-amber-600" />
                </button>

                {/* Fade Indicators */}
                <div className="absolute left-0 top-0 w-6 h-full bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
                <div className="absolute right-0 top-0 w-6 h-full bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

                {/* Scrollable Tabs */}
                <div
                  ref={tabsRef}
                  className="flex space-x-3 snap-x snap-mandatory overflow-x-auto scrollbar-thin scrollbar-thumb-amber-400 scrollbar-track-gray-200 scrollbar-visible pb-2"
                >
                  {filterTabs.map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setSelectedFilterTab(tab.key)}
                      className={`flex items-center gap-2 px-5 py-3 rounded-2xl whitespace-nowrap transition-all duration-300 flex-shrink-0 shadow-sm hover:shadow-md snap-center min-w-fit ${
                        selectedFilterTab === tab.key
                          ? "bg-gradient-to-r from-amber-600 to-amber-700 text-white scale-105"
                          : "bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 hover:from-amber-50 hover:to-amber-100 hover:scale-105"
                      }`}
                    >
                      {tab.icon}
                      <span className="font-semibold text-sm">{tab.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              <div className="px-6 pb-6">
                <FilterContent
                  animateContent={animateContent}
                  selectedFilterTab={selectedFilterTab}
                  filterConfig={filterConfig}
                  filters={filters}
                  rangeDefaults={rangeDefaults}
                  onFilterChange={handleFilterChange}
                  onRangeChange={handleRangeChange}
                />
              </div>
            </div>
          )}
        </div>

        {unlockError && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-lg px-4 py-3 flex items-start justify-between gap-3">
            <div className="flex items-start gap-2 flex-1">
              <Lock className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-red-800 mb-1">
                  Profile Access Required
                </p>
                <p className="text-sm text-red-600">{unlockError}</p>
              </div>
            </div>
            <button
              onClick={() => setUnlockError("")}
              className="text-red-400 hover:text-red-600 transition-colors flex-shrink-0"
              aria-label="Dismiss error"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {loading && matches.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-amber-600 border-t-transparent" />
            <p className="mt-3 text-sm text-gray-500">Loading matches...</p>
          </div>
        ) : error ? (
          <div className="text-center py-10 text-red-600">{error}</div>
        ) : matches.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            No profiles match your criteria yet.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {matches.map((partner) => {
                const partnerId = partner._id || partner.id;
                const isUnlocked = unlockedProfileIds.has(partnerId);
                return (
                  <PartnerCard
                    key={partnerId}
                    partner={partner}
                    isUnlocked={isUnlocked}
                    unlocking={unlockingId === partnerId}
                    showConfirm={showConfirm}
                    profileToUnlock={profileToUnlock}
                    Balance={Balance}
                    onUnlock={() => initiateUnlock(partner)}
                    onView={() => handleViewUnlockedProfile(partner)}
                    onImageClick={() => handleImageClick(partner)}
                    confirmUnlock={confirmUnlock}
                    cancelUnlock={cancelUnlock}
                  />
                );
              })}
            </div>

            {pagination.page < pagination.totalPages && (
              <div className="flex justify-center pt-6">
                <button
                  onClick={loadMorePartners}
                  className="px-6 py-3 rounded-xl bg-amber-600 text-white font-semibold hover:bg-amber-700 transition disabled:opacity-60"
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Load more"}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {selectedProfile && (
        <UnlockedProfileDetails
          profile={selectedProfile}
          onClose={() => {
            setSelectedProfile(null);
            // Refresh the matches to update unlocked status
            if (selectedProfile._id) {
              setUnlockedProfileIds((prev) => {
                const next = new Set(prev);
                next.add(selectedProfile._id);
                return next;
              });
            }
          }}
          onImageClick={() => handleImageClick(selectedProfile)}
        />
      )}
    </div>
  );
};

const FilterContent = ({
  animateContent,
  selectedFilterTab,
  filterConfig,
  filters,
  rangeDefaults,
  onFilterChange,
  onRangeChange,
}) => {
  const contentClasses = `transition-all duration-500 ease-out transform origin-top ${
    animateContent
      ? "opacity-100 translate-y-0 scale-100"
      : "opacity-0 translate-y-4 scale-95"
  }`;

  const currentFilter = filterConfig.find(
    (config) => config.key === selectedFilterTab
  );

  if (!currentFilter) {
    return (
      <div className={contentClasses}>
        <div className="p-4">
          <p className="text-sm text-gray-500">
            No options available for this filter.
          </p>
        </div>
      </div>
    );
  }

  const CheckboxOptions = ({ options = [], filterKey }) => {
    if (!options.length) {
      return (
        <div className="p-4">
          <p className="text-sm text-gray-500">
            No options available for this filter.
          </p>
        </div>
      );
    }

    return (
      <div className="flex flex-wrap gap-2 p-2">
        {options.map((option) => {
          const optionValue =
            typeof option === "string" ? option : option.value || "";
          const optionLabel =
            typeof option === "string"
              ? option
              : option.label || option.value || "";

          if (!optionValue || !optionLabel) return null;

          const isSelected = Array.isArray(filters[filterKey])
            ? filters[filterKey].includes(optionValue)
            : false;

          return (
            <label
              key={`${filterKey}-${optionValue}`}
              className="flex items-center space-x-2 cursor-pointer group bg-white rounded-lg px-3 py-2 shadow-sm hover:shadow-md hover:bg-amber-50 transition-all border border-gray-100"
            >
              <input
                type="checkbox"
                value={optionValue}
                checked={isSelected}
                onChange={onFilterChange(filterKey)}
                className="w-4 h-4 rounded border-2 border-amber-200 text-amber-600 focus:ring-amber-500 cursor-pointer"
              />
              <span className="text-sm text-gray-700 group-hover:text-amber-600 transition-colors font-medium truncate max-w-[150px]">
                {optionLabel}
              </span>
            </label>
          );
        })}
      </div>
    );
  };

  return (
    <div className={contentClasses}>
      <CheckboxOptions
        options={currentFilter.options}
        filterKey={currentFilter.key}
      />
    </div>
  );
};

const DetailPill = ({ icon, label, value }) => (
  <div className="flex items-center gap-1.5 bg-gray-50 rounded-lg px-2 py-1">
    {icon}
    <span className="text-[11px] text-gray-500">{label}:</span>
    <span className="text-[11px] font-semibold text-gray-700 truncate">
      {value || "N/A"}
    </span>
  </div>
);

const PartnerCard = ({
  partner,
  isUnlocked,
  unlocking,
  onUnlock,
  onView,
  onImageClick,
  showConfirm,
  profileToUnlock,
  Balance,
  confirmUnlock,
  cancelUnlock,
}) => {
  const minimalDetails = {
    age: partner.age || partner.formData?.age || "N/A",
    gender: partner.gender || partner.formData?.gender || "N/A",
    religion: partner.religion || partner.formData?.religion || "N/A",
    country: partner.country || partner.formData?.country || "N/A",
    state: partner.state || partner.formData?.state || "N/A",
    city: partner.city || partner.formData?.city || "N/A",
    occupation: partner.occupation || partner.formData?.occupation || "N/A",
  };

  const imageSrc = isUnlocked
    ? partner.profileImage || partner.image || "/placeholder.jpg"
    : "/placeholder.jpg";

  // Check if profile has multiple images
  const formData = partner.formData || {};
  const hasMultipleImages = 
    isUnlocked && 
    formData.additionalImages && 
    Array.isArray(formData.additionalImages) && 
    formData.additionalImages.length > 0;

  return (
    <article className="bg-white border border-gray-100 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden flex flex-col group cursor-pointer hover:border-amber-300">
      <div className="relative h-40 bg-gradient-to-br from-amber-100 to-orange-100">
        <div 
          className="h-full w-full relative cursor-pointer"
          onClick={() => onImageClick(partner)}
        >
          <img
            src={imageSrc}
            alt={partner.name || "Profile"}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            style={{ filter: isUnlocked ? "blur(0px)" : "blur(6px)" }}
          />
          
          {/* Multiple images indicator */}
          {/* {hasMultipleImages && isUnlocked && (
            <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-white/90 backdrop-blur-sm text-xs font-semibold text-amber-700 shadow-sm flex items-center gap-1">
              <Eye className="w-3 h-3" />
              <span>{formData.additionalImages.length + 1} photos</span>
            </div>
          )} */}

          {/* Click to view HD indicator */}
          {/* {isUnlocked && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <div className="flex items-center gap-2 bg-black/60 text-white px-3 py-1.5 rounded-full">
                <ZoomIn className="w-4 h-4" />
                <span className="text-sm font-semibold">Click to view HD</span>
              </div>
            </div>
          )} */}
        </div>
        
        {!isUnlocked && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col items-center justify-center text-white gap-2">
            <Lock className="w-8 h-8" />
            <p className="text-sm font-semibold">Unlock to view photo</p>
          </div>
        )}
        <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-xs font-semibold text-amber-700 shadow-sm">
          VIV ID: {partner.vivId || "Hidden"}
        </div>
      </div>
      <div className="p-4 flex flex-col gap-3 flex-1">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900 truncate">
            {partner.name || "Profile"}
          </h3>
          <span className="text-xs font-semibold bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full">
            {minimalDetails.age} yrs
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
          <DetailPill
            icon={<Users className="w-3 h-3" />}
            label="Gender"
            value={minimalDetails.gender}
          />
          <DetailPill
            icon={<User className="w-3 h-3" />}
            label="Religion"
            value={minimalDetails.religion}
          />
          <DetailPill
            icon={<MapPin className="w-3 h-3" />}
            label="Country"
            value={minimalDetails.country}
          />
          <DetailPill
            icon={<MapPin className="w-3 h-3" />}
            label="State"
            value={minimalDetails.state}
          />
          <DetailPill
            icon={<Briefcase className="w-3 h-3" />}
            label="City"
            value={minimalDetails.city}
          />
          <DetailPill
            icon={<Briefcase className="w-3 h-3" />}
            label="Occupation"
            value={minimalDetails.occupation}
          />
        </div>
      </div>
      <div className="p-4 border-t border-gray-100 relative">
        {/* CONFIRMATION POPUP - Shows above the button */}
        {showConfirm && profileToUnlock?._id === partner._id && (
          <div className="absolute bottom-full left-0 right-0 mb-2 z-50 animate-slideDown">
            <div className="bg-black border border-gray-700 rounded-xl shadow-lg p-3 relative">
              {/* Arrow pointing to button */}
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-black"></div>

              {/* Close button */}
              <button
                onClick={cancelUnlock}
                className="absolute top-2 right-2 text-gray-300 hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>

              <div className="mb-2">
                <h4 className="text-xs font-semibold text-white">
                  Confirm Unlock
                </h4>
                <p className="text-xs text-gray-300 mt-1">
                  Unlock{" "}
                  <span className="font-semibold text-white">
                    {partner.name || "this profile"}
                  </span>
                  ?
                </p>
                <p className="text-xs text-white mt-1">Uses 1 Balance</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={cancelUnlock}
                  className="flex-1 text-xs px-2 py-1.5 border border-gray-600 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmUnlock}
                  className="flex-1 text-xs px-2 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
                >
                  Yes, Unlock
                </button>
              </div>
            </div>
          </div>
        )}

        {/* UNLOCK/VIEW BUTTON */}
        {isUnlocked ? (
          <button
            onClick={() => onView(partner)}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold transition-all shadow hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <Eye className="w-4 h-4" />
            View full profile
          </button>
        ) : (
          <button
            onClick={onUnlock}
            disabled={unlocking}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold transition-all shadow hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-60"
          >
            {unlocking ? (
              <>
                <span className="h-3 w-3 rounded-full border-2 border-white border-t-transparent animate-spin" />
                Unlocking...
              </>
            ) : (
              <>
                <Unlock className="w-4 h-4" />
                Unlock profile
              </>
            )}
          </button>
        )}
        <p className="text-[11px] text-gray-500 text-center mt-2">
          Unlocking reveals complete biodata, documents, and visible photograph.
        </p>
      </div>
    </article>
  );
};

const UnlockedProfileDetails = ({ profile, onClose, onImageClick }) => {
  const formData = profile.formData || {};
  const formatValue = (value) => {
    if (Array.isArray(value)) return value.join(", ");
    if (value === null || value === undefined) return "N/A";
    if (typeof value === "object") return JSON.stringify(value);
    return value;
  };

  // Check if profile has multiple images
  const profileImages = [];
  if (profile.profileImage) {
    profileImages.push(profile.profileImage);
  }
  if (formData.additionalImages && Array.isArray(formData.additionalImages)) {
    profileImages.push(...formData.additionalImages.filter(img => img));
  }
  const hasMultipleImages = profileImages.length > 1;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between border-b border-gray-100 p-6">
          <div>
            <p className="text-sm font-semibold text-green-700 uppercase tracking-wide">
              Unlocked profile
            </p>
            <h3 className="text-2xl font-bold text-gray-900">{profile.name}</h3>
            <p className="text-sm text-gray-500">VIV ID: {profile.vivId}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 rounded-full border border-gray-200 p-2 transition"
            aria-label="Close profile"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid gap-6 p-6 lg:grid-cols-[280px,1fr]">
          <div className="bg-gray-50 rounded-2xl p-4 flex flex-col items-center text-center space-y-3">
            {/* Image with click functionality */}
            <div 
              className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg cursor-pointer group"
              onClick={onImageClick}
            >
              <img
                src={profile.profileImage || "/placeholder.jpg"}
                alt={profile.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />

              {/* Multiple images indicator */}
              {/* {hasMultipleImages && (
                <div className="absolute bottom-2 right-2 bg-amber-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                  {profileImages.length}
                </div>
              )} */}
            </div>

            <div className="space-y-1 text-sm text-gray-600">
              <p className="flex items-center justify-center gap-2">
                <Briefcase className="w-4 h-4 text-blue-600" />
                {formData.occupation || profile.occupation || "Not shared"}
              </p>
              <p className="flex items-center justify-center gap-2">
                <MapPin className="w-4 h-4 text-amber-600" />
                {[
                  formData.city || profile.city,
                  formData.state || profile.state,
                ]
                  .filter(Boolean)
                  .join(", ") || "Location hidden"}
              </p>
              <p className="flex items-center justify-center gap-2">
                <Mail className="w-4 h-4 text-green-600" />
                {profile.email || "Hidden"}
              </p>
              <p className="flex items-center justify-center gap-2">
                <Phone className="w-4 h-4 text-purple-600" />
                {formData.mobileNo || profile.mobileNo || "Hidden"}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <InfoBadge
                label="Gender"
                value={formData.gender || profile.gender}
              />
              <InfoBadge
                label="Religion"
                value={formData.religion || profile.religion}
              />
              <InfoBadge
                label="Marital status"
                value={formData.maritalStatus || profile.maritalStatus}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <InfoBadge label="Mother tongue" value={formData.motherTongue} />
              <InfoBadge label="Diet preference" value={formData.diet} />
            </div>
            <div className="rounded-2xl border border-gray-100 p-4">
              <p className="text-sm font-semibold text-gray-600 mb-3">
                Profile summary
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                <SummaryItem
                  label="Education"
                  value={formData.educationLevel}
                />
                <SummaryItem label="Occupation" value={formData.occupation} />
                <SummaryItem
                  label="Caste / Gotra"
                  value={[formData.caste, formData.gotra]
                    .filter(Boolean)
                    .join(" • ")}
                />
                <SummaryItem
                  label="Citizenship"
                  value={[
                    formData.country || profile.country,
                    formData.citizenshipStatus,
                  ]
                    .filter(Boolean)
                    .join(" • ")}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Eye className="w-5 h-5 text-green-600" />
            Full biodata
          </h4>
          <div className="grid gap-4 md:grid-cols-2">
            {(() => {
              // पहले filtered entries निकालो
              const filteredEntries = Object.entries(formData).filter(
                ([key]) => {
                  const hiddenFields = [
                    "profileImage",
                    "profileImagePublicId",
                    "documents",
                    "documentPublicIds",
                    "isVerified",
                    "profileCompleted",
                    "role",
                    "lastLogin",
                    "lastLogout",
                    "isOnline",
                    "updatedAt",
                    "createdAt",
                    "_id",
                    "additionalImages", // Hide from biodata display
                  ];
                  return !hiddenFields.includes(key);
                }
              );

              // अगर कोई entry नहीं है
              if (filteredEntries.length === 0) {
                return (
                  <p className="text-sm text-gray-500 col-span-2">
                    No additional biodata is available for this profile.
                  </p>
                );
              }

              // entries display करो
              return filteredEntries.map(([key, value]) => (
                <div key={key} className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    {prettifyLabel(key)}
                  </p>
                  <p className="text-sm font-semibold text-gray-900 mt-1">
                    {formatValue(value)}
                  </p>
                </div>
              ));
            })()}
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoBadge = ({ label, value }) => (
  <div className="bg-gray-50 rounded-xl p-3">
    <p className="text-xs uppercase tracking-wide text-gray-500">{label}</p>
    <p className="text-sm font-semibold text-gray-900">
      {value || "Not shared"}
    </p>
  </div>
);

const SummaryItem = ({ label, value }) => (
  <div>
    <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
    <p className="text-sm font-semibold text-gray-800">
      {value || "Not shared"}
    </p>
  </div>
);

const prettifyLabel = (key) =>
  key
    .replace(/([A-Z])/g, " $1")
    .replace(/[_-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^./, (c) => c.toUpperCase());

export default BrowseMatches;