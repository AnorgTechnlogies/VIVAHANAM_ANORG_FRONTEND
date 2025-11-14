import { useState, useRef, useEffect } from "react";
const RegistrationForm = () => {
  // ==================== STATE VARIABLES ====================
  const profilePhotosInputRef = useRef(null);
  const documentsInputRef = useRef(null);
  const [documents, setDocuments] = useState([]);
  const [profilePhotos, setProfilePhotos] = useState([]);
  const [photoUrls, setPhotoUrls] = useState([]); // For managing blob URLs
  const [hasError, setHasError] = useState([]); // NEW: Tracks load errors per photo index (boolean array)
  const [fieldErrors, setFieldErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [userVivId, setUserVivId] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    mobileNo: "",
    userType: "",
    diet: "",
    gender: "",
    dateOfBirth: "",
    religion: "",
    indianReligious: "",
    motherTongue: "",
    maritalStatus: "",
    height: "",
    weight: "",
    complextion: "",
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
    city: "",
    state: "",
    nativePlace: "",
    birthTime: "",
    placeOfBirth: "",
    zodiacSign: "",
    gotra: "",
    streetAddress: "",
    addressLine2: "",
    zipCode: "",
    citizenshipStatus: "",
    partnerPreferences: {
      ageRange: { min: "", max: "" },
      preferredReligion: "",
      preferredMotherTongue: "",
      preferredEducation: "",
      preferredLocation: "",
      incomeRange: { min: "", max: "" },
      preferredHeight: { min: "", max: "" },
      preferredLanguages: "",
      preferredCaste: "",
    },
    showMobile: false,
    profileVisibility: "Member",
    photoVisibility: "All",
  });
  const [showLanguageList, setShowLanguageList] = useState(false);
  const API_URL = import.meta.env.VITE_API_KEY;
  // ==================== VALIDATION RULES ====================
  const validationRules = {
    firstName: {
      required: true,
      minLength: 2,
      maxLength: 50,
      pattern: /^[A-Za-z\s]+$/,
      message: "First name must be 2-50 letters only",
    },
    lastName: {
      required: true,
      minLength: 1,
      maxLength: 50,
      pattern: /^[A-Za-z\s]+$/,
      message: "Last name must be 1-50 letters only",
    },
    mobileNo: {
      required: true,
      pattern: /^[0-9]{10}$/,
      message: "Enter a valid 10-digit mobile number",
    },
    userType: {
      required: true,
      message: "Please select user type",
    },
    diet: {
      required: true,
      message: "Please select diet preference",
    },
    gender: {
      required: true,
      message: "Please select gender",
    },
    dateOfBirth: {
      required: true,
      validate: (value) => {
        if (!value) return false;
        const dob = new Date(value);
        if (isNaN(dob.getTime())) return false;
        const today = new Date();
        const eighteenYearsAgo = new Date(today);
        eighteenYearsAgo.setFullYear(today.getFullYear() - 18);
        const hundredYearsAgo = new Date(today);
        hundredYearsAgo.setFullYear(today.getFullYear() - 100);
        return dob <= eighteenYearsAgo && dob >= hundredYearsAgo;
      },
      message: "Enter a valid date of birth (age 18-100)",
    },
    religion: {
      required: true,
      minLength: 2,
      message: "Religion is required",
    },
    annualIncome: {
      required: true,
      pattern: /^[0-9]{6,}$/,
      message: "Annual income is required, minimum ₹100,000",
    },
    maritalStatus: {
      required: true,
      message: "Please select marital status",
    },
    city: {
      required: true,
      minLength: 2,
      message: "City is required",
    },
    state: {
      required: true,
      minLength: 2,
      message: "State is required",
    },
    educationLevel: {
      required: true,
      minLength: 2,
      message: "Education level is required",
    },
    occupation: {
      required: true,
      minLength: 2,
      message: "Occupation is required, min 2 characters",
    },
    country: {
      required: true,
      message: "Country is required",
    },
    citizenshipStatus: {
      required: true,
      message: "Please select citizenship status",
    },
    "partnerPreferences.ageRange.min": {
      required: true,
      validate: (value) => {
        const numValue = parseInt(value);
        return numValue >= 18 && numValue <= 80;
      },
      message: "Min age must be 18-80",
    },
    "partnerPreferences.ageRange.max": {
      required: true,
      validate: (value, formData) => {
        const minAge = parseInt(formData.partnerPreferences.ageRange.min) || 0;
        const maxAge = parseInt(value) || 0;
        return maxAge >= minAge && maxAge <= 80;
      },
      message: "Max age must be greater than min age and max 80",
    },
    profileBio: {
      required: true,
      maxLength: 500,
      message: "Profile bio is required, max 500 characters",
    },
    weight: {
      pattern: /^[0-9]{1,3}$/,
      message: "Enter valid weight in kg (numbers only)",
    },
    complextion: {
      pattern: /^[A-Za-z\s]+$/,
      message: "Enter valid complextion",
    },
    zipCode: {
      pattern: /^[0-9]{5,6}$/,
      message: "Enter valid zip code (5-6 digits)",
    },
    // NEW: Added validations for requested fields/sections
    indianReligious: {
      required: true,
      minLength: 2,
      message: "Indian Religious Affiliation is required, min 2 characters",
    },
    fieldOfStudy: {
      required: true,
      minLength: 2,
      message: "Field of Study is required, min 2 characters",
    },
    streetAddress: {
      required: true,
      minLength: 5,
      message: "Street address is required, min 5 characters",
    },
    physicalStatus: {
      maxLength: 250,
      message: "Physical status max 250 characters",
    },
    profileVisibility: {
      required: true,
      message: "Please select profile visibility",
    },
    photoVisibility: {
      required: true,
      message: "Please select photo visibility",
    },
    // NEW: Documents required validation
    documents: {
      required: true,
      message: "Please upload at least one document (ID Proof, Passport, etc.)",
    },
  };
  // ==================== GET USER VIV ID AND PREFILL FORM FROM /me API ====================
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("vivahanamToken");
        if (!token) return; // Wait until token exists
        const response = await fetch(`${API_URL}/user/me`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (response.ok) {
          const userData = await response.json();
          const user = userData?.user || {};
          if (user.vivId) {
            setUserVivId(user.vivId);
            console.log("✅ VIV ID fetched:", user.vivId);
          }
          // NEW: Prefill form with existing user data from signup
          setFormData((prev) => ({
            ...prev,
            firstName: user.firstName || prev.firstName,
            middleName: user.middleName || prev.middleName,
            lastName: user.lastName || prev.lastName,
            mobileNo: user.mobileNo || prev.mobileNo,
            // Add more fields if available in /me response, e.g.,
            // email: user.email || prev.email, (if email field is added to formData)
            // gender: user.gender || prev.gender,
            // dateOfBirth: user.dateOfBirth || prev.dateOfBirth,
            // etc.
          }));
          console.log("✅ Form prefilled with user data:", {
            firstName: user.firstName,
            lastName: user.lastName,
            mobileNo: user.mobileNo,
          });
        } else {
          console.error("❌ Failed to fetch user data:", response.statusText);
        }
      } catch (error) {
        console.error("❌ Error fetching user data:", error);
      }
    };
    // Run only if token exists
    const token = localStorage.getItem("vivahanamToken");
    if (token) fetchUserData();
  }, [API_URL]);
  // ==================== CLEANUP BLOB URLS ON UNMOUNT ====================
  useEffect(() => {
    return () => {
      photoUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []); // Empty dep array: runs only on unmount
  // ==================== VALIDATION FUNCTIONS ====================
  const validateField = (name, value, allFormData = formData) => {
    const rule = validationRules[name];
    if (!rule) return null;
    // UPDATED: Handle arrays for required check (e.g., documents)
    if (
      rule.required &&
      (!value ||
        (Array.isArray(value)
          ? value.length === 0
          : value.toString().trim() === ""))
    ) {
      return rule.message || "This field is required";
    }
    if (
      value &&
      rule.minLength &&
      value.toString().trim().length < rule.minLength
    ) {
      return rule.message || `Minimum ${rule.minLength} characters required`;
    }
    if (
      value &&
      rule.maxLength &&
      value.toString().trim().length > rule.maxLength
    ) {
      return rule.message || `Maximum ${rule.maxLength} characters allowed`;
    }
    if (value && rule.pattern && !rule.pattern.test(value.toString().trim())) {
      return rule.message || "Invalid format";
    }
    if (value && rule.validate) {
      const isValid = rule.validate(value, allFormData);
      if (!isValid) return rule.message || "Invalid value";
    }
    return null;
  };
  const handleDocumentChange = (e) => {
    const files = Array.from(e.target.files);
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    const maxSize = 100 * 1024; // 100KB
    const validFiles = files.filter((file) => {
      if (!allowedTypes.includes(file.type)) {
        alert(
          `❌ File ${file.name} is not supported. Allowed formats: PDF, DOC, DOCX only`
        );
        return false;
      }
      if (file.size > maxSize) {
        alert(
          `❌ File ${file.name} is too large. Maximum size is 100KB (${(
            file.size / 1024
          ).toFixed(2)}KB detected)`
        );
        return false;
      }
      return true;
    });
    setDocuments((prev) => [...prev, ...validFiles]);
    // NEW: Mark as touched when files are selected
    setTouchedFields((prev) => ({ ...prev, documents: true }));
    if (documentsInputRef.current) {
      documentsInputRef.current.value = "";
    }
  };
  const handleProfilePhotosChange = (e) => {
    const files = Array.from(e.target.files);
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    const maxSize = 100 * 1024; // 100KB
    const currentCount = profilePhotos.length;
    const validFiles = files
      .filter((file) => {
        if (!allowedTypes.includes(file.type)) {
          alert(
            `❌ File ${file.name} is not supported. Allowed formats: JPG, PNG only`
          );
          return false;
        }
        if (file.size > maxSize) {
          alert(
            `❌ File ${file.name} is too large. Maximum size is 100KB (${(
              file.size / 1024
            ).toFixed(2)}KB detected)`
          );
          return false;
        }
        return true;
      })
      .slice(0, 3 - currentCount); // Limit to remaining slots (max 3 total)
    if (validFiles.length < files.length && currentCount < 3) {
      alert(`❌ Only ${3 - currentCount} more photos allowed.`);
    }
    // UPDATED: Generate blob URLs for previews
    const newUrls = validFiles.map((file) => URL.createObjectURL(file));
    setPhotoUrls((prev) => [...prev, ...newUrls]);
    setProfilePhotos((prev) => [...prev, ...validFiles]);

    // NEW: Initialize no errors for new photos
    setHasError((prev) => [
      ...prev,
      ...new Array(validFiles.length).fill(false),
    ]);

    if (profilePhotosInputRef.current) {
      profilePhotosInputRef.current.value = "";
    }
  };
  const removeProfilePhoto = (index) => {
    // UPDATED: Revoke the blob URL to prevent memory leak
    const urlToRevoke = photoUrls[index];
    if (urlToRevoke) {
      URL.revokeObjectURL(urlToRevoke);
    }
    setPhotoUrls((prev) => prev.filter((_, i) => i !== index));
    setProfilePhotos((prev) => prev.filter((_, i) => i !== index));

    // NEW: Remove error status for this index
    setHasError((prev) => prev.filter((_, i) => i !== index));
  };
  const getFileType = (fileName) => {
    const extension = fileName.split(".").pop().toLowerCase();
    switch (extension) {
      case "pdf":
        return "PDF";
      case "doc":
        return "DOC";
      case "docx":
        return "DOCX";
      default:
        return "Document";
    }
  };
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
    Object.keys(validationRules).forEach((fieldName) => {
      let value;
      if (fieldName === "documents") {
        value = documents; // NEW: Special handling for documents array
      } else {
        value = getNestedValue(formData, fieldName);
      }
      const error = validateField(fieldName, value, formData);
      if (error) {
        errors[fieldName] = error;
      }
    });
    // Debug: Log errors for troubleshooting
    if (Object.keys(errors).length > 0) {
      console.log("Validation errors:", errors);
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };
  // ==================== UTILITY FUNCTIONS ====================
  const getNestedValue = (obj, path) => {
    return path
      .split(".")
      .reduce((o, p) => (o && o[p] !== undefined ? o[p] : ""), obj);
  };
  const setNestedValue = (obj, path, value) => {
    const keys = path.split(".");
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
  const removeDocument = (index) => {
    setDocuments((prev) => prev.filter((_, i) => i !== index));
  };
  const handleFieldBlur = (fieldName) => {
    setTouchedFields((prev) => ({ ...prev, [fieldName]: true }));
    const value = getNestedValue(formData, fieldName);
    const error = validateField(fieldName, value, formData);
    setFieldErrors((prev) => ({
      ...prev,
      [fieldName]: error,
    }));
  };
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => {
      const updateValue = type === "checkbox" ? checked : value;
      return setNestedValue(prev, name, updateValue);
    });
    if (touchedFields[name]) {
      const error = validateField(
        name,
        type === "checkbox" ? checked : value,
        formData
      );
      setFieldErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    }
  };
  // ==================== SIMPLIFIED SUBMIT HANDLER ====================
  // ==================== SIMPLIFIED SUBMIT HANDLER ====================
  // ==================== SIMPLIFIED SUBMIT HANDLER ====================
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1️⃣ Validate fields
    const allFields = Object.keys(validationRules);
    const touched = {};
    allFields.forEach((field) => (touched[field] = true));
    setTouchedFields(touched);

    if (!validateAllFields()) {
      setError("Please fix all validation errors before submitting.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setError("");
    setIsSubmitting(true);
    setLoading(true);

    try {
      // 2️⃣ Retrieve token
      const token = localStorage.getItem("vivahanamToken");
      console.log(
        "🔑 Token from localStorage:",
        token ? `Present (length: ${token.length})` : "MISSING"
      );

      if (!token) {
        throw new Error("Authentication token not found. Please log in again.");
      }

      // 3️⃣ Helper function to convert file to base64
      const fileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = (error) => reject(error);
        });
      };

      // 4️⃣ Prepare JSON payload (NOT FormData)
      const submitData = { ...formData };

      // Handle arrays
      ["hobbies", "languages"].forEach((key) => {
        const val = formData[key];
        let arrayValue = [];
        if (val && typeof val === "string") {
          arrayValue = val
            .split(",")
            .map((i) => i.trim())
            .filter((i) => i !== "");
        } else if (Array.isArray(val)) {
          arrayValue = val;
        }
        submitData[key] = arrayValue;
      });

      // Ensure partnerPreferences is an object
      submitData.partnerPreferences = formData.partnerPreferences || {};

      // 5️⃣ Convert files to base64
      if (profilePhotos?.length > 0) {
        submitData.profileImage = await fileToBase64(profilePhotos[0]);
        console.log("📸 Converted profileImage to base64");
      } else {
        throw new Error("Profile photo is required");
      }

      if (documents?.length > 0) {
        const base64Docs = await Promise.all(
          documents.map((doc) => fileToBase64(doc))
        );
        submitData.documents = base64Docs;
        console.log(`📄 Converted ${documents.length} documents to base64`);
      } else {
        throw new Error("At least one document is required");
      }

      // DEBUG: Log EVERYTHING being sent
      console.log("📦 Complete data being sent:");
      console.log("- mobileNo:", submitData.mobileNo);
      console.log("- userType:", submitData.userType);
      console.log("- gender:", submitData.gender);
      console.log("- dateOfBirth:", submitData.dateOfBirth);
      console.log("- religion:", submitData.religion);
      console.log("- maritalStatus:", submitData.maritalStatus);
      console.log("- city:", submitData.city);
      console.log("- state:", submitData.state);
      console.log("- educationLevel:", submitData.educationLevel);
      console.log("- occupation:", submitData.occupation);
      console.log("- hobbies:", submitData.hobbies);
      console.log("- languages:", submitData.languages);
      console.log("- partnerPreferences:", submitData.partnerPreferences);
      console.log(
        "- profileImage:",
        submitData.profileImage ? "present" : "MISSING"
      );
      console.log("- documents:", submitData.documents?.length || "MISSING");

      // 6️⃣ Make API call with JSON
      const response = await fetch(`${API_URL}/user/complete-registration`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("❌ Backend response:", data);
        throw new Error(
          data.message || `Registration failed: ${response.statusText}`
        );
      }

      console.log("✅ Registration successful:", data);
      setShowSuccessModal(true);

      setTimeout(() => {
        window.location.href = "/";
      }, 3000);
    } catch (err) {
      console.error("❌ Registration error:", err);
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  };
  // ==================== RENDER HELPERS ====================
  const renderFieldError = (fieldName) => {
    if (touchedFields[fieldName] && fieldErrors[fieldName]) {
      return (
        <p className="mt-1 text-sm text-red-600">{fieldErrors[fieldName]}</p>
      );
    }
    return null;
  };
  const getInputClassName = (fieldName) => {
    const baseClass =
      "mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500";
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
          <div className="text-center bg-red-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-3xl font-bold text-red-700">
              वसुधैव कुटुम्बकम्
            </h2>
            <h2 className="mt-2 text-3xl font-bold text-gray-900">
              Join Vivahanam - Find Your Life Partner
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Create your profile to start your Vivahanam journey
            </p>
            {/* Display VIV ID if available */}
            {userVivId && (
              <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3 inline-block">
                <p className="text-sm text-red-700">
                  <strong>Your VIV ID:</strong> {userVivId}
                </p>
              </div>
            )}
          </div>
          <div className="bg-white/95 backdrop-blur-sm shadow-2xl rounded-2xl p-8 space-y-6 border border-orange-100">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}
            <form
              onSubmit={handleSubmit}
              className="space-y-8"
              autoComplete="off"
            >
              <div className="flex justify-end">
                <p className="text-xs sm:text-sm text-gray-600 text-right max-w-xs sm:max-w-none ml-auto">
                  <span>Note: </span>
                  <span className="font-semibold text-red-600">*</span>{" "}
                  <strong className="text-red-600">
                    indicates a required field
                  </strong>
                </p>
              </div>
              {/* General & Basic Info */}
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
                        Middle Name
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
                        DOB Time
                      </label>
                      <input
                        type="time"
                        name="birthTime"
                        value={formData.birthTime}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                  </div>
                  {/* FIXED: Hobbies grid - closed properly */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Hobbies / Interests */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Hobbies
                      </label>
                      <input
                        type="text"
                        name="hobbies"
                        value={formData.hobbies}
                        onChange={(e) => {
                          if (e.target.value.length <= 200) {
                            handleInputChange(e);
                          }
                        }}
                        onBlur={() => handleFieldBlur("hobbies")}
                        placeholder="e.g., Reading, Travel, Music"
                        className={getInputClassName("hobbies")}
                      />
                      {/* Validation message - FIXED */}
                      {formData.hobbies.length > 200 && (
                        <p className="text-red-600 text-xs mt-1">
                          Maximum 200 characters allowed
                        </p>
                      )}
                      {renderFieldError("hobbies")}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Indian Religious Affiliation{" "}
                        <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        name="indianReligious"
                        value={formData.indianReligious}
                        onChange={handleInputChange}
                        onBlur={() => handleFieldBlur("indianReligious")}
                        required
                        className={getInputClassName("indianReligious")}
                        list="indian-religious-suggestions"
                      />
                      <datalist id="indian-religious-suggestions">
                        {/* Hinduism */}
                        <option value="BAPS Shri Swaminarayan Mandir" />
                        <option value="Hindu American Foundation (HAF)" />
                        <option value="Chinmaya Mission" />
                        <option value="ISKCON (International Society for Krishna Consciousness)" />
                        <option value="Vedanta Society" />
                        <option value="Sewa International USA" />
                        <option value="Hindu Temple Society of North America" />
                        <option value="Paramahansa Yogananda's Self-Realization Fellowship" />
                        <option value="Arya Samaj" />
                        <option value="Global Organization of People of Indian Origin (GOPIO)" />
                        <option value="Gayatri Parivar" />
                        {/* Sikhism */}
                        <option value="The Sikh Coalition" />
                        <option value="World Sikh Organization of Canada (WSO)" />
                        <option value="UNITED SIKHS" />
                        <option value="Khalsa Diwan Society" />
                        <option value="Gurdwara Sahib of San Jose" />
                        <option value="Ontario Khalsa Darbar" />
                        {/* Jainism */}
                        <option value="Federation of Jain Associations in North America (JAINA)" />
                        <option value="Young Jains of America (YJA)" />
                        {/* Catholic (Indian Christian Communities) */}
                        <option value="American Association of Physicians of Indian Origin (AAPI)" />
                        <option value="Malabar Community" />
                        <option value="Goan Catholics" />
                        {/* Gujarati Community Organizations */}
                        <option value="Patidar Samaj" />
                        <option value="Gujarati Samaj of New York" />
                        <option value="Gujarati Samaj of Dallas/Fort Worth (DFW Gujarati Samaj)" />
                        <option value="Gujarati Samaj of Metropolitan Washington D.C" />
                        <option value="Gujarati Samaj of Tampa Bay" />
                        <option value="Gujarat Samaj of Ontario" />
                        <option value="Gujarati Samaj of Montreal Inc" />
                        <option value="Vishwa Gujarati Samaj (USA/Canada)" />
                        <option value="Federation of Gujarati Associations of North America (FOGANA)" />
                      </datalist>
                      {renderFieldError("indianReligious")}
                    </div>
                  </div>
                  {/* FIXED: Religion grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        <option value="Awaiting Divorce">
                          Awaiting Divorce
                        </option>
                      </select>
                      {renderFieldError("maritalStatus")}
                    </div>
                  </div>
                  {/* FIXED: Preferred Mother Tongue - moved to partner prefs, but kept here if needed; adjust as per structure */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Preferred Mother Tongue
                      </label>
                      {/* Clickable Input to Toggle Language List */}
                      <div
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-500"
                        onClick={() => setShowLanguageList(!showLanguageList)}
                      >
                        {formData.partnerPreferences.preferredMotherTongue ? (
                          <div className="flex flex-wrap gap-1">
                            {formData.partnerPreferences.preferredMotherTongue
                              .split(", ")
                              .filter(Boolean)
                              .map((lang) => (
                                <span
                                  key={lang}
                                  className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-orange-800 bg-orange-100 rounded-full"
                                >
                                  {lang}
                                </span>
                              ))}
                          </div>
                        ) : (
                          <span className="text-gray-500">
                            Click to select languages...
                          </span>
                        )}
                      </div>
                      {/* Language Selection Box - Only show when toggled */}
                      {showLanguageList && (
                        <div className="mt-3 p-3 border border-gray-300 rounded-lg bg-white">
                          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                            {[
                              "Hindi",
                              "Marathi",
                              "Tamil",
                              "Telugu",
                              "Bengali",
                              "Gujarati",
                              "Punjabi",
                              "Kannada",
                              "Malayalam",
                              "Urdu",
                              "Odia",
                              "Assamese",
                              "Kashmiri",
                              "Sindhi",
                              "Nepali",
                              "Konkani",
                              "Maithili",
                              "Santhali",
                              "Bodo",
                              "Manipuri",
                              "Dogri",
                              "English",
                              "Sanskrit",
                              "French",
                              "Spanish",
                              "German",
                              "Arabic",
                              "Other",
                            ].map((lang) => {
                              const isSelected =
                                formData.partnerPreferences.preferredMotherTongue
                                  .split(", ")
                                  .includes(lang);
                              return (
                                <button
                                  key={lang}
                                  type="button"
                                  onClick={() => {
                                    const current =
                                      formData.partnerPreferences.preferredMotherTongue
                                        .split(", ")
                                        .filter(Boolean);
                                    const updated = isSelected
                                      ? current.filter((l) => l !== lang) // Remove
                                      : [...current, lang]; // Add
                                    handleInputChange({
                                      target: {
                                        name: "partnerPreferences.preferredMotherTongue",
                                        value: updated.join(", "),
                                      },
                                    });
                                  }}
                                  className={`px-4 py-2 text-sm font-medium rounded-lg border transition-all ${
                                    isSelected
                                      ? "bg-orange-500 text-white border-orange-500 shadow-sm"
                                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                                  }`}
                                >
                                  {lang} {isSelected && "✓"}
                                </button>
                              );
                            })}
                          </div>
                          {/* Optional: Add Custom Language */}
                          <div className="mt-4 flex gap-2">
                            <input
                              type="text"
                              placeholder="Add custom language..."
                              className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                              onKeyDown={(e) => {
                                if (
                                  e.key === "Enter" &&
                                  e.target.value.trim()
                                ) {
                                  const custom = e.target.value.trim();
                                  const current =
                                    formData.partnerPreferences.preferredMotherTongue
                                      .split(", ")
                                      .filter(Boolean);
                                  if (!current.includes(custom)) {
                                    handleInputChange({
                                      target: {
                                        name: "partnerPreferences.preferredMotherTongue",
                                        value: [...current, custom].join(", "),
                                      },
                                    });
                                  }
                                  e.target.value = "";
                                }
                              }}
                            />
                            <span className="text-xs text-gray-500 self-center">
                              Press Enter
                            </span>
                          </div>
                          {/* Close Button */}
                          <div className="mt-3 flex justify-end">
                            <button
                              type="button"
                              onClick={() => setShowLanguageList(false)}
                              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                            >
                              Close
                            </button>
                          </div>
                        </div>
                      )}
                      {/* Selected Chips Preview - Always visible */}
                      {formData.partnerPreferences.preferredMotherTongue && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {formData.partnerPreferences.preferredMotherTongue
                            .split(", ")
                            .filter(Boolean)
                            .map((lang) => (
                              <span
                                key={lang}
                                className="inline-flex items-center gap-1 px-3 py-1 text-sm font-medium text-orange-800 bg-orange-100 rounded-full"
                              >
                                {lang}
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated =
                                      formData.partnerPreferences.preferredMotherTongue
                                        .split(", ")
                                        .filter((l) => l !== lang)
                                        .join(", ");
                                    handleInputChange({
                                      target: {
                                        name: "partnerPreferences.preferredMotherTongue",
                                        value: updated,
                                      },
                                    });
                                  }}
                                  className="ml-1 text-orange-600 hover:text-orange-800"
                                >
                                  ×
                                </button>
                              </span>
                            ))}
                        </div>
                      )}
                    </div>
                  </div>
                  {/* FIXED: Weight and Complextion grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Weight
                      </label>
                      <input
                        type="text"
                        name="weight"
                        value={formData.weight}
                        onChange={(e) => {
                          // FIXED: Allow only numbers
                          const numericValue = e.target.value.replace(
                            /[^0-9]/g,
                            ""
                          );
                          if (numericValue.length <= 3) {
                            handleInputChange({
                              target: { name: "weight", value: numericValue },
                            });
                          }
                        }}
                        onBlur={() => handleFieldBlur("weight")}
                        placeholder="e.g., 70"
                        className={getInputClassName("weight")}
                      />
                      {renderFieldError("weight")}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Complextion
                      </label>
                      <input
                        type="text"
                        name="complextion"
                        value={formData.complextion}
                        onChange={handleInputChange}
                        onBlur={() => handleFieldBlur("complextion")}
                        placeholder="e.g., Fair, Medium, Dark"
                        className={getInputClassName("complextion")}
                      />
                      {renderFieldError("complextion")}
                    </div>
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
                        Caste
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
                        Place of Birth
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
                        Zodiac Sign
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
                        Gotra
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
                          // Reset state if country changes
                          if (e.target.value !== "India") {
                            handleInputChange({
                              target: { name: "state", value: "" },
                            });
                          }
                        }}
                        className={getInputClassName("country")}
                        required
                      >
                        <option value="">Select Country</option>
                        <option value="United States">United States</option>
                        <option value="Other">Other</option>
                      </select>
                      {renderFieldError("country")}
                    </div>
                    {/* ===== State Field ===== */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        State <span className="text-red-600">*</span>
                      </label>
                      {formData.country === "United States" ? (
                        <select
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          onBlur={() => handleFieldBlur("state")}
                          required
                          className={getInputClassName("state")}
                        >
                          <option value="">Select State</option>
                          <option value="Alabama">Alabama</option>
                          <option value="Alaska">Alaska</option>
                          <option value="Arizona">Arizona</option>
                          <option value="Arkansas">Arkansas</option>
                          <option value="California">California</option>
                          <option value="Colorado">Colorado</option>
                          <option value="Connecticut">Connecticut</option>
                          <option value="Delaware">Delaware</option>
                          <option value="Florida">Florida</option>
                          <option value="Georgia">Georgia</option>
                          <option value="Hawaii">Hawaii</option>
                          <option value="Idaho">Idaho</option>
                          <option value="Illinois">Illinois</option>
                          <option value="Indiana">Indiana</option>
                          <option value="Iowa">Iowa</option>
                          <option value="Kansas">Kansas</option>
                          <option value="Kentucky">Kentucky</option>
                          <option value="Louisiana">Louisiana</option>
                          <option value="Maine">Maine</option>
                          <option value="Maryland">Maryland</option>
                          <option value="Massachusetts">Massachusetts</option>
                          <option value="Michigan">Michigan</option>
                          <option value="Minnesota">Minnesota</option>
                          <option value="Mississippi">Mississippi</option>
                          <option value="Missouri">Missouri</option>
                          <option value="Montana">Montana</option>
                          <option value="Nebraska">Nebraska</option>
                          <option value="Nevada">Nevada</option>
                          <option value="New Hampshire">New Hampshire</option>
                          <option value="New Jersey">New Jersey</option>
                          <option value="New Mexico">New Mexico</option>
                          <option value="New York">New York</option>
                          <option value="North Carolina">North Carolina</option>
                          <option value="North Dakota">North Dakota</option>
                          <option value="Ohio">Ohio</option>
                          <option value="Oklahoma">Oklahoma</option>
                          <option value="Oregon">Oregon</option>
                          <option value="Pennsylvania">Pennsylvania</option>
                          <option value="Rhode Island">Rhode Island</option>
                          <option value="South Carolina">South Carolina</option>
                          <option value="South Dakota">South Dakota</option>
                          <option value="Tennessee">Tennessee</option>
                          <option value="Texas">Texas</option>
                          <option value="Utah">Utah</option>
                          <option value="Vermont">Vermont</option>
                          <option value="Virginia">Virginia</option>
                          <option value="Washington">Washington</option>
                          <option value="West Virginia">West Virginia</option>
                          <option value="Wisconsin">Wisconsin</option>
                          <option value="Wyoming">Wyoming</option>
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
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        onBlur={() => handleFieldBlur("city")}
                        required
                        placeholder="Enter your city"
                        className={getInputClassName("city")}
                      />
                      {renderFieldError("city")}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Native Place in India
                    </label>
                    <input
                      type="text"
                      name="nativePlace"
                      value={formData.nativePlace}
                      onChange={handleInputChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
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
                        <option value="Associate Degree">
                          Arts, Media, and Communication
                        </option>
                        <option value="Bachelor's Degree">
                          Law and Public Administration
                        </option>
                        <option value="Bachelor's Degree">
                          Science and Research
                        </option>
                        <option value="Bachelor's Degree">
                          Information Technology and Computing
                        </option>
                        <option value="Bachelor's Degree">
                          Hospitality and Tourism
                        </option>
                        <option value="Diploma">
                          Trades and Applied Professions
                        </option>
                        <option value="Master's Degree">Master's Degree</option>
                        <option value="Doctorate (PhD)">Doctorate (PhD)</option>
                        <option value="Professional Degree">
                          Professional Degree
                        </option>
                        <option value="Other">Other</option>
                      </select>
                      {renderFieldError("educationLevel")}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Field of Study <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        name="fieldOfStudy"
                        value={formData.fieldOfStudy}
                        onChange={handleInputChange}
                        onBlur={() => handleFieldBlur("fieldOfStudy")}
                        list={`field-of-study-${formData.educationLevel.replace(
                          /\s+/g,
                          "-"
                        )}`}
                        placeholder="Type or select..."
                        className={getInputClassName("fieldOfStudy")}
                        required
                      />
                      {renderFieldError("fieldOfStudy")}
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
                        className={getInputClassName("occupation")}
                        required
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
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Annual Income <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        name="annualIncome"
                        value={formData.annualIncome}
                        onChange={(e) => {
                          // FIXED: Remove commas for validation
                          const cleanValue = e.target.value.replace(/,/g, "");
                          handleInputChange({
                            target: { name: "annualIncome", value: cleanValue },
                          });
                        }}
                        onBlur={() => handleFieldBlur("annualIncome")}
                        placeholder="e.g., 500000 (minimum ₹100000)"
                        className={getInputClassName("annualIncome")}
                        required
                      />
                      {renderFieldError("annualIncome")}
                      <p className="text-xs text-gray-500 mt-1">
                        Minimum acceptable income: ₹100,000 (no commas)
                      </p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Physical Status / Health Check
                    </label>
                    <textarea
                      name="physicalStatus"
                      rows={2}
                      maxLength={250} // limit to 250 characters
                      value={formData.physicalStatus}
                      onChange={handleInputChange}
                      onBlur={() => handleFieldBlur("physicalStatus")}
                      placeholder="e.g., Good health, no medical conditions..."
                      className={
                        getInputClassName("physicalStatus") + " resize-none"
                      }
                    />
                    {/* Character counter below field */}
                    <div className="text-xs text-gray-500 text-right mt-1">
                      {250 - (formData.physicalStatus?.length || 0)} characters
                      remaining
                    </div>
                    {renderFieldError("physicalStatus")}
                  </div>
                </div>
              </div>
              {/* ==================== ADDRESS DETAILS ==================== */}
              <div>
                <h3 className="text-lg font-medium text-gray-900">Address</h3>
                <div className="mt-4 space-y-6">
                  {/* Street Address */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Street Address <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      name="streetAddress"
                      value={formData.streetAddress}
                      onChange={handleInputChange}
                      onBlur={() => handleFieldBlur("streetAddress")}
                      required
                      className={getInputClassName("streetAddress")}
                    />
                    {renderFieldError("streetAddress")}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Address Line 2 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Address Line 2
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
                        list={`city-suggestions-${formData.country.replace(
                          /\s+/g,
                          "-"
                        )}`}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* State with country-dependent suggestions */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        State
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        list={`state-suggestions-${formData.country.replace(
                          /\s+/g,
                          "-"
                        )}`}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                    {/* Postal Code with format validation */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Postal / Zip Code
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
                        <label
                          htmlFor="citizen"
                          className="ml-2 block text-sm text-gray-700"
                        >
                          Citizen
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="permanentResident"
                          name="citizenshipStatus"
                          type="radio"
                          value="Permanent Resident"
                          checked={
                            formData.citizenshipStatus === "Permanent Resident"
                          }
                          onChange={handleInputChange}
                          className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                        />
                        <label
                          htmlFor="permanentResident"
                          className="ml-2 block text-sm text-gray-700"
                        >
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
                        <label
                          htmlFor="otherCitizen"
                          className="ml-2 block text-sm text-gray-700"
                        >
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
                  {/* IMPROVED: Profile Photos Upload with Better UI */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-3">
                      Profile Photos
                      <span className="ml-2 text-xs font-normal text-gray-500">
                        (Up to 3 photos, 100KB each, JPG/PNG only)
                      </span>
                    </label>
                    {/* Upload Area */}
                    <div className="relative">
                      <input
                        ref={profilePhotosInputRef}
                        type="file"
                        multiple
                        onChange={handleProfilePhotosChange}
                        accept="image/jpeg,image/png,image/jpg"
                        className="hidden"
                        id="profile-photos-input"
                        disabled={profilePhotos.length >= 3}
                      />
                      {profilePhotos.length < 3 && (
                        <label
                          htmlFor="profile-photos-input"
                          className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-orange-300 rounded-lg cursor-pointer bg-gradient-to-br from-orange-50 to-amber-50 hover:from-orange-100 hover:to-amber-100 transition-all duration-300"
                        >
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <svg
                              className="w-10 h-10 mb-3 text-orange-500"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                              />
                            </svg>
                            <p className="mb-1 text-sm text-gray-700 font-medium">
                              <span className="text-orange-600">
                                Click to upload
                              </span>{" "}
                              or drag and drop
                            </p>
                            <p className="text-xs text-gray-500">
                              {3 - profilePhotos.length}{" "}
                              {profilePhotos.length === 2 ? "slot" : "slots"}{" "}
                              remaining • Max 100KB per photo
                            </p>
                          </div>
                        </label>
                      )}
                    </div>
                    {/* Photo Grid Preview */}
                    {profilePhotos.length > 0 && (
                      <div className="mt-4">
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-sm font-medium text-gray-700">
                            Uploaded Photos ({profilePhotos.length}/3)
                          </p>
                          {profilePhotos.length >= 3 && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              ✓ All slots filled
                            </span>
                          )}
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          {profilePhotos.map((photo, index) => (
                            <div
                              key={`${photo.name}-${index}`} // UPDATED: More stable key
                              className="relative group bg-white rounded-lg border-2 border-orange-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
                            >
                              {/* Photo Badge */}
                              <div className="absolute top-2 left-2 z-10">
                                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-orange-500 text-white shadow-sm">
                                  Photo {index + 1}
                                </span>
                              </div>
                              {/* Image */}
                              <div className="aspect-square relative">
                                {hasError[index] ? (
                                  // NEW: Error placeholder
                                  <div className="absolute inset-0 bg-gray-200 flex items-center justify-center rounded">
                                    <div className="text-center p-2">
                                      <svg
                                        className="w-8 h-8 text-red-400 mx-auto mb-1"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                        />
                                      </svg>
                                      <p className="text-xs text-gray-500">
                                        Invalid image
                                      </p>
                                    </div>
                                  </div>
                                ) : (
                                  // Existing img, but without hiding on error
                                  <img
                                    src={photoUrls[index]}
                                    alt={`Profile photo ${index + 1}`}
                                    className="w-full h-full object-cover rounded"
                                    onLoad={() =>
                                      console.log(
                                        `✅ Photo ${index + 1} loaded: ${
                                          photo.name
                                        }`
                                      )
                                    }
                                    onError={(e) => {
                                      // UPDATED: Don't hide img—set error state instead
                                      console.error(
                                        `❌ Failed to load photo ${
                                          index + 1
                                        }: ${photo.name} (type: ${
                                          photo.type
                                        }, size: ${photo.size})`
                                      );
                                      setHasError((prev) => {
                                        const newErrors = [...prev];
                                        newErrors[index] = true;
                                        return newErrors;
                                      });
                                    }}
                                  />
                                )}
                              </div>
                              {/* Overlay on Hover */}
                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center">
                                <button
                                  type="button"
                                  onClick={() => removeProfilePhoto(index)}
                                  className="opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-200 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 shadow-lg"
                                  title="Remove photo"
                                >
                                  <svg
                                    className="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    />
                                  </svg>
                                </button>
                              </div>
                              {/* File Info */}
                              <div className="px-2 py-1.5 bg-gradient-to-r from-orange-50 to-amber-50 border-t border-orange-200">
                                <p className="text-xs text-gray-600 truncate font-medium">
                                  {photo.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {(photo.size / 1024).toFixed(1)} KB
                                </p>
                              </div>
                            </div>
                          ))}
                          {/* Empty Slots */}
                          {[...Array(3 - profilePhotos.length)].map(
                            (_, index) => (
                              <div
                                key={`empty-${index}`}
                                className="aspect-square rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center"
                              >
                                <svg
                                  className="w-8 h-8 text-gray-400 mb-2"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                  />
                                </svg>
                                <p className="text-xs text-gray-400 font-medium">
                                  Empty Slot
                                </p>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}
                    {/* Info Box */}
                    <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-3">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg
                            className="h-5 w-5 text-amber-600"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div className="ml-3 flex-1">
                          <p className="text-xs text-amber-800 leading-relaxed">
                            <strong>Tips:</strong> Use clear, well-lit photos.
                            Square format (500×500px) works best. First photo
                            will be your main profile picture.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Profile Bio - FIXED message in rules */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Profile Bio <span className="text-red-600">*</span> (max
                      500 chars)
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
                      <div>{renderFieldError("profileBio")}</div>
                      <p className="text-xs text-gray-500">
                        {formData.profileBio.length}/500 characters
                      </p>
                    </div>
                  </div>
                  {/* FIXED: Documents Upload */}
                  <div>
                    <h4 className="text-md font-medium text-gray-900">
                      Upload Documents <span className="text-red-600">*</span>
                      <span className="text-xs text-gray-500 ml-2">
                        Any ID Proof etc. (Max 100KB each, PDF/DOC/DOCX only)
                      </span>
                    </h4>
                    <div className="mt-4 space-y-3">
                      <input
                        ref={documentsInputRef}
                        type="file"
                        multiple
                        onChange={handleDocumentChange}
                        accept=".pdf,.doc,.docx"
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
                                    {(doc.size / 1024).toFixed(2)} KB •{" "}
                                    {getFileType(doc.name)}
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
                      {/* NEW: Render error for documents */}
                      {renderFieldError("documents")}
                    </div>
                  </div>
                  {/* Upload Summary */}
                  {(profilePhotos.length > 0 || documents.length > 0) && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-blue-800 mb-2">
                        📁 Upload Summary
                      </h4>
                      <div className="space-y-1 text-sm text-blue-700">
                        {profilePhotos.length > 0 && (
                          <p>
                            ✓ Profile Photos: {profilePhotos.length} file(s)
                            ready for upload
                          </p>
                        )}
                        {documents.length > 0 && (
                          <p>
                            ✓ Documents: {documents.length} file(s) ready for
                            upload
                          </p>
                        )}
                        <p className="text-xs text-blue-600 mt-2">
                          All files will be securely stored.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {/* ==================== PARTNER PREFERENCES ==================== */}
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Partner Preferences
                </h3>
                <div className="mt-4 space-y-6">
                  {/* AGE RANGE VALIDATION */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Age Range <span className="text-red-600">*</span>
                      </label>
                      <select
                        name="partnerPreferences.ageRange"
                        value={`${
                          formData.partnerPreferences.ageRange.min || ""
                        }-${formData.partnerPreferences.ageRange.max || ""}`}
                        onChange={(e) => {
                          const [min, max] = e.target.value
                            .split("-")
                            .map(Number);
                          if (!isNaN(min) && !isNaN(max)) {
                            setFormData((prev) => ({
                              ...prev,
                              partnerPreferences: {
                                ...prev.partnerPreferences,
                                ageRange: {
                                  min: min.toString(),
                                  max: max.toString(),
                                },
                              },
                            }));
                          }
                        }}
                        onBlur={() =>
                          handleFieldBlur("partnerPreferences.ageRange.min") ||
                          handleFieldBlur("partnerPreferences.ageRange.max")
                        }
                        className={getInputClassName(
                          "partnerPreferences.ageRange"
                        )}
                        required
                      >
                        <option value="">Select Age Range</option>
                        <option value="18-25">18 - 25 years</option>
                        <option value="18-30">18 - 30 years</option>
                        <option value="20-30">20 - 30 years</option>
                        <option value="20-35">20 - 35 years</option>
                        <option value="25-35">25 - 35 years</option>
                        <option value="25-40">25 - 40 years</option>
                        <option value="30-40">30 - 40 years</option>
                        <option value="30-45">30 - 45 years</option>
                        <option value="35-45">35 - 45 years</option>
                        <option value="35-50">35 - 50 years</option>
                        <option value="40-50">40 - 50 years</option>
                        <option value="40-55">40 - 55 years</option>
                        <option value="45-55">45 - 55 years</option>
                        <option value="45-60">45 - 60 years</option>
                        <option value="50-60">50 - 60 years</option>
                        <option value="50-65">50 - 65 years</option>
                        <option value="55-65">55 - 65 years</option>
                        <option value="55-70">55 - 70 years</option>
                        <option value="60-70">60 - 70 years</option>
                        <option value="60-75">60 - 75 years</option>
                        <option value="65-75">65 - 75 years</option>
                        <option value="65-80">65 - 80 years</option>
                        <option value="70-80">70 - 80 years</option>
                      </select>
                      {renderFieldError("partnerPreferences.ageRange.min")}
                      {renderFieldError("partnerPreferences.ageRange.max")}
                      {/* Display selected range */}
                      {formData.partnerPreferences.ageRange.min &&
                        formData.partnerPreferences.ageRange.max && (
                          <p className="text-sm text-gray-600 mt-2">
                            Selected: {formData.partnerPreferences.ageRange.min}{" "}
                            - {formData.partnerPreferences.ageRange.max} years
                          </p>
                        )}
                    </div>
                    {/* RELIGION */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Preferred Religion
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
                        Preferred Caste
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
                        Preferred Mother Tongue
                      </label>
                      {/* Clickable Input to Toggle Language List - FIXED duplicate, kept one */}
                      <div
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-500"
                        onClick={() => setShowLanguageList(!showLanguageList)}
                      >
                        {formData.partnerPreferences.preferredMotherTongue ? (
                          <div className="flex flex-wrap gap-1">
                            {formData.partnerPreferences.preferredMotherTongue
                              .split(", ")
                              .filter(Boolean)
                              .map((lang) => (
                                <span
                                  key={lang}
                                  className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-orange-800 bg-orange-100 rounded-full"
                                >
                                  {lang}
                                </span>
                              ))}
                          </div>
                        ) : (
                          <span className="text-gray-500">
                            Click to select languages...
                          </span>
                        )}
                      </div>
                      {/* Language Selection Box - Only show when toggled */}
                      {showLanguageList && (
                        <div className="mt-3 p-3 border border-gray-300 rounded-lg bg-white">
                          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                            {[
                              "Hindi",
                              "Marathi",
                              "Tamil",
                              "Telugu",
                              "Bengali",
                              "Gujarati",
                              "Punjabi",
                              "Kannada",
                              "Malayalam",
                              "Urdu",
                              "Odia",
                              "Assamese",
                              "Kashmiri",
                              "Sindhi",
                              "Nepali",
                              "Konkani",
                              "Maithili",
                              "Santhali",
                              "Bodo",
                              "Manipuri",
                              "Dogri",
                              "English",
                              "Sanskrit",
                              "French",
                              "Spanish",
                              "German",
                              "Arabic",
                              "Other",
                            ].map((lang) => {
                              const isSelected =
                                formData.partnerPreferences.preferredMotherTongue
                                  .split(", ")
                                  .includes(lang);
                              return (
                                <button
                                  key={lang}
                                  type="button"
                                  onClick={() => {
                                    const current =
                                      formData.partnerPreferences.preferredMotherTongue
                                        .split(", ")
                                        .filter(Boolean);
                                    const updated = isSelected
                                      ? current.filter((l) => l !== lang) // Remove
                                      : [...current, lang]; // Add
                                    handleInputChange({
                                      target: {
                                        name: "partnerPreferences.preferredMotherTongue",
                                        value: updated.join(", "),
                                      },
                                    });
                                  }}
                                  className={`px-4 py-2 text-sm font-medium rounded-lg border transition-all ${
                                    isSelected
                                      ? "bg-orange-500 text-white border-orange-500 shadow-sm"
                                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                                  }`}
                                >
                                  {lang} {isSelected && "✓"}
                                </button>
                              );
                            })}
                          </div>
                          {/* Optional: Add Custom Language */}
                          <div className="mt-4 flex gap-2">
                            <input
                              type="text"
                              placeholder="Add custom language..."
                              className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                              onKeyDown={(e) => {
                                if (
                                  e.key === "Enter" &&
                                  e.target.value.trim()
                                ) {
                                  const custom = e.target.value.trim();
                                  const current =
                                    formData.partnerPreferences.preferredMotherTongue
                                      .split(", ")
                                      .filter(Boolean);
                                  if (!current.includes(custom)) {
                                    handleInputChange({
                                      target: {
                                        name: "partnerPreferences.preferredMotherTongue",
                                        value: [...current, custom].join(", "),
                                      },
                                    });
                                  }
                                  e.target.value = "";
                                }
                              }}
                            />
                            <span className="text-xs text-gray-500 self-center">
                              Press Enter
                            </span>
                          </div>
                          {/* Close Button */}
                          <div className="mt-3 flex justify-end">
                            <button
                              type="button"
                              onClick={() => setShowLanguageList(false)}
                              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                            >
                              Close
                            </button>
                          </div>
                        </div>
                      )}
                      {/* Selected Chips Preview - Always visible */}
                      {formData.partnerPreferences.preferredMotherTongue && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {formData.partnerPreferences.preferredMotherTongue
                            .split(", ")
                            .filter(Boolean)
                            .map((lang) => (
                              <span
                                key={lang}
                                className="inline-flex items-center gap-1 px-3 py-1 text-sm font-medium text-orange-800 bg-orange-100 rounded-full"
                              >
                                {lang}
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated =
                                      formData.partnerPreferences.preferredMotherTongue
                                        .split(", ")
                                        .filter((l) => l !== lang)
                                        .join(", ");
                                    handleInputChange({
                                      target: {
                                        name: "partnerPreferences.preferredMotherTongue",
                                        value: updated,
                                      },
                                    });
                                  }}
                                  className="ml-1 text-orange-600 hover:text-orange-800"
                                >
                                  ×
                                </button>
                              </span>
                            ))}
                        </div>
                      )}
                      <p className="mt-1 text-xs text-gray-500">
                        Click the box above to show/hide language options
                      </p>
                    </div>
                  </div>
                  {/* EDUCATION & OCCUPATION */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Preferred Education
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
                  </div>
                  {/* LOCATION & INCOME */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Preferred Location
                      </label>
                      <input
                        type="text"
                        name="partnerPreferences.preferredLocation"
                        value={formData.partnerPreferences.preferredLocation}
                        onChange={handleInputChange}
                        placeholder=""
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                  </div>
                  {/* HEIGHT & LANGUAGE */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Preferred Height
                      </label>
                      <select
                        name="partnerPreferences.preferredHeight"
                        value={`${
                          formData.partnerPreferences.preferredHeight.min || ""
                        }-${
                          formData.partnerPreferences.preferredHeight.max || ""
                        }`}
                        onChange={(e) => {
                          const [min, max] = e.target.value.split("-");
                          setFormData((prev) => ({
                            ...prev,
                            partnerPreferences: {
                              ...prev.partnerPreferences,
                              preferredHeight: {
                                min: min || "",
                                max: max || "",
                              },
                            },
                          }));
                        }}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="">Select Height Range</option>
                        <option value="4'0&quot;-5'0&quot;">
                          4'0" - 5'0" (122-152 cm)
                        </option>
                        <option value="4'0&quot;-5'5&quot;">
                          4'0" - 5'5" (122-165 cm)
                        </option>
                        <option value="4'5&quot;-5'5&quot;">
                          4'5" - 5'5" (135-165 cm)
                        </option>
                        <option value="4'5&quot;-6'0&quot;">
                          4'5" - 6'0" (135-183 cm)
                        </option>
                        <option value="5'0&quot;-5'5&quot;">
                          5'0" - 5'5" (152-165 cm)
                        </option>
                        <option value="5'0&quot;-6'0&quot;">
                          5'0" - 6'0" (152-183 cm)
                        </option>
                        <option value="5'0&quot;-6'5&quot;">
                          5'0" - 6'5" (152-196 cm)
                        </option>
                        <option value="5'5&quot;-6'0&quot;">
                          5'5" - 6'0" (165-183 cm)
                        </option>
                        <option value="5'5&quot;-6'5&quot;">
                          5'5" - 6'5" (165-196 cm)
                        </option>
                        <option value="5'5&quot;-7'0&quot;">
                          5'5" - 7'0" (165-213 cm)
                        </option>
                        <option value="6'0&quot;-6'5&quot;">
                          6'0" - 6'5" (183-196 cm)
                        </option>
                        <option value="6'0&quot;-7'0&quot;">
                          6'0" - 7'0" (183-213 cm)
                        </option>
                        <option value="6'5&quot;-7'0&quot;">
                          6'5" - 7'0" (196-213 cm)
                        </option>
                        <option value="6'5&quot;-7'5&quot;">
                          6'5" - 7'5" (196-226 cm)
                        </option>
                        <option value="7'0&quot;-8'0&quot;">
                          7'0" - 8'0" (213-244 cm)
                        </option>
                        <option value="Any Height">Any Height</option>
                      </select>
                      {/* Display selected range */}
                      {formData.partnerPreferences.preferredHeight.min &&
                        formData.partnerPreferences.preferredHeight.max && (
                          <p className="text-sm text-gray-600 mt-2">
                            Selected:{" "}
                            {formData.partnerPreferences.preferredHeight.min} -{" "}
                            {formData.partnerPreferences.preferredHeight.max}
                          </p>
                        )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Preferred Languages
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
                        id="showMobile"
                        name="showMobile"
                        checked={formData.showMobile}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor="showMobile"
                        className="ml-2 block text-sm text-gray-700"
                      >
                        Show Mobile
                      </label>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Profile Visibility{" "}
                        <span className="text-red-600">*</span>
                      </label>
                      <select
                        name="profileVisibility"
                        value={formData.profileVisibility}
                        onChange={handleInputChange}
                        onBlur={() => handleFieldBlur("profileVisibility")}
                        required
                        className={getInputClassName("profileVisibility")}
                      >
                        <option value="">Select Visibility</option>
                        <option value="Public">Public</option>
                        <option value="Member">Members Only</option>
                        <option value="Hidden">Hidden</option>
                      </select>
                      {renderFieldError("profileVisibility")}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Photo Visibility <span className="text-red-600">*</span>
                      </label>
                      <select
                        name="photoVisibility"
                        value={formData.photoVisibility}
                        onChange={handleInputChange}
                        onBlur={() => handleFieldBlur("photoVisibility")}
                        required
                        className={getInputClassName("photoVisibility")}
                      >
                        <option value="">Select Visibility</option>
                        <option value="All">All</option>
                        <option value="Filtered">Filtered</option>
                        <option value="None">None</option>
                      </select>
                      {renderFieldError("photoVisibility")}
                    </div>
                  </div>
                </div>
              </div>
              {/* Prompt explaining * */}
              <p className="text-sm text-gray-600 mt-1">
                <span>Note : </span>{" "}
                <span className="font-semibold text-red-600">*</span>{" "}
                <strong className="text-red-600">
                  {" "}
                  indicates a required field
                </strong>
              </p>
              {/* Submit Button */}
              <div className="flex justify-end pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting || loading}
                  className="px-6 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading
                    ? "Submitting..."
                    : isSubmitting
                    ? "Processing..."
                    : "Register Now"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* SUCCESS MODAL */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg max-w-md w-full mx-4 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-600"
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
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Registration Successful!
            </h3>
            <p className="text-sm text-green-600 mb-4">
              Your profile has been created successfully.
              {userVivId && ` Your VIV ID: ${userVivId}`}
            </p>
            <p className="text-sm text-gray-600 mb-4">
              Redirecting to dashboard...
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
export default RegistrationForm;
