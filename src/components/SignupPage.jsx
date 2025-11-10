import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const SignupPage = () => {
  const emailInputRef = useRef(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  
  const [fieldErrors, setFieldErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [verifyError, setVerifyError] = useState("");

  const API_URL = import.meta.env.VITE_API_KEY;

  // Validation rules
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

  // Form handlers
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

  // OTP handler
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
      setShowSuccessModal(true);
      setOtp("");
    } catch (err) {
      setVerifyError(err.message || "Verification failed. Please check your email and try again.");
    } finally {
      setVerifyLoading(false);
    }
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const allFields = Object.keys(validationRules);
    const touched = {};
    allFields.forEach(field => { touched[field] = true; });
    setTouchedFields(touched);

    if (!validateAllFields()) {
      setError("Please fix all validation errors before submitting.");
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setError("");
    setIsSubmitting(true);
    setLoading(true);

    try {
      const submitData = new FormData();
      
      submitData.append("firstName", formData.firstName);
      submitData.append("lastName", formData.lastName);
      submitData.append("email", formData.email);
      submitData.append("password", formData.password);
      // Default partner preferences
      const defaultPartnerPreferences = {
        
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

    } catch (err) {
      setError(err.message || "Signup failed. Please try again.");
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  };

  // Effects
  useEffect(() => {
    const timer = setTimeout(() => {
      if (emailInputRef.current) {
        emailInputRef.current.value = "";
      }
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (showSuccessModal) {
      const timer = setTimeout(() => {
        window.location.href = "/HomePage";
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessModal]);

  // Render helpers
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-orange-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xl font-bold">V</span>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Join Vivahanam
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Create your account to find your perfect life partner
          </p>
        </div>

        {/* Signup Form */}
        <div className="bg-white py-8 px-6 shadow-2xl rounded-2xl border border-orange-100">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
            {/* Name Fields */}
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
                />
                {renderFieldError("lastName")}
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address *
              </label>
              <input
                ref={emailInputRef}
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                onBlur={() => handleFieldBlur("email")}
                required
                className={getInputClassName("email")}
                placeholder="you@example.com"
              />
              {renderFieldError("email")}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password *
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                onBlur={() => handleFieldBlur("password")}
                required
                className={getInputClassName("password")}
                placeholder="••••••"
              />
              {renderFieldError("password")}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password *
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                onBlur={() => handleFieldBlur("confirmPassword")}
                required
                className={getInputClassName("confirmPassword")}
                placeholder="••••••"
              />
              {renderFieldError("confirmPassword")}
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isSubmitting || loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </div>

            {/* Login Link */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link to="/login" className="font-medium text-orange-600 hover:text-orange-500">
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* OTP Modal */}
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
                  onClick={() => setShowOtpModal(false)}
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

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg max-w-md w-full mx-4 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Account Created Successfully!</h3>
            <p className="text-sm text-green-600">
              Redirecting to your Login...
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignupPage;