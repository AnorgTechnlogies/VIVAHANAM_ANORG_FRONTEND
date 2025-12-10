import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate, useLocation } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_KEY;

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

  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    mobileNumber: '',
    userType: '',
    gender: '',
    motherTongue: '',
    religion: '',
    country: '',
    state: '',
    city: '',
    postalCode: '',
    streetAddress: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const validateForm = () => {
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
    if (formData.mobileNumber && !/^\d{10}$/.test(formData.mobileNumber)) {
      newErrors.mobileNumber = 'Must be a valid 10-digit number';
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
    
    if (!validateForm()) {
      toast.error('Please fix all errors before submitting');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await axios.post(`${API_URL}/user/Weddinguser-form`, formData);
      
      if (response.data.success) {
        toast.success('Form submitted successfully!');
        
        // Get the selected plan from location state
        const selectedPlan = location.state?.selectedPlan;
        
        // Navigate back to subscription plans with formSubmitted flag
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
      
      if (error.response?.data?.errors) {
        error.response.data.errors.forEach(err => toast.error(err));
      } else {
        toast.error(error.response?.data?.message || 'Error submitting form');
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
                    What's App Number <span className="text-red-500">*</span>
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
                
                {/* Mother Tongue Dropdown */}
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
                    
                    {/* Indian Languages Group */}
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
                    
                    {/* International Languages Group */}
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
                    
                    {/* Other Option */}
                    <option value="other_language">Other (Please specify in notes)</option>
                  </select>
                  {errors.motherTongue && (
                    <p className="text-red-500 text-sm">{errors.motherTongue}</p>
                  )}
                </div>
                
                {/* Religion Dropdown */}
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
                    
                    {/* Indian Religions Group */}
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
                    
                    {/* International Religions Group */}
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
                    
                    {/* Other Categories Group */}
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
            <div>
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
                    placeholder="Select your state"
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
                    Postal / Zip Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    placeholder="Enter postal / zip code"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors ${
                      errors.postalCode ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.postalCode && (
                    <p className="text-red-500 text-sm">{errors.postalCode}</p>
                  )}
                  <p className="text-sm text-gray-500">
                    Enter postal code to auto-fill location
                  </p>
                </div>
                
                {/* Street Address (Full width) */}
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
            
            {/* Submit Button */}
            <div className="mt-10 pt-6 border-t border-amber-200">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-amber-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-amber-700 focus:ring-4 focus:ring-amber-300 focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Form'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserForm;