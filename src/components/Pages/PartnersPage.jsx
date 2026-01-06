// Final Version of PartnersPage.jsx with Enhanced Filter Handling and Robust Fetching
import SearchPartners from "../../assets/BackgroundImagePertnerPage.jpg";
import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Heart,
  MapPin,
  Briefcase,
  Users,
  Filter,
  X,
  Search,
  ChevronDown,
  User,
  Cake,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const STATIC_FILTER_CONFIG = [
  {
    key: "diet",
    label: "Diet",
    options: ["Vegetarian", "Eggetarian", "Non-Vegetarian", "Vegan"],
  },
  { key: "gender", label: "Gender", options: ["Male", "Female", "Other"] },
  {
    key: "religion",
    label: "Religion",
    options: [
      "Hindu",
      "Jain",
      "Christian",
      "Muslim",
      "Sikh",
      "Buddhist",
      "Agnosticism",
    ],
  },
  {
    key: "maritalStatus",
    label: "Marital Status",
    options: ["Never Married", "Divorced", "Widowed", "Awaiting Divorce"],
  },
  {
    key: "motherTongue",
    label: "Mother Tongue",
    options: [
      "Hindi",
      "English",
      "Bengali",
      "Tamil",
      "Telugu",
      "Marathi",
      "Gujarati",
      "Punjabi",
      "Malayalam",
      "Kannada",
      "Odia",
      "Urdu",
      "Sanskrit",
    ],
  },
  {
    key: "caste",
    label: "Caste",
    options: [
      "Brahmin",
      "Kshatriya",
      "Vaishya",
      "Shudra",
      "General",
      "OBC",
      "SC",
      "ST",
    ],
  },
  {
    key: "occupation",
    label: "Occupation",
    options: [
      "Software Engineer",
      "Teacher",
      "Doctor",
      "Nurse",
      "Police Officer",
      "Driver",
      "Businessman",
      "Farmer",
      "Student",
      "Electrician",
      "Plumber",
      "Technician",
      "Accountant",
      "Shopkeeper",
      "Engineer",
      "Mechanic",
    ],
  },
  {
    key: "complextion",
    label: "Complextion",
    options: ["Fair", "Wheatish", "Medium", "Dark"],
  },
  {
    key: "hobbies",
    label: "Hobbies / Interests",
    options: [
      "Reading",
      "Writing",
      "Sports",
      "Music",
      "Dance",
      "Travel",
      "Cooking",
      "Photography",
      "Painting",
      "Gardening",
      "Yoga",
      "Meditation",
      "Gaming",
      "Movies",
      "Shopping",
    ],
  },
];

const buildInitialFilters = () => {
  const defaults = {};
  STATIC_FILTER_CONFIG.forEach((filter) => {
    defaults[filter.key] = [];
  });
  return defaults;
};

const PartnersPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [allPartners, setAllPartners] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTab, setSelectedTab] = useState("gender"); // Changed default to gender
  const [animateContent, setAnimateContent] = useState(true);
  const [user, setUser] = useState(null);
  const [isUserLoaded, setIsUserLoaded] = useState(false);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_KEY;

  const getDefaultFilters = (config = filterConfig) => {
    const defaults = {};
    config.forEach((filter) => {
      defaults[filter.key] = [];
    });
    return defaults;
  };

  const syncFiltersWithConfig = (config, previousFilters) => {
    const updated = {};
    config.forEach((filter) => {
      updated[filter.key] = Array.isArray(previousFilters[filter.key])
        ? [...previousFilters[filter.key]]
        : [];
    });

    return updated;
  };

  const getTabIcon = (key) => {
    switch (key) {
      case "diet":
        return <Cake className="w-4 h-4" />;
      case "gender":
        return <Users className="w-4 h-4" />;
      case "religion":
        return <User className="w-4 h-4" />;
      case "maritalStatus":
        return <Heart className="w-4 h-4" />;
      case "motherTongue":
      case "caste":
        return <Users className="w-4 h-4" />;
      case "occupation":
        return <Briefcase className="w-4 h-4" />;
      case "complextion":
        return <User className="w-4 h-4" />;
      case "hobbies":
        return <Heart className="w-4 h-4" />;
      default:
        return <Filter className="w-4 h-4" />;
    }
  };

  // Enhanced filter states matching your model fields
  const [filters, setFilters] = useState(() => buildInitialFilters());
  const [filterConfig, setFilterConfig] = useState(STATIC_FILTER_CONFIG);
  const [filterOptionsLoading, setFilterOptionsLoading] = useState(false);

  // Reference for smooth scroll
  const partnersSectionRef = useRef(null);
  const tabsRef = useRef(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Animate content on tab change
  useEffect(() => {
    setAnimateContent(false);
    const timer = setTimeout(() => setAnimateContent(true), 50);
    return () => clearTimeout(timer);
  }, [selectedTab]);

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("vivahanamToken");
      if (!token) {
        console.warn("No token found, skipping user data fetch");
        setIsUserLoaded(true);
        return;
      }
      try {
        const response = await fetch(`${API_URL}/user/me`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (response.ok) {
          const userData = await response.json();
          setUser(userData.user || {});
        } else {
          console.error(
            "Failed to fetch user data:",
            response.status,
            response.statusText
          );
          setError("Failed to load user preferences. Using defaults.");
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Network error loading user data.");
      } finally {
        setIsUserLoaded(true);
      }
    };
    fetchUserData();
  }, [API_URL]);

  // Fetch dynamic filter configuration
  useEffect(() => {
    const fetchFilterOptions = async () => {
      const token = localStorage.getItem("vivahanamToken");
      if (!API_URL || !token) {
        // Ensure filters align with whichever config we already have
        setFilters((prev) => syncFiltersWithConfig(filterConfig, prev));
        return;
      }

      try {
        setFilterOptionsLoading(true);
        const response = await fetch(`${API_URL}/user/partners/filters`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to load filter options (${response.status})`);
        }

        const payload = await response.json();
        const dynamicFilters = payload.data?.filters || [];

        const configToApply =
          dynamicFilters.length > 0 ? dynamicFilters : STATIC_FILTER_CONFIG;

        setFilterConfig(configToApply);
        setFilters((prev) => syncFiltersWithConfig(configToApply, prev));
      } catch (fetchError) {
        console.error("❌ Error fetching partner filter options:", fetchError);
      } finally {
        setFilterOptionsLoading(false);
      }
    };

    fetchFilterOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [API_URL]);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Handle filter changes
  const handleFilterChange = (filterKey) => (e) => {
    const value = e.target.value;
    setFilters((prevFilters) => {
      const currentValues = prevFilters[filterKey] || [];
      let newValues;
      if (currentValues.includes(value)) {
        newValues = currentValues.filter((v) => v !== value);
      } else {
        newValues = [...currentValues, value];
      }
      return {
        ...prevFilters,
        [filterKey]: newValues,
      };
    });
  };

  const clearFilters = () => {
    setFilters(getDefaultFilters());
    setShowFilters(false);
  };

  // Build URLSearchParams for API request with enhanced filters
  const buildParams = (query, appliedFilters, page, limit = 20) => {
    const params = new URLSearchParams();

    params.append("page", page.toString());
    params.append("limit", limit.toString());

    if (query?.trim()) {
      params.append("search", query.trim());
    }

    // Include only your specific filters
    const filterKeys = [
      "diet",
      "gender",
      "religion",
      "maritalStatus",
      "motherTongue",
      "caste",
      "occupation",
      "complextion",
      "hobbies",
    ];

    filterKeys.forEach((key) => {
      const value = appliedFilters[key];
      if (Array.isArray(value) && value.length > 0) {
        value.forEach((entry) => {
          params.append(key, entry);
        });
      }
    });

    console.log("🔍 API Request Params:", params.toString());
    return params;
  };

  // Enhanced fetch function with better error handling
  const fetchSinglePage = async (page, query, appliedFilters, limit = 20) => {
    const params = buildParams(query, appliedFilters, page, limit);
    const url = `${API_URL}/user/partners?${params.toString()}`;

    const token = localStorage.getItem("vivahanamToken");

    try {
      console.log("🔄 Fetching partners from:", url);

      const response = await fetch(url, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ HTTP Error:", response.status, errorText);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (!data.success) {
        console.error("❌ API Error:", data.message);
        throw new Error(data.message || "API returned false");
      }

      console.log(
        "✅ API Response:",
        data.data?.partners?.length || 0,
        "partners found"
      );

      return {
        partners: data.data?.partners || data.partners || [],
        pagination: data.data?.pagination ||
          data.pagination || { page, totalPages: 1, total: 0 },
      };
    } catch (error) {
      console.error("❌ Error in fetchSinglePage:", error);
      throw error;
    }
  };

  // Load more partners
  const loadMorePartners = async (page, query, appliedFilters) => {
    setLoading(true);
    setError(null);
    try {
      const { partners: newPartners, pagination } = await fetchSinglePage(
        page,
        query,
        appliedFilters,
        20
      );
      setAllPartners((prev) => [...prev, ...newPartners]);
      setPagination({
        page: page,
        totalPages: pagination.totalPages || 1,
        total: pagination.total || 0,
      });
    } catch (error) {
      console.error("Error fetching more partners:", error);
      setError(`Failed to load more: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch and filter/search handling
  useEffect(() => {
    if (!isUserLoaded) return;

    setAllPartners([]);
    setPagination({ page: 1, totalPages: 1, total: 0 });

    const loadInitialPartners = async () => {
      if (!API_URL) {
        console.error("API_URL not set!");
        setError("API URL not configured.");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        console.log("🔄 Loading initial partners with filters:", filters);

        const { partners: partners1, pagination: pag1 } = await fetchSinglePage(
          1,
          debouncedSearch,
          filters,
          20
        );

        console.log("✅ Initial partners loaded:", partners1.length);

        setAllPartners(partners1);
        setPagination({
          page: pag1.page || 1,
          totalPages: pag1.totalPages || 1,
          total: pag1.total || 0,
        });
      } catch (error) {
        console.error("Initial fetch error:", error);
        setError(` Unable to fetch partners at the moment : please try after some time `);
        setAllPartners([]);
      } finally {
        setLoading(false);
      }
    };

    loadInitialPartners();
  }, [debouncedSearch, filters, isUserLoaded, API_URL]);

  const handleProfileClick = (partnerId) => {
    navigate("/PlanHomePage");
  };

  const handleSubscription = () => {
    navigate("/PlanHomePage");
  };

  // Load more partners
  const handleLoadMore = () => {
    if (pagination.page < pagination.totalPages && !loading) {
      loadMorePartners(pagination.page + 1, debouncedSearch, filters);
    }
  };

  // Smooth scroll to partners section
  const handleSearchPartners = () => {
    partnersSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Scroll tabs left/right with arrows
  const scrollTabs = (direction) => {
    if (tabsRef.current) {
      const scrollAmount = 200;
      tabsRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const FloatingParticles = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 bg-rose-400/20 rounded-full animate-float"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${i * 0.8}s`,
            animationDuration: `${4 + Math.random() * 3}s`,
          }}
        />
      ))}
    </div>
  );

  // Tab configuration - Rearranged order: Gender, Complextion, Diet, Caste, then others
  const filterTabs = useMemo(() => {
    const specifiedFilters = [
      "gender",     // First
      "complextion", // Second
      "diet",       // Third
      "caste",      // Fourth
      "religion",   // Fifth
      "maritalStatus", // Sixth
      "motherTongue", // Seventh
      "occupation", // Eighth
      "hobbies",    // Ninth proper not working 
    ];

    // Filter and sort according to the specified order
    const filteredTabs = filterConfig
      .filter((tab) => specifiedFilters.includes(tab.key))
      .sort((a, b) => {
        return specifiedFilters.indexOf(a.key) - specifiedFilters.indexOf(b.key);
      })
      .map((tab) => ({
        key: tab.key,
        label: tab.label,
        icon: getTabIcon(tab.key),
      }));

    return filteredTabs;
  }, [filterConfig]);

  useEffect(() => {
    if (filterTabs.length === 0) return;
    const exists = filterTabs.some((tab) => tab.key === selectedTab);
    if (!exists) {
      setSelectedTab(filterTabs[0].key);
    }
  }, [filterTabs, selectedTab]);

  // Active filter count
  const activeFilterCount = (() => {
    let count = 0;

    filterConfig.forEach((filter) => {
      if (filters[filter.key] && filters[filter.key].length > 0) {
        count += 1;
      }
    });

    return count;
  })();

  const renderFilterContent = () => {
    const contentClasses = `transition-all duration-500 ease-out transform origin-top ${
      animateContent
        ? "opacity-100 translate-y-0 scale-100"
        : "opacity-0 translate-y-4 scale-95"
    }`;

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
            const value =
              typeof option === "string"
                ? option
                : option.value ?? option.label ?? "";
            const label =
              typeof option === "string"
                ? option
                : option.label || option.value;

            if (!value || !label) return null;

            return (
              <label
                key={`${filterKey}-${value}`}
                className="flex items-center space-x-2 cursor-pointer group bg-white rounded-lg px-3 py-2 shadow-sm hover:shadow-md hover:bg-rose-50 transition-all border border-gray-100"
              >
                <input
                  type="checkbox"
                  value={value}
                  checked={filters[filterKey]?.includes(value) || false}
                  onChange={handleFilterChange(filterKey)}
                  className="w-4 h-4 rounded border-2 border-rose-200 text-rose-600 focus:ring-rose-500 cursor-pointer"
                />
                <span className="text-sm text-gray-700 group-hover:text-rose-600 transition-colors font-medium truncate max-w-[150px]">
                  {label}
                </span>
              </label>
            );
          })}
        </div>
      );
    };

    const dynamicFilter = filterConfig.find(
      (config) => config.key === selectedTab
    );
    if (dynamicFilter) {
      return (
        <div className={contentClasses}>
          <CheckboxOptions
            options={dynamicFilter.options}
            filterKey={dynamicFilter.key}
          />
        </div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative w-full min-h-screen overflow-hidden bg-gradient-to-br from-rose-50 via-amber-50 to-orange-50 pt-17 md:pt-12 lg:pt-18">
        {" "}
        <FloatingParticles />
        <div className="w-full h-full flex items-center justify-center relative z-10 px-4 bg-amber-100 py-10">
          {" "}
          <div className="container mx-auto max-w-7xl">
            <div
              className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center transition-all duration-1000 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              {/* Left Side – Image */}
              <div className=" flex justify-center lg:justify-start order-1 lg:order-1 w-full mb-6 lg:mb-0">
                <div className=" relative w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl transform transition-transform duration-500 hover:scale-105">
                  <img
                    src={SearchPartners}
                    alt="Best Indian Matrimonial"
                    className="w-full h-auto object-cover"
                  />
                  {/* <div className="absolute inset-0 bg-gradient-to-t from-rose-900/50 to-transparent"></div> */}
                </div>
              </div>

              {/* Right Side – Content */}
              <div className="flex flex-col justify-center space-y-6 text-center lg:text-left order-2 lg:order-2 w-full px-4 lg:px-0">
                <h1
                  className={`text-4xl lg:text-6xl font-bold text-rose-700 leading-tight transition-all duration-700 delay-300 ${
                    isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
                  }`}
                  style={{ fontFamily: "serif" }}
                >
                  Find Your Perfect
                  <span className="block text-amber-600 mt-2">
                    Life Partner
                  </span>
                </h1>

                <p
                  className={`text-lg lg:text-xl text-gray-700 leading-relaxed max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mx-auto lg:mx-0 transition-all duration-700 delay-700 ${
                    isVisible ? "opacity-100" : "opacity-0"
                  }`}
                >
                  A trusted matrimonial platform connecting Indian singles
                  across the USA. Discover verified bride and groom profiles and
                  start your journey towards a meaningful connection today.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start translate-y-[40px]">
                  <button
                    className="group px-8 py-4 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto min-w-[160px]"
                    onClick={handleSubscription}
                  >
                    <span className="flex items-center justify-center gap-2">
                      <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      Subscribe Now
                    </span>
                  </button>

                  <button
                    className="group px-8 py-4 bg-white border-2 border-rose-600 text-rose-700 hover:bg-rose-50 font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto min-w-[160px]"
                    onClick={handleSearchPartners}
                  >
                    <span className="flex items-center justify-center gap-2">
                      <Search className="w-5 h-5" />
                      Search Partners
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Grid */}
      <section
        ref={partnersSectionRef}
        className="relative w-full py-16 px-4 bg-amber-100"
      >
        <div className="container mx-auto max-w-7xl">
          {error && (
            <div className="text-center py-12 bg-red-50 rounded-2xl border-2 border-red-200 p-6">
              <p className="text-red-600 font-semibold mb-2">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Retry
              </button>
            </div>
          )}

          <div className="mb-8 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex flex-col items-start gap-1 px-6 py-4 rounded-2xl font-semibold transition-all shadow-lg hover:shadow-xl ${
                  showFilters
                    ? "bg-gradient-to-r from-rose-600 to-pink-600 text-white"
                    : "bg-white border-2 border-rose-200 text-gray-700 hover:border-rose-400 hover:bg-rose-50"
                }`}
              >
                <div className="flex items-center gap-2 w-full">
                  <Filter className="w-5 h-5" />
                  <span>Search Partner Filters</span>
                  {activeFilterCount > 0 && (
                    <span className="bg-white text-rose-600 text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-md ml-2">
                      {activeFilterCount}
                    </span>
                  )}
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ml-auto ${
                      showFilters ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </button>
            </div>

            {showFilters && (
              <div className="bg-white rounded-3xl shadow-2xl border border-rose-100 animate-popup-lift max-h-[80vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6 px-6 pt-6">
                  <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <Filter className="w-5 h-5 text-rose-600" />
                    Filter Partners
                  </h3>
                  <button
                    onClick={clearFilters}
                    className="text-sm text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1 bg-rose-50 px-3 py-1.5 rounded-full transition-all hover:bg-rose-100 shadow-sm"
                  >
                    <X className="w-4 h-4" />
                    Clear All
                  </button>
                </div>

                {filterOptionsLoading && (
                  <div className="px-6 pb-2 text-sm text-gray-500">
                    Updating filter options...
                  </div>
                )}

                {/* Tab Headers - Horizontal scroll with Arrow Navigation */}
                <div className="relative px-6 pb-4 mb-6">
                  {/* Arrow Buttons */}
                  <button
                    onClick={() => scrollTabs("left")}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white rounded-full p-1.5 shadow-md hover:shadow-lg transition-all border border-gray-200"
                  >
                    <ChevronLeft className="w-4 h-4 text-gray-600 hover:text-rose-600" />
                  </button>
                  <button
                    onClick={() => scrollTabs("right")}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white rounded-full p-1.5 shadow-md hover:shadow-lg transition-all border border-gray-200"
                  >
                    <ChevronRight className="w-4 h-4 text-gray-600 hover:text-rose-600" />
                  </button>

                  {/* Fade Indicators */}
                  <div className="absolute left-0 top-0 w-6 h-full bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
                  <div className="absolute right-0 top-0 w-6 h-full bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

                  {/* Scrollable Tabs */}
                  <div
                    ref={tabsRef}
                    className="flex space-x-3 snap-x snap-mandatory overflow-x-auto scrollbar-thin scrollbar-thumb-rose-400 scrollbar-track-gray-200 scrollbar-visible pb-2"
                  >
                    {filterTabs.map((tab) => (
                      <button
                        key={tab.key}
                        onClick={() => setSelectedTab(tab.key)}
                        className={`flex items-center gap-2 px-5 py-3 rounded-2xl whitespace-nowrap transition-all duration-300 flex-shrink-0 shadow-sm hover:shadow-md snap-center min-w-fit ${
                          selectedTab === tab.key
                            ? "bg-gradient-to-r from-rose-600 to-pink-600 text-white scale-105"
                            : "bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 hover:from-rose-50 hover:to-rose-100 hover:scale-105"
                        }`}
                      >
                        {tab.icon}
                        <span className="font-semibold text-sm">
                          {tab.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tab Content */}
                <div className="px-6 pb-6">{renderFilterContent()}</div>
              </div>
            )}
          </div>

          {loading && allPartners.length === 0 ? (
            <div className="text-center py-16">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-rose-600 border-t-transparent mx-auto"></div>
              <p className="mt-4 text-gray-600 font-semibold">
                Finding your perfect matches...
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {allPartners.slice(0, 20).map((partner) => (
                  <PartnerCard
                    key={partner._id || partner.id}
                    partner={partner}
                    onClick={handleProfileClick}
                  />
                ))}
              </div>

              {allPartners.length === 0 && !loading && !error && (
                <div className="text-center py-16">
                  <User className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    No profiles found
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Try adjusting your filters or search terms
                  </p>
                  <div className="space-y-4">
                    <button
                      onClick={clearFilters}
                      className="px-6 py-3 bg-rose-600 text-white rounded-xl font-semibold hover:bg-rose-700 transition-all mx-2"
                    >
                      Clear Filters
                    </button>
                    <button
                      onClick={() => window.location.reload()}
                      className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all mx-2"
                    >
                      Refresh Page
                    </button>
                  </div>
                </div>
              )}

              {/* More Profiles Message */}
              {allPartners.length > 0 && (
                <div className="text-center mt-12 p-8 bg-gradient-to-r from-amber-100 to-rose-100 rounded-2xl border-2 border-amber-300 shadow-lg">
                  <div className="max-w-2xl mx-auto">
                    <h3 className="text-2xl font-bold text-amber-800 mb-4">
                      Want to See More Profiles?
                    </h3>
                    {/* <p className="text-amber-700 mb-6 text-lg">
                      Discover thousands of verified profiles and connect with
                      your perfect match.
                    </p> */}
                    <button
                      onClick={handleSubscription}
                      className="px-5 py-4 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 text-lg"
                    >
                      <span className="flex items-center justify-center gap-2">
                        <Heart className="w-4 h-4" />
                        View All Profiles - Subscribe Now
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
            opacity: 0.4;
          }
          50% {
            transform: translateY(-30px) translateX(20px);
            opacity: 0.8;
          }
        }

        @keyframes popup-lift {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .animate-float {
          animation: float linear infinite;
        }

        .animate-popup-lift {
          animation: popup-lift 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .scrollbar-thin::-webkit-scrollbar {
          height: 8px;
        }

        .scrollbar-thin::-webkit-scrollbar-track {
          background: #e5e7eb;
          border-radius: 4px;
        }

        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #fb7185;
          border-radius: 4px;
          border: 1px solid #e5e7eb;
        }

        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: #f43f5e;
        }

        .scrollbar-thin {
          scrollbar-width: thin;
          scrollbar-color: #fb7185 #e5e7eb;
        }

        .scrollbar-visible {
          overflow-x: auto;
        }

        .snap-x {
          scroll-snap-type: x mandatory;
        }

        .snap-center {
          scroll-snap-align: center;
        }
      `}</style>
    </div>
  );
};

// Partner Card Component
const PartnerCard = ({ partner, onClick }) => {
  // const [isLiked, setIsLiked] = useState(false);

  // Helper function to safely get any field value
  const getFieldValue = (fieldName) => {
    // First check root level (transformed fields)
    if (partner[fieldName] !== undefined && partner[fieldName] !== "") {
      return partner[fieldName];
    }

    // Then check nested formData as fallback
    if (
      partner.formData &&
      partner.formData[fieldName] !== undefined &&
      partner.formData[fieldName] !== ""
    ) {
      return partner.formData[fieldName];
    }

    return "N/A";
  };

  // Helper function to get profile image
  const getProfileImage = () => {
    return partner.profileImage || "/placeholder.jpg";
  };

  return (
    <div
      className="group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 hover:border-rose-300 cursor-pointer"
      onClick={() => onClick(partner._id || partner.id)}
    >
      <div className="relative h-32 sm:h-36 overflow-hidden bg-gradient-to-br from-rose-100 to-amber-100">
        <img
          src={getProfileImage()}
          alt="Profile"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          style={{ filter: "blur(6px)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

        {/* <button
          onClick={(e) => {
            e.stopPropagation();
            setIsLiked(!isLiked);
          }}
          className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:scale-110 transition-transform"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isLiked ? "fill-rose-600 text-rose-600" : "text-gray-600"
            }`}
          />
        </button> */}
      </div>

      <div className="p-3 space-y-2">
        {/* VivId Only - Right-aligned */}
        <div className="flex justify-end items-center">
          <p className="text-xs text-rose-600 font-bold">
            VIVID: {partner.vivId || "N/A"}
          </p>
        </div>

        {/* Gender */}
        <div className="flex flex-wrap gap-1">
          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50">
            <Users className="w-3 h-3 text-amber-600" />
            <span className="text-xs font-semibold text-amber-700">
              Gender: {getFieldValue("gender")}
            </span>
          </div>
        </div>

        {/* Religion & Country */}
        <div className="flex flex-wrap gap-1">
          <div className="inline-flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-full">
            <User className="w-3 h-3 text-amber-600" />
            <span className="text-xs font-semibold text-amber-700">
              Religion: {getFieldValue("religion")}
            </span>
          </div>
          <div className="inline-flex items-center gap-1 bg-blue-50 px-2 py-0.5 rounded-full">
            <MapPin className="w-3 h-3 text-blue-600" />
            <span className="text-xs font-semibold text-blue-700">
              Country: {getFieldValue("country")}
            </span>
          </div>
        </div>

        {/* Marital Status */}
        <div className="flex flex-wrap gap-1">
          <div className="inline-flex items-center gap-1 bg-rose-50 px-2 py-0.5 rounded-full">
            <Heart className="w-3 h-3 text-rose-600" />
            <span className="text-xs font-semibold text-rose-700">
              Status: {getFieldValue("maritalStatus")}
            </span>
          </div>
        </div>

        {/* Complextion */}
        <div className="flex flex-wrap gap-1">
          <div className="inline-flex items-center gap-1 bg-rose-50 px-2 py-0.5 rounded-full">
            <User className="w-3 h-3 text-rose-600" />
            <span className="text-xs font-semibold text-rose-700">
              Complextion: {getFieldValue("complextion")}
            </span>
          </div>
        </div>

        {/* Occupation */}
        <div className="flex flex-wrap gap-1">
          <div className="inline-flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-full flex-1 min-w-0">
            <Briefcase className="w-3 h-3 text-amber-600 flex-shrink-0" />
            <span className="text-xs font-semibold text-amber-700 truncate">
              Occupation: {getFieldValue("occupation")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnersPage;