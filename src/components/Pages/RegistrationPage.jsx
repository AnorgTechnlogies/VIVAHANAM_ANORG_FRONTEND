// components/DynamicRegistrationForm.jsx
import { useState, useRef, useEffect } from "react";

const DynamicRegistrationForm = () => {
  // ==================== STATE VARIABLES ====================
  const profilePhotosInputRef = useRef(null);
  const documentsInputRef = useRef(null);
  const [documents, setDocuments] = useState([]);
  const [profilePhotos, setProfilePhotos] = useState([]);
  const [photoUrls, setPhotoUrls] = useState([]);
  const [hasError, setHasError] = useState([]);
  const [fieldErrors, setFieldErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [userVivId, setUserVivId] = useState("");
  const [formFields, setFormFields] = useState([]);
  const [sections, setSections] = useState([]);
  const [formData, setFormData] = useState({});
  const [zipLoading, setZipLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_KEY;

  // ==================== ZIP CODE AUTO-FILL FOR ALL COUNTRIES ====================
  const lookupZipCode = async (zip, country) => {
    const cleanZip = zip.trim().replace(/[^0-9a-zA-Z]/g, "");

    if (!cleanZip) return;

    try {
      setZipLoading(true);

      let apiUrl = "";

      // Determine API endpoint based on country
      switch (country) {
        case "United States":
          apiUrl = `https://api.zippopotam.us/us/${cleanZip}`;
          break;
        case "United Kingdom":
          apiUrl = `https://api.zippopotam.us/gb/${cleanZip}`;
          break;
        case "Canada":
          apiUrl = `https://api.zippopotam.us/ca/${cleanZip}`;
          break;
        case "Germany":
          apiUrl = `https://api.zippopotam.us/de/${cleanZip}`;
          break;
        case "Australia":
          apiUrl = `https://api.zippopotam.us/au/${cleanZip}`;
          break;
        case "India":
          await lookupIndianZipCode(cleanZip);
          return;
        default:
          return;
      }

      const response = await fetch(apiUrl);

      if (!response.ok) {
        return;
      }

      const data = await response.json();

      const place = data.places?.[0];

      if (place) {
        const updates = {
          country: data.country || country,
          state: place.state || place.region || "",
          city: place["place name"] || place.city || place.town || "",
        };

        setFormData((prev) => ({
          ...prev,
          ...updates,
        }));
      }
    } catch (err) {
      console.error("ZIP lookup failed:", err);
    } finally {
      setZipLoading(false);
    }
  };

  // Enhanced fallback for Indian PIN codes
  const lookupIndianZipCode = async (pin) => {
    try {
      const indianPinMap = {
        110001: { city: "New Delhi", state: "Delhi" },
        400001: { city: "Mumbai", state: "Maharashtra" },
        600001: { city: "Chennai", state: "Tamil Nadu" },
        700001: { city: "Kolkata", state: "West Bengal" },
        560001: { city: "Bangalore", state: "Karnataka" },
        500001: { city: "Hyderabad", state: "Telangana" },
        380001: { city: "Ahmedabad", state: "Gujarat" },
        411001: { city: "Pune", state: "Maharashtra" },
        302001: { city: "Jaipur", state: "Rajasthan" },
        800001: { city: "Patna", state: "Bihar" },
      };

      const location = indianPinMap[pin];
      if (location) {
        setFormData((prev) => ({
          ...prev,
          country: "India",
          state: location.state,
          city: location.city,
        }));
      }
    } catch (err) {
      console.error("Indian PIN lookup failed:", err);
    }
  };

  // ==================== AUTO SCROLL TO TOP ON PAGE LOAD ====================
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });

    // Also scroll to top if user navigates via browser back/forward buttons
    window.addEventListener("popstate", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    return () => {
      window.removeEventListener("popstate", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    };
  }, []);

  // ==================== FETCH DYNAMIC FORM CONFIG ====================
  useEffect(() => {
    const fetchFormConfig = async () => {
      try {
        const response = await fetch(`${API_URL}/admin/form-fields/active`);

        if (response.ok) {
          const data = await response.json();

          setFormFields(data.fields || []);

          // Group fields by section
          const groupedSections = data.fields.reduce((acc, field) => {
            if (!acc.find((s) => s.section === field.section)) {
              acc.push({
                section: field.section,
                sectionTitle: field.sectionTitle,
                sectionOrder: field.sectionOrder,
                fields: [],
              });
            }
            const section = acc.find((s) => s.section === field.section);
            section.fields.push(field);
            return acc;
          }, []);

          // Sort sections and fields
          const sortedSections = groupedSections
            .sort((a, b) => a.sectionOrder - b.sectionOrder)
            .map((section) => ({
              ...section,
              fields: section.fields.sort(
                (a, b) => a.fieldOrder - b.fieldOrder
              ),
            }));

          setSections(sortedSections);

          // Initialize form data with default values from API
          const initialData = {};
          data.fields.forEach((field) => {
            if (
              field.defaultValue !== undefined &&
              field.defaultValue !== null &&
              field.defaultValue !== ""
            ) {
              initialData[field.name] = field.defaultValue;
            } else {
              initialData[field.name] = "";
            }
          });
          setFormData(initialData);
        }
      } catch (error) {
        console.error("Error fetching form configuration:", error);
      }
    };

    fetchFormConfig();
  }, [API_URL]);

  // ==================== GET USER DATA ====================
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("vivahanamToken");
        if (!token) return;

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
          }

          // Prefill form with existing user data
          if (user.formData && typeof user.formData === "object") {
            setFormData((prev) => ({ ...prev, ...user.formData }));
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const token = localStorage.getItem("vivahanamToken");
    if (token) fetchUserData();
  }, [API_URL]);

  // ==================== DYNAMIC OPTIONS FROM API ====================
  const getDynamicOptions = (field) => {
    // Use options from API response
    if (
      field.options &&
      Array.isArray(field.options) &&
      field.options.length > 0
    ) {
      const activeOptions = field.options.filter(
        (opt) => opt && opt.isActive !== false && opt.label && opt.value
      );
      if (activeOptions.length > 0) {
        return activeOptions;
      }
    }

    // Return empty array if no options from API
    return [];
  };

  // ==================== VALIDATION FUNCTIONS ====================
  const validateField = (field, value, allFormData = formData) => {
    const { validation, isRequired, label } = field;

    // Required validation
    if (isRequired || validation?.required) {
      if (
        !value ||
        (Array.isArray(value) && value.length === 0) ||
        value.toString().trim() === ""
      ) {
        return validation?.message || `${label} is required`;
      }
    }

    if (!value || value.toString().trim() === "") return null;

    // Min length validation
    if (
      validation?.minLength &&
      value.toString().trim().length < validation.minLength
    ) {
      return (
        validation?.message ||
        `Minimum ${validation.minLength} characters required`
      );
    }

    // Max length validation
    if (
      validation?.maxLength &&
      value.toString().trim().length > validation.maxLength
    ) {
      return (
        validation?.message ||
        `Maximum ${validation.maxLength} characters allowed`
      );
    }

    // Pattern validation
    if (
      validation?.pattern &&
      !new RegExp(validation.pattern).test(value.toString().trim())
    ) {
      return (
        validation?.patternMessage || validation?.message || "Invalid format"
      );
    }

    return null;
  };

  const validateAllFields = () => {
    const errors = {};

    formFields.forEach((field) => {
      if (field.isActive) {
        const value = formData[field.name];
        const error = validateField(field, value, formData);
        if (error) {
          errors[field.name] = error;
        }
      }
    });

    // Validate documents
    if (documents.length === 0) {
      errors.documents = "Please upload at least one document";
    }

    // Validate profile photos
    if (profilePhotos.length === 0) {
      errors.profilePhotos = "Please upload at least one profile photo";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ==================== FILE HANDLERS ====================
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
        alert(`❌ File ${file.name} is too large. Maximum size is 100KB`);
        return false;
      }
      return true;
    });

    setDocuments((prev) => [...prev, ...validFiles]);
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
          alert(`❌ File ${file.name} is too large. Maximum size is 100KB`);
          return false;
        }
        return true;
      })
      .slice(0, 3 - currentCount);

    if (validFiles.length < files.length && currentCount < 3) {
      alert(`❌ Only ${3 - currentCount} more photos allowed.`);
    }

    const newUrls = validFiles.map((file) => URL.createObjectURL(file));
    setPhotoUrls((prev) => [...prev, ...newUrls]);
    setProfilePhotos((prev) => [...prev, ...validFiles]);
    setHasError((prev) => [
      ...prev,
      ...new Array(validFiles.length).fill(false),
    ]);

    if (profilePhotosInputRef.current) {
      profilePhotosInputRef.current.value = "";
    }
  };

  const removeProfilePhoto = (index) => {
    const urlToRevoke = photoUrls[index];
    if (urlToRevoke) URL.revokeObjectURL(urlToRevoke);

    setPhotoUrls((prev) => prev.filter((_, i) => i !== index));
    setProfilePhotos((prev) => prev.filter((_, i) => i !== index));
    setHasError((prev) => prev.filter((_, i) => i !== index));
  };

  const removeDocument = (index) => {
    setDocuments((prev) => prev.filter((_, i) => i !== index));
  };

  // ==================== FORM HANDLERS ====================
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === "checkbox" ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: fieldValue,
    }));

    // Reset location fields when country changes
    if (name === "country" && value !== formData.country) {
      setFormData((prev) => ({
        ...prev,
        state: "",
        city: "",
        zipCode: "",
      }));
    }

    // ZIP code auto-fill logic - trigger when ZIP code is entered
    if (name === "zipcode" && value.length >= 3) {
      const currentCountry = formData.country || "United States";
      lookupZipCode(value, currentCountry);
    }

    if (touchedFields[name]) {
      const field = formFields.find((f) => f.name === name);
      if (field) {
        const error = validateField(field, fieldValue, formData);
        setFieldErrors((prev) => ({
          ...prev,
          [name]: error,
        }));
      }
    }
  };

  const handleFieldBlur = (fieldName) => {
    setTouchedFields((prev) => ({ ...prev, [fieldName]: true }));

    // ZIP code auto-fill on blur as well
    if (
      fieldName === "zipcode" &&
      formData[fieldName] &&
      formData[fieldName].length >= 3
    ) {
      const currentCountry = formData.country || "United States";
      lookupZipCode(formData[fieldName], currentCountry);
    }

    const field = formFields.find((f) => f.name === fieldName);
    if (field) {
      const value = formData[fieldName];
      const error = validateField(field, value, formData);
      setFieldErrors((prev) => ({
        ...prev,
        [fieldName]: error,
      }));
    }
  };

  // ==================== ZIP CODE PLACEHOLDER HELPER ====================
  const getZipCodePlaceholder = (country) => {
    if (!country) return "Enter postal / zip code";
    switch (country) {
      case "India":
        return "e.g., 400001 (6-digit PIN)";
      case "United States":
        return "e.g., 90210 (5-digit ZIP)";
      case "United Kingdom":
        return "e.g., SW1A 1AA (Postcode)";
      case "Canada":
        return "e.g., M5V 2T6 (Postal Code)";
      case "Australia":
        return "e.g., 2000 (4-digit Postcode)";
      case "Germany":
        return "e.g., 10115 (5-digit Postleitzahl)";
      default:
        return "Enter postal / zip code";
    }
  };

  const getZipCodePattern = (country) => {
    if (!country) return null;
    switch (country) {
      case "India":
        return {
          pattern: "^[1-9][0-9]{5}$",
          message: "Enter valid 6-digit Indian PIN code",
        };
      case "United States":
        return {
          pattern: "^[0-9]{5}(-[0-9]{4})?$",
          message: "Enter valid 5-digit US ZIP code",
        };
      case "United Kingdom":
        return {
          pattern: "^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$",
          message: "Enter valid UK postcode",
        };
      case "Canada":
        return {
          pattern: "^[A-Z][0-9][A-Z] ?[0-9][A-Z][0-9]$",
          message: "Enter valid Canadian postal code",
        };
      case "Australia":
        return {
          pattern: "^[0-9]{4}$",
          message: "Enter valid 4-digit Australian postcode",
        };
      case "Germany":
        return {
          pattern: "^[0-9]{5}$",
          message: "Enter valid 5-digit German postcode",
        };
      default:
        return null;
    }
  };

  // ==================== RENDER FIELD COMPONENTS ====================
  const renderField = (field) => {
    const { name, label, type, placeholder, helpText, isRequired, validation } =
      field;
    const value = formData[name] || "";
    const error = fieldErrors[name];
    const touched = touchedFields[name];

    const inputClassName = `mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 ${
      touched && error
        ? "border-red-300 focus:border-red-500"
        : "border-gray-300 focus:border-orange-500"
    } ${zipLoading && name === "zipcode" ? "bg-gray-50" : ""}`;

    const baseProps = {
      name,
      value,
      onChange: handleInputChange,
      onBlur: () => handleFieldBlur(name),
      className: inputClassName,
      placeholder: placeholder || `Enter ${label.toLowerCase()}`,
      required: isRequired || validation?.required,
    };

    // Get dynamic options from API
    const dynamicOptions = getDynamicOptions(field);

    // Special handling for ZIP code field
    if (name === "zipcode") {
      const zipPattern = getZipCodePattern(formData.country);
      return (
        <div className="relative">
          <input
            type="text"
            {...baseProps}
            placeholder={getZipCodePlaceholder(formData.country)}
            maxLength={10}
            pattern={zipPattern?.pattern}
            title={zipPattern?.message}
          />
          {zipLoading && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500"></div>
            </div>
          )}
          <p className="text-xs text-gray-500 mt-1">
            {formData.country
              ? `Enter ${formData.country} postal code → auto-fills City & State`
              : "Enter postal code to auto-fill location"}
          </p>
          {formData.zipcode && formData.state && formData.city && (
            <p className="text-xs text-green-600 mt-1">
              ✅ Auto-filled: {formData.city}, {formData.state}
            </p>
          )}
        </div>
      );
    }

    // Special handling for country field - reset location on change
    if (name === "country") {
      return (
        <select
          {...baseProps}
          onChange={(e) => {
            handleInputChange(e);
            // Reset location fields when country changes
            setFormData((prev) => ({
              ...prev,
              state: "",
              city: "",
              zipcode: "",
            }));
          }}
        >
          <option value="">Select Country</option>
          {dynamicOptions.map((option, index) => (
            <option key={option.value || index} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    }

    switch (type) {
      case "text":
      case "email":
      case "tel":
      case "number":
        return <input type={type} {...baseProps} />;

      case "textarea":
        return <textarea rows={3} {...baseProps} />;

      case "select":
        return (
          <select {...baseProps}>
            <option value="">Select {label}</option>
            {dynamicOptions.map((option, index) => (
              <option key={option.value || index} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case "radio":
        return (
          <div className="space-y-2">
            {dynamicOptions.map((option, index) => (
              <div key={option.value || index} className="flex items-center">
                <input
                  type="radio"
                  name={name}
                  value={option.value}
                  checked={value === option.value}
                  onChange={handleInputChange}
                  onBlur={() => handleFieldBlur(name)}
                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300"
                />
                <label className="ml-2 block text-sm text-gray-700">
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        );

      case "checkbox":
        return (
          <input
            type="checkbox"
            checked={!!value}
            onChange={handleInputChange}
            onBlur={() => handleFieldBlur(name)}
            className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
          />
        );

      case "date":
        return <input type="date" {...baseProps} />;

      case "datalist":
        return (
          <>
            <input
              {...baseProps}
              list={`datalist-${name}`}
              placeholder={
                placeholder || `Type or select ${label.toLowerCase()}...`
              }
            />
            <datalist id={`datalist-${name}`}>
              {dynamicOptions.map((option, index) => (
                <option key={option.value || index} value={option.value} />
              ))}
            </datalist>
          </>
        );

      default:
        return <input type="text" {...baseProps} />;
    }
  };

  // ==================== FILE TO BASE64 CONVERSION ====================
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  // ==================== SUBMIT HANDLER ====================
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mark all fields as touched
    const touched = {};
    formFields.forEach((field) => {
      touched[field.name] = true;
    });
    touched.documents = true;
    touched.profilePhotos = true;
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
      const token = localStorage.getItem("vivahanamToken");
      if (!token) {
        throw new Error("Authentication token not found. Please log in again.");
      }

      // Convert files to base64
      const profileImageBase64 =
        profilePhotos.length > 0 ? await fileToBase64(profilePhotos[0]) : null;

      const documentsBase64 = [];
      for (const doc of documents) {
        const base64Doc = await fileToBase64(doc);
        documentsBase64.push(base64Doc);
      }

      // Clean form data - remove empty values
      const cleanedFormData = Object.fromEntries(
        Object.entries(formData).filter(
          ([_, value]) => value !== undefined && value !== null && value !== ""
        )
      );

      const submitData = {
        formData: cleanedFormData,
        profileImage: profileImageBase64,
        documents: documentsBase64,
      };

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
        throw new Error(
          data.message || `Registration failed: ${response.statusText}`
        );
      }

      setShowSuccessModal(true);
      setTimeout(() => {
        window.location.href = "/";
      }, 3000);
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  };

  // ==================== RENDER FUNCTIONS ====================
  const renderFieldError = (fieldName) => {
    if (touchedFields[fieldName] && fieldErrors[fieldName]) {
      return (
        <p className="mt-1 text-sm text-red-600">{fieldErrors[fieldName]}</p>
      );
    }
    return null;
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

  // ==================== COMPONENT RENDER ====================
  if (formFields.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading form configuration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden px-4 pt-30 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-amber-100 opacity-90"></div>
      <div className="relative z-10 flex items-center justify-center py-8">
        <div className="max-w-4xl w-full space-y-8">
          {/* Header */}
          <div className="text-center bg-red-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-3xl font-bold text-red-700">
              !! वसुधैव कुटुम्बकम् !!
            </h2>
            <h2 className="mt-2 text-3xl font-bold text-gray-900">
              Join Vivahanam - Find Your Life Partner
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Create your profile to start your Vivahanam journey
            </p>
            {userVivId && (
              <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3 inline-block">
                <p className="text-sm text-red-700">
                  <strong>VIV ID:</strong> {userVivId}
                </p>
              </div>
            )}
          </div>

          {/* Form */}
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
              {/* Required Field Note */}
              <div className="flex justify-end">
                <p className="text-xs sm:text-sm text-gray-600 text-right max-w-xs sm:max-w-none ml-auto">
                  <span>Note: </span>
                  <span className="font-semibold text-red-600">*</span>{" "}
                  <strong className="text-red-600">
                    indicates a required field
                  </strong>
                </p>
              </div>

              {/* Dynamic Sections */}
              {sections.map((section) => (
                <div key={section.section}>
                  <h3 className="text-lg font-medium text-gray-900">
                    {section.sectionTitle}
                  </h3>
                  <div className="mt-4 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {section.fields.map((field) => (
                        <div
                          key={field.name}
                          className={
                            field.type === "textarea" ? "col-span-1" : ""
                          }
                        >
                          <label className="block text-sm font-medium text-gray-700">
                            {field.label}
                            {(field.isRequired ||
                              field.validation?.required) && (
                              <span className="text-red-600 ml-1">*</span>
                            )}
                          </label>
                          {renderField(field)}
                          {field.helpText && (
                            <p className="mt-1 text-xs text-gray-500">
                              {field.helpText}
                            </p>
                          )}
                          {renderFieldError(field.name)}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}

              {/* Profile Photos Section */}
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Profile Photos
                </h3>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-900 mb-3">
                    Profile Photos <span className="text-red-600">*</span>
                    <span className="ml-2 text-xs font-normal text-gray-500">
                      (Up to 3 photos, 100KB each, JPG/PNG only)
                    </span>
                  </label>

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

                  {/* Photo Preview */}
                  {profilePhotos.length > 0 && (
                    <div className="mt-4">
                      <div className="grid grid-cols-3 gap-4">
                        {profilePhotos.map((photo, index) => (
                          <div
                            key={index}
                            className="relative group bg-white rounded-lg border-2 border-orange-200 overflow-hidden shadow-sm"
                          >
                            <div className="absolute top-2 left-2 z-10">
                              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-orange-500 text-white shadow-sm">
                                Photo {index + 1}
                              </span>
                            </div>
                            <div className="aspect-square relative">
                              <img
                                src={photoUrls[index]}
                                alt={`Profile photo ${index + 1}`}
                                className="w-full h-full object-cover rounded"
                                onError={() => {
                                  setHasError((prev) => {
                                    const newErrors = [...prev];
                                    newErrors[index] = true;
                                    return newErrors;
                                  });
                                }}
                              />
                            </div>
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center">
                              <button
                                type="button"
                                onClick={() => removeProfilePhoto(index)}
                                className="opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-200 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 shadow-lg"
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
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {renderFieldError("profilePhotos")}
                </div>
              </div>

              {/* Documents Section */}
              <div>
                <h3 className="text-lg font-medium text-gray-900">Documents</h3>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Upload Documents <span className="text-red-600">*</span>
                    <span className="ml-2 text-xs font-normal text-gray-500">
                      (Max 100KB each, PDF/DOC/DOCX only)
                    </span>
                  </label>

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
                  {renderFieldError("documents")}
                </div>
              </div>

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

      {/* Success Modal */}
      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Semi-transparent overlay - but NOT full black */}
          <div
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setShowSuccessModal(false)}
          ></div>

          {/* Modal Content - positioned in the center */}
          <div className="relative z-50 bg-white p-8 rounded-lg max-w-md w-full mx-4 text-center shadow-2xl animate-fade-in">
            <button
              onClick={() => setShowSuccessModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

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

            <div className="flex justify-center mt-4">
              <div className="w-32 h-1 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 animate-progress"
                  style={{ animationDuration: "3s" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default DynamicRegistrationForm;