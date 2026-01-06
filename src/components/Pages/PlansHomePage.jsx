import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import PlansHomePageImage from "../../assets/Planhomepage.jpg";

const PlansHomePage = () => {
  const navigate = useNavigate()
  const [isVisible, setIsVisible] = useState(false)

  // Auto-scroll to top and trigger animations when component mounts
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
    
    // Delay to trigger animations after page load
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 100)
    
    return () => clearTimeout(timer)
  }, [])

  const handleMatchMaking = () => {
    navigate('/payas')
  }

  const handlePreMaritalInvestigation = () => {
    navigate('/PreMarital-Investigation-page')
  }

  const handleWeddingPlan = () => {
    navigate('/subscription-plans')
  }

  const handleImageClick = () => {
    // navigate('/gallery')
  }

  return (
    <div className="relative min-h-screen bg-amber-100 flex items-center justify-center pt-20 md:pt-28 lg:pt-32 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-amber-400/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.7}s`,
              animationDuration: `${5 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      {/* Decorative gradient circles */}
      <div className="absolute top-10 right-10 w-64 h-64 bg-gradient-to-br from-red-300/20 to-orange-300/20 rounded-full blur-3xl animate-pulse-slow"></div>
      <div
        className="absolute bottom-10 left-10 w-80 h-80 bg-gradient-to-br from-amber-300/20 to-yellow-300/20 rounded-full blur-3xl animate-pulse-slow"
        style={{ animationDelay: "1s" }}
      ></div>

      {/* Main Container - Fixed Height */}
      <div className="w-full max-w-7xl mx-auto relative z-10">
        <div 
          className={`transition-all duration-1000 ${
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-10"
          }`}
        >
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-20 h-[85vh] max-h-[800px] min-h-[500px]">
            <div className="flex flex-col lg:flex-row h-full">
              
              {/* Left Side - Image with Fixed Height */}
              <div 
                className="lg:w-1/2 h-1/2 lg:h-full relative cursor-pointer group"
                onClick={handleImageClick}
              >
                <img 
                  src={PlansHomePageImage}
                  alt="Wedding Planning" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent lg:bg-gradient-to-r lg:from-black/60 lg:to-transparent group-hover:from-black/70 transition-all duration-300"></div>
                
                {/* Text Overlay with Animation */}
                <div 
                  className={`absolute bottom-4 left-4 sm:bottom-6 sm:left-6 lg:bottom-12 lg:left-12 text-white transition-all duration-1000 delay-300 ${
                    isVisible
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 -translate-x-10"
                  }`}
                >
                  {/* <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2">Find Your Perfect Match</h2> */}
                  <div className="mt-1 sm:mt-2 flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {/* Optional: Add some interactive element here */}
                  </div>
                </div>
              </div>
              
              {/* Right Side - Content with Fixed Height */}
              <div className="lg:w-1/2 h-1/2 lg:h-full flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 lg:p-12 bg-amber-100 ">
                {/* Header with Animation */}
                <div 
                  className={` text-center mb-1 sm:mb-6 md:mb-8 w-full transition-all duration-1000 delay-200 ${
                    isVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-10"
                  }`}
                >
                  <div className="inline-flex items-center space-x-3 mb-2 ">
                    <div className="h-1 w-8 bg-gradient-to-r from-amber-500 to-red-600"></div>
                    <span className="text-amber-700 text-sm font-semibold tracking-wider uppercase">
                      Choose Your Path
                    </span>
                    <div className="h-1 w-8 bg-gradient-to-l from-amber-500 to-red-600"></div>
                  </div>
                  
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-2 sm:mb-3">
                    Your Journey <span className="text-amber-600">Begins Here</span>
                  </h1>
                  <p className="text-gray-600 text-sm sm:text-base md:text-lg max-w-md mx-auto">
                    Choose your path to happiness and celebration
                  </p>
                </div>

                {/* Buttons Container with Staggered Animation */}
                <div className="w-full max-w-xs sm:max-w-sm space-y-3 sm:space-y-4 md:space-y-6">
                  {/* Match Making Button */}
                  <div 
                    className={`transition-all duration-700 delay-300 ${
                      isVisible
                        ? "opacity-100 translate-x-0"
                        : "opacity-0 -translate-x-10"
                    }`}
                  >
                    <button 
                      onClick={handleMatchMaking}
                      className="w-full group relative overflow-hidden bg-red-500 hover:bg-red-600 text-white font-semibold py-3 sm:py-4 px-4 sm:px-6 rounded-xl sm:rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl flex items-center justify-center space-x-2 sm:space-x-3"
                    >
                      <div className="absolute inset-0 bg-white/10 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                      <div className="relative z-10 flex items-center space-x-2 sm:space-x-3">
                        <div className="p-1 sm:p-1.5 bg-white/20 rounded-lg">
                          <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                          </svg>
                        </div>
                        <span className="text-base sm:text-lg md:text-xl">MatchMaking Services</span>
                      </div>
                    </button>
                  </div>
                  
                  {/* Wedding Plan Button */}
                  <div 
                    className={`transition-all duration-700 delay-400 ${
                      isVisible
                        ? "opacity-100 translate-x-0"
                        : "opacity-0 -translate-x-10"
                    }`}
                  >
                    <button 
                      onClick={handleWeddingPlan}
                      className="w-full group relative overflow-hidden bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-semibold py-3 sm:py-4 px-4 sm:px-6 rounded-xl sm:rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl flex items-center justify-center space-x-2 sm:space-x-3"
                    >
                      <div className="absolute inset-0 bg-white/10 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                      <div className="relative z-10 flex items-center space-x-2 sm:space-x-3">
                        <div className="p-1 sm:p-1.5 bg-white/20 rounded-lg">
                          <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                          </svg>
                        </div>
                        <span className="text-base sm:text-lg md:text-xl">Wedding Services</span>
                      </div>
                    </button>
                  </div>

                  {/* Pre-Marital Investigation Service Button */}
                  <div 
                    className={`transition-all duration-700 delay-500 ${
                      isVisible
                        ? "opacity-100 translate-x-0"
                        : "opacity-0 -translate-x-10"
                    }`}
                  >
                    <button 
                      onClick={handlePreMaritalInvestigation}
                      className="w-full group relative overflow-hidden bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white font-semibold py-3 sm:py-4 px-4 sm:px-6 rounded-xl sm:rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl flex items-center justify-center space-x-2 sm:space-x-3"
                    >
                      <div className="absolute inset-0 bg-white/10 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                      <div className="relative z-10 flex items-center space-x-2 sm:space-x-3">
                        <div className="p-1 sm:p-1.5 bg-white/20 rounded-lg">
                          <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                        </div>
                        <span className="text-base sm:text-lg md:text-xl">Additional Services</span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Footer Text with Animation */}
                <div 
                  className={`mt-4 sm:mt-6 md:mt-8 text-center w-full transition-all duration-1000 delay-600 ${
                    isVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-10"
                  }`}
                >
                  {/* <p className="text-gray-500 text-xs sm:text-sm">
                    Trusted by thousands of happy couples worldwide
                  </p> */}
                  {/* Optional: Add star rating or other elements here */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Animation Styles */}
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-40px) translateX(30px);
            opacity: 0.6;
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        .animate-float {
          animation: float linear infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}

export default PlansHomePage