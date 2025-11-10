import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PlanDashboard = () => {
  const [user, setUser] = useState(null);
  const [activePlan, setActivePlan] = useState(null);
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
  const [consultations, setConsultations] = useState([]);
  const [astrologyData, setAstrologyData] = useState({});
  const [priestServices, setPriestServices] = useState([]);
  const [venues, setVenues] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Plan-specific menu configurations
  const planMenus = {
    SILVER: [
      { id: "overview", name: "Overview", icon: "📊" },
      { id: "matches", name: "Match Making", icon: "💑" },
      { id: "messages", name: "Messages", icon: "💬" },
      { id: "profile", name: "My Profile", icon: "👤" },
      { id: "settings", name: "Settings", icon: "⚙️" }
    ],
    GOLD: [
      { id: "overview", name: "Overview", icon: "📊" },
      { id: "matches", name: "Premium Matches", icon: "💎" },
      { id: "consultation", name: "Pre-Wedding Consultation", icon: "🎓" },
      { id: "messages", name: "Messages", icon: "💬" },
      { id: "profile", name: "My Profile", icon: "👤" },
      { id: "settings", name: "Settings", icon: "⚙️" }
    ],
    DIAMOND: [
      { id: "overview", name: "Overview", icon: "📊" },
      { id: "matches", name: "Premium Matches", icon: "💎" },
      { id: "consultation", name: "Consultation", icon: "🎓" },
      { id: "astrology", name: "Astrology", icon: "🔮" },
      { id: "priest", name: "Priest Support", icon: "🙏" },
      { id: "locations", name: "Venue Locations", icon: "🏛️" },
      { id: "messages", name: "Messages", icon: "💬" },
      { id: "profile", name: "My Profile", icon: "👤" },
      { id: "settings", name: "Settings", icon: "⚙️" }
    ],
    PLATINUM: [
      { id: "overview", name: "Overview", icon: "📊" },
      { id: "matches", name: "VIP Matches", icon: "👑" },
      { id: "consultation", name: "Executive Consultation", icon: "🎓" },
      { id: "astrology", name: "Royal Astrology", icon: "🔮" },
      { id: "priest", name: "Elite Priest Services", icon: "🙏" },
      { id: "locations", name: "Luxury Venues", icon: "🏛️" },
      { id: "events", name: "VIP Events", icon: "🎪" },
      { id: "matchmaker", name: "Dedicated Matchmaker", icon: "🎯" },
      { id: "messages", name: "Executive Messages", icon: "💬" },
      { id: "profile", name: "My Profile", icon: "👤" },
      { id: "settings", name: "Executive Settings", icon: "⚙️" }
    ]
  };

  // Plan-specific features
  const planFeatures = {
    SILVER: [
      "Basic Match Making",
      "Limited Profile Views",
      "Basic Messaging",
      "Profile Management"
    ],
    GOLD: [
      "Priority Match Making",
      "Advanced Compatibility Analysis",
      "Dedicated Wedding Consultant",
      "Venue Shortlisting Service",
      "Vendor Management"
    ],
    DIAMOND: [
      "Executive Match Making",
      "Personal Matchmaker",
      "Astrology Services",
      "Premium Venue Access",
      "Full Vendor Coordination",
      "Custom Decor Design",
      "Catering Management"
    ],
    PLATINUM: [
      "VIP Match Making",
      "Dedicated Relationship Manager",
      "Luxury Venue Selection",
      "Complete Wedding Planning",
      "Premium Vendor Network",
      "Customized Services",
      "Day-of Coordination",
      "24/7 Executive Support"
    ]
  };

  // Initialize all data
  useEffect(() => {
    const fetchUserPlan = async () => {
      try {
        setLoading(true);
        const userVivId = "VIV93467"; // Replace with actual user VIV ID
        
        const response = await fetch(`/api/userplan/my-plan/${userVivId}`);
        const result = await response.json();
        
        if (result.success && result.plan) {
          const planData = result.plan;
          setActivePlan(planData);
          
          // Mock user data based on plan
          const userData = {
            id: 1,
            name: result.user?.name || "User",
            email: result.user?.email || "user@example.com",
            vivId: userVivId,
            subscription: {
              plan: planData.plan_name,
              status: "active",
              expires: planData.expires_at,
              price: planData.plan_frequency === "yearly" ? 
                `$${planData.payment_amount * 12}/year` : 
                `$${planData.payment_amount}/month`,
              features: planFeatures[planData.plan_name] || []
            },
            profile: {
              completed: 85,
              verified: true,
              photos: 6,
              matches: planData.plan_name === "SILVER" ? 15 : 
                      planData.plan_name === "GOLD" ? 35 :
                      planData.plan_name === "DIAMOND" ? 60 : 100,
              messages: planData.plan_name === "SILVER" ? 25 : 
                       planData.plan_name === "GOLD" ? 60 :
                       planData.plan_name === "DIAMOND" ? 120 : 200,
              consultations: planData.plan_name === "SILVER" ? 0 : 
                            planData.plan_name === "GOLD" ? 3 :
                            planData.plan_name === "DIAMOND" ? 8 : 15,
              locations: planData.plan_name === "SILVER" ? 0 : 
                        planData.plan_name === "GOLD" ? 2 :
                        planData.plan_name === "DIAMOND" ? 5 : 12,
              bio: "Looking for a life partner who shares similar values and interests.",
              education: "Bachelor's Degree",
              profession: "Professional",
              religion: "Hindu",
              motherTongue: "Hindi"
            }
          };
          setUser(userData);
          setProfileData(userData.profile);
          initializePlanData(planData.plan_name);
        } else {
          navigate('/subscription');
        }
      } catch (error) {
        console.error('Error fetching user plan:', error);
        alert('Error loading dashboard. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserPlan();
  }, [navigate]);

  const initializePlanData = (planName) => {
    // Initialize mock data based on plan
    const profiles = generateProfiles(planName);
    setMatches(profiles);

    // Mock messages
    const initialMessages = [
      {
        id: 1,
        matchId: 1,
        name: profiles[0]?.name || "Match",
        message: "Hi! I loved your profile. Would you like to chat?",
        time: "10:30 AM",
        unread: true,
        avatar: "👤",
        type: "received"
      }
    ];
    setMessages(initialMessages);

    // Other data based on plan level
    if (planName !== "SILVER") {
      setConsultations([
        {
          id: 1,
          date: "2024-02-15",
          time: "14:00",
          consultant: planName === "PLATINUM" ? "Executive Consultant" : "Consultant",
          type: "Relationship Counseling",
          status: "completed"
        }
      ]);

      setAstrologyData({
        horoscope: "Available",
        compatibility: [
          { sign: "Taurus", score: 92 },
          { sign: "Virgo", score: 88 }
        ],
        auspiciousDates: [
          { date: "2024-03-15", occasion: "Engagement", significance: "Very Auspicious" }
        ]
      });

      setPriestServices([
        {
          id: 1,
          name: planName === "PLATINUM" ? "Pandit Shastri" : "Pandit Sharma",
          specialization: planName === "PLATINUM" ? "Royal Vedic Ceremonies" : "Vedic Ceremonies",
          experience: "15 years",
          languages: ["Hindi", "Sanskrit", "English"],
          availability: "Available"
        }
      ]);

      setVenues([
        {
          id: 1,
          name: planName === "PLATINUM" ? "Luxury Palace Estate" : "Grand Palace Banquet",
          location: "Major City",
          capacity: planName === "PLATINUM" ? 500 : 300,
          price: planName === "PLATINUM" ? "$15,000 - $50,000" : "$5,000 - $15,000",
          type: planName === "PLATINUM" ? "Luxury Estate" : "Banquet Hall",
          amenities: ["Parking", "Catering", "Decoration"]
        }
      ]);
    }

    setSettings({
      emailNotifications: true,
      smsNotifications: false,
      profileVisibility: "all",
      matchSuggestions: true,
      privacyMode: false
    });
  };

  const generateProfiles = (planName) => {
    const baseProfiles = [
      {
        id: 1,
        name: "Priya Sharma",
        age: 28,
        location: "New York, USA",
        profession: "Software Engineer",
        description: "Tech professional with passion for traditional values.",
        image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?q=80&w=2070",
        interests: ["Technology", "Music", "Travel"],
        education: "Master's in Computer Science",
        salary: 120000,
        religion: "Hindu",
        horoscope: "Matched"
      }
    ];

    // Add more profiles based on plan level
    if (planName === "GOLD" || planName === "DIAMOND" || planName === "PLATINUM") {
      baseProfiles.push(
        {
          id: 2,
          name: "Dr. Ananya Reddy",
          age: 29,
          location: "California, USA",
          profession: "Cardiologist",
          description: "Harvard-educated doctor from a respected family.",
          image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=2070",
          interests: ["Medicine", "Classical Dance", "Philanthropy"],
          education: "MD Cardiology",
          salary: 350000,
          religion: "Hindu",
          horoscope: "Available"
        }
      );
    }

    if (planName === "DIAMOND" || planName === "PLATINUM") {
      baseProfiles.push(
        {
          id: 3,
          name: "Rohan Malhotra",
          age: 32,
          location: "Silicon Valley, USA",
          profession: "Tech Entrepreneur",
          description: "IIT alumnus running successful AI startup.",
          image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2070",
          interests: ["AI Research", "Classical Music", "Cricket"],
          education: "IIT Delhi - Computer Science",
          salary: 500000,
          religion: "Hindu",
          horoscope: "Available"
        }
      );
    }

    if (planName === "PLATINUM") {
      baseProfiles.push(
        {
          id: 4,
          name: "Aditi Birla",
          age: 31,
          location: "London, UK & Mumbai, India",
          profession: "Business Leader",
          description: "Leading international business with traditional values.",
          image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=2061",
          interests: ["Global Business", "Classical Arts", "Philanthropy"],
          education: "Oxford University",
          salary: 850000,
          religion: "Hindu",
          horoscope: "Matched"
        }
      );
    }

    return baseProfiles;
  };

  const getCurrentMenu = () => {
    const planName = activePlan?.plan_name || "SILVER";
    return planMenus[planName] || planMenus.SILVER;
  };

  const getPlanColor = (planName) => {
    const colors = {
      SILVER: { 
        bg: 'bg-gray-500', text: 'text-gray-600', light: 'bg-gray-50', border: 'border-gray-200',
        gradient: 'from-gray-500 to-gray-600'
      },
      GOLD: { 
        bg: 'bg-yellow-500', text: 'text-yellow-600', light: 'bg-yellow-50', border: 'border-yellow-200',
        gradient: 'from-yellow-500 to-yellow-600'
      },
      DIAMOND: { 
        bg: 'bg-blue-500', text: 'text-blue-600', light: 'bg-blue-50', border: 'border-blue-200',
        gradient: 'from-blue-500 to-blue-600'
      },
      PLATINUM: { 
        bg: 'bg-purple-500', text: 'text-purple-600', light: 'bg-purple-50', border: 'border-purple-200',
        gradient: 'from-purple-500 to-purple-600'
      }
    };
    return colors[planName] || colors.SILVER;
  };

  const getPlanIcon = (planName) => {
    const icons = {
      SILVER: "🚀",
      GOLD: "⭐",
      DIAMOND: "💎", 
      PLATINUM: "👑"
    };
    return icons[planName] || "🚀";
  };

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
    navigate("/subscription");
  };

  const handleProfileUpdate = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleSettingChange = (setting, value) => {
    setSettings(prev => ({ ...prev, [setting]: value }));
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
    setNewMessage("");
  };

  const handleSendMessage = () => {
    if (selectedMatch && newMessage.trim()) {
      sendMessage(selectedMatch.id, newMessage);
    }
  };

  const getMessagesForMatch = (matchId) => {
    return messages.filter(msg => msg.matchId === matchId);
  };

  // Plan-specific feature handlers
  const handleContactMatchmaker = () => {
    const planName = activePlan?.plan_name;
    if (planName === "PLATINUM") {
      alert("Connecting you with your dedicated matchmaker... You will receive a call within 15 minutes.");
    } else if (planName === "DIAMOND") {
      alert("Contacting our premium matchmaker... You will receive a call within 2 hours.");
    } else {
      alert("Matchmaking services are available in higher plans. Upgrade to access personalized matchmaking.");
    }
  };

  const scheduleConsultation = () => {
    const planName = activePlan?.plan_name;
    if (planName === "SILVER") {
      alert("Consultation services are available in Gold plan and above. Upgrade to access expert guidance.");
      return;
    }

    const date = prompt("Enter preferred date for consultation (YYYY-MM-DD):");
    const time = prompt("Enter preferred time (HH:MM):");
    
    if (date && time) {
      const newConsultation = {
        id: consultations.length + 1,
        date,
        time,
        consultant: planName === "PLATINUM" ? "Executive Consultant" : "Consultant",
        type: "New Consultation",
        status: "pending"
      };
      
      setConsultations(prev => [...prev, newConsultation]);
      alert(`Consultation scheduled for ${date} at ${time}!`);
    }
  };

  const handleAuspiciousDateDiscovery = () => {
    const planName = activePlan?.plan_name;
    if (planName === "SILVER" || planName === "GOLD") {
      alert("Astrology services are available in Diamond plan and above. Upgrade to access auspicious date discovery.");
      return;
    }
    alert("Auspicious Date Discovery initiated! Our astrologers will analyze your birth charts.");
  };

  const bookPriest = (priestId) => {
    const planName = activePlan?.plan_name;
    if (planName === "SILVER" || planName === "GOLD") {
      alert("Priest services are available in Diamond plan and above. Upgrade to access certified priests.");
      return;
    }

    const priest = priestServices.find(p => p.id === priestId);
    if (priest) {
      alert(`Booking request submitted for ${priest.name}!`);
    }
  };

  const findVenues = () => {
    const planName = activePlan?.plan_name;
    if (planName === "SILVER") {
      alert("Venue services are available in Gold plan and above. Upgrade to access venue recommendations.");
      return;
    }
    alert("Venue search initiated! Our team will share suitable options.");
  };

  const checkCompatibility = (matchId) => {
    const planName = activePlan?.plan_name;
    if (planName === "SILVER") {
      alert("Detailed compatibility reports are available in Gold plan and above.");
      return;
    }

    const match = matches.find(m => m.id === matchId);
    if (match) {
      alert(`Compatibility report for ${match.name}:\n\n- Overall Match: 88%`);
    }
  };

  const saveProfileChanges = () => {
    alert("Profile changes saved successfully!");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user || !activePlan) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">💍</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">No Active Plan</h2>
          <p className="text-gray-600 mb-4">You need to subscribe to a plan to access the dashboard.</p>
          <button 
            onClick={() => navigate('/subscription')}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Choose a Plan
          </button>
        </div>
      </div>
    );
  }

  const planName = activePlan.plan_name;
  const planColor = getPlanColor(planName);
  const planIcon = getPlanIcon(planName);
  const currentMenu = getCurrentMenu();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className={`w-10 h-10 ${planColor.bg} rounded-full flex items-center justify-center`}>
                <span className="text-white font-bold">{planIcon}</span>
              </div>
              <div className="ml-3">
                <h1 className="text-xl font-bold text-gray-900">Wedding Planner</h1>
                <p className="text-sm text-gray-500">{planName} Dashboard</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className={`text-sm font-semibold ${planColor.text}`}>
                  {planName} Plan
                </p>
              </div>
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-gray-600 font-semibold">{user.name.charAt(0)}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar Menu */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="text-center mb-6">
                  <div className={`w-16 h-16 ${planColor.bg} rounded-full flex items-center justify-center mx-auto mb-3`}>
                    <span className="text-2xl text-white">{planIcon}</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">{planName} Plan</h3>
                  <p className="text-gray-600">{user.subscription.price}</p>
                  <div className="mt-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                  </div>
                </div>

                <nav className="space-y-1">
                  {currentMenu.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setSelectedMatch(null);
                      }}
                      className={`w-full flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors ${
                        activeTab === item.id
                          ? `${planColor.light} ${planColor.text} border ${planColor.border}`
                          : "text-gray-600 hover:bg-gray-50 border border-transparent"
                      }`}
                    >
                      <span className="mr-3 text-lg">{item.icon}</span>
                      <div className="text-left">
                        <div className="font-medium">{item.name}</div>
                      </div>
                    </button>
                  ))}
                </nav>

                {/* Upgrade Button for non-Platinum plans */}
                {planName !== "PLATINUM" && (
                  <button
                    onClick={upgradePlan}
                    className="w-full mt-6 bg-gradient-to-r from-purple-600 to-purple-800 text-white py-2 rounded-lg font-semibold hover:shadow-lg transition-all"
                  >
                    Upgrade Plan
                  </button>
                )}

                {/* Plan Info */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h4 className="font-semibold text-gray-900 text-sm mb-3">Plan Features</h4>
                  <div className="space-y-2 text-xs">
                    {user.subscription.features.slice(0, 3).map((feature, index) => (
                      <div key={index} className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>
                        <span className="text-gray-600">{feature}</span>
                      </div>
                    ))}
                    {user.subscription.features.length > 3 && (
                      <div className="text-gray-500 text-xs">
                        +{user.subscription.features.length - 3} more features
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Overview Tab */}
              {activeTab === "overview" && (
                <div className="space-y-6">
                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <span className="text-xl">{planIcon}</span>
                        </div>
                        <div className="ml-3">
                          <p className="text-xs font-medium text-gray-600">Matches</p>
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

                    {(planName === "GOLD" || planName === "DIAMOND" || planName === "PLATINUM") && (
                      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <span className="text-xl">🎓</span>
                          </div>
                          <div className="ml-3">
                            <p className="text-xs font-medium text-gray-600">Consultations</p>
                            <p className="text-lg font-bold text-gray-900">{user.profile.consultations}</p>
                          </div>
                        </div>
                      </div>
                    )}

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
                    <h3 className="text-md font-bold text-gray-900 mb-3">Find Your Perfect Match</h3>
                    
                    <div className="flex flex-col md:flex-row gap-3 mb-4">
                      <div className="flex-1">
                        <input
                          type="text"
                          placeholder="Search members by name or description..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <button className={`${planColor.bg} text-white px-4 py-2 rounded-lg hover:opacity-90 transition-colors font-semibold text-sm`}>
                        Search
                      </button>
                    </div>
                  </div>

                  {/* Profiles Grid */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-md font-bold text-gray-900">
                        {planName === "SILVER" ? "Basic Matches" : 
                         planName === "GOLD" ? "Premium Matches" :
                         planName === "DIAMOND" ? "Diamond Matches" : "VIP Matches"}
                      </h3>
                      <button 
                        onClick={() => setActiveTab("matches")}
                        className="text-purple-600 hover:text-purple-700 font-medium text-sm"
                      >
                        View All →
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredProfiles.slice(0, 6).map((profile) => (
                        <div
                          key={profile.id}
                          className="group relative bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-purple-300 cursor-pointer"
                          onClick={() => {
                            setActiveTab("matches");
                            setSelectedMatch(profile);
                          }}
                        >
                          {/* Plan Badge */}
                          <div className="absolute top-2 right-2 z-20">
                            <div className={`w-6 h-6 ${planColor.bg} rounded-full flex items-center justify-center shadow-sm`}>
                              <span className="text-white text-xs">{planIcon}</span>
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
                              <p className="text-gray-200 text-xs">{profile.age} | {profile.location.split(',')[0]}</p>
                            </div>
                          </div>

                          {/* Profile Content */}
                          <div className="p-3">
                            <p className="text-purple-700 font-bold text-sm mb-1">{profile.profession}</p>
                            <p className="text-gray-600 text-xs line-clamp-2 mb-2">{profile.description}</p>

                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleContactMatchmaker();
                              }}
                              className={`w-full py-2 ${planColor.bg} text-white font-semibold rounded-lg hover:opacity-90 transition-all duration-200 text-xs`}
                            >
                              Connect
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Features */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <h3 className="text-md font-bold text-gray-900 mb-3">Your {planName} Features</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {user.subscription.features.map((feature, index) => (
                        <div key={index} className="flex items-center p-2 bg-gray-50 rounded-lg border border-gray-200">
                          <span className="text-green-500 mr-2">✓</span>
                          <span className="text-gray-700 text-sm font-medium">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Matches Tab */}
              {activeTab === "matches" && (
                <div className="space-y-6">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-bold text-gray-900">
                        {planName === "SILVER" ? "Basic Matches" : 
                         planName === "GOLD" ? "Premium Matches" :
                         planName === "DIAMOND" ? "Diamond Exclusive Profiles" : "VIP Matches"}
                      </h3>
                      <div className="flex gap-2">
                        <button className={`${planColor.bg} text-white px-4 py-2 rounded-lg hover:opacity-90 transition-colors text-sm`}>
                          Refresh Matches
                        </button>
                        <button 
                          onClick={handleContactMatchmaker}
                          className="bg-purple-800 text-white px-4 py-2 rounded-lg hover:bg-purple-900 transition-colors text-sm"
                        >
                          {planName === "PLATINUM" ? "Contact Matchmaker" : "Get Help"}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredProfiles.map((profile) => (
                        <div
                          key={profile.id}
                          className={`group relative bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border-2 cursor-pointer ${
                            selectedMatch?.id === profile.id 
                              ? `${planColor.border} bg-gray-50` 
                              : 'border-gray-200 hover:border-purple-300'
                          }`}
                          onClick={() => setSelectedMatch(profile)}
                        >
                          {/* Plan Badge */}
                          <div className="absolute top-2 right-2 z-20">
                            <div className={`w-6 h-6 ${planColor.bg} rounded-full flex items-center justify-center shadow-sm`}>
                              <span className="text-white text-xs">{planIcon}</span>
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
                              <p className="text-gray-200 font-semibold">{profile.age} | {profile.location}</p>
                            </div>
                          </div>

                          {/* Profile Content */}
                          <div className="p-4">
                            <div className="mb-3">
                              <p className="text-purple-700 font-bold text-md mb-2">{profile.profession}</p>
                              <p className="text-gray-600 text-sm mb-3">{profile.description}</p>
                            </div>

                            <div className="flex gap-2">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveTab("messages");
                                  setSelectedMatch(profile);
                                }}
                                className={`flex-1 ${planColor.bg} text-white py-2 rounded-lg hover:opacity-90 transition-colors text-sm`}
                              >
                                Message
                              </button>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  checkCompatibility(profile.id);
                                }}
                                className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors text-sm"
                              >
                                Details
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
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-6">Messages</h3>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Conversations List */}
                    <div className="lg:col-span-1">
                      <div className="space-y-3">
                        {matches.map((match) => {
                          const matchMessages = getMessagesForMatch(match.id);
                          const lastMessage = matchMessages[matchMessages.length - 1];
                          
                          return (
                            <div
                              key={match.id}
                              className={`p-3 rounded-lg border cursor-pointer transition-all ${
                                selectedMatch?.id === match.id
                                  ? 'bg-gray-50 border-purple-300'
                                  : 'bg-white border-gray-200 hover:bg-gray-50'
                              }`}
                              onClick={() => setSelectedMatch(match)}
                            >
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white">
                                  {match.name.charAt(0)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-semibold text-gray-900 truncate">{match.name}</h4>
                                  {lastMessage && (
                                    <p className="text-gray-600 text-sm truncate">{lastMessage.message}</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Chat Area */}
                    <div className="lg:col-span-2">
                      {selectedMatch ? (
                        <div className="border border-gray-200 rounded-lg h-96 flex flex-col">
                          {/* Chat Header */}
                          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 rounded-t-lg">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white text-sm">
                                {selectedMatch.name.charAt(0)}
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900">{selectedMatch.name}</h4>
                                <p className="text-purple-600 text-xs">{selectedMatch.profession}</p>
                              </div>
                            </div>
                          </div>

                          {/* Messages */}
                          <div className="flex-1 p-4 overflow-y-auto space-y-4">
                            {getMessagesForMatch(selectedMatch.id).map((message) => (
                              <div
                                key={message.id}
                                className={`flex ${message.type === 'sent' ? 'justify-end' : 'justify-start'}`}
                              >
                                <div
                                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                                    message.type === 'sent'
                                      ? 'bg-purple-600 text-white rounded-br-none'
                                      : 'bg-gray-100 text-gray-900 rounded-bl-none'
                                  }`}
                                >
                                  <p className="text-sm">{message.message}</p>
                                  <p className={`text-xs mt-1 ${message.type === 'sent' ? 'text-purple-200' : 'text-gray-500'}`}>
                                    {message.time}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Message Input */}
                          <div className="border-t border-gray-200 p-4">
                            <div className="flex space-x-2">
                              <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Type your message..."
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                              />
                              <button
                                onClick={handleSendMessage}
                                disabled={!newMessage.trim()}
                                className={`${planColor.bg} text-white px-4 py-2 rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
                              >
                                Send
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="h-96 flex items-center justify-center border border-gray-200 rounded-lg">
                          <div className="text-center">
                            <span className="text-6xl mb-4">💬</span>
                            <p className="text-gray-600">Select a conversation to start messaging</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Consultation Tab - Only for Gold, Diamond, Platinum */}
              {(activeTab === "consultation" && (planName === "GOLD" || planName === "DIAMOND" || planName === "PLATINUM")) && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-6">
                    {planName === "PLATINUM" ? "Executive Consultation" : "Pre-Wedding Consultation"}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <h4 className="font-semibold text-gray-900 mb-2">
                        {planName === "PLATINUM" ? "Executive Consultation" : "Expert Consultation"}
                      </h4>
                      <p className="text-gray-600 text-sm mb-4">
                        {planName === "PLATINUM" 
                          ? "Premium sessions with our top relationship experts and executive counselors"
                          : "Book personalized sessions with our relationship experts and marriage counselors"
                        }
                      </p>
                      <button 
                        onClick={scheduleConsultation}
                        className={`${planColor.bg} text-white px-4 py-2 rounded-lg hover:opacity-90 transition-colors`}
                      >
                        Schedule Consultation
                      </button>
                    </div>
                    
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <h4 className="font-semibold text-gray-900 mb-2">Consultation Benefits</h4>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <span className="text-green-500 mr-2">✓</span>
                          <span className="text-sm">Expert Support</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-green-500 mr-2">✓</span>
                          <span className="text-sm">Personalized Advice</span>
                        </div>
                        {planName === "DIAMOND" || planName === "PLATINUM" && (
                          <div className="flex items-center">
                            <span className="text-green-500 mr-2">✓</span>
                            <span className="text-sm">Cultural Sensitivity</span>
                          </div>
                        )}
                        {planName === "PLATINUM" && (
                          <div className="flex items-center">
                            <span className="text-green-500 mr-2">✓</span>
                            <span className="text-sm">24/7 Executive Support</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <h4 className="font-semibold text-gray-900 mb-4">Your Consultation Sessions</h4>
                  <div className="space-y-4">
                    {consultations.map((consultation) => (
                      <div key={consultation.id} className="p-4 bg-white border border-gray-200 rounded-lg">
                        <div className="flex justify-between items-center">
                          <div>
                            <h5 className="font-semibold text-gray-900">{consultation.type}</h5>
                            <p className="text-sm text-gray-600">With {consultation.consultant}</p>
                            <p className="text-sm text-gray-500">{consultation.date} at {consultation.time}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            consultation.status === 'scheduled' 
                              ? 'bg-green-100 text-green-800'
                              : consultation.status === 'completed'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {consultation.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Astrology Tab - Only for Diamond, Platinum */}
              {(activeTab === "astrology" && (planName === "DIAMOND" || planName === "PLATINUM")) && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-6">
                    {planName === "PLATINUM" ? "Royal Astrology" : "Auspicious Date Discovery"}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <h4 className="font-semibold text-gray-900 mb-2">
                        {planName === "PLATINUM" ? "Royal Horoscope Analysis" : "Horoscope Analysis"}
                      </h4>
                      <p className="text-gray-600 text-sm mb-4">
                        {planName === "PLATINUM"
                          ? "Executive astrological compatibility analysis with potential matches"
                          : "Get detailed astrological compatibility analysis with potential matches"
                        }
                      </p>
                      <button 
                        onClick={handleAuspiciousDateDiscovery}
                        className={`${planColor.bg} text-white px-4 py-2 rounded-lg hover:opacity-90 transition-colors`}
                      >
                        {planName === "PLATINUM" ? "Royal Analysis" : "Get Analysis"}
                      </button>
                    </div>
                    
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <h4 className="font-semibold text-gray-900 mb-2">
                        {planName === "PLATINUM" ? "Royal Muhurta Selection" : "Muhurta Selection"}
                      </h4>
                      <p className="text-gray-600 text-sm mb-4">
                        {planName === "PLATINUM"
                          ? "Executive selection of perfect dates for your royal wedding ceremonies"
                          : "Find perfect dates for your wedding ceremonies based on Vedic astrology"
                        }
                      </p>
                      <button 
                        onClick={handleAuspiciousDateDiscovery}
                        className={`${planColor.bg} text-white px-4 py-2 rounded-lg hover:opacity-90 transition-colors`}
                      >
                        {planName === "PLATINUM" ? "Royal Dates" : "Find Dates"}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4">Best Matches by Horoscope</h4>
                      <div className="space-y-3">
                        {astrologyData.compatibility?.map((match, index) => (
                          <div key={index} className="p-3 bg-white border border-gray-200 rounded-lg">
                            <div className="flex justify-between items-center">
                              <span className="font-medium">{match.sign}</span>
                              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                                {match.score}% Match
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4">Auspicious Dates</h4>
                      <div className="space-y-3">
                        {astrologyData.auspiciousDates?.map((date, index) => (
                          <div key={index} className="p-3 bg-white border border-gray-200 rounded-lg">
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
                </div>
              )}

              {/* Priest Support Tab - Only for Diamond, Platinum */}
              {(activeTab === "priest" && (planName === "DIAMOND" || planName === "PLATINUM")) && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-6">
                    {planName === "PLATINUM" ? "Elite Priest Services" : "Priest Support Services"}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <h4 className="font-semibold text-gray-900 mb-2">
                        {planName === "PLATINUM" ? "Elite Priest Booking" : "Book a Priest"}
                      </h4>
                      <p className="text-gray-600 text-sm mb-4">
                        {planName === "PLATINUM"
                          ? "Connect with elite certified priests for your royal wedding ceremonies"
                          : "Connect with certified priests for your wedding ceremonies and rituals"
                        }
                      </p>
                      <button 
                        onClick={() => bookPriest(1)}
                        className={`${planColor.bg} text-white px-4 py-2 rounded-lg hover:opacity-90 transition-colors`}
                      >
                        {planName === "PLATINUM" ? "Book Elite Priest" : "Find Priests"}
                      </button>
                    </div>
                    
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <h4 className="font-semibold text-gray-900 mb-2">
                        {planName === "PLATINUM" ? "Royal Ritual Guidance" : "Ritual Guidance"}
                      </h4>
                      <p className="text-gray-600 text-sm mb-4">
                        {planName === "PLATINUM"
                          ? "Executive guidance on royal wedding rituals, traditions, and customs"
                          : "Get expert guidance on wedding rituals, traditions, and customs"
                        }
                      </p>
                      <button 
                        onClick={() => bookPriest(1)}
                        className={`${planColor.bg} text-white px-4 py-2 rounded-lg hover:opacity-90 transition-colors`}
                      >
                        {planName === "PLATINUM" ? "Royal Guidance" : "Learn Rituals"}
                      </button>
                    </div>
                  </div>

                  <h4 className="font-semibold text-gray-900 mb-4">
                    {planName === "PLATINUM" ? "Available Elite Priests" : "Available Priests"}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {priestServices.map((priest) => (
                      <div key={priest.id} className="p-4 bg-white border border-gray-200 rounded-lg">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h5 className="font-semibold text-gray-900">{priest.name}</h5>
                            <p className="text-sm text-purple-600">{priest.specialization}</p>
                          </div>
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                            {priest.availability}
                          </span>
                        </div>
                        <div className="space-y-2 text-sm text-gray-600">
                          <p>Experience: {priest.experience}</p>
                          <p>Languages: {priest.languages.join(', ')}</p>
                        </div>
                        <button 
                          onClick={() => bookPriest(priest.id)}
                          className={`w-full mt-3 ${planColor.bg} text-white py-2 rounded-lg hover:opacity-90 transition-colors`}
                        >
                          {planName === "PLATINUM" ? "Book Elite Service" : "Book Priest"}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Locations Tab - Only for Gold, Diamond, Platinum */}
              {(activeTab === "locations" && (planName === "GOLD" || planName === "DIAMOND" || planName === "PLATINUM")) && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-6">
                    {planName === "PLATINUM" ? "Luxury Venue Selection" : "Venue Location Services"}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <h4 className="font-semibold text-gray-900 mb-2">
                        {planName === "PLATINUM" ? "Luxury Venues" : "Available Venues"}
                      </h4>
                      <p className="text-gray-600 text-sm mb-4">
                        {planName === "PLATINUM"
                          ? "Browse and select from exclusive luxury wedding venues"
                          : "Browse and select from premium wedding venues"
                        }
                      </p>
                      <button 
                        onClick={findVenues}
                        className={`${planColor.bg} text-white px-4 py-2 rounded-lg hover:opacity-90 transition-colors`}
                      >
                        {planName === "PLATINUM" ? "Browse Luxury Venues" : "Browse Venues"}
                      </button>
                    </div>
                    
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <h4 className="font-semibold text-gray-900 mb-2">
                        {planName === "PLATINUM" ? "Executive Venue Consultation" : "Venue Consultation"}
                      </h4>
                      <p className="text-gray-600 text-sm mb-4">
                        {planName === "PLATINUM"
                          ? "Schedule exclusive venue viewing with our executive consultants"
                          : "Schedule a venue viewing with our experts"
                        }
                      </p>
                      <button 
                        onClick={findVenues}
                        className={`${planColor.bg} text-white px-4 py-2 rounded-lg hover:opacity-90 transition-colors`}
                      >
                        {planName === "PLATINUM" ? "Executive Viewing" : "Schedule Viewing"}
                      </button>
                    </div>
                  </div>

                  <h4 className="font-semibold text-gray-900 mb-4">
                    {planName === "PLATINUM" ? "Featured Luxury Venues" : "Featured Venues"}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {venues.map((venue) => (
                      <div key={venue.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                        <div className="relative h-48">
                          <img
                            src={venue.image}
                            alt={venue.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-3 right-3">
                            <span className={`${planColor.bg} text-white px-2 py-1 rounded-full text-xs`}>
                              {planName} Partner
                            </span>
                          </div>
                        </div>
                        <div className="p-4">
                          <h5 className="font-semibold text-gray-900 mb-2">{venue.name}</h5>
                          <p className="text-sm text-gray-600 mb-2">{venue.location} • Capacity: {venue.capacity} guests</p>
                          <p className="text-purple-700 font-bold mb-3">{venue.price}</p>
                          <button 
                            onClick={findVenues}
                            className={`w-full ${planColor.bg} text-white py-2 rounded-lg hover:opacity-90 transition-colors`}
                          >
                            {planName === "PLATINUM" ? "Schedule Exclusive Viewing" : "Schedule Viewing"}
                          </button>
                        </div>
                      </div>
                    ))}
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
                          <div className="w-20 h-20 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3 text-white text-2xl">
                            {user.name.charAt(0)}
                          </div>
                          <h4 className="font-semibold text-gray-900">{user.name}</h4>
                          <p className="text-purple-600 text-sm">{user.profile.profession}</p>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Profile Complete:</span>
                            <span className="text-purple-700 font-semibold">{user.profile.completed}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Plan:</span>
                            <span className={`font-semibold ${planColor.text}`}>{planName}</span>
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
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Profession</label>
                              <input
                                type="text"
                                value={profileData.profession}
                                onChange={(e) => handleProfileUpdate('profession', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Education</label>
                              <input
                                type="text"
                                value={profileData.education}
                                onChange={(e) => handleProfileUpdate('education', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Religion</label>
                              <select
                                value={profileData.religion}
                                onChange={(e) => handleProfileUpdate('religion', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                              >
                                <option value="Hindu">Hindu</option>
                                <option value="Sikh">Sikh</option>
                                <option value="Christian">Christian</option>
                                <option value="Muslim">Muslim</option>
                                <option value="Other">Other</option>
                              </select>
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                          <textarea
                            value={profileData.bio}
                            rows="4"
                            onChange={(e) => handleProfileUpdate('bio', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Tell us about yourself..."
                          />
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
                            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
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
                  <h3 className="text-lg font-bold text-gray-900 mb-6">
                    {planName === "PLATINUM" ? "Executive Settings" : "Settings"}
                  </h3>
                  
                  <div className="space-y-8">
                    {/* Notification Preferences */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4">Notification Preferences</h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <div>
                            <p className="font-medium text-gray-900">Email Notifications</p>
                            <p className="text-sm text-gray-600">Receive updates and match alerts via email</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings.emailNotifications}
                              onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                          </label>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <div>
                            <p className="font-medium text-gray-900">Match Suggestions</p>
                            <p className="text-sm text-gray-600">Receive daily match recommendations</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings.matchSuggestions}
                              onChange={(e) => handleSettingChange('matchSuggestions', e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Account Actions */}
                    <div className="border-t pt-6">
                      <h4 className="font-semibold text-gray-900 mb-4">Account Actions</h4>
                      <div className="space-y-3">
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

              {/* Show upgrade message for restricted features */}
              {((activeTab === "consultation" && planName === "SILVER") ||
                (activeTab === "astrology" && (planName === "SILVER" || planName === "GOLD")) ||
                (activeTab === "priest" && (planName === "SILVER" || planName === "GOLD")) ||
                (activeTab === "locations" && planName === "SILVER")) && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="text-center py-8">
                    <span className="text-6xl mb-4">🔒</span>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Feature Not Available</h3>
                    <p className="text-gray-600 mb-4">
                      This feature is available in {getHigherPlanName(activeTab)} plan and above.
                    </p>
                    <button 
                      onClick={upgradePlan}
                      className="bg-gradient-to-r from-purple-600 to-purple-800 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
                    >
                      Upgrade Now
                    </button>
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

// Helper function to get higher plan name for upgrade messages
const getHigherPlanName = (feature) => {
  switch(feature) {
    case "consultation":
    case "locations":
      return "Gold";
    case "astrology":
    case "priest":
      return "Diamond";
    default:
      return "higher";
  }
};

export default PlanDashboard;