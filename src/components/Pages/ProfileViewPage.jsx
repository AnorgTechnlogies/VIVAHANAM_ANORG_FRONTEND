import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, MapPin, Briefcase, Heart, Star, Eye, Calendar, 
  Phone, Mail, RefreshCw, Edit3, Award, Clock, AlertTriangle, 
  Trash2 
} from 'lucide-react';

const ProfileView = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('general_basic_info');
  const [formFields, setFormFields] = useState([]);
  const [sections, setSections] = useState([]);
  
  // Delete Account States
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_KEY;

  useEffect(() => {
    fetchUserInfo();
    fetchFormConfig();
  }, []);

  const fetchFormConfig = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/form-fields/active`);
      if (response.ok) {
        const data = await response.json();
        setFormFields(data.fields || []);
        
        // Group fields by section
        const groupedSections = data.fields.reduce((acc, field) => {
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
      }
    } catch (error) {
      console.error("Error fetching form configuration:", error);
    }
  };

  const fetchUserInfo = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('vivahanamToken');
      if (!token) {
        throw new Error('Please log in.');
      }

      const response = await fetch(`${API_URL}/user/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch user info');
      }

      if (data.success) {
        setUser(data.user);
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle account deletion
  const handleDeleteAccount = async () => {
    try {
      setIsDeleting(true);
      setDeleteError(null);
      
      const token = localStorage.getItem('vivahanamToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_URL}/user/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete account');
      }

      // Success - clear token and redirect
      localStorage.removeItem('vivahanamToken');
      setShowDeleteModal(false);
      
      // Show success message before redirect
      alert('Your account has been permanently deleted.');
      
      // Redirect to login
      navigate('/');
      
    } catch (err) {
      console.error('Delete account error:', err);
      setDeleteError(err.message || 'Failed to delete account. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Function to format field names for display
  const formatFieldName = (fieldName) => {
    return fieldName
      .replace(/([A-Z])/g, ' $1')
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/^./, str => str.toUpperCase())
      .replace(/(min|max)/gi, (match) => match.toUpperCase())
      .replace(/Id/gi, 'ID');
  };

  // Function to format field values for display
  const formatFieldValue = (key, value) => {
    if (value === null || value === undefined || value === '') {
      return 'Not provided';
    }

    // Handle arrays
    if (Array.isArray(value)) {
      return value.length > 0 ? value.join(', ') : 'Not provided';
    }

    // Handle objects
    if (typeof value === 'object' && value !== null) {
      if (value.min !== undefined && value.max !== undefined) {
        return `${value.min} - ${value.max}`;
      }
      return JSON.stringify(value);
    }

    // Handle boolean values
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }

    // Handle dates
    if (key.includes('date') || key.includes('Date') || key.includes('created') || key.includes('updated')) {
      try {
        return new Date(value).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      } catch {
        return value;
      }
    }

    return value;
  };

  const InfoItem = ({ label, value, isEmpty }) => (
    <div className="mb-4">
      <div className="flex items-start gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-500 mb-1 truncate">{label}</p>
          <p className={`text-gray-900 font-medium break-words ${isEmpty ? 'text-gray-400 italic' : ''}`}>
            {value}
          </p>
        </div>
      </div>
    </div>
  );

  const Section = ({ title, children, icon: Icon, completion }) => (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6 border-b pb-2">
        <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          {Icon && <Icon className="w-5 h-5 text-amber-500" />}
          {title}
        </h3>
        {completion !== undefined && (
          <span className={`text-xs px-2 py-1 rounded-full ${
            completion === 100 
              ? 'bg-green-100 text-green-700' 
              : completion >= 50 
                ? 'bg-amber-100 text-amber-700'
                : 'bg-red-100 text-red-700'
          }`}>
            {completion}% Complete
          </span>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {children}
      </div>
    </div>
  );

  // Calculate completion for a section
  const calculateSectionCompletion = (sectionFields, userData) => {
    if (!userData) return 0;
    
    const sectionFieldNames = sectionFields.map(field => field.name);
    const filledFields = sectionFieldNames.filter(fieldName => 
      userData[fieldName] !== null && 
      userData[fieldName] !== undefined && 
      userData[fieldName] !== '' && 
      !(Array.isArray(userData[fieldName]) && userData[fieldName].length === 0)
    ).length;
    
    return sectionFieldNames.length > 0 ? Math.round((filledFields / sectionFieldNames.length) * 100) : 0;
  };

  // Calculate overall profile completion
  const calculateProfileCompletion = (userData) => {
    if (!userData || !formFields.length) return 0;
    
    const allFieldNames = formFields.map(field => field.name);
    const filledFields = allFieldNames.filter(fieldName => 
      userData[fieldName] !== null && 
      userData[fieldName] !== undefined && 
      userData[fieldName] !== '' && 
      !(Array.isArray(userData[fieldName]) && userData[fieldName].length === 0)
    ).length;
    
    return allFieldNames.length > 0 ? Math.round((filledFields / allFieldNames.length) * 100) : 0;
  };

  // Get icon for section
  const getSectionIcon = (section) => {
    const icons = {
      'general_basic_info': User,
      'religion_cultural': Star,
      'location_education': MapPin,
      'address_details': MapPin,
      'profile_personal': User,
      'partner_preferences': Heart,
      'privacy_settings': Eye
    };
    return icons[section] || User;
  };

  // Small Circle Progress Component
  const CircleProgress = ({ percentage, size = 80, strokeWidth = 6 }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    const getColor = (percent) => {
      if (percent >= 80) return '#10B981'; // green
      if (percent >= 60) return '#F59E0B'; // amber
      if (percent >= 40) return '#F97316'; // orange
      return '#EF4444'; // red
    };

    return (
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#E5E7EB"
            strokeWidth={strokeWidth}
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={getColor(percentage)}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-500 ease-out"
          />
        </svg>
        {/* Percentage text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900 leading-none">{percentage}%</div>
            <div className="text-[10px] text-gray-500 mt-0.5">Complete</div>
          </div>
        </div>
      </div>
    );
  };

  // Delete Account Modal Component
  const DeleteAccountModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Delete Account</h3>
              <p className="text-sm text-gray-500 mt-1">This action cannot be undone</p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          <p className="text-gray-700 mb-2">
            Are you sure you want to permanently delete your account?
          </p>
          <p className="text-sm text-gray-600 mb-4">
            All your profile data, matches, and preferences will be removed permanently. 
            This action cannot be reversed.
          </p>

          {/* Error Message */}
          {deleteError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{deleteError}</p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t flex justify-end gap-3">
          <button
            onClick={() => {
              setShowDeleteModal(false);
              setDeleteError(null);
            }}
            disabled={isDeleting}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleDeleteAccount}
            disabled={isDeleting}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeleting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                Yes, Delete My Account Permanently
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

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

  if (error) {
    return (
      <div className="min-h-screen bg-amber-50 pt-20">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="text-red-500 text-center mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 text-center mb-2">Something went wrong. Please try again later</h2>
            {/* <p className="text-gray-600 text-center mb-6">{error}</p> */}
            <button
              onClick={fetchUserInfo}
              className="bg-amber-500 text-white py-2 px-6 rounded-lg hover:bg-amber-600 transition flex items-center justify-center gap-2 mx-auto"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const profileCompletion = calculateProfileCompletion(user);

  const getDisplayName = () => {
    if (user.name) return user.name;
    if (user.firstName && user.lastName) return `${user.firstName} ${user.lastName}`;
    if (user.firstName) return user.firstName;
    return 'User Profile';
  };

  const getLastUpdated = () => {
    if (user.updatedAt) {
      return new Date(user.updatedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
    return 'Never';
  };

  return (
    <div className="min-h-screen bg-amber-50 pt-20">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
              {user.profileImage ? (
                <img src={user.profileImage} alt={getDisplayName()} className="w-full h-full object-cover" />
              ) : (
                <User className="w-12 h-12 text-amber-500" />
              )}
            </div>
            
            <div className="flex-1 text-center lg:text-left">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                    {getDisplayName()}
                  </h1>
                  <div className="flex flex-wrap items-center gap-3 text-gray-600">
                    {user.email && (
                      <span className="flex items-center gap-1 text-sm">
                        <Mail className="w-4 h-4" />
                        {user.email}
                      </span>
                    )}
                    {user.vivId && (
                      <span className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-700">
                        ID: {user.vivId}
                      </span>
                    )}
                  
                  </div>
                </div>
                
                {/* Small Circle Progress on the right */}
                <div className="flex items-center gap-4 mt-4 lg:mt-0">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-700">Profile Completion</p>
                   
                    {profileCompletion < 100 && (
                      <button
                        onClick={() => navigate('/update-profile')}
                        className="mt-2 bg-amber-500 hover:bg-amber-600 text-white text-xs px-3 py-1 rounded-full transition-colors"
                      >
                        Edit Profile
                      </button>
                    )}
                  </div>
                  <CircleProgress percentage={profileCompletion} size={80} strokeWidth={6} />
                </div>
              </div>
            </div>
          </div>

          {/* Status Badges */}
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
            {user.isVerified && (
              <span className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                <Award className="w-4 h-4" />
                Verified Profile
              </span>
            )}
         
            {user.maritalStatus && (
              <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
                {user.maritalStatus}
              </span>
            )}
            {user.age && (
              <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm">
                Age: {user.age}
              </span>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6 p-2 overflow-x-auto">
          <div className="flex gap-1 sm:gap-2 min-w-max">
            {sections.map(section => {
              const Icon = getSectionIcon(section.section);
              const completion = calculateSectionCompletion(section.fields, user);
              const filledFields = section.fields.filter(field => 
                user[field.name] && user[field.name] !== '' && 
                !(Array.isArray(user[field.name]) && user[field.name].length === 0)
              ).length;
              const totalFields = section.fields.length;
              
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
                  <Icon className="w-4 h-4 flex-shrink-0" />
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
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Tab Content */}
        {sections.map(section => {
          if (activeTab === section.section) {
            const Icon = getSectionIcon(section.section);
            const completion = calculateSectionCompletion(section.fields, user);
            
            return (
              <Section key={section.section} title={section.sectionTitle} icon={Icon} completion={completion}>
                {section.fields.map(field => {
                  const value = user[field.name];
                  const isEmpty = value === null || value === undefined || value === '' || 
                                 (Array.isArray(value) && value.length === 0);
                  return (
                    <InfoItem
                      key={field.name}
                      label={field.label}
                      value={formatFieldValue(field.name, value)}
                      isEmpty={isEmpty}
                    />
                  );
                })}
              </Section>
            );
          }
          return null;
        })}

        {/* Danger Zone Section */}
        <div className="mt-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-red-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-50 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Danger Zone</h3>
                <p className="text-sm text-gray-500">Irreversible actions</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600 mb-2">
                  Once deleted, this action cannot be undone. All profile data will be removed permanently.
                </p>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action for Incomplete Profiles */}
        {profileCompletion < 50 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center mt-6">
            <h3 className="text-lg font-semibold text-amber-800 mb-2">
              Boost Your Profile Visibility
            </h3>
            <p className="text-amber-700 mb-4">
              Complete more sections to increase your chances of finding perfect matches. Profiles with higher completion rates get 3x more views.
            </p>
            <button
              onClick={() => navigate('/update-profile')}
              className="bg-amber-500 text-white px-6 py-2 rounded-lg hover:bg-amber-600 transition-colors"
            >
              Complete Your Profile
            </button>
          </div>
        )}
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && <DeleteAccountModal />}
    </div>
  );
};

export default ProfileView;