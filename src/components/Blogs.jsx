import React, { useState } from "react";
import { Heart } from "lucide-react";

const blogs = [
  {
    id: 1,
    author: "John Doe",
    date: "Oct 29, 2025",
    title: "Pre-Wedding Checklist for Couples",
    image:
      "https://akm-img-a-in.tosshub.com/indiatoday/ritual-story_647_113017121831.jpg?VersionId=ba6n1XENVAi4OKbhIq7iCD2p09H1u5yo",
    category: "Relationship Tips",
    summary:
      "Learn the signs to identify your ideal life partner and build a lasting relationship...",
    fullText:
      "Finding the right life partner is one of the most important decisions you'll ever make..."
  },
  {
    id: 2,
    author: "Jane Smith",
    date: "Oct 28, 2025",
    title: "Pre-Wedding Checklist for Couples",
    image:
      "https://akm-img-a-in.tosshub.com/indiatoday/ritual-story_647_113017121831.jpg?VersionId=ba6n1XENVAi4OKbhIq7iCD2p09H1u5yo",
    category: "Wedding Planning",
    summary:
      "A step-by-step guide to planning your perfect wedding day without stress...",
    fullText:
      "Planning a wedding can be overwhelming, but with the right checklist, you can make it smooth..."
  },
  {
    id: 3,
    author: "Sarah Johnson",
    date: "Oct 27, 2025",
    title: "How to Communicate Effectively With Your Partner",
    image:
      "https://akm-img-a-in.tosshub.com/indiatoday/ritual-story_647_113017121831.jpg?VersionId=ba6n1XENVAi4OKbhIq7iCD2p09H1u5yo",
    category: "Relationship Tips",
    summary:
      "Master the art of communication to strengthen your relationship bond...",
    fullText:
      "Effective communication is the foundation of every successful relationship..."
  },
  {
    id: 4,
    author: "Mike Brown",
    date: "Oct 26, 2025",
    title: "Top Wedding Photographers in India",
    image:
      "https://akm-img-a-in.tosshub.com/indiatoday/ritual-story_647_113017121831.jpg?VersionId=ba6n1XENVAi4OKbhIq7iCD2p09H1u5yo",
    category: "Wedding Planning",
    summary:
      "Discover the best photographers to capture your special moments...",
    fullText:
      "Your wedding photos will be cherished for a lifetime. Here are the top photographers..."
  },
  {
    id: 5,
    author: "Emily Davis",
    date: "Oct 25, 2025",
    title: "Dealing With Differences in Arranged Marriages",
    image:
      "https://akm-img-a-in.tosshub.com/indiatoday/ritual-story_647_113017121831.jpg?VersionId=ba6n1XENVAi4OKbhIq7iCD2p09H1u5yo",
    category: "Family & Culture",
    summary:
      "Navigate cultural and personal differences with grace and understanding...",
    fullText:
      "Arranged marriages come with unique challenges and beautiful opportunities..."
  },
  {
    id: 6,
    author: "Raj Patel",
    date: "Oct 24, 2025",
    title: "Top 10 Questions to Ask Before Saying Yes",
    image:
      "https://akm-img-a-in.tosshub.com/indiatoday/ritual-story_647_113017121831.jpg?VersionId=ba6n1XENVAi4OKbhIq7iCD2p09H1u5yo",
    category: "Relationship Tips",
    summary:
      "Essential questions every couple should discuss before marriage...",
    fullText:
      "Before you say 'I do', make sure you've covered these important topics..."
  }
];

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
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedBlog, setSelectedBlog] = useState(null);

  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch =
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All Categories" || blog.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (selectedBlog) {
    return (
      <div className="min-h-screen bg-rose-50 px-4 sm:px-6 lg:px-8 mt-20 py-10">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => setSelectedBlog(null)}
            className="mb-6 text-rose-600 hover:text-rose-800 font-semibold flex items-center gap-2"
          >
            ← Back to Blog List
          </button>

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-rose-100">
            <img
              src={selectedBlog.image}
              alt={selectedBlog.title}
              className="w-full h-64 sm:h-80 md:h-96 object-cover"
            />
            <div className="p-6 sm:p-8">
              <span className="bg-rose-100 text-rose-700 px-3 py-1 rounded-full text-sm font-semibold">
                {selectedBlog.category}
              </span>
              <h1 className="text-3xl sm:text-4xl font-bold mt-4 mb-4 text-gray-800 leading-snug">
                {selectedBlog.title}
              </h1>
              <p className="text-gray-500 mb-6 text-sm sm:text-base">
                By {selectedBlog.author} • {selectedBlog.date}
              </p>
              <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
                {selectedBlog.fullText}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-rose-500 via-rose-400 to-pink-300 py-12 sm:py-16 px-4 sm:px-6 text-center">
        <div className="max-w-6xl mt-30 mx-auto">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif italic text-white mb-4 sm:mb-6">
            Wedding Blog & Advice
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-rose-50 max-w-3xl mx-auto leading-relaxed">
            Expert tips, inspiring stories, and everything you need to know about love,
            relationships, and wedding planning.
          </p>
        </div>
      </header>

      {/* Search & Filter */}
      <section className="bg-gradient-to-r from-rose-50 to-pink-50 py-10 sm:py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6">
            Your Guide to Love, Marriage & Matchmaking
          </h2>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-rose-300 px-4 py-3 rounded-lg w-full sm:w-96 focus:outline-none focus:ring-2 focus:ring-rose-400 bg-white text-gray-700"
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border border-rose-300 px-4 py-3 rounded-lg w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-rose-400 bg-white text-gray-700"
            >
              {categories.map((cat) => (
                <option key={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-12 flex-1">
        <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-8">
          {selectedCategory === "All Categories" ? "All Articles" : selectedCategory}
        </h3>

        {filteredBlogs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg sm:text-xl text-gray-600">
              No articles found. Try adjusting your search.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredBlogs.map((blog) => (
              <div
                key={blog.id}
                className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-2xl transition-shadow duration-300 flex flex-col border border-rose-100"
              >
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-48 sm:h-56 object-cover"
                />
                <div className="p-5 sm:p-6 flex flex-col flex-grow">
                  <span className="bg-rose-100 text-rose-700 px-3 py-1 rounded-full text-sm font-semibold w-fit">
                    {blog.category}
                  </span>
                  <h4 className="text-lg sm:text-xl font-bold mt-3 mb-2 text-gray-800 line-clamp-2">
                    {blog.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-500 mb-2">
                    By {blog.author} • {blog.date}
                  </p>
                  <p className="text-gray-600 mb-4 line-clamp-3 flex-grow text-sm sm:text-base">
                    {blog.summary}
                  </p>
                  <button
                    onClick={() => setSelectedBlog(blog)}
                    className="bg-rose-500 text-white px-6 py-2 rounded-full hover:bg-rose-600 transition-colors duration-300 font-semibold mt-auto"
                  >
                    Read More
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Category Buttons */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="bg-white rounded-2xl shadow-md p-6 sm:p-8 border border-rose-100">
          <h4 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">
            Browse by Category
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {categories
              .filter((cat) => cat !== "All Categories")
              .map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-lg text-sm sm:text-base font-medium transition-colors duration-300 ${
                    selectedCategory === cat
                      ? "bg-rose-500 text-white"
                      : "bg-rose-50 text-rose-800 hover:bg-rose-100"
                  }`}
                >
                  {cat}
                </button>
              ))}
          </div>
        </div>
      </section>
    </div>
  );
}
