import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const About = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeCard, setActiveCard] = useState(null);
  const [achievementValues, setAchievementValues] = useState({
    successfulMatches: 0,
    satisfactionRate: 0,
    citiesCovered: 0,
    familiesTrusted: 0
  });
  const [visionValues, setVisionValues] = useState({
    couplesToUnite: 0,
    citiesWorldwide: 0,
    culturalEvents: 0
  });
  const [countersStarted, setCountersStarted] = useState(false);
  const navigate = useNavigate();
  const visionSectionRef = useRef(null);
  const achievementSectionRef = useRef(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!countersStarted) {
        const visionSection = visionSectionRef.current;
        const achievementSection = achievementSectionRef.current;
        
        if (visionSection) {
          const rect = visionSection.getBoundingClientRect();
          if (rect.top < window.innerHeight * 0.8 && rect.bottom > 0) {
            startVisionCounters();
          }
        }
        
        if (achievementSection) {
          const rect = achievementSection.getBoundingClientRect();
          if (rect.top < window.innerHeight * 0.8 && rect.bottom > 0) {
            startAchievementCounters();
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check on initial load

    return () => window.removeEventListener('scroll', handleScroll);
  }, [countersStarted]);

  const startVisionCounters = () => {
    if (countersStarted) return;
    
    const duration = 2000; // 2 seconds
    const steps = 60;
    const increment = (target, current) => (target - current) / steps;
    const interval = duration / steps;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      
      setVisionValues(prev => ({
        couplesToUnite: Math.min(prev.couplesToUnite + increment(100, prev.couplesToUnite), 100),
        citiesWorldwide: Math.min(prev.citiesWorldwide + increment(100, prev.citiesWorldwide), 100),
        culturalEvents: Math.min(prev.culturalEvents + increment(50, prev.culturalEvents), 50)
      }));

      if (step >= steps) {
        clearInterval(timer);
        setVisionValues({
          couplesToUnite: 100,
          citiesWorldwide: 100,
          culturalEvents: 50
        });
        setCountersStarted(true);
      }
    }, interval);
  };

  const startAchievementCounters = () => {
    if (countersStarted) return;
    
    const duration = 2000; // 2 seconds
    const steps = 60;
    const increment = (target, current) => (target - current) / steps;
    const interval = duration / steps;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      
      setAchievementValues(prev => ({
        successfulMatches: Math.min(prev.successfulMatches + increment(500, prev.successfulMatches), 500),
        satisfactionRate: Math.min(prev.satisfactionRate + increment(98, prev.satisfactionRate), 98),
        citiesCovered: Math.min(prev.citiesCovered + increment(50, prev.citiesCovered), 50),
        familiesTrusted: 10000 // This one doesn't animate
      }));

      if (step >= steps) {
        clearInterval(timer);
        setAchievementValues({
          successfulMatches: 500,
          satisfactionRate: 98,
          citiesCovered: 50,
          familiesTrusted: 10000
        });
        setCountersStarted(true);
      }
    }, interval);
  };

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
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?q=80&w=300",
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

  const steps = [
    {
      id: 1,
      title: "Register",
      description: "Create your account with basic details",
      icon: "📝",
    },
    {
      id: 2,
      title: "Profile Setup",
      description: "Complete your profile with preferences & details",
      icon: "👤",
    },
    {
      id: 3,
      title: "Match Search",
      description: "Find compatible matches using advanced filters",
      icon: "🔍",
    },
    {
      id: 4,
      title: "Contact",
      description: "Connect with matches through our secure platform",
      icon: "💬",
    },
    {
      id: 5,
      title: "Connect",
      description: "Build meaningful relationships with guidance",
      icon: "🤝",
    },
  ];

  return (
    <div className="w-full bg-gradient-to-b from-amber-50 via-orange-50 to-amber-50">
      {/* Hero Section */}
      <div className="relative h-[45vh] md:h-[50vh] flex items-center justify-center overflow-hidden">
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
          {[...Array(6)].map((_, i) => (
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
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-amber-50 mb-4 leading-tight">
            About Vivahanam
          </h1>
          <div className="h-1 w-24 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mb-4"></div>
          <p className="text-lg sm:text-xl md:text-2xl text-amber-100 font-serif italic">
            "वसुधैव कुटुंबकम्"
          </p>
          <p className="text-base sm:text-lg text-amber-200 mt-2">
            The World is One Family
          </p>
        </div>
      </div>

      {/* Mission & Vision Combined Section */}
      <div className="bg-gradient-to-b from-amber-50 to-orange-50 py-16 md:py-5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Mission Section */}
          <div className="max-w-6xl mx-auto mb-50">
            <div className={`transition-all duration-1000 delay-200 ${
              isVisible ? "opacity-100" : "opacity-0"
            }`}>
              <div className="text-center mb-20">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-amber-900 mb-4">
                  Our Mission
                </h2>
                <div className="h-1 w-24 bg-gradient-to-r from-amber-500 to-orange-500 mx-auto mb-6"></div>
                <p className="text-xl md:text-2xl font-serif italic text-amber-800 mb-8 max-w-3xl mx-auto">
                  "Preserving traditions while building futures"
                </p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 border border-amber-100 h-full">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center">
                        <span className="text-2xl text-white">🏛️</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-amber-900 mb-2">
                        Bridging Generations
                      </h3>
                      <p className="text-gray-700 leading-relaxed">
                        At Vivahanam, we bridge the gap between ancient Vedic wisdom and modern 
                        matrimonial needs, creating a platform that respects tradition while embracing 
                        contemporary values.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 mb-6">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                        <span className="text-2xl text-white">❤️</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-amber-900 mb-2">
                        Authentic Connections
                      </h3>
                      <p className="text-gray-700 leading-relaxed">
                        We're dedicated to fostering genuine relationships built on shared cultural 
                        heritage, spiritual values, and mutual respect - creating bonds that last 
                        a lifetime.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg flex items-center justify-center">
                        <span className="text-2xl text-white">🤝</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-amber-900 mb-2">
                        Community Building
                      </h3>
                      <p className="text-gray-700 leading-relaxed">
                        Beyond matchmaking, we cultivate a vibrant community where tradition thrives, 
                        families connect, and love blossoms in perfect alignment with Dharma.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="bg-gradient-to-br from-amber-100 to-orange-50 rounded-2xl p-6 border-2 border-amber-200">
                    <div className="absolute -top-4 -left-4 w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
                      <span className="text-3xl">✨</span>
                    </div>
                    
                    <div className="p-6 bg-white/90 backdrop-blur-sm rounded-xl mt-8">
                      <h4 className="text-xl font-bold text-amber-900 mb-4 text-center">
                        Our Commitment
                      </h4>
                      <ul className="space-y-3">
                        <li className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                          <span className="text-gray-700">Preserve sacred Vedic matrimonial traditions</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                          <span className="text-gray-700">Ensure 100% verified and authentic profiles</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                          <span className="text-gray-700">Provide personalized matchmaking guidance</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                          <span className="text-gray-700">Support families throughout the journey</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Vision Section */}
          <div ref={visionSectionRef} className="max-w-6xl mx-auto">
            <div className={`transition-all duration-1000 delay-400 ${
              isVisible ? "opacity-100" : "opacity-0"
            }`}>
              <div className="text-center mb-10">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-amber-900 mb-4">
                  Our Vision
                </h2>
                <div className="h-1 w-24 bg-gradient-to-r from-orange-500 to-red-500 mx-auto mb-6"></div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="bg-gradient-to-br from-amber-50 to-white rounded-2xl p-8 shadow-xl border border-amber-100">
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full mb-4">
                      <span className="text-4xl">🌍</span>
                    </div>
                    <h3 className="text-2xl font-bold text-amber-900 mb-3">
                      Global Trust
                    </h3>
                    <p className="text-gray-700">
                      To become the most trusted platform for Hindu matrimony worldwide, 
                      where technology meets tradition to create lifelong partnerships.
                    </p>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-orange-50 to-white rounded-2xl p-8 shadow-xl border border-orange-100">
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full mb-4">
                      <span className="text-4xl">🎯</span>
                    </div>
                    <h3 className="text-2xl font-bold text-amber-900 mb-3">
                      Cultural Preservation
                    </h3>
                    <p className="text-gray-700">
                      A future where every Hindu family finds their perfect match while 
                      staying true to their cultural roots and spiritual values.
                    </p>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-red-50 to-white rounded-2xl p-8 shadow-xl border border-red-100">
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-400 to-red-600 rounded-full mb-4">
                      <span className="text-4xl">🚀</span>
                    </div>
                    <h3 className="text-2xl font-bold text-amber-900 mb-3">
                      2030 Goals
                    </h3>
                    <p className="text-gray-700">
                      Unite 10,000+ couples globally while preserving and promoting 
                      Vedic marriage traditions for generations to come.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Vision in Numbers - Animated */}
              <div className="mt-12 bg-gradient-to-r from-amber-100 to-orange-100 rounded-2xl p-8">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-amber-900">
                    Vision in Numbers
                  </h3>
                  <p className="text-gray-700 mt-2">
                    Our measurable goals for the coming decade
                  </p>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {[
                    { 
                      number: Math.floor(visionValues.couplesToUnite), 
                      label: "Couples to Unite", 
                      color: "bg-amber-500",
                      suffix: "+",
                      prefix: ""
                    },
                    { 
                      number: Math.floor(visionValues.citiesWorldwide), 
                      label: "Cities Worldwide", 
                      color: "bg-orange-500",
                      suffix: "+",
                      prefix: ""
                    },
                    { 
                      number: Math.floor(visionValues.culturalEvents), 
                      label: "Cultural Events", 
                      color: "bg-red-500",
                      suffix: "+",
                      prefix: ""
                    },
                    { 
                      number: 24, 
                      label: "Global Support", 
                      color: "bg-pink-500",
                      suffix: "/7",
                      prefix: ""
                    }
                  ].map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className={`w-16 h-16 ${stat.color} rounded-full flex items-center justify-center mx-auto mb-3`}>
                        <span className="text-2xl font-bold text-white">
                          {stat.prefix}{stat.number}{stat.suffix}
                        </span>
                      </div>
                      <p className="text-gray-700 font-medium">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Us / Unique Selling Point Section */}
      <div ref={achievementSectionRef} className="bg-gradient-to-b from-amber-50 to-orange-50 py-5 md:py-5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-amber-900 text-center mb-12">
            Why Choose Vivahanam?
          </h2>
          
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Side - USP Points */}
              <div>
                <div className="space-y-8">
                  {[
                    {
                      icon: "✅",
                      title: "Vedic Compatibility Matching",
                      description: "Our unique algorithm combines traditional Kundali matching with modern compatibility metrics"
                    },
                    {
                      icon: "✅",
                      title: "100% Verified Profiles",
                      description: "Every profile undergoes thorough verification for authenticity and security"
                    },
                    {
                      icon: "✅",
                      title: "Personalized Matchmaking",
                      description: "Dedicated relationship experts provide personalized guidance at every step"
                    },
                    {
                      icon: "✅",
                      title: "Cultural Sensitivity",
                      description: "Deep understanding of regional customs, traditions, and family expectations"
                    },
                    {
                      icon: "✅",
                      title: "Post-Match Support",
                      description: "Continued guidance through engagement and wedding planning processes"
                    }
                  ].map((feature, index) => (
                    <div 
                      key={index}
                      className={`flex items-start gap-4 p-4 rounded-xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 ${
                        isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
                      }`}
                      style={{ transitionDelay: `${700 + index * 100}ms` }}
                    >
                      <div className="text-2xl">{feature.icon}</div>
                      <div>
                        <h3 className="text-xl font-bold text-amber-900 mb-2">
                          {feature.title}
                        </h3>
                        <p className="text-gray-600">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Right Side - Stats & Achievement - Animated */}
              <div className="bg-gradient-to-br from-amber-100 to-red-50 rounded-2xl shadow-2xl p-8 md:p-10 border border-amber-200">
                <div className="text-center mb-8">
                  <h3 className="text-2xl md:text-3xl font-bold text-amber-900 mb-4">
                    Our Achievements
                  </h3>
                  <div className="h-1 w-24 bg-gradient-to-r from-amber-500 to-red-500 mx-auto mb-6"></div>
                </div>
                
                <div className="grid grid-cols-2 gap-6 mb-8">
                  {[
                    { 
                      number: Math.floor(achievementValues.successfulMatches), 
                      label: "Successful Matches",
                      suffix: "+"
                    },
                    { 
                      number: Math.floor(achievementValues.satisfactionRate), 
                      label: "Satisfaction Rate",
                      suffix: "%"
                    },
                    { 
                      number: Math.floor(achievementValues.citiesCovered), 
                      label: "Cities Covered",
                      suffix: "+"
                    },
                    { 
                      number: 24, 
                      label: "Support Available",
                      suffix: "/7"
                    }
                  ].map((stat, index) => (
                    <div 
                      key={index}
                      className="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center shadow-lg"
                    >
                      <div className="text-3xl md:text-4xl font-bold text-amber-800">
                        {stat.number}{stat.suffix}
                      </div>
                      <div className="text-gray-700 font-medium">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="bg-white/90 rounded-xl p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-red-600 rounded-full flex items-center justify-center">
                      <span className="text-2xl">🏆</span>
                    </div>
                    <h4 className="text-xl font-bold text-amber-900">
                      Trusted by {achievementValues.familiesTrusted.toLocaleString()}+ Families
                    </h4>
                  </div>
                  <p className="text-gray-700">
                    Recognized as North America's leading platform for traditional Hindu matrimony, 
                    combining ancient wisdom with modern technology for meaningful connections.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Core Values Section */}
      <div className="bg-gradient-to-b from-amber-50 to-orange-50 py-5 md:py-1 mb-">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-amber-900 text-center mb-15">
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

      {/* How It Works Section */}
      <div className="bg-gradient-to-b from-amber-50 to-orange-50 py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-amber-900 text-center mb-12">
            How It Works
          </h2>
          
          <div className="relative max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 relative z-10">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className={`group ${
                    isVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-10"
                  } transition-all duration-500`}
                  style={{ transitionDelay: `${500 + index * 150}ms` }}
                >
                  <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 h-full">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                        <span className="text-3xl">{step.icon}</span>
                      </div>
                      <div className="mb-2">
                        <span className="inline-block px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-semibold">
                          Step {step.id}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-amber-900 mb-2">
                        {step.title}
                      </h3>
                      <p className="text-gray-600">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Mobile View Steps Connection */}
            <div className="lg:hidden flex justify-center items-center mt-8">
              <div className="flex items-center space-x-4">
                {steps.slice(0, -1).map((_, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-6 h-1 bg-gradient-to-r from-amber-400 to-orange-500"></div>
                    <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="bg-gradient-to-b from-amber-50 to-orange-50 py-5 md:py-5">
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
            onClick={() => navigate("/contact")}
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