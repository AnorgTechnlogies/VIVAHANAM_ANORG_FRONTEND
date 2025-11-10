import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PayAsYouGoDashboard = () => {
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
  const [credits, setCredits] = useState(10);
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [availableFeatures, setAvailableFeatures] = useState([]);
  const navigate = useNavigate();

  // Initialize all data
  useEffect(() => {
    // Mock user data
    const userData = {
      id: 1,
      name: "Aarav Patel",
      email: "aarav.patel@example.com",
      phone: "+1 (555) 123-4567",
      location: "Chicago, USA",
      dob: "1992-07-15",
      gender: "Male",
      subscription: {
        plan: "Pay As You Go",
        status: "active",
        price: "$0 base + feature costs",
        credits: 10,
        features: [
          "Basic Profile (Free)",
          "Pay Per Message",
          "Pay Per Match View",
          "Pay For Astrology Reports",
          "Pay For Consultation",
          "Credit-Based System",
          "No Monthly Commitment"
        ]
      },
      profile: {
        completed: 80,
        verified: true,
        photos: 4,
        matches: 8,
        messages: 15,
        creditsUsed: 5,
        bio: "Software engineer exploring flexible dating options. Prefer paying only for what I use.",
        education: "Bachelor's in Computer Science",
        profession: "Software Developer",
        income: "$85,000",
        religion: "Hindu",
        caste: "Patel",
        motherTongue: "Gujarati",
        height: "5'10\"",
        maritalStatus: "Never Married"
      }
    };
    setUser(userData);
    setProfileData(userData.profile);
    setCredits(userData.subscription.credits);

    // Pay As You Go profiles data - Mix of free and premium
    const paygProfiles = [
      {
        id: 1,
        name: "Priya Sharma",
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
        language: "Hindi, English",
        education: "Bachelor of Education",
        family: "Middle Class Family",
        height: "5'4\"",
        lastActive: "1 hour ago",
        creditsRequired: 2,
        preview: true
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
        lastActive: "3 hours ago",
        creditsRequired: 2,
        preview: true
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
        lastActive: "5 hours ago",
        creditsRequired: 2,
        preview: true
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
        lastActive: "2 days ago",
        creditsRequired: 2,
        preview: true
      }
    ];
    setMatches(paygProfiles);

    // Mock messages data
    const initialMessages = [
      {
        id: 1,
        matchId: 1,
        name: "Priya Sharma",
        message: "Hi! I saw your profile and would love to connect.",
        time: "2:30 PM",
        unread: true,
        avatar: "👩‍🏫",
        type: "received",
        creditsUsed: 1
      },
      {
        id: 2,
        matchId: 1,
        name: "You",
        message: "Hello Priya! Thanks for reaching out.",
        time: "2:35 PM",
        unread: false,
        avatar: "👤",
        type: "sent",
        creditsUsed: 1
      }
    ];
    setMessages(initialMessages);

    // Mock purchase history
    setPurchaseHistory([
      {
        id: 1,
        date: "2024-02-15",
        item: "10 Credits Pack",
        amount: "$9.99",
        credits: 10,
        status: "completed"
      },
      {
        id: 2,
        date: "2024-02-10",
        item: "Astrology Report",
        amount: "$4.99",
        credits: 5,
        status: "completed"
      },
      {
        id: 3,
        date: "2024-02-05",
        item: "5 Messages",
        amount: "$2.99",
        credits: 3,
        status: "completed"
      }
    ]);

    // Available features with pricing
    setAvailableFeatures([
      {
        id: 1,
        name: "View Full Profile",
        description: "Unlock complete profile details and photos",
        credits: 2,
        icon: "👁️"
      },
      {
        id: 2,
        name: "Send Message",
        description: "Send a message to any member",
        credits: 1,
        icon: "💬"
      },
      {
        id: 3,
        name: "Read Message",
        description: "Read messages from other members",
        credits: 1,
        icon: "📨"
      },
      {
        id: 4,
        name: "Basic Astrology Report",
        description: "Get basic horoscope compatibility",
        credits: 5,
        icon: "🔮"
      },
      {
        id: 5,
        name: "Advanced Search Filters",
        description: "Access advanced search for 7 days",
        credits: 3,
        icon: "🔍"
      },
      {
        id: 6,
        name: "Profile Highlight",
        description: "Highlight your profile for 3 days",
        credits: 4,
        icon: "⭐"
      }
    ]);

    // Mock settings
    setSettings({
      emailNotifications: true,
      profileVisibility: "all",
      lowCreditAlerts: true,
      autoPurchase: false
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

  const purchaseCredits = (packageType) => {
    const packages = {
      basic: { credits: 10, price: "$9.99" },
      standard: { credits: 25, price: "$19.99" },
      premium: { credits: 50, price: "$34.99" },
      ultimate: { credits: 100, price: "$59.99" }
    };

    const selectedPackage = packages[packageType];
    if (selectedPackage) {
      if (window.confirm(`Purchase ${selectedPackage.credits} credits for ${selectedPackage.price}?`)) {
        setCredits(prev => prev + selectedPackage.credits);
        setPurchaseHistory(prev => [...prev, {
          id: prev.length + 1,
          date: new Date().toISOString().split('T')[0],
          item: `${selectedPackage.credits} Credits Pack`,
          amount: selectedPackage.price,
          credits: selectedPackage.credits,
          status: 'completed'
        }]);
        alert(`Successfully purchased ${selectedPackage.credits} credits!`);
      }
    }
  };

  const useFeature = (featureId, featureName, creditCost) => {
    if (credits < creditCost) {
      alert(`Not enough credits! You need ${creditCost} credits but only have ${credits}.`);
      return false;
    }

    if (window.confirm(`Use ${creditCost} credit(s) for ${featureName}?`)) {
      setCredits(prev => prev - creditCost);
      alert(`Feature activated! ${creditCost} credit(s) deducted.`);
      return true;
    }
    return false;
  };

  const viewFullProfile = (profileId) => {
    const profile = matches.find(p => p.id === profileId);
    if (profile && useFeature(profileId, `View ${profile.name}'s full profile`, profile.creditsRequired)) {
      alert(`Full profile of ${profile.name} unlocked!`);
      // Here you would typically fetch and display the full profile
    }
  };

  const sendMessage = (matchId, message) => {
    if (!message.trim()) return;
    
    if (useFeature(matchId, "Send Message", 1)) {
      const newMsg = {
        id: messages.length + 1,
        matchId,
        name: "You",
        message: message,
        time: "Just now",
        unread: false,
        avatar: "👤",
        type: "sent",
        creditsUsed: 1
      };
      
      setMessages(prev => [...prev, newMsg]);
      alert(`Message sent! 1 credit deducted.`);
    }
  };

  const readMessage = (messageId) => {
    const message = messages.find(m => m.id === messageId);
    if (message && message.type === 'received' && message.unread) {
      if (useFeature(messageId, "Read Message", 1)) {
        // Mark message as read
        setMessages(prev => prev.map(msg => 
          msg.id === messageId ? { ...msg, unread: false } : msg
        ));
      }
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Header */}
      <header className="bg-blue-800 shadow-sm border-b border-blue-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-800 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">P</span>
              </div>
              <h1 className="ml-3 text-xl font-bold text-white">Pay As You Go Dashboard</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Credits Display */}
              <div className="bg-blue-700 px-3 py-1 rounded-full">
                <span className="text-white text-sm font-semibold">
                  💰 {credits} Credits
                </span>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-white">{user.name}</p>
                <p className="text-sm text-blue-200 font-semibold">{user.subscription.plan}</p>
              </div>
              <button
                onClick={handleLogout}
                className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg transition-colors"
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
              <div className="bg-white rounded-lg shadow-sm border border-blue-200 p-6">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl text-white">💰</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">{user.subscription.plan}</h3>
                  <p className="text-gray-600">{user.subscription.price}</p>
                  <div className="mt-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                  </div>
                </div>

                {/* Credits Balance */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Your Balance</p>
                    <p className="text-2xl font-bold text-blue-700">{credits} Credits</p>
                    <button 
                      onClick={() => setActiveTab("credits")}
                      className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      Buy More Credits
                    </button>
                  </div>
                </div>

                <nav className="space-y-2">
                  {[
                    { id: "overview", name: "Overview", icon: "📊" },
                    { id: "matches", name: "Browse Matches", icon: "👥", count: matches.length },
                    { id: "messages", name: "Messages", icon: "💬", count: messages.filter(m => m.unread).length },
                    { id: "features", name: "Buy Features", icon: "🛒" },
                    { id: "credits", name: "Credit Store", icon: "💰" },
                    { id: "history", name: "Purchase History", icon: "📋" },
                    { id: "profile", name: "My Profile", icon: "👤" },
                    { id: "settings", name: "Settings", icon: "⚙️" }
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        activeTab === item.id
                          ? "bg-blue-100 text-blue-900"
                          : "text-gray-600 hover:bg-blue-50"
                      }`}
                    >
                      <div className="flex items-center">
                        <span className="mr-3">{item.icon}</span>
                        {item.name}
                      </div>
                      {item.count > 0 && (
                        <span className="bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
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
                  Upgrade to Gold Plan
                </button>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Overview Tab */}
              {activeTab === "overview" && (
                <div className="space-y-6">
                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-lg shadow-sm border border-blue-200 p-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <span className="text-xl">💰</span>
                        </div>
                        <div className="ml-3">
                          <p className="text-xs font-medium text-gray-600">Available Credits</p>
                          <p className="text-lg font-bold text-gray-900">{credits}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-blue-200 p-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <span className="text-xl">👥</span>
                        </div>
                        <div className="ml-3">
                          <p className="text-xs font-medium text-gray-600">Available Matches</p>
                          <p className="text-lg font-bold text-gray-900">{user.profile.matches}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-blue-200 p-4">
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

                    <div className="bg-white rounded-lg shadow-sm border border-blue-200 p-4">
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

                  {/* Quick Actions */}
                  <div className="bg-white rounded-lg shadow-sm border border-blue-200 p-4">
                    <h3 className="text-md font-bold text-gray-900 mb-3">Quick Actions</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <button 
                        onClick={() => setActiveTab("matches")}
                        className="p-3 bg-blue-50 rounded-lg text-center hover:bg-blue-100 transition-colors border border-blue-200"
                      >
                        <span className="text-lg block mb-1">👁️</span>
                        <span className="text-xs font-medium text-gray-700">Browse Matches</span>
                        <span className="text-xs text-blue-600">2 credits/profile</span>
                      </button>
                      <button 
                        onClick={() => setActiveTab("messages")}
                        className="p-3 bg-blue-50 rounded-lg text-center hover:bg-blue-100 transition-colors border border-blue-200"
                      >
                        <span className="text-lg block mb-1">💬</span>
                        <span className="text-xs font-medium text-gray-700">Send Messages</span>
                        <span className="text-xs text-blue-600">1 credit/message</span>
                      </button>
                      <button 
                        onClick={() => setActiveTab("features")}
                        className="p-3 bg-blue-50 rounded-lg text-center hover:bg-blue-100 transition-colors border border-blue-200"
                      >
                        <span className="text-lg block mb-1">🔮</span>
                        <span className="text-xs font-medium text-gray-700">Astrology Reports</span>
                        <span className="text-xs text-blue-600">5 credits/report</span>
                      </button>
                      <button 
                        onClick={() => setActiveTab("credits")}
                        className="p-3 bg-blue-50 rounded-lg text-center hover:bg-blue-100 transition-colors border border-blue-200"
                      >
                        <span className="text-lg block mb-1">💰</span>
                        <span className="text-xs font-medium text-gray-700">Buy Credits</span>
                        <span className="text-xs text-blue-600">Best value</span>
                      </button>
                    </div>
                  </div>

                  {/* Search Section */}
                  <div className="bg-white rounded-lg shadow-sm border border-blue-200 p-4">
                    <h3 className="text-md font-bold text-gray-900 mb-3">Find Your Match</h3>
                    
                    <div className="flex flex-col md:flex-row gap-3 mb-4">
                      <div className="flex-1">
                        <input
                          type="text"
                          placeholder="Search members by name or description..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-sm">
                        Search
                      </button>
                    </div>

                    {/* Basic Filters */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                      <select
                        value={filters.ageMin}
                        onChange={(e) => setFilters({ ...filters, ageMin: parseInt(e.target.value) })}
                        className="px-2 py-1 bg-white border border-blue-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                      >
                        <option value={25}>Min: 25</option>
                        <option value={28}>Min: 28</option>
                        <option value={30}>Min: 30</option>
                      </select>
                      <select
                        value={filters.ageMax}
                        onChange={(e) => setFilters({ ...filters, ageMax: parseInt(e.target.value) })}
                        className="px-2 py-1 bg-white border border-blue-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
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
                        className="px-2 py-1 bg-white border border-blue-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                      />
                      <select
                        value={filters.religion}
                        onChange={(e) => setFilters({ ...filters, religion: e.target.value })}
                        className="px-2 py-1 bg-white border border-blue-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                      >
                        <option value="">Religion</option>
                        <option value="Hindu">Hindu</option>
                        <option value="Sikh">Sikh</option>
                        <option value="Christian">Christian</option>
                      </select>
                    </div>
                  </div>

                  {/* Featured Profiles */}
                  <div className="bg-white rounded-lg shadow-sm border border-blue-200 p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-md font-bold text-gray-900">Featured Profiles</h3>
                      <button 
                        onClick={() => setActiveTab("matches")}
                        className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                      >
                        View All →
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredProfiles.slice(0, 6).map((profile) => (
                        <div
                          key={profile.id}
                          className="group relative bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-blue-200 hover:border-blue-300 cursor-pointer"
                        >
                          {/* Credit Cost Badge */}
                          <div className="absolute top-2 right-2 z-20">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-700 rounded-full flex items-center justify-center shadow-sm">
                              <span className="text-white text-xs">{profile.creditsRequired}💰</span>
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
                              <p className="text-blue-200 text-xs">{profile.age} | {profile.location.split(',')[0]}</p>
                            </div>
                          </div>

                          {/* Profile Content */}
                          <div className="p-3">
                            <div className="mb-2">
                              <p className="text-blue-700 font-bold text-sm mb-1">{profile.profession}</p>
                              <p className="text-gray-600 text-xs line-clamp-2 mb-2">{profile.description}</p>
                            </div>

                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                viewFullProfile(profile.id);
                              }}
                              className="w-full py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors text-xs"
                            >
                              View Full Profile ({profile.creditsRequired} credits)
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

                  {/* Plan Features */}
                  <div className="bg-white rounded-lg shadow-sm border border-blue-200 p-4">
                    <h3 className="text-md font-bold text-gray-900 mb-3">Pay As You Go Features</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {user.subscription.features.map((feature, index) => (
                        <div key={index} className="flex items-center p-2 bg-blue-50 rounded-lg border border-blue-200">
                          <span className="text-green-500 mr-2">✓</span>
                          <span className="text-gray-700 text-sm font-medium">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Credit Warning */}
                  {credits < 5 && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <span className="text-yellow-400 text-lg">⚠️</span>
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-yellow-800">Low Credit Balance</h3>
                          <p className="text-sm text-yellow-700 mt-1">
                            You have only {credits} credits left. Purchase more credits to continue using premium features.
                          </p>
                          <button 
                            onClick={() => setActiveTab("credits")}
                            className="mt-2 bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors text-sm"
                          >
                            Buy Credits Now
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Matches Tab */}
              {activeTab === "matches" && (
                <div className="space-y-6">
                  <div className="bg-white rounded-lg shadow-sm border border-blue-200 p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-bold text-gray-900">Browse Matches</h3>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">Balance: {credits} credits</span>
                        <button 
                          onClick={() => setActiveTab("credits")}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                        >
                          Buy Credits
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredProfiles.map((profile) => (
                        <div
                          key={profile.id}
                          className="group relative bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-blue-200 hover:border-blue-300 cursor-pointer"
                        >
                          {/* Credit Cost Badge */}
                          <div className="absolute top-3 right-3 z-20">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-700 rounded-full flex items-center justify-center shadow-sm">
                              <span className="text-white text-sm">{profile.creditsRequired}💰</span>
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
                              <p className="text-blue-200 font-semibold">{profile.age} | {profile.location}</p>
                            </div>
                          </div>

                          {/* Profile Content */}
                          <div className="p-4">
                            <div className="mb-3">
                              <p className="text-blue-700 font-bold text-md mb-2">{profile.profession}</p>
                              <p className="text-gray-600 text-sm mb-3">{profile.description}</p>
                            </div>

                            {/* Quick Info */}
                            <div className="space-y-2 mb-3 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-500">Education:</span>
                                <span className="text-gray-800 font-medium text-right">
                                  {profile.education.split(' - ')[0]}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-500">Salary:</span>
                                <span className="text-green-600 font-bold">${(profile.salary/1000).toFixed(0)}K/year</span>
                              </div>
                            </div>

                            <div className="flex gap-2">
                              <button 
                                onClick={() => viewFullProfile(profile.id)}
                                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                              >
                                View Profile ({profile.creditsRequired} credits)
                              </button>
                              <button 
                                onClick={() => {
                                  if (useFeature(profile.id, `Send message to ${profile.name}`, 1)) {
                                    setActiveTab("messages");
                                  }
                                }}
                                className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm"
                              >
                                Message (1 credit)
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Messages Tab */}
              {activeTab === "messages" && (
                <div className="bg-white rounded-lg shadow-sm border border-blue-200 p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-gray-900">Messages</h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">{credits} credits available</span>
                      <button 
                        onClick={() => setActiveTab("credits")}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        Buy Credits
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div 
                        key={message.id} 
                        className={`p-4 rounded-lg border cursor-pointer transition-all ${
                          message.unread ? 'bg-blue-50 border-blue-300' : 'bg-white border-blue-200'
                        }`}
                        onClick={() => message.unread && readMessage(message.id)}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white">
                            {message.name.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <h4 className="font-semibold text-gray-900">{message.name}</h4>
                              <div className="flex items-center space-x-2">
                                {message.unread && (
                                  <span className="bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                    1
                                  </span>
                                )}
                                <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                                  {message.creditsUsed} credit
                                </span>
                              </div>
                            </div>
                            <p className="text-gray-600 text-sm">{message.message}</p>
                            <p className="text-gray-400 text-xs">{message.time}</p>
                            {message.unread && (
                              <p className="text-blue-600 text-xs mt-1">
                                Click to read (1 credit required)
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-gray-600 text-center mb-3">
                      Each message costs 1 credit. You have {credits} credits remaining.
                    </p>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        placeholder="Type your message (1 credit required)..."
                        className="flex-1 px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={() => {
                          const message = "Hello! I'd like to connect with you.";
                          sendMessage(1, message);
                        }}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Send (1 credit)
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Buy Features Tab */}
              {activeTab === "features" && (
                <div className="bg-white rounded-lg shadow-sm border border-blue-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-6">Buy Individual Features</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                    {availableFeatures.map((feature) => (
                      <div key={feature.id} className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="text-center mb-3">
                          <span className="text-2xl mb-2 block">{feature.icon}</span>
                          <h4 className="font-semibold text-gray-900">{feature.name}</h4>
                          <p className="text-gray-600 text-sm mt-1">{feature.description}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-blue-700 font-bold text-lg mb-2">{feature.credits} credits</p>
                          <button 
                            onClick={() => useFeature(feature.id, feature.name, feature.credits)}
                            disabled={credits < feature.credits}
                            className={`w-full py-2 rounded-lg font-semibold text-sm transition-colors ${
                              credits >= feature.credits
                                ? 'bg-blue-600 text-white hover:bg-blue-700'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                          >
                            {credits >= feature.credits ? 'Purchase Now' : 'Insufficient Credits'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-6 text-white text-center">
                    <h4 className="font-bold text-lg mb-2">Need More Credits?</h4>
                    <p className="text-blue-100 text-sm mb-4">Get the best value with our credit packages</p>
                    <button 
                      onClick={() => setActiveTab("credits")}
                      className="bg-white text-blue-700 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                    >
                      View Credit Packages
                    </button>
                  </div>
                </div>
              )}

              {/* Credit Store Tab */}
              {activeTab === "credits" && (
                <div className="bg-white rounded-lg shadow-sm border border-blue-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-6">Credit Store</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="p-6 bg-blue-50 rounded-lg border-2 border-blue-300 text-center">
                      <h4 className="font-bold text-gray-900 text-lg">Basic Pack</h4>
                      <p className="text-3xl font-bold text-blue-700 my-4">10</p>
                      <p className="text-gray-600">credits</p>
                      <p className="text-xl font-bold text-gray-900 my-2">$9.99</p>
                      <p className="text-sm text-gray-600 mb-4">$1.00 per credit</p>
                      <button 
                        onClick={() => purchaseCredits('basic')}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                      >
                        Purchase
                      </button>
                    </div>

                    <div className="p-6 bg-green-50 rounded-lg border-2 border-green-300 text-center">
                      <h4 className="font-bold text-gray-900 text-lg">Standard Pack</h4>
                      <p className="text-3xl font-bold text-green-700 my-4">25</p>
                      <p className="text-gray-600">credits</p>
                      <p className="text-xl font-bold text-gray-900 my-2">$19.99</p>
                      <p className="text-sm text-gray-600 mb-4">$0.80 per credit</p>
                      <button 
                        onClick={() => purchaseCredits('standard')}
                        className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors font-semibold"
                      >
                        Purchase
                      </button>
                    </div>

                    <div className="p-6 bg-purple-50 rounded-lg border-2 border-purple-300 text-center">
                      <h4 className="font-bold text-gray-900 text-lg">Premium Pack</h4>
                      <p className="text-3xl font-bold text-purple-700 my-4">50</p>
                      <p className="text-gray-600">credits</p>
                      <p className="text-xl font-bold text-gray-900 my-2">$34.99</p>
                      <p className="text-sm text-gray-600 mb-4">$0.70 per credit</p>
                      <button 
                        onClick={() => purchaseCredits('premium')}
                        className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors font-semibold"
                      >
                        Purchase
                      </button>
                    </div>

                    <div className="p-6 bg-amber-50 rounded-lg border-2 border-amber-300 text-center">
                      <h4 className="font-bold text-gray-900 text-lg">Ultimate Pack</h4>
                      <p className="text-3xl font-bold text-amber-700 my-4">100</p>
                      <p className="text-gray-600">credits</p>
                      <p className="text-xl font-bold text-gray-900 my-2">$59.99</p>
                      <p className="text-sm text-gray-600 mb-4">$0.60 per credit</p>
                      <button 
                        onClick={() => purchaseCredits('ultimate')}
                        className="w-full bg-amber-600 text-white py-2 rounded-lg hover:bg-amber-700 transition-colors font-semibold"
                      >
                        Purchase
                      </button>
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <h4 className="font-semibold text-gray-900 mb-2">How Credits Work</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• View full profile: 2 credits</li>
                      <li>• Send message: 1 credit</li>
                      <li>• Read message: 1 credit</li>
                      <li>• Astrology report: 5 credits</li>
                      <li>• Advanced search: 3 credits (7 days)</li>
                      <li>• Profile highlight: 4 credits (3 days)</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Purchase History Tab */}
              {activeTab === "history" && (
                <div className="bg-white rounded-lg shadow-sm border border-blue-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-6">Purchase History</h3>
                  
                  <div className="space-y-4">
                    {purchaseHistory.map((purchase) => (
                      <div key={purchase.id} className="p-4 bg-white border border-blue-200 rounded-lg">
                        <div className="flex justify-between items-center">
                          <div>
                            <h5 className="font-semibold text-gray-900">{purchase.item}</h5>
                            <p className="text-sm text-gray-600">{purchase.date}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-blue-700 font-bold">{purchase.amount}</p>
                            <p className="text-sm text-gray-600">{purchase.credits} credits</p>
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {purchase.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {purchaseHistory.length === 0 && (
                    <div className="text-center py-8">
                      <span className="text-4xl mb-4 block">📋</span>
                      <p className="text-gray-500">No purchase history yet.</p>
                      <button 
                        onClick={() => setActiveTab("credits")}
                        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Make Your First Purchase
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Profile Tab */}
              {activeTab === "profile" && (
                <div className="bg-white rounded-lg shadow-sm border border-blue-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-6">My Profile</h3>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Profile Summary */}
                    <div className="lg:col-span-1">
                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                        <div className="text-center mb-4">
                          <div className="w-20 h-20 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 text-white text-2xl">
                            {user.name.charAt(0)}
                          </div>
                          <h4 className="font-semibold text-gray-900">{user.name}</h4>
                          <p className="text-blue-600 text-sm">{user.profile.profession}</p>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Credits Available:</span>
                            <span className="text-blue-700 font-semibold">{credits}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Profile Complete:</span>
                            <span className="text-blue-700 font-semibold">{user.profile.completed}%</span>
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
                                className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                              <input
                                type="email"
                                value={profileData.email || user.email}
                                onChange={(e) => handleProfileUpdate('email', e.target.value)}
                                className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                              <input
                                type="tel"
                                value={profileData.phone || user.phone}
                                onChange={(e) => handleProfileUpdate('phone', e.target.value)}
                                className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                              <input
                                type="text"
                                value={profileData.location || user.location}
                                onChange={(e) => handleProfileUpdate('location', e.target.value)}
                                className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Education</label>
                              <input
                                type="text"
                                value={profileData.education}
                                onChange={(e) => handleProfileUpdate('education', e.target.value)}
                                className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Religion</label>
                              <select
                                value={profileData.religion}
                                onChange={(e) => handleProfileUpdate('religion', e.target.value)}
                                className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                            <textarea
                              value={profileData.bio}
                              rows="4"
                              onChange={(e) => handleProfileUpdate('bio', e.target.value)}
                              className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                            className="px-4 py-2 border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors"
                          >
                            Discard Changes
                          </button>
                          <button
                            onClick={saveProfileChanges}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
                <div className="bg-white rounded-lg shadow-sm border border-blue-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-6">Settings</h3>
                  
                  <div className="space-y-8">
                    {/* Notification Preferences */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4">Notification Preferences</h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
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
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <div>
                            <p className="font-medium text-gray-900">Low Credit Alerts</p>
                            <p className="text-sm text-gray-600">Get notified when credits are low</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings.lowCreditAlerts}
                              onChange={(e) => handleSettingChange('lowCreditAlerts', e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <div>
                            <p className="font-medium text-gray-900">Auto-Purchase Credits</p>
                            <p className="text-sm text-gray-600">Automatically buy credits when balance is low</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings.autoPurchase}
                              onChange={(e) => handleSettingChange('autoPurchase', e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Privacy Settings */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4">Privacy Settings</h4>
                      <div className="space-y-4">
                        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Profile Visibility</label>
                          <select
                            value={settings.profileVisibility}
                            onChange={(e) => handleSettingChange('profileVisibility', e.target.value)}
                            className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
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
                          className="w-full text-left p-3 bg-blue-50 text-blue-700 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors"
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

export default PayAsYouGoDashboard;