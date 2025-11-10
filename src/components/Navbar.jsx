// components/Navbar.jsx
import { useState, useEffect } from "react";
import { Menu, X, User, Search, LogOut, UserPlus, LogIn, Edit } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/Logo.jpg";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [searchVivId, setSearchVivId] = useState("");
  const navigate = useNavigate();

  // Check login status in real-time
  const checkAuthStatus = () => {
    const token = localStorage.getItem('vivahanamToken');
    const userInfo = localStorage.getItem('vivahanamUser');
    
    if (token && userInfo) {
      setIsLoggedIn(true);
      try {
        setUserData(JSON.parse(userInfo));
      } catch (error) {
        console.error('Error parsing user info:', error);
      }
    } else {
      setIsLoggedIn(false);
      setUserData(null);
    }
  };

  useEffect(() => {
    checkAuthStatus();
    const interval = setInterval(checkAuthStatus, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleProfileDropdown = () => setIsProfileDropdownOpen(!isProfileDropdownOpen);

  const handleLogin = () => navigate("/login");
  const handleSignup = () => navigate("/register");
  
  const handleLogout = () => {
    localStorage.removeItem('vivahanamToken');
    localStorage.removeItem('vivahanamUser');
    setIsLoggedIn(false);
    setUserData(null);
    navigate("/");
  };

  const handleUpdateProfile = () => navigate("/update-profile");
  const handleViewProfile = () => navigate("/profile");

  const handleSearchByVivId = (e) => {
    e.preventDefault();
    if (searchVivId.trim()) {
      navigate(`/search?vivId=${searchVivId.trim()}`);
      setSearchVivId("");
    }
  };

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Blogs", href: "/blogs" },
    { name: "FAQ", href: "/faq" },
    { name: "About Us", href: "/about" },
    { name: "Contact Us", href: "/contact" },
    { name: "Testimonials", href: "/testimonials" },
  ];

  return (
    <nav className="absolute top-0 left-0 right-0 z-50 bg-white backdrop-blur-sm shadow-md">
      <div className="px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
        <div className="flex justify-between items-center">
          {/* Logo Section */}
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded overflow-hidden flex-shrink-0">
              <img
                src={Logo}
                alt="Vivahanam Logo"
                className="w-full h-full object-cover cursor-pointer"
                onClick={() => navigate("/")}
              />
            </div>
            <div className="flex flex-col">
              <h1 className="m-0 text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 cursor-pointer">
                Vivahanam
              </h1>
              <p className="m-0 ml-5 text-xs sm:text-sm lg:text-md text-gray-600 cursor-pointer">
                ! विवाहनम् !
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            {navItems.map((item) => (
              <Link key={item.name} to={item.href} className="text-gray-700 hover:text-amber-700 transition-colors duration-200 font-medium">
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {/* Search by VIV ID - Only when logged in */}
           

            {/* Profile Icon */}
            <div className="relative">
              <button onClick={toggleProfileDropdown} className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center border-2 border-amber-200">
                  <User className="h-5 w-5 text-amber-600" />
                  
                </div>
                {isLoggedIn && userData?.vivId && (
                  <span className="hidden sm:block text-sm font-medium text-gray-700">
                    {userData.vivId}
                  </span>
                  
                )}
                <div className="ml-1">profile</div>
              </button>

              {/* Dropdown Menu */}
              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  {isLoggedIn ? (
                    <>
                      {/* User Info */}
                      <div className="px-4 py-3 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-amber-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {userData.name || "User"}
                            </p>
                            <p className="text-xs text-amber-600 font-medium truncate">
                              {userData.vivId}
                            </p>
                          </div>
                        </div>
                      </div>

                      <button onClick={handleViewProfile} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-amber-50 transition-colors duration-200">
                        <User className="h-4 w-4 text-amber-600" />
                        View Profile
                      </button>

                      <button onClick={handleUpdateProfile} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-amber-50 transition-colors duration-200">
                        <Edit className="h-4 w-4 text-amber-600" />
                        Update Profile
                      </button>

                      {/* Search in Dropdown */}
                      <div className="px-4 py-2 border-t border-gray-100">
                        <form onSubmit={handleSearchByVivId} className="flex flex-col gap-2">
                          <div className="relative">
                            <input
                              type="text"
                              value={searchVivId}
                              onChange={(e) => setSearchVivId(e.target.value.toUpperCase())}
                              placeholder="Search by VIV ID"
                              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
                              maxLength={8}
                            />
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-3 w-3" />
                          </div>
                          <button type="submit" className="w-full px-3 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors duration-200 text-sm font-medium">
                            Search Profile
                          </button>
                        </form>
                      </div>

                      <div className="border-t border-gray-100 my-1"></div>
                      <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200">
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={handleLogin} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-amber-50 transition-colors duration-200">
                        <LogIn className="h-4 w-4 text-amber-600" />
                        Login
                      </button>
                      <button onClick={handleSignup} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-amber-50 transition-colors duration-200">
                        <UserPlus className="h-4 w-4 text-amber-600" />
                        Sign Up
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button onClick={toggleMenu} className="lg:hidden text-gray-700 hover:text-amber-700 transition-colors duration-200 p-2">
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isLoggedIn && (
          <div className="md:hidden mt-3">
            <form onSubmit={handleSearchByVivId} className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchVivId}
                  onChange={(e) => setSearchVivId(e.target.value.toUpperCase())}
                  placeholder="Search by VIV ID"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
                  maxLength={8}
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              </div>
              <button type="submit" className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors duration-200 text-sm font-medium">
                Search
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      <div className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="px-4 py-4 bg-white/95 backdrop-blur-sm border-t border-gray-200">
          {navItems.map((item) => (
            <Link key={item.name} to={item.href} className="block py-3 px-4 text-gray-700 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-all duration-200 font-medium" onClick={() => setIsMenuOpen(false)}>
              {item.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Overlay */}
      {isProfileDropdownOpen && <div className="fixed inset-0 z-40" onClick={() => setIsProfileDropdownOpen(false)} />}
    </nav>
  );
};

export default Navbar;