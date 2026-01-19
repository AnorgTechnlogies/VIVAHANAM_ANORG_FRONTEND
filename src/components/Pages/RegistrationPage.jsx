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

  // ==================== FETCH FORM CONFIG ====================
  useEffect(() => {
    const fetchFormConfig = async () => {
      try {
        console.log("🔍 Fetching form config from:", `${API_URL}/admin/form-fields/active`);
        const response = await fetch(`${API_URL}/admin/form-fields/active`);

        if (response.ok) {
          const data = await response.json();
          console.log("📦 API Response:", data);
          
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

          // Initialize form data
          const initialData = {};
          data.fields.forEach((field) => {
            console.log("📝 Field:", field.name, "Type:", field.type, "Options:", field.options);
            
            if (field.type === "checkbox" && field.options && field.options.length > 0) {
              // For checkbox with options, initialize as array
              initialData[field.name] = [];
              console.log("✅ Initialized checkbox array for:", field.name);
            } else if (field.type === "checkbox") {
              // Single checkbox
              initialData[field.name] = false;
              console.log("✅ Initialized single checkbox for:", field.name);
            } else if (field.type === "multiselect") {
              initialData[field.name] = [];
            } else if (
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
          console.log("🎯 Initial form data:", initialData);
          
          // Special debug: Check for checkbox fields
          const checkboxFields = data.fields.filter(f => f.type === "checkbox");
          console.log("🔘 Checkbox fields found:", checkboxFields);
        } else {
          console.error("❌ API response not OK:", response.status);
        }
      } catch (error) {
        console.error("Error fetching form configuration:", error);
      }
    };

    fetchFormConfig();
  }, [API_URL]);

  // ==================== SIMPLIFIED RENDER FIELD ====================
  const renderField = (field) => {
    const { name, label, type, placeholder, helpText, isRequired, validation, options } =
      field;
    const value = formData[name] || "";
    const error = fieldErrors[name];
    const touched = touchedFields[name];

    console.log("🎨 Rendering field:", { name, label, type, options: options?.length });

    // Special handling for checkbox type
    if (type === "checkbox") {
      console.log("🔘 CHECKBOX FIELD DETAILS:", { 
        name, 
        label, 
        options: options, 
        optionsCount: options?.length,
        value 
      });
      
      // If field has options, render multiple checkboxes
      if (options && Array.isArray(options) && options.length > 0) {
        const currentValues = Array.isArray(value) ? value : [];
        
        console.log("✅ Rendering MULTIPLE checkboxes for:", label, "with options:", options);
        
        return (
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {options.map((option, index) => {
                const optionValue = option.value || option.label;
                const optionLabel = option.label || option.value;
                
                return (
                  <div key={index} className="flex items-center bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <input
                      type="checkbox"
                      id={`${name}-${optionValue}`}
                      checked={currentValues.includes(optionValue)}
                      onChange={() => handleCheckboxChange(name, optionValue)}
                      className="h-5 w-5 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                    />
                    <label 
                      htmlFor={`${name}-${optionValue}`}
                      className="ml-3 block text-sm font-medium text-gray-700 cursor-pointer"
                    >
                      {optionLabel}
                    </label>
                  </div>
                );
              })}
            </div>
            
            {/* Show selected values */}
            {currentValues.length > 0 && (
              <div className="mt-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                <p className="text-sm font-medium text-gray-700 mb-1">Selected:</p>
                <div className="flex flex-wrap gap-2">
                  {currentValues.map((selectedValue, index) => {
                    const option = options.find(opt => (opt.value || opt.label) === selectedValue);
                    return (
                      <span 
                        key={index} 
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 border border-orange-300"
                      >
                        {option?.label || option?.value || selectedValue}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );
      } else {
        // Single checkbox (Yes/No type)
        console.log("✅ Rendering SINGLE checkbox for:", label);
        return (
          <div className="flex items-center">
            <input
              type="checkbox"
              name={name}
              checked={!!value}
              onChange={handleInputChange}
              className="h-5 w-5 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
            />
            <label className="ml-3 block text-sm font-medium text-gray-700">
              {label}
            </label>
          </div>
        );
      }
    }

    // For other field types, use existing logic
    const inputClassName = `mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 ${
      touched && error
        ? "border-red-300 focus:border-red-500"
        : "border-gray-300 focus:border-orange-500"
    }`;

    const baseProps = {
      name,
      onChange: handleInputChange,
      onBlur: () => handleFieldBlur(name),
      required: isRequired || validation?.required,
      value: value,
      className: inputClassName,
      placeholder: placeholder || `Enter ${label.toLowerCase()}`,
    };

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
            {options && options.map((option, index) => (
              <option key={index} value={option.value || option.label}>
                {option.label || option.value}
              </option>
            ))}
          </select>
        );

      case "radio":
        return (
          <div className="space-y-2">
            {options && options.map((option, index) => (
              <div key={index} className="flex items-center">
                <input
                  type="radio"
                  name={name}
                  value={option.value || option.label}
                  checked={value === (option.value || option.label)}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300"
                />
                <label className="ml-2 block text-sm text-gray-700">
                  {option.label || option.value}
                </label>
              </div>
            ))}
          </div>
        );

      case "date":
        return <input type="date" {...baseProps} />;

      default:
        return <input type="text" {...baseProps} />;
    }
  };

  // ==================== CHECKBOX HANDLER ====================
  const handleCheckboxChange = (fieldName, checkboxValue) => {
    console.log("🔘 Checkbox changed:", fieldName, checkboxValue);
    
    const currentValues = formData[fieldName] || [];
    
    let newValues;
    if (currentValues.includes(checkboxValue)) {
      // Remove if already selected
      newValues = currentValues.filter(val => val !== checkboxValue);
      console.log("➖ Removed value:", checkboxValue);
    } else {
      // Add if not selected
      newValues = [...currentValues, checkboxValue];
      console.log("➕ Added value:", checkboxValue);
    }

    setFormData((prev) => ({
      ...prev,
      [fieldName]: newValues,
    }));

    console.log("📊 Updated values for", fieldName, ":", newValues);
  };

  // ==================== BASIC HANDLERS ====================
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    let fieldValue = type === "checkbox" ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: fieldValue,
    }));
  };

  const handleFieldBlur = (fieldName) => {
    setTouchedFields((prev) => ({ ...prev, [fieldName]: true }));
  };

  // ==================== REST OF THE CODE (Simplified) ====================
  
  // Add other handlers here (submit, file handling, etc.)
  // But for now let's focus on getting checkboxes to show

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

  console.log("🎬 Rendering form with sections:", sections);

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
          </div>

          {/* Form */}
          <div className="bg-white/95 backdrop-blur-sm shadow-2xl rounded-2xl p-8 space-y-6 border border-orange-100">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <form
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
                      {section.fields.map((field) => {
                        const isWideField = field.type === "textarea" || 
                                          field.type === "checkbox" || 
                                          field.type === "radio";
                        
                        console.log("📋 Field in section:", field.name, "type:", field.type, "wide:", isWideField);
                        
                        return (
                          <div
                            key={field.name}
                            className={isWideField ? "col-span-1 md:col-span-2" : ""}
                          >
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              {field.label}
                              {(field.isRequired || field.validation?.required) && (
                                <span className="text-red-600 ml-1">*</span>
                              )}
                            </label>
                            {renderField(field)}
                            {field.helpText && (
                              <p className="mt-1 text-xs text-gray-500">
                                {field.helpText}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}

              {/* DEBUG INFO */}
              <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">Debug Information:</h4>
                <div className="text-sm text-blue-600 space-y-1">
                  <p>Total fields: {formFields.length}</p>
                  <p>Checkbox fields: {formFields.filter(f => f.type === "checkbox").length}</p>
                  <p>Form data keys: {Object.keys(formData).join(", ")}</p>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-6">
                <button
                  type="button"
                  onClick={() => console.log("Form Data:", formData)}
                  className="px-6 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300"
                >
                  Debug Log
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DynamicRegistrationForm;