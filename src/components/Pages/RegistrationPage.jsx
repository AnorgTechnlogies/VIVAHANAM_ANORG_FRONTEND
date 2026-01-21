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
  const [selectedCheckboxCount, setSelectedCheckboxCount] = useState({});

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
    window.scrollTo({ top: 0, behavior: "smooth" });
    
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
        const response = await fetch(`${API_URL}/admin/form-fields/active?_=${Date.now()}`, {
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });

        if (response.ok) {
          const data = await response.json();
          
          // Initialize selected checkbox counts
          const counts = {};
          data.fields?.forEach(field => {
            if (field.type === 'checkbox' && field.isMultiple) {
              counts[field.name] = 0;
            }
          });
          setSelectedCheckboxCount(counts);

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
    
    const intervalId = setInterval(fetchFormConfig, 5 * 60 * 1000);
    
    return () => clearInterval(intervalId);
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
            
            // Calculate initial checkbox counts
            const counts = {};
            formFields.forEach(field => {
              if (field.type === 'checkbox' && field.isMultiple && user.formData[field.name]) {
                const values = user.formData[field.name];
                const valueArray = Array.isArray(values) 
                  ? values 
                  : (typeof values === 'string' && values.includes(',')) 
                    ? values.split(',').map(v => v.trim()).filter(v => v !== '')
                    : values ? [values.toString()] : [];
                counts[field.name] = valueArray.length;
              }
            });
            setSelectedCheckboxCount(prev => ({...prev, ...counts}));
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const token = localStorage.getItem("vivahanamToken");
    if (token) fetchUserData();
  }, [API_URL, formFields]);

  // ==================== DYNAMIC OPTIONS FROM API ====================
  const getDynamicOptions = (field) => {
    if (field.options && Array.isArray(field.options) && field.options.length > 0) {
      const activeOptions = field.options.filter(
        (opt) => opt && opt.isActive !== false && opt.label && opt.value
      );
      
      if (activeOptions.length > 0) {
        return activeOptions;
      }
    }
    
    return [];
  };

  // ==================== VALIDATION FUNCTIONS ====================
  const validateField = (field, value, allFormData = formData) => {
    const { validation, isRequired, label } = field;

    // Required validation
    if (isRequired || validation?.required) {
      if (field.type === 'checkbox' && field.isMultiple) {
        // For checkbox groups, check if at least one is selected
        if (!value || (Array.isArray(value) && value.length === 0) || 
            (typeof value === 'string' && value.trim() === '')) {
          return validation?.message || `${label} is required`;
        }
      } else {
        if (
          !value ||
          (Array.isArray(value) && value.length === 0) ||
          value.toString().trim() === ""
        ) {
          return validation?.message || `${label} is required`;
        }
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
    let fieldValue = type === 'checkbox' ? checked : value;

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

  const handleCheckboxGroupChange = (fieldName, optionValue, checked) => {
    const field = formFields.find(f => f.name === fieldName);
    if (!field) return;

    const currentValue = formData[fieldName] || "";
    const currentValues = Array.isArray(currentValue) 
      ? currentValue 
      : (typeof currentValue === 'string' && currentValue.includes(',')) 
        ? currentValue.split(',').map(v => v.trim()).filter(v => v !== '')
        : currentValue ? [currentValue.toString()] : [];

    let newValues;
    if (checked) {
      newValues = [...currentValues, optionValue];
    } else {
      newValues = currentValues.filter(v => v !== optionValue);
    }

    // Update selected count
    setSelectedCheckboxCount(prev => ({
      ...prev,
      [fieldName]: newValues.length
    }));

    // Update form data
    setFormData(prev => ({
      ...prev,
      [fieldName]: newValues.join(',')
    }));

    // Trigger validation
    if (touchedFields[fieldName]) {
      const error = validateField(field, newValues.join(','), formData);
      setFieldErrors(prev => ({
        ...prev,
        [fieldName]: error
      }));
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
    const { name, label, type, placeholder, helpText, isRequired, validation, isMultiple } = field;
    const value = formData[name] || "";
    const error = fieldErrors[name];
    const touched = touchedFields[name];

    const inputClassName = `mt-1 block w-full px-3 py-2.5 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 ${
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
          className={`${inputClassName} appearance-none bg-white`}
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
        return <textarea rows={3} {...baseProps} className={`${inputClassName} resize-none`} />;

      case "select":
        return (
          <select {...baseProps} className={`${inputClassName} appearance-none bg-white`}>
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
        // Check if it's a single checkbox or checkbox group
        const hasOptions = dynamicOptions && dynamicOptions.length > 0;
        const selectedCount = selectedCheckboxCount[name] || 0;
        
        if (hasOptions || isMultiple) {
          // Checkbox GROUP (multiple options) - NOW IN GRID LAYOUT
          const currentValues = Array.isArray(value) 
            ? value 
            : (typeof value === 'string' && value.includes(',')) 
              ? value.split(',').map(v => v.trim()).filter(v => v !== '')
              : value ? [value.toString()] : [];
          
          // Determine grid columns based on number of options
          const gridCols = dynamicOptions.length <= 4 ? "grid-cols-2" : 
                         dynamicOptions.length <= 8 ? "grid-cols-2 sm:grid-cols-3" : 
                         "grid-cols-2 sm:grid-cols-3 md:grid-cols-4";
          
          return (
            <div className="space-y-4">
              {/* Selected Count Badge */}
              {selectedCount > 0 && (
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
                    {selectedCount} selected
                  </span>
                  {validation?.minLength && (
                    <span className="text-sm text-gray-500">
                      (Minimum {validation.minLength} required)
                    </span>
                  )}
                </div>
              )}
              
              {/* Options Grid */}
              <div className={`grid ${gridCols} gap-3`}>
                {dynamicOptions.map((option, index) => {
                  const isChecked = currentValues.includes(option.value.toString());
                  
                  return (
                    <div 
                      key={option.value || index} 
                      className={`
                        relative flex items-start p-3 rounded-lg border transition-all duration-150 cursor-pointer
                        ${isChecked 
                          ? 'bg-orange-50 border-orange-300' 
                          : 'bg-gray-50 border-gray-200 hover:bg-gray-100 hover:border-gray-300'
                        }
                      `}
                      onClick={() => handleCheckboxGroupChange(name, option.value, !isChecked)}
                    >
                      <div className="flex items-center h-5 flex-shrink-0">
                        <input
                          type="checkbox"
                          id={`${name}-${option.value}`}
                          name={name}
                          value={option.value}
                          checked={isChecked}
                          onChange={(e) => handleCheckboxGroupChange(name, option.value, e.target.checked)}
                          onBlur={() => handleFieldBlur(name)}
                          className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded cursor-pointer"
                        />
                      </div>
                      <div className="ml-2 flex-1">
                        <label 
                          htmlFor={`${name}-${option.value}`}
                          className="block text-sm font-medium text-gray-900 cursor-pointer select-none"
                        >
                          {option.label}
                        </label>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Instructions */}
              <div className="flex items-center text-xs text-gray-500 pt-2">
                <svg className="w-4 h-4 mr-1 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span>Click on options to select/deselect. {validation?.minLength && `Select at least ${validation.minLength}.`}</span>
              </div>
            </div>
          );
        } else {
          // SINGLE checkbox (true/false)
          const isChecked = value === true || 
                           value === 'true' || 
                           value === 1 || 
                           value === '1' || 
                           value === 'yes' ||
                           value === 'on';
          
          return (
            <div className="flex items-center">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  id={name}
                  checked={isChecked}
                  onChange={(e) => {
                    handleInputChange({
                      target: { 
                        name, 
                        type: 'checkbox', 
                        checked: e.target.checked 
                      }
                    });
                  }}
                  onBlur={() => handleFieldBlur(name)}
                  className="sr-only"
                />
                <div 
                  className={`w-10 h-5 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200 ${
                    isChecked ? 'bg-orange-500' : 'bg-gray-300'
                  }`}
                  onClick={() => {
                    handleInputChange({
                      target: { 
                        name, 
                        type: 'checkbox', 
                        checked: !isChecked 
                      }
                    });
                  }}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                    isChecked ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </div>
                <label 
                  htmlFor={name}
                  className="ml-3 block text-sm font-medium text-gray-900 cursor-pointer select-none"
                >
                  {label} {isRequired && <span className="text-red-600">*</span>}
                </label>
              </div>
            </div>
          );
        }

      case "date":
        return (
          <div className="relative">
            <input
              type="date"
              {...baseProps}
              className={`${inputClassName} appearance-none`}
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        );

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

      // Convert ALL profile photos to base64
      const profileImagesBase64 = [];
      for (const photo of profilePhotos) {
        const base64Photo = await fileToBase64(photo);
        profileImagesBase64.push(base64Photo);
      }

      const documentsBase64 = [];
      for (const doc of documents) {
        const base64Doc = await fileToBase64(doc);
        documentsBase64.push(base64Doc);
      }

      // Clean form data - handle checkbox groups
      const cleanedFormData = {};
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          // Check if this field is a checkbox group
          const field = formFields.find(f => f.name === key);
          if (field && field.type === 'checkbox' && field.isMultiple) {
            // Ensure checkbox groups are stored as comma-separated strings
            if (Array.isArray(value)) {
              cleanedFormData[key] = value.join(',');
            } else {
              cleanedFormData[key] = value;
            }
          } else {
            cleanedFormData[key] = value;
          }
        }
      });

      // IMPORTANT: Changed from profileImage to profileImages
      const submitData = {
        formData: cleanedFormData,
        profileImages: profileImagesBase64, // Changed from profileImage
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
        <div className="mt-2 flex items-center text-sm text-red-600">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span>{fieldErrors[fieldName]}</span>
        </div>
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-orange-500 mx-auto mb-4"></div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Loading Form Configuration</h3>
          <p className="text-gray-600">Please wait while we load the registration form...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 pt-16 md:pt-20">
      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowSuccessModal(false)}></div>
          <div className="relative z-10 bg-white rounded-xl shadow-2xl max-w-md w-full p-8 text-center animate-fade-in">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
              <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Registration Successful!</h3>
            <p className="text-gray-600 mb-6">
              Your profile has been created successfully.
              {userVivId && (
                <span className="block mt-2 font-medium text-orange-600">Your VIV ID: {userVivId}</span>
              )}
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div className="bg-green-500 h-2 rounded-full animate-progress" style={{ animationDuration: "3s" }}></div>
            </div>
            <p className="text-sm text-gray-500">Redirecting to dashboard...</p>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8 relative z-10">
          {/* Top Spacer for Navigation */}
          <div className="h-4"></div>
          
          <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-6 mb-6 border-2 border-orange-200 shadow-lg relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute -top-10 -left-10 w-20 h-20 bg-red-100 rounded-full opacity-20"></div>
            <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-amber-100 rounded-full opacity-20"></div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-red-700 mb-2 relative z-10">
              !! वसुधैव कुटुम्बकम् !!
            </h1>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 relative z-10">
              Join Vivahanam - Find Your Life Partner
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto relative z-10">
              Create your complete profile to start your journey towards finding your perfect life partner
            </p>
          </div>
          
          {userVivId && (
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-green-50 to-emerald-50 px-5 py-3 rounded-xl border border-green-200 shadow-sm mb-6 relative z-10">
              <div className="bg-green-100 p-2 rounded-lg">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Your VIV ID</p>
                <p className="text-lg font-bold text-red-700">{userVivId}</p>
              </div>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 bg-red-50 border-l-4 border-red-500 rounded-r-lg p-6 shadow-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-red-800">Registration Error</h3>
                <p className="mt-1 text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Main Form */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-orange-100 mt-8">
          {/* Form Header */}
          <div className="bg-gradient-to-r from-orange-500 to-amber-600 px-6 py-5 sticky top-0 z-20">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">Registration Form</h2>
                <p className="text-orange-100 text-sm mt-1">Complete all sections to proceed</p>
              </div>
              <div className="text-right">
                <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full">
                  <span className="text-white text-sm font-medium">
                    {formFields.filter(f => f.isRequired).length} Required Fields
                  </span>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
            {/* Dynamic Sections */}
            {sections.map((section) => (
              <div key={section.section} className="scroll-mt-24" id={`section-${section.section}`}>
                <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-200">
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-orange-100 to-amber-100 rounded-lg flex items-center justify-center shadow-sm">
                    <span className="text-lg font-bold text-orange-600">
                      {sections.indexOf(section) + 1}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900">{section.sectionTitle}</h3>
                    <p className="text-gray-600 text-sm mt-1">
                      {section.fields.length} field{section.fields.length !== 1 ? 's' : ''} in this section
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {section.fields.map((field) => (
                    <div
                      key={field.name}
                      className={`${
                        field.type === "textarea" || 
                        (field.type === "checkbox" && field.isMultiple)
                          ? "lg:col-span-2"
                          : ""
                      }`}
                    >
                      <div className={`p-5 rounded-lg border transition-all duration-200 ${
                        touchedFields[field.name] && fieldErrors[field.name]
                          ? 'border-red-200 bg-red-50/50'
                          : 'border-gray-100 bg-white hover:border-orange-200'
                      }`}>
                        <label className="block text-sm font-semibold text-gray-900 mb-3 flex items-center justify-between">
                          <span className="flex items-center">
                            {field.label}
                            {(field.isRequired || field.validation?.required) && (
                              <span className="ml-1.5 text-red-600">*</span>
                            )}
                          </span>
                          {field.type === 'checkbox' && field.isMultiple && (
                            <span className="text-xs font-normal px-2 py-1 rounded-full bg-orange-100 text-orange-800">
                              Multiple select
                            </span>
                          )}
                        </label>
                        
                        {renderField(field)}
                        
                        {field.helpText && (
                          <div className="mt-3 flex items-start text-sm text-gray-500">
                            <svg className="w-4 h-4 mr-1.5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                            <span>{field.helpText}</span>
                          </div>
                        )}
                        
                        {renderFieldError(field.name)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Upload Sections */}
            <div className="space-y-8">
              {/* Profile Photos Section */}
              <div className="p-6 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl border border-orange-200">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex-shrink-0 w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-orange-300">
                    <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Profile Photos</h3>
                    <p className="text-gray-600 mt-1">
                      Upload clear photos to increase your profile visibility
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
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
                        className="block w-full border-2 border-dashed border-orange-300 rounded-xl p-8 text-center cursor-pointer bg-white/50 hover:bg-white transition-colors"
                      >
                        <div className="max-w-xs mx-auto">
                          <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-r from-orange-100 to-amber-100 flex items-center justify-center">
                            <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                          </div>
                          <h4 className="text-lg font-medium text-gray-900 mb-2">Upload Profile Photos</h4>
                          <p className="text-gray-600 mb-3">Click to browse</p>
                          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 rounded-full">
                            <span className="text-sm font-medium text-orange-800">
                              {3 - profilePhotos.length} slot{3 - profilePhotos.length !== 1 ? 's' : ''} remaining
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-4">JPG, PNG only • Max 100KB per photo</p>
                        </div>
                      </label>
                    )}
                  </div>

                  {/* Photo Preview */}
                  {profilePhotos.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium text-gray-900">Uploaded Photos ({profilePhotos.length}/3)</h4>
                        <span className="text-sm text-gray-500">Click on photo to view larger</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {profilePhotos.map((photo, index) => (
                          <div
                            key={index}
                            className="relative group bg-white rounded-lg border border-orange-200 overflow-hidden shadow-md"
                          >
                            <div className="absolute top-2 left-2 z-10">
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gradient-to-r from-orange-500 to-amber-500 text-white">
                                Photo {index + 1}
                              </span>
                            </div>
                            <div className="aspect-square relative overflow-hidden">
                              <img
                                src={photoUrls[index]}
                                alt={`Profile photo ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all">
                              <button
                                type="button"
                                onClick={() => removeProfilePhoto(index)}
                                className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition-colors"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Remove
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
              <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex-shrink-0 w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-blue-300">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Supporting Documents</h3>
                    <p className="text-gray-600 mt-1">
                      Upload required documents for verification
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <input
                    ref={documentsInputRef}
                    type="file"
                    multiple
                    onChange={handleDocumentChange}
                    accept=".pdf,.doc,.docx"
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-blue-500 file:to-indigo-500 file:text-white hover:file:from-blue-600 hover:file:to-indigo-600 transition-colors"
                  />

                  {documents.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-4">Uploaded Documents ({documents.length})</h4>
                      <div className="space-y-3">
                        {documents.map((doc, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-4 bg-white rounded-lg border border-blue-100 hover:border-blue-200 transition-colors"
                          >
                            <div className="flex items-center gap-4">
                              <div className={`p-2 rounded ${
                                getFileType(doc.name) === 'PDF' ? 'bg-red-100' :
                                getFileType(doc.name) === 'DOC' ? 'bg-blue-100' :
                                'bg-indigo-100'
                              }`}>
                                <span className={`text-xs font-medium ${
                                  getFileType(doc.name) === 'PDF' ? 'text-red-800' :
                                  getFileType(doc.name) === 'DOC' ? 'text-blue-800' :
                                  'text-indigo-800'
                                }`}>
                                  {getFileType(doc.name)}
                                </span>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  {doc.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {(doc.size / 1024).toFixed(2)} KB
                                </p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeDocument(index)}
                              className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {renderFieldError("documents")}
                </div>
              </div>
            </div>

            {/* Form Footer */}
            <div className="pt-8 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="text-sm text-gray-600">
                  <p className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <span>All fields marked with <span className="text-red-600 font-bold">*</span> are required</span>
                  </p>
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting || loading}
                  className="inline-flex items-center justify-center px-8 py-3 text-base sm:text-lg font-bold text-white bg-gradient-to-r from-orange-500 to-amber-600 rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed min-w-[200px] disabled:hover:scale-100 disabled:hover:shadow-lg"
                >
                  {isSubmitting || loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Complete Registration
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>By submitting this form, you agree to our Terms of Service and Privacy Policy</p>
          <p className="mt-1">Need help? Contact support@vivahanam.com</p>
        </div>
      </div>
    </div>
  );
};

export default DynamicRegistrationForm;