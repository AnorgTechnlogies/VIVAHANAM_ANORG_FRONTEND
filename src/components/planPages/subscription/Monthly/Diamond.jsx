import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Diamond = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({ 
    ageMin: 25, 
    ageMax: 35, 
    location: "",
    minSalary: "",
    maxSalary: "",
    religion: "",
    diet: "",
    hobbies: "",
    language: ""
  });
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Exclusive Diamond Member Profiles - Full details visible
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
      horoscope: "Matched"
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
      horoscope: "Available"
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
      horoscope: "Matched"
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
      horoscope: "Available"
    },
    {
      id: 5,
      name: "Meera Patel",
      age: 26,
      location: "New Jersey, USA",
      profession: "Investment Banker",
      description: "Wharton graduate working at Goldman Sachs. Balanced professional success with spiritual growth.",
      image: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?q=80&w=2070",
      interests: ["Finance", "Meditation", "Travel", "Charity Work"],
      gender: "female",
      salary: 300000,
      religion: "Hindu",
      diet: "Jain",
      language: "Gujarati, English",
      education: "Wharton School - MBA",
      family: "Business Family, NRIs",
      height: "5'5\"",
      horoscope: "Matched"
    },
    {
      id: 6,
      name: "Vikram Singh",
      age: 31,
      location: "Seattle, WA USA",
      profession: "Microsoft Director",
      description: "IIT Bombay and Stanford graduate leading AI projects at Microsoft. Enjoys adventure sports and poetry.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070",
      interests: ["AI Development", "Trekking", "Poetry", "Photography"],
      gender: "male",
      salary: 400000,
      religion: "Sikh",
      diet: "Non-Vegetarian",
      language: "Punjabi, English, Spanish",
      education: "IIT Bombay + Stanford MS",
      family: "Army Background, Settled in US",
      height: "6'1\"",
      horoscope: "Available"
    }
  ];

  // Filter profiles based on search and filters
  const filteredProfiles = diamondProfiles.filter((profile) => {
    const matchesSearch = profile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         profile.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAge = profile.age >= filters.ageMin && profile.age <= filters.ageMax;
    const matchesLocation = !filters.location || profile.location.toLowerCase().includes(filters.location.toLowerCase());
    const minSalaryFilter = filters.minSalary ? parseInt(filters.minSalary) : 0;
    const maxSalaryFilter = filters.maxSalary ? parseInt(filters.maxSalary) : Infinity;
    const matchesSalary = profile.salary >= minSalaryFilter && profile.salary <= maxSalaryFilter;
    const matchesReligion = !filters.religion || profile.religion === filters.religion;
    const matchesDiet = !filters.diet || profile.diet === filters.diet;
    const matchesHobbies = !filters.hobbies || profile.interests.some(interest => 
      interest.toLowerCase().includes(filters.hobbies.toLowerCase())
    );
    const matchesLanguage = !filters.language || profile.language.toLowerCase().includes(filters.language.toLowerCase());
    
    return matchesSearch && matchesAge && matchesLocation && matchesSalary && 
           matchesReligion && matchesDiet && matchesHobbies && matchesLanguage;
  });

  const handleProfileClick = (profileId) => {
    console.log(`Viewing diamond profile: ${profileId}`);
    // Navigate to detailed diamond profile page
  };

  const handleContactMatchmaker = () => {
    alert("Connecting you with our premium matchmaker...");
  };

  return (
    <>
      {/* Diamond Member Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 lg:px-12 py-12 sm:py-16 md:py-20 lg:py-24 font-sans overflow-hidden bg-gradient-to-br from-pink-50 via-amber-50 to-cyan-50">
        {/* Animated Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-amber-300/30 via-transparent to-amber-300/30 animate-pulse" />

        {/* Floating Diamond Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-cyan-400/40 rounded-full animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.5}s`,
              }}
            />
          ))}
        </div>

        <div
          className={`relative z-10 flex flex-col items-center w-full max-w-4xl sm:max-w-5xl md:max-w-6xl text-center gap-3 sm:gap-4 md:gap-5 lg:gap-8 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {/* Diamond Badge */}
          <div className="flex justify-center items-center mb-4">
            <div className="w-20 h-20 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center shadow-2xl border-4 border-white">
              <span className="text-3xl">💎</span>
            </div>
          </div>

          {/* Title section */}
          <div className="flex flex-col items-center gap-1 sm:gap-2 md:gap-3 lg:gap-4">
            <h1
              className={`m-0 text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-red-700 font-bold leading-tight sm:leading-snug transition-all duration-700 delay-300 ${
                isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
              }`}
              style={{ fontFamily: "serif" }}
            >
              Diamond Member Exclusive
            </h1>
            <h3
              className={`m-0 text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold leading-tight sm:leading-snug transition-all duration-700 delay-500 p-0 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-5"
              }`}
              style={{ color: "#000000ff" }}
            >
              Premium Verified Profiles - Full Access
            </h3>
          </div>

          {/* Welcome Message */}
          <p
            className={`text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-black-800 leading-relaxed max-w-xs sm:max-w-sm md:max-w-md lg:max-w-2xl xl:max-w-3xl 2xl:max-w-4xl mt-2 font-semibold px-2 sm:px-0 transition-all duration-700 delay-700 ${
              isVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            Welcome to your Diamond membership! Access exclusive high-quality matches with complete profile visibility.
          </p>

          {/* Diamond Features */}
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <span className="px-4 py-2 bg-cyan-100 text-cyan-800 rounded-full font-semibold border border-cyan-300">✓ Match Making</span>
            <span className="px-4 py-2 bg-cyan-100 text-cyan-800 rounded-full font-semibold border border-cyan-300">✓ Pre-Wedding Consultation</span>
            <span className="px-4 py-2 bg-cyan-100 text-cyan-800 rounded-full font-semibold border border-cyan-300">✓ Auspicious Date Discovery</span>
            <span className="px-4 py-2 bg-cyan-100 text-cyan-800 rounded-full font-semibold border border-cyan-300">✓ Priest Support</span>
            <span className="px-4 py-2 bg-cyan-100 text-cyan-800 rounded-full font-semibold border border-cyan-300">✓ Location Services</span>
          </div>
        </div>
      </section>

      {/* Search and Filters Section */}
      <section className="relative w-full py-12 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-amber-100">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-amber-800 mb-4">
              Diamond Exclusive Profiles
            </h2>
            <p className="text-xl text-amber-700 max-w-3xl mx-auto">
              Full access to premium verified profiles with complete details
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <input
              type="text"
              placeholder="Search diamond members by name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-4 text-lg bg-white border-2 border-amber-300 rounded-2xl focus:outline-none focus:border-amber-500 shadow-lg transition-all"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 justify-center mb-12 flex-wrap">
            <select
              value={filters.ageMin}
              onChange={(e) => setFilters({ ...filters, ageMin: parseInt(e.target.value) })}
              className="px-4 py-3 bg-white border-2 border-amber-300 rounded-xl focus:outline-none focus:border-amber-500"
            >
              <option value={25}>Age Min: 25</option>
              <option value={28}>Age Min: 28</option>
              <option value={30}>Age Min: 30</option>
            </select>
            <select
              value={filters.ageMax}
              onChange={(e) => setFilters({ ...filters, ageMax: parseInt(e.target.value) })}
              className="px-4 py-3 bg-white border-2 border-amber-300 rounded-xl focus:outline-none focus:border-amber-500"
            >
              <option value={35}>Age Max: 35</option>
              <option value={40}>Age Max: 40</option>
              <option value={45}>Age Max: 45</option>
            </select>
            <input
              type="text"
              placeholder="Location (e.g., New York)"
              value={filters.location}
              onChange={(e) => setFilters({ ...filters, location: e.target.value })}
              className="px-4 py-3 bg-white border-2 border-amber-300 rounded-xl focus:outline-none focus:border-amber-500"
            />
            <input
              type="number"
              placeholder="Min Salary ($)"
              value={filters.minSalary}
              onChange={(e) => setFilters({ ...filters, minSalary: e.target.value })}
              className="px-4 py-3 bg-white border-2 border-amber-300 rounded-xl focus:outline-none focus:border-amber-500 w-32"
            />
            <select
              value={filters.religion}
              onChange={(e) => setFilters({ ...filters, religion: e.target.value })}
              className="px-4 py-3 bg-white border-2 border-amber-300 rounded-xl focus:outline-none focus:border-amber-500"
            >
              <option value="">Any Religion</option>
              <option value="Hindu">Hindu</option>
              <option value="Sikh">Sikh</option>
              <option value="Christian">Christian</option>
            </select>
            <select
              value={filters.diet}
              onChange={(e) => setFilters({ ...filters, diet: e.target.value })}
              className="px-4 py-3 bg-white border-2 border-amber-300 rounded-xl focus:outline-none focus:border-amber-500"
            >
              <option value="">Any Diet</option>
              <option value="Vegetarian">Vegetarian</option>
              <option value="Non-Vegetarian">Non-Vegetarian</option>
            </select>
          </div>
        </div>
      </section>

      {/* Diamond Profiles Grid - Full Visibility */}
      <section className="relative w-full py-12 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredProfiles.map((profile) => (
              <div
                key={profile.id}
                className="group relative bg-white rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-2 border-4 border-cyan-300 hover:border-cyan-500 cursor-pointer"
                onClick={() => handleProfileClick(profile.id)}
              >
                {/* Diamond Badge on Profile */}
                <div className="absolute top-4 right-4 z-20">
                  <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                    <span className="text-white text-sm">💎</span>
                  </div>
                </div>

                {/* Profile Image - Full Visibility for Diamond Members */}
                <div className="relative h-72 sm:h-80 overflow-hidden">
                  <img
                    src={profile.image}
                    alt={profile.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="text-2xl font-bold mb-1">{profile.name}</h3>
                    <p className="text-amber-200 font-semibold">{profile.age} | {profile.location}</p>
                  </div>
                </div>

                {/* Profile Content - Full Details Visible */}
                <div className="p-6">
                  <div className="mb-4">
                    <p className="text-red-700 font-bold text-lg mb-2">{profile.profession}</p>
                    <p className="text-gray-700 mb-3">{profile.description}</p>
                  </div>

                  {/* Detailed Information */}
                  <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                    <div>
                      <span className="font-semibold text-gray-600">Education:</span>
                      <p className="text-gray-800">{profile.education}</p>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-600">Family:</span>
                      <p className="text-gray-800">{profile.family}</p>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-600">Salary:</span>
                      <p className="text-green-700 font-bold">${profile.salary.toLocaleString()}/year</p>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-600">Horoscope:</span>
                      <p className="text-blue-700 font-semibold">{profile.horoscope}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {profile.interests.map((interest, idx) => (
                      <span key={idx} className="px-3 py-1 bg-cyan-100 text-cyan-800 rounded-full text-sm font-medium">
                        {interest}
                      </span>
                    ))}
                  </div>

                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleContactMatchmaker();
                    }}
                    className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                  >
                    Contact Matchmaker
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredProfiles.length === 0 && (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">No diamond profiles found. Try adjusting your search criteria.</p>
            </div>
          )}

          {/* Premium Support */}
          <div className="text-center mt-12 p-8 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-2xl border-2 border-cyan-200">
            <h3 className="text-2xl font-bold text-cyan-800 mb-4">Diamond Member Exclusive Support</h3>
            <p className="text-gray-700 mb-6">Your personal matchmaker is available 24/7 to assist you</p>
            <button 
              onClick={handleContactMatchmaker}
              className="px-8 py-3 bg-gradient-to-r from-cyan-600 to-blue-700 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              Connect with Matchmaker
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Diamond;