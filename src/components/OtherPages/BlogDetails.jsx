import React from "react";
import { useParams, useNavigate } from "react-router-dom";


const blogs = [
  {
    id: 1,
    author: "John Doe",
    date: "Oct 29, 2025",
    title: "The Future of AI",
    image: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.dreamstime.com%2Findian-wedding-rituals-hindu-wedding-ritual-indian-traditional-wedding-indian-wedding-rituals-hindu-wedding-ritual-indian-image316808550&psig=AOvVaw3JuB9AomWL3ZIzWBXOU8-R&ust=1761806850256000&source=images&cd=vfe&opi=89978449&ved=0CBUQjRxqFwoTCLCz-IzoyJADFQAAAAAdAAAAABAE",
    fullText:
      "Artificial Intelligence (AI) is revolutionizing everything from healthcare to education. In this article, we explore how AI models are shaping the future, improving productivity, and raising ethical questions. From self-learning algorithms to generative creativity, AI continues to redefine innovation. Businesses are leveraging AI to enhance customer experiences and optimize workflows, while researchers explore the boundaries of machine cognition and ethics. The next decade promises groundbreaking advancements that will transform our world.",
  },
  {
    id: 2,
    author: "Jane Smith",
    date: "Oct 28, 2025",
    title: "Design Trends for 2025",
    image: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.dreamstime.com%2Findian-wedding-rituals-hindu-wedding-ritual-indian-traditional-wedding-indian-wedding-rituals-hindu-wedding-ritual-indian-image316808550&psig=AOvVaw3JuB9AomWL3ZIzWBXOU8-R&ust=1761806850256000&source=images&cd=vfe&opi=89978449&ved=0CBUQjRxqFwoTCLCz-IzoyJADFQAAAAAdAAAAABAE",
    fullText:
      "The design world in 2025 is embracing minimalism and inclusivity. Designers are focusing on accessibility, emotional connection, and eco-friendly processes that resonate globally. We see increased use of soft gradients, fluid typography, and interactive experiences that bridge art and technology. The focus on sustainability continues to influence color palettes and material choices. Design in 2025 is not just about aesthetics — it’s about meaning, experience, and human connection.",
  },
];

export default function BlogDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const blog = blogs.find((b) => b.id === parseInt(id));

  if (!blog)
    return (
      <div className="min-h-screen flex items-center justify-center bg-amber-50">
        <p className="text-lg text-gray-600">Blog not found.</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-[#FEF6ED] to-yellow-100">
      {/* Hero Section */}
      <section className="relative w-full h-72 sm:h-96">
        <img
          src={blog.image}
          alt={blog.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/60"></div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
          <h1 className="text-3xl sm:text-5xl font-serif italic font-semibold mb-4 drop-shadow-lg">
            {blog.title}
          </h1>
          <p className="text-sm sm:text-base text-amber-100">
            By {blog.author} • {blog.date}
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="max-w-4xl mx-auto bg-white rounded-3xl shadow-lg mt-[-4rem] sm:mt-[-6rem] relative z-20 p-6 sm:p-10 mb-12">
        <button
          onClick={() => navigate("/blogs")}
          className="text-amber-600 hover:text-amber-800 font-semibold mb-6 flex items-center gap-2"
        >
          ← Back to Blogs
        </button>

        <article>
          <p className="text-gray-700 text-lg leading-relaxed">
            {blog.fullText}
          </p>
        </article>

        <div className="mt-10 pt-6 border-t border-amber-100 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">
              Written by <span className="font-semibold text-amber-800">{blog.author}</span>
            </p>
            <p className="text-xs text-gray-400">{blog.date}</p>
          </div>
          <button
            onClick={() => navigate("/blogs")}
            className="bg-amber-500 hover:bg-amber-600 text-white px-5 py-2 rounded-full text-sm font-semibold shadow-md transition"
          >
            View All Blogs
          </button>
        </div>
      </section>
    </div>
  );
}
