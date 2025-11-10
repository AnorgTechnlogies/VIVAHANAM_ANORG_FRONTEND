import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import Home2Img from "../assets/Home2Img.jpg";
import Home3Img from "../assets/Home3Img.jpg";
import image from "../assets/image.png";
import unnamedImage from "../assets/unnamed.jpg";
import Home5RitualImg from "../assets/Home5RitualImg.jpg";
import Home1 from "../assets/HomeImage1.jpg";
import stepimage2 from "../assets/image2stepPage.jpeg";
import stepimage3 from "../assets/step3image2.jpg";

const HomePage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState("login"); // 'login', 'signup', 'forgot', 'verify', 'success'
  const [user, setUser] = useState(null);
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
  const handleLoginInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: value
    }));
  };

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
     
      setShowOtpModal(false);
      setShowAuthModal(false);
      setSuccess("Account verified successfully! You can now login.");
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: ""
      });
      setOtp("");
      // Switch to login mode after successful verification
      setAuthMode("login");
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

      setShowOtpModal(true);
      setSuccess("Registration successful! Please check your email for verification code.");

    } catch (err) {
      setError(err.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Login function - FIXED VERSION
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
        setUser(data.user);
      }

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

  // Handle free registration button
// Handle free registration button - Navigate to register page
const handleFreeRegistration = () => {
  setError("");
  navigate("/register"); // This will navigate to your register page
};
  useEffect(() => {
    setIsVisible(true);
  }, []);

  const services = [
    {
      id: 1,
      title: "Pre-Wedding Consultation",
      price: "$25",
      image: "https://img.freepik.com/premium-photo/wedding-stage-with-gold-couch-two-chairs_846334-229.jpg",
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
      image: "https://images.unsplash.com/photo-1587271407850-8d438ca9fdf2?q=80&w=2070",
      alt: "Matchmaking Consultation",
    },
  ];

  const handleBookNow = (serviceName) => {
    console.log(`Booking: ${serviceName}`);
  };

  const workItems = [
    {
      id: 1,
      title: "Matchmaking",
      description: "Our matchmaking services focus on understanding individual preferences and values, enabling us to connect compatible matches. We delve into cultural nuances to create meaningful connections that resonate with your heritage.",
      image: "https://images.unsplash.com/photo-1529636798458-92182e662485?q=80&w=2069",
    },
    {
      id: 2,
      title: "Consultations",
      description: "Pre-wedding consultations help navigate the planning process seamlessly. Our team guides you through every step, ensuring that your celebration reflects your personal and cultural values.",
      image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2069",
    },
    {
      id: 3,
      title: "Rituals",
      description: "We provide comprehensive information on traditional wedding rituals, enriching your understanding of significance behind each ceremony. Our goal is to harmonize modern desires with time-honored practices.",
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
              {/* Left Side - Image */}
              <div className="flex items-center justify-center lg:justify-start order-1 lg:order-1 w-full mb-6 lg:mb-0">
                <div className="relative w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl mx-auto lg:mx-0 rounded-3xl overflow-hidden shadow-2xl">
                  <img
                    src={Home1}
                    alt="Vedic Wedding Ceremony"
                    className="w-full h-auto object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
              </div>

              {/* Right Side - Content */}
              <div className="flex flex-col justify-center space-y-4 sm:space-y-6 lg:space-y-8 order-2 lg:order-2 w-full px-4 lg:px-0 text-center lg:text-left">
                {/* English Heading */}
                <div className="xl:block text-sm lg:text-base font-serif text-gray-800 max-w-2xl text-center leading-relaxed tracking-wide font-bold">
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
                
                <h1 className={`text-sm sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold text-gray-800 leading-tight transition-all duration-700 delay-100 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-5"
                }`}>
                  Creating Memories
                </h1>

                {/* Sanskrit Line */}
                <h2 className={`text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-red-700 leading-tight transition-all duration-700 delay-300 ${
                  isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
                }`} style={{ fontFamily: "serif" }}>
                  वसुधैव कुटुंबकम्
                </h2>

                {/* Subheading */}
                <h3 className={`text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold text-gray-800 leading-tight transition-all duration-700 delay-500 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
                }`} style={{ color: "#030303" }}>
                  Connect With Soulmates
                </h3>

                {/* Description */}
                <p className={`text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-gray-700 leading-relaxed max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mx-auto lg:mx-0 font-medium transition-all duration-700 delay-700 break-words ${
                  isVisible ? "opacity-100" : "opacity-0"
                }`}>
                  <span className="block w-full max-w-[80%] mx-auto lg:mx-0">
                    A trusted platform for Vedic Indian matrimony.
                  </span>
                  <span className="block w-full max-w-full mx-auto lg:mx-0">
                    fostering authentic holy alliances and meaningful connections
                  </span>
                  <span className="block w-full max-w-[70%] mx-auto lg:mx-0">
                    within North America's diverse communities.
                  </span>
                </p>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6 justify-center lg:justify-start">
                  <button
                    className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 w-full sm:w-auto min-w-[160px] sm:min-w-[180px]"
                    onClick={() => {
                      setShowAuthModal(true);
                      setAuthMode("login");
                    }}
                    disabled={loading}
                  >
                    {loading ? "Loading..." : "Login"}
                  </button>
                  <button
                    className="px-6 py-4 bg-red-600 text-white rounded-md font-semibold hover:bg-red-700 transition-colors"
                    onClick={handleFreeRegistration}
                  >
                    Register Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rest of your existing homepage sections remain exactly the same */}
      {/* Second Section - Hindi Content */}
      <div className="relative w-full min-h-[80vh] sm:min-h-[70vh] md:h-screen overflow-hidden bg-amber-100">
        <div className="w-full flex flex-col items-center justify-start py-8 sm:py-12 md:py-0">
          <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 w-full items-center">
              {/* Right Side - Image */}
              <div className="flex items-center justify-center lg:justify-end order-1 lg:order-2 w-full mb-6 lg:mb-0">
                <div className="relative w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl mx-auto lg:mx-0">
                  <img
                    src={Home2Img}
                    alt="Vedic Wedding Ceremony"
                    className="w-full h-auto rounded-2xl shadow-2xl object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
              </div>

              {/* Left Side - Content */}
              <div className="flex flex-col justify-center space-y-4 sm:space-y-6 lg:space-y-8 order-2 lg:order-1 w-full px-4 lg:px-0 text-center lg:text-left">
                <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-800 leading-tight sm:leading-snug md:leading-tight break-words hyphens-auto">
                  वैदिक भारतीय विवाह एवं प्रामाणिक पवित्र संबंध -
                </h1>
                <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold text-red-700 leading-tight sm:leading-snug break-words hyphens-auto">
                  उत्तर अमेरिकी वैवाहिक संस्था
                </h2>
                <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-gray-700 leading-relaxed max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mx-auto lg:mx-0 mt-2 px-2 sm:px-0 break-words">
                  Vivahanam preserves Vedic marriage traditions, uniting couples through sacred rituals and family values, bridging ancient spirituality with modern matrimony for Hindu families across North America.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-3 sm:pt-4 justify-center lg:justify-start">
                  <button
                    className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 w-full sm:w-auto min-w-[160px] sm:min-w-[180px]"
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
      <div className="relative w-full min-h-screen bg-amber-100 bg-gradient-to-bt from-amber-100 via-orange-100 to-amber-100 py-12 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div className="flex justify-center lg:justify-start order-2 lg:order-1">
              <div className="relative w-full max-w-md lg:max-w-lg">
                <img
                  src={Home3Img}
                  alt="Wedding Couple"
                  className="w-full h-auto rounded-2xl shadow-2xl object-cover"
                />
                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-amber-400 to-orange-400 rounded-full opacity-20 blur-3xl -z-10"></div>
                <div className="absolute -top-6 -right-6 w-40 h-40 bg-gradient-to-br from-stone-400 to-amber-300 rounded-full opacity-20 blur-3xl -z-10"></div>
              </div>
            </div>
            <div className="flex flex-col justify-center space-y-6 lg:space-y-8 order-1 lg:order-2">
              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-amber-800 leading-tight text-center lg:text-left">
                Join our Newsletter
              </h2>
              <p className="text-lg sm:text-xl md:text-2xl text-gray-600 text-center lg:text-left">
                Stay Updated on Wedding Trends
              </p>
              <div className="space-y-6">
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Enter Your Email"
                    className="w-full px-0 py-3 text-base sm:text-lg bg-transparent border-b-2 border-gray-400 focus:border-amber-700 outline-none transition-colors duration-300 placeholder-gray-500"
                  />
                </div>
                <div className="flex justify-center lg:justify-start pt-4">
                  <button
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

      {/* Vision Section */}
      <div className="relative w-full min-h-screen overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1525258834046-fd4c94d5b050?q=80&w=2070')",
        }}>
          <div className="absolute inset-0 bg-gradient-to-r from-amber-950/95 via-amber-900/90 to-transparent"></div>
        </div>
        <div className="relative h-full min-h-screen w-full flex items-center py-12 md:py-16 lg:py-20">
          <div className="container mx-auto px-6 md:px-12 lg:px-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div className="flex flex-col justify-center space-y-8 lg:space-y-6">
                <div className="inline-flex items-center space-x-3 mb-4">
                  <div className="h-1 w-16 bg-gradient-to-r from-amber-500 to-red-600"></div>
                  <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-amber-50 leading-tight text-amber-300">
                    Vision
                  </span>
                </div>
                <h4 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-amber-50 leading-tight">
                  Our Commitment
                </h4>
                <p className="text-lg md:text-xl lg:text-xl text-amber-100 leading-relaxed max-w-2xl">
                  Vivahanam.com offers a unique matrimonial platform designed for Hindus in North America, connecting individuals seeking Vedic Indian alliances. With personalized matchmaking and pre-wedding consultations, we ensure a culturally rich experience, honoring traditions while cultivating spiritual bonds.
                </p>
                <p className="text-base md:text-lg text-amber-200/90 leading-relaxed max-w-2xl">
                  Discover our subscription options to explore wedding packages and traditional rituals that enrich your journey to matrimony.
                </p>
                <div className="grid grid-cols-3 gap-6 pt-8 border-t border-amber-700/30">
                  <div className="text-center lg:text-left">
                    <div className="text-3xl md:text-4xl font-bold text-amber-300 mb-1">500+</div>
                    <div className="text-xl text-amber-200/80">Happy Couples</div>
                  </div>
                  <div className="text-center lg:text-left">
                    <div className="text-3xl md:text-4xl font-bold text-amber-300 mb-1">10+</div>
                    <div className="text-xl text-amber-200/80">Years Experience</div>
                  </div>
                  <div className="text-center lg:text-left">
                    <div className="text-3xl md:text-4xl font-bold text-amber-300 mb-1">98%</div>
                    <div className="text-xl text-amber-200/80">Satisfaction Rate</div>
                  </div>
                </div>
              </div>
              <div className="hidden lg:flex items-center justify-center">
                <div className="relative w-full max-w-lg">
                  <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                    <img src={unnamedImage} alt="Traditional Wedding" className="w-full h-150 object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-amber-900/60 to-transparent"></div>
                  </div>
                  <div className="absolute -bottom-8 -left-8 bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl max-w-xs">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                      </div>
                      <div>
                        <div className="font-bold text-gray-800">Verified Profiles</div>
                        <div className="text-sm text-gray-600">100% Authentic</div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute -top-8 -right-8 bg-gradient-to-br from-amber-500 to-red-500 rounded-2xl p-6 shadow-xl max-w-xs">
                    <div className="text-white">
                      <div className="text-3xl font-bold mb-1">Trusted</div>
                      <div className="text-sm opacity-90">By Thousands</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="w-full min-h-screen bg-amber-100 py-12 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-amber-900 mb-2">
              OUR SERVICES
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {workItems.map((item) => (
              <div key={item.id} className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-amber-200 hover:border-amber-400">
                <div className="relative h-48 sm:h-56 overflow-hidden">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>
                <div className="p-8">
                  <h3 className="text-2xl sm:text-3xl font-bold text-amber-900 mb-4">{item.title}</h3>
                  <p className="text-base md:text-lg text-gray-700 leading-relaxed">{item.description}</p>
                  <div className="mt-6 h-1 w-16 bg-gradient-to-r from-amber-600 to-red-600 group-hover:w-full transition-all duration-500"></div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mb-12 lg:mb-16"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-12">
            {services.map((service) => (
              <div key={service.id} className="group relative bg-white/40 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="relative h-64 sm:h-72 md:h-80 overflow-hidden">
                  <img src={service.image} alt={service.alt} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-xl sm:text-2xl font-bold mb-2 text-shadow">{service.title}</h3>
                  <p className="text-3xl sm:text-4xl font-bold mb-4">{service.price}</p>
                  <button onClick={() => handleBookNow(service.title)} className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105">
                    BOOK NOW
                  </button>
                </div>
                <div className="absolute inset-0 border-4 border-transparent group-hover:border-red-700 rounded-2xl transition-all duration-300 pointer-events-none"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3 Steps Section */}
      <div className="w-full bg-amber-100 px-4 sm:px-8 lg:px-16">
        <div className="text-center mb-12">
          <p className="text-red-900 text-3xl sm:text-4xl md:text-5xl sm:text-xl font-semibold">
            Look For Your 'Soulmate'
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-gray-800 mt-4">
            3 <span className="text-5xl">Easy Steps</span>
          </h2>
        </div>
        <div className="flex flex-col md:flex-row md:items-center md:justify-around gap-10 lg:gap-16 max-w-7xl mx-auto">
          {/* Step 1 */}
          <div className="flex flex-col items-center text-center space-y-4 cursor-pointer flex-1" onClick={() => setShowAuthModal(true)}>
            <h3 className="text-2xl font-bold text-red-600">STEP 1</h3>
            <h3 className="text-2xl font-semibold text-gray-800">Create your Profile</h3>
            <div className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-full overflow-hidden shadow-xl">
              <img src="https://images.unsplash.com/photo-1603415526960-f7e0328c63b1" alt="Create Profile" className="w-full h-full object-cover" />
              <div className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full shadow-md">
                <i className="fa-solid fa-user text-lg"></i>
              </div>
            </div>
            <p className="text-gray-700 max-w-xs text-base sm:text-lg leading-relaxed">
              Register for free & put up your Profile to connect with members in your community in short time.
            </p>
          </div>
          <div className="hidden md:flex md:items-center md:justify-center md:w-12">
            <span className="text-red-900 font-bold text-5xl md:text-7xl">→</span>
          </div>
          {/* Step 2 */}
          <div className="flex flex-col items-center text-center space-y-4 flex-1">
            <h3 className="text-2xl font-bold text-red-600">STEP 2</h3>
            <h3 className="text-2xl font-semibold text-gray-800">Search for Partner</h3>
            <div className="relative w-52 h-52 sm:w-60 sm:h-60 rounded-2xl overflow-hidden shadow-xl">
              <img src={stepimage2} alt="Search Partner step page" className="w-full h-full object-cover" />
              <div className="absolute bottom-2 right-2 bg-red-600 text-white p-2 rounded-full">
                <i className="fa-solid fa-magnifying-glass"></i>
              </div>
            </div>
            <p className="text-gray-700 max-w-xs text-base sm:text-lg leading-relaxed">
              Select options and Search your perfect partner easily.
            </p>
          </div>
          <div className="hidden md:flex md:items-center md:justify-center md:w-12">
            <span className="text-red-900 font-bold text-5xl md:text-7xl"> → </span>
          </div>
          {/* Step 3 */}
          <div className="flex flex-col items-center text-center space-y-4 flex-1">
            <h3 className="text-2xl font-bold text-red-600">STEP 3</h3>
            <h3 className="text-2xl font-semibold text-gray-800">Express your Intrest</h3>
            <div className="relative w-52 h-52 sm:w-60 sm:h-60 rounded-2xl overflow-hidden shadow-xl">
              <img src={stepimage3} alt="Search Partner step page" className="w-full h-full object-cover" />
              <div className="absolute bottom-2 right-2 bg-red-600 text-white p-2 rounded-full">
                <i className="fa-solid fa-magnifying-glass"></i>
              </div>
            </div>
            <p className="text-gray-700 max-w-xs text-base sm:text-lg leading-relaxed">
              Express Interests & go forward one step to connect with your partner.
            </p>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
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
    </>
  );
};

export default HomePage;