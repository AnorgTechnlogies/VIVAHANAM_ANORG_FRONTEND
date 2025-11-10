import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const DiamondDashboard = () => {
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
  const [newMessage, setNewMessage] = useState("");
  const [selectedMatch, setSelectedMatch] = useState(null);
  const navigate = useNavigate();

  // Initialize all data
  useEffect(() => {
    // Mock user data
    const userData = {
      id: 1,
      name: "Rohan Mehra",
      email: "rohan.mehra@example.com",
      phone: "+1 (555) 123-4567",
      location: "New York, USA",
      dob: "1992-05-15",
      gender: "Male",
      subscription: {
        plan: "Diamond",
        status: "active",
        expires: "2024-12-31",
        price: "$2,999/year",
        features: [
          "Match Making",
          "Pre-Wedding Consultation",
          "Auspicious Date Discovery",
          "Priest Support",
          "Location Services"
        ]
      },
      profile: {
        completed: 95,
        verified: true,
        photos: 8,
        matches: 45,
        messages: 89,
        consultations: 5,
        locations: 3,
        bio: "Software engineer passionate about technology and traditional values. Looking for a life partner who shares similar interests in family and career.",
        education: "Master's in Computer Science",
        profession: "Senior Software Engineer",
        income: "$150,000",
        religion: "Hindu",
        caste: "Brahmin",
        motherTongue: "Hindi",
        height: "5'10\"",
        maritalStatus: "Never Married",
        horoscope: "Capricorn"
      }
    };
    setUser(userData);
    setProfileData(userData.profile);

    // Diamond profiles data - Added more profiles
    const diamondProfiles = [
      {
        id: 1,
        name: "Dr. Ananya Reddy",
        age: 29,
        location: "New York, NY USA",
        profession: "Cardiologist",
        description: "Harvard-educated cardiologist from a respected Telugu family. Enjoys classical dance and philanthropy.",
        image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=2070",
        interests: ["Classical Dance", "Medical Research", "Travel", "Yoga"],
        gender: "female",
        salary: 350000,
        religion: "Hindu",
        diet: "Vegetarian",
        language: "Telugu, English",
        education: "MD Cardiology - Harvard Medical School",
        family: "Business Family, US Settled",
        height: "5'6\"",
        horoscope: "Matched",
        lastActive: "2 hours ago"
      },
      {
        id: 2,
        name: "Rohan Malhotra",
        age: 32,
        location: "Silicon Valley, CA USA",
        profession: "Tech Entrepreneur",
        description: "IIT Delhi alumnus running a successful AI startup. Passionate about innovation and Indian classical music.",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2070",
        interests: ["AI Research", "Tabla", "Cricket", "Reading"],
        gender: "male",
        salary: 500000,
        religion: "Hindu",
        diet: "Vegetarian",
        language: "Hindi, English",
        education: "IIT Delhi - Computer Science",
        family: "Academic Family, Father Professor",
        height: "6'0\"",
        horoscope: "Available",
        lastActive: "1 day ago"
      },
      {
        id: 3,
        name: "Priya Iyer",
        age: 27,
        location: "Chicago, IL USA",
        profession: "Fashion Designer",
        description: "Parsons School of Design graduate with own fashion label. Blending traditional Indian wear with contemporary designs.",
        image: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?q=80&w=2070",
        interests: ["Fashion Design", "Painting", "Bharatanatyam", "Cooking"],
        gender: "female",
        salary: 200000,
        religion: "Hindu",
        diet: "Eggetarian",
        language: "Tamil, English, French",
        education: "Parsons School of Design",
        family: "Artistic Family, Mother Singer",
        height: "5'7\"",
        horoscope: "Matched",
        lastActive: "3 hours ago"
      },
      {
        id: 4,
        name: "Arjun Kapoor",
        age: 34,
        location: "Texas, USA",
        profession: "Neurosurgeon",
        description: "Leading neurosurgeon at Texas Medical Center. Seeks a partner who values family and cultural roots.",
        image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=2070",
        interests: ["Medical Innovation", "Golf", "Classical Music", "Philanthropy"],
        gender: "male",
        salary: 450000,
        religion: "Hindu",
        diet: "Non-Vegetarian",
        language: "Punjabi, English",
        education: "AIIMS Delhi - Neurosurgery",
        family: "Medical Family, Both Doctors",
        height: "5'11\"",
        horoscope: "Available",
        lastActive: "5 hours ago"
      },
      // New additional profiles
      {
        id: 5,
        name: "Dr. Sneha Patel",
        age: 31,
        location: "Boston, MA USA",
        profession: "Research Scientist",
        description: "MIT graduate researching renewable energy. Passionate about environmental sustainability and classical music.",
        image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?q=80&w=2070",
        interests: ["Research", "Classical Music", "Hiking", "Yoga"],
        gender: "female",
        salary: 180000,
        religion: "Hindu",
        diet: "Vegetarian",
        language: "Gujarati, English",
        education: "PhD - MIT",
        family: "Academic Family",
        height: "5'5\"",
        horoscope: "Available",
        lastActive: "6 hours ago"
      },
      {
        id: 6,
        name: "Vikram Singh",
        age: 33,
        location: "Seattle, WA USA",
        profession: "Software Architect",
        description: "Microsoft lead architect with passion for technology and Indian classical arts. Looking for a meaningful connection.",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070",
        interests: ["Technology", "Sitar", "Travel", "Photography"],
        gender: "male",
        salary: 280000,
        religion: "Sikh",
        diet: "Vegetarian",
        language: "Punjabi, English",
        education: "IIT Bombay - Computer Science",
        family: "Business Family",
        height: "5'11\"",
        horoscope: "Matched",
        lastActive: "1 hour ago"
      },
      {
        id: 7,
        name: "Aditi Sharma",
        age: 28,
        location: "Los Angeles, CA USA",
        profession: "Investment Banker",
        description: "Goldman Sachs VP balancing corporate success with spiritual growth. Enjoys volunteering and dance.",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070",
        interests: ["Finance", "Kathak", "Philanthropy", "Reading"],
        gender: "female",
        salary: 320000,
        religion: "Hindu",
        diet: "Vegetarian",
        language: "Hindi, English",
        education: "Wharton School of Business",
        family: "Banking Family",
        height: "5'4\"",
        horoscope: "Available",
        lastActive: "4 hours ago"
      },
      {
        id: 8,
        name: "Rahul Joshi",
        age: 35,
        location: "Austin, TX USA",
        profession: "Biotech Entrepreneur",
        description: "Stanford graduate revolutionizing healthcare through biotech innovations. Values family traditions.",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=2070",
        interests: ["Biotech", "Cricket", "Classical Music", "Travel"],
        gender: "male",
        salary: 420000,
        religion: "Hindu",
        diet: "Non-Vegetarian",
        language: "Marathi, English",
        education: "Stanford University",
        family: "Medical Family",
        height: "6'1\"",
        horoscope: "Available",
        lastActive: "2 days ago"
      },
      {
        id: 9,
        name: "Neha Gupta",
        age: 30,
        location: "San Francisco, CA USA",
        profession: "Product Manager",
        description: "Google product manager passionate about creating meaningful technology. Enjoys painting and hiking.",
        image: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?q=80&w=2067",
        interests: ["Technology", "Painting", "Hiking", "Cooking"],
        gender: "female",
        salary: 240000,
        religion: "Hindu",
        diet: "Vegetarian",
        language: "Hindi, English",
        education: "Carnegie Mellon University",
        family: "IT Professionals",
        height: "5'6\"",
        horoscope: "Matched",
        lastActive: "8 hours ago"
      },
      {
        id: 10,
        name: "Amit Verma",
        age: 36,
        location: "Miami, FL USA",
        profession: "Hotel Chain Owner",
        description: "Successful entrepreneur with luxury hotel chain. Believes in balancing modern business with traditional values.",
        image: "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?q=80&w=2070",
        interests: ["Business", "Travel", "Classical Music", "Golf"],
        gender: "male",
        salary: 550000,
        religion: "Hindu",
        diet: "Non-Vegetarian",
        language: "Hindi, English, Spanish",
        education: "Hotel Management - Switzerland",
        family: "Business Family",
        height: "5'10\"",
        horoscope: "Available",
        lastActive: "3 hours ago"
      }
    ];
    setMatches(diamondProfiles);

    // Mock messages data
    const initialMessages = [
      {
        id: 1,
        matchId: 1,
        name: "Dr. Ananya Reddy",
        message: "Hi Rohan! I loved your profile. Would you like to chat?",
        time: "10:30 AM",
        unread: true,
        avatar: "👩‍⚕️",
        type: "received"
      },
      {
        id: 2,
        matchId: 1,
        name: "You",
        message: "Hi Ananya! Thank you for your message. I'd love to learn more about you.",
        time: "10:35 AM",
        unread: false,
        avatar: "👤",
        type: "sent"
      },
      {
        id: 3,
        matchId: 3,
        name: "Priya Iyer",
        message: "Thank you for accepting my connection request!",
        time: "Yesterday",
        unread: false,
        avatar: "🎨",
        type: "received"
      }
    ];
    setMessages(initialMessages);

    // Mock consultations
    setConsultations([
      {
        id: 1,
        date: "2024-02-15",
        time: "14:00",
        consultant: "Dr. Sharma",
        type: "Relationship Counseling",
        status: "completed"
      },
      {
        id: 2,
        date: "2024-02-20",
        time: "11:00",
        consultant: "Ms. Patel",
        type: "Family Integration",
        status: "scheduled"
      }
    ]);

    // Mock astrology data
    setAstrologyData({
      horoscope: "Capricorn",
      compatibility: [
        { sign: "Taurus", score: 92 },
        { sign: "Virgo", score: 88 },
        { sign: "Pisces", score: 85 }
      ],
      auspiciousDates: [
        { date: "2024-03-15", occasion: "Engagement", significance: "Very Auspicious" },
        { date: "2024-04-20", occasion: "Wedding", significance: "Highly Favorable" }
      ]
    });

    // Mock priest services
    setPriestServices([
      {
        id: 1,
        name: "Pandit Sharma",
        specialization: "Vedic Ceremonies",
        experience: "15 years",
        languages: ["Hindi", "Sanskrit", "English"],
        availability: "Available"
      },
      {
        id: 2,
        name: "Pandit Rao",
        specialization: "South Indian Rituals",
        experience: "12 years",
        languages: ["Telugu", "Sanskrit", "English"],
        availability: "Available"
      }
    ]);

    // Mock venues
    setVenues([
      {
        id: 1,
        name: "Grand Palace Banquet",
        location: "New York, NY",
        capacity: 300,
        price: "$5,000 - $15,000",
        type: "Luxury Banquet",
        image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=2098",
        amenities: ["Parking", "Catering", "Decoration", "Audio-Visual"]
      },
      {
        id: 2,
        name: "Royal Garden Resort",
        location: "New Jersey",
        capacity: 250,
        price: "$3,000 - $10,000",
        type: "Outdoor Garden",
        image: "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?q=80&w=2070",
        amenities: ["Garden", "Pool", "Catering", "Photography"]
      }
    ]);

    // Mock settings
    setSettings({
      emailNotifications: true,
      smsNotifications: false,
      profileVisibility: "all",
      matchSuggestions: true,
      privacyMode: false
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
    navigate("/platinum");
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
    setNewMessage("");
    alert(`Message sent to match ${matchId}!`);
  };

  const scheduleConsultation = () => {
    const date = prompt("Enter preferred date for consultation (YYYY-MM-DD):");
    const time = prompt("Enter preferred time (HH:MM):");
    
    if (date && time) {
      const newConsultation = {
        id: consultations.length + 1,
        date,
        time,
        consultant: "To be assigned",
        type: "New Consultation",
        status: "pending"
      };
      
      setConsultations(prev => [...prev, newConsultation]);
      alert(`Consultation scheduled for ${date} at ${time}! Our expert will contact you.`);
    }
  };

  const bookPriest = (priestId) => {
    const priest = priestServices.find(p => p.id === priestId);
    if (priest) {
      alert(`Booking request submitted for ${priest.name}! We'll connect you within 24 hours.`);
    }
  };

  const findVenues = () => {
    alert("Venue search initiated! Our team will share suitable options within 24 hours.");
  };

  const scheduleVenueViewing = (venueId) => {
    const venue = venues.find(v => v.id === venueId);
    if (venue) {
      const date = prompt(`Enter preferred date for viewing ${venue.name} (YYYY-MM-DD):`);
      if (date) {
        alert(`Viewing scheduled for ${venue.name} on ${date}! Our representative will contact you.`);
      }
    }
  };

  const checkCompatibility = (matchId) => {
    const match = matches.find(m => m.id === matchId);
    if (match) {
      alert(`Detailed compatibility report for ${match.name}:\n\n- Horoscope Match: 92%\n- Personality: 88%\n- Values: 95%\n- Lifestyle: 85%`);
    }
  };

  const handleContactMatchmaker = () => {
    alert("Connecting you with our premium matchmaker... You will receive a call within 2 hours.");
  };

  const saveProfileChanges = () => {
    alert("Profile changes saved successfully!");
  };

  const deleteAccount = () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      alert("Account deletion request submitted. Our team will contact you for confirmation.");
    }
  };

  const handleSendMessage = () => {
    if (selectedMatch && newMessage.trim()) {
      sendMessage(selectedMatch.id, newMessage);
    }
  };

  const getMessagesForMatch = (matchId) => {
    return messages.filter(msg => msg.matchId === matchId);
  };

  // New handler functions for astrology and priest services
  const handleAuspiciousDateDiscovery = () => {
    alert("Auspicious Date Discovery initiated! Our astrologers will analyze your birth charts and share favorable dates within 48 hours.");
  };

  const handleGetDetailedAnalysis = () => {
    alert("Detailed astrological analysis requested! Our expert astrologers will prepare a comprehensive compatibility report.");
  };

  const handleFindAuspiciousDates = () => {
    alert("Muhurta selection process started! We'll analyze planetary positions and share the most auspicious dates for your ceremonies.");
  };

  const handleFindAvailablePriests = () => {
    alert("Searching for available priests in your area... You'll receive a list of certified priests within 24 hours.");
  };

  const handleLearnAboutRituals = () => {
    alert("Ritual guidance session scheduled! Our priest will contact you to discuss wedding traditions and customs.");
  };

  const handleBrowseVenues = () => {
    alert("Venue browsing initiated! Our venue specialists will share curated options based on your preferences.");
  };

  const handleScheduleViewing = () => {
    alert("Venue viewing service requested! Our representative will contact you to schedule personalized venue tours.");
  };

  if (!user) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100">
      {/* Header */}
      <header className="bg-amber-900 shadow-sm border-b border-amber-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-amber-600 to-amber-800 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">D</span>
              </div>
              <h1 className="ml-3 text-xl font-bold text-white">Diamond Dashboard</h1>
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

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border border-amber-200 p-6">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-gradient-to-r from-amber-600 to-amber-800 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl text-white">💎</span>
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
                    { id: "matches", name: "Premium Matches", icon: "💎", count: matches.length },
                    { id: "consultation", name: "Consultation", icon: "🎓", count: consultations.filter(c => c.status === 'scheduled').length },
                    { id: "astrology", name: "Astrology", icon: "🔮" },
                    { id: "priest", name: "Priest Support", icon: "🙏" },
                    { id: "locations", name: "Venue Locations", icon: "🏛️" },
                    { id: "messages", name: "Messages", icon: "💬", count: messages.filter(m => m.unread).length },
                    { id: "profile", name: "My Profile", icon: "👤" },
                    { id: "settings", name: "Settings", icon: "⚙️" }
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setSelectedMatch(null);
                      }}
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
                  Upgrade to Platinum
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
                    <div className="bg-white rounded-lg shadow-sm border border-amber-200 p-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <span className="text-xl">💎</span>
                        </div>
                        <div className="ml-3">
                          <p className="text-xs font-medium text-gray-600">Premium Matches</p>
                          <p className="text-lg font-bold text-gray-900">{user.profile.matches}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-amber-200 p-4">
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

                    <div className="bg-white rounded-lg shadow-sm border border-amber-200 p-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <span className="text-xl">🏛️</span>
                        </div>
                        <div className="ml-3">
                          <p className="text-xs font-medium text-gray-600">Venue Options</p>
                          <p className="text-lg font-bold text-gray-900">{user.profile.locations}</p>
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
                    <h3 className="text-md font-bold text-gray-900 mb-3">Find Your Perfect Match</h3>
                    
                    {/* Search Bar */}
                    <div className="flex flex-col md:flex-row gap-3 mb-4">
                      <div className="flex-1">
                        <input
                          type="text"
                          placeholder="Search diamond members by name or description..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full px-3 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                      <button className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors font-semibold text-sm">
                        Search
                      </button>
                    </div>

                    {/* Filters */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 mb-4">
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

                  {/* Diamond Profiles Grid - Updated to show more profiles */}
                  <div className="bg-white rounded-lg shadow-sm border border-amber-200 p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-md font-bold text-gray-900">Featured Diamond Profiles</h3>
                      <button 
                        onClick={() => setActiveTab("matches")}
                        className="text-amber-600 hover:text-amber-700 font-medium text-sm"
                      >
                        View All →
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {filteredProfiles.slice(0, 12).map((profile) => ( // Increased from 8 to 12
                        <div
                          key={profile.id}
                          className="group relative bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-amber-200 hover:border-amber-300 cursor-pointer"
                          onClick={() => {
                            setActiveTab("matches");
                            setSelectedMatch(profile);
                          }}
                        >
                          {/* Diamond Badge */}
                          <div className="absolute top-2 right-2 z-20">
                            <div className="w-6 h-6 bg-gradient-to-r from-amber-600 to-amber-800 rounded-full flex items-center justify-center shadow-sm">
                              <span className="text-white text-xs">💎</span>
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

                            {/* Quick Info */}
                            <div className="flex justify-between items-center text-xs mb-2">
                              <span className="text-gray-500">Education:</span>
                              <span className="text-gray-800 font-medium truncate ml-1 max-w-[60%]">
                                {profile.education.split(' - ')[0]}
                              </span>
                            </div>

                            {/* Interests */}
                            <div className="flex flex-wrap gap-1 mb-3">
                              {profile.interests.slice(0, 2).map((interest, idx) => (
                                <span key={idx} className="px-2 py-1 bg-amber-50 text-amber-700 rounded-full text-xs">
                                  {interest}
                                </span>
                              ))}
                              {profile.interests.length > 2 && (
                                <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs">
                                  +{profile.interests.length - 2}
                                </span>
                              )}
                            </div>

                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleContactMatchmaker();
                              }}
                              className="w-full py-2 bg-gradient-to-r from-amber-600 to-amber-800 text-white font-semibold rounded-lg hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-200 text-xs"
                            >
                              Connect
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

                    <div className="text-center mt-4">
                      <button className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors font-semibold text-sm">
                        Load More Profiles
                      </button>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="bg-white rounded-lg shadow-sm border border-amber-200 p-4">
                    <h3 className="text-md font-bold text-gray-900 mb-3">Your Diamond Features</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {user.subscription.features.map((feature, index) => (
                        <div key={index} className="flex items-center p-2 bg-amber-50 rounded-lg border border-amber-200">
                          <span className="text-green-500 mr-2">✓</span>
                          <span className="text-gray-700 text-sm font-medium">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="bg-white rounded-lg shadow-sm border border-amber-200 p-4">
                    <h3 className="text-md font-bold text-gray-900 mb-3">Quick Actions</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <button 
                        onClick={() => setActiveTab("matches")}
                        className="p-3 bg-amber-50 rounded-lg text-center hover:bg-amber-100 transition-colors border border-amber-200"
                      >
                        <span className="text-lg block mb-1">💎</span>
                        <span className="text-xs font-medium text-gray-700">Premium Matches</span>
                      </button>
                      <button 
                        onClick={() => setActiveTab("consultation")}
                        className="p-3 bg-amber-50 rounded-lg text-center hover:bg-amber-100 transition-colors border border-amber-200"
                      >
                        <span className="text-lg block mb-1">🎓</span>
                        <span className="text-xs font-medium text-gray-700">Consultation</span>
                      </button>
                      <button 
                        onClick={() => setActiveTab("astrology")}
                        className="p-3 bg-amber-50 rounded-lg text-center hover:bg-amber-100 transition-colors border border-amber-200"
                      >
                        <span className="text-lg block mb-1">🔮</span>
                        <span className="text-xs font-medium text-gray-700">Astrology</span>
                      </button>
                      <button 
                        onClick={() => setActiveTab("locations")}
                        className="p-3 bg-amber-50 rounded-lg text-center hover:bg-amber-100 transition-colors border border-amber-200"
                      >
                        <span className="text-lg block mb-1">🏛️</span>
                        <span className="text-xs font-medium text-gray-700">Venues</span>
                      </button>
                    </div>
                  </div>

                  {/* Welcome Message */}
                  <div className="bg-gradient-to-r from-amber-600 to-amber-800 rounded-lg shadow-sm p-4 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-bold mb-1">Welcome to Diamond! 💎</h3>
                        <p className="opacity-90 text-sm">Creating authentic holy alliances with your perfect soulmate</p>
                      </div>
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                        <span className="text-xl">💑</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Matches Tab */}
              {activeTab === "matches" && (
                <div className="space-y-6">
                  <div className="bg-white rounded-lg shadow-sm border border-amber-200 p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-bold text-gray-900">Diamond Exclusive Profiles</h3>
                      <div className="flex gap-2">
                        <button className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors text-sm">
                          Refresh Matches
                        </button>
                        <button 
                          onClick={handleContactMatchmaker}
                          className="bg-amber-800 text-white px-4 py-2 rounded-lg hover:bg-amber-900 transition-colors text-sm"
                        >
                          Contact Matchmaker
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredProfiles.map((profile) => (
                        <div
                          key={profile.id}
                          className={`group relative bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border-2 cursor-pointer ${
                            selectedMatch?.id === profile.id 
                              ? 'border-amber-500 bg-amber-50' 
                              : 'border-amber-200 hover:border-amber-300'
                          }`}
                          onClick={() => setSelectedMatch(profile)}
                        >
                          {/* Diamond Badge */}
                          <div className="absolute top-2 right-2 z-20">
                            <div className="w-6 h-6 bg-gradient-to-r from-amber-600 to-amber-800 rounded-full flex items-center justify-center shadow-sm">
                              <span className="text-white text-xs">💎</span>
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
                                  {profile.education.split(' - ')[0]}
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

                            {/* Interests */}
                            <div className="flex flex-wrap gap-1 mb-4">
                              {profile.interests.map((interest, idx) => (
                                <span key={idx} className="px-2 py-1 bg-amber-50 text-amber-700 rounded-full text-xs">
                                  {interest}
                                </span>
                              ))}
                            </div>

                            <div className="flex gap-2">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveTab("messages");
                                  setSelectedMatch(profile);
                                }}
                                className="flex-1 bg-amber-600 text-white py-2 rounded-lg hover:bg-amber-700 transition-colors text-sm"
                              >
                                Message
                              </button>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  checkCompatibility(profile.id);
                                }}
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

              {/* Messages Tab */}
              {activeTab === "messages" && (
                <div className="bg-white rounded-lg shadow-sm border border-amber-200 p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-gray-900">Messages</h3>
                    <button 
                      onClick={() => setSelectedMatch(null)}
                      className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors text-sm"
                    >
                      Back to All Messages
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Conversations List */}
                    <div className="lg:col-span-1">
                      <div className="space-y-3">
                        {matches.map((match) => {
                          const matchMessages = getMessagesForMatch(match.id);
                          const lastMessage = matchMessages[matchMessages.length - 1];
                          const unreadCount = matchMessages.filter(m => m.unread && m.type === 'received').length;
                          
                          return (
                            <div
                              key={match.id}
                              className={`p-3 rounded-lg border cursor-pointer transition-all ${
                                selectedMatch?.id === match.id
                                  ? 'bg-amber-50 border-amber-300'
                                  : 'bg-white border-amber-200 hover:bg-amber-50'
                              }`}
                              onClick={() => setSelectedMatch(match)}
                            >
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-white">
                                  {match.name.charAt(0)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex justify-between items-start">
                                    <h4 className="font-semibold text-gray-900 truncate">{match.name}</h4>
                                    {unreadCount > 0 && (
                                      <span className="bg-amber-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                        {unreadCount}
                                      </span>
                                    )}
                                  </div>
                                  {lastMessage && (
                                    <p className="text-gray-600 text-sm truncate">{lastMessage.message}</p>
                                  )}
                                  <p className="text-gray-400 text-xs">{lastMessage?.time}</p>
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
                        <div className="border border-amber-200 rounded-lg h-96 flex flex-col">
                          {/* Chat Header */}
                          <div className="bg-amber-50 px-4 py-3 border-b border-amber-200 rounded-t-lg">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-white text-sm">
                                {selectedMatch.name.charAt(0)}
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900">{selectedMatch.name}</h4>
                                <p className="text-amber-600 text-xs">{selectedMatch.profession}</p>
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
                                      ? 'bg-amber-600 text-white rounded-br-none'
                                      : 'bg-amber-100 text-gray-900 rounded-bl-none'
                                  }`}
                                >
                                  <p className="text-sm">{message.message}</p>
                                  <p className={`text-xs mt-1 ${message.type === 'sent' ? 'text-amber-200' : 'text-gray-500'}`}>
                                    {message.time}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Message Input */}
                          <div className="border-t border-amber-200 p-4">
                            <div className="flex space-x-2">
                              <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Type your message..."
                                className="flex-1 px-3 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                              />
                              <button
                                onClick={handleSendMessage}
                                disabled={!newMessage.trim()}
                                className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 disabled:bg-amber-400 disabled:cursor-not-allowed transition-colors"
                              >
                                Send
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="h-96 flex items-center justify-center border border-amber-200 rounded-lg">
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

              {/* Consultation Tab */}
              {activeTab === "consultation" && (
                <div className="bg-white rounded-lg shadow-sm border border-amber-200 p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-gray-900">Pre-Wedding Consultation</h3>
                    <button 
                      onClick={scheduleConsultation}
                      className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors"
                    >
                      Schedule New Consultation
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                      <h4 className="font-semibold text-gray-900 mb-2">Expert Consultation</h4>
                      <p className="text-gray-600 text-sm mb-4">Book personalized sessions with our relationship experts and marriage counselors</p>
                      <ul className="text-gray-600 text-sm space-y-2 mb-4">
                        <li>• Personalized relationship guidance</li>
                        <li>• Family integration strategies</li>
                        <li>• Cultural tradition advice</li>
                        <li>• Conflict resolution techniques</li>
                      </ul>
                    </div>
                    
                    <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                      <h4 className="font-semibold text-gray-900 mb-2">Consultation Benefits</h4>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <span className="text-green-500 mr-2">✓</span>
                          <span className="text-sm">24/7 Expert Support</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-green-500 mr-2">✓</span>
                          <span className="text-sm">Personalized Advice</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-green-500 mr-2">✓</span>
                          <span className="text-sm">Cultural Sensitivity</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-green-500 mr-2">✓</span>
                          <span className="text-sm">Confidential Sessions</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <h4 className="font-semibold text-gray-900 mb-4">Your Consultation Sessions</h4>
                  <div className="space-y-4">
                    {consultations.map((consultation) => (
                      <div key={consultation.id} className="p-4 bg-white border border-amber-200 rounded-lg">
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
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {consultation.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Astrology Tab */}
              {activeTab === "astrology" && (
                <div className="bg-white rounded-lg shadow-sm border border-amber-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-6">Auspicious Date Discovery</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                      <h4 className="font-semibold text-gray-900 mb-2">Your Horoscope: {astrologyData.horoscope}</h4>
                      <p className="text-gray-600 text-sm mb-4">Get detailed astrological compatibility analysis with potential matches</p>
                      <button 
                        onClick={handleGetDetailedAnalysis}
                        className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors"
                      >
                        Get Detailed Analysis
                      </button>
                    </div>
                    
                    <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                      <h4 className="font-semibold text-gray-900 mb-2">Muhurta Selection</h4>
                      <p className="text-gray-600 text-sm mb-4">Find perfect dates for your wedding ceremonies based on Vedic astrology</p>
                      <button 
                        onClick={handleFindAuspiciousDates}
                        className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors"
                      >
                        Find Auspicious Dates
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
                      <h4 className="font-semibold text-gray-900 mb-4">Auspicious Dates</h4>
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

                  {/* Auspicious Date Discovery Button */}
                  <div className="mt-8 text-center">
                    <button 
                      onClick={handleAuspiciousDateDiscovery}
                      className="bg-gradient-to-r from-amber-600 to-amber-800 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all text-lg"
                    >
                      Start Auspicious Date Discovery
                    </button>
                  </div>
                </div>
              )}

              {/* Priest Support Tab */}
              {activeTab === "priest" && (
                <div className="bg-white rounded-lg shadow-sm border border-amber-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-6">Priest Support Services</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                      <h4 className="font-semibold text-gray-900 mb-2">Book a Priest</h4>
                      <p className="text-gray-600 text-sm mb-4">Connect with certified priests for your wedding ceremonies and rituals</p>
                      <button 
                        onClick={handleFindAvailablePriests}
                        className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors"
                      >
                        Find Available Priests
                      </button>
                    </div>
                    
                    <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                      <h4 className="font-semibold text-gray-900 mb-2">Ritual Guidance</h4>
                      <p className="text-gray-600 text-sm mb-4">Get expert guidance on wedding rituals, traditions, and customs</p>
                      <button 
                        onClick={handleLearnAboutRituals}
                        className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors"
                      >
                        Learn About Rituals
                      </button>
                    </div>
                  </div>

                  <h4 className="font-semibold text-gray-900 mb-4">Available Priests</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {priestServices.map((priest) => (
                      <div key={priest.id} className="p-4 bg-white border border-amber-200 rounded-lg">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h5 className="font-semibold text-gray-900">{priest.name}</h5>
                            <p className="text-sm text-amber-600">{priest.specialization}</p>
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
                          className="w-full mt-3 bg-amber-600 text-white py-2 rounded-lg hover:bg-amber-700 transition-colors"
                        >
                          Book Priest
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Locations Tab */}
              {activeTab === "locations" && (
                <div className="bg-white rounded-lg shadow-sm border border-amber-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-6">Venue Location Services</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                      <h4 className="font-semibold text-gray-900 mb-2">Available Venues</h4>
                      <p className="text-gray-600 text-sm mb-4">Browse and select from premium wedding venues for your holy alliance</p>
                      <button 
                        onClick={handleBrowseVenues}
                        className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors"
                      >
                        Browse Venues
                      </button>
                    </div>
                    
                    <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                      <h4 className="font-semibold text-gray-900 mb-2">Venue Consultation</h4>
                      <p className="text-gray-600 text-sm mb-4">Schedule a venue viewing with our experts and get personalized recommendations</p>
                      <button 
                        onClick={handleScheduleViewing}
                        className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors"
                      >
                        Schedule Viewing
                      </button>
                    </div>
                  </div>

                  <h4 className="font-semibold text-gray-900 mb-4">Featured Venues</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {venues.map((venue) => (
                      <div key={venue.id} className="bg-white border border-amber-200 rounded-lg overflow-hidden">
                        <div className="relative h-48">
                          <img
                            src={venue.image}
                            alt={venue.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-3 right-3">
                            <span className="bg-amber-600 text-white px-2 py-1 rounded-full text-xs">
                              Diamond Partner
                            </span>
                          </div>
                        </div>
                        <div className="p-4">
                          <h5 className="font-semibold text-gray-900 mb-2">{venue.name}</h5>
                          <p className="text-sm text-gray-600 mb-2">{venue.location} • Capacity: {venue.capacity} guests</p>
                          <p className="text-amber-700 font-bold mb-3">{venue.price}</p>
                          <div className="flex flex-wrap gap-1 mb-3">
                            {venue.amenities.map((amenity, index) => (
                              <span key={index} className="px-2 py-1 bg-amber-50 text-amber-700 rounded-full text-xs">
                                {amenity}
                              </span>
                            ))}
                          </div>
                          <button 
                            onClick={() => scheduleVenueViewing(venue.id)}
                            className="w-full bg-amber-600 text-white py-2 rounded-lg hover:bg-amber-700 transition-colors"
                          >
                            Schedule Viewing
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Profile Tab */}
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
                              placeholder="Tell us about yourself, your interests, and what you're looking for in a partner..."
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

              {/* Settings Tab */}
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
                            <p className="text-sm text-gray-600">Receive updates and match alerts via email</p>
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
                            <p className="text-sm text-gray-600">Receive daily match recommendations</p>
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
                            <option value="none">Private (Matchmaker Only)</option>
                          </select>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-200">
                          <div>
                            <p className="font-medium text-gray-900">Privacy Mode</p>
                            <p className="text-sm text-gray-600">Hide your online status and activity</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings.privacyMode}
                              onChange={(e) => handleSettingChange('privacyMode', e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                          </label>
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

export default DiamondDashboard;