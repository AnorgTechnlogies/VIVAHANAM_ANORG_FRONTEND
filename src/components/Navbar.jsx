import { useState, useEffect } from "react";
import { Menu, X, User, LogOut, Edit, LogIn } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/Logo.jpg";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState("login"); // 'login', 'signup', 'forgot', 'verify', 'success'
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [verifyError, setVerifyError] = useState("");
  // Forgot password state
  const [forgotEmail, setForgotEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  // Login state
  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });
  // Signup form data
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_KEY;

  // Validation rules for signup
  const validationRules = {
    firstName: {
      required: true,
      minLength: 2,
      maxLength: 50,
      pattern: /^[A-Za-z\s]+$/,
      message: "First name must be 2-50 letters only"
    },
    lastName: {
      required: true,
      minLength: 1,
      maxLength: 50,
      pattern: /^[A-Za-z\s]+$/,
      message: "Last name must be 1-50 letters only"
    },
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "Enter a valid email address"
    },
    password: {
      required: true,
      minLength: 6,
      message: "Password must be at least 6 characters"
    },
    confirmPassword: {
      required: true,
      validate: (value, formData) => value === formData.password,
      message: "Passwords do not match"
    }
  };

  // Validation function
  const validateField = (name, value, allFormData = formData) => {
    const rule = validationRules[name];
    if (!rule) return null;
    if (rule.required && (!value || value.toString().trim() === "")) {
      return "This field is required";
    }
    if (value && rule.minLength && value.length < rule.minLength) {
      return rule.message || `Minimum ${rule.minLength} characters required`;
    }
    if (value && rule.maxLength && value.length > rule.maxLength) {
      return rule.message || `Maximum ${rule.maxLength} characters allowed`;
    }
    if (value && rule.pattern && !rule.pattern.test(value)) {
      return rule.message || "Invalid format";
    }
    if (value && rule.validate) {
      const isValid = rule.validate(value, allFormData);
      if (!isValid) return rule.message || "Invalid value";
    }
    return null;
  };

  const validateAllFields = () => {
    const errors = {};
   
    Object.keys(validationRules).forEach(fieldName => {
      const value = formData[fieldName];
      const error = validateField(fieldName, value, formData);
      if (error) {
        errors[fieldName] = error;
      }
    });
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Form handlers for signup
  const handleFieldBlur = (fieldName) => {
    setTouchedFields(prev => ({ ...prev, [fieldName]: true }));
   
    const value = formData[fieldName];
    const error = validateField(fieldName, value, formData);
   
    setFieldErrors(prev => ({
      ...prev,
      [fieldName]: error
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
   
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (touchedFields[name]) {
      const error = validateField(name, value, formData);
      setFieldErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  };

  // Login input handler
  // const handleLoginInputChange = (e) => {
  //   const { name, value } = e.target;
  //   setLoginData(prev => ({
  //     ...prev,
  //     [name]: value
  //   }));
  // };

  // OTP handler for email verification
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setVerifyError("Please enter a valid 6-digit OTP.");
      return;
    }
    setVerifyError("");
    setVerifyLoading(true);
    try {
      const response = await fetch(`${API_URL}/user/verify-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          verificationCode: otp,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || `Verification failed: ${response.statusText}`);
      }
      if (data.token) {
        localStorage.setItem('vivahanamToken', data.token);
      }
      // Prefill login email for seamless transition
      setLoginData(prev => ({ ...prev, email: formData.email }));
      setShowOtpModal(false);
      setSuccess("Account verified successfully! You can now login.");
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: ""
      });
      setOtp("");
      // Switch to login mode and open auth modal
      setAuthMode("login");
      setShowAuthModal(true);
    } catch (err) {
      setVerifyError(err.message || "Verification failed. Please check your email and try again.");
    } finally {
      setVerifyLoading(false);
    }
  };

  // Forgot Password - Step 1: Request verification code
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    if (!forgotEmail) {
      setError("Please enter your email address");
      setLoading(false);
      return;
    }
    try {
      const response = await fetch(`${API_URL}/user/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          loginId: forgotEmail,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || `Failed to send verification code`);
      }
      setSuccess("✅ Verification code sent to your email! Please check your inbox.");
      setAuthMode("verify");
     
    } catch (err) {
      console.error('Forgot password error:', err);
      setError(err.message || "Failed to send verification code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Forgot Password - Step 2: Verify code and reset password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    if (!otp || !newPassword || !confirmNewPassword) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }
    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit verification code");
      setLoading(false);
      return;
    }
    try {
      const response = await fetch(`${API_URL}/user/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: forgotEmail,
          verificationCode: otp,
          newPassword: newPassword,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || `Password reset failed`);
      }
      // Prefill login email for seamless transition
      setLoginData({ email: forgotEmail, password: "" });
      setSuccess("✅ Password reset successfully! You can now login with your new password.");
      setAuthMode("login"); // Switch to login after successful password reset
      setForgotEmail("");
      setNewPassword("");
      setConfirmNewPassword("");
      setOtp("");
     
    } catch (err) {
      console.error('Reset password error:', err);
      setError(err.message || "Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Signup function
  const handleSignup = async (e) => {
    e.preventDefault();
   
    // Validate all fields
    const allFields = Object.keys(validationRules);
    const touched = {};
    allFields.forEach(field => { touched[field] = true; });
    setTouchedFields(touched);
    if (!validateAllFields()) {
      setError("Please fix all validation errors before submitting.");
      return;
    }
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const submitData = new FormData();
     
      submitData.append("firstName", formData.firstName);
      submitData.append("lastName", formData.lastName);
      submitData.append("email", formData.email);
      submitData.append("password", formData.password);
     
      // Default partner preferences
      const defaultPartnerPreferences = {
        ageRange: { min: "25", max: "35" },
        preferredReligion: ["Hindu"],
        preferredEducation: ["Graduate"],
        preferredOccupation: ["Professional"]
      };
      submitData.append("partnerPreferences", JSON.stringify(defaultPartnerPreferences));
      const response = await fetch(`${API_URL}/user/register`, {
        method: 'POST',
        body: submitData,
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || `Signup failed: ${response.statusText}`);
      }
      setShowAuthModal(false);
      setShowOtpModal(true);
      setSuccess("Registration successful! Please check your email for verification code.");
    } catch (err) {
      setError(err.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Login function
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    if (!loginData.email || !loginData.password) {
      setError("Please fill in email and password");
      setLoading(false);
      return;
    }
    try {
      const response = await fetch(`${API_URL}/user/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          loginId: loginData.email,
          password: loginData.password,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Login failed: ${response.statusText}`);
      }
      const data = await response.json();
      if (data.token) {
        localStorage.setItem('vivahanamToken', data.token);
      }
      if (data.user) {
        localStorage.setItem('vivahanamUser', JSON.stringify(data.user));
        setUserData(data.user);
      }
      setIsLoggedIn(true);
      setShowAuthModal(false);
      setLoginData({
        email: "",
        password: ""
      });
      navigate("/partners");
     
    } catch (err) {
      console.error('Login error:', err);
      const errorMsg = err.message || "Invalid credentials. Please Signup if you don't have an account.";
      if (err.message.includes('verify your email') || err.message.includes('verification')) {
        setError("Please check your email for verification code and verify before logging in.");
      } else {
        setError(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  // Navigation functions
  const switchToLogin = () => {
    setAuthMode("login");
    setError("");
    setSuccess("");
    setLoginData({
      email: "",
      password: ""
    });
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: ""
    });
    setFieldErrors({});
    setTouchedFields({});
  };

  const switchToSignup = () => {
    setAuthMode("signup");
    setError("");
    setSuccess("");
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: ""
    });
    setFieldErrors({});
    setTouchedFields({});
  };

  const switchToForgot = () => {
    setAuthMode("forgot");
    setError("");
    setSuccess("");
    setForgotEmail("");
    setNewPassword("");
    setConfirmNewPassword("");
    setOtp("");
  };

  const requestNewCode = () => {
    setAuthMode("forgot");
    setError("");
    setSuccess("");
    setOtp("");
  };

  const closeAuthModal = () => {
    setShowAuthModal(false);
    setError("");
    setSuccess("");
    setLoginData({
      email: "",
      password: ""
    });
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: ""
    });
    setFieldErrors({});
    setTouchedFields({});
    setForgotEmail("");
    setNewPassword("");
    setConfirmNewPassword("");
    setOtp("");
  };

  const closeOtpModal = () => {
    setShowOtpModal(false);
    setOtp("");
    setVerifyError("");
  };

  // Helper functions for modal content
  const getTitle = () => {
    switch (authMode) {
      case "login":
        return "Welcome Back";
      case "signup":
        return "Join Vivahanam";
      case "forgot":
        return "Reset Your Password";
      case "verify":
        return "Enter Verification Code";
      case "success":
        return "Success!";
      default:
        return "Welcome Back";
    }
  };

  const getSubtitle = () => {
    switch (authMode) {
      case "login":
        return "Sign in to your account to continue";
      case "signup":
        return "Create your account to find your perfect life partner";
      case "forgot":
        return "Enter your email to receive a verification code";
      case "verify":
        return "Enter the code and your new password";
      case "success":
        return "Your password has been reset successfully";
      default:
        return "Sign in to your account to continue";
    }
  };

  const getButtonText = () => {
    if (loading) {
      switch (authMode) {
        case "login":
          return "Signing in...";
        case "signup":
          return "Creating Account...";
        case "forgot":
          return "Sending code...";
        case "verify":
          return "Resetting Password...";
        default:
          return "Processing...";
      }
    }
   
    switch (authMode) {
      case "login":
        return "Sign in";
      case "signup":
        return "Create Account";
      case "forgot":
        return "Send Verification Code";
      case "verify":
        return "Reset Password";
      case "success":
        return "Continue to Login";
      default:
        return "Sign in";
    }
  };

  // Render helpers for signup
  const renderFieldError = (fieldName) => {
    if (touchedFields[fieldName] && fieldErrors[fieldName]) {
      return (
        <p className="mt-1 text-sm text-red-600">
          {fieldErrors[fieldName]}
        </p>
      );
    }
    return null;
  };

  const getInputClassName = (fieldName) => {
    const baseClass = "mt-1 block w-full px-3 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm";
   
    if (touchedFields[fieldName] && fieldErrors[fieldName]) {
      return `${baseClass} border-red-300 focus:border-red-500`;
    }
   
    return `${baseClass} border-gray-300 focus:border-orange-500`;
  };

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

  const handleLogout = () => {
    localStorage.removeItem('vivahanamToken');
    localStorage.removeItem('vivahanamUser');
    setIsLoggedIn(false);
    setUserData(null);
    setIsProfileDropdownOpen(false);
    navigate("/");
  };

  const handleViewProfile = () => {
    setIsProfileDropdownOpen(false);
    navigate("/profile");
  };

  const handleUpdateProfile = () => {
    setIsProfileDropdownOpen(false);
    navigate("/update-profile");
  };

  const navItems = [
    { name: "Home", href: "/" },
     { name: "Our Plan", href: "/subscription-plans" },
    // { name: "Blogs", href: "/blogs" },
    // { name: "FAQ", href: "/faq" },
    { name: "About Us", href: "/about" },
    { name: "Contact Us", href: "/contact" },
    // { name: "Testimonials", href: "/testimonials" },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white backdrop-blur-sm shadow-md border-b border-gray-200">
        <div className="px-2 sm:px-4 lg:px-6 py-3 lg:py-4 max-w-7xl mx-auto">
          <div className="flex items-center">
            {/* Logo Section - Flush left */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded overflow-hidden flex-shrink-0">
                <img
                  src={Logo}
                  alt="Vivahanam Logo"
                  className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => navigate("/")}
                />
              </div>
              <div className="flex flex-col">
                <h1 className="m-0 text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 cursor-pointer hover:text-amber-600 transition-colors" onClick={() => navigate("/")}>
                  Vivahanam
                </h1>
                <p className="m-0 ml-5 text-xs sm:text-sm lg:text-md text-gray-600 cursor-pointer hover:text-amber-500 transition-colors" onClick={() => navigate("/")}>
                  ! विवाहनम् !
                </p>
              </div>
            </div>
            {/* Right Side: Nav Links, Profile & Mobile Menu - Flush right, no justify-between space */}
            <div className="flex-1 flex justify-end items-center gap-1 lg:gap-2 ml-auto">
              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center gap-2">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="text-gray-700 hover:text-amber-700 transition-colors duration-200 font-medium px-1 py-1 rounded-md hover:bg-amber-50 text-sm"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              {/* Profile Section */}
              <div className="relative">
                <button
                  onClick={toggleProfileDropdown}
                  className="flex items-center gap-1 p-1.5 rounded-lg hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-amber-100 rounded-full flex items-center justify-center border-2 border-amber-200 flex-shrink-0">
                    <User className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600" />
                  </div>
                  {isLoggedIn && userData?.name && (
                    <span className="hidden sm:inline text-xs sm:text-sm font-medium text-gray-700 truncate max-w-24">
                      {userData.name}
                    </span>
                  )}
                </button>
                {/* Profile Dropdown */}
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 sm:w-72 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50 animate-in slide-in-from-top-2 duration-200">
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
                                {userData.vivId || "VIV ID"}
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
                        <div className="border-t border-gray-100 my-1"></div>
                        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200">
                          <LogOut className="h-4 w-4" />
                          Logout
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => {
                          setShowAuthModal(true);
                          setAuthMode("login");
                          setIsProfileDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-amber-50 transition-colors duration-200"
                      >
                        <LogIn className="h-4 w-4 text-amber-600" />
                        Login
                      </button>
                    )}
                  </div>
                )}
              </div>
              {/* Mobile Menu Button */}
              <button
                onClick={toggleMenu}
                className="lg:hidden text-gray-700 hover:text-amber-700 transition-colors duration-200 p-1.5"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
        {/* Mobile Menu Dropdown */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-2 py-2 bg-white/95 backdrop-blur-sm border-t border-gray-200">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="block py-2 px-3 text-gray-700 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-all duration-200 font-medium text-sm"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            {/* Mobile Profile/Login Link */}
            {isLoggedIn ? (
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  toggleProfileDropdown();
                }}
                className="w-full block py-2 px-3 text-gray-700 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-all duration-200 font-medium text-left text-sm"
              >
                Profile
              </button>
            ) : (
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  setShowAuthModal(true);
                  setAuthMode("login");
                }}
                className="w-full block py-2 px-3 text-gray-700 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-all duration-200 font-medium text-left text-sm"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </nav>
      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-2">
                <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-2 rounded-xl">
                  <span className="text-lg font-bold">V</span>
                </div>
                <span className="text-lg font-semibold text-gray-800">IVAHANAM</span>
              </div>
              <button
                onClick={closeAuthModal}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                disabled={loading}
              >
                ×
              </button>
            </div>
            <div className="text-center mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {getTitle()}
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                {getSubtitle()}
              </p>
             
              {authMode === "verify" && forgotEmail && (
                <p className="mt-1 text-sm text-orange-600 font-medium">
                  📧 Code sent to: {forgotEmail}
                </p>
              )}
            </div>
            {/* Toggle Buttons - Only show for login/signup */}
            {(authMode === "login" || authMode === "signup") && (
              <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
                <button
                  onClick={switchToLogin}
                  className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                    authMode === "login"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={switchToSignup}
                  className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                    authMode === "signup"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Sign Up
                </button>
              </div>
            )}
            <form onSubmit={
              authMode === "login" ? handleLogin :
              authMode === "signup" ? handleSignup :
              authMode === "forgot" ? handleForgotPassword :
              authMode === "verify" ? handleResetPassword :
              switchToLogin
            } className="space-y-4">
              {/* Error and Success Messages */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}
              {success && (
                <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg text-sm">
                  {success}
                </div>
              )}
              {/* Name Fields - Show for Signup only */}
              {authMode === "signup" && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                      First Name *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      onBlur={() => handleFieldBlur("firstName")}
                      required
                      className={getInputClassName("firstName")}
                      placeholder="John"
                      disabled={loading}
                    />
                    {renderFieldError("firstName")}
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      onBlur={() => handleFieldBlur("lastName")}
                      required
                      className={getInputClassName("lastName")}
                      placeholder="Doe"
                      disabled={loading}
                    />
                    {renderFieldError("lastName")}
                  </div>
                </div>
              )}
              {/* Email Field - Show for login, signup and forgot */}
              {(authMode === "login" || authMode === "signup" || authMode === "forgot") && (
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={
                      authMode === "signup" ? formData.email :
                      authMode === "login" ? loginData.email :
                      forgotEmail
                    }
                    onChange={(e) => {
                      if (authMode === "signup") {
                        setFormData(prev => ({ ...prev, email: e.target.value }));
                      } else if (authMode === "login") {
                        setLoginData(prev => ({ ...prev, email: e.target.value }));
                      } else {
                        setForgotEmail(e.target.value);
                      }
                    }}
                    onBlur={authMode === "signup" ? () => handleFieldBlur("email") : undefined}
                    className={authMode === "signup" ? getInputClassName("email") : "relative block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:z-10 transition-colors"}
                    placeholder="Enter your email"
                    disabled={loading}
                  />
                  {authMode === "signup" && renderFieldError("email")}
                </div>
              )}
              {/* Verification Code + New Password Fields - Show for verify mode */}
              {authMode === "verify" && (
                <>
                  <div>
                    <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700 mb-1">
                      Verification Code
                    </label>
                    <input
                      id="verificationCode"
                      name="verificationCode"
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength="6"
                      required
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      className="relative block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:z-10 transition-colors text-center text-lg font-mono tracking-widest"
                      placeholder="000000"
                      disabled={loading}
                    />
                    <p className="text-xs text-gray-500 mt-1 text-center">
                      ⏰ 6-digit code (expires in 10 minutes)
                    </p>
                  </div>
                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      New Password
                    </label>
                    <input
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      autoComplete="new-password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="relative block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:z-10 transition-colors"
                      placeholder="Enter new password (min 6 characters)"
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm New Password
                    </label>
                    <input
                      id="confirmNewPassword"
                      name="confirmNewPassword"
                      type="password"
                      autoComplete="new-password"
                      required
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      className="relative block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:z-10 transition-colors"
                      placeholder="Confirm new password"
                      disabled={loading}
                    />
                  </div>
                  {/* Request new code link */}
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={requestNewCode}
                      className="text-sm text-orange-600 hover:text-orange-500 transition-colors font-medium"
                      disabled={loading}
                    >
                      🔄 Didn't receive code? Request new one
                    </button>
                  </div>
                </>
              )}
              {/* Password Field - Show for login and signup */}
              {(authMode === "login" || authMode === "signup") && (
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    {authMode === "login" ? "Password" : "Create Password"}
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete={authMode === "login" ? "current-password" : "new-password"}
                    required
                    value={authMode === "signup" ? formData.password : loginData.password}
                    onChange={(e) => {
                      if (authMode === "signup") {
                        setFormData(prev => ({ ...prev, password: e.target.value }));
                      } else {
                        setLoginData(prev => ({ ...prev, password: e.target.value }));
                      }
                    }}
                    onBlur={authMode === "signup" ? () => handleFieldBlur("password") : undefined}
                    className={authMode === "signup" ? getInputClassName("password") : "relative block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:z-10 transition-colors"}
                    placeholder={authMode === "login" ? "Enter your password" : "Create a password (min 6 characters)"}
                    disabled={loading}
                  />
                  {authMode === "signup" && renderFieldError("password")}
                </div>
              )}
              {/* Confirm Password Field - Show for signup */}
              {authMode === "signup" && (
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    onBlur={() => handleFieldBlur("confirmPassword")}
                    className={getInputClassName("confirmPassword")}
                    placeholder="Confirm your password"
                    disabled={loading}
                  />
                  {renderFieldError("confirmPassword")}
                </div>
              )}
              {/* Remember Me and Forgot Password - Only show for login */}
              {authMode === "login" && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                      Remember me
                    </label>
                  </div>
                  <button
                    type="button"
                    onClick={switchToForgot}
                    className="text-sm font-medium text-orange-600 hover:text-orange-500 transition-colors"
                    disabled={loading}
                  >
                    Forgot password?
                  </button>
                </div>
              )}
              {/* Submit Button */}
              <div>
                <button
                  type={authMode === "success" ? "button" : "submit"}
                  onClick={authMode === "success" ? switchToLogin : undefined}
                  disabled={loading}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {getButtonText()}
                    </div>
                  ) : (
                    getButtonText()
                  )}
                </button>
              </div>
              {/* Navigation Links */}
              <div className="text-center space-y-2">
                {authMode === "login" ? (
                  <>
                    <p className="text-sm text-gray-600">
                      Don't have an account?{" "}
                      <button
                        type="button"
                        onClick={switchToSignup}
                        className="font-medium text-orange-600 hover:text-orange-500 transition-colors"
                        disabled={loading}
                      >
                        Signup now
                      </button>
                    </p>
                  </>
                ) : authMode === "signup" ? (
                  <>
                    <p className="text-sm text-gray-600">
                      Already have an account?{" "}
                      <button
                        type="button"
                        onClick={switchToLogin}
                        className="font-medium text-orange-600 hover:text-orange-500 transition-colors"
                        disabled={loading}
                      >
                        Login here
                      </button>
                    </p>
                  </>
                ) : authMode === "success" ? (
                  <p className="text-sm text-gray-600">
                    Ready to continue?{" "}
                    <button
                      type="button"
                      onClick={switchToLogin}
                      className="font-medium text-orange-600 hover:text-orange-500 transition-colors"
                    >
                      Click here to login
                    </button>
                  </p>
                ) : (
                  <>
                    <p className="text-sm text-gray-600">
                      Remember your password?{" "}
                      <button
                        type="button"
                        onClick={switchToLogin}
                        className="font-medium text-orange-600 hover:text-orange-500 transition-colors"
                        disabled={loading}
                      >
                        Back to login
                      </button>
                    </p>
                  </>
                )}
              </div>
            </form>
            {/* Additional Info */}
            <div className="text-center mt-6 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                By continuing, you agree to our{" "}
                <a href="#" className="text-orange-600 hover:text-orange-500">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-orange-600 hover:text-orange-500">
                  Privacy Policy
                </a>
              </p>
            </div>
          </div>
        </div>
      )}
      {/* OTP Modal for Email Verification */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Verify Your Email</h3>
            <p className="text-sm text-gray-600 mb-4">
              We've sent a 6-digit verification code to <strong>{formData.email}</strong>
            </p>
            {verifyError && (
              <p className="text-red-500 text-sm text-center mb-2">{verifyError}</p>
            )}
            <form onSubmit={handleOtpSubmit} className="space-y-4">
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="Enter 6-digit code"
                maxLength={6}
                disabled={verifyLoading}
                className="block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-center text-lg font-mono disabled:opacity-50"
              />
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={closeOtpModal}
                  disabled={verifyLoading}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={verifyLoading}
                  className="px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {verifyLoading ? "Verifying..." : "Verify Email"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Overlay for Dropdowns */}
      {isProfileDropdownOpen && !showAuthModal && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsProfileDropdownOpen(false)}
        />
      )}
    </>
  );
};

export default Navbar;