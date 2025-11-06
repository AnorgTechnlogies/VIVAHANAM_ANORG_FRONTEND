import { useState, useEffect } from "react";
// import image4 from "../assets/image4.png";
import Home2Img from "../assets/Home2Img.jpg";
import Home3Img from "../assets/Home3Img.jpg";
import image from "../assets/image.png";
import unnamedImage from "../assets/unnamed.jpg";
import Home5RitualImg from "../assets/Home5RitualImg.jpg";
import { useNavigate } from "react-router-dom";
import Home1 from "../assets/HomeImage1.jpg";

const HomePage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState("login"); // 'login', 'signup', 'forgot'
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authName, setAuthName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [User, setUser] = useState(null); // Simulate logged-in user state
  const [error, setError] = useState(""); // Added missing error state

  const navigate = useNavigate();

  const handleNewsletterSubmit = () => {
    console.log("Email submitted:", newsletterEmail);
    // Add your newsletter subscription logic here
  };
  const handleFreeRegistration = () => {
    navigate("/partners/registerProfile");
  };

  // Consolidated and fixed handleAuthSubmit function
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (authMode === "forgot") {
      if (!authEmail) {
        setError("Please enter email");
        return;
      }
      // TODO: Implement forgot password API
      console.log("Reset email sent to:", authEmail);
      alert("Reset link sent to your email!");
      setAuthMode("login");
      setAuthEmail("");
      return;
    }

    // for login and signup
    if (!authEmail || !authPassword) {
      setError("Please fill in email and password");
      return;
    }
    if (authMode === "signup") {
      if (!authName) {
        setError("Please enter name");
        return;
      }
      if (authPassword !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }
    }

    // TODO: Replace with actual Redux dispatch if using Redux
    // For now, simulate success without await/dispatch
    console.log(`${authMode} successful:`, {
      email: authEmail,
      name: authMode === "signup" ? authName : undefined,
    });
    setUser({
      email: authEmail,
      ...(authMode === "signup" && { name: authName }),
    });
    setShowAuthModal(false);
    // Navigate to partner page after successful auth
    navigate("/partners"); // Assuming "/partners" is the route for the partner search page with blurry profiles

    // If using Redux, uncomment and import useDispatch from 'react-redux'
    // const dispatch = useDispatch();
    // try {
    //   if (authMode === "signup") {
    //     const result = await dispatch(registeradmin({ adminEmailId: authEmail, adminPassword: authPassword, name: authName })).unwrap();
    //     console.log("Signup successful:", result);
    //     setShowAuthModal(false);
    //     navigate("/partners");
    //   } else {
    //     const result = await dispatch(login({ adminEmailId: authEmail, adminPassword: authPassword })).unwrap();
    //     console.log("Login successful:", result);
    //     setShowAuthModal(false);
    //     navigate("/partners");
    //   }
    // } catch (err) {
    //   setError(err.message || (authMode === "signup" ? "Signup failed" : "Login failed"));
    // }
  };
  // Add this import for loading state
  // const [isLoading, setIsLoading] = useState(false);

  // // In handleAuthSubmit, replace the entire function with this:
  // const handleAuthSubmit = async (e) => {
  //   e.preventDefault();
  //   setError("");
  //   setIsLoading(true); // Start loading

  //   const API_URL = import.meta.env.VITE_API_URL; // e.g., http://localhost:5000

  //   if (authMode === "forgot") {
  //     if (!authEmail) {
  //       setError("Please enter email");
  //       setIsLoading(false);
  //       return;
  //     }

  //     try {
  //       const response = await fetch(`${API_URL}/api/user/forgot-password`, {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({ email: authEmail }),
  //       });

  //       const data = await response.json();

  //       if (response.ok) {
  //         alert("Reset link sent to your email!"); // Or use a toast notification
  //         setAuthMode("login");
  //         setAuthEmail("");
  //       } else {
  //         setError(data.message || "Failed to send reset link");
  //       }
  //     } catch (err) {
  //       console.error("Forgot password error:", err);
  //       setError("Something went wrong. Please try again.");
  //     } finally {
  //       setIsLoading(false);
  //     }
  //     return;
  //   }

  //   // For login and signup
  //   if (!authEmail || !authPassword) {
  //     setError("Please fill in email and password");
  //     setIsLoading(false);
  //     return;
  //   }

  //   if (authMode === "signup") {
  //     if (!authName) {
  //       setError("Please enter name");
  //       setIsLoading(false);
  //       return;
  //     }
  //     if (authPassword !== confirmPassword) {
  //       setError("Passwords do not match");
  //       setIsLoading(false);
  //       return;
  //     }
  //   }

  //   try {
  //     let endpoint = authMode === "signup" ? "/api/user/signup" : "/api/user/login";
  //     let body = authMode === "signup"
  //       ? { name: authName, email: authEmail, password: authPassword }
  //       : { email: authEmail, password: authPassword };

  //     const response = await fetch(`${API_URL}${endpoint}`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(body),
  //     });

  //     const data = await response.json();

  //     if (response.ok) {
  //       // Set user state with token for future auth
  //       setUser({
  //         id: data.user.id,
  //         name: data.user.name,
  //         email: data.user.email,
  //         token: data.token, // Store token here; optionally: localStorage.setItem('token', data.token);
  //       });
  //       setShowAuthModal(false);
  //       navigate("/partners"); // Navigate after success
  //       console.log(`${authMode} successful:`, data.user);
  //     } else {
  //       setError(data.message || (authMode === "signup" ? "Signup failed" : "Login failed"));
  //     }
  //   } catch (err) {
  //     console.error(`${authMode} error:`, err);
  //     setError("Something went wrong. Please try again.");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const switchToSignup = () => {
    setAuthMode("signup");
    setAuthEmail("");
    setAuthPassword("");
    setAuthName("");
    setConfirmPassword("");
    setError("");
  };

  const switchToLogin = () => {
    setAuthMode("login");
    setAuthEmail("");
    setAuthPassword("");
    setAuthName("");
    setConfirmPassword("");
    setError("");
  };

  useEffect(() => {
    // Trigger animations after component mounts
    setIsVisible(true);
  }, []);

  const services = [
    {
      id: 1,
      title: "Pre-Wedding Consultation",
      price: "$25",
      image:
        "https://img.freepik.com/premium-photo/wedding-stage-with-gold-couch-two-chairs_846334-229.jpg",
      alt: "Pre-Wedding Consultation",
    },
    {
      id: 2,
      title: "Wedding Package Planning",
      price: "$25",
      image: image,
      alt: "Wedding Package Planning",
    },
    {
      id: 3,
      title: "Matchmaking Consultation",
      price: "$25",
      image:
        "https://images.unsplash.com/photo-1587271407850-8d438ca9fdf2?q=80&w=2070",
      alt: "Matchmaking Consultation",
    },
  ];

  // const handleDiscoverMore = () => {
  //   console.log("Discover More clicked");
  //   // Add your navigation logic here
  // };

  const handleBookNow = (serviceName) => {
    console.log(`Booking: ${serviceName}`);
    // Add your booking logic here
  };

  // const handleSeeMore = () => {
  //   console.log("See More clicked");
  //   // Add your navigation logic here
  // };

  const workItems = [
    {
      id: 1,
      title: "Matchmaking",
      description:
        "Our matchmaking services focus on understanding individual preferences and values, enabling us to connect compatible matches. We delve into cultural nuances to create meaningful connections that resonate with your heritage.",
      image:
        "https://images.unsplash.com/photo-1529636798458-92182e662485?q=80&w=2069",
    },
    {
      id: 2,
      title: "Consultations",
      description:
        "Pre-wedding consultations help navigate the planning process seamlessly. Our team guides you through every step, ensuring that your celebration reflects your personal and cultural values.",
      image:
        "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2069",
    },
    {
      id: 3,
      title: "Rituals",
      description:
        "We provide comprehensive information on traditional wedding rituals, enriching your understanding of significance behind each ceremony. Our goal is to harmonize modern desires with time-honored practices.",
      image: Home5RitualImg,
    },
  ];

  return (
    <>
      {/* First Section - English Content */}
      <div className="relative w-full min-h-[80vh] sm:min-h-[70vh] md:h-screen overflow-hidden bg-amber-100">
        <div className="w-full flex flex-col items-center justify-start py-8 sm:py-12 md:py-0">
          <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 w-full items-center">
              {/* Left Side - Image (top on mobile, left on desktop) */}
              <div className="flex items-center justify-center lg:justify-start order-1 lg:order-1 w-full mb-6 lg:mb-0">
                <div className="relative w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl mx-auto lg:mx-0">
                  <img
                    src={Home1}
                    alt="Vedic Wedding Ceremony"
                    className="w-full h-auto rounded-2xl shadow-2xl object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
              </div>

              {/* Right Side - Content (bottom on mobile, right on desktop) */}
              <div className="flex flex-col justify-center space-y-4 sm:space-y-6 lg:space-y-8 order-2 lg:order-2 w-full px-4 lg:px-0 text-center lg:text-left">
                {/* English Heading */}
                <div className="hidden xl:block text-sm lg:text-base font-serif text-gray-800 max-w-2xl text-center leading-relaxed tracking-wide font-bold">
                  <span className="font-extrabold text-red-800">V</span>edic{" "}
                  <span className="font-extrabold text-red-800">I</span>ndian{" "}
                  <span className="font-extrabold text-red-800">V</span>ivah{" "}
                  <span className="text-black">–</span>{" "}
                  <span className="font-extrabold text-red-800">A</span>uthentic{" "}
                  <span className="font-extrabold text-red-800">H</span>oly{" "}
                  <span className="font-extrabold text-red-800">A</span>lliances{" "}
                  <span className="font-extrabold text-red-800">O</span>f{" "}
                  <span className="font-extrabold text-red-800">N</span>orth{" "}
                  <span className="font-extrabold text-red-800">A</span>merican{" "}
                  <span className="font-extrabold text-red-800">M</span>atrimony
                </div>
                <h1
                  className={`text-sm sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold text-gray-800 leading-tight transition-all duration-700 delay-100 ${
                    isVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 -translate-y-5"
                  }`}
                >
                  Creating Memories
                </h1>

                {/* Sanskrit Line */}
                <h2
                  className={`text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-red-700 leading-tight transition-all duration-700 delay-300 ${
                    isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
                  }`}
                  style={{ fontFamily: "serif" }}
                >
                  वसुधैव कुटुंबकम्
                </h2>

                {/* Subheading */}
                <h3
                  className={`text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold text-gray-800 leading-tight transition-all duration-700 delay-500 ${
                    isVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-5"
                  }`}
                  style={{ color: "#030303" }}
                >
                  Connect With Soulmates
                </h3>

                {/* Description - Pyramid alignment with responsive widths */}
                {/* <p
                  className={`text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-black-800 leading-relaxed max-w-xs sm:max-w-sm md:max-w-md lg:max-w-2xl xl:max-w-3xl 2xl:max-w-4xl mt-2 font-bold px-2 sm:px-0 transition-all duration-700 delay-700 ${
                    isVisible ? "opacity-100" : "opacity-0"
                  }`}
                >
                  A trusted platform for Vedic Indian matrimony. <br />
                  fostering authentic holy alliances and meaningful connections
                  within North America's diverse communities.
                </p>  */}
                <p
                  className={`text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-gray-700 leading-relaxed max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mx-auto lg:mx-0 font-medium transition-all duration-700 delay-700 break-words ${
                    isVisible ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <span className="block w-full max-w-[80%] mx-auto lg:mx-0">
                    A trusted platform for Vedic Indian matrimony.
                  </span>
                  <span className="block w-full max-w-full mx-auto lg:mx-0">
                    fostering authentic holy alliances and meaningful
                    connections
                  </span>
                  <span className="block w-full max-w-[70%] mx-auto lg:mx-0">
                    within North America's diverse communities.
                  </span>
                </p>

                {/* Buttons - Centered on mobile, left-aligned on desktop */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6 justify-center lg:justify-start">
                  <button
                    className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 w-full sm:w-auto min-w-[160px] sm:min-w-[180px]"
                    onClick={() => {
                      setShowAuthModal(true);
                      setAuthMode("login");
                    }}
                  >
                    Login
                  </button>
                  <button
                    className="px-6 py-4 bg-red-600 text-white rounded-md font-semibold hover:bg-red-700 transition-colors"
                    onClick={handleFreeRegistration}
                  >
                    Register free
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Second Section - Hindi Content */}
      <div className="relative w-full min-h-[80vh] sm:min-h-[70vh] md:h-screen overflow-hidden bg-amber-100">
        <div className="w-full flex flex-col items-center justify-start py-8 sm:py-12 md:py-0">
          <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 w-full items-center">
              {/* Right Side - Image (top on mobile, right on desktop) */}
              <div className="flex items-center justify-center lg:justify-end order-1 lg:order-2 w-full mb-6 lg:mb-0">
                <div className="relative w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl mx-auto lg:mx-0">
                  <img
                    src={Home2Img}
                    alt="Vedic Wedding Ceremony"
                    className="w-full h-auto rounded-2xl shadow-2xl object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
              </div>

              {/* Left Side - Content (bottom on mobile, left on desktop) */}
              <div className="flex flex-col justify-center space-y-4 sm:space-y-6 lg:space-y-8 order-2 lg:order-1 w-full px-4 lg:px-0 text-center lg:text-left">
                {/* Hindi Heading */}
                <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-800 leading-tight sm:leading-snug md:leading-tight break-words hyphens-auto">
                  वैदिक भारतीय विवाह एवं प्रामाणिक पवित्र संबंध -
                </h1>

                {/* Red Subheading */}
                <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold text-red-700 leading-tight sm:leading-snug break-words hyphens-auto">
                  उत्तर अमेरिकी वैवाहिक संस्था
                </h2>

                {/* English Description */}
                <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-gray-700 leading-relaxed max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mx-auto lg:mx-0 mt-2 px-2 sm:px-0 break-words">
                  Vivahanam preserves Vedic marriage traditions, uniting couples
                  through sacred rituals and family values, bridging ancient
                  spirituality with modern matrimony for Hindu families across
                  North America.
                </p>

                {/* Optional CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-3 sm:pt-4 justify-center lg:justify-start">
                  <button
                    className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 w-full sm:w-auto min-w-[160px] sm:min-w-[180px] "
                    onClick={() => navigate("/about")}
                  >
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Newsletter Section */}
      <div className="relative w-full min-h-screen bg-amber-100 bg-gradient-to-bt from-amber-100 via-orange-100 to-amber-100 py-12 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 ">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Left Side - Image */}
            <div className="flex justify-center lg:justify-start order-2 lg:order-1">
              <div className="relative w-full max-w-md lg:max-w-lg">
                <img
                  src={Home3Img}
                  alt="Wedding Couple"
                  className="w-full h-auto rounded-2xl shadow-2xl object-cover"
                />
                {/* Decorative elements */}
                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-amber-400 to-orange-400 rounded-full opacity-20 blur-3xl -z-10"></div>
                <div className="absolute -top-6 -right-6 w-40 h-40 bg-gradient-to-br from-stone-400 to-amber-300 rounded-full opacity-20 blur-3xl -z-10"></div>
              </div>
            </div>

            {/* Right Side - Newsletter Form */}
            <div className="flex flex-col justify-center space-y-6 lg:space-y-8 order-1 lg:order-2">
              {/* Heading */}
              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-amber-800 leading-tight text-center lg:text-left">
                Join our Newsletter
              </h2>

              {/* Subheading */}
              <p className="text-lg sm:text-xl md:text-2xl text-gray-600 text-center lg:text-left">
                Stay Updated on Wedding Trends
              </p>

              {/* Email Input */}
              <div className="space-y-6">
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Enter Your Email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="w-full px-0 py-3 text-base sm:text-lg bg-transparent border-b-2 border-gray-400 focus:border-amber-700 outline-none transition-colors duration-300 placeholder-gray-500"
                  />
                </div>

                {/* Subscribe Button */}
                <div className="flex justify-center lg:justify-start pt-4">
                  <button
                    onClick={handleNewsletterSubmit}
                    className="px-10 py-4 bg-gradient-to-r from-amber-700 to-amber-800 text-white text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl hover:from-amber-800 hover:to-amber-900 transform hover:-translate-y-0.5 transition-all duration-300"
                  >
                    Submit Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative w-full min-h-screen overflow-hidden">
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1525258834046-fd4c94d5b050?q=80&w=2070')",
          }}
        >
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-amber-950/95 via-amber-900/90 to-transparent"></div>
        </div>

        {/* Content Container */}
        <div className="relative h-full min-h-screen w-full flex items-center py-12 md:py-16 lg:py-20">
          <div className="container mx-auto px-6 md:px-12 lg:px-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Left Side - Content */}
              <div className="flex flex-col justify-center space-y-8 lg:space-y-6">
                {/* Vision Badge */}
                <div className="inline-flex items-center space-x-3 mb-4">
                  <div className="h-1 w-16 bg-gradient-to-r from-amber-500 to-red-600"></div>
                  <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-amber-50 leading-tight text-amber-300">
                    Vision
                  </span>
                </div>

                {/* Main Heading */}
                <h4
                  className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-amber-50 leading-tight
"
                >
                  Our Commitment
                </h4>

                {/* Description */}
                <p className="text-lg md:text-xl lg:text-xl text-amber-100 leading-relaxed max-w-2xl">
                  Vivahanam.com offers a unique matrimonial platform designed
                  for Hindus in North America, connecting individuals seeking
                  Vedic Indian alliances. With personalized matchmaking and
                  pre-wedding consultations, we ensure a culturally rich
                  experience, honoring traditions while cultivating spiritual
                  bonds.
                </p>

                {/* Additional Info */}
                <p className="text-base md:text-lg text-amber-200/90 leading-relaxed max-w-2xl">
                  Discover our subscription options to explore wedding packages
                  and traditional rituals that enrich your journey to matrimony.
                </p>

                {/* Decorative Stats/Features */}
                <div className="grid grid-cols-3 gap-6 pt-8 border-t border-amber-700/30">
                  <div className="text-center lg:text-left">
                    <div className="text-3xl md:text-4xl font-bold text-amber-300 mb-1">
                      500+
                    </div>
                    <div className="text-xl text-amber-200/80">
                      Happy Couples
                    </div>
                  </div>
                  <div className="text-center lg:text-left">
                    <div className="text-3xl md:text-4xl font-bold text-amber-300 mb-1">
                      10+
                    </div>
                    <div className="text-xl text-amber-200/80">
                      Years Experience
                    </div>
                  </div>
                  <div className="text-center lg:text-left">
                    <div className="text-3xl md:text-4xl font-bold text-amber-300 mb-1">
                      98%
                    </div>
                    <div className="text-xl text-amber-200/80">
                      Satisfaction Rate
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Decorative Image Card */}
              <div className="hidden lg:flex items-center justify-center">
                <div className="relative w-full max-w-lg">
                  {/* Main Image Card */}
                  <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                    <img
                      src={unnamedImage}
                      alt="Traditional Wedding"
                      className="w-full h-150 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-amber-900/60 to-transparent"></div>
                  </div>

                  {/* Floating Card 1 */}
                  <div className="absolute -bottom-8 -left-8 bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl max-w-xs">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
                        <svg
                          className="w-6 h-6 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          ></path>
                        </svg>
                      </div>
                      <div>
                        <div className="font-bold text-gray-800">
                          Verified Profiles
                        </div>
                        <div className="text-sm text-gray-600">
                          100% Authentic
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Floating Card 2 */}
                  <div className="absolute -top-8 -right-8 bg-gradient-to-br from-amber-500 to-red-500 rounded-2xl p-6 shadow-xl max-w-xs">
                    <div className="text-white">
                      <div className="text-3xl font-bold mb-1">Trusted</div>
                      <div className="text-sm opacity-90">By Thousands</div>
                    </div>
                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute -z-10 -bottom-12 -right-12 w-64 h-64 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-full blur-3xl"></div>
                  <div className="absolute -z-10 -top-12 -left-12 w-64 h-64 bg-gradient-to-br from-amber-500/20 to-yellow-500/20 rounded-full blur-3xl"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Decorative Gradient */}
        {/* <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-stone-200 to-transparent"></div> */}
      </div>

      <div className="w-full min-h-screen bg-amber-100 py-12 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          {/* Section Heading */}
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-amber-900 mb-2">
              OUR SERVICES
            </h2>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {workItems.map((item) => (
              <div
                key={item.id}
                className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-amber-200 hover:border-amber-400"
              >
                {/* Image */}
                <div className="relative h-48 sm:h-56 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>

                {/* Content */}
                <div className="p-8">
                  {/* Title */}
                  <h3 className="text-2xl sm:text-3xl font-bold text-amber-900 mb-4">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Decorative Line */}
                  <div className="mt-6 h-1 w-16 bg-gradient-to-r from-amber-600 to-red-600 group-hover:w-full transition-all duration-500"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Optional Bottom CTA */}
          {/* <div className="text-center mt-12 lg:mt-16">
            <button className="px-10 py-4 bg-gradient-to-r from-amber-700 to-amber-800 hover:from-amber-800 hover:to-amber-900 text-white text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
              Learn More About Our Services
            </button>
              <div className="w-full min-h-screen py-12 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto max-w-7xl"> */}
          {/* Section Heading */}
          <div className="text-center mb-12 lg:mb-16">
            {/* <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-amber-800 mb-4">
                OUR SERVICES
              </h2> */}
            {/* <div className="w-full h-1 bg-gradient-to-r from-transparent via-red-400 to-transparent"></div>  */}
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-12">
            {services.map((service) => (
              <div
                key={service.id}
                className="group relative bg-white/40 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                {/* Service Image */}
                <div className="relative h-64 sm:h-72 md:h-80 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.alt}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                </div>

                {/* Service Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-xl sm:text-2xl font-bold mb-2 text-shadow">
                    {service.title}
                  </h3>
                  <p className="text-3xl sm:text-4xl font-bold mb-4">
                    {service.price}
                  </p>
                  <button
                    onClick={() => handleBookNow(service.title)}
                    className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
                  >
                    BOOK NOW
                  </button>
                </div>

                {/* Border Effect */}
                <div className="absolute inset-0 border-4 border-transparent group-hover:border-red-700 rounded-2xl transition-all duration-300 pointer-events-none"></div>
              </div>
            ))}
          </div>

          {/* See More Button */}
          <div className="flex justify-center mt-8 lg:mt-12">
            {/* <button
              onClick={handleSeeMore}
              className="px-10 py-4 bg-gradient-to-r from-amber-700 to-amber-800 hover:from-amber-800 hover:to-amber-900 text-white text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
            >
              See More Services
            </button> */}
          </div>
        </div>
      </div>
      {/* </div> */}
      {/* </div> */}
      {/* </div> */}

      {/* Auth Modal Popup */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 pointer-events-auto">
          <div className="bg-white rounded-2xl p-8 sm:p-10 md:p-12 max-w-md w-full mx-4 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-end mb-6">
              <button
                onClick={() => setShowAuthModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ×
              </button>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-amber-800 mb-6">
              {authMode === "login"
                ? "Login to Continue"
                : authMode === "signup"
                ? "Sign Up Today"
                : "Forgot Password?"}
            </h2>
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {authMode === "signup" && (
                <div>
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={authName}
                    onChange={(e) => setAuthName(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>
              )}
              <div>
                <input
                  type="email"
                  placeholder="Email Address"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>
              {authMode !== "forgot" && (
                <div>
                  <input
                    type="password"
                    placeholder="Password"
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>
              )}
              {authMode === "signup" && (
                <div>
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>
              )}
              {authMode === "login" && (
                <p className="text-right mt-2">
                  <button
                    type="button"
                    onClick={() => setAuthMode("forgot")}
                    className="text-sm text-amber-600 hover:underline"
                  >
                    Forgot Password?
                  </button>
                </p>
              )}
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-amber-700 to-amber-800 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:from-amber-800 hover:to-amber-900 transition-all duration-300"
              >
                {authMode === "forgot"
                  ? "Send Reset Link"
                  : authMode === "signup"
                  ? "Sign Up"
                  : "Login"}
              </button>
            </form>
            {authMode === "forgot" ? (
              <p className="text-center mt-6 text-gray-600">
                Remember your password?{" "}
                <button
                  type="button"
                  onClick={switchToLogin}
                  className="text-amber-600 font-semibold hover:underline"
                >
                  Login
                </button>
              </p>
            ) : (
              <p className="text-center mt-6 text-gray-600">
                {authMode === "login"
                  ? "Don't have an account?"
                  : "Already have an account?"}{" "}
                <button
                  type="button"
                  onClick={
                    authMode === "login" ? switchToSignup : switchToLogin
                  }
                  className="text-amber-600 font-semibold hover:underline"
                >
                  {authMode === "login" ? "Sign Up" : "Login"}
                </button>
              </p>
            )}
          </div>
        </div>
      )}

      {/* this is 3 step section  */}

      <div className="w-full bg-amber-100 px-4 sm:px-8 lg:px-16">
        {/* Section Header */}
        <div className="text-center mb-12">
          <p className="text-red-900 text-3xl sm:text-4xl md:text-5xl sm:text-xl font-semibold">
            Look For Your 'Soulmate'
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-gray-800 mt-4">
            3 <span className="text-5xl">Easy Steps</span>
          </h2>
        </div>

        {/* Steps Layout */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-around gap-10 lg:gap-16 max-w-7xl mx-auto">
          {/* Step 1 */}
          <div
            className="flex flex-col items-center text-center space-y-4 cursor-pointer flex-1"
            onClick={() => navigate("/register")}
          >
            <h3 className="text-2xl font-bold text-red-600">STEP 1</h3>
            <h3 className="text-2xl font-semibold text-gray-800">
              Create your Profile
            </h3>

            <div className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-full overflow-hidden shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1603415526960-f7e0328c63b1"
                alt="Create Profile"
                className="w-full h-full object-cover"
              />

              {/* 🔹 User icon at top-right */}
              <div className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full shadow-md">
                <i className="fa-solid fa-user text-lg"></i>
              </div>
            </div>

            <p className="text-gray-700 max-w-xs text-base sm:text-lg leading-relaxed">
              Register for free & put up your Profile to connect with members in
              your community in short time.
            </p>
          </div>

          {/* Arrow 1 */}
          <div className="hidden md:flex md:items-center md:justify-center md:w-12">
            <span className="text-red-900 font-bold text-5xl md:text-7xl">
              →
            </span>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center text-center space-y-4 flex-1">
            <h3 className="text-2xl font-bold text-red-600">STEP 2</h3>
            <h3 className="text-2xl font-semibold text-gray-800">
              Search for Partner
            </h3>
            <div className="relative w-52 h-52 sm:w-60 sm:h-60 rounded-2xl overflow-hidden shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2"
                alt="Search Partner"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 right-2 bg-red-600 text-white p-2 rounded-full">
                <i className="fa-solid fa-magnifying-glass"></i>
              </div>
            </div>
            <p className="text-gray-700 max-w-xs text-base sm:text-lg leading-relaxed">
              Select options and Search your perfect partner easily.
            </p>
          </div>

          {/* Arrow 2 */}
          <div className="hidden md:flex md:items-center md:justify-center md:w-12">
            <span className="text-red-900 font-bold text-5xl md:text-7xl">
              {" "}
              →{" "}
            </span>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center text-center space-y-4 flex-1">
            <h3 className="text-2xl font-bold text-red-600">STEP 3</h3>
            <h3 className="text-2xl font-semibold text-gray-800">
              Express your Interest
            </h3>
            <div className="relative flex gap-2 justify-center">
              <div className="w-24 h-28 rounded-xl overflow-hidden shadow-md">
                <img
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde"
                  alt="Profile 1"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-24 h-28 rounded-xl overflow-hidden shadow-md">
                <img
                  src="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e"
                  alt="Profile 2"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-24 h-28 rounded-xl overflow-hidden shadow-md">
                <img
                  src="https://images.unsplash.com/photo-1607746882042-944635dfe10e"
                  alt="Profile 3"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute bottom-2 right-1 bg-red-600 text-white p-2 rounded-full">
                <i className="fa-solid fa-heart"></i>
              </div>
            </div>
            <p className="text-gray-700 max-w-xs text-base sm:text-lg leading-relaxed">
              Express Interests & go forward one step to connect with your
              partner.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
