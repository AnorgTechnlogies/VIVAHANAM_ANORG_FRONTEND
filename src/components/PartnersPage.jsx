import { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import SearchPartners from "../assets/BackgroundImagePertnerPage.jpg";

const PartnersPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [user] = useState({ email: "Vivahanam.com" });
  const navigate = useNavigate();

  // Reference for smooth scroll
  const partnersSectionRef = useRef(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const partners = useMemo(
    () => [
      {
        id: 1,
        name: "Priya Sharma",
        age: 28,
        location: "Atlanta, GA USA",
        profession: "Documents",
        description: "Bengali, 48, US Marketing Manager",
        image:
          "https://images.unsplash.com/photo-1494790108755-2616b612b786?q=80&w=2070",
        interests: ["Yoga", "Cooking", "Travel"],
        gender: "female",
        salary: 75000,
        religion: "Hindu",
        diet: "veg",
        language: "English, Hindi",
        motherTongue: "Bengali",
        caste: "Sharma",
        city: "Atlanta",
        state: "GA",
        nri: true,
        college: "Emory University",
      },
      {
        id: 2,
        name: "DS14 Hindu Sharma",
        age: 31,
        location: "Los Angeles, CA USA",
        profession: "Consultant",
        description: "Punjabi, 31, Hindu",
        image:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070",
        interests: ["Reading", "Hiking", "Music"],
        gender: "male",
        salary: 90000,
        religion: "Hindu",
        diet: "nonveg",
        language: "English, Punjabi",
        motherTongue: "Punjabi",
        caste: "Sharma",
        city: "Los Angeles",
        state: "CA",
        nri: true,
        college: "Consulting Academy",
      },
      {
        id: 3,
        name: "Sneha Gupta",
        age: 26,
        location: "San Francisco, CA",
        profession: "Marketing Specialist",
        description:
          "Adventurous spirit with roots in Indian culture, ready for the next chapter.",
        image:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070",
        interests: ["Dance", "Art", "Volunteering"],
        gender: "female",
        salary: 65000,
        religion: "Hindu",
        diet: "both",
        language: "English, Tamil",
        motherTongue: "Tamil",
        caste: "Gupta",
        city: "San Francisco",
        state: "CA",
        nri: true,
        college: "Art College",
      },
      {
        id: 4,
        name: "Rahul Mehta",
        age: 30,
        location: "Chicago, IL",
        profession: "Architect",
        description:
          "Building dreams and seeking a partner to share life's blueprint.",
        image:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2070",
        interests: ["Photography", "Architecture", "Sports"],
        gender: "male",
        salary: 85000,
        religion: "Jain",
        diet: "veg",
        language: "English, Gujarati",
        motherTongue: "Gujarati",
        caste: "Mehta",
        city: "Chicago",
        state: "IL",
        nri: true,
        college: "Architecture School",
      },
      {
        id: 5,
        name: "DS25 Hindu Gupta",
        age: 29,
        location: "Dallas, TX USA",
        profession: "Financial",
        description: "Tamil, 54, Hindu Gupta",
        image:
          "https://images.unsplash.com/photo-1494790108755-2616b612b786?q=80&w=2070",
        interests: ["Yoga", "Cooking", "Travel"],
        gender: "female",
        salary: 70000,
        religion: "Hindu",
        diet: "veg",
        language: "English, Tamil",
        motherTongue: "Tamil",
        caste: "Gupta",
        city: "Dallas",
        state: "TX",
        nri: true,
        college: "Finance Uni",
      },
      {
        id: 6,
        name: "DS35 Hindu Rajput",
        age: 27,
        location: "Houston, TX USA",
        profession: "Consultant",
        description: "Tamil, 24, US Hindu Rajput",
        image:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070",
        interests: ["Reading", "Hiking", "Music"],
        gender: "male",
        salary: 80000,
        religion: "Hindu",
        diet: "nonveg",
        language: "English, Hindi",
        motherTongue: "Hindi",
        caste: "Rajput",
        city: "Houston",
        state: "TX",
        nri: true,
        college: "Consulting School",
      },
    ],
    []
  );

  const filteredPartners = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return partners.filter((partner) => {
      const matchesSearch =
        partner.name.toLowerCase().includes(query) ||
        partner.description.toLowerCase().includes(query);
      return matchesSearch;
    });
  }, [partners, searchQuery]);

  const handleProfileClick = (partnerId) => {
    console.log(`Viewing profile: ${partnerId}`);
  };

  const handleSubscription = () => {
    navigate("/subscription-plans");
  };

  // Smooth scroll to partners section
  const handleSearchPartners = () => {
    partnersSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

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

  return (
    <>
      {/* Hero Section */}
      <section className="relative w-full min-h-[80vh] sm:min-h-[70vh] md:h-screen overflow-hidden bg-amber-100">
        <div className="absolute inset-0 animate-pulse-slow" />
        <FloatingParticles />

        <div className="w-full flex flex-col items-center justify-start py-8 sm:py-12 md:py-0 relative z-10">
          <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 w-full">
            <div
              className={`grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 w-full items-center transition-all duration-1000 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              {/* Left Side – Image */}
              <div className="flex items-center justify-center lg:justify-start order-1 lg:order-1 w-full mb-6 lg:mb-0">
                <div className="relative w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl mx-auto lg:mx-0 rounded-3xl overflow-hidden shadow-2xl transform transition-transform duration-500 hover:scale-105">
                  <img
                    src={SearchPartners}
                    alt="Best Indian Matrimonial"
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>

              {/* Right Side – Content */}
              <div className="flex flex-col justify-center space-y-4 sm:space-y-6 lg:space-y-8 order-2 lg:order-2 w-full px-4 lg:px-0 text-center lg:text-left">
                <h1
                  className={`text-2xl sm:text-3xl md:text-4xl lg:text-4xl xl:text-5xl font-semibold text-red-700 leading-tight sm:leading-snug transition-all duration-700 delay-300 ${
                    isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
                  }`}
                  style={{ fontFamily: "serif" }}
                >
                  Best Indian Matrimonial <br /> Site in the USA
                </h1>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 justify-center lg:justify-start">
                  <button
                    className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 w-full sm:w-auto min-w-[160px]"
                    onClick={handleSubscription}
                  >
                    Subscribe Now
                  </button>

                  <button
                    className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 w-full sm:w-auto min-w-[160px]"
                    onClick={handleSearchPartners}
                  >
                    Search Partner
                  </button>
                </div>

                <p
                  className={`text-sm sm:text-base md:text-lg lg:text-xl font-semibold xl:text-2xl text-gray-700 leading-relaxed max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mx-auto lg:mx-0 transition-all duration-700 delay-700 ${
                    isVisible ? "opacity-100" : "opacity-0"
                  }`}
                >
                  A trusted matrimonial platform connecting Indian singles across the USA.
                  Discover verified bride and groom profiles and start your journey towards
                  a meaningful connection today.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Grid */}
      <section
        ref={partnersSectionRef}
        className="relative w-full py-12 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-amber-100"
      >
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
              <p className="text-xl text-gray-600">
                No partners found. Try adjusting your search or filters.
              </p>
            </div>
          )}

          <div className="flex justify-center mt-12">
            <button className="px-10 py-4 bg-gradient-to-r from-amber-700 to-amber-800 hover:from-amber-800 hover:to-amber-900 text-white text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
              Load More Partners
            </button>
          </div>
        </div>
      </section>

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
    </>
  );
};

// Partner Card Component
const PartnerCard = ({ partner, onClick }) => (
  <div
    className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-amber-200 hover:border-amber-400 cursor-pointer"
    onClick={() => onClick(partner.id)}
  >
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

    <div className="p-3 sm:p-4">
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
          <span
            key={idx}
            className="px-1.5 py-0.5 bg-amber-100 text-amber-800 rounded-full text-xs"
          >
            {interest}
          </span>
        ))}
      </div>
    </div>
  </div>
);

export default PartnersPage;
