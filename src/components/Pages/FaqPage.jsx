import React, { useState, useEffect } from "react";
import { Plus, Minus, Search, MessageCircle, Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";

const FAQ = () => {
  const [openId, setOpenId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_KEY;

  // Fetch FAQs from backend
  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Use the public endpoint - CORRECTED
        const response = await fetch(`${API_URL}/admin/faqs/public`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch FAQs: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.success) {
          // Add sequential IDs for animation and display
          const faqsWithDisplayIds = result.data.map((faq, index) => ({
            ...faq,
            displayId: index + 1
          }));
          setFaqs(faqsWithDisplayIds);
        } else {
          throw new Error(result.message || "Failed to load FAQs");
        }
      } catch (err) {
        console.error("Error fetching FAQs:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFaqs();
  }, [API_URL]);

  const toggleFaq = (id) => {
    setOpenId(openId === id ? null : id);
  };

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Function to get stagger class for animation
  const getStaggerClass = (index) => {
    const staggerNumber = (index % 12) + 1;
    return `stagger-${staggerNumber}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="text-center animate-fadeInUp">
          <Loader className="w-12 h-12 text-orange-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading FAQs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="text-center animate-fadeInUp max-w-md">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <MessageCircle className="text-red-500" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-full hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 py-16 px-4 sm:px-6 lg:px-8">
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideDown {
          from {
            opacity: 0;
            max-height: 0;
          }
          to {
            opacity: 1;
            max-height: 500px;
          }
        }
        
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        
        .animate-slideDown {
          animation: slideDown 0.3s ease-out forwards;
        }
        
        .animate-scaleIn {
          animation: scaleIn 0.4s ease-out forwards;
        }
        
        .stagger-1 { animation-delay: 0.1s; }
        .stagger-2 { animation-delay: 0.2s; }
        .stagger-3 { animation-delay: 0.3s; }
        .stagger-4 { animation-delay: 0.4s; }
        .stagger-5 { animation-delay: 0.5s; }
        .stagger-6 { animation-delay: 0.6s; }
        .stagger-7 { animation-delay: 0.7s; }
        .stagger-8 { animation-delay: 0.8s; }
        .stagger-9 { animation-delay: 0.9s; }
        .stagger-10 { animation-delay: 1s; }
        .stagger-11 { animation-delay: 1.1s; }
        .stagger-12 { animation-delay: 1.2s; }
      `}</style>

      <div className="max-w-4xl mx-auto lg:pt-18 md:pt-15">
        {/* Header Section */}
        <div className="text-center mb-12 animate-fadeInUp">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-full mb-4 shadow-lg">
            <MessageCircle className="text-white" size={32} />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-4 pb-2 bg-clip-text text-transparent bg-gradient-to-r from-[#CA0F0F] to-[#CA0F0F]">
            Frequently Asked Questions
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Find answers to common questions about our matrimonial platform
          </p>
          {faqs.length > 0 && (
            <p className="text-gray-500 text-sm mt-2">
              {faqs.length} questions available
            </p>
          )}
        </div>

        {/* Search Bar */}
        <div className="mb-8 animate-fadeInUp stagger-1">
        
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, index) => (
              <div
                key={faq._id}
                className={`bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden animate-fadeInUp ${getStaggerClass(index)}`}
              >
                <button
                  onClick={() => toggleFaq(faq._id)}
                  className="w-full flex justify-between items-center p-6 text-left hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50 transition-all duration-300 group"
                >
                  <div className="flex items-start gap-4 flex-1">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-[#CA0F0F] to-[#CA0F0F] text-white font-bold flex items-center justify-center text-sm shadow-md group-hover:scale-110 transition-transform duration-300">
                      {String(faq.displayId).padStart(2, "0")}
                    </span>
                    <span className="text-gray-800 font-semibold text-base sm:text-lg leading-relaxed">
                      {faq.question}
                    </span>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    {openId === faq._id ? (
                      <Minus
                        className="text-[#CA0F0F] transition-transform duration-300 transform rotate-0"
                        size={24}
                      />
                    ) : (
                      <Plus
                        className="text-[#CA0F0F] transition-transform duration-300 group-hover:rotate-90"
                        size={24}
                      />
                    )}
                  </div>
                </button>

                {openId === faq._id && (
                  <div className="animate-slideDown overflow-hidden">
                    <div className="px-6 pb-6 pt-2 ml-12 text-gray-700 leading-relaxed border-l-4 border-orange-400 pl-4">
                      {faq.answer}
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : faqs.length === 0 ? (
            <div className="text-center py-12 animate-scaleIn">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
                <MessageCircle className="text-gray-400" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No FAQs Available</h3>
              <p className="text-gray-500">
                There are no frequently asked questions at the moment.
              </p>
            </div>
          ) : (
            <div className="text-center py-12 animate-scaleIn">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
                <Search className="text-gray-400" size={32} />
              </div>
              <p className="text-gray-500 text-lg">
                No questions found matching your search.
              </p>
              <button 
                onClick={() => setSearchQuery("")}
                className="mt-4 px-4 py-2 text-orange-500 hover:text-orange-600 font-medium transition-colors"
              >
                Clear search
              </button>
            </div>
          )}
        </div>

        {/* Footer Section */}
        <div className="mt-16 text-center animate-fadeInUp stagger-12">
          <div className="bg-gradient-to-r from-orange-100 to-red-100 rounded-2xl p-8 border border-orange-200">
            <h3 className="text-2xl font-bold text-gray-800 mb-3">
              Still have questions?
            </h3>
            <p className="text-gray-600 mb-6">
              Our support team is here to help you find your perfect match
            </p>
            <button 
              className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-full hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              onClick={() => navigate('/contact')}
            >
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;