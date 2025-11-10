import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SilverDashboard = () => {
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
  const navigate = useNavigate();

  // Initialize all data
  useEffect(() => {
    // Mock user data
    const userData = {
      id: 1,
      name: "Aarav Sharma",
      email: "aarav.sharma@example.com",
      phone: "+1 (555) 123-4567",
      location: "Chicago, USA",
      dob: "1990-08-20",
      gender: "Male",
      subscription: {
        plan: "Silver",
        status: "active",
        expires: "2024-12-31",
        price: "$0/mo",
        features: [
          "Basic Match Making",
          "Self-Service Platform",
          "Profile Management",
          "Basic Search Filters",
          "Limited Messages"
        ]
      },
      profile: {
        completed: 85,
        verified: true,
        photos: 5,
        matches: 12,
        messages: 23,
        bio: "Software developer exploring life and looking for meaningful connections.",
        education: "Bachelor's in Computer Science",
        profession: "Software Developer",
        income: "$80,000",
        religion: "Hindu",
        caste: "Brahmin",
        motherTongue: "Hindi",
        height: "5'9\"",
        maritalStatus: "Never Married"
      }
    };
    setUser(userData);
    setProfileData(userData.profile);

    // Silver profiles data - Basic profiles
    const silverProfiles = [
      {
        id: 1,
        name: "Priya Patel",
        age: 28,
        location: "Chicago, IL USA",
        profession: "Teacher",
        description: "Elementary school teacher passionate about education and family values.",
        image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?q=80&w=2070",
        interests: ["Teaching", "Reading", "Yoga", "Cooking"],
        gender: "female",
        salary: 55000,
        religion: "Hindu",
        diet: "Vegetarian",
        language: "Gujarati, English",
        education: "Bachelor of Education",
        family: "Middle Class Family",
        height: "5'4\"",
        lastActive: "1 hour ago"
      },
      {
        id: 2,
        name: "Rahul Kumar",
        age: 30,
        location: "Detroit, MI USA",
        profession: "Accountant",
        description: "CPA professional looking for a serious relationship with traditional values.",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070",
        interests: ["Finance", "Cricket", "Movies", "Travel"],
        gender: "male",
        salary: 65000,
        religion: "Hindu",
        diet: "Vegetarian",
        language: "Hindi, English",
        education: "Bachelor of Commerce",
        family: "Business Family",
        height: "5'10\"",
        lastActive: "3 hours ago"
      },
      {
        id: 3,
        name: "Neha Singh",
        age: 26,
        location: "Columbus, OH USA",
        profession: "Marketing Executive",
        description: "Creative professional who enjoys art, music, and exploring new cultures.",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070",
        interests: ["Marketing", "Painting", "Music", "Dance"],
        gender: "female",
        salary: 60000,
        religion: "Hindu",
        diet: "Vegetarian",
        language: "Hindi, English",
        education: "MBA Marketing",
        family: "Service Family",
        height: "5'5\"",
        lastActive: "5 hours ago"
      },
      {
        id: 4,
        name: "Amit Joshi",
        age: 32,
        location: "Indianapolis, IN USA",
        profession: "IT Support",
        description: "Tech enthusiast who values family traditions and cultural heritage.",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2070",
        interests: ["Technology", "Photography", "Cooking", "Sports"],
        gender: "male",
        salary: 70000,
        religion: "Hindu",
        diet: "Non-Vegetarian",
        language: "Marathi, English",
        education: "Bachelor of Computer Science",
        family: "Middle Class",
        height: "5'11\"",
        lastActive: "2 days ago"
      }
    ];
    setMatches(silverProfiles);

    // Mock messages data
    const initialMessages = [
      {
        id: 1,
        matchId: 1,
        name: "Priya Patel",
        message: "Hi! I saw your profile and would love to connect.",
        time: "2:30 PM",
        unread: true,
        avatar: "👩‍🏫",
        type: "received"
      },
      {
        id: 2,
        matchId: 1,
        name: "You",
        message: "Hello Priya! Thanks for reaching out.",
        time: "2:35 PM",
        unread: false,
        avatar: "👤",
        type: "sent"
      }
    ];
    setMessages(initialMessages);

    // Mock settings
    setSettings({
      emailNotifications: true,
      profileVisibility: "all",
      matchSuggestions: true
    });
  }, []);

  // Filter profiles based on search and filters
  const filteredProfiles = matches.filter((profile) => {
    const matchesSearch = profile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         profile.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAge = profile.age >= filters.ageMin && profile.age <= filters.ageMax;
    const matchesLocation = !filters.location || profile.location.toLowerCase().includes(filters.location.toLowerCase());
    const matchesReligion = !filters.religion || profile.religion === filters.religion;
    
    return matchesSearch && matchesAge && matchesLocation && matchesReligion;
  });

  // Handler functions
  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("authToken");
      navigate("/login");
    }
  };

  const upgradePlan = () => {
    navigate("/gold");
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-gray-800 shadow-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-gray-600 to-gray-800 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">S</span>
              </div>
              <h1 className="ml-3 text-xl font-bold text-white">Silver Dashboard</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-white">{user.name}</p>
                <p className="text-sm text-gray-300 font-semibold">{user.subscription.plan} Member</p>
              </div>
              <button
                onClick={handleLogout}
                className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-gradient-to-r from-gray-500 to-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl text-white">⚪</span>
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
                    { id: "matches", name: "Basic Matches", icon: "👥", count: matches.length },
                    { id: "messages", name: "Messages", icon: "💬", count: messages.filter(m => m.unread).length },
                    { id: "profile", name: "My Profile", icon: "👤" },
                    { id: "settings", name: "Settings", icon: "⚙️" }
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        activeTab === item.id
                          ? "bg-gray-100 text-gray-900"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center">
                        <span className="mr-3">{item.icon}</span>
                        {item.name}
                      </div>
                      {item.count > 0 && (
                        <span className="bg-gray-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
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
                  Upgrade to Gold
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
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <span className="text-xl">👥</span>
                        </div>
                        <div className="ml-3">
                          <p className="text-xs font-medium text-gray-600">Basic Matches</p>
                          <p className="text-lg font-bold text-gray-900">{user.profile.matches}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
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

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
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

                  {/* Search Section */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <h3 className="text-md font-bold text-gray-900 mb-3">Find Your Match</h3>
                    
                    <div className="flex flex-col md:flex-row gap-3 mb-4">
                      <div className="flex-1">
                        <input
                          type="text"
                          placeholder="Search members by name or description..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                        />
                      </div>
                      <button className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors font-semibold text-sm">
                        Search
                      </button>
                    </div>

                    {/* Basic Filters */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                      <select
                        value={filters.ageMin}
                        onChange={(e) => setFilters({ ...filters, ageMin: parseInt(e.target.value) })}
                        className="px-2 py-1 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-500 text-sm"
                      >
                        <option value={25}>Min: 25</option>
                        <option value={28}>Min: 28</option>
                        <option value={30}>Min: 30</option>
                      </select>
                      <select
                        value={filters.ageMax}
                        onChange={(e) => setFilters({ ...filters, ageMax: parseInt(e.target.value) })}
                        className="px-2 py-1 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-500 text-sm"
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
                        className="px-2 py-1 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-500 text-sm"
                      />
                      <select
                        value={filters.religion}
                        onChange={(e) => setFilters({ ...filters, religion: e.target.value })}
                        className="px-2 py-1 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-500 text-sm"
                      >
                        <option value="">Religion</option>
                        <option value="Hindu">Hindu</option>
                        <option value="Sikh">Sikh</option>
                        <option value="Christian">Christian</option>
                      </select>
                    </div>
                  </div>

                  {/* Basic Profiles Grid */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-md font-bold text-gray-900">Available Profiles</h3>
                      <button 
                        onClick={() => setActiveTab("matches")}
                        className="text-gray-700 hover:text-gray-900 font-medium text-sm"
                      >
                        View All →
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredProfiles.slice(0, 6).map((profile) => (
                        <div
                          key={profile.id}
                          className="group relative bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-gray-300 cursor-pointer"
                          onClick={() => setActiveTab("matches")}
                        >
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
                              <p className="text-gray-200 text-xs">{profile.age} | {profile.location.split(',')[0]}</p>
                            </div>
                          </div>

                          {/* Profile Content */}
                          <div className="p-3">
                            <div className="mb-2">
                              <p className="text-gray-700 font-bold text-sm mb-1">{profile.profession}</p>
                              <p className="text-gray-600 text-xs line-clamp-2 mb-2">{profile.description}</p>
                            </div>

                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveTab("messages");
                              }}
                              className="w-full py-2 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors text-xs"
                            >
                              Send Message
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {filteredProfiles.length === 0 && (
                      <div className="text-center py-6">
                        <p className="text-gray-500 text-sm">No profiles found. Try adjusting your search criteria.</p>
                      </div>
                    )}
                  </div>

                  {/* Features */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <h3 className="text-md font-bold text-gray-900 mb-3">Silver Plan Features</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {user.subscription.features.map((feature, index) => (
                        <div key={index} className="flex items-center p-2 bg-gray-50 rounded-lg border border-gray-200">
                          <span className="text-green-500 mr-2">✓</span>
                          <span className="text-gray-700 text-sm font-medium">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Upgrade Banner */}
                  <div className="bg-gradient-to-r from-amber-600 to-amber-800 rounded-lg shadow-sm p-4 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-bold mb-1">Upgrade to Gold! ✨</h3>
                        <p className="opacity-90 text-sm">Get enhanced matching and premium features</p>
                      </div>
                      <button 
                        onClick={upgradePlan}
                        className="bg-white text-amber-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                      >
                        Upgrade Now
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Matches Tab */}
              {activeTab === "matches" && (
                <div className="space-y-6">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Basic Matches</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredProfiles.map((profile) => (
                        <div
                          key={profile.id}
                          className="group relative bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-gray-300 cursor-pointer"
                        >
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
                              <p className="text-gray-200 font-semibold">{profile.age} | {profile.location}</p>
                            </div>
                          </div>

                          {/* Profile Content */}
                          <div className="p-4">
                            <div className="mb-3">
                              <p className="text-gray-700 font-bold text-md mb-2">{profile.profession}</p>
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
                            </div>

                            <button 
                              onClick={() => setActiveTab("messages")}
                              className="w-full bg-gray-700 text-white py-2 rounded-lg hover:bg-gray-800 transition-colors text-sm"
                            >
                              Send Message
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Messages Tab */}
              {activeTab === "messages" && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-6">Messages</h3>

                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div key={message.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full flex items-center justify-center text-white">
                            {message.name.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <h4 className="font-semibold text-gray-900">{message.name}</h4>
                              {message.unread && (
                                <span className="bg-gray-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
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

                  <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-600 text-center">
                      Upgrade to Gold plan for unlimited messaging and advanced chat features
                    </p>
                    <button 
                      onClick={upgradePlan}
                      className="w-full mt-3 bg-amber-600 text-white py-2 rounded-lg hover:bg-amber-700 transition-colors"
                    >
                      Upgrade to Gold
                    </button>
                  </div>
                </div>
              )}

              {/* Profile Tab */}
              {activeTab === "profile" && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-6">My Profile</h3>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Profile Summary */}
                    <div className="lg:col-span-1">
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="text-center mb-4">
                          <div className="w-20 h-20 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full flex items-center justify-center mx-auto mb-3 text-white text-2xl">
                            {user.name.charAt(0)}
                          </div>
                          <h4 className="font-semibold text-gray-900">{user.name}</h4>
                          <p className="text-gray-600 text-sm">{user.profile.profession}</p>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Profile Complete:</span>
                            <span className="text-gray-700 font-semibold">{user.profile.completed}%</span>
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
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                              <input
                                type="email"
                                value={profileData.email || user.email}
                                onChange={(e) => handleProfileUpdate('email', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                              <input
                                type="tel"
                                value={profileData.phone || user.phone}
                                onChange={(e) => handleProfileUpdate('phone', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                              <input
                                type="text"
                                value={profileData.location || user.location}
                                onChange={(e) => handleProfileUpdate('location', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
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
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Education</label>
                              <input
                                type="text"
                                value={profileData.education}
                                onChange={(e) => handleProfileUpdate('education', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Religion</label>
                              <select
                                value={profileData.religion}
                                onChange={(e) => handleProfileUpdate('religion', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
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
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                            <textarea
                              value={profileData.bio}
                              rows="4"
                              onChange={(e) => handleProfileUpdate('bio', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
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
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            Discard Changes
                          </button>
                          <button
                            onClick={saveProfileChanges}
                            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors"
                          >
                            Save Changes
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === "settings" && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-6">Settings</h3>
                  
                  <div className="space-y-8">
                    {/* Notification Preferences */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4">Notification Preferences</h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
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
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-600"></div>
                          </label>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
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
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-600"></div>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Privacy Settings */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4">Privacy Settings</h4>
                      <div className="space-y-4">
                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Profile Visibility</label>
                          <select
                            value={settings.profileVisibility}
                            onChange={(e) => handleSettingChange('profileVisibility', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 bg-white"
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
                          className="w-full text-left p-3 bg-gray-50 text-gray-700 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
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

export default SilverDashboard;