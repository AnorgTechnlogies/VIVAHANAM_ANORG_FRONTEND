import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PlatinumDashboard = () => {
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
  const [consultations, setConsultations] = useState([]);
  const [astrologyData, setAstrologyData] = useState({});
  const [priestServices, setPriestServices] = useState([]);
  const [venues, setVenues] = useState([]);
  const [matchmakers, setMatchmakers] = useState([]);
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  // Initialize all data
  useEffect(() => {
    // Mock user data
    const userData = {
      id: 1,
      name: "Rajeshwari Nair",
      email: "rajeshwari.nair@example.com",
      phone: "+1 (555) 123-4567",
      location: "San Francisco, USA",
      dob: "1988-12-10",
      gender: "Female",
      subscription: {
        plan: "Platinum",
        status: "active",
        expires: "2024-12-31",
        price: "$4,999/year",
        features: [
          "Executive Match Making",
          "Dedicated Matchmaker",
          "Luxury Venue Selection",
          "VIP Event Access",
          "Comprehensive Wedding Planning",
          "Global Network Access",
          "Priority Support 24/7"
        ]
      },
      profile: {
        completed: 98,
        verified: true,
        photos: 12,
        matches: 67,
        messages: 156,
        consultations: 12,
        locations: 8,
        events: 3,
        bio: "Tech executive and philanthropist seeking a life partner who values excellence, tradition, and global citizenship.",
        education: "PhD Computer Science - Stanford",
        profession: "CTO & Co-founder",
        income: "$450,000",
        religion: "Hindu",
        caste: "Nair",
        motherTongue: "Malayalam",
        height: "5'7\"",
        maritalStatus: "Never Married",
        horoscope: "Sagittarius"
      }
    };
    setUser(userData);
    setProfileData(userData.profile);

    // Platinum profiles data - Ultra premium profiles
    const platinumProfiles = [
      {
        id: 1,
        name: "Dr. Vikram Adani",
        age: 38,
        location: "Palo Alto, CA USA",
        profession: "Biotech Billionaire",
        description: "Self-made billionaire revolutionizing healthcare through biotech innovations. Philanthropist and art collector.",
        image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=2070",
        interests: ["Biotech Innovation", "Classical Art", "Philanthropy", "Yachting"],
        gender: "male",
        salary: 2500000,
        religion: "Hindu",
        diet: "Vegetarian",
        language: "Gujarati, English, French",
        education: "PhD Bioengineering - MIT",
        family: "Industrialist Family",
        height: "6'1\"",
        horoscope: "Matched",
        lastActive: "Online now",
        verified: true,
        premium: true
      },
      {
        id: 2,
        name: "Ananya Birla",
        age: 36,
        location: "London, UK & Mumbai, India",
        profession: "Global Business Leader",
        description: "Leading international business conglomerate with interests across 18 countries. Passionate about women empowerment.",
        image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=2061",
        interests: ["Global Business", "Classical Music", "Philanthropy", "Polo"],
        gender: "female",
        salary: 1800000,
        religion: "Hindu",
        diet: "Vegetarian",
        language: "Hindi, English, Spanish",
        education: "Oxford University - Economics",
        family: "Business Dynasty",
        height: "5'8\"",
        horoscope: "Available",
        lastActive: "2 hours ago",
        verified: true,
        premium: true
      },
      {
        id: 3,
        name: "Rohan Malhotra",
        age: 40,
        location: "New York, NY & Delhi, India",
        profession: "Private Equity Mogul",
        description: "Managing partner at global private equity firm. Collects vintage cars and supports educational initiatives.",
        image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=2070",
        interests: ["Private Equity", "Vintage Cars", "Education", "Golf"],
        gender: "male",
        salary: 3200000,
        religion: "Hindu",
        diet: "Non-Vegetarian",
        language: "Punjabi, English",
        education: "Harvard Business School",
        family: "Business Legacy",
        height: "6'0\"",
        horoscope: "Matched",
        lastActive: "1 hour ago",
        verified: true,
        premium: true
      },
      {
        id: 4,
        name: "Priya Reddy",
        age: 35,
        location: "Singapore & Hyderabad, India",
        profession: "Tech Venture Capitalist",
        description: "Leading VC firm partner focusing on AI and deep tech. Classical dancer and environmental activist.",
        image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=2076",
        interests: ["Venture Capital", "Classical Dance", "Environment", "Travel"],
        gender: "female",
        salary: 2200000,
        religion: "Hindu",
        diet: "Vegetarian",
        language: "Telugu, English, Mandarin",
        education: "Stanford University - Computer Science",
        family: "Industrial Family",
        height: "5'6\"",
        horoscope: "Available",
        lastActive: "Online now",
        verified: true,
        premium: true
      }
    ];
    setMatches(platinumProfiles);

    // Mock messages data
    const initialMessages = [
      {
        id: 1,
        matchId: 1,
        name: "Dr. Vikram Adani",
        message: "Rajeshwari, our matchmaker informed me about our exceptional compatibility. Would you be open to a private dinner?",
        time: "10:15 AM",
        unread: true,
        avatar: "👑",
        type: "received"
      },
      {
        id: 2,
        matchId: 1,
        name: "You",
        message: "Thank you Vikram. I've reviewed your profile as well. Our matchmaker has scheduled an introduction for next week.",
        time: "10:20 AM",
        unread: false,
        avatar: "👤",
        type: "sent"
      }
    ];
    setMessages(initialMessages);

    // Mock consultations
    setConsultations([
      {
        id: 1,
        date: "2024-02-18",
        time: "16:00",
        consultant: "Senior Matchmaker Sharma",
        type: "Executive Compatibility Review",
        status: "completed"
      },
      {
        id: 2,
        date: "2024-02-25",
        time: "14:00",
        consultant: "Relationship Director Patel",
        type: "Family Integration Strategy",
        status: "scheduled"
      }
    ]);

    // Mock astrology data
    setAstrologyData({
      horoscope: "Sagittarius",
      compatibility: [
        { sign: "Aries", score: 95 },
        { sign: "Leo", score: 92 },
        { sign: "Aquarius", score: 88 }
      ],
      auspiciousDates: [
        { date: "2024-05-18", occasion: "Executive Meeting", significance: "Highly Auspicious" },
        { date: "2024-06-22", occasion: "Alliance Finalization", significance: "Perfect Alignment" },
        { date: "2024-09-15", occasion: "Wedding Ceremony", significance: "Royal Muhurta" }
      ]
    });

    // Mock priest services
    setPriestServices([
      {
        id: 1,
        name: "Pandit Shastri",
        specialization: "Royal Vedic Ceremonies",
        experience: "25 years",
        languages: ["Sanskrit", "Hindi", "English", "Tamil"],
        availability: "By Appointment",
        premium: true
      },
      {
        id: 2,
        name: "Pandit Iyer",
        specialization: "South Indian Royal Rituals",
        experience: "20 years",
        languages: ["Sanskrit", "Tamil", "English", "Malayalam"],
        availability: "By Appointment",
        premium: true
      }
    ]);

    // Mock venues
    setVenues([
      {
        id: 1,
        name: "The Grand Palace Estate",
        location: "Napa Valley, CA",
        capacity: 500,
        price: "$50,000 - $200,000",
        type: "Luxury Wine Estate",
        image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=2098",
        amenities: ["Helipad", "Private Chef", "Luxury Accommodation", "Spa", "Wine Cellar"]
      },
      {
        id: 2,
        name: "Royal Island Resort",
        location: "Private Island, Bahamas",
        capacity: 300,
        price: "$75,000 - $300,000",
        type: "Private Island",
        image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2070",
        amenities: ["Private Beach", "Yacht Dock", "Luxury Villas", "Spa", "Gourmet Dining"]
      }
    ]);

    // Mock matchmakers
    setMatchmakers([
      {
        id: 1,
        name: "Ms. Sharma",
        experience: "15 years",
        specialization: "High-Net-Worth Individuals",
        successRate: "98%",
        clients: "200+",
        availability: "Dedicated"
      },
      {
        id: 2,
        name: "Mr. Kapoor",
        experience: "12 years",
        specialization: "Business Families",
        successRate: "95%",
        clients: "150+",
        availability: "Dedicated"
      }
    ]);

    // Mock events
    setEvents([
      {
        id: 1,
        name: "Platinum Gala Dinner",
        date: "2024-03-15",
        location: "The Ritz-Carlton, San Francisco",
        type: "Exclusive Networking",
        status: "Invitation Sent"
      },
      {
        id: 2,
        name: "Private Art Exhibition",
        date: "2024-04-20",
        location: "Metropolitan Museum, New York",
        type: "Cultural Event",
        status: "Confirmed"
      }
    ]);

    // Mock settings
    setSettings({
      emailNotifications: true,
      smsNotifications: true,
      profileVisibility: "platinum",
      matchSuggestions: true,
      privacyMode: true,
      executiveSupport: true,
      eventInvitations: true
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
    alert(`Message sent through executive channel!`);
  };

  const scheduleConsultation = () => {
    alert("Your dedicated matchmaker will contact you to schedule an executive consultation.");
  };

  const bookPriest = (priestId) => {
    const priest = priestServices.find(p => p.id === priestId);
    if (priest) {
      alert(`Executive booking request submitted for ${priest.name}! Your wedding planner will coordinate.`);
    }
  };

  const scheduleVenueViewing = (venueId) => {
    const venue = venues.find(v => v.id === venueId);
    if (venue) {
      alert(`Private viewing scheduled for ${venue.name}! Your concierge will arrange transportation.`);
    }
  };

  const checkCompatibility = (matchId) => {
    const match = matches.find(m => m.id === matchId);
    if (match) {
      alert(`Executive compatibility report for ${match.name}:\n\n- Astrological Match: 96%\n- Values Alignment: 94%\n- Lifestyle Compatibility: 92%\n- Family Harmony: 95%`);
    }
  };

  const contactMatchmaker = () => {
    alert("Connecting you with your dedicated matchmaker... You will receive a call within 15 minutes.");
  };

  const saveProfileChanges = () => {
    alert("Profile changes saved successfully! Your matchmaker has been notified.");
  };

  const deleteAccount = () => {
    if (window.confirm("Are you sure you want to delete your Platinum account? This action cannot be undone.")) {
      alert("Account deletion request submitted. Our executive team will contact you for confirmation.");
    }
  };

  const handleExecutiveSupport = () => {
    alert("Executive support team alerted! You will receive a call from our VIP support within 5 minutes.");
  };

  const handleEventRSVP = (eventId) => {
    const event = events.find(e => e.id === eventId);
    if (event) {
      alert(`RSVP confirmed for ${event.name}! Your personal assistant will handle the logistics.`);
    }
  };

  if (!user) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  return (
    <div className="min-h-screen bg-amber-100">
      {/* Header */}
      <header className="bg-purple-900 shadow-sm border-b border-purple-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-purple-800 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">P</span>
              </div>
              <h1 className="ml-3 text-xl font-bold text-white">Platinum Dashboard</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-white">{user.name}</p>
                <p className="text-sm text-purple-200 font-semibold">{user.subscription.plan} Member</p>
              </div>
              <button
                onClick={handleLogout}
                className="bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded-lg transition-colors"
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
              <div className="bg-white rounded-lg shadow-sm border border-purple-200 p-6">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-purple-800 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl text-white">👑</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">{user.subscription.plan} Plan</h3>
                  <p className="text-gray-600">{user.subscription.price}</p>
                  <div className="mt-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      VIP Active
                    </span>
                  </div>
                </div>

                <nav className="space-y-2">
                  {[
                    { id: "overview", name: "Executive Overview", icon: "👑" },
                    { id: "matches", name: "Platinum Matches", icon: "💎", count: matches.length },
                    { id: "matchmaker", name: "Dedicated Matchmaker", icon: "🎯", count: 1 },
                    { id: "consultation", name: "Executive Consultation", icon: "🎓", count: consultations.filter(c => c.status === 'scheduled').length },
                    { id: "astrology", name: "Royal Astrology", icon: "🔮" },
                    { id: "priest", name: "Elite Priest Services", icon: "🙏" },
                    { id: "locations", name: "Luxury Venues", icon: "🏛️" },
                    { id: "events", name: "VIP Events", icon: "🎪", count: events.length },
                    { id: "messages", name: "Executive Messages", icon: "💬", count: messages.filter(m => m.unread).length },
                    { id: "profile", name: "My Profile", icon: "👤" },
                    { id: "settings", name: "Executive Settings", icon: "⚙️" }
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        activeTab === item.id
                          ? "bg-purple-100 text-purple-900"
                          : "text-gray-600 hover:bg-purple-50"
                      }`}
                    >
                      <div className="flex items-center">
                        <span className="mr-3">{item.icon}</span>
                        {item.name}
                      </div>
                      {item.count > 0 && (
                        <span className="bg-purple-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {item.count}
                        </span>
                      )}
                    </button>
                  ))}
                </nav>

                <button
                  onClick={handleExecutiveSupport}
                  className="w-full mt-6 bg-gradient-to-r from-purple-600 to-purple-800 text-white py-2 rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                  Executive Support
                </button>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Overview Tab */}
              {activeTab === "overview" && (
                <div className="space-y-6">
                  {/* VIP Stats Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-lg shadow-sm border border-purple-200 p-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <span className="text-xl">👑</span>
                        </div>
                        <div className="ml-3">
                          <p className="text-xs font-medium text-gray-600">Platinum Matches</p>
                          <p className="text-lg font-bold text-gray-900">{user.profile.matches}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-purple-200 p-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <span className="text-xl">🎯</span>
                        </div>
                        <div className="ml-3">
                          <p className="text-xs font-medium text-gray-600">Matchmaker Sessions</p>
                          <p className="text-lg font-bold text-gray-900">{user.profile.consultations}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-purple-200 p-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <span className="text-xl">🏛️</span>
                        </div>
                        <div className="ml-3">
                          <p className="text-xs font-medium text-gray-600">Luxury Venues</p>
                          <p className="text-lg font-bold text-gray-900">{user.profile.locations}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-purple-200 p-4">
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

                  {/* Executive Search Section */}
                  <div className="bg-white rounded-lg shadow-sm border border-purple-200 p-4">
                    <h3 className="text-md font-bold text-gray-900 mb-3">Executive Match Discovery</h3>
                    
                    <div className="flex flex-col md:flex-row gap-3 mb-4">
                      <div className="flex-1">
                        <input
                          type="text"
                          placeholder="Search elite members by name, profession, or interests..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full px-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors font-semibold text-sm">
                        Elite Search
                      </button>
                    </div>

                    {/* Executive Filters */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 mb-4">
                      <select
                        value={filters.ageMin}
                        onChange={(e) => setFilters({ ...filters, ageMin: parseInt(e.target.value) })}
                        className="px-2 py-1 bg-white border border-purple-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm"
                      >
                        <option value={30}>Min: 30</option>
                        <option value={35}>Min: 35</option>
                        <option value={40}>Min: 40</option>
                      </select>
                      <select
                        value={filters.ageMax}
                        onChange={(e) => setFilters({ ...filters, ageMax: parseInt(e.target.value) })}
                        className="px-2 py-1 bg-white border border-purple-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm"
                      >
                        <option value={45}>Max: 45</option>
                        <option value={50}>Max: 50</option>
                        <option value={55}>Max: 55</option>
                      </select>
                      <input
                        type="text"
                        placeholder="Global Location"
                        value={filters.location}
                        onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                        className="px-2 py-1 bg-white border border-purple-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm"
                      />
                      <select
                        value={filters.religion}
                        onChange={(e) => setFilters({ ...filters, religion: e.target.value })}
                        className="px-2 py-1 bg-white border border-purple-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm"
                      >
                        <option value="">Religion</option>
                        <option value="Hindu">Hindu</option>
                        <option value="Sikh">Sikh</option>
                        <option value="Christian">Christian</option>
                      </select>
                      <select
                        value={filters.diet}
                        onChange={(e) => setFilters({ ...filters, diet: e.target.value })}
                        className="px-2 py-1 bg-white border border-purple-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm"
                      >
                        <option value="">Diet</option>
                        <option value="Vegetarian">Vegetarian</option>
                        <option value="Non-Vegetarian">Non-Veg</option>
                      </select>
                    </div>
                  </div>

                  {/* Platinum Profiles Grid */}
                  <div className="bg-white rounded-lg shadow-sm border border-purple-200 p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-md font-bold text-gray-900">Featured Platinum Profiles</h3>
                      <button 
                        onClick={() => setActiveTab("matches")}
                        className="text-purple-600 hover:text-purple-700 font-medium text-sm"
                      >
                        View All Elite Matches →
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                      {filteredProfiles.slice(0, 4).map((profile) => (
                        <div
                          key={profile.id}
                          className="group relative bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-purple-200 hover:border-purple-300 cursor-pointer"
                          onClick={() => setActiveTab("matches")}
                        >
                          {/* Platinum Crown Badge */}
                          <div className="absolute top-2 right-2 z-20">
                            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-purple-800 rounded-full flex items-center justify-center shadow-lg">
                              <span className="text-white text-sm">👑</span>
                            </div>
                          </div>

                          {/* Verified Badge */}
                          {profile.verified && (
                            <div className="absolute top-2 left-2 z-20">
                              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shadow-sm">
                                <span className="text-white text-xs">✓</span>
                              </div>
                            </div>
                          )}

                          {/* Profile Image */}
                          <div className="relative h-40 overflow-hidden rounded-t-xl">
                            <img
                              src={profile.image}
                              alt={profile.name}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                            <div className="absolute bottom-3 left-3 right-3 text-white">
                              <h3 className="text-lg font-bold mb-1">{profile.name}</h3>
                              <p className="text-purple-200 font-semibold text-sm">{profile.age} | {profile.location.split(' & ')[0]}</p>
                            </div>
                          </div>

                          {/* Profile Content */}
                          <div className="p-4">
                            <div className="mb-3">
                              <p className="text-purple-700 font-bold text-md mb-2">{profile.profession}</p>
                              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{profile.description}</p>
                            </div>

                            {/* Executive Info */}
                            <div className="space-y-2 mb-3 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-500">Education:</span>
                                <span className="text-gray-800 font-medium text-right truncate ml-2">
                                  {profile.education.split(' - ')[0]}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-500">Status:</span>
                                <span className="text-green-600 font-bold">{profile.lastActive}</span>
                              </div>
                            </div>

                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                contactMatchmaker();
                              }}
                              className="w-full py-3 bg-gradient-to-r from-purple-600 to-purple-800 text-white font-semibold rounded-lg hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-200 text-sm"
                            >
                              Contact Matchmaker
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Executive Features */}
                  <div className="bg-white rounded-lg shadow-sm border border-purple-200 p-4">
                    <h3 className="text-md font-bold text-gray-900 mb-3">Your Platinum Executive Features</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {user.subscription.features.map((feature, index) => (
                        <div key={index} className="flex items-center p-3 bg-purple-50 rounded-lg border border-purple-200">
                          <span className="text-green-500 mr-3 text-lg">✦</span>
                          <span className="text-gray-700 text-sm font-medium">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* VIP Welcome */}
                  <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-lg shadow-sm p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-bold mb-2">Welcome to Platinum! 👑</h3>
                        <p className="opacity-90 text-sm">Your executive matchmaking journey begins here with personalized, discreet, and elite service.</p>
                        <p className="opacity-80 text-xs mt-2">Your dedicated matchmaker: Ms. Sharma</p>
                      </div>
                      <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                        <span className="text-2xl">💼</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Matches Tab */}
              {activeTab === "matches" && (
                <div className="space-y-6">
                  <div className="bg-white rounded-lg shadow-sm border border-purple-200 p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-bold text-gray-900">Platinum Executive Matches</h3>
                      <div className="flex gap-2">
                        <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm">
                          Refresh Elite Matches
                        </button>
                        <button 
                          onClick={contactMatchmaker}
                          className="bg-purple-800 text-white px-4 py-2 rounded-lg hover:bg-purple-900 transition-colors text-sm"
                        >
                          Contact Matchmaker
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {filteredProfiles.map((profile) => (
                        <div
                          key={profile.id}
                          className="group relative bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-purple-200 hover:border-purple-300 cursor-pointer"
                        >
                          {/* Platinum Crown */}
                          <div className="absolute top-3 right-3 z-20">
                            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-purple-800 rounded-full flex items-center justify-center shadow-lg">
                              <span className="text-white text-lg">👑</span>
                            </div>
                          </div>

                          {/* Profile Image */}
                          <div className="relative h-60 overflow-hidden rounded-t-xl">
                            <img
                              src={profile.image}
                              alt={profile.name}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                            <div className="absolute bottom-4 left-4 right-4 text-white">
                              <h3 className="text-xl font-bold mb-2">{profile.name}</h3>
                              <p className="text-purple-200 font-semibold">{profile.age} | {profile.location}</p>
                            </div>
                          </div>

                          {/* Profile Content */}
                          <div className="p-5">
                            <div className="mb-4">
                              <p className="text-purple-700 font-bold text-lg mb-3">{profile.profession}</p>
                              <p className="text-gray-600 text-sm mb-4 leading-relaxed">{profile.description}</p>
                            </div>

                            {/* Executive Info */}
                            <div className="space-y-3 mb-4 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-500">Education:</span>
                                <span className="text-gray-800 font-medium text-right">
                                  {profile.education}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-500">Annual Revenue:</span>
                                <span className="text-green-600 font-bold">${(profile.salary/1000000).toFixed(1)}M+</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-500">Horoscope:</span>
                                <span className="text-blue-600 font-semibold">{profile.horoscope}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-500">Status:</span>
                                <span className="text-green-500 font-semibold">{profile.lastActive}</span>
                              </div>
                            </div>

                            <div className="flex gap-3">
                              <button 
                                onClick={contactMatchmaker}
                                className="flex-1 bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors text-sm font-semibold"
                              >
                                Arrange Introduction
                              </button>
                              <button 
                                onClick={() => checkCompatibility(profile.id)}
                                className="flex-1 bg-purple-500 text-white py-3 rounded-lg hover:bg-purple-600 transition-colors text-sm font-semibold"
                              >
                                Executive Report
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Dedicated Matchmaker Tab */}
              {activeTab === "matchmaker" && (
                <div className="bg-white rounded-lg shadow-sm border border-purple-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-6">Your Dedicated Matchmaker</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {matchmakers.map((matchmaker) => (
                      <div key={matchmaker.id} className="p-6 bg-purple-50 rounded-lg border-2 border-purple-200">
                        <div className="flex items-center mb-4">
                          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-700 rounded-full flex items-center justify-center text-white text-xl mr-4">
                            {matchmaker.name.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900 text-lg">{matchmaker.name}</h4>
                            <p className="text-purple-600">{matchmaker.specialization}</p>
                          </div>
                        </div>
                        <div className="space-y-2 text-sm text-gray-600 mb-4">
                          <p>Experience: {matchmaker.experience}</p>
                          <p>Success Rate: {matchmaker.successRate}</p>
                          <p>Clients Served: {matchmaker.clients}</p>
                          <p>Availability: <span className="text-green-600 font-semibold">{matchmaker.availability}</span></p>
                        </div>
                        <button 
                          onClick={contactMatchmaker}
                          className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors font-semibold"
                        >
                          Schedule Executive Session
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-lg p-6 text-white">
                    <h4 className="font-bold text-lg mb-3">Executive Matchmaking Process</h4>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                      <div className="text-center">
                        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">1</div>
                        <p>Initial Consultation & Profile Analysis</p>
                      </div>
                      <div className="text-center">
                        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">2</div>
                        <p>Executive Match Selection</p>
                      </div>
                      <div className="text-center">
                        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">3</div>
                        <p>Arranged Introductions</p>
                      </div>
                      <div className="text-center">
                        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">4</div>
                        <p>Alliance Finalization</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* VIP Events Tab */}
              {activeTab === "events" && (
                <div className="bg-white rounded-lg shadow-sm border border-purple-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-6">Exclusive Platinum Events</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {events.map((event) => (
                      <div key={event.id} className="p-6 bg-white border-2 border-purple-200 rounded-lg">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="font-bold text-gray-900 text-lg">{event.name}</h4>
                            <p className="text-purple-600">{event.type}</p>
                          </div>
                          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                            {event.status}
                          </span>
                        </div>
                        <div className="space-y-2 text-sm text-gray-600 mb-4">
                          <p>Date: {event.date}</p>
                          <p>Location: {event.location}</p>
                        </div>
                        <button 
                          onClick={() => handleEventRSVP(event.id)}
                          className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors font-semibold"
                        >
                          Confirm Attendance
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 p-6 bg-purple-50 rounded-lg border border-purple-200">
                    <h4 className="font-bold text-gray-900 mb-3">Upcoming Elite Events</h4>
                    <p className="text-gray-600 text-sm mb-4">
                      Your personal assistant will handle all logistics for these exclusive events. 
                      Additional invitations are curated based on your preferences.
                    </p>
                    <button 
                      onClick={handleExecutiveSupport}
                      className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Request Additional Events
                    </button>
                  </div>
                </div>
              )}

              {/* Other tabs would follow similar pattern with Platinum-level features */}

              {/* Quick note: Other tabs (Consultation, Astrology, Priest, Locations, Messages, Profile, Settings) 
                   would follow the same enhanced pattern as in Diamond but with Platinum-level features, 
                   executive services, and premium styling */}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlatinumDashboard;