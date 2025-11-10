import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Gold = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({ 
    ageMin: 25, 
    ageMax: 40, 
    location: "",
    minSalary: "",
    maxSalary: "",
    religion: "",
    diet: "",
    hobbies: ""
  });
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Gold Member Profiles - Enhanced access with basic details
  const goldProfiles = [
    {
      id: 1,
      name: "Neha Kapoor",
      age: 27,
      location: "Austin, TX USA",
      profession: "Software Engineer",
      description: "Google software engineer passionate about technology and Indian classical dance.",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070",
      interests: ["Coding", "Kathak", "Reading", "Travel"],
      gender: "female",
      salary: 180000,
      religion: "Hindu",
      diet: "Vegetarian",
      education: "MS Computer Science - UT Austin"
    },
    {
      id: 2,
      name: "Amit Joshi",
      age: 31,
      location: "Boston, MA USA",
      profession: "Data Scientist",
      description: "MIT graduate working in healthcare analytics. Enjoys hiking and photography.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070",
      interests: ["Data Science", "Hiking", "Photography", "Cooking"],
      gender: "male",
      salary: 160000,
      religion: "Hindu",
      diet: "Vegetarian",
      education: "MIT - Data Science"
    },
    {
      id: 3,
      name: "Sunita Rao",
      age: 29,
      location: "Seattle, WA USA",
      profession: "Product Manager",
      description: "Amazon product manager with passion for user experience and Indian classical music.",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?q=80&w=2070",
      interests: ["Product Management", "Classical Music", "Yoga", "Travel"],
      gender: "female",
      salary: 170000,
      religion: "Hindu",
      diet: "Eggetarian",
      education: "MBA - University of Washington"
    },
    {
      id: 4,
      name: "Rajiv Menon",
      age: 33,
      location: "Chicago, IL USA",
      profession: "Financial Analyst",
      description: "Investment analyst at major financial firm. Enjoys cricket and volunteering.",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=2070",
      interests: ["Finance", "Cricket", "Volunteering", "Movies"],
      gender: "male",
      salary: 140000,
      religion: "Hindu",
      diet: "Non-Vegetarian",
      education: "MBA Finance - Chicago Booth"
    }
  ];

  const filteredProfiles = goldProfiles.filter((profile) => {
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
    
    return matchesSearch && matchesAge && matchesLocation && matchesSalary && 
           matchesReligion && matchesDiet && matchesHobbies;
  });

  const handleProfileClick = (profileId) => {
    console.log(`Viewing gold profile: ${profileId}`);
  };

  const handleContactAdvisor = () => {
    alert("Connecting you with your Gold membership advisor...");
  };

  return (
    <>
      {/* Gold Member Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 lg:px-12 py-12 sm:py-16 md:py-20 lg:py-24 font-sans overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
        {/* Animated Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-amber-200/30 via-transparent to-yellow-200/30 animate-pulse" />

        {/* Floating Gold Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-amber-400/40 rounded-full animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.4}s`,
              }}
            />
          ))}
        </div>

        <div
          className={`relative z-10 flex flex-col items-center w-full max-w-4xl sm:max-w-5xl md:max-w-6xl text-center gap-3 sm:gap-4 md:gap-5 lg:gap-8 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {/* Gold Badge */}
          <div className="flex justify-center items-center mb-4">
            <div className="w-20 h-20 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full flex items-center justify-center shadow-2xl border-4 border-white">
              <span className="text-3xl">🥇</span>
            </div>
          </div>

          {/* Title section */}
          <div className="flex flex-col items-center gap-1 sm:gap-2 md:gap-3 lg:gap-4">
            <h1
              className={`m-0 text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-amber-800 font-bold leading-tight sm:leading-snug transition-all duration-700 delay-300 ${
                isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
              }`}
              style={{ fontFamily: "serif" }}
            >
              Gold Membership
            </h1>
            <h3
              className={`m-0 text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold leading-tight sm:leading-snug transition-all duration-700 delay-500 p-0 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-5"
              }`}
              style={{ color: "#000000ff" }}
            >
              Enhanced Planning with Essential Services
            </h3>
          </div>

          {/* Welcome Message */}
          <p
            className={`text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-gray-800 leading-relaxed max-w-xs sm:max-w-sm md:max-w-md lg:max-w-2xl xl:max-w-3xl 2xl:max-w-4xl mt-2 font-semibold px-2 sm:px-0 transition-all duration-700 delay-700 ${
              isVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            Welcome to Gold membership! Access enhanced matchmaking with verified profiles and essential wedding planning services.
          </p>

          {/* Gold Features */}
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <span className="px-4 py-2 bg-amber-100 text-amber-800 rounded-full font-semibold border border-amber-300">✓ Match Making</span>
            <span className="px-4 py-2 bg-amber-100 text-amber-800 rounded-full font-semibold border border-amber-300">✓ Pre-Wedding Consultation</span>
            <span className="px-4 py-2 bg-amber-100 text-amber-800 rounded-full font-semibold border border-amber-300">✓ Auspicious Date Discovery</span>
            <span className="px-4 py-2 bg-amber-100 text-amber-800 rounded-full font-semibold border border-amber-300">✓ Priest Support</span>
            <span className="px-4 py-2 bg-amber-100 text-amber-800 rounded-full font-semibold border border-amber-300">✓ Location Services</span>
          </div>
        </div>
      </section>

      {/* Search and Filters Section */}
      <section className="relative w-full py-12 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-amber-100">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-amber-800 mb-4">
              Gold Member Profiles
            </h2>
            <p className="text-xl text-amber-700 max-w-3xl mx-auto">
              Enhanced access to verified profiles with essential wedding services
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <input
              type="text"
              placeholder="Search gold members by name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-4 text-lg bg-white border-2 border-amber-300 rounded-2xl focus:outline-none focus:border-amber-500 shadow-lg transition-all"
            />
          </div>

          {/* Basic Filters */}
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
              <option value={40}>Age Max: 40</option>
              <option value={45}>Age Max: 45</option>
            </select>
            <input
              type="text"
              placeholder="Location"
              value={filters.location}
              onChange={(e) => setFilters({ ...filters, location: e.target.value })}
              className="px-4 py-3 bg-white border-2 border-amber-300 rounded-xl focus:outline-none focus:border-amber-500"
            />
            <select
              value={filters.religion}
              onChange={(e) => setFilters({ ...filters, religion: e.target.value })}
              className="px-4 py-3 bg-white border-2 border-amber-300 rounded-xl focus:outline-none focus:border-amber-500"
            >
              <option value="">Any Religion</option>
              <option value="Hindu">Hindu</option>
              <option value="Sikh">Sikh</option>
            </select>
          </div>
        </div>
      </section>

      {/* Gold Profiles Grid */}
      <section className="relative w-full py-12 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredProfiles.map((profile) => (
              <div
                key={profile.id}
                className="group relative bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-4 border-amber-300 hover:border-amber-500 cursor-pointer"
                onClick={() => handleProfileClick(profile.id)}
              >
                {/* Gold Badge */}
                <div className="absolute top-4 right-4 z-20">
                  <div className="w-12 h-12 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                    <span className="text-white text-sm">🥇</span>
                  </div>
                </div>

                {/* Profile Image */}
                <div className="relative h-64 sm:h-72 overflow-hidden">
                  <img
                    src={profile.image}
                    alt={profile.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="text-xl font-bold mb-1">{profile.name}</h3>
                    <p className="text-amber-200 font-semibold">{profile.age} | {profile.location}</p>
                  </div>
                </div>

                {/* Profile Content - Basic Details */}
                <div className="p-6">
                  <div className="mb-4">
                    <p className="text-amber-700 font-bold text-lg mb-2">{profile.profession}</p>
                    <p className="text-gray-700 mb-3">{profile.description}</p>
                  </div>

                  {/* Basic Information */}
                  <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                    <div>
                      <span className="font-semibold text-gray-600">Education:</span>
                      <p className="text-gray-800">{profile.education}</p>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-600">Salary:</span>
                      <p className="text-green-700 font-bold">${profile.salary.toLocaleString()}/year</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {profile.interests.map((interest, idx) => (
                      <span key={idx} className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">
                        {interest}
                      </span>
                    ))}
                  </div>

                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleContactAdvisor();
                    }}
                    className="w-full py-3 bg-gradient-to-r from-amber-500 to-yellow-600 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                  >
                    Contact Advisor
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredProfiles.length === 0 && (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">No gold profiles found. Try adjusting your search criteria.</p>
            </div>
          )}

          {/* Gold Support */}
          <div className="text-center mt-12 p-8 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl border-2 border-amber-200">
            <h3 className="text-2xl font-bold text-amber-800 mb-4">Gold Member Support</h3>
            <p className="text-gray-700 mb-6">Your dedicated advisor is available to assist with matchmaking and essential wedding services</p>
            <button 
              onClick={handleContactAdvisor}
              className="px-8 py-3 bg-gradient-to-r from-amber-600 to-yellow-700 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              Connect with Advisor
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Gold;