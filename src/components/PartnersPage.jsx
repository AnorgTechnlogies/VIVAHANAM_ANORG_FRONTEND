import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import SearchPartners from "../assets/Search Partners.png"

const PartnersPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({ 
    ageMin: 18, 
    ageMax: 35, 
    location: "", 
    salaryMin: 0, 
    salaryMax: 1000000,
    religion: "",
    diet: "",
    language: "",
    hobbies: ""
  });
  const [selectedTab, setSelectedTab] = useState("all");
  const [user] = useState({ email: "Vivahanam.com" });
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Optimized partner data with memoization
  const partners = useMemo(() => [
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
      salary: 75000,
      religion: "Hindu",
      diet: "veg",
      language: "English, Hindi",
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
      salary: 90000,
      religion: "Hindu",
      diet: "nonveg",
      language: "English, Punjabi",
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
      salary: 65000,
      religion: "Hindu",
      diet: "both",
      language: "English, Tamil",
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
      salary: 85000,
      religion: "Jain",
      diet: "veg",
      language: "English, Gujarati",
    },
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
      diet: "veg",
      language: "English, Tamil",
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
      salary: 80000,
      religion: "Hindu",
      diet: "nonveg",
      language: "English, Hindi",
    },
  ], []);

  // Optimized filter function with useMemo
  const filteredPartners = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return partners.filter((partner) => {
      const matchesTab = selectedTab === "all" || 
                        partner.gender === (selectedTab === "bride" ? "female" : "male");
      
      if (!matchesTab) return false;

      const matchesSearch = partner.name.toLowerCase().includes(query) ||
                          partner.description.toLowerCase().includes(query);
      if (!matchesSearch) return false;

      const matchesAge = partner.age >= filters.ageMin && partner.age <= filters.ageMax;
      if (!matchesAge) return false;

      const matchesLocation = !filters.location || 
                            partner.location.toLowerCase().includes(filters.location.toLowerCase());
      if (!matchesLocation) return false;

      const matchesSalary = partner.salary >= filters.salaryMin && partner.salary <= filters.salaryMax;
      if (!matchesSalary) return false;

      const matchesReligion = !filters.religion || partner.religion === filters.religion;
      if (!matchesReligion) return false;

      const matchesDiet = !filters.diet || partner.diet === filters.diet;
      if (!matchesDiet) return false;

      const matchesLanguage = !filters.language || 
                            partner.language.toLowerCase().includes(filters.language.toLowerCase());
      if (!matchesLanguage) return false;

      const matchesHobbies = !filters.hobbies || 
                           partner.interests.some(interest => 
                             interest.toLowerCase().includes(filters.hobbies.toLowerCase())
                           );

      return matchesHobbies;
    });
  }, [partners, searchQuery, selectedTab, filters]);

  const handleProfileClick = (partnerId) => {
    console.log(`Viewing profile: ${partnerId}`);
  };

  const handleLogout = () => {
    navigate("/plans");
  };

  // const handleFreeRegistration = () => {
  //   navigate("/partners/registerProfile");
  // };

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Floating particles component
  const FloatingParticles = () => (
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
  );

  // Filter options for better maintainability
  const filterOptions = {
    ageMin: [18, 20, 25],
    ageMax: [35, 40, 45],
    religion: ["", "Hindu", "Muslim", "Christian", "Jain", "Sikh"],
    diet: ["", "veg", "nonveg", "both"]
  };

  return (
    <>
      {/* Hero Section */}
      <section
        className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 lg:px-12 py-12 sm:py-16 md:py-20 lg:py-24 font-sans overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 182, 193, 0.06), rgba(255, 182, 193, 0.07)), url(${SearchPartners})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-pink-300/30 via-transparent to-pink-300/30 animate-pulse-slow" />
        <FloatingParticles />

        <div
          className={`relative z-10 flex flex-col items-center w-full max-w-4xl sm:max-w-5xl md:max-w-6xl text-center gap-3 sm:gap-4 md:gap-5 lg:gap-8 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {/* Title section */}
          <div className="flex mt-10 flex-col items-center gap-1 sm:gap-2 md:gap-3 lg:gap-4">
            <h1
              className={`m-0 text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-red-700 font-bold leading-tight sm:leading-snug transition-all duration-700 delay-300 ${
                isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
              }`}
              style={{ fontFamily: "serif" }}
            >
              Best Indian Matrimonial  <br /> Site in the USA
            </h1>
            <h3
              className={`m-0 text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold leading-tight sm:leading-snug transition-all duration-700 delay-500 p-0 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
              }`}
              style={{ color: "#000000ff" }}
            >
              10+ Verified Bride & Groom Profiles
            </h3>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <button
              className="px-6 py-4 bg-red-600 text-white rounded-md font-semibold hover:bg-red-700 transition-colors"
              onClick={handleLogout}
            >
              Subscribe Now
            </button>
            {/* <button
              className="px-6 py-4 bg-red-600 text-white rounded-md font-semibold hover:bg-red-700 transition-colors"
              onClick={handleFreeRegistration}
            >
              Register free 
            </button> */}
          </div>
        </div>
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

          {/* All/Brides/Grooms Tabs */}
          <div className="flex justify-center mb-8">
            <div className="flex bg-white rounded-xl p-1 shadow-lg">
              {["all", "bride", "groom"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSelectedTab(tab)}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all capitalize ${
                    selectedTab === tab
                      ? "bg-amber-500 text-white shadow-md"
                      : "text-gray-600 hover:text-amber-800"
                  } ${tab !== "all" ? "ml-1" : ""}`}
                >
                  {tab === "all" ? "All" : tab + "s"}
                </button>
              ))}
            </div>
          </div>

          {/* Enhanced Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 justify-center mb-12">
            {/* Age Min */}
            <select
              value={filters.ageMin}
              onChange={(e) => updateFilter('ageMin', parseInt(e.target.value))}
              className="px-4 py-3 bg-white border-2 border-amber-300 rounded-xl focus:outline-none focus:border-amber-500"
            >
              {filterOptions.ageMin.map(age => (
                <option key={age} value={age}>Age Min: {age}</option>
              ))}
            </select>

            {/* Age Max */}
            <select
              value={filters.ageMax}
              onChange={(e) => updateFilter('ageMax', parseInt(e.target.value))}
              className="px-4 py-3 bg-white border-2 border-amber-300 rounded-xl focus:outline-none focus:border-amber-500"
            >
              {filterOptions.ageMax.map(age => (
                <option key={age} value={age}>Age Max: {age}</option>
              ))}
            </select>

            {/* Location */}
            <input
              type="text"
              placeholder="Place (e.g., New York)"
              value={filters.location}
              onChange={(e) => updateFilter('location', e.target.value)}
              className="px-4 py-3 bg-white border-2 border-amber-300 rounded-xl focus:outline-none focus:border-amber-500"
            />

            {/* Salary Min */}
            <input
              type="number"
              placeholder="Salary Min (USD)"
              value={filters.salaryMin}
              onChange={(e) => updateFilter('salaryMin', parseInt(e.target.value) || 0)}
              className="px-4 py-3 bg-white border-2 border-amber-300 rounded-xl focus:outline-none focus:border-amber-500"
            />

            {/* Salary Max */}
            <input
              type="number"
              placeholder="Salary Max (USD)"
              value={filters.salaryMax}
              onChange={(e) => updateFilter('salaryMax', parseInt(e.target.value) || 1000000)}
              className="px-4 py-3 bg-white border-2 border-amber-300 rounded-xl focus:outline-none focus:border-amber-500"
            />

            {/* Religion */}
            <select
              value={filters.religion}
              onChange={(e) => updateFilter('religion', e.target.value)}
              className="px-4 py-3 bg-white border-2 border-amber-300 rounded-xl focus:outline-none focus:border-amber-500"
            >
              {filterOptions.religion.map(religion => (
                <option key={religion} value={religion}>
                  {religion || "Any Religion"}
                </option>
              ))}
            </select>

            {/* Diet */}
            <select
              value={filters.diet}
              onChange={(e) => updateFilter('diet', e.target.value)}
              className="px-4 py-3 bg-white border-2 border-amber-300 rounded-xl focus:outline-none focus:border-amber-500"
            >
              {filterOptions.diet.map(diet => (
                <option key={diet} value={diet}>
                  {!diet ? "Any Diet" : 
                   diet === "veg" ? "Vegetarian" : 
                   diet === "nonveg" ? "Non-Vegetarian" : "Both"}
                </option>
              ))}
            </select>

            {/* Language */}
            <input
              type="text"
              placeholder="Language (e.g., Hindi)"
              value={filters.language}
              onChange={(e) => updateFilter('language', e.target.value)}
              className="px-4 py-3 bg-white border-2 border-amber-300 rounded-xl focus:outline-none focus:border-amber-500"
            />

            {/* Hobbies */}
            <input
              type="text"
              placeholder="Hobbies (e.g., Yoga)"
              value={filters.hobbies}
              onChange={(e) => updateFilter('hobbies', e.target.value)}
              className="px-4 py-3 bg-white border-2 border-amber-300 rounded-xl focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>
      </section>

      {/* Partners Grid */}
      <section className="relative w-full py-12 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6">
            {filteredPartners.map((partner) => (
              <PartnerCard 
                key={partner.id} 
                partner={partner} 
                onClick={handleProfileClick} 
              />
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

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-30px) translateX(20px);
            opacity: 0.6;
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
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
    </>
  );
};

// Extracted Partner Card Component for better reusability and performance
const PartnerCard = ({ partner, onClick }) => (
  <div
    className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-amber-200 hover:border-amber-400 cursor-pointer"
    onClick={() => onClick(partner.id)}
  >
    {/* Profile Image - Blurred */}
    <div className="relative h-40 sm:h-44 overflow-hidden">
      <img
        src={partner.image}
        alt={partner.name}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        style={{ filter: "blur(8px)" }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
      <div className="absolute bottom-2 left-2 right-2 text-white text-xs sm:text-sm font-semibold text-center">
        Subscribe to view full profile
      </div>
    </div>

    {/* Profile Content */}
    <div className="p-3 sm:p-4">
      <h3 className="text-lg sm:text-xl font-bold text-amber-900 mb-1 truncate">
        {/* {partner.name} */}
      </h3>
      <p className="text-red-700 font-semibold mb-1 text-xs sm:text-sm">
        {partner.age} | {partner.location}
      </p>
      <p className="text-gray-700 mb-1 text-xs sm:text-sm font-medium">
        {partner.profession}
      </p>
      <p className="text-gray-600 mb-2 text-xs sm:text-sm line-clamp-1">
        {partner.description}
      </p>
      <div className="flex flex-wrap gap-1 mb-2">
        {partner.interests.slice(0, 3).map((interest, idx) => (
          <span key={idx} className="px-1.5 py-0.5 bg-amber-100 text-amber-800 rounded-full text-xs">
            {interest}
          </span>
        ))}
      </div>
    </div>
  </div>
);

export default PartnersPage;