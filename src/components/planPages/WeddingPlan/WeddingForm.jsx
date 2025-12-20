import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate, useLocation } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_KEY;

// Helpers to track wedding form completion per user (so different accounts don't conflict)
const getUserKey = () => {
  try {
    const user = JSON.parse(localStorage.getItem("vivahanamUser"));
    if (!user) return null;
    return user._id || user.email || user.vivId || "guest";
  } catch {
    return null;
  }
};

const setFormCompleteForCurrentUser = () => {
  const key = getUserKey();
  if (!key) return;
  try {
    const map =
      JSON.parse(localStorage.getItem("vivahanamWeddingFormSubmittedMap")) || {};
    map[key] = true;
    localStorage.setItem(
      "vivahanamWeddingFormSubmittedMap",
      JSON.stringify(map)
    );
  } catch {
    // ignore JSON issues
  }
};

const UserForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Mother Tongue Options
  const motherTongueOptions = [
    // Indian Languages
    { value: 'hindi', label: 'Hindi' },
    { value: 'bengali', label: 'Bengali' },
    { value: 'telugu', label: 'Telugu' },
    { value: 'marathi', label: 'Marathi' },
    { value: 'tamil', label: 'Tamil' },
    { value: 'urdu', label: 'Urdu' },
    { value: 'gujarati', label: 'Gujarati' },
    { value: 'kannada', label: 'Kannada' },
    { value: 'odia', label: 'Odia' },
    { value: 'malayalam', label: 'Malayalam' },
    { value: 'punjabi', label: 'Punjabi' },
    { value: 'assamese', label: 'Assamese' },
    { value: 'maithili', label: 'Maithili' },
    { value: 'santali', label: 'Santali' },
    { value: 'kashmiri', label: 'Kashmiri' },
    { value: 'sanskrit', label: 'Sanskrit' },
    { value: 'konkani', label: 'Konkani' },
    { value: 'bodo', label: 'Bodo' },
    { value: 'dogri', label: 'Dogri' },
    { value: 'manipuri', label: 'Manipuri' },
    { value: 'sindhi', label: 'Sindhi' },
    { value: 'nepali', label: 'Nepali' },
    // International Languages
    { value: 'english', label: 'English' },
    { value: 'spanish', label: 'Spanish' },
    { value: 'french', label: 'French' },
    { value: 'arabic', label: 'Arabic' },
    { value: 'portuguese', label: 'Portuguese' },
    { value: 'russian', label: 'Russian' },
    { value: 'german', label: 'German' },
    { value: 'japanese', label: 'Japanese' },
    { value: 'korean', label: 'Korean' },
    { value: 'italian', label: 'Italian' },
    { value: 'dutch', label: 'Dutch' },
    { value: 'turkish', label: 'Turkish' },
    { value: 'persian', label: 'Persian' },
    { value: 'hebrew', label: 'Hebrew' },
    { value: 'chinese', label: 'Chinese' },
  ];

  // Religion Options
  const religionOptions = [
    // Indian Religions
    { value: 'hinduism', label: 'Hinduism' },
    { value: 'islam', label: 'Islam' },
    { value: 'christianity', label: 'Christianity' },
    { value: 'sikhism', label: 'Sikhism' },
    { value: 'buddhism', label: 'Buddhism' },
    { value: 'jainism', label: 'Jainism' },
    { value: 'zoroastrianism', label: 'Zoroastrianism (Parsi)' },
    { value: 'judaism', label: 'Judaism' },
    { value: 'bahai', label: 'Bahá\'í Faith' },
    // Other Indian spiritual traditions
    { value: 'aryasamaj', label: 'Arya Samaj' },
    { value: 'brahmo', label: 'Brahmo Samaj' },
    { value: 'radhasoami', label: 'Radha Soami' },
    { value: 'santmat', label: 'Sant Mat' },
    { value: 'sarna', label: 'Sarna (Tribal Religion)' },
    // International Religions
    { value: 'catholic', label: 'Catholicism' },
    { value: 'protestant', label: 'Protestantism' },
    { value: 'orthodox', label: 'Eastern Orthodox' },
    { value: 'mormon', label: 'Mormonism' },
    { value: 'jehovah', label: 'Jehovah\'s Witnesses' },
    { value: 'shinto', label: 'Shinto' },
    { value: 'taoism', label: 'Taoism' },
    { value: 'confucianism', label: 'Confucianism' },
    { value: 'druze', label: 'Druze' },
    { value: 'rastafari', label: 'Rastafari' },
    // Other categories
    { value: 'spiritual', label: 'Spiritual but not religious' },
    { value: 'atheist', label: 'Atheist' },
    { value: 'agnostic', label: 'Agnostic' },
    { value: 'humanist', label: 'Humanist' },
    { value: 'other', label: 'Other' },
    { value: 'prefer_not_to_say', label: 'Prefer not to say' },
  ];

  // Wedding Services Options with names
  const weddingServices = [
    { name: 'Match Making', description: 'Find your perfect life partner' },
    { name: 'Pre-Wedding Consultation', description: 'Expert guidance for your big day' },
    { name: 'Auspicious Date Discovery', description: 'Perfect date based on astrology' },
    { name: 'Priest Support', description: 'Experienced priests for ceremonies' },
    { name: 'Location Services', description: 'Find and book perfect venue' },
    { name: 'Event Management', description: 'Professional coordination' },
    { name: 'Decoration', description: 'Transform venue into magical space' },
    { name: 'Food/Catering', description: 'Exquisite culinary experiences' },
    { name: 'Transportation & Logistics', description: 'Smooth transportation solutions' },
    { name: 'Marriage Registration', description: 'Legal documentation assistance' },
  ];

  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    mobileNumber: '',
    whatsappNumber: '',
    userType: '',
    gender: '',
    motherTongue: '',
    religion: '',
    country: '',
    state: '',
    city: '',
    postalCode: '',
    streetAddress: '',
    selectedServices: []
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle service selection
  const handleServiceChange = (serviceName) => {
    setFormData(prev => {
      const newSelectedServices = prev.selectedServices.includes(serviceName)
        ? prev.selectedServices.filter(name => name !== serviceName)
        : [...prev.selectedServices, serviceName];
      
      return {
        ...prev,
        selectedServices: newSelectedServices
      };
    });
  };

  // Select/Deselect all services
  const handleSelectAll = () => {
    if (formData.selectedServices.length === weddingServices.length) {
      setFormData(prev => ({
        ...prev,
        selectedServices: []
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        selectedServices: weddingServices.map(service => service.name)
      }));
    }
  };

  // Check if mobile/whatsapp number already exists
  const checkNumberExists = async (type, number) => {
    if (!number || number.length !== 10) return false;
    
    try {
      setIsChecking(true);
      const response = await axios.get(`${API_URL}/user/check-contact`, {
        params: type === 'mobile' 
          ? { mobileNumber: number }
          : { whatsappNumber: number }
      });
      
      setIsChecking(false);
      return response.data.exists;
    } catch (error) {
      setIsChecking(false);
      console.error('Error checking number:', error);
      return false;
    }
  };

  // Validate mobile and whatsapp numbers
  const validateForm = async () => {
    const newErrors = {};
    
    // Required field validation
    const requiredFields = [
      'firstName', 'lastName', 'mobileNumber', 'userType', 'gender',
      'motherTongue', 'religion', 'country', 'state', 'city',
      'postalCode', 'streetAddress'
    ];
    
    requiredFields.forEach(field => {
      if (!formData[field].trim()) {
        newErrors[field] = 'This field is required';
      }
    });
    
    // Mobile number validation
    if (formData.mobileNumber) {
      if (!/^\d{10}$/.test(formData.mobileNumber)) {
        newErrors.mobileNumber = 'Must be a valid 10-digit number';
      } else {
        // Check if mobile number already exists
        const mobileExists = await checkNumberExists('mobile', formData.mobileNumber);
        if (mobileExists) {
          newErrors.mobileNumber = 'This mobile number is already registered';
        }
      }
    }
    
    // WhatsApp number validation (optional)
    if (formData.whatsappNumber && formData.whatsappNumber.trim() !== '') {
      if (!/^\d{10}$/.test(formData.whatsappNumber)) {
        newErrors.whatsappNumber = 'Must be a valid 10-digit number';
      } else if (formData.whatsappNumber === formData.mobileNumber) {
        newErrors.whatsappNumber = 'WhatsApp number cannot be same as mobile number';
      } else {
        // Check if WhatsApp number already exists
        const whatsappExists = await checkNumberExists('whatsapp', formData.whatsappNumber);
        if (whatsappExists) {
          newErrors.whatsappNumber = 'This WhatsApp number is already registered';
        }
      }
    }
    
    // Postal code validation
    if (formData.postalCode && !/^\d{5,6}$/.test(formData.postalCode)) {
      newErrors.postalCode = 'Must be 5-6 digits';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const token = localStorage.getItem("vivahanamToken");
    if (!token) {
      toast.error("Please login to submit the wedding service form.");
      navigate("/signup", {
        state: {
          redirectTo: "/Wedding-Service-Form",
          selectedPlan: location.state?.selectedPlan,
        },
      });
      return;
    }
    
    const isValid = await validateForm();
    if (!isValid) {
      toast.error('Please fix all errors before submitting');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Prepare data with selected services
      const formDataToSubmit = {
        ...formData,
        selectedServices: formData.selectedServices
      };
      
      console.log('Sending to backend:', formDataToSubmit);
      
      const response = await axios.post(
        `${API_URL}/user/Weddinguser-form`,
        formDataToSubmit,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      console.log('Response from backend:', response.data);
      
      if (response.data.success) {
        toast.success('Form submitted successfully!');
        
        const selectedPlan = location.state?.selectedPlan;
        // Remember that the user has completed the wedding services form (per user)
        setFormCompleteForCurrentUser();
        
        navigate("/subscription-plans", {
          state: {
            formSubmitted: true,
            selectedPlan: selectedPlan
          },
          replace: true
        });
      } else if (response.data.alreadySubmitted) {
        // If backend says already submitted, still move forward to contact popup
        setFormCompleteForCurrentUser();
        const selectedPlan = location.state?.selectedPlan;
        navigate("/subscription-plans", {
          state: {
            formSubmitted: true,
            selectedPlan: selectedPlan
          },
          replace: true
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      console.error('Error response:', error.response);
      
      if (error.response?.data?.errors) {
        error.response.data.errors.forEach(err => toast.error(err));
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Error submitting form');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-22">
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-50 rounded-2xl shadow-xl overflow-hidden border border-amber-200">
          <div className="bg-amber-600 text-white p-6">
            <h2 className="text-3xl font-bold text-center">Wedding Service Registration Form</h2>
            <p className="text-center text-amber-100 mt-2">
              Please fill in all required fields marked with *
            </p>
            {location.state?.selectedPlan && (
              <div className="mt-4 text-center bg-amber-700 rounded-lg py-2 px-4 inline-block mx-auto">
                <p className="font-semibold">Selected Plan: <span className="text-yellow-300">{location.state.selectedPlan.name}</span></p>
              </div>
            )}
          </div>
          
          <form onSubmit={handleSubmit} className="p-8">
            {/* General & Basic Info Section */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-amber-800 mb-6 pb-2 border-b-2 border-amber-200">
                General & Basic Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* First Name */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Enter first name"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors ${
                      errors.firstName ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm">{errors.firstName}</p>
                  )}
                </div>
                
                {/* Middle Name */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Middle Name
                  </label>
                  <input
                    type="text"
                    name="middleName"
                    value={formData.middleName}
                    onChange={handleChange}
                    placeholder="Enter middle name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                  />
                </div>
                
                {/* Last Name */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Enter last name"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors ${
                      errors.lastName ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm">{errors.lastName}</p>
                  )}
                </div>
                
                {/* Mobile Number */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleChange}
                    placeholder="Enter 10-digit mobile number"
                    maxLength="10"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors ${
                      errors.mobileNumber ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.mobileNumber && (
                    <p className="text-red-500 text-sm">{errors.mobileNumber}</p>
                  )}
                  {isChecking && (
                    <p className="text-amber-600 text-sm">Checking number availability...</p>
                  )}
                </div>
                
                {/* WhatsApp Number */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    name="whatsappNumber"
                    value={formData.whatsappNumber}
                    onChange={handleChange}
                    placeholder="Enter 10-digit WhatsApp number (optional)"
                    maxLength="10"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors ${
                      errors.whatsappNumber ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.whatsappNumber && (
                    <p className="text-red-500 text-sm">{errors.whatsappNumber}</p>
                  )}
                 
                </div>
                
                {/* User Type */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    User Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="userType"
                    value={formData.userType}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors ${
                      errors.userType ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select user type</option>
                    <option value="self">Self</option>
                    <option value="parents">Parents</option>
                    <option value="sibling">Sibling</option>
                    <option value="relative">Relative</option>
                  </select>
                  {errors.userType && (
                    <p className="text-red-500 text-sm">{errors.userType}</p>
                  )}
                </div>
                
                {/* Gender */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors ${
                      errors.gender ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.gender && (
                    <p className="text-red-500 text-sm">{errors.gender}</p>
                  )}
                </div>
                
                {/* Mother Tongue */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Mother Tongue <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="motherTongue"
                    value={formData.motherTongue}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors ${
                      errors.motherTongue ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select Mother Tongue</option>
                    <optgroup label="Indian Languages">
                      {motherTongueOptions
                        .filter(lang => 
                          ['hindi', 'bengali', 'telugu', 'marathi', 'tamil', 'urdu', 'gujarati', 
                           'kannada', 'odia', 'malayalam', 'punjabi', 'assamese', 'maithili', 
                           'santali', 'kashmiri', 'sanskrit', 'konkani', 'bodo', 'dogri', 
                           'manipuri', 'sindhi', 'nepali'].includes(lang.value)
                        )
                        .map(lang => (
                          <option key={lang.value} value={lang.value}>
                            {lang.label}
                          </option>
                        ))
                      }
                    </optgroup>
                    <optgroup label="International Languages">
                      {motherTongueOptions
                        .filter(lang => 
                          ['english', 'spanish', 'french', 'arabic', 'portuguese', 'russian', 
                           'german', 'japanese', 'korean', 'italian', 'dutch', 'turkish', 
                           'persian', 'hebrew', 'chinese'].includes(lang.value)
                        )
                        .map(lang => (
                          <option key={lang.value} value={lang.value}>
                            {lang.label}
                          </option>
                        ))
                      }
                    </optgroup>
                    <option value="other_language">Other</option>
                  </select>
                  {errors.motherTongue && (
                    <p className="text-red-500 text-sm">{errors.motherTongue}</p>
                  )}
                </div>
                
                {/* Religion */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Religion <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="religion"
                    value={formData.religion}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors ${
                      errors.religion ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select Religion</option>
                    <optgroup label="Indian Religions">
                      {religionOptions
                        .filter(religion => 
                          ['hinduism', 'islam', 'christianity', 'sikhism', 'buddhism', 
                           'jainism', 'zoroastrianism', 'judaism', 'bahai', 'aryasamaj', 
                           'brahmo', 'radhasoami', 'santmat', 'sarna'].includes(religion.value)
                        )
                        .map(religion => (
                          <option key={religion.value} value={religion.value}>
                            {religion.label}
                          </option>
                        ))
                      }
                    </optgroup>
                    <optgroup label="International Religions">
                      {religionOptions
                        .filter(religion => 
                          ['catholic', 'protestant', 'orthodox', 'mormon', 'jehovah', 
                           'shinto', 'taoism', 'confucianism', 'druze', 'rastafari'].includes(religion.value)
                        )
                        .map(religion => (
                          <option key={religion.value} value={religion.value}>
                            {religion.label}
                          </option>
                        ))
                      }
                    </optgroup>
                    <optgroup label="Other Categories">
                      {religionOptions
                        .filter(religion => 
                          ['spiritual', 'atheist', 'agnostic', 'humanist', 'other', 'prefer_not_to_say'].includes(religion.value)
                        )
                        .map(religion => (
                          <option key={religion.value} value={religion.value}>
                            {religion.label}
                          </option>
                        ))
                      }
                    </optgroup>
                  </select>
                  {errors.religion && (
                    <p className="text-red-500 text-sm">{errors.religion}</p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Address Details Section */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-amber-800 mb-6 pb-2 border-b-2 border-amber-200">
                Address Details
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Country */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Country <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors ${
                      errors.country ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select Country</option>
                    <option value="India">India</option>
                    <option value="USA">United States</option>
                    <option value="UK">United Kingdom</option>
                    <option value="Canada">Canada</option>
                    <option value="Australia">Australia</option>
                    <option value="Germany">Germany</option>
                    <option value="France">France</option>
                    <option value="Japan">Japan</option>
                    <option value="China">China</option>
                    <option value="Russia">Russia</option>
                    <option value="Brazil">Brazil</option>
                    <option value="South Africa">South Africa</option>
                    <option value="UAE">United Arab Emirates</option>
                    <option value="Singapore">Singapore</option>
                    <option value="Malaysia">Malaysia</option>
                    <option value="Nepal">Nepal</option>
                    <option value="Maldives">Maldives</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.country && (
                    <p className="text-red-500 text-sm">{errors.country}</p>
                  )}
                </div>
                
                {/* State */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    State <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="Enter your state"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors ${
                      errors.state ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.state && (
                    <p className="text-red-500 text-sm">{errors.state}</p>
                  )}
                </div>
                
                {/* City */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Enter your city"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors ${
                      errors.city ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.city && (
                    <p className="text-red-500 text-sm">{errors.city}</p>
                  )}
                </div>
                
                {/* Postal Code */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Postal Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    placeholder="Enter postal code"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors ${
                      errors.postalCode ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.postalCode && (
                    <p className="text-red-500 text-sm">{errors.postalCode}</p>
                  )}
                  <p className="text-sm text-gray-500">
                    Enter 5-6 digit postal code
                  </p>
                </div>
                
                {/* Street Address */}
                <div className="md:col-span-2 space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Street Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="streetAddress"
                    value={formData.streetAddress}
                    onChange={handleChange}
                    placeholder="Enter full street address"
                    rows="3"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors ${
                      errors.streetAddress ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.streetAddress && (
                    <p className="text-red-500 text-sm">{errors.streetAddress}</p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Wedding Services Selection Section */}
            <div className="mb-12">
              <div className="flex justify-between items-center mb-6 pb-2 border-b-2 border-amber-200">
                <h3 className="text-2xl font-bold text-amber-800">
                  Wedding Services Selection
                </h3>
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="px-4 py-2 text-sm bg-amber-100 text-amber-800 rounded-lg hover:bg-amber-200 transition-colors font-medium"
                >
                  {formData.selectedServices.length === weddingServices.length 
                    ? 'Deselect All' 
                    : 'Select All'}
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {/* First Column */}
                <div className="space-y-4">
                  {weddingServices.slice(0, 4).map(service => (
                    <div 
                      key={service.name}
                      className={`flex items-center p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer hover:border-amber-400 hover:bg-amber-50 ${
                        formData.selectedServices.includes(service.name)
                          ? 'border-amber-500 bg-amber-50'
                          : 'border-gray-200 bg-white'
                      }`}
                      onClick={() => handleServiceChange(service.name)}
                    >
                      <div className="flex items-center h-5">
                        <input
                          type="checkbox"
                          id={`service-${service.name}`}
                          checked={formData.selectedServices.includes(service.name)}
                          onChange={() => handleServiceChange(service.name)}
                          className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500 focus:ring-2 cursor-pointer"
                        />
                      </div>
                      <label htmlFor={`service-${service.name}`} className="ml-3 w-full cursor-pointer">
                        <div className="font-medium text-gray-900">{service.name}</div>
                        <div className="text-sm text-gray-500">{service.description}</div>
                      </label>
                    </div>
                  ))}
                </div>
                
                {/* Second Column */}
                <div className="space-y-4">
                  {weddingServices.slice(4, 7).map(service => (
                    <div 
                      key={service.name}
                      className={`flex items-center p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer hover:border-amber-400 hover:bg-amber-50 ${
                        formData.selectedServices.includes(service.name)
                          ? 'border-amber-500 bg-amber-50'
                          : 'border-gray-200 bg-white'
                      }`}
                      onClick={() => handleServiceChange(service.name)}
                    >
                      <div className="flex items-center h-5">
                        <input
                          type="checkbox"
                          id={`service-${service.name}`}
                          checked={formData.selectedServices.includes(service.name)}
                          onChange={() => handleServiceChange(service.name)}
                          className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500 focus:ring-2 cursor-pointer"
                        />
                      </div>
                      <label htmlFor={`service-${service.name}`} className="ml-3 w-full cursor-pointer">
                        <div className="font-medium text-gray-900">{service.name}</div>
                        <div className="text-sm text-gray-500">{service.description}</div>
                      </label>
                    </div>
                  ))}
                </div>
                
                {/* Third Column */}
                <div className="space-y-4">
                  {weddingServices.slice(7, 10).map(service => (
                    <div 
                      key={service.name}
                      className={`flex items-center p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer hover:border-amber-400 hover:bg-amber-50 ${
                        formData.selectedServices.includes(service.name)
                          ? 'border-amber-500 bg-amber-50'
                          : 'border-gray-200 bg-white'
                      }`}
                      onClick={() => handleServiceChange(service.name)}
                    >
                      <div className="flex items-center h-5">
                        <input
                          type="checkbox"
                          id={`service-${service.name}`}
                          checked={formData.selectedServices.includes(service.name)}
                          onChange={() => handleServiceChange(service.name)}
                          className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500 focus:ring-2 cursor-pointer"
                        />
                      </div>
                      <label htmlFor={`service-${service.name}`} className="ml-3 w-full cursor-pointer">
                        <div className="font-medium text-gray-900">{service.name}</div>
                        <div className="text-sm text-gray-500">{service.description}</div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
                <p className="text-sm text-amber-800 font-medium">
                  Selected Services: {formData.selectedServices.length > 0 
                    ? formData.selectedServices.join(', ') 
                    : 'No services selected'}
                </p>
              </div>
            </div>
            
            {/* Submit Button */}
            <div className="mt-10 pt-6 border-t border-amber-200">
              <button
                type="submit"
                disabled={isSubmitting || isChecking}
                className="w-full bg-gradient-to-r from-amber-600 to-amber-700 text-white py-4 px-6 rounded-lg font-bold text-lg hover:from-amber-700 hover:to-amber-800 focus:ring-4 focus:ring-amber-300 focus:outline-none transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  'Submit Form & Proceed'
                )}
              </button>
              
              <p className="text-center text-gray-500 text-sm mt-4">
                By submitting, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserForm;