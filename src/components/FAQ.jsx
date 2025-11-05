import React, { useState } from "react";
import { Plus, Minus, Search, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const faqs = [
  {
    id: 1,
    question:
      "Why is our platform ideal for US-based singles seeking matrimony?",
    answer:
      "Our platform is designed for the South Asian community in the United States, offering culturally relevant matchmaking with a modern approach. Members can connect with individuals who share similar values, backgrounds, and long-term relationship goals, all while ensuring privacy and authenticity.",
  },
  {
    id: 2,
    question:
      "Is this platform trustworthy for serious relationships in the US?",
    answer:
      "Yes. We verify profiles, ensure data privacy, and have a dedicated support team for our US users. Our system promotes genuine connections rather than casual dating, helping members find serious, compatible partners.",
  },
  {
    id: 3,
    question: "Can I search for matches based on location within the US?",
    answer:
      "Absolutely. You can search for potential matches by city, state, or region across the US. Our advanced filters make it easy to connect with people living nearby or within your preferred distance.",
  },
  {
    id: 4,
    question: "How does premium membership help US-based users?",
    answer:
      "Premium members enjoy features like direct messaging, viewing contact details, priority search listings, and personalized matchmaking recommendations — giving them an edge in finding compatible partners faster.",
  },
  {
    id: 5,
    question:
      "Can Non-Resident Indians (NRIs) or US citizens of Indian origin join?",
    answer:
      "Yes, our platform welcomes NRIs, Indian-Americans, and anyone of South Asian origin residing in the US who is looking for a serious, culturally compatible relationship.",
  },
  {
    id: 6,
    question: "How do I contact other members securely?",
    answer:
      "You can use our secure chat and messaging system to communicate. For added safety, phone numbers and personal details are shared only with mutual consent or through verified premium features.",
  },
  {
    id: 7,
    question: "Do you have success stories from US-based members?",
    answer:
      "Yes! Thousands of US-based members have found their life partners through our platform. We regularly feature success stories to inspire and motivate others to begin their journey with us.",
  },
  {
    id: 8,
    question:
      "Why is Shaadi.com better compared to other matrimonial websites?",
    answer:
      "Shaadi.com stands out as India's leading matchmaking platform with over 80 Lakh success stories, a testament to its trust and effectiveness. Unlike traditional matrimonial sites, Shaadi.com offers verified profiles, personalized matchmaking services, and advanced search tools that help users find compatible partners with ease and confidence. Its focus on safety, authenticity, and meaningful connections makes it a preferred choice for millions.",
  },
  {
    id: 9,
    question: "Is Shaadi.com a trustworthy matchmaking platform?",
    answer:
      "Yes. Shaadi.com has been trusted by millions for over two decades, offering verified profiles, privacy options, and dedicated customer support to ensure a safe and genuine matchmaking experience.",
  },
  {
    id: 10,
    question:
      "What is the difference between free membership vs paid membership?",
    answer:
      "Free members can create a profile, browse, and express interest, while paid members enjoy premium benefits like viewing contact details, personalized matchmaking, and priority listing.",
  },
  {
    id: 11,
    question: "What additional benefits do I get as a Premium Member?",
    answer:
      "Premium members can directly contact matches, access verified phone numbers, and receive top visibility in search results — increasing their chances of finding a compatible partner faster.",
  },
  {
    id: 12,
    question: "How can I contact other members on Shaadi.com?",
    answer:
      "Once you upgrade to a premium plan, you can send personalized messages, view contact details, and connect directly with matches who interest you.",
  },
];

const FAQ = () => {
  const [openId, setOpenId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const Navigate = useNavigate();

  const toggleFaq = (id) => {
    setOpenId(openId === id ? null : id);
  };

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        </div>

        {/* Search Bar */}
        <div className="mb-8 animate-fadeInUp stagger-1">
          <div className="relative max-w-2xl mx-auto">
            <Search
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search for questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-200 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-200 transition-all shadow-sm bg-white"
            />
          </div>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, index) => (
              <div
                key={faq.id}
                className={`bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden animate-fadeInUp stagger-${faq.id}`}
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full flex justify-between items-center p-6 text-left hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50 transition-all duration-300 group"
                >
                  <div className="flex items-start gap-4 flex-1">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-[#CA0F0F] to-[#CA0F0F] text-white font-bold flex items-center justify-center text-sm shadow-md group-hover:scale-110 transition-transform duration-300">
                      {String(faq.id).padStart(2, "0")}
                    </span>
                    <span className="text-gray-800 font-semibold text-base sm:text-lg leading-relaxed">
                      {faq.question}
                    </span>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    {openId === faq.id ? (
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

                {openId === faq.id && (
                  <div className="animate-slideDown overflow-hidden">
                    <div className="px-6 pb-6 pt-2 ml-12 text-gray-700 leading-relaxed border-l-4 border-orange-400 pl-4">
                      {faq.answer}
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12 animate-scaleIn">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
                <Search className="text-gray-400" size={32} />
              </div>
              <p className="text-gray-500 text-lg">
                No questions found matching your search.
              </p>
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
            <button className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-full hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1" onClick={()=> Navigate('/contact')}>
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
