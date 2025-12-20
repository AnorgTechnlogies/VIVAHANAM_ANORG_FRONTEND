import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Save, CheckCircle, ArrowLeft, AlertCircle, Eye, EyeOff } from "lucide-react";

const UpdateProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({});
  const [formFields, setFormFields] = useState([]);
  const [sections, setSections] = useState([]);
  const [activeTab, setActiveTab] = useState('general_basic_info');
  const [profileStatus, setProfileStatus] = useState('checking');
  const [showEmptyFields, setShowEmptyFields] = useState(true); // Start with all fields shown
  const API_URL = import.meta.env.VITE_API_KEY;

  useEffect(() => {
    initializeData();
  }, []);

  const initializeData = async () => {
    setLoading(true);
    setProfileStatus('checking');
    try {
      // Fetch user profile first to check completion status
      const userData = await fetchUserProfile();
      
      // If profile is not completed, redirect to registration
      if (!userData.profileCompleted) {
        setProfileStatus('incomplete');
        setError("Please complete your registration first");
        setTimeout(() => {
          navigate('/register');
        }, 2000);
        return;
      }

      // If profile is completed, fetch form config and continue
      setProfileStatus('complete');
      const formConfig = await fetchFormConfig();
      initializeFormData(userData, formConfig);
      
    } catch (err) {
      setError(err.message);
      setProfileStatus('incomplete');
    } finally {
      setLoading(false);
    }
  };

  const fetchFormConfig = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/form-fields/active`);
      if (response.ok) {
        const data = await response.json();
        const fields = data.fields || [];
        setFormFields(fields);
        
        // Group fields by section
        const groupedSections = fields.reduce((acc, field) => {
          if (!acc.find(s => s.section === field.section)) {
            acc.push({
              section: field.section,
              sectionTitle: field.sectionTitle,
              sectionOrder: field.sectionOrder,
              fields: []
            });
          }
          const section = acc.find(s => s.section === field.section);
          section.fields.push(field);
          return acc;
        }, []);

        // Sort sections and fields
        const sortedSections = groupedSections
          .sort((a, b) => a.sectionOrder - b.sectionOrder)
          .map(section => ({
            ...section,
            fields: section.fields.sort((a, b) => a.fieldOrder - b.fieldOrder)
          }));

        setSections(sortedSections);
        return sortedSections;
      }
    } catch (error) {
      console.error("Error fetching form configuration:", error);
      throw error;
    }
  };

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('vivahanamToken');
      const response = await fetch(`${API_URL}/user/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch profile');
      }

      return data.user;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Initialize form data with all fields
  const initializeFormData = (userData, sections) => {
    const initialFormData = { ...userData };
    
    // Ensure all form fields exist in formData
    sections.forEach(section => {
      section.fields.forEach(field => {
        // If field doesn't exist in user data, initialize with empty string
        if (initialFormData[field.name] === undefined || initialFormData[field.name] === null) {
          initialFormData[field.name] = '';
        }
      });
    });

    // Always include essential identifiers
    if (userData._id) initialFormData._id = userData._id;
    if (userData.vivId) initialFormData.vivId = userData.vivId;
    if (userData.email) initialFormData.email = userData.email;

    setFormData(initialFormData);
  };

  // Check if a field has value
  const hasValue = (fieldName) => {
    const value = formData[fieldName];
    return value !== null && 
           value !== undefined && 
           value !== '' && 
           !(Array.isArray(value) && value.length === 0);
  };

  // Check if field is mandatory
  const isMandatoryField = (field) => {
    return field.isRequired || (field.validation && field.validation.required);
  };

  // Get filtered fields for a section
  const getFilteredFields = (sectionFields) => {
    if (showEmptyFields) {
      return sectionFields; // Show all fields
    }
    // Show only filled fields and mandatory fields (even if empty)
    return sectionFields.filter(field => 
      hasValue(field.name) || isMandatoryField(field)
    );
  };

  // Get empty fields count for a section
  const getEmptyFieldsCount = (sectionFields) => {
    return sectionFields.filter(field => !hasValue(field.name) && !isMandatoryField(field)).length;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (profileStatus !== 'complete') {
      setError("Please complete your registration first");
      setTimeout(() => {
        navigate('/register');
      }, 2000);
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem('vivahanamToken');

      // Clean up data before sending - set empty strings to null for non-mandatory fields
      const cleanedData = { ...formData };
      Object.keys(cleanedData).forEach(key => {
        // Find the field definition
        const fieldDef = formFields.find(field => field.name === key);
        const isMandatory = fieldDef ? isMandatoryField(fieldDef) : false;
        
        // Only set to null if it's empty and not mandatory
        if (cleanedData[key] === '' && !isMandatory) {
          cleanedData[key] = null;
        }
      });

      const response = await fetch(`${API_URL}/user/update-profile`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(cleanedData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }

      setSuccess("Profile updated successfully!");
      
      setTimeout(() => {
        navigate('/profile');
      }, 2000);

    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // Function to determine input type based on field configuration
  const getInputType = (field) => {
    if (field.type === 'select') return 'select';
    if (field.type === 'textarea') return 'textarea';
    if (field.type === 'date') return 'date';
    if (field.type === 'time') return 'time';
    if (field.type === 'tel') return 'tel';
    if (field.type === 'email') return 'email';
    if (field.type === 'number') return 'number';
    return 'text';
  };

  // Render appropriate input field
  const renderInputField = (field) => {
    const value = formData[field.name] || '';
    const inputType = getInputType(field);
    const fieldHasValue = hasValue(field.name);
    const isMandatory = isMandatoryField(field);

    const inputClassName = `mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
      !fieldHasValue && !isMandatory ? 'bg-gray-50' : ''
    } ${isMandatory ? 'border-l-4 border-l-amber-500' : ''}`;

    return (
      <div className="relative">
        {inputType === 'textarea' ? (
          <textarea
            name={field.name}
            value={value}
            onChange={handleInputChange}
            rows="4"
            className={inputClassName}
            placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
            required={isMandatory}
          />
        ) : inputType === 'select' ? (
          <select
            name={field.name}
            value={value}
            onChange={handleInputChange}
            className={inputClassName}
            required={isMandatory}
          >
            <option value="">Select {field.label}</option>
            {field.options?.map((option, index) => (
              <option key={option.value || index} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={inputType}
            name={field.name}
            value={value}
            onChange={handleInputChange}
            className={inputClassName}
            placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
            required={isMandatory}
          />
        )}
        
        {/* Mandatory field indicator */}
        {isMandatory && (
          <div className="absolute -left-1 top-1/2 transform -translate-y-1/2">
            <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
          </div>
        )}
      </div>
    );
  };

  // Calculate completion for a section
  const calculateSectionCompletion = (sectionFields) => {
    const filledFields = sectionFields.filter(field => hasValue(field.name)).length;
    return sectionFields.length > 0 ? Math.round((filledFields / sectionFields.length) * 100) : 0;
  };

  // Get icon for section
  const getSectionIcon = (section) => {
    const icons = {
      'general_basic_info': '👤',
      'religion_cultural': '⭐',
      'location_education': '📍',
      'address_details': '🏠',
      'profile_personal': '📝',
      'partner_preferences': '💝',
      'privacy_settings': '👁️'
    };
    return icons[section] || '📋';
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-amber-50 pt-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
          </div>
        </div>
      </div>
    );
  }

  // Show redirect message for incomplete profiles
  if (profileStatus === 'incomplete') {
    return (
      <div className="min-h-screen bg-amber-50 pt-20">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-yellow-800 mb-2">
              Registration Incomplete
            </h2>
            <p className="text-yellow-700 mb-4">
              Please complete your registration first to access profile updates.
            </p>
            <p className="text-sm text-yellow-600">
              Redirecting to registration page...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Only show the update form if profile is complete
  if (profileStatus !== 'complete') {
    return null;
  }

  return (
    <div className="min-h-screen bg-amber-50 pt-20">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/profile')}
            className="flex items-center gap-2 text-amber-600 hover:text-amber-700 mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Profile
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Update Your Profile</h1>
        </div>

        {/* Success Popup */}
        {success && (
          <div className="fixed top-20 right-4 bg-green-50 border border-green-200 text-green-600 px-6 py-4 rounded-lg shadow-lg z-50 flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            {success}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Toggle for empty fields */}
        <div className="bg-white rounded-lg shadow-sm mb-6 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Profile Fields</h3>
          
            </div>
            <button
              onClick={() => setShowEmptyFields(!showEmptyFields)}
              className="flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors"
            >
              {showEmptyFields ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {showEmptyFields ? 'Hide Empty Fields' : 'Show All Fields'}
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6 p-2 overflow-x-auto">
          <div className="flex gap-1 sm:gap-2 min-w-max">
            {sections.map(section => {
              const completion = calculateSectionCompletion(section.fields);
              const filledFields = section.fields.filter(field => hasValue(field.name)).length;
              const totalFields = section.fields.length;
              const emptyFieldsCount = getEmptyFieldsCount(section.fields);
              
              return (
                <button
                  key={section.section}
                  onClick={() => setActiveTab(section.section)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition text-sm ${
                    activeTab === section.section
                      ? 'bg-amber-500 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-base">{getSectionIcon(section.section)}</span>
                  <span className="whitespace-nowrap">{section.sectionTitle}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                    activeTab === section.section 
                      ? 'bg-amber-600 text-white' 
                      : filledFields === totalFields 
                        ? 'bg-green-100 text-green-700'
                        : filledFields > 0
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-gray-100 text-gray-600'
                  }`}>
                    {filledFields}/{totalFields}
                  </span>
                  {emptyFieldsCount > 0 && !showEmptyFields && (
                    <span className="text-xs text-gray-400">
                      +{emptyFieldsCount} more
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Profile Form */}
        <form onSubmit={handleSubmit}>
          {sections.map(section => {
            if (activeTab === section.section) {
              const completion = calculateSectionCompletion(section.fields);
              const filteredFields = getFilteredFields(section.fields);
              const mandatoryFields = section.fields.filter(field => isMandatoryField(field));
              const optionalFields = section.fields.filter(field => !isMandatoryField(field));
              
              return (
                <div key={section.section} className="bg-white rounded-xl shadow-lg p-6 mb-6">
                  <div className="flex items-center justify-between mb-6 border-b pb-2">
                    <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                      <span className="text-base">{getSectionIcon(section.section)}</span>
                      {section.sectionTitle}
                    </h3>
                    <div className="flex items-center gap-4">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        completion === 100 
                          ? 'bg-green-100 text-green-700' 
                          : completion >= 50 
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-red-100 text-red-700'
                      }`}>
                        {completion}% Complete
                      </span>
                    </div>
                  </div>
                  
                  {/* Mandatory Fields - Always shown */}
                  {mandatoryFields.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-md font-semibold text-gray-700 mb-4 flex items-center gap-2">
                        <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                        Required Information
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {mandatoryFields.map(field => (
                          <div key={field.name} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              {field.label}
                              <span className="text-red-600 ml-1">*</span>
                              {!hasValue(field.name) && (
                                <span className="text-amber-600 ml-1">• Required</span>
                              )}
                            </label>
                            {renderInputField(field)}
                            {field.helpText && (
                              <p className="mt-1 text-xs text-amber-600">{field.helpText}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Optional Fields */}
                  {filteredFields.filter(field => !isMandatoryField(field)).length > 0 && (
                    <div>
                      <h4 className="text-md font-semibold text-gray-700 mb-4">
                        Additional Information
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {filteredFields
                          .filter(field => !isMandatoryField(field))
                          .map(field => (
                            <div key={field.name} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                {field.label}
                                {!hasValue(field.name) && (
                                  <span className="text-gray-400 ml-1">• Optional</span>
                                )}
                              </label>
                              {renderInputField(field)}
                              {field.helpText && (
                                <p className="mt-1 text-xs text-gray-500">{field.helpText}</p>
                              )}
                            </div>
                          ))
                        }
                      </div>
                    </div>
                  )}

                  {/* Empty Fields Message when hidden */}
                  {!showEmptyFields && optionalFields.filter(field => !hasValue(field.name)).length > 0 && (
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg text-center">
                      <p className="text-gray-600">
                        There are {optionalFields.filter(field => !hasValue(field.name)).length} additional optional fields available.
                      </p>
                      <button
                        type="button"
                        onClick={() => setShowEmptyFields(true)}
                        className="mt-2 text-amber-600 hover:text-amber-700 font-medium"
                      >
                        Show all optional fields
                      </button>
                    </div>
                  )}
                </div>
              );
            }
            return null;
          })}

          {/* Submit Button */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t">
            <button
              type="button"
              onClick={() => navigate('/profile')}
              className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfile;