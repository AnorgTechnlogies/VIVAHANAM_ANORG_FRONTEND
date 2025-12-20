// line no 74 m4 "F" use kiya hu pehle "f" tha 
import React, { useState, useEffect } from "react";
import { Heart, Search, Calendar, User, ArrowLeft, Loader } from "lucide-react";

const categories = [
  "All Categories",
  "Relationship Tips",
  "Dating & Communication",
  "Wedding Planning",
  "Family & Culture",
  "Success Stories",
  "Safety & Platform Tips"
];

export default function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [blogLoading, setBlogLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const API_URL = import.meta.env.VITE_API_KEY;

  // Auto-scroll to top and trigger animations when component mounts
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
    
    // Delay to trigger animations after page load
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Fetch all blogs from backend
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`${API_URL}/admin/blogs/public`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch blogs: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.success) {
          setBlogs(result.data || []);
        } else {
          throw new Error(result.message || "Failed to load blogs");
        }
      } catch (err) {
        console.error("Error fetching blogs:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [API_URL]);

  // Fetch single blog by slug
  const FetchBlogBySlug = async (slug) => {
    try {
      setBlogLoading(true);
      setError(null);
      
      const response = await fetch(`${API_URL}/blogs/public/${slug}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch blog: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        setSelectedBlog(result.data);
      } else {
        throw new Error(result.message || "Failed to load blog");
      }
    } catch (err) {
      console.error("Error fetching blog:", err);
      setError(err.message);
      setSelectedBlog(null);
    } finally {
      setBlogLoading(false);
    }
  };

  const handleBlogClick = (blog) => {
    setSelectedBlog(blog);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToList = () => {
    setSelectedBlog(null);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch =
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All Categories" || 
      (blog.category && blog.category === selectedCategory);
    return matchesSearch && matchesCategory;
  });

  const formatDate = (dateString) => {
    if (!dateString) return "Recent";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (selectedBlog) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white px-4 sm:px-6 lg:px-8 mt-20 py-10 transition-all duration-500">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={handleBackToList}
            className="mb-8 text-amber-700 hover:text-amber-900 font-semibold flex items-center gap-2 transition-all duration-300 hover:gap-3 group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform duration-300" />
            <span>Back to Blog List</span>
          </button>

          {blogLoading ? (
            <div className="bg-white rounded-2xl shadow-xl p-12 text-center transform transition-all duration-500">
              <Loader className="w-12 h-12 text-amber-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-600 animate-pulse">Loading blog post...</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-amber-200 transition-all duration-500 hover:shadow-2xl">
              {selectedBlog.image && (
                <div className="overflow-hidden">
                  <img
                    src={selectedBlog.image}
                    alt={selectedBlog.title}
                    className="w-full h-64 sm:h-80 md:h-96 object-cover transition-transform duration-700 hover:scale-105"
                  />
                </div>
              )}
              <div className="p-6 sm:p-8 md:p-10">
                {selectedBlog.category && (
                  <span className="bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 px-4 py-2 rounded-full text-sm font-semibold inline-block mb-4 transition-all duration-300 hover:scale-105">
                    {selectedBlog.category}
                  </span>
                )}
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-2 mb-6 text-gray-900 leading-tight">
                  {selectedBlog.title}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-8 text-sm sm:text-base">
                  <div className="flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-full">
                    <User size={16} className="text-amber-600" />
                    <span className="font-medium">By {selectedBlog.author || "Admin"}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-full">
                    <Calendar size={16} className="text-amber-600" />
                    <span className="font-medium">{formatDate(selectedBlog.date)}</span>
                  </div>
                </div>
                <div className="text-gray-700 text-base sm:text-lg leading-relaxed prose max-w-none space-y-6">
                  {selectedBlog.description && selectedBlog.description.split('\n').map((paragraph, index) => (
                    <p key={index} className="transition-all duration-500 hover:text-gray-800">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex items-center justify-center transition-all duration-500">
        <div className="text-center">
          <div className="relative">
            <Loader className="w-16 h-16 text-amber-600 animate-spin mx-auto mb-4" />
            <Heart className="w-8 h-8 text-amber-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
          </div>
          <p className="text-gray-600 text-lg font-medium animate-pulse">Loading wonderful blogs for you...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex items-center justify-center transition-all duration-500">
        <div className="text-center max-w-md mx-4">
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 text-amber-800 px-8 py-6 rounded-2xl mb-6 shadow-lg">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-amber-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Oops! Something went wrong</h3>
            <p className="text-amber-700">{error}</p>
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="px-8 py-3 bg-gradient-to-r from-amber-600 to-orange-500 text-white rounded-full hover:from-amber-700 hover:to-orange-600 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-amber-50 to-white flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 py-15 sm:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto text-center py-8">
          {/* Expert Wedding Advice with Animation */}
          <div className={`inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-sm font-semibold mb-6 transition-all duration-1000 ${
            isVisible
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 -translate-y-10 scale-95"
          }`}>
            <Heart size={26} className="text-amber-600" />
            <span>Expert Wedding Advice</span>
          </div>
          
          {/* Wedding Blog & Advice with Animation */}
          <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-serif font-semi-bold text-gray-900 mb-4 sm:mb-6 leading-tight transition-all duration-1000 delay-200 ${
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-10"
          }`}>
            Wedding <span className="text-red-600 italic">Blog</span> & Advice
          </h1>
          
          {/* Your Guide to Love, Marriage & Matchmaking with Animation */}
          <h2 className={`text-2xl sm:text-3xl font-semibold text-gray-800 mb-8 transition-all duration-1000 delay-400 ${
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-10"
          }`}>
            Your Guide to Love, Marriage & Matchmaking
          </h2>
          
          {/* Search & Filter */}
          <div className="max-w-3xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 w-full">
              {/* Search Input */}
              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-amber-200 rounded-xl focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 bg-white/80 backdrop-blur-sm text-gray-700 transition-all duration-300"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-amber-400 w-5 h-5" />
              </div>
              
              {/* All Categories with Animation */}
              <div className={`transition-all duration-1000 delay-600 ${
                isVisible
                  ? "opacity-100 translate-y-0 scale-100"
                  : "opacity-0 translate-y-10 scale-95"
              }`}>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="border-2 border-amber-200 px-6 py-3 rounded-xl w-full sm:w-auto focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 bg-white/80 backdrop-blur-sm text-gray-700 transition-all duration-300 appearance-none cursor-pointer"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-1 mb-5 flex-1">
        {/* All Articles with Animation */}
        <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4 transition-all duration-1000 delay-800 ${
          isVisible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10"
        }`}>
          <div>
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {selectedCategory === "All Categories" ? "All Articles" : selectedCategory}
            </h3>
            <p className="text-gray-600 mt-2">Discover insightful articles for your wedding journey</p>
          </div>
          <span className="bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-sm font-semibold">
            {filteredBlogs.length} {filteredBlogs.length === 1 ? 'article' : 'articles'} found
          </span>
        </div>

        {filteredBlogs.length === 0 ? (
          <div className="text-center py-16 bg-gradient-to-br from-white to-amber-50 rounded-2xl shadow-lg border border-amber-200">
            <div className="w-24 h-24 bg-gradient-to-r from-amber-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-amber-400" />
            </div>
            <p className="text-xl sm:text-2xl font-semibold text-gray-700 mb-3">
              No articles found
            </p>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              {searchTerm || selectedCategory !== "All Categories" 
                ? "Try adjusting your search or filter criteria."
                : "No blogs have been published yet. Check back soon!"}
            </p>
            {(searchTerm || selectedCategory !== "All Categories") && (
              <button 
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("All Categories");
                }}
                className="px-6 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-full hover:from-amber-600 hover:to-amber-700 transition-all duration-300 font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBlogs.map((blog, index) => (
              <div
                key={blog._id}
                className="group relative"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div
                  className="bg-white rounded-2xl shadow-lg overflow-hidden h-full flex flex-col border border-amber-200 hover:border-amber-300 cursor-pointer transition-all duration-500 hover:shadow-2xl hover:-translate-y-2"
                  onClick={() => handleBlogClick(blog)}
                >
                  {/* Image Container */}
                  <div className="relative overflow-hidden h-56">
                    {blog.image ? (
                      <img
                        src={blog.image}
                        alt={blog.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                        <Heart className="w-16 h-16 text-amber-300 group-hover:text-amber-400 transition-colors duration-300" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute top-4 left-4">
                      {blog.category && (
                        <span className="bg-white/90 backdrop-blur-sm text-amber-800 px-3 py-1 rounded-full text-xs font-semibold">
                          {blog.category}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-grow">
                    <h4 className="text-xl font-bold text-gray-900 line-clamp-2 mb-3 group-hover:text-amber-700 transition-colors duration-300">
                      {blog.title}
                    </h4>
                    <div className="flex items-center gap-3 text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-1">
                        <User size={14} className="text-amber-500" />
                        <span className="font-medium">{blog.author || "Admin"}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar size={14} className="text-amber-500" />
                        <span className="font-medium">{formatDate(blog.date)}</span>
                      </div>
                    </div>
                    <p className="text-gray-600 line-clamp-3 flex-grow mb-6">
                      {blog.description}
                    </p>
                    <div className="mt-auto">
                      <button className="w-full bg-red-600 to-amber-600 text-white px-6 py-3 rounded-xl hover:from-amber-600 hover:to-amber-700 transition-all duration-300 font-semibold shadow-md hover:shadow-lg group-hover:shadow-xl">
                        Read More
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}