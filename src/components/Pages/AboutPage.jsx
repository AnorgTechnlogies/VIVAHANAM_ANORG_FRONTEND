import { useState, useEffect, useRef } from "react";
import MAGURUJI from "../../assets/Guruji-mataji About us.jpeg";
import Chinmay_Gurugi from "../../assets/Chinmay_Image.jpg";

const About = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeCard, setActiveCard] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const topRef = useRef(null);

  useEffect(() => {
    setIsVisible(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const values = [
    {
      id: 1,
      title: "Sacredness of Vivah",
      description:
        "We honor marriage as a divine and sacred bond, sanctified through Vedic rituals such as kanyadaan, mangal phera, saptapadi, and havan, each symbolizing lifelong commitment, duty, and companionship.",
      icon: "🪔",
      color: "from-amber-500 to-orange-600",
    },
    {
      id: 2,
      title: "Vedic Wisdom",
      description:
        "Rooted in timeless Vedic teachings, we believe marriage is a spiritual path that fosters personal growth, harmony, and collective well-being.",
      icon: "📜",
      color: "from-red-500 to-pink-600",
    },
    {
      id: 3,
      title: "Family Unity",
      description:
        "We value marriage as the union of two families, emphasizing shared responsibilities, mutual respect, and the strengthening of familial bonds.",
      icon: "👨‍👩‍👧‍👦",
      color: "from-amber-600 to-yellow-600",
    },
    {
      id: 4,
      title: "Trust and Integrity",
      description:
        "We are committed to honesty, transparency, and ethical practices in building relationships founded on trust and faith.",
      icon: "🤝",
      color: "from-orange-500 to-red-600",
    },
    {
      id: 5,
      title: "Cultural Preservation",
      description:
        "We strive to preserve and celebrate Vedic Indian traditions, rituals, and values while adapting thoughtfully to the needs of modern society.",
      icon: "🪷",
      color: "from-purple-500 to-indigo-600",
    },
    {
      id: 6,
      title: "Harmony of Tradition and Modernity",
      description:
        "Vivahanam bridges ancient rituals with contemporary life, ensuring relevance without compromising spiritual essence.",
      icon: "☯️",
      color: "from-green-500 to-teal-600",
    },
  ];

  return (
    <div className="w-full bg-gradient-to-b from-amber-50 via-orange-50 to-amber-50">
      <div className="py-8 md:py-12 lg:py-16 xl:py-20">
        <div
          ref={topRef}
          className="relative min-h-[70vh] md:min-h-[80vh] flex items-center justify-center overflow-hidden"
        >
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

          <div
            className={`
              relative z-10 w-full px-4 sm:px-6 lg:px-8 
              transition-all duration-1000 py-10
              ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}
            `}
          >
            <div className="text-center mb-8 md:mb-12">
              <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-red-700 leading-tight">
                About Vivahanam
              </h1>
              <p className="text-red-700 text-lg sm:text-xl md:text-2xl lg:text-3xl py-3 font-bold font-serif">
                ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात्
              </p>
              <p className="text-black font-bold text-xl md:text-2xl mt-2">
                May the Almighty God illuminate our intellect and lead us on the righteous path
              </p>
            </div>

            <div className="flex flex-col lg:flex-row items-stretch justify-center gap-6 lg:gap-8 max-w-7xl mx-auto">

              {/* Left Content Box - Divine Guidance */}
              <div className="bg-red-700 backdrop-blur-sm rounded-xl p-3 md:p-6 lg:p-8 flex-1">
                <p className="text-lg sm:text-xl md:text-2xl text-amber-100 font-serif italic mb-3 text-center">
                  "Divine Guidance"
                </p>
                <p className="text-base sm:text-lg md:text-lg text-amber-200 font-semibold text-center">
                  Extravagant weddings make us poor and dishonest <br />Pt. Shriram Sharma Acharya
                </p>
                <div className="h-px w-20 md:w-24 bg-amber-400/50 mx-auto my-2 md:my-2"></div>

                <div className="flex flex-col md:flex-row items-center md:items-start justify-center gap-6 md:gap-10 px-4 sm:px-6 md:px-8 lg:px-10 mb-8 md:mb-10 max-w-6xl mx-auto">
                  <div className="w-full md:w-5/12 lg:w-1/2 flex justify-center md:justify-end shrink-0 ">
                    <img
                      src={MAGURUJI}
                      alt="Guruji and Mataji"
                      className="w-full max-w-[380px] md:max-w-[420px] lg:max-w-[480px] h-auto object-cover rounded-lg border-4 border-amber-400 shadow-xl"
                    />
                  </div>

                  <div className="w-full md:w-7/12 lg:w-1/2 text-amber-100">
                    <p className="
                        text-xs md:text-base lg:text-lg               {/* sm → base → lg */}
                      font-medium 
                      leading-6 md:leading-7 lg:leading-8
                      tracking-wide 
                      text-center md:text-justify
                      max-w-2xl mx-auto md:mx-0
                      ">
                      Blessed by the divine grace of Aadishakti Veda Mata Gayatri,<br />
                      and inspired by the sacred teachings of<br />
                      Gurudev Pt. Shriram Sharma Acharya<br />
                      and Vandaniya Mata Bhagwati Devi Sharma,<br />
                      we dedicate ourselves to
                      self-transformation, service,
                      and the upliftment of society.
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Content Box – Chinmay's message + image */}

               <div className="bg-red-700 backdrop-blur-sm rounded-xl p-3 md:p-6 lg:p-8 flex-1">
                <p className="text-xl sm:text-xl md:text-2xl text-amber-100 font-serif italic mb-3 text-center">
                  "वसुधैव कुटुम्बकम्"
                </p>
                <p className="text-base sm:text-lg md:text-lg text-amber-200 font-semibold text-center">
                  The World is One Family
                </p>
                <div className="h-px w-20 md:w-24 bg-amber-400/50 mx-auto my-2 md:my-2"></div>

              <div className="bg-red-700 backdrop-blur-sm rounded-xl p-5 md:p-6 lg:p-8 flex flex-col lg:flex-row gap-6 lg:gap-10 flex-1">
                <div className="relative w-full lg:w-2/5 min-h-[500px] md:min-h-[600px] flex justify-center lg:justify-end items-start shrink-0 min-h-[auto] md:min-h-[500px]">
                  <img
                    src={Chinmay_Gurugi}
                    alt="Chinmay Guruji"
                    className="w-full max-w-[280px] md:max-w-[340px] lg:max-w-[380px] h-auto object-contain rounded-xl border-4 border-amber-400 shadow-xl "
                  />
                </div>

                  <p className="text-sm sm:text-base md:text-lg text-amber-100 leading-relaxed tracking-wide text-justify max-w-2xl">
                    With Maa Gayatri and Pujya Gurudev's blessings, I am pleased to know that you and your
                    family are doing well. Your thoughtful concern for today's younger generation and the
                    values surrounding marriage is truly appreciable.The vision behind Vivahanam—to create
                    a value-based, culturally and spiritually aligned platform—reflects a sincere effort
                    rooted in dharmic principles. Such initiatives that harmonize tradition with modern
                    life deserve encouragement.
                  </p>
                </div>
              </div>
            </div>

            {/* Mission & Vision Cards */}
            <div className="max-w-7xl mx-auto mt-10 md:mt-16 px-4">
              <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
                <div
                  className={`
                    bg-gradient-to-br from-amber-100 to-white 
                    rounded-3xl shadow-2xl overflow-hidden 
                    border border-amber-100 
                    p-6 md:p-8 flex-1 min-h-[420px]
                  `}
                >
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-red-700 text-center mb-6">
                    Our Mission
                  </h2>
                  <div className="flex items-start gap-6">
                    <div>
                      <p className="text-lg text-gray-700 leading-relaxed mb-3">
                        Vivahanam's mission is to uphold and promote the sacred
                        Vedic understanding of marriage as a divine union of two
                        souls. We strive to create meaningful matrimonial alliances
                        rooted in trust, faith, spirituality, and family values,
                        while honoring time-tested Vedic rituals and principles.
                        Through thoughtful guidance and cultural integrity, we aim
                        to support Vedic Indian–rooted families—especially across
                        North America—in forming marriages that are spiritually
                        fulfilling and socially harmonious.
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  className={`
                    bg-gradient-to-br from-orange-100 to-white 
                    rounded-3xl shadow-2xl overflow-hidden 
                    border border-orange-100 
                    p-6 md:p-8 flex-1
                  `}
                >
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-red-700 text-center mb-6">
                    Our Vision
                  </h2>
                  <div className="flex items-start gap-6">
                    <div>
                      <p className="text-lg text-gray-700 leading-relaxed mb-3">
                        Vivahanam's vision is to serve as a trusted bridge between
                        ancient Vedic wisdom and modern matrimony, where marriage is
                        honored not merely as a social contract, but as a lifelong
                        spiritual journey. Vivahanam envisions a world where
                        marriages strengthen families, preserve cultural heritage,
                        and nurture love, responsibility, and unity — creating
                        generations rooted in values, faith, and mutual respect. We
                        aspire to be a one-stop platform for marriages, supporting
                        families from matchmaking to the wedding ceremony and
                        beyond, while making sacred marriages more affordable,
                        accessible, and widely accepted for all.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Why Choose Us Section */}
            <div className="bg-gradient-to-b from-amber-50 to-orange-50 py-16">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-red-700 mb-6">
                    Vivahanam: Blessed Benefits for a Joyful Life
                  </h2>
                  <div className="h-1 w-24 bg-gradient-to-r from-amber-500 to-red-500 mx-auto"></div>
                </div>

                <div className="max-w-6xl mx-auto">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="space-y-6">
                      {[
                        {
                          icon: "✅",
                          title: "Simple and affordable marriages",
                          description:
                            "Simple and affordable marriages help families avoid unnecessary pressure and expenses.Instead of show and extravagance, Vivahanam promotes meaningful, sacred ceremonies that focus on values, not cost.",
                        },
                        {
                          icon: "✅",
                          title: "Dignity over show-off celebrations",
                          description:
                            "We promote sacred, budget-friendly ceremonies that honor tradition, avoid waste, and reduce financial stress on families.",
                        },
                        {
                          icon: "✅",
                          title: "Authenticity and safety first",
                          description:
                            "Every profile is carefully reviewed to ensure identity, family background, and genuine intent toward marriage.",
                        },
                        {
                          icon: "✅",
                          title: "Support beyond the wedding day",
                          description:
                            "We continue guiding couples with wisdom, counseling, and family harmony practices — nurturing strong relationships for life.",
                        },
                      ].map((feature, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-4 p-6 rounded-xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 group"
                        >
                          <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                            <div className="text-xl text-amber-700">
                              {feature.icon}
                            </div>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-amber-900 mb-2">
                              {feature.title}
                            </h3>
                            <p className="text-gray-600">{feature.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-6">
                      {[
                        {
                          icon: "✅",
                          title: "Find within your spiritual community",
                          description:
                            "Support for like-minded groups — Gayatri Parivar, Jain, Arya Samaj, Chinmaya Mission, Swaminarayan and more.",
                        },
                        {
                          icon: "✅",
                          title: "Collective weddings with blessings",
                          description:
                            "Encouraging sacred, community wedding ceremonies that lower costs, promote equality, and strengthen social bonds.",
                        },
                        {
                          icon: "✅",
                          title: "From matchmaking to family sanskars",
                          description:
                            "Support beyond the wedding — Garbha Sanskar, Namkaran, family rituals, and guidance for a harmonious Vedic life.",
                        },
                        {
                          icon: "✅",
                          title: "Vedic, value-aligned connections",
                          description:
                            "Meaningful matches based on dharma, shared values, family culture, and long-term commitment — not just profiles and photos.",
                        },
                      ].map((feature, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-4 p-6 rounded-xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 group"
                        >
                          <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                            <div className="text-xl text-amber-700">
                              {feature.icon}
                            </div>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-amber-900 mb-2">
                              {feature.title}
                            </h3>
                            <p className="text-gray-600">{feature.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Core Values Section */}
            <div className="bg-gradient-to-b from-amber-50 to-orange-50 py-16">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-red-700 mb-6">
                    Our Core Values
                  </h2>
                  <div className="h-1 w-24 bg-gradient-to-r from-amber-500 to-orange-500 mx-auto mb-8"></div>
                  <p className="text-lg text-3xl text-red-700 font-bold max-w-3xl mx-auto">
                    ॐ सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः । सर्वे भद्राणि पश्यन्तु मा कश्चित् दुःख भाग्भवेत्: ।
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {values.map((value, index) => (
                    <div
                      key={value.id}
                      className={`
                        group bg-white rounded-2xl p-8 shadow-lg 
                        hover:shadow-2xl transition-all duration-500 
                        transform hover:-translate-y-2 cursor-pointer 
                        border border-transparent hover:border-amber-200 
                        h-full flex flex-col
                        ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}
                      `}
                      style={{ transitionDelay: `${300 + index * 100}ms` }}
                      onMouseEnter={() => setActiveCard(value.id)}
                      onMouseLeave={() => setActiveCard(null)}
                    >
                      <div className="flex items-center justify-between mb-6">
                        <div
                          className={`
                            text-5xl transition-transform duration-300
                            ${activeCard === value.id ? "scale-110" : "scale-100"}
                          `}
                        >
                          {value.icon}
                        </div>
                      </div>

                      <h3 className="text-2xl font-bold text-amber-900 mb-4">
                        {value.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed flex-grow">
                        {value.description}
                      </p>

                      <div className="mt-6 pt-6 border-t border-amber-100">
                        <div
                          className={`
                            h-1 bg-gradient-to-r ${value.color}
                            transition-all duration-500
                            ${activeCard === value.id ? "w-full" : "w-0"}
                          `}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-16 text-center">
                  <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-xl p-8 max-w-4xl mx-auto">
                    <p className="text-xl text-amber-900 font-semibold italic">
                      "At Vivahanam, we believe that true marriage is a sacred
                      journey that begins with the union of two souls and extends to
                      the harmony of two families."
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Scroll to Top Button */}
            <button
              onClick={scrollToTop}
              className={`
                fixed bottom-8 right-8 z-50 p-3 rounded-full shadow-lg 
                transition-all duration-300 transform
                ${showScrollTop
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10 pointer-events-none"
                }
                bg-gradient-to-r from-amber-500 to-orange-500 
                hover:from-amber-600 hover:to-orange-600 text-white
              `}
              aria-label="Scroll to top"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 10l7-7m0 0l7 7m-7-7v18"
                ></path>
              </svg>
            </button>
          </div>
        </div>

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
          .animate-float {
            animation: float linear infinite;
          }
        `}</style>
      </div>
    </div>
  );
};

export default About;