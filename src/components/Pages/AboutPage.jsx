import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const About = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeCard, setActiveCard] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const values = [
    {
      id: 1,
      title: "Tradition",
      description:
        "Honoring ancient Vedic customs and rituals that have united families for generations.",
      icon: "🕉️",
      color: "from-amber-500 to-orange-600",
    },
    {
      id: 2,
      title: "Authenticity",
      description:
        "Ensuring genuine connections through verified profiles and personalized matchmaking.",
      icon: "✨",
      color: "from-red-500 to-pink-600",
    },
    {
      id: 3,
      title: "Community",
      description:
        "Building a supportive network of Hindu families across North America.",
      icon: "🤝",
      color: "from-amber-600 to-yellow-600",
    },
    {
      id: 4,
      title: "Spirituality",
      description:
        "Fostering sacred bonds that transcend the material and touch the divine.",
      icon: "🪔",
      color: "from-orange-500 to-red-600",
    },
  ];

  const team = [
    {
      id: 1,
      name: "Dr. Rajesh Kumar",
      role: "Founder & Chief Matchmaker",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300",
      description:
        "25 years of experience in Vedic astrology and matrimonial services.",
    },
    {
      id: 2,
      name: "Priya Sharma",
      role: "Wedding Consultant",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300",
      description:
        "Expert in traditional Hindu wedding ceremonies and customs.",
    },
    {
      id: 3,
      name: "Amit Patel",
      role: "Community Relations",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300",
      description:
        "Connecting families across North America with cultural sensitivity.",
    },
  ];

  const milestones = [
    { year: "2015", event: "Vivahanam Founded", count: "100+ Couples" },
    { year: "2018", event: "Expanded Services", count: "250+ Couples" },
    { year: "2021", event: "Digital Platform Launch", count: "400+ Couples" },
    { year: "2024", event: "500+ Success Stories", count: "500+ Couples" },
  ];

  return (
    <div className="w-full bg-gradient-to-b from-amber-50 via-orange-50 to-amber-50">
      {/* Hero Section */}
      <div className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-amber-900/90 via-red-900/85 to-amber-900/90"></div>
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-amber-300/30 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.7}s`,
                animationDuration: `${5 + Math.random() * 3}s`,
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div
          className={`relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-amber-50 mb-6 leading-tight">
            About Vivahanam
          </h1>
          <div className="h-1 w-32 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mb-6"></div>
          <p className="text-xl sm:text-2xl md:text-3xl text-amber-100 font-serif italic">
            "वसुधैव कुटुंबकम्"
          </p>
          <p className="text-lg sm:text-xl text-amber-200 mt-4">
            The World is One Family
          </p>
        </div>
      </div>

      {/* Our Story Section */}
      <div
        className={`container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 transition-all duration-1000 delay-200 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-amber-900 text-center mb-8">
            Our Story
          </h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-6 text-center">
              Founded in 2015, Vivahanam emerged from a vision to preserve and
              celebrate Vedic marriage traditions in North America. We
              recognized the need for a platform that honors ancient wisdom
              while embracing modern matchmaking convenience.
            </p>
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed text-center">
              Today, we're proud to have united over 500 couples, creating
              lasting bonds rooted in shared values, cultural heritage, and
              spiritual connection. Our commitment extends beyond matchmaking –
              we're building a community that cherishes tradition while thriving
              in contemporary life.
            </p>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-gradient-to-r from-amber-100 via-orange-100 to-amber-100 py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-amber-900 text-center mb-12">
            Our Core Values
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {values.map((value, index) => (
              <div
                key={value.id}
                className={`group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${300 + index * 100}ms` }}
                onMouseEnter={() => setActiveCard(value.id)}
                onMouseLeave={() => setActiveCard(null)}
              >
                <div
                  className={`text-6xl mb-4 transition-transform duration-300 ${
                    activeCard === value.id ? "scale-110" : "scale-100"
                  }`}
                >
                  {value.icon}
                </div>
                <h3 className="text-2xl font-bold text-amber-900 mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {value.description}
                </p>
                <div
                  className={`mt-6 h-1 bg-gradient-to-r ${
                    value.color
                  } transition-all duration-500 ${
                    activeCard === value.id ? "w-full" : "w-12"
                  }`}
                ></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline Section */}
      

      {/* Team Section */}
      <div className="bg-gradient-to-b from-amber-50 to-orange-50 py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-amber-900 text-center mb-12">
            Meet Our Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {team.map((member, index) => (
              <div
                key={member.id}
                className={`group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${800 + index * 150}ms` }}
              >
                <div className="relative h-72 overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-amber-900 mb-2">
                    {member.name}
                  </h3>
                  <p className="text-red-600 font-semibold mb-3">
                    {member.role}
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    {member.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative py-20 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=2070')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-amber-900/95 to-red-900/95"></div>
        </div>
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-amber-50 mb-6">
            Begin Your Journey With Us
          </h2>
          <p className="text-xl text-amber-100 mb-8 max-w-2xl mx-auto">
            Join thousands of families who have found their perfect match
            through our platform
          </p>
          <button
            onClick={() => navigate("/contact")} // Add this onClick handler
            className="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-amber-900 transition-all duration-300"
          >
            Contact Us
          </button>
        </div>
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
        .animate-float {
          animation: float linear infinite;
        }
      `}</style>
    </div>
  );
};

export default About;
