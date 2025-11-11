import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Search, User, MapPin, Calendar, Briefcase, GraduationCap } from "lucide-react";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const vivId = searchParams.get('vivId');
  
  // FIXED: Proper API URL with fallback
  const API_URL = import.meta.env.VITE_API_KEY ;

  useEffect(() => {
    if (vivId) {
      searchProfiles();
    }
  }, [vivId]);

  const searchProfiles = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem('vivahanamToken');
      
      if (!token) {
        throw new Error("Please login to search profiles");
      }

      console.log('Making request to:', `${API_URL}/user/search?vivId=${vivId}`);
      
      const response = await fetch(`${API_URL}/user/search?vivId=${vivId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Please login again");
        }
        const errorData = await response.json().catch(() => ({ message: 'Search failed' }));
        throw new Error(errorData.message || `Search failed: ${response.status}`);
      }

      const data = await response.json();
      console.log('Search results:', data);
      
      setResults(data.users || []);
      
    } catch (err) {
      console.error('Search error:', err);
      setError(err.message || 'Failed to search profiles');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewProfile = (profileVivId) => {
    if (!profileVivId || profileVivId === 'undefined') {
      setError("Invalid profile ID");
      return;
    }
    navigate(`/profile/${profileVivId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
            <span className="ml-4 text-gray-600">Searching profiles...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Search Results</h1>
          <p className="text-gray-600">
            {results.length > 0 
              ? `Found ${results.length} profile${results.length > 1 ? 's' : ''} for "${vivId}"`
              : `No profiles found for "${vivId}"`
            }
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
            <strong>Error:</strong> {error}
            <button 
              onClick={() => navigate('/login')}
              className="ml-4 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
            >
              Login Again
            </button>
          </div>
        )}

        {/* Results Grid */}
        {results.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((profile) => (
              <div key={profile._id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                      {profile.profileImage ? (
                        <img 
                          src={profile.profileImage} 
                          alt={profile.name} 
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <User className="h-8 w-8 text-amber-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 text-lg">{profile.name}</h3>
                      <p className="text-amber-600 font-semibold text-sm">{profile.vivId}</p>
                      <p className="text-gray-500 text-sm capitalize">{profile.gender}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {profile.age && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>{profile.age} years</span>
                      </div>
                    )}
                    {(profile.city || profile.state) && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span>{[profile.city, profile.state].filter(Boolean).join(', ')}</span>
                      </div>
                    )}
                    {profile.educationLevel && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <GraduationCap className="h-4 w-4" />
                        <span className="truncate">{profile.educationLevel}</span>
                      </div>
                    )}
                    {profile.occupation && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Briefcase className="h-4 w-4" />
                        <span className="truncate">{profile.occupation}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-4">
                  <button 
                    onClick={() => handleViewProfile(profile.vivId)}
                    className="w-full px-4 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    View Full Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          !error && (
            <div className="text-center py-12">
              <Search className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No profiles found</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                No profiles were found matching your search for "<strong>{vivId}</strong>". 
                Please check the VIV ID and try again.
              </p>
            </div>
          )
        )}

        <div className="text-center mt-8">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
          >
            Back to Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;