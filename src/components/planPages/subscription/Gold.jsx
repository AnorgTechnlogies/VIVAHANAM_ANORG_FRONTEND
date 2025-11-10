import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const GoldDashboard = () => {
  const [user, setUser] = useState(null); 
  const [activeTab, setActiveTab] = useState("overview");
  const [matches, setMatches] = useState([]);
  const [messages, setMessages] = useState([]);
  const [profileData, setProfileData] = useState({});
  const [settings, setSettings] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({ 
    ageMin: 25, 
    ageMax: 35, 
    location: "",
    profession: "",
    religion: "",
    diet: ""
  });
  const [astrologyData, setAstrologyData] = useState({});
  const navigate = useNavigate();

  // Initialize all data
  useEffect(() => {
    // Mock user data
    const userData = {
      id: 1,
      name: "Priya Reddy",
      email: "priya.reddy@example.com",
      phone: "+1 (555) 123-4567",
      location: "Austin, USA",
      dob: "1991-03-15",
      gender: "Female",
      subscription: {
        plan: "Gold",
        status: "active",
        expires: "2024-12-31",
        price: "$999/year",
        features: [
          "Enhanced Match Making",
          "Horoscope Matching",
          "Unlimited Messages",
          "Advanced Search Filters",
          "Basic Astrology Reports"
        ]
      },
      profile: {
        completed: 90,
        verified: true,
        photos: 6,
        matches: 28,
        messages: 67,
        bio: "Marketing manager passionate about creativity and cultural values. Looking for a partner who shares similar life goals.",
        education: "MBA Marketing",
        profession: "Marketing Manager",
        income: "$110,000",
        religion: "Hindu",
        caste: "Reddy",
        motherTongue: "Telugu",
        height: "5'6\"",
        maritalStatus: "Never Married",
        horoscope: "Pisces"
      }
    };
    setUser(userData);
    setProfileData(userData.profile);

    // Gold profiles data - Mid-tier profiles
    const goldProfiles = [
      {
        id: 1,
        name: "Dr. Arjun Nair",
        age: 31,
        location: "Austin, TX USA",
        profession: "Dentist",
        description: "Dental surgeon with own practice. Enjoys classical music and traveling.",
        image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=2070",
        interests: ["Dentistry", "Classical Music", "Travel", "Reading"],
        gender: "male",
        salary: 180000,
        religion: "Hindu",
        diet: "Vegetarian",
        language: "Malayalam, English",
        education: "BDS - Dental Surgery",
        family: "Medical Family",
        height: "5'10\"",
        horoscope: "Available",
        lastActive: "2 hours ago"
      },
      {
        id: 2,
        name: "Anjali Mehta",
        age: 29,
        location: "Dallas, TX USA",
        profession: "Financial Analyst",
        description: "Investment banking professional with passion for finance and dance.",
        image: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?q=80&w=2067",
        interests: ["Finance", "Bharatanatyam", "Yoga", "Cooking"],
        gender: "female",
        salary: 120000,
        religion: "Hindu",
        diet: "Vegetarian",
        language: "Hindi, English",
        education: "MBA Finance",
        family: "Business Family",
        height: "5'5\"",
        horoscope: "Matched",
        lastActive: "1 day ago"
      },
      {
        id: 3,
        name: "Rohit Kapoor",
        age: 33,
        location: "Houston, TX USA",
        profession: "Engineering Manager",
        description: "Tech lead managing software teams. Values family traditions and modern lifestyle balance.",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=2070",
        interests: ["Technology", "Cricket", "Photography", "Music"],
        gender: "male",
        salary: 150000,
        religion: "Hindu",
        diet: "Non-Vegetarian",
        language: "Punjabi, English",
        education: "MS Computer Engineering",
        family: "Academic Family",
        height: "5'11\"",
        horoscope: "Available",
        lastActive: "3 hours ago"
      },
      {
        id: 4,
        name: "Divya Iyer",
        age: 27,
        location: "San Antonio, TX USA",
        profession: "Architect",
        description: "Creative architect blending modern designs with traditional elements.",
        image: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?q=80&w=2070",
        interests: ["Architecture", "Painting", "Classical Dance", "Travel"],
        gender: "female",
        salary: 95000,
        religion: "Hindu",
        diet: "Vegetarian",
        language: "Tamil, English",
        education: "M.Arch Architecture",
        family: "Artistic Family",
        height: "5'4\"",
        horoscope: "Matched",
        lastActive: "5 hours ago"
      }
    ];
    setMatches(goldProfiles);

    // Mock messages data
    const initialMessages = [
      {
        id: 1,
        matchId: 1,
        name: "Dr. Arjun Nair",
        message: "Hello Priya! I enjoyed reading your profile. Would you like to connect?",
        time: "11:30 AM",
        unread: true,
        avatar: "👨‍⚕️",
        type: "received"
      },
      {
        id: 2,
        matchId: 1,
        name: "You",
        message: "Hi Arjun! Thank you for your message. I'd love to learn more about you.",
        time: "11:35 AM",
        unread: false,
        avatar: "👤",
        type: "sent"
      }
    ];
    setMessages(initialMessages);

    // Mock astrology data
    setAstrologyData({
      horoscope: "Pisces",
      compatibility: [
        { sign: "Cancer", score: 88 },
        { sign: "Scorpio", score: 85 },
        { sign: "Taurus", score: 82 }
      ],
      auspiciousDates: [
        { date: "2024-04-15", occasion: "Meeting", significance: "Favorable" }
      ]
    });

    // Mock settings
    setSettings({
      emailNotifications: true,
      smsNotifications: false,
      profileVisibility: "all",
      matchSuggestions: true,
      astrologyReports: true
    });
  }, []);

  // Filter profiles based on search and filters
  const filteredProfiles = matches.filter((profile) => {
    const matchesSearch = profile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         profile.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         profile.profession.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAge = profile.age >= filters.ageMin && profile.age <= filters.ageMax;
    const matchesLocation = !filters.location || profile.location.toLowerCase().includes(filters.location.toLowerCase());
    const matchesProfession = !filters.profession || profile.profession.toLowerCase().includes(filters.profession.toLowerCase());
    const matchesReligion = !filters.religion || profile.religion === filters.religion;
    const matchesDiet = !filters.diet || profile.diet === filters.diet;
    
    return matchesSearch && matchesAge && matchesLocation && matchesProfession && 
           matchesReligion && matchesDiet;
  });

  // Handler functions
  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("authToken");
      navigate("/login");
    }
  };

  const upgradePlan = () => {
    navigate("/diamond");
  };

  const handleProfileUpdate = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSettingChange = (setting, value) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }));
    alert(`Setting updated: ${setting} = ${value}`);
  };

  const sendMessage = (matchId, message) => {
    if (!message.trim()) return;
    
    const newMsg = {
      id: messages.length + 1,
      matchId,
      name: "You",
      message: message,
      time: "Just now",
      unread: false,
      avatar: "👤",
      type: "sent"
    };
    
    setMessages(prev => [...prev, newMsg]);
    alert(`Message sent!`);
  };

  const checkCompatibility = (matchId) => {
    const match = matches.find(m => m.id === matchId);
    if (match) {
      alert(`Basic compatibility with ${match.name}:\n\n- Horoscope Match: 85%\n- Values: 80%`);
    }
  };

  const saveProfileChanges = () => {
    alert("Profile changes saved successfully!");
  };

  const deleteAccount = () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      alert("Account deletion request submitted.");
    }
  };

  if (!user) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  return (
    <div className="min-h-screen bg-amber-100">
      {/* Header */}
      <header className="bg-amber-800 shadow-sm border-b border-amber-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-amber-600 to-amber-800 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">G</span>
              </div>
              <h1 className="ml-3 text-xl font-bold text-white">Gold Dashboard</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-white">{user.name}</p>
                <p className="text-sm text-amber-200 font-semibold">{user.subscription.plan} Member</p>
              </div>
              <button
                onClick={handleLogout}
                className="bg-amber-700 hover:bg-amber-800 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto py-6  bg-amber-100 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border border-amber-200 p-6">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-gradient-to-r from-amber-500 to-amber-700 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl text-white">🥇</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">{user.subscription.plan} Plan</h3>
                  <p className="text-gray-600">{user.subscription.price}</p>
                  <div className="mt-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                  </div>
                </div>

                <nav className="space-y-2">
                  {[
                    { id: "overview", name: "Overview", icon: "📊" },
                    { id: "matches", name: "Gold Matches", icon: "🥇", count: matches.length },
                    { id: "astrology", name: "Astrology", icon: "🔮" },
                    { id: "messages", name: "Messages", icon: "💬", count: messages.filter(m => m.unread).length },
                    { id: "profile", name: "My Profile", icon: "👤" },
                    { id: "settings", name: "Settings", icon: "⚙️" }
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        activeTab === item.id
                          ? "bg-amber-100 text-amber-900"
                          : "text-gray-600 hover:bg-amber-50"
                      }`}
                    >
                      <div className="flex items-center">
                        <span className="mr-3">{item.icon}</span>
                        {item.name}
                      </div>
                      {item.count > 0 && (
                        <span className="bg-amber-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {item.count}
                        </span>
                      )}
                    </button>
                  ))}
                </nav>

                <button
                  onClick={upgradePlan}
                  className="w-full mt-6 bg-gradient-to-r from-amber-600 to-amber-800 text-white py-2 rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                  Upgrade to Diamond
                </button>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Overview Tab */}
              {activeTab === "overview" && (
                <div className="space-y-6">
                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white rounded-lg shadow-sm border border-amber-200 p-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <span className="text-xl">🥇</span>
                        </div>
                        <div className="ml-3">
                          <p className="text-xs font-medium text-gray-600">Gold Matches</p>
                          <p className="text-lg font-bold text-gray-900">{user.profile.matches}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-amber-200 p-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <span className="text-xl">💬</span>
                        </div>
                        <div className="ml-3">
                          <p className="text-xs font-medium text-gray-600">Messages</p>
                          <p className="text-lg font-bold text-gray-900">{user.profile.messages}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-amber-200 p-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <span className="text-xl">📈</span>
                        </div>
                        <div className="ml-3">
                          <p className="text-xs font-medium text-gray-600">Profile Complete</p>
                          <p className="text-lg font-bold text-gray-900">{user.profile.completed}%</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Search & Filters Section */}
                  <div className="bg-white rounded-lg shadow-sm border border-amber-200 p-4">
                    <h3 className="text-md font-bold text-gray-900 mb-3">Find Your Match</h3>
                    
                    <div className="flex flex-col md:flex-row gap-3 mb-4">
                      <div className="flex-1">
                        <input
                          type="text"
                          placeholder="Search gold members by name or description..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full px-3 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                      <button className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors font-semibold text-sm">
                        Search
                      </button>
                    </div>

                    {/* Advanced Filters */}
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2 mb-4">
                      <select
                        value={filters.ageMin}
                        onChange={(e) => setFilters({ ...filters, ageMin: parseInt(e.target.value) })}
                        className="px-2 py-1 bg-white border border-amber-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 text-sm"
                      >
                        <option value={25}>Min: 25</option>
                        <option value={28}>Min: 28</option>
                        <option value={30}>Min: 30</option>
                      </select>
                      <select
                        value={filters.ageMax}
                        onChange={(e) => setFilters({ ...filters, ageMax: parseInt(e.target.value) })}
                        className="px-2 py-1 bg-white border border-amber-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 text-sm"
                      >
                        <option value={35}>Max: 35</option>
                        <option value={40}>Max: 40</option>
                        <option value={45}>Max: 45</option>
                      </select>
                      <input
                        type="text"
                        placeholder="Location"
                        value={filters.location}
                        onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                        className="px-2 py-1 bg-white border border-amber-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 text-sm"
                      />
                      <select
                        value={filters.religion}
                        onChange={(e) => setFilters({ ...filters, religion: e.target.value })}
                        className="px-2 py-1 bg-white border border-amber-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 text-sm"
                      >
                        <option value="">Religion</option>
                        <option value="Hindu">Hindu</option>
                        <option value="Sikh">Sikh</option>
                        <option value="Christian">Christian</option>
                      </select>
                      <select
                        value={filters.diet}
                        onChange={(e) => setFilters({ ...filters, diet: e.target.value })}
                        className="px-2 py-1 bg-white border border-amber-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 text-sm"
                      >
                        <option value="">Diet</option>
                        <option value="Vegetarian">Vegetarian</option>
                        <option value="Non-Vegetarian">Non-Veg</option>
                      </select>
                    </div>
                  </div>

                  {/* Gold Profiles Grid */}
                  <div className="bg-white rounded-lg shadow-sm border border-amber-200 p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-md font-bold text-gray-900">Featured Gold Profiles</h3>
                      <button 
                        onClick={() => setActiveTab("matches")}
                        className="text-amber-600 hover:text-amber-700 font-medium text-sm"
                      >
                        View All →
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredProfiles.slice(0, 6).map((profile) => (
                        <div
                          key={profile.id}
                          className="group relative bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-amber-200 hover:border-amber-300 cursor-pointer"
                          onClick={() => setActiveTab("matches")}
                        >
                          {/* Gold Badge */}
                          <div className="absolute top-2 right-2 z-20">
                            <div className="w-6 h-6 bg-gradient-to-r from-amber-500 to-amber-700 rounded-full flex items-center justify-center shadow-sm">
                              <span className="text-white text-xs">🥇</span>
                            </div>
                          </div>

                          {/* Profile Image */}
                          <div className="relative h-32 overflow-hidden rounded-t-xl">
                            <img
                              src={profile.image}
                              alt={profile.name}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                            <div className="absolute bottom-2 left-2 right-2 text-white">
                              <h3 className="text-sm font-bold truncate">{profile.name}</h3>
                              <p className="text-amber-200 text-xs">{profile.age} | {profile.location.split(',')[0]}</p>
                            </div>
                          </div>

                          {/* Profile Content */}
                          <div className="p-3">
                            <div className="mb-2">
                              <p className="text-amber-700 font-bold text-sm mb-1">{profile.profession}</p>
                              <p className="text-gray-600 text-xs line-clamp-2 mb-2">{profile.description}</p>
                            </div>

                            <div className="flex gap-2">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveTab("messages");
                                }}
                                className="flex-1 bg-amber-600 text-white py-2 rounded-lg hover:bg-amber-700 transition-colors text-xs"
                              >
                                Message
                              </button>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  checkCompatibility(profile.id);
                                }}
                                className="flex-1 bg-amber-500 text-white py-2 rounded-lg hover:bg-amber-600 transition-colors text-xs"
                              >
                                Compatibility
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Features */}
                  <div className="bg-white rounded-lg shadow-sm border border-amber-200 p-4">
                    <h3 className="text-md font-bold text-gray-900 mb-3">Your Gold Features</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {user.subscription.features.map((feature, index) => (
                        <div key={index} className="flex items-center p-2 bg-amber-50 rounded-lg border border-amber-200">
                          <span className="text-green-500 mr-2">✓</span>
                          <span className="text-gray-700 text-sm font-medium">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Astrology Preview */}
                  <div className="bg-white rounded-lg shadow-sm border border-amber-200 p-4">
                    <h3 className="text-md font-bold text-gray-900 mb-3">Astrology Insights</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Your Horoscope: {astrologyData.horoscope}</h4>
                        <p className="text-gray-600 text-sm">Basic compatibility reports available</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Best Matches</h4>
                        <div className="space-y-2">
                          {astrologyData.compatibility?.slice(0, 2).map((match, index) => (
                            <div key={index} className="flex justify-between text-sm">
                              <span>{match.sign}</span>
                              <span className="text-amber-600 font-semibold">{match.score}%</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => setActiveTab("astrology")}
                      className="w-full mt-4 bg-amber-600 text-white py-2 rounded-lg hover:bg-amber-700 transition-colors"
                    >
                      View Full Astrology Report
                    </button>
                  </div>
                </div>
              )}

              {/* Matches Tab */}
              {activeTab === "matches" && (
                <div className="space-y-6">
                  <div className="bg-white rounded-lg shadow-sm border border-amber-200 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Gold Exclusive Profiles</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredProfiles.map((profile) => (
                        <div
                          key={profile.id}
                          className="group relative bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-amber-200 hover:border-amber-300 cursor-pointer"
                        >
                          {/* Gold Badge */}
                          <div className="absolute top-2 right-2 z-20">
                            <div className="w-6 h-6 bg-gradient-to-r from-amber-500 to-amber-700 rounded-full flex items-center justify-center shadow-sm">
                              <span className="text-white text-xs">🥇</span>
                            </div>
                          </div>

                          {/* Profile Image */}
                          <div className="relative h-48 overflow-hidden rounded-t-xl">
                            <img
                              src={profile.image}
                              alt={profile.name}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                            <div className="absolute bottom-3 left-3 right-3 text-white">
                              <h3 className="text-lg font-bold mb-1">{profile.name}</h3>
                              <p className="text-amber-200 font-semibold">{profile.age} | {profile.location}</p>
                            </div>
                          </div>

                          {/* Profile Content */}
                          <div className="p-4">
                            <div className="mb-3">
                              <p className="text-amber-700 font-bold text-md mb-2">{profile.profession}</p>
                              <p className="text-gray-600 text-sm mb-3">{profile.description}</p>
                            </div>

                            {/* Quick Info */}
                            <div className="space-y-2 mb-3 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-500">Education:</span>
                                <span className="text-gray-800 font-medium text-right">
                                  {profile.education}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-500">Salary:</span>
                                <span className="text-green-600 font-bold">${(profile.salary/1000).toFixed(0)}K/year</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-500">Horoscope:</span>
                                <span className="text-blue-600 font-semibold">{profile.horoscope}</span>
                              </div>
                            </div>

                            <div className="flex gap-2">
                              <button 
                                onClick={() => setActiveTab("messages")}
                                className="flex-1 bg-amber-600 text-white py-2 rounded-lg hover:bg-amber-700 transition-colors text-sm"
                              >
                                Message
                              </button>
                              <button 
                                onClick={() => checkCompatibility(profile.id)}
                                className="flex-1 bg-amber-500 text-white py-2 rounded-lg hover:bg-amber-600 transition-colors text-sm"
                              >
                                Compatibility
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Astrology Tab */}
              {activeTab === "astrology" && (
                <div className="bg-white rounded-lg shadow-sm border border-amber-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-6">Basic Astrology Reports</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                      <h4 className="font-semibold text-gray-900 mb-2">Your Horoscope: {astrologyData.horoscope}</h4>
                      <p className="text-gray-600 text-sm mb-4">Basic horoscope matching and compatibility analysis</p>
                      <button 
                        onClick={() => alert("Basic astrology report generated!")}
                        className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors"
                      >
                        Generate Report
                      </button>
                    </div>
                    
                    <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                      <h4 className="font-semibold text-gray-900 mb-2">Horoscope Matching</h4>
                      <p className="text-gray-600 text-sm mb-4">Check basic compatibility with potential matches</p>
                      <button 
                        onClick={() => alert("Compatibility analysis started!")}
                        className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors"
                      >
                        Check Compatibility
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4">Best Matches by Horoscope</h4>
                      <div className="space-y-3">
                        {astrologyData.compatibility?.map((match, index) => (
                          <div key={index} className="p-3 bg-white border border-amber-200 rounded-lg">
                            <div className="flex justify-between items-center">
                              <span className="font-medium">{match.sign}</span>
                              <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-sm">
                                {match.score}% Match
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4">Basic Auspicious Dates</h4>
                      <div className="space-y-3">
                        {astrologyData.auspiciousDates?.map((date, index) => (
                          <div key={index} className="p-3 bg-white border border-amber-200 rounded-lg">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="font-medium">{date.date}</p>
                                <p className="text-sm text-gray-600">{date.occasion}</p>
                              </div>
                              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                                {date.significance}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 p-4 bg-amber-50 rounded-lg border border-amber-200">
                    <p className="text-sm text-gray-600 text-center mb-3">
                      Upgrade to Diamond plan for detailed astrological analysis and auspicious date discovery
                    </p>
                    <button 
                      onClick={upgradePlan}
                      className="w-full bg-amber-600 text-white py-2 rounded-lg hover:bg-amber-700 transition-colors"
                    >
                      Upgrade to Diamond
                    </button>
                  </div>
                </div>
              )}

              {/* Messages Tab */}
              {activeTab === "messages" && (
                <div className="bg-white rounded-lg shadow-sm border border-amber-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-6">Messages</h3>

                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div key={message.id} className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-white">
                            {message.name.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <h4 className="font-semibold text-gray-900">{message.name}</h4>
                              {message.unread && (
                                <span className="bg-amber-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                  1
                                </span>
                              )}
                            </div>
                            <p className="text-gray-600 text-sm">{message.message}</p>
                            <p className="text-gray-400 text-xs">{message.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 p-4 bg-white border border-amber-200 rounded-lg">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        placeholder="Type your message..."
                        className="flex-1 px-3 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                      <button className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors">
                        Send
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Profile Tab - Similar to Silver but with Gold styling */}
              {activeTab === "profile" && (
                <div className="bg-white rounded-lg shadow-sm border border-amber-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-6">My Profile</h3>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Profile Summary */}
                    <div className="lg:col-span-1">
                      <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                        <div className="text-center mb-4">
                          <div className="w-20 h-20 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-3 text-white text-2xl">
                            {user.name.charAt(0)}
                          </div>
                          <h4 className="font-semibold text-gray-900">{user.name}</h4>
                          <p className="text-amber-600 text-sm">{user.profile.profession}</p>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Profile Complete:</span>
                            <span className="text-amber-700 font-semibold">{user.profile.completed}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Member Since:</span>
                            <span className="text-gray-900">2024</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Verified:</span>
                            <span className="text-green-600">✓</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Edit Profile Form */}
                    <div className="lg:col-span-2">
                      <div className="space-y-6">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-4">Personal Information</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                              <input
                                type="text"
                                value={profileData.name || user.name}
                                onChange={(e) => handleProfileUpdate('name', e.target.value)}
                                className="w-full px-3 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                              <input
                                type="email"
                                value={profileData.email || user.email}
                                onChange={(e) => handleProfileUpdate('email', e.target.value)}
                                className="w-full px-3 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                              <input
                                type="tel"
                                value={profileData.phone || user.phone}
                                onChange={(e) => handleProfileUpdate('phone', e.target.value)}
                                className="w-full px-3 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                              <input
                                type="text"
                                value={profileData.location || user.location}
                                onChange={(e) => handleProfileUpdate('location', e.target.value)}
                                className="w-full px-3 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                              />
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold text-gray-900 mb-4">Profile Details</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Profession</label>
                              <input
                                type="text"
                                value={profileData.profession}
                                onChange={(e) => handleProfileUpdate('profession', e.target.value)}
                                className="w-full px-3 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Education</label>
                              <input
                                type="text"
                                value={profileData.education}
                                onChange={(e) => handleProfileUpdate('education', e.target.value)}
                                className="w-full px-3 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Religion</label>
                              <select
                                value={profileData.religion}
                                onChange={(e) => handleProfileUpdate('religion', e.target.value)}
                                className="w-full px-3 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                              >
                                <option value="Hindu">Hindu</option>
                                <option value="Sikh">Sikh</option>
                                <option value="Christian">Christian</option>
                                <option value="Muslim">Muslim</option>
                                <option value="Other">Other</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Mother Tongue</label>
                              <input
                                type="text"
                                value={profileData.motherTongue}
                                onChange={(e) => handleProfileUpdate('motherTongue', e.target.value)}
                                className="w-full px-3 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                            <textarea
                              value={profileData.bio}
                              rows="4"
                              onChange={(e) => handleProfileUpdate('bio', e.target.value)}
                              className="w-full px-3 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                              placeholder="Tell us about yourself..."
                            />
                          </div>
                        </div>

                        <div className="flex justify-end space-x-3">
                          <button
                            onClick={() => {
                              setProfileData(user.profile);
                              alert("Changes discarded");
                            }}
                            className="px-4 py-2 border border-amber-300 text-amber-700 rounded-lg hover:bg-amber-50 transition-colors"
                          >
                            Discard Changes
                          </button>
                          <button
                            onClick={saveProfileChanges}
                            className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                          >
                            Save Changes
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Settings Tab - Similar to Silver but with Gold styling */}
              {activeTab === "settings" && (
                <div className="bg-white rounded-lg shadow-sm border border-amber-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-6">Settings</h3>
                  
                  <div className="space-y-8">
                    {/* Notification Preferences */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4">Notification Preferences</h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-200">
                          <div>
                            <p className="font-medium text-gray-900">Email Notifications</p>
                            <p className="text-sm text-gray-600">Receive updates via email</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings.emailNotifications}
                              onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                          </label>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-200">
                          <div>
                            <p className="font-medium text-gray-900">SMS Notifications</p>
                            <p className="text-sm text-gray-600">Receive important alerts via SMS</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings.smsNotifications}
                              onChange={(e) => handleSettingChange('smsNotifications', e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-200">
                          <div>
                            <p className="font-medium text-gray-900">Match Suggestions</p>
                            <p className="text-sm text-gray-600">Receive match recommendations</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings.matchSuggestions}
                              onChange={(e) => handleSettingChange('matchSuggestions', e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-200">
                          <div>
                            <p className="font-medium text-gray-900">Astrology Reports</p>
                            <p className="text-sm text-gray-600">Receive horoscope matching reports</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings.astrologyReports}
                              onChange={(e) => handleSettingChange('astrologyReports', e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Privacy Settings */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4">Privacy Settings</h4>
                      <div className="space-y-4">
                        <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Profile Visibility</label>
                          <select
                            value={settings.profileVisibility}
                            onChange={(e) => handleSettingChange('profileVisibility', e.target.value)}
                            className="w-full px-3 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                          >
                            <option value="all">Visible to All Members</option>
                            <option value="matches">Visible to Matches Only</option>
                            <option value="none">Private</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Account Actions */}
                    <div className="border-t pt-6">
                      <h4 className="font-semibold text-gray-900 mb-4">Account Actions</h4>
                      <div className="space-y-3">
                        <button 
                          onClick={deleteAccount}
                          className="w-full text-left p-3 bg-red-50 text-red-700 rounded-lg border border-red-200 hover:bg-red-100 transition-colors"
                        >
                          Delete Account
                        </button>
                        <button 
                          onClick={handleLogout}
                          className="w-full text-left p-3 bg-amber-50 text-amber-700 rounded-lg border border-amber-200 hover:bg-amber-100 transition-colors"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoldDashboard;