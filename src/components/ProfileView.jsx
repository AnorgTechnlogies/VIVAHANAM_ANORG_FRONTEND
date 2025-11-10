import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Phone, MapPin, Calendar, User, Briefcase, Heart, Star } from "lucide-react";

const ProfileView = () => {
  const { vivId } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // FIXED: Proper API URL with fallback
  const API_URL = import.meta.env.VITE_API_KEY || "http://localhost:8000";

  useEffect(() => {
    if (vivId && vivId !== 'undefined') {
      fetchProfile();
    } else {
      setError("Invalid profile ID");
      setLoading(false);
    }
  }, [vivId]);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('vivahanamToken');
      
      if (!token) {
        throw new Error("Please login to view profiles");
      }

      if (!vivId || vivId === 'undefined') {
        throw new Error("Invalid profile ID");
      }

      console.log('Fetching profile for VIV ID:', vivId);
      console.log('Making request to:', `${API_URL}/user/profile/${vivId}`);
      
      const response = await fetch(`${API_URL}/ap=/user/profile/${vivId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Profile response status:', response.status);

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Please login again");
        }
        if (response.status === 404) {
          throw new Error("Profile not found");
        }
        const errorData = await response.json().catch(() => ({ message: 'Failed to fetch profile' }));
        throw new Error(errorData.message || `Failed to fetch profile: ${response.status}`);
      }

      const data = await response.json();
      console.log('Profile data received:', data);
      
      setProfile(data.user);
    } catch (err) {
      console.error('Profile fetch error:', err);
      setError(err.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
            <span className="ml-4 text-gray-600">Loading profile...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <div className="text-red-600 text-lg font-semibold mb-2">Error</div>
            <p className="text-red-700 mb-4">{error}</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => navigate(-1)}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Go Back
              </button>
              {error.includes('login') && (
                <button
                  onClick={() => navigate('/login')}
                  className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <User className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Profile Not Found</h3>
            <p className="text-gray-600">The profile you're looking for doesn't exist.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="h-6 w-6 text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Profile Details</h1>
            <p className="text-gray-600">Viewing profile of {profile.name}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
          <div className="h-48 bg-gradient-to-r from-amber-400 to-amber-600 relative">
            <div className="absolute -bottom-16 left-8">
              <div className="w-32 h-32 bg-white rounded-full p-2 shadow-xl">
                <div className="w-full h-full bg-amber-100 rounded-full flex items-center justify-center border-4 border-white">
                  {profile.profileImage ? (
                    <img 
                      src={profile.profileImage} 
                      alt={profile.name} 
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-12 w-12 text-amber-600" />
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-20 px-8 pb-8">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{profile.name}</h2>
                <p className="text-amber-600 font-semibold text-lg">{profile.vivId}</p>
                <div className="flex items-center gap-4 mt-2 text-gray-600">
                  {profile.age && <span>{profile.age} years</span>}
                  {profile.city && <span>• {profile.city}, {profile.state}</span>}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Personal Information */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 border-b pb-2 flex items-center gap-2">
                  <User className="h-5 w-5 text-amber-600" />
                  Personal Information
                </h3>
                
                <div className="space-y-4">
                  {profile.gender && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Gender</span>
                      <span className="font-medium capitalize">{profile.gender}</span>
                    </div>
                  )}
                  
                  {profile.dateOfBirth && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date of Birth</span>
                      <span className="font-medium">{new Date(profile.dateOfBirth).toLocaleDateString()}</span>
                    </div>
                  )}
                  
                  {profile.religion && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Religion</span>
                      <span className="font-medium">{profile.religion}</span>
                    </div>
                  )}
                  
                  {profile.motherTongue && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Mother Tongue</span>
                      <span className="font-medium">{profile.motherTongue}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Professional Information */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 border-b pb-2 flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-amber-600" />
                  Professional Information
                </h3>
                
                <div className="space-y-4">
                  {profile.educationLevel && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Education</span>
                      <span className="font-medium">{profile.educationLevel}</span>
                    </div>
                  )}
                  
                  {profile.occupation && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Occupation</span>
                      <span className="font-medium">{profile.occupation}</span>
                    </div>
                  )}
                  
                  {profile.annualIncome && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Annual Income</span>
                      <span className="font-medium">{profile.annualIncome}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* About Me */}
            {profile.profileBio && (
              <div className="mt-8 space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 border-b pb-2 flex items-center gap-2">
                  <Heart className="h-5 w-5 text-amber-600" />
                  About Me
                </h3>
                <p className="text-gray-700 leading-relaxed">{profile.profileBio}</p>
              </div>
            )}

            {/* Hobbies */}
            {profile.hobbies && profile.hobbies.length > 0 && (
              <div className="mt-8 space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 border-b pb-2 flex items-center gap-2">
                  <Star className="h-5 w-5 text-amber-600" />
                  Hobbies & Interests
                </h3>
                <div className="flex flex-wrap gap-2">
                  {profile.hobbies.map((hobby, index) => (
                    <span key={index} className="px-3 py-2 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">
                      {hobby}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;