import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import image4 from "../assets/image4.png"; // Reuse if needed for consistency

const PartnersPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({ 
    ageMin: 18, 
    ageMax: 35, 
    location: "",
    minSalary: "",
    maxSalary: "",
    religion: "",
    diet: "",
    hobbies: "",
    language: ""
  });
  const [selectedTab, setSelectedTab] = useState("all"); // 'all', 'bride' or 'groom'
  const [user, setUser] = useState({ email: "Vivahanam.com" }); // Simulated logged-in user
  const navigate = useNavigate();

  useEffect(() => {
    // Trigger animations after component mounts
    setIsVisible(true);
  }, []);

  // Simulated partner data with gender and additional fields
  const partners = [
    {
      id: 1,
      name: "Priya Sharma",
      age: 28,
      location: "Atlanta, GA USA",
      profession: "Documents",
      description: "Bengali, 48, US Marketing Manager",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?q=80&w=2070",
      interests: ["Yoga", "Cooking", "Travel"],
      gender: "female",
      salary: 65000,
      religion: "Hindu",
      diet: "Veg",
      language: "Bengali"
    },
    {
      id: 2,
      name: "DS14 Hindu Sharma",
      age: 31,
      location: "Los Angeles, CA USA",
      profession: "Consultant",
      description: "Punjabi, 31, Hindu",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070",
      interests: ["Reading", "Hiking", "Music"],
      gender: "male",
      salary: 80000,
      religion: "Hindu",
      diet: "Non-Veg",
      language: "Punjabi"
    },
    {
      id: 3,
      name: "Sneha Gupta",
      age: 26,
      location: "San Francisco, CA",
      profession: "Marketing Specialist",
      description: "Adventurous spirit with roots in Indian culture, ready for the next chapter.",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070",
      interests: ["Dance", "Art", "Volunteering"],
      gender: "female",
      salary: 55000,
      religion: "Hindu",
      diet: "Veg",
      language: "Hindi"
    },
    {
      id: 4,
      name: "Rahul Mehta",
      age: 30,
      location: "Chicago, IL",
      profession: "Architect",
      description: "Building dreams and seeking a partner to share life's blueprint.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2070",
      interests: ["Photography", "Architecture", "Sports"],
      gender: "male",
      salary: 90000,
      religion: "Hindu",
      diet: "Non-Veg",
      language: "English"
    },
    // Add more as needed, ensuring gender is set
    {
      id: 5,
      name: "DS25 Hindu Gupta",
      age: 29,
      location: "Dallas, TX USA",
      profession: "Financial",
      description: "Tamil, 54, Hindu Gupta",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?q=80&w=2070",
      interests: ["Yoga", "Cooking", "Travel"],
      gender: "female",
      salary: 70000,
      religion: "Hindu",
      diet: "Veg",
      language: "Tamil"
    },
    {
      id: 6,
      name: "DS35 Hindu Rajput",
      age: 27,
      location: "Houston, TX USA",
      profession: "Consultant",
      description: "Tamil, 24, US Hindu Rajput",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070",
      interests: ["Reading", "Hiking", "Music"],
      gender: "male",
      salary: 60000,
      religion: "Hindu",
      diet: "Non-Veg",
      language: "Tamil"
    },
  ];

  // Filter partners based on tab, search, and filters
  const filteredPartners = partners
    .filter((partner) => {
      const matchesTab = selectedTab === "all" || partner.gender === (selectedTab === "bride" ? "female" : "male");
      const matchesSearch = partner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            partner.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesAge = partner.age >= filters.ageMin && partner.age <= filters.ageMax;
      const matchesLocation = !filters.location || partner.location.toLowerCase().includes(filters.location.toLowerCase());
      const minSalaryFilter = filters.minSalary ? parseInt(filters.minSalary) : 0;
      const maxSalaryFilter = filters.maxSalary ? parseInt(filters.maxSalary) : Infinity;
      const matchesSalary = partner.salary >= minSalaryFilter && partner.salary <= maxSalaryFilter;
      const matchesReligion = !filters.religion || partner.religion === filters.religion;
      const matchesDiet = !filters.diet || partner.diet === filters.diet;
      const matchesHobbies = !filters.hobbies || partner.interests.some(interest => 
        interest.toLowerCase().includes(filters.hobbies.toLowerCase())
      );
      const matchesLanguage = !filters.language || partner.language.toLowerCase().includes(filters.language.toLowerCase());
      return matchesTab && matchesSearch && matchesAge && matchesLocation && matchesSalary && 
             matchesReligion && matchesDiet && matchesHobbies && matchesLanguage;
    });

  const handleProfileClick = (partnerId) => {
    console.log(`Viewing profile: ${partnerId}`);
    // Navigate to detailed profile page
    // navigate(`/profile/${partnerId}`);
  };

  const handleLogout = () => {
    setUser(null);
    navigate("/plans");
  };

  return (
    <>
      {/* Hero Section */}
      <section
        className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 lg:px-12 py-12 sm:py-16 md:py-20 lg:py-24 font-sans overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 182, 193, 0.06), rgba(255, 182, 193, 0.07)), url(${image4})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Animated Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-pink-300/30 via-transparent to-pink-300/30 animate-pulse-slow" />

        {/* Floating particles background effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 sm:w-2 h-1 sm:h-2 bg-amber-400/30 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.8}s`,
                animationDuration: `${4 + Math.random() * 3}s`,
              }}
            />
          ))}
        </div>

        <div
          className={`relative z-10 flex flex-col items-center w-full max-w-4xl sm:max-w-5xl md:max-w-6xl text-center gap-3 sm:gap-4 md:gap-5 lg:gap-8 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {/* Title section */}
          <div className="flex flex-col items-center gap-1 sm:gap-2 md:gap-3 lg:gap-4">
            <h1
              className={`m-0 text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-red-700 font-bold leading-tight sm:leading-snug transition-all duration-700 delay-300 ${
                isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
              }`}
              style={{ fontFamily: "serif" }}
            >
              Best Indian Matrimonial Site in the USA
            </h1>
            <h3
              className={`m-0 text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold leading-tight sm:leading-snug transition-all duration-700 delay-500 p-0 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-5"
              }`}
              style={{ color: "#000000ff" }}
            >
              1000+ Verified Bride & Groom Profiles
            </h3>
          </div>

          {/* Welcome Message */}
          <p
            className={`text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-black-800 leading-relaxed max-w-xs sm:max-w-sm md:max-w-md lg:max-w-2xl xl:max-w-3xl 2xl:max-w-4xl mt-2 font-semibold px-2 sm:px-0 transition-all duration-700 delay-700 ${
              isVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            Welcome back, {user.email}. Discover meaningful connections tailored to your Vedic values.
          </p>

          {/* Subscribe Button */}
          <button
            className="mt-4 px-6 py-2 bg-red-600 text-white rounded-md font-semibold hover:bg-red-700 transition-colors"
            onClick={handleLogout}
          >
            Subscribe Now
          </button>
        </div>

        <style jsx>{`
          @keyframes float {
            0%,
            100% {
              transform: translateY(0px) translateX(0px);
              opacity: 0.3;
            }
            50% {
              transform: translateY(-30px) translateX(20px);
              opacity: 0.6;
            }
          }

          @keyframes pulse-slow {
            0%,
            100% {
              opacity: 1;
            }
            50% {
              opacity: 0.8;
            }
          }

          .animate-float {
            animation: float linear infinite;
          }

          .animate-pulse-slow {
            animation: pulse-slow 4s ease-in-out infinite;
          }
        `}</style>
      </section>

      {/* Search and Filters Section */}
      <section className="relative w-full py-12 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-amber-100">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-amber-800 mb-4">
              Search Partners
            </h2>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <input
              type="text"
              placeholder="Search by name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-4 text-lg bg-white border-2 border-amber-300 rounded-2xl focus:outline-none focus:border-amber-500 shadow-lg transition-all"
            />
          </div>

          {/* Bride/Groom/All Tabs */}
          <div className="flex justify-center mb-8">
            <div className="flex bg-white rounded-xl p-1 shadow-lg">
              <button
                onClick={() => setSelectedTab("all")}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  selectedTab === "all"
                    ? "bg-amber-500 text-white shadow-md"
                    : "text-gray-600 hover:text-amber-800"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setSelectedTab("bride")}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ml-1 ${
                  selectedTab === "bride"
                    ? "bg-amber-500 text-white shadow-md"
                    : "text-gray-600 hover:text-amber-800"
                }`}
              >
                Brides
              </button>
              <button
                onClick={() => setSelectedTab("groom")}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ml-1 ${
                  selectedTab === "groom"
                    ? "bg-amber-500 text-white shadow-md"
                    : "text-gray-600 hover:text-amber-800"
                }`}
              >
                Grooms
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 justify-center mb-12 flex-wrap">
            <select
              value={filters.ageMin}
              onChange={(e) => setFilters({ ...filters, ageMin: parseInt(e.target.value) })}
              className="px-4 py-3 bg-white border-2 border-amber-300 rounded-xl focus:outline-none focus:border-amber-500"
            >
              <option value={18}>Age Min: 18</option>
              <option value={20}>Age Min: 20</option>
              <option value={25}>Age Min: 25</option>
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
              className="px-4 py-3 bg-white border-2 border-amber-300 rounded-xl focus:outline-none focus:border-amber-500 w-28"
            />
            <input
              type="number"
              placeholder="Max Salary ($)"
              value={filters.maxSalary}
              onChange={(e) => setFilters({ ...filters, maxSalary: e.target.value })}
              className="px-4 py-3 bg-white border-2 border-amber-300 rounded-xl focus:outline-none focus:border-amber-500 w-28"
            />
            <select
              value={filters.religion}
              onChange={(e) => setFilters({ ...filters, religion: e.target.value })}
              className="px-4 py-3 bg-white border-2 border-amber-300 rounded-xl focus:outline-none focus:border-amber-500"
            >
              <option value="">Any Religion</option>
              <option value="Hindu">Hindu</option>
              <option value="Muslim">Muslim</option>
              <option value="Sikh">Sikh</option>
              <option value="Christian">Christian</option>
            </select>
            <select
              value={filters.diet}
              onChange={(e) => setFilters({ ...filters, diet: e.target.value })}
              className="px-4 py-3 bg-white border-2 border-amber-300 rounded-xl focus:outline-none focus:border-amber-500"
            >
              <option value="">Any Diet</option>
              <option value="Veg">Vegetarian</option>
              <option value="Non-Veg">Non-Vegetarian</option>
              <option value="Both">Both</option>
            </select>
            <input
              type="text"
              placeholder="Hobbies (e.g., Yoga)"
              value={filters.hobbies}
              onChange={(e) => setFilters({ ...filters, hobbies: e.target.value })}
              className="px-4 py-3 bg-white border-2 border-amber-300 rounded-xl focus:outline-none focus:border-amber-500"
            />
            <select
              value={filters.language}
              onChange={(e) => setFilters({ ...filters, language: e.target.value })}
              className="px-4 py-3 bg-white border-2 border-amber-300 rounded-xl focus:outline-none focus:border-amber-500"
            >
              <option value="">Any Language</option>
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
              <option value="Tamil">Tamil</option>
              <option value="Bengali">Bengali</option>
              <option value="Punjabi">Punjabi</option>
            </select>
          </div>
        </div>
      </section>

      {/* Partners Grid */}
      <section className="relative w-full py-12 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredPartners.map((partner) => (
              <div
                key={partner.id}
                className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-amber-200 hover:border-amber-400 cursor-pointer"
                onClick={() => handleProfileClick(partner.id)}
              >
                {/* Profile Image - Blurred */}
                <div className="relative h-64 sm:h-72 overflow-hidden">
                  <img
                    src={partner.image}
                    alt={partner.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    style={{ filter: "blur(8px)" }} // Blur effect to make not fully visible
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  {/* Optional: Overlay text indicating blur reason */}
                  <div className="absolute bottom-2 left-2 right-2 text-white text-sm font-semibold text-center">
                    Subscribe to view full profile
                  </div>
                </div>

                {/* Profile Content */}
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-amber-900 mb-2">{partner.name}</h3>
                  <p className="text-red-700 font-semibold mb-1">{partner.age} | {partner.location}</p>
                  <p className="text-gray-700 mb-4">{partner.profession}</p>
                  <p className="text-gray-600 mb-4 line-clamp-3">{partner.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {partner.interests.map((interest, idx) => (
                      <span key={idx} className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm">
                        {interest}
                      </span>
                    ))}
                  </div>
                  <button className="w-full py-3 bg-gradient-to-r from-amber-700 to-amber-800 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
                    View Profile
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredPartners.length === 0 && (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">No partners found. Try adjusting your search or filters.</p>
            </div>
          )}

          {/* Load More Button */}
          <div className="flex justify-center mt-12">
            <button className="px-10 py-4 bg-gradient-to-r from-amber-700 to-amber-800 hover:from-amber-800 hover:to-amber-900 text-white text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
              Load More Partners
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default PartnersPage;