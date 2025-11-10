import { useState, useEffect, useRef } from "react";

const RegistrationForm = () => {
  // ==================== STATE VARIABLES ====================
  const emailInputRef = useRef(null);
  const profileImageInputRef = useRef(null); // Add ref for profile image input
  const documentsInputRef = useRef(null); // Add ref for documents input
  const [documents, setDocuments] = useState([]);
  const [fieldErrors, setFieldErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});
  const [profileImage, setProfileImage] = useState(null);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [verifyError, setVerifyError] = useState("");

  const [formData, setFormData] = useState({
    // ... (keep all your existing formData state)
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    password: "",
    mobileNo: "",
    residentCountry: "India",
    userType: "",
    diet: "",
    gender: "",
    dateOfBirth: "",
    religion: "",
    motherTongue: "",
    maritalStatus: "",
    height: "",
    physicalStatus: "",
    educationLevel: "",
    fieldOfStudy: "",
    occupation: "",
    employer: "",
    annualIncome: "",
    profileBio: "",
    hobbies: "",
    languages: "",
    country: "",
    district: "",
    city: "",
    state: "",
    currentCity: "",
    nativePlace: "",
    birthTime: "",
    placeOfBirth: "",
    zodiacSign: "",
    gotra: "",
    familyType: "",
    familyStatus: "",
    fatherName: "",
    fatherOccupation: "",
    fatherStatus: "",
    motherName: "",
    motherOccupation: "",
    motherStatus: "",
    numBrothers: 0,
    numSisters: 0,
    siblingsMaritalStatus: "",
    aboutFamily: "",
    familyBackground: "",
    country: "India",
    streetAddress: "",
    addressLine2: "",
    zipCode: "",
    citizenshipStatus: "",
    partnerPreferences: {
      ageRange: { min: "", max: "" },
      preferredReligion: "",
      preferredMotherTongue: "",
      preferredEducation: "",
      preferredOccupation: "",
      preferredLocation: "",
      incomeRange: { min: "", max: "" },
      preferredHeight: { min: "", max: "" },
      preferredLanguages: "",
      culturalBackground: "",
      preferredCaste: "",
    },
    showEmail: false,
    showMobile: false,
    profileVisibility: "Member",
    photoVisibility: "All",
  });

  const API_URL = import.meta.env.VITE_API_KEY;

  // ==================== VALIDATION RULES ====================
  const validationRules = {
    // ... (keep all your existing validation rules)
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
    mobileNo: {
      required: true,
      pattern: /^[0-9]{10}$/,
      message: "Enter a valid 10-digit mobile number"
    },
    userType: {
      required: true,
      message: "Please select user type"
    },
    diet: {
      required: true,
      message: "Please select diet preference"
    },
    gender: {
      required: true,
      message: "Please select gender"
    },
    dateOfBirth: {
      required: true,
      validate: (value) => {
        const dob = new Date(value);
        const today = new Date();
        const minAge = new Date();
        minAge.setFullYear(today.getFullYear() - 100);
        return dob <= today && dob >= minAge;
      },
      message: "Enter a valid date of birth (age 18-100)"
    },
    religion: {
      required: true,
      minLength: 2,
      message: "Religion is required"
    },
    maritalStatus: {
      required: true,
      message: "Please select marital status"
    },
    city: {
      required: true,
      minLength: 2,
      message: "City is required"
    },
    state: {
      required: true,
      minLength: 2,
      message: "State is required"
    },
    educationLevel: {
      required: true,
      minLength: 2,
      message: "Education level is required"
    },
    occupation: {
      required: true,
      minLength: 2,
      message: "Occupation is required"
    },
    country: {
      required: true,
      message: "Country is required"
    },
    citizenshipStatus: {
      required: true,
      message: "Please select citizenship status"
    },
    "partnerPreferences.ageRange.min": {
      required: true,
      validate: (value) => parseInt(value) >= 18 && parseInt(value) <= 80,
      message: "Min age must be 18-80"
    },
    "partnerPreferences.ageRange.max": {
      required: true,
      validate: (value, formData) => {
        const minAge = parseInt(formData.partnerPreferences.ageRange.min) || 0;
        const maxAge = parseInt(value) || 0;
        return maxAge >= minAge && maxAge <= 80;
      },
      message: "Max age must be greater than min age and max 80"
    },
    profileBio: {
      maxLength: 500,
      message: "Profile bio cannot exceed 500 characters"
    },
    height: {
      pattern: /^[0-9]'[0-9]{1,2}"?$/,
      message: "Enter height in format like 5'8\""
    },
    annualIncome: {
      pattern: /^[0-9,]*$/,
      message: "Enter valid income (numbers only)"
    },
    zipCode: {
      pattern: /^[0-9]{5,6}$/,
      message: "Enter valid zip code (5-6 digits)"
    }
  };

  // ==================== VALIDATION FUNCTIONS ====================
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
// put this inside your component (above return)
const getZipCodePlaceholder = (country) => {
  if (!country) return "Enter postal / zip code";

  switch (country) {
    case "India":
      return "e.g., 400001";
    case "United States":
      return "e.g., 90210";
    case "United Kingdom":
      return "e.g., SW1A 1AA";
    case "Canada":
      return "e.g., M5V 2T6";
    case "Australia":
      return "e.g., 2000";
    default:
      return "Enter postal / zip code";
  }
};

  const validateAllFields = () => {
    const errors = {};
    
    Object.keys(validationRules).forEach(fieldName => {
      const value = getNestedValue(formData, fieldName);
      const error = validateField(fieldName, value, formData);
      if (error) {
        errors[fieldName] = error;
      }
    });

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ==================== UTILITY FUNCTIONS ====================
  const getNestedValue = (obj, path) => {
    return path.split('.').reduce((o, p) => (o && o[p] !== undefined ? o[p] : ''), obj);
  };

  const setNestedValue = (obj, path, value) => {
    const keys = path.split('.');
    const lastKey = keys.pop();
    const target = keys.reduce((o, p) => {
      if (o[p] === undefined || o[p] === null) {
        o[p] = {};
      }
      return o[p];
    }, obj);
    target[lastKey] = value;
    return { ...obj };
  };

  // ==================== FIXED FILE HANDLERS ====================
  const handleDocumentChange = (e) => {
    const files = Array.from(e.target.files);
    const allowedTypes = ["image/jpeg", "image/png", "application/pdf", "image/jpg"];
    const maxSize = 10 * 1024 * 1024; // 10MB

    const validFiles = files.filter(file => {
      if (!allowedTypes.includes(file.type)) {
        alert(`File ${file.name} is not supported. Allowed: JPG, PNG, PDF`);
        return false;
      }
      if (file.size > maxSize) {
        alert(`File ${file.name} is too large. Maximum size is 10MB`);
        return false;
      }
      return true;
    });

    setDocuments(prev => [...prev, ...validFiles]);
    
    // Reset the input to allow selecting same file again
    if (documentsInputRef.current) {
      documentsInputRef.current.value = '';
    }
  };

  const removeDocument = (index) => {
    setDocuments(prev => prev.filter((_, i) => i !== index));
  };

  // FIXED: Profile Image Handler
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      alert("Please select a valid image file (JPG, PNG)");
      // Reset input
      if (profileImageInputRef.current) {
        profileImageInputRef.current.value = '';
      }
      return;
    }

    if (file.size > maxSize) {
      alert("Profile image must be less than 5MB");
      // Reset input
      if (profileImageInputRef.current) {
        profileImageInputRef.current.value = '';
      }
      return;
    }

    // Clear previous image and set new one
    setProfileImage(file);
    
    // Reset input to allow selecting same file again
    // This prevents the duplicate upload issue
    if (profileImageInputRef.current) {
      profileImageInputRef.current.value = '';
    }
  };

  // FIXED: Remove Profile Image
  const removeProfileImage = () => {
    setProfileImage(null);
    // Also reset the file input
    if (profileImageInputRef.current) {
      profileImageInputRef.current.value = '';
    }
  };

  const handleFieldBlur = (fieldName) => {
    setTouchedFields(prev => ({ ...prev, [fieldName]: true }));
    
    const value = getNestedValue(formData, fieldName);
    const error = validateField(fieldName, value, formData);
    
    setFieldErrors(prev => ({
      ...prev,
      [fieldName]: error
    }));
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => {
      const updateValue = type === "checkbox" ? checked : value;
      return setNestedValue(prev, name, updateValue);
    });

    // Real-time validation for touched fields
    if (touchedFields[name]) {
      const error = validateField(name, type === "checkbox" ? checked : value, formData);
      setFieldErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  };

  // ==================== API HANDLERS ====================
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

      console.log('Email verified:', data);
     
      if (data.token) {
        localStorage.setItem('vivahanamToken', data.token);
      }
     
      setShowOtpModal(false);
      setShowSuccessModal(true);
      setOtp("");
    } catch (err) {
      console.error('Verification error:', err);
      setVerifyError(err.message || "Verification failed. Please check your email and try again.");
    } finally {
      setVerifyLoading(false);
    }
  };

  // FIXED: Submit Handler - Ensure files are only uploaded once
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Mark all fields as touched to show all errors
    const allFields = Object.keys(validationRules);
    const touched = {};
    allFields.forEach(field => { touched[field] = true; });
    setTouchedFields(touched);

    // Validate all fields
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

      // Append all form data
      Object.keys(formData).forEach(key => {
        const value = formData[key];
        
        if (key === "partnerPreferences") {
          const cleanPreferences = {};
          Object.keys(value).forEach(subKey => {
            const subValue = value[subKey];
            
            if (["ageRange", "incomeRange", "preferredHeight"].includes(subKey)) {
              const cleanSubObject = {};
              Object.keys(subValue).forEach(subSubKey => {
                if (subValue[subSubKey] !== "" && subValue[subSubKey] !== undefined) {
                  cleanSubObject[subSubKey] = subValue[subSubKey];
                }
              });
              if (Object.keys(cleanSubObject).length > 0) {
                cleanPreferences[subKey] = cleanSubObject;
              }
            } else if (subValue !== "" && subValue !== undefined) {
              cleanPreferences[subKey] = typeof subValue === "string" && subValue.includes(",")
                ? subValue.split(",").map(item => item.trim()).filter(item => item !== "")
                : [subValue];
            }
          });
          
          if (Object.keys(cleanPreferences).length > 0) {
            submitData.append(key, JSON.stringify(cleanPreferences));
          }
        } else if (["hobbies", "languages"].includes(key)) {
          if (value !== "" && value !== undefined) {
            const arrayValue = typeof value === "string"
              ? value.split(",").map(item => item.trim()).filter(item => item !== "")
              : value;
            if (arrayValue.length > 0) {
              submitData.append(key, JSON.stringify(arrayValue));
            }
          }
        } else if (value !== null && value !== undefined && value !== "" && (typeof value !== "number" || value !== 0)) {
          submitData.append(key, value);
        }
      });

      // FIXED: Append files only once
      if (profileImage) {
        submitData.append("profileImage", profileImage);
        console.log("📤 Appending profile image:", profileImage.name);
      }

      // FIXED: Append documents only once
      documents.forEach((doc, index) => {
        submitData.append("documents", doc);
        console.log(`📤 Appending document ${index}:`, doc.name);
      });

      // Log what's being sent
      console.log("📦 FormData contents:");
      for (let pair of submitData.entries()) {
        console.log(pair[0] + ': ', pair[1]);
      }

      // API Call
      const response = await fetch(`${API_URL}/user/register`, {
        method: 'POST',
        body: submitData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Registration failed: ${response.statusText}`);
      }

      console.log('Registration successful:', data);
      setShowOtpModal(true);

    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  };

  // ==================== EFFECTS ====================
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
        window.location.href = "/";
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessModal]);

  // ==================== RENDER HELPERS ====================
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
    const baseClass = "mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500";
    
    if (touchedFields[fieldName] && fieldErrors[fieldName]) {
      return `${baseClass} border-red-300 focus:border-red-500`;
    }
    
    return `${baseClass} border-gray-300 focus:border-orange-500`;
  };

  // ==================== COMPONENT RENDER ====================
  return (
    <div className="min-h-screen relative overflow-hidden px-4 pt-30 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-amber-100 opacity-90"></div>
      <div className="relative z-10 flex items-center justify-center py-8">
        <div className="max-w-4xl w-full space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-red-700">
              वसुधैव कुटुम्बकम्
            </h2>
            <h2 className="mt-2 text-3xl font-bold text-gray-900">
              Join Vivahanam - Find Your Life Partner
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Create your profile to start your Vivahanam journey
            </p>
          </div>

          <div className="bg-white/95 backdrop-blur-sm shadow-2xl rounded-2xl p-8 space-y-6 border border-orange-100">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8" autoComplete="off">
               {/* ==================== GENERAL & BASIC INFO ==================== */}
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  General & Basic Info
                </h3>
                <div className="mt-4 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        First Name <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        onBlur={() => handleFieldBlur("firstName")}
                        required
                        autoComplete="given-name"
                        className={getInputClassName("firstName")}
                      />
                      {renderFieldError("firstName")}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Middle Name (optional)
                      </label>
                      <input
                        type="text"
                        name="middleName"
                        value={formData.middleName}
                        onChange={handleInputChange}
                        autoComplete="additional-name"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Last Name <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        onBlur={() => handleFieldBlur("lastName")}
                        required
                        autoComplete="family-name"
                        className={getInputClassName("lastName")}
                      />
                      {renderFieldError("lastName")}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Email <span className="text-red-600">*</span>
                      </label>
                      <input
                        ref={emailInputRef}
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        onBlur={() => handleFieldBlur("email")}
                        required
                        placeholder="you@example.com"
                        autoComplete="new-email"
                        className={getInputClassName("email")}
                      />
                      {renderFieldError("email")}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Password <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        onBlur={() => handleFieldBlur("password")}
                        required
                        autoComplete="new-password"
                        className={getInputClassName("password")}
                      />
                      {renderFieldError("password")}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Mobile Number <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="tel"
                        name="mobileNo"
                        value={formData.mobileNo}
                        onChange={handleInputChange}
                        onBlur={() => handleFieldBlur("mobileNo")}
                        required
                        autoComplete="tel"
                        className={getInputClassName("mobileNo")}
                      />
                      {renderFieldError("mobileNo")}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        User Type <span className="text-red-600">*</span>
                      </label>
                      <select
                        name="userType"
                        value={formData.userType}
                        onChange={handleInputChange}
                        onBlur={() => handleFieldBlur("userType")}
                        required
                        className={getInputClassName("userType")}
                      >
                        <option value="">Select Type</option>
                        <option value="Self">Self</option>
                        <option value="Parent">Parent</option>
                        <option value="Relative">Relative</option>
                        <option value="Sibling">Sibling</option>
                      </select>
                      {renderFieldError("userType")}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Diet <span className="text-red-600">*</span>
                      </label>
                      <select
                        name="diet"
                        value={formData.diet}
                        onChange={handleInputChange}
                        onBlur={() => handleFieldBlur("diet")}
                        required
                        className={getInputClassName("diet")}
                      >
                        <option value="">Select Diet</option>
                        <option value="Vegetarian">Vegetarian</option>
                        <option value="Eggetarian">Eggetarian</option>
                        <option value="Non-Vegetarian">Non-Vegetarian</option>
                        <option value="Vegan">Vegan</option>
                      </select>
                      {renderFieldError("diet")}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Gender <span className="text-red-600">*</span>
                      </label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        onBlur={() => handleFieldBlur("gender")}
                        required
                        className={getInputClassName("gender")}
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                      {renderFieldError("gender")}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Date of Birth <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                        onBlur={() => handleFieldBlur("dateOfBirth")}
                        required
                        className={getInputClassName("dateOfBirth")}
                      />
                      {renderFieldError("dateOfBirth")}
                    </div>

                    <div>
  <label className="block text-sm font-medium text-gray-700">
    Religion <span className="text-red-600">*</span>
  </label>
  <input
    type="text"
    name="religion"
    value={formData.religion}
    onChange={handleInputChange}
    onBlur={() => handleFieldBlur("religion")}
    required
    list="religion-suggestions"
    className={getInputClassName("religion")}
  />
  
  {/* Religion suggestions datalist */}
  <datalist id="religion-suggestions">
    <option value="Christianity" />
    <option value="Islam" />
    <option value="Hinduism" />
    <option value="Buddhism" />
    <option value="Sikhism" />
    <option value="Judaism" />
    <option value="Atheism" />
    <option value="Agnosticism" />
    <option value="Catholicism" />
    <option value="Protestantism" />
    <option value="Orthodox Christianity" />
    <option value="Jainism" />
    <option value="Bahá'í Faith" />
    <option value="Shinto" />
    <option value="Taoism" />
    <option value="Zoroastrianism" />
    <option value="Other" />
    <option value="Prefer not to say" />
  </datalist>

  {renderFieldError("religion")}
</div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Marital Status <span className="text-red-600">*</span>
                      </label>
                      <select
                        name="maritalStatus"
                        value={formData.maritalStatus}
                        onChange={handleInputChange}
                        onBlur={() => handleFieldBlur("maritalStatus")}
                        required
                        className={getInputClassName("maritalStatus")}
                      >
                        <option value="">Select Status</option>
                        <option value="Never Married">Never Married</option>
                        <option value="Divorced">Divorced</option>
                        <option value="Widowed">Widowed</option>
                        <option value="Awaiting Divorce">Awaiting Divorce</option>
                      </select>
                      {renderFieldError("maritalStatus")}
                    </div>

                   <div>
  <label className="block text-sm font-medium text-gray-700">
    Mother Tongue (optional)
  </label>
  <input
    type="text"
    name="motherTongue"
    value={formData.motherTongue}
    onChange={handleInputChange}
    list="motherTongue-suggestions"
    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
  />

  {/* Mother Tongue suggestions datalist */}
  <datalist id="motherTongue-suggestions">
    <option value="Hindi" />
    <option value="English" />
    <option value="Marathi" />
    <option value="Bengali" />
    <option value="Tamil" />
    <option value="Telugu" />
    <option value="Gujarati" />
    <option value="Kannada" />
    <option value="Malayalam" />
    <option value="Punjabi" />
    <option value="Urdu" />
    <option value="Odia" />
    <option value="Assamese" />
    <option value="Konkani" />
    <option value="Sindhi" />
    <option value="Kashmiri" />
    <option value="Manipuri" />
    <option value="Nepali" />
    <option value="Santhali" />
    <option value="Bodo" />
    <option value="Dogri" />
    <option value="Other" />
  </datalist>
</div>

                  </div>
                </div>
              </div>

              {/* ==================== LOCATION & EDUCATION ==================== */}
            <div>
  <h3 className="text-lg font-medium text-gray-900">
    Present Location & Education
  </h3>

  <div className="mt-4 space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* ===== Country Field ===== */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Country <span className="text-red-600">*</span>
        </label>
        <select
          name="country"
          value={formData.country}
          onChange={(e) => {
            handleInputChange(e);
            // Reset state, city, district if country changes
            if (e.target.value !== "India") {
              handleInputChange({
                target: { name: "state", value: "" },
              });
              handleInputChange({
                target: { name: "city", value: "" },
              });
              handleInputChange({
                target: { name: "district", value: "" },
              });
            }
          }}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          required
        >
          <option value="">Select Country</option>
          <option value="India">India</option>
          <option value="United States">United States</option>
          <option value="United Kingdom">United Kingdom</option>
          <option value="Canada">Canada</option>
          <option value="Australia">Australia</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {/* ===== State Field ===== */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          State <span className="text-red-600">*</span>
        </label>

        {formData.country === "India" ? (
          <select
            name="state"
            value={formData.state}
            onChange={(e) => {
              handleInputChange(e);
              // Reset city and district when state changes
              handleInputChange({
                target: { name: "city", value: "" },
              });
              handleInputChange({
                target: { name: "district", value: "" },
              });
            }}
            onBlur={() => handleFieldBlur("state")}
            required
            className={getInputClassName("state")}
          >
            <option value="">Select State</option>
            <option value="Maharashtra">Maharashtra</option>
            <option value="Gujarat">Gujarat</option>
            <option value="Karnataka">Karnataka</option>
            <option value="Tamil Nadu">Tamil Nadu</option>
            <option value="Uttar Pradesh">Uttar Pradesh</option>
            <option value="Madhya Pradesh">Madhya Pradesh</option>
            <option value="Rajasthan">Rajasthan</option>
            <option value="Delhi">Delhi</option>
            <option value="Bihar">Bihar</option>
            <option value="Punjab">Punjab</option>
            <option value="Haryana">Haryana</option>
            <option value="Odisha">Odisha</option>
            <option value="Kerala">Kerala</option>
            <option value="West Bengal">West Bengal</option>
            <option value="Other">Other</option>
          </select>
        ) : (
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleInputChange}
            onBlur={() => handleFieldBlur("state")}
            required
            className={getInputClassName("state")}
            placeholder="Enter your state"
          />
        )}

        {renderFieldError("state")}
      </div>

      {/* ===== City Field ===== */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          City <span className="text-red-600">*</span>
        </label>

        {formData.country === "India" ? (
          <>
            {formData.state === "Maharashtra" && (
              <select
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                onBlur={() => handleFieldBlur("city")}
                required
                className={getInputClassName("city")}
              >
                <option value="">Select City</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Pune">Pune</option>
                <option value="Nagpur">Nagpur</option>
                <option value="Nashik">Nashik</option>
              </select>
            )}

            {formData.state === "Gujarat" && (
              <select
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                onBlur={() => handleFieldBlur("city")}
                required
                className={getInputClassName("city")}
              >
                <option value="">Select City</option>
                <option value="Ahmedabad">Ahmedabad</option>
                <option value="Surat">Surat</option>
                <option value="Vadodara">Vadodara</option>
                <option value="Rajkot">Rajkot</option>
              </select>
            )}

            {formData.state === "Karnataka" && (
              <select
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                onBlur={() => handleFieldBlur("city")}
                required
                className={getInputClassName("city")}
              >
                <option value="">Select City</option>
                <option value="Bengaluru">Bengaluru</option>
                <option value="Mysuru">Mysuru</option>
                <option value="Mangalore">Mangalore</option>
              </select>
            )}

            {/* Default for states not in list */}
            {formData.state &&
              !["Maharashtra", "Gujarat", "Karnataka"].includes(
                formData.state
              ) && (
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  onBlur={() => handleFieldBlur("city")}
                  required
                  className={getInputClassName("city")}
                  placeholder="Enter your city"
                />
              )}
          </>
        ) : (
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            onBlur={() => handleFieldBlur("city")}
            required
            className={getInputClassName("city")}
            placeholder="Enter your city"
          />
        )}

        {renderFieldError("city")}
      </div>

      {/* ===== District Field ===== */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          District (optional)
        </label>

        {formData.country === "India" && formData.city === "Nagpur" ? (
          <select
            name="district"
            value={formData.district}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="">Select District</option>
            <option value="Nagpur">Nagpur</option>
            <option value="Wardha">Wardha</option>
            <option value="Bhandara">Bhandara</option>
          </select>
        ) : (
          <input
            type="text"
            name="district"
            value={formData.district}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Enter district (if applicable)"
          />
        )}
      </div>
    </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div>
  <label className="block text-sm font-medium text-gray-700">
    Current City (optional)
  </label>

  {formData.country === "India" ? (
    <>
      {formData.state === "Maharashtra" && (
        <select
          name="currentCity"
          value={formData.currentCity}
          onChange={handleInputChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="">Select Current City</option>
          <option value="Mumbai">Mumbai</option>
          <option value="Pune">Pune</option>
          <option value="Nagpur">Nagpur</option>
          <option value="Nashik">Nashik</option>
        </select>
      )}

      {formData.state === "Gujarat" && (
        <select
          name="currentCity"
          value={formData.currentCity}
          onChange={handleInputChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="">Select Current City</option>
          <option value="Ahmedabad">Ahmedabad</option>
          <option value="Surat">Surat</option>
          <option value="Vadodara">Vadodara</option>
          <option value="Rajkot">Rajkot</option>
        </select>
      )}

      {formData.state === "Karnataka" && (
        <select
          name="currentCity"
          value={formData.currentCity}
          onChange={handleInputChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="">Select Current City</option>
          <option value="Bengaluru">Bengaluru</option>
          <option value="Mysuru">Mysuru</option>
          <option value="Mangalore">Mangalore</option>
        </select>
      )}

      {/* Default for other Indian states */}
      {formData.state &&
        !["Maharashtra", "Gujarat", "Karnataka"].includes(formData.state) && (
          <input
            type="text"
            name="currentCity"
            value={formData.currentCity}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Enter your current city"
          />
        )}
    </>
  ) : (
    // For countries other than India → Free text input
    <input
      type="text"
      name="currentCity"
      value={formData.currentCity}
      onChange={handleInputChange}
      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
      placeholder="Enter your current city"
    />
  )}
</div>


                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Native Place (optional)
                      </label>
                      <input
                        type="text"
                        name="nativePlace"
                        value={formData.nativePlace}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                  </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  <div>
    <label className="block text-sm font-medium text-gray-700">
      Education Level <span className="text-red-600">*</span>
    </label>
    <select
      name="educationLevel"
      value={formData.educationLevel}
      onChange={handleInputChange}
      onBlur={() => handleFieldBlur("educationLevel")}
      required
      className={getInputClassName("educationLevel")}
    >
      <option value="">Select Education Level</option>
      <option value="High School">High School</option>
      <option value="Diploma">Diploma</option>
      <option value="Associate Degree">Associate Degree</option>
      <option value="Bachelor's Degree">Bachelor's Degree</option>
      <option value="Master's Degree">Master's Degree</option>
      <option value="Doctorate (PhD)">Doctorate (PhD)</option>
      <option value="Professional Degree">Professional Degree</option>
      <option value="Other">Other</option>
    </select>
    {renderFieldError("educationLevel")}
  </div>

  <div>
    <label className="block text-sm font-medium text-gray-700">
      Field of Study (optional)
    </label>
    <input
      type="text"
      name="fieldOfStudy"
      value={formData.fieldOfStudy}
      onChange={handleInputChange}
      list={`field-of-study-${formData.educationLevel.replace(/\s+/g, '-')}`}
      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
    />
    
    {/* All field of study suggestions in one datalist */}
    <datalist id={`field-of-study-${formData.educationLevel.replace(/\s+/g, '-')}`}>
      {/* High School */}
      {formData.educationLevel === "High School" && (
        <>
          <option value="Science" />
          <option value="Commerce" />
          <option value="Arts" />
          <option value="Vocational" />
          <option value="General" />
        </>
      )}
      
      {/* Diploma */}
      {formData.educationLevel === "Diploma" && (
        <>
          <option value="Engineering" />
          <option value="Computer Science" />
          <option value="Business Management" />
          <option value="Hospitality" />
          <option value="Healthcare" />
          <option value="Design" />
          <option value="Automobile" />
          <option value="Electronics" />
        </>
      )}
      
      {/* Associate Degree */}
      {formData.educationLevel === "Associate Degree" && (
        <>
          <option value="Arts (AA)" />
          <option value="Science (AS)" />
          <option value="Applied Science (AAS)" />
          <option value="Business Administration" />
          <option value="Computer Science" />
          <option value="Nursing" />
        </>
      )}
      
      {/* Bachelor's Degree */}
      {formData.educationLevel === "Bachelor's Degree" && (
        <>
          <option value="Computer Science" />
          <option value="Business Administration" />
          <option value="Engineering" />
          <option value="Medicine (MBBS)" />
          <option value="Arts" />
          <option value="Science" />
          <option value="Commerce" />
          <option value="Law" />
          <option value="Architecture" />
          <option value="Pharmacy" />
          <option value="Nursing" />
          <option value="Education" />
          <option value="Psychology" />
          <option value="Economics" />
          <option value="Accounting" />
          <option value="Finance" />
          <option value="Marketing" />
        </>
      )}
      
      {/* Master's Degree */}
      {formData.educationLevel === "Master's Degree" && (
        <>
          <option value="Business Administration (MBA)" />
          <option value="Computer Science" />
          <option value="Engineering" />
          <option value="Data Science" />
          <option value="Public Health" />
          <option value="Education" />
          <option value="Psychology" />
          <option value="Economics" />
          <option value="Finance" />
          <option value="Marketing" />
          <option value="International Relations" />
          <option value="Social Work" />
          <option value="Biotechnology" />
        </>
      )}
      
      {/* Doctorate (PhD) */}
      {formData.educationLevel === "Doctorate (PhD)" && (
        <>
          <option value="Computer Science" />
          <option value="Engineering" />
          <option value="Physics" />
          <option value="Chemistry" />
          <option value="Biology" />
          <option value="Mathematics" />
          <option value="Economics" />
          <option value="Psychology" />
          <option value="Education" />
          <option value="Business" />
          <option value="Medicine" />
          <option value="Philosophy" />
        </>
      )}
      
      {/* Professional Degree */}
      {formData.educationLevel === "Professional Degree" && (
        <>
          <option value="Medicine (MD)" />
          <option value="Law (JD)" />
          <option value="Dentistry (DDS)" />
          <option value="Pharmacy (PharmD)" />
          <option value="Veterinary Medicine (DVM)" />
          <option value="Architecture (M.Arch)" />
        </>
      )}
      
      {/* Other or Default */}
      {(formData.educationLevel === "Other" || !formData.educationLevel) && (
        <>
          <option value="Computer Science" />
          <option value="Business Administration" />
          <option value="Engineering" />
          <option value="Medicine" />
          <option value="Arts" />
          <option value="Science" />
          <option value="Commerce" />
          <option value="Law" />
          <option value="Education" />
          <option value="Other" />
        </>
      )}
    </datalist>
  </div>
</div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
  <label className="block text-sm font-medium text-gray-700">
    Occupation <span className="text-red-600">*</span>
  </label>
  <input
    type="text"
    name="occupation"
    list="occupationList"
    value={formData.occupation}
    onChange={handleInputChange}
    onBlur={() => handleFieldBlur("occupation")}
    required
    className={getInputClassName("occupation")}
  />
  <datalist id="occupationList">
    <option value="Software Engineer" />
    <option value="Teacher" />
    <option value="Doctor" />
    <option value="Nurse" />
    <option value="Police Officer" />
    <option value="Driver" />
    <option value="Businessman" />
    <option value="Farmer" />
    <option value="Student" />
    <option value="Electrician" />
    <option value="Plumber" />
    <option value="Technician" />
    <option value="Accountant" />
    <option value="Shopkeeper" />
    <option value="Engineer" />
    <option value="Mechanic" />
  </datalist>
  {renderFieldError("occupation")}
</div>


                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Employer (optional)
                      </label>
                      <input
                        type="text"
                        name="employer"
                        value={formData.employer}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div>
  <label className="block text-sm font-medium text-gray-700">
    Annual Income (optional)
  </label>
  <input
    type="text"
    name="annualIncome"
    value={formData.annualIncome}
    onChange={(e) => {
      const value = e.target.value;
      // Prevent invalid characters — allow only digits and commas
      if (/^[0-9,]*$/.test(value)) {
        handleInputChange(e);
      }
    }}
    onBlur={() => handleFieldBlur("annualIncome")}
    placeholder="e.g. 500000 or 5,00,000"
    className={getInputClassName("annualIncome")}
  />
  {renderFieldError("annualIncome")}
</div>


                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Height (optional)
                      </label>
                      <input
                        type="text"
                        name="height"
                        value={formData.height}
                        onChange={handleInputChange}
                        onBlur={() => handleFieldBlur("height")}
                        placeholder="e.g., 5'8&quot;"
                        className={getInputClassName("height")}
                      />
                      {renderFieldError("height")}
                    </div>
                  </div>

                 <div>
  <label className="block text-sm font-medium text-gray-700">
    Physical Status / Health Check (optional)
  </label>

  <textarea
    name="physicalStatus"
    rows={2}
    maxLength={250} // limit to 250 characters
    value={formData.physicalStatus}
    onChange={handleInputChange}
    onBlur={() => handleFieldBlur("physicalStatus")}
    placeholder="e.g., Good health, no medical conditions..."
    className={getInputClassName("physicalStatus") + " resize-none"}
  />

  {/* Character counter below field */}
  <div className="text-xs text-gray-500 text-right mt-1">
    {250 - (formData.physicalStatus?.length || 0)} characters remaining
  </div>

  {renderFieldError("physicalStatus")}
</div>

                </div>
              </div>

              {/* ==================== RELIGION & CULTURAL ==================== */}
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Religion & Cultural
                </h3>
                <div className="mt-4 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div>
  <label className="block text-sm font-medium text-gray-700">
    Caste (optional)
  </label>

  <input
    type="text"
    name="caste"
    value={formData.caste || ""}
    onChange={handleInputChange}
    list="caste-suggestions"
    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
    placeholder="Select or type caste"
  />

  {/* Suggestion List */}
  <datalist id="caste-suggestions">
    <option value="Brahmin" />
    <option value="Kshatriya" />
    <option value="Vaishya" />
    <option value="Shudra" />
    <option value="Maratha" />
    <option value="Rajput" />
    <option value="Kayastha" />
    <option value="Jat" />
    <option value="Yadav" />
    <option value="Gupta" />
    <option value="Patel" />
    <option value="Reddy" />
    <option value="Naidu" />
    <option value="Nair" />
    <option value="Ezhava" />
    <option value="Vanniyar" />
    <option value="Nadar" />
    <option value="Baniya" />
    <option value="SC (Scheduled Caste)" />
    <option value="ST (Scheduled Tribe)" />
    <option value="OBC (Other Backward Class)" />
    <option value="General" />
    <option value="NT (Nomadic Tribe)" />
    <option value="Dhangar" />
    <option value="Kunbi" />
    <option value="Lohar" />
    <option value="Sonar" />
    <option value="Other" />
    <option value="Prefer not to say" />
  </datalist>
</div>


                   <div>
  <label className="block text-sm font-medium text-gray-700">
    Mother Tongue (optional)
  </label>
  <input
    type="text"
    name="motherTongue"
    value={formData.motherTongue}
    onChange={handleInputChange}
    list="language-suggestions"
    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
  />
  
  {/* Language suggestions datalist */}
  <datalist id="language-suggestions">
    <option value="English" />
    <option value="Spanish" />
    <option value="Hindi" />
    <option value="Arabic" />
    <option value="Bengali" />
    <option value="Portuguese" />
    <option value="Russian" />
    <option value="Japanese" />
    <option value="Punjabi" />
    <option value="German" />
    <option value="French" />
    <option value="Urdu" />
    <option value="Tamil" />
    <option value="Telugu" />
    <option value="Marathi" />
    <option value="Gujarati" />
    <option value="Malayalam" />
    <option value="Kannada" />
    <option value="Odia" />
    <option value="Chinese (Mandarin)" />
    <option value="Chinese (Cantonese)" />
    <option value="Korean" />
    <option value="Italian" />
    <option value="Dutch" />
    <option value="Turkish" />
    <option value="Polish" />
    <option value="Ukrainian" />
    <option value="Persian" />
    <option value="Thai" />
    <option value="Vietnamese" />
    <option value="Malay" />
    <option value="Indonesian" />
    <option value="Filipino" />
    <option value="Burmese" />
    <option value="Nepali" />
    <option value="Sinhala" />
    <option value="Sanskrit" />
    <option value="Assamese" />
    <option value="Kashmiri" />
    <option value="Konkani" />
    <option value="Maithili" />
    <option value="Santali" />
    <option value="Sindhi" />
    <option value="Bhojpuri" />
    <option value="Other" />
  </datalist>
</div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        DOB Time (optional)
                      </label>
                      <input
                        type="time"
                        name="birthTime"
                        value={formData.birthTime}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Place of Birth (optional)
                      </label>
                      <input
                        type="text"
                        name="placeOfBirth"
                        value={formData.placeOfBirth}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                  </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {/* Zodiac Sign Field */}
  <div>
    <label className="block text-sm font-medium text-gray-700">
      Zodiac Sign (optional)
    </label>
    <input
      type="text"
      name="zodiacSign"
      value={formData.zodiacSign || ""}
      onChange={handleInputChange}
      list="zodiac-suggestions"
      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
      placeholder="Select or type Zodiac Sign"
    />

    {/* Zodiac Sign suggestions */}
    <datalist id="zodiac-suggestions">
      <option value="Aries (Mesh)" />
      <option value="Taurus (Vrishabh)" />
      <option value="Gemini (Mithun)" />
      <option value="Cancer (Kark)" />
      <option value="Leo (Simha)" />
      <option value="Virgo (Kanya)" />
      <option value="Libra (Tula)" />
      <option value="Scorpio (Vrishchik)" />
      <option value="Sagittarius (Dhanu)" />
      <option value="Capricorn (Makar)" />
      <option value="Aquarius (Kumbh)" />
      <option value="Pisces (Meen)" />
      <option value="Not Sure" />
    </datalist>
  </div>

  {/* Gotra Field */}
  <div>
    <label className="block text-sm font-medium text-gray-700">
      Gotra (optional)
    </label>
    <input
      type="text"
      name="gotra"
      value={formData.gotra || ""}
      onChange={handleInputChange}
      list="gotra-suggestions"
      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
      placeholder="Select or type Gotra"
    />

    {/* Gotra suggestions */}
    <datalist id="gotra-suggestions">
      <option value="Bharadwaj" />
      <option value="Kashyap" />
      <option value="Vashishtha" />
      <option value="Gautam" />
      <option value="Agastya" />
      <option value="Atri" />
      <option value="Kaushik" />
      <option value="Bhrigu" />
      <option value="Vishwamitra" />
      <option value="Parashar" />
      <option value="Jamadagni" />
      <option value="Angirasa" />
      <option value="Shandilya" />
      <option value="Kapil" />
      <option value="Mandavya" />
      <option value="Harita" />
      <option value="Other" />
      <option value="Not Known" />
    </datalist>
  </div>
</div>

                </div>
              </div>

              {/* ==================== ADDRESS DETAILS ==================== */}
              
               <div>
  <h3 className="text-lg font-medium text-gray-900">Address</h3>
  <div className="mt-4 space-y-6">
    {/* Country with suggestions */}
    <div>
      <label className="block text-sm font-medium text-gray-700">
        Country <span className="text-red-600">*</span>
      </label>
      <input
        type="text"
        name="country"
        value={formData.country}
        onChange={handleInputChange}
        onBlur={() => handleFieldBlur("country")}
        list="country-suggestions"
        required
        className={getInputClassName("country")}
      />
      <datalist id="country-suggestions">
        <option value="United States" />
        <option value="India" />
        <option value="United Kingdom" />
        <option value="Canada" />
        <option value="Australia" />
        <option value="Germany" />
        <option value="France" />
        <option value="Japan" />
        <option value="China" />
        <option value="Brazil" />
        <option value="Mexico" />
        <option value="South Africa" />
        <option value="Nigeria" />
        <option value="Egypt" />
        <option value="Saudi Arabia" />
        <option value="United Arab Emirates" />
        <option value="Singapore" />
        <option value="Malaysia" />
        <option value="Pakistan" />
        <option value="Bangladesh" />
        <option value="Sri Lanka" />
        <option value="Nepal" />
        <option value="Bhutan" />
        <option value="Other" />
      </datalist>
      {renderFieldError("country")}
    </div>

    {/* Street Address */}
    <div>
      <label className="block text-sm font-medium text-gray-700">
        Street Address (optional)
      </label>
      <input
        type="text"
        name="streetAddress"
        value={formData.streetAddress}
        onChange={handleInputChange}
        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
      />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Address Line 2 */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Address Line 2 (optional)
        </label>
        <input
          type="text"
          name="addressLine2"
          value={formData.addressLine2}
          onChange={handleInputChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      {/* City with country-dependent suggestions */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          City
        </label>
        <input
          type="text"
          name="city"
          value={formData.city}
          onChange={handleInputChange}
          list={`city-suggestions-${formData.country.replace(/\s+/g, '-')}`}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <datalist id={`city-suggestions-${formData.country.replace(/\s+/g, '-')}`}>
          {formData.country === "India" && (
            <>
              <option value="Mumbai" />
              <option value="Delhi" />
              <option value="Bangalore" />
              <option value="Hyderabad" />
              <option value="Chennai" />
              <option value="Kolkata" />
              <option value="Pune" />
              <option value="Ahmedabad" />
              <option value="Jaipur" />
              <option value="Lucknow" />
            </>
          )}
          {formData.country === "United States" && (
            <>
              <option value="New York" />
              <option value="Los Angeles" />
              <option value="Chicago" />
              <option value="Houston" />
              <option value="Phoenix" />
              <option value="Philadelphia" />
              <option value="San Antonio" />
              <option value="San Diego" />
              <option value="Dallas" />
              <option value="San Jose" />
            </>
          )}
          {formData.country === "United Kingdom" && (
            <>
              <option value="London" />
              <option value="Manchester" />
              <option value="Birmingham" />
              <option value="Liverpool" />
              <option value="Glasgow" />
              <option value="Edinburgh" />
              <option value="Leeds" />
              <option value="Bristol" />
              <option value="Sheffield" />
              <option value="Newcastle" />
            </>
          )}
          {formData.country === "Canada" && (
            <>
              <option value="Toronto" />
              <option value="Vancouver" />
              <option value="Montreal" />
              <option value="Calgary" />
              <option value="Edmonton" />
              <option value="Ottawa" />
              <option value="Winnipeg" />
              <option value="Quebec City" />
              <option value="Hamilton" />
              <option value="Halifax" />
            </>
          )}
          {/* Add more countries as needed */}
          {(!formData.country || formData.country === "Other") && (
            <>
              <option value="Other" />
            </>
          )}
        </datalist>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* State with country-dependent suggestions */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          State / Region / Province
        </label>
        <input
          type="text"
          name="state"
          value={formData.state}
          onChange={handleInputChange}
          list={`state-suggestions-${formData.country.replace(/\s+/g, '-')}`}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <datalist id={`state-suggestions-${formData.country.replace(/\s+/g, '-')}`}>
          {formData.country === "India" && (
            <>
              <option value="Maharashtra" />
              <option value="Delhi" />
              <option value="Karnataka" />
              <option value="Tamil Nadu" />
              <option value="Uttar Pradesh" />
              <option value="West Bengal" />
              <option value="Gujarat" />
              <option value="Rajasthan" />
              <option value="Punjab" />
              <option value="Kerala" />
              <option value="Telangana" />
              <option value="Andhra Pradesh" />
              <option value="Madhya Pradesh" />
              <option value="Bihar" />
              <option value="Haryana" />
            </>
          )}
          {formData.country === "United States" && (
            <>
              <option value="California" />
              <option value="Texas" />
              <option value="Florida" />
              <option value="New York" />
              <option value="Illinois" />
              <option value="Pennsylvania" />
              <option value="Ohio" />
              <option value="Georgia" />
              <option value="North Carolina" />
              <option value="Michigan" />
            </>
          )}
          {formData.country === "Canada" && (
            <>
              <option value="Ontario" />
              <option value="Quebec" />
              <option value="British Columbia" />
              <option value="Alberta" />
              <option value="Manitoba" />
              <option value="Saskatchewan" />
              <option value="Nova Scotia" />
              <option value="New Brunswick" />
              <option value="Newfoundland and Labrador" />
              <option value="Prince Edward Island" />
            </>
          )}
          {(!formData.country || formData.country === "Other") && (
            <>
              <option value="Other" />
            </>
          )}
        </datalist>
      </div>

      {/* Postal Code with format validation */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Postal / Zip Code (optional)
        </label>
        <input
          type="text"
          name="zipCode"
          value={formData.zipCode}
          onChange={handleInputChange}
          onBlur={() => handleFieldBlur("zipCode")}
          placeholder={getZipCodePlaceholder(formData.country)}
          className={getInputClassName("zipCode")}
        />
        {renderFieldError("zipCode")}
      </div>
    </div>

    {/* Citizenship Status */}
    <div>
      <label className="block text-sm font-medium text-gray-700">
        Citizenship Status <span className="text-red-600">*</span>
      </label>
      <div className="mt-2 space-y-2">
        <div className="flex items-center">
          <input
            id="citizen"
            name="citizenshipStatus"
            type="radio"
            value="Citizen"
            checked={formData.citizenshipStatus === "Citizen"}
            onChange={handleInputChange}
            onBlur={() => handleFieldBlur("citizenshipStatus")}
            className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
          />
          <label htmlFor="citizen" className="ml-2 block text-sm text-gray-700">
            Citizen
          </label>
        </div>
        <div className="flex items-center">
          <input
            id="permanentResident"
            name="citizenshipStatus"
            type="radio"
            value="Permanent Resident"
            checked={formData.citizenshipStatus === "Permanent Resident"}
            onChange={handleInputChange}
            className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
          />
          <label htmlFor="permanentResident" className="ml-2 block text-sm text-gray-700">
            Permanent Resident
          </label>
        </div>
        <div className="flex items-center">
          <input
            id="otherCitizen"
            name="citizenshipStatus"
            type="radio"
            value="Other"
            checked={formData.citizenshipStatus === "Other"}
            onChange={handleInputChange}
            className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
          />
          <label htmlFor="otherCitizen" className="ml-2 block text-sm text-gray-700">
            Other
          </label>
        </div>
      </div>
      {renderFieldError("citizenshipStatus")}
    </div>
  </div>
</div> 

              {/* ==================== PROFILE & PERSONAL SECTION ==================== */}
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Profile & Personal
                </h3>
                <div className="mt-4 space-y-6">
                  {/* FIXED: Profile Image Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Profile Image (optional)
                      <span className="text-xs text-gray-500 ml-2">Max 5MB, JPG/PNG</span>
                    </label>
                    <div className="mt-2 flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        {profileImage ? (
                          <div className="relative">
                            <img
                              src={URL.createObjectURL(profileImage)}
                              alt="Profile preview"
                              className="h-20 w-20 rounded-full object-cover border-2 border-orange-300"
                            />
                            <button
                              type="button"
                              onClick={removeProfileImage} // Use the fixed remove function
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                            >
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ) : (
                          <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center border-2 border-dashed border-gray-300">
                            <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <input
                          ref={profileImageInputRef} // Add ref here
                          type="file"
                          id="profileImage"
                          accept="image/jpeg,image/png,image/jpg"
                          onChange={handleImageChange}
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Recommended: Square image, 500x500 pixels
                        </p>
                      </div>
                    </div>
                    {profileImage && (
                      <p className="text-sm text-green-600 mt-2">
                        ✓ Profile image ready for upload: {profileImage.name} ({(profileImage.size / (1024 * 1024)).toFixed(2)} MB)
                      </p>
                    )}
                  </div>

                  {/* Profile Bio */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Profile Bio (optional, max 500 chars)
                    </label>
                    <textarea
                      name="profileBio"
                      rows={3}
                      value={formData.profileBio}
                      onChange={handleInputChange}
                      onBlur={() => handleFieldBlur("profileBio")}
                      maxLength={500}
                      className={`mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none ${
                        touchedFields.profileBio && fieldErrors.profileBio 
                          ? "border-red-300 focus:border-red-500" 
                          : "border-gray-300 focus:border-orange-500"
                      }`}
                      placeholder="Tell us about yourself, your interests, and what you're looking for in a partner..."
                    />
                    <div className="flex justify-between mt-1">
                      <div>
                        {renderFieldError("profileBio")}
                      </div>
                      <p className="text-xs text-gray-500">
                        {formData.profileBio.length}/500 characters
                      </p>
                    </div>
                  </div>

                  {/* FIXED: Documents Upload */}
                  <div>
                    <h4 className="text-md font-medium text-gray-900">
                      Upload Documents (Optional)
                      <span className="text-xs text-gray-500 ml-2">
                        ID Proof, Passport, Education Certificates, etc. (Max 10MB each, PDF/JPG/PNG)
                      </span>
                    </h4>
                    <div className="mt-4 space-y-3">
                      <input
                        ref={documentsInputRef} // Add ref here
                        type="file"
                        multiple
                        onChange={handleDocumentChange}
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
                      />
                      
                      {documents.length > 0 && (
                        <div className="mt-4 space-y-2">
                          <p className="text-sm font-medium text-gray-700">
                            Files ready for upload ({documents.length}):
                          </p>
                          {documents.map((doc, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg border border-gray-200"
                            >
                              <div className="flex items-center space-x-3">
                                <div className="min-w-0 flex-1">
                                  <p className="text-sm font-medium text-gray-900 truncate">
                                    {doc.name}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {(doc.size / (1024 * 1024)).toFixed(2)} MB
                                  </p>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeDocument(index)}
                                className="text-red-600 hover:text-red-800 font-medium p-1"
                              >
                                Remove
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Hobbies & Languages */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {/* Hobbies / Interests */}
  <div>
    <label className="block text-sm font-medium text-gray-700">
      Hobbies / Interests (optional, comma separated)
    </label>
    <input
      type="text"
      name="hobbies"
      value={formData.hobbies}
      onChange={(e) => {
        if (e.target.value.length <= 100) {
          handleInputChange(e);
        }
      }}
      onBlur={() => handleFieldBlur("hobbies")}
      placeholder="e.g., Reading, Travel, Music"
      list="hobbies-suggestions"
      className={getInputClassName("hobbies")}
    />

    {/* Hobbies suggestions datalist */}
    <datalist id="hobbies-suggestions">
      <option value="Reading" />
      <option value="Traveling" />
      <option value="Music" />
      <option value="Cooking" />
      <option value="Photography" />
      <option value="Gardening" />
      <option value="Writing" />
      <option value="Dancing" />
      <option value="Painting" />
      <option value="Sports" />
      <option value="Movies" />
      <option value="Meditation" />
      <option value="Yoga" />
      <option value="Gaming" />
      <option value="Volunteering" />
    </datalist>

    {/* Validation message */}
    {formData.hobbies.length > 100 && (
      <p className="text-red-600 text-xs mt-1">
        Maximum 100 characters allowed
      </p>
    )}
    {renderFieldError("hobbies")}
  </div>

  {/* Languages */}
  <div>
    <label className="block text-sm font-medium text-gray-700">
      Languages (optional, comma separated)
    </label>
    <input
      type="text"
      name="languages"
      value={formData.languages}
      onChange={(e) => {
        if (e.target.value.length <= 100) {
          handleInputChange(e);
        }
      }}
      onBlur={() => handleFieldBlur("languages")}
      placeholder="e.g., English, Hindi, Tamil"
      list="languages-suggestions"
      className={getInputClassName("languages")}
    />

    {/* Languages suggestions datalist */}
    <datalist id="languages-suggestions">
      <option value="English" />
      <option value="Hindi" />
      <option value="Marathi" />
      <option value="Tamil" />
      <option value="Telugu" />
      <option value="Bengali" />
      <option value="Gujarati" />
      <option value="Kannada" />
      <option value="Malayalam" />
      <option value="Punjabi" />
      <option value="Urdu" />
      <option value="Odia" />
      <option value="Assamese" />
      <option value="Sanskrit" />
      <option value="Konkani" />
    </datalist>

    {/* Validation message */}
    {formData.languages.length > 100 && (
      <p className="text-red-600 text-xs mt-1">
        Maximum 100 characters allowed
      </p>
    )}
    {renderFieldError("languages")}
  </div>
</div>


                  {/* Upload Summary */}
                  {(profileImage || documents.length > 0) && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-blue-800 mb-2">
                        📁 Upload Summary
                      </h4>
                      <div className="space-y-1 text-sm text-blue-700">
                        {profileImage && (
                          <p>✓ Profile Image: {profileImage.name} ({(profileImage.size / (1024 * 1024)).toFixed(2)} MB)</p>
                        )}
                        {documents.length > 0 && (
                          <p>✓ Documents: {documents.length} file(s) ready for upload</p>
                        )}
                        <p className="text-xs text-blue-600 mt-2">
                          All files will be securely stored on Cloudinary CDN
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

               {/* ==================== PARTNER PREFERENCES ==================== */}
              <div>
  <h3 className="text-lg font-medium text-gray-900">Partner Preferences</h3>
  <div className="mt-4 space-y-6">

    {/* AGE RANGE VALIDATION */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Age Range <span className="text-red-600">*</span>
        </label>
        <div className="space-y-2">
          <input
            type="number"
            name="partnerPreferences.ageRange.min"
            value={formData.partnerPreferences.ageRange.min}
            onChange={(e) => {
              const value = Number(e.target.value);
              if (value >= 18 && value <= 80) handleInputChange(e);
            }}
            onBlur={() => handleFieldBlur("partnerPreferences.ageRange.min")}
            placeholder="Min Age"
            min={18}
            max={80}
            className={getInputClassName("partnerPreferences.ageRange.min")}
          />
          {formData.partnerPreferences.ageRange.min < 18 && (
            <p className="text-red-600 text-xs mt-1">
              Minimum age must be 18 or above.
            </p>
          )}
          {renderFieldError("partnerPreferences.ageRange.min")}

          <input
            type="number"
            name="partnerPreferences.ageRange.max"
            value={formData.partnerPreferences.ageRange.max}
            onChange={(e) => {
              const value = Number(e.target.value);
              if (value >= 18 && value <= 80) handleInputChange(e);
            }}
            onBlur={() => handleFieldBlur("partnerPreferences.ageRange.max")}
            placeholder="Max Age"
            min={18}
            max={80}
            className={getInputClassName("partnerPreferences.ageRange.max")}
          />
          {formData.partnerPreferences.ageRange.max <
            formData.partnerPreferences.ageRange.min && (
            <p className="text-red-600 text-xs mt-1">
              Max age must be greater than min age.
            </p>
          )}
          {renderFieldError("partnerPreferences.ageRange.max")}
        </div>
      </div>

      {/* RELIGION */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Preferred Religion (optional)
        </label>
        <input
          type="text"
          name="partnerPreferences.preferredReligion"
          value={formData.partnerPreferences.preferredReligion}
          onChange={handleInputChange}
          placeholder="e.g., Hindu, Muslim, Christian"
          list="religion-options"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <datalist id="religion-options">
          <option value="Hindu" />
          <option value="Muslim" />
          <option value="Christian" />
          <option value="Sikh" />
          <option value="Jain" />
          <option value="Buddhist" />
          <option value="Parsi" />
          <option value="Jewish" />
        </datalist>
      </div>
    </div>

    {/* CASTE & MOTHER TONGUE */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Preferred Caste (optional)
        </label>
        <input
          type="text"
          name="partnerPreferences.preferredCaste"
          value={formData.partnerPreferences.preferredCaste}
          onChange={handleInputChange}
          placeholder="e.g., Brahmin, Kshatriya"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Preferred Mother Tongue (optional)
        </label>
        <input
          type="text"
          name="partnerPreferences.preferredMotherTongue"
          value={formData.partnerPreferences.preferredMotherTongue}
          onChange={handleInputChange}
          placeholder="e.g., Hindi, Marathi, Tamil"
          list="languages-list"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <datalist id="languages-list">
          <option value="Hindi" />
          <option value="Marathi" />
          <option value="Tamil" />
          <option value="Telugu" />
          <option value="Bengali" />
          <option value="Gujarati" />
          <option value="Punjabi" />
          <option value="Kannada" />
          <option value="Malayalam" />
          <option value="Urdu" />
        </datalist>
      </div>
    </div>

    {/* EDUCATION & OCCUPATION */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Preferred Education (optional)
        </label>
        <input
          type="text"
          name="partnerPreferences.preferredEducation"
          value={formData.partnerPreferences.preferredEducation}
          onChange={handleInputChange}
          placeholder="e.g., B.Tech, MBA, PhD"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Preferred Occupation (optional)
        </label>
        <input
          type="text"
          name="partnerPreferences.preferredOccupation"
          value={formData.partnerPreferences.preferredOccupation}
          onChange={handleInputChange}
          placeholder="e.g., Engineer, Doctor, Teacher"
          list="occupation-list"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <datalist id="occupation-list">
          <option value="Engineer" />
          <option value="Doctor" />
          <option value="Teacher" />
          <option value="Lawyer" />
          <option value="Accountant" />
          <option value="Businessperson" />
          <option value="Architect" />
          <option value="Government Employee" />
        </datalist>
      </div>
    </div>

    {/* LOCATION & INCOME */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Preferred Location (optional)
        </label>
        <input
          type="text"
          name="partnerPreferences.preferredLocation"
          value={formData.partnerPreferences.preferredLocation}
          onChange={handleInputChange}
          placeholder="e.g., Mumbai, Delhi, Pune"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Income Range (optional)
        </label>
        <div className="space-y-2">
          <input
            type="text"
            name="partnerPreferences.incomeRange.min"
            value={formData.partnerPreferences.incomeRange.min}
            onChange={handleInputChange}
            placeholder="Min Income"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <input
            type="text"
            name="partnerPreferences.incomeRange.max"
            value={formData.partnerPreferences.incomeRange.max}
            onChange={handleInputChange}
            placeholder="Max Income"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
      </div>
    </div>

    {/* HEIGHT & LANGUAGE */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Preferred Height (optional)
        </label>
        <div className="space-y-2">
          <input
            type="text"
            name="partnerPreferences.preferredHeight.min"
            value={formData.partnerPreferences.preferredHeight.min}
            onChange={handleInputChange}
            placeholder="Min Height (e.g., 5'0)"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <input
            type="text"
            name="partnerPreferences.preferredHeight.max"
            value={formData.partnerPreferences.preferredHeight.max}
            onChange={handleInputChange}
            placeholder="Max Height (e.g., 6'0)"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Preferred Languages (optional)
        </label>
        <input
          type="text"
          name="partnerPreferences.preferredLanguages"
          value={formData.partnerPreferences.preferredLanguages}
          onChange={handleInputChange}
          placeholder="e.g., English, Hindi"
          list="languages-list"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>
    </div>

    {/* CULTURAL BACKGROUND */}
    <div>
      <label className="block text-sm font-medium text-gray-700">
        Cultural Background (optional)
      </label>
      <input
        type="text"
        name="partnerPreferences.culturalBackground"
        value={formData.partnerPreferences.culturalBackground}
        onChange={(e) => {
          if (e.target.value.length <= 100) handleInputChange(e);
        }}
        placeholder="e.g., North Indian, South Indian"
        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
      />
      {formData.partnerPreferences.culturalBackground.length > 100 && (
        <p className="text-red-600 text-xs mt-1">
          Maximum 100 characters allowed
        </p>
      )}
    </div>
  </div>
</div>


              {/* ==================== PRIVACY SETTINGS ==================== */}
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Privacy Settings
                </h3>
                <div className="mt-4 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="showEmail"
                        name="showEmail"
                        checked={formData.showEmail}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                      />
                      <label htmlFor="showEmail" className="ml-2 block text-sm text-gray-700">
                        Show Email (optional)
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="showMobile"
                        name="showMobile"
                        checked={formData.showMobile}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                      />
                      <label htmlFor="showMobile" className="ml-2 block text-sm text-gray-700">
                        Show Mobile (optional)
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Profile Visibility (optional)
                      </label>
                      <select
                        name="profileVisibility"
                        value={formData.profileVisibility}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="Public">Public</option>
                        <option value="Member">Members Only</option>
                        <option value="Hidden">Hidden</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Photo Visibility (optional)
                      </label>
                      <select
                        name="photoVisibility"
                        value={formData.photoVisibility}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="All">All</option>
                        <option value="Filtered">Filtered</option>
                        <option value="None">None</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

            

              {/* Submit Button */}
              <div className="flex justify-end pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting || loading}
                  className="px-6 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Submitting..." : (isSubmitting ? "Processing..." : "Register Now")}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* OTP Modal and Success Modal (keep as is) */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Verify Email</h3>
            <p className="text-sm text-gray-600 mb-4">We sent a 6-digit OTP to your email. Please enter it below.</p>
            {verifyError && (
              <p className="text-red-500 text-sm text-center mb-2">{verifyError}</p>
            )}
            <form onSubmit={handleOtpSubmit} className="space-y-4">
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="Enter 6-digit OTP"
                maxLength={6}
                disabled={verifyLoading}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50"
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
                  {verifyLoading ? "Verifying..." : "Verify OTP"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg max-w-md w-full mx-4 text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Registration Successful!</h3>
            <p className="text-sm text-green-600 mb-4">Your account has been created successfully. Redirecting to home page...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegistrationForm;