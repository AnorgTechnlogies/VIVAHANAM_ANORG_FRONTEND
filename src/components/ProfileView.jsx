import React, { useState, useEffect } from 'react';
import { User, MapPin, Briefcase, Heart, Users, Star, Eye, Calendar, Phone, Mail } from 'lucide-react';

const ProfileView = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('personal');

  const API_URL = import.meta.env.VITE_API_KEY;

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('vivahanamToken');
      if (!token) {
        throw new Error('No authentication token found. Please log in.');
      }

      const response = await fetch(`${API_URL}/user/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
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

  const formatDate = (date) => {
    if (!date) return 'Not provided';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const InfoItem = ({ label, value, icon: Icon }) => (
    <div className="mb-4">
      <div className="flex items-start gap-2">
        {Icon && <Icon className="w-5 h-5 text-rose-500 mt-0.5 flex-shrink-0" />}
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-500 mb-1 truncate">{label}</p>
          <p className="text-gray-900 font-medium break-words">
            {value || 'Not provided'}
          </p>
        </div>
      </div>
    </div>
  );

  const Section = ({ title, children }) => (
    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6">
      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 border-b pb-2">
        {title}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-x-8">
        {children}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-amber-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-amber-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 max-w-md w-full">
          <div className="text-red-500 text-center mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 text-center mb-2">Error Loading Profile</h2>
          <p className="text-gray-600 text-center mb-4">{error}</p>
          <button
            onClick={fetchUserInfo}
            className="w-full bg-rose-500 text-white py-2 px-4 rounded-lg hover:bg-rose-600 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'education', label: 'Education & Career', icon: Briefcase },
    { id: 'location', label: 'Location', icon: MapPin },
    { id: 'family', label: 'Family', icon: Users },
    { id: 'preferences', label: 'Partner Preferences', icon: Heart },
    { id: 'astro', label: 'Astro & Cultural', icon: Star }
  ];

  return (
    <div className="min-h-screen bg-amber-100 py-4 sm:py-8  ">
      <div className="max-w-6xl mx-auto px-4 sm:px-4 mt-28">
        {/* Profile Header - UPDATED: White background, black text */}
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-8 mb-6 text-gray-900">
          <div className="flex flex-col sm:flex-row items-center sm:items-center gap-4 sm:gap-6">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
              {user.profileImage ? (
                <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <User className="w-10 h-10 sm:w-12 sm:h-12 text-rose-500" />
              )}
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-gray-900">
                {user.name || `${user.firstName} ${user.lastName}`.trim() || 'User Profile'}
              </h1>
              <div className="flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-4 text-gray-700 text-sm sm:text-base">
                <span className="flex items-center gap-1 justify-center sm:justify-start">
                  <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-rose-500" />
                  {user.email}
                </span>
                {user.vivId && (
                  <span className="bg-gray-100 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm text-gray-700">
                    ID: {user.vivId}
                  </span>
                )}
                {user.isVerified && (
                  <span className="bg-green-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm">
                    ✓ Verified
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6 p-2 overflow-x-auto">
          <div className="flex gap-1 sm:gap-2 min-w-max">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 rounded-lg transition text-xs sm:text-sm ${
                    activeTab === tab.id
                      ? 'bg-rose-500 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span className="whitespace-nowrap">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Personal Info Tab */}
        {activeTab === 'personal' && (
          <>
            <Section title="Basic Information">
              <InfoItem label="Full Name" value={`${user.firstName || ''} ${user.middleName || ''} ${user.lastName || ''}`.trim()} />
              <InfoItem label="Mobile Number" value={user.mobileNo} icon={Phone} />
              <InfoItem label="Email" value={user.email} icon={Mail} />
              <InfoItem label="Gender" value={user.gender} />
              <InfoItem label="Date of Birth" value={formatDate(user.dateOfBirth)} icon={Calendar} />
              <InfoItem label="Marital Status" value={user.maritalStatus} />
              <InfoItem label="Height" value={user.height ? `${user.height} cm` : null} />
              <InfoItem label="Physical Status" value={user.physicalStatus} />
            </Section>

            <Section title="Cultural & Religious">
              <InfoItem label="Religion" value={user.religion} />
              <InfoItem label="Mother Tongue" value={user.motherTongue} />
              <InfoItem label="Resident Country" value={user.residentCountry} />
              <InfoItem label="User Type" value={user.userType} />
            </Section>

            <Section title="Lifestyle">
              <div className="col-span-full md:col-span-2">
                <InfoItem label="Profile Bio" value={user.profileBio} />
              </div>
              <InfoItem 
                label="Hobbies" 
                value={user.hobbies?.length ? user.hobbies.join(', ') : 'Not provided'} 
              />
              <InfoItem 
                label="Languages" 
                value={user.languages?.length ? user.languages.join(', ') : 'Not provided'} 
              />
            </Section>
          </>
        )}

        {/* Education & Career Tab */}
        {activeTab === 'education' && (
          <Section title="Education & Career">
            <InfoItem label="Education Level" value={user.educationLevel} />
            <InfoItem label="Field of Study" value={user.fieldOfStudy} />
            <InfoItem label="Occupation" value={user.occupation} icon={Briefcase} />
            <InfoItem label="Employer" value={user.employer} />
            <InfoItem label="Annual Income" value={user.annualIncome} />
          </Section>
        )}

        {/* Location Tab */}
        {activeTab === 'location' && (
          <Section title="Location Details">
            <InfoItem label="Country" value={user.country} icon={MapPin} />
            <InfoItem label="State" value={user.state} />
            <InfoItem label="District" value={user.district} />
            <InfoItem label="City" value={user.city} />
            <InfoItem label="Current City" value={user.currentCity} />
            <InfoItem label="Native Place" value={user.nativePlace} />
            <InfoItem label="Street Address" value={user.streetAddress} />
            <InfoItem label="Address Line 2" value={user.addressLine2} />
            <InfoItem label="Zip Code" value={user.zipCode} />
            <InfoItem label="Citizenship Status" value={user.citizenshipStatus} />
          </Section>
        )}

        {/* Family Tab */}
        {activeTab === 'family' && (
          <>
            <Section title="Family Information">
              <InfoItem label="Family Type" value={user.familyType} />
              <InfoItem label="Family Status" value={user.familyStatus} />
              <InfoItem label="Number of Brothers" value={user.numBrothers} />
              <InfoItem label="Number of Sisters" value={user.numSisters} />
              <InfoItem label="Siblings Marital Status" value={user.siblingsMaritalStatus} />
              <InfoItem label="Family Background" value={user.familyBackground} />
            </Section>

            <Section title="Parents Information">
              <InfoItem label="Father's Name" value={user.fatherName} />
              <InfoItem label="Father's Occupation" value={user.fatherOccupation} />
              <InfoItem label="Father's Status" value={user.fatherStatus} />
              <InfoItem label="Mother's Name" value={user.motherName} />
              <InfoItem label="Mother's Occupation" value={user.motherOccupation} />
              <InfoItem label="Mother's Status" value={user.motherStatus} />
            </Section>

            {user.aboutFamily && (
              <Section title="About Family">
                <div className="col-span-full md:col-span-2">
                  <p className="text-gray-900">{user.aboutFamily}</p>
                </div>
              </Section>
            )}
          </>
        )}

        {/* Partner Preferences Tab */}
        {activeTab === 'preferences' && (
          <Section title="Partner Preferences">
            <InfoItem 
              label="Age Range" 
              value={user.partnerPreferences?.ageRange?.min && user.partnerPreferences?.ageRange?.max
                ? `${user.partnerPreferences.ageRange.min} - ${user.partnerPreferences.ageRange.max} years`
                : 'Not specified'
              } 
            />
            <InfoItem 
              label="Income Range" 
              value={user.partnerPreferences?.incomeRange?.min && user.partnerPreferences?.incomeRange?.max
                ? `${user.partnerPreferences.incomeRange.min} - ${user.partnerPreferences.incomeRange.max}`
                : 'Not specified'
              } 
            />
            <InfoItem 
              label="Height Range" 
              value={user.partnerPreferences?.preferredHeight?.min && user.partnerPreferences?.preferredHeight?.max
                ? `${user.partnerPreferences.preferredHeight.min} - ${user.partnerPreferences.preferredHeight.max} cm`
                : 'Not specified'
              } 
            />
            <InfoItem 
              label="Preferred Religion" 
              value={user.partnerPreferences?.preferredReligion?.length 
                ? user.partnerPreferences.preferredReligion.join(', ') 
                : 'Not specified'
              } 
            />
            <InfoItem 
              label="Preferred Mother Tongue" 
              value={user.partnerPreferences?.preferredMotherTongue?.length 
                ? user.partnerPreferences.preferredMotherTongue.join(', ') 
                : 'Not specified'
              } 
            />
            <InfoItem 
              label="Preferred Education" 
              value={user.partnerPreferences?.preferredEducation?.length 
                ? user.partnerPreferences.preferredEducation.join(', ') 
                : 'Not specified'
              } 
            />
            <InfoItem 
              label="Preferred Occupation" 
              value={user.partnerPreferences?.preferredOccupation?.length 
                ? user.partnerPreferences.preferredOccupation.join(', ') 
                : 'Not specified'
              } 
            />
            <InfoItem 
              label="Preferred Location" 
              value={user.partnerPreferences?.preferredLocation?.length 
                ? user.partnerPreferences.preferredLocation.join(', ') 
                : 'Not specified'
              } 
            />
            <InfoItem 
              label="Preferred Languages" 
              value={user.partnerPreferences?.preferredLanguages?.length 
                ? user.partnerPreferences.preferredLanguages.join(', ') 
                : 'Not specified'
              } 
            />
            <InfoItem 
              label="Cultural Background" 
              value={user.partnerPreferences?.culturalBackground?.length 
                ? user.partnerPreferences.culturalBackground.join(', ') 
                : 'Not specified'
              } 
            />
            <InfoItem 
              label="Preferred Caste" 
              value={user.partnerPreferences?.preferredCaste?.length 
                ? user.partnerPreferences.preferredCaste.join(', ') 
                : 'Not specified'
              } 
            />
          </Section>
        )}

        {/* Astro & Cultural Tab */}
        {activeTab === 'astro' && (
          <Section title="Astrological & Cultural Details">
            <InfoItem label="Birth Time" value={user.birthTime} />
            <InfoItem label="Place of Birth" value={user.placeOfBirth} />
            <InfoItem label="Zodiac Sign" value={user.zodiacSign} icon={Star} />
            <InfoItem label="Gotra" value={user.gotra} />
          </Section>
        )}

        {/* Privacy Settings */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 border-b pb-2 flex items-center gap-2">
            <Eye className="w-5 h-5 text-rose-500" />
            Privacy Settings
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg">
              <span className="text-gray-700 text-sm sm:text-base">Show Email</span>
              <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm ${user.showEmail ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {user.showEmail ? 'Yes' : 'No'}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg">
              <span className="text-gray-700 text-sm sm:text-base">Show Mobile</span>
              <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm ${user.showMobile ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {user.showMobile ? 'Yes' : 'No'}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg">
              <span className="text-gray-700 text-sm sm:text-base">Profile Visibility</span>
              <span className="px-2 sm:px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs sm:text-sm">
                {user.profileVisibility}
              </span>
            </div>
          </div>
        </div>

        {/* Account Info */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 border-b pb-2">
            Account Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoItem label="Account Created" value={formatDate(user.createdAt)} />
            <InfoItem label="Last Updated" value={formatDate(user.updatedAt)} />
            <InfoItem label="Profile Completed" value={user.profileCompleted ? 'Yes' : 'No'} />
            <InfoItem label="Role" value={user.role} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;