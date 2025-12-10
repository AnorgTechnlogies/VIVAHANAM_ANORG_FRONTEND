import React, { useEffect, useState, useRef } from "react";
import {
  Star,
  Heart,
  Loader2,
  AlertCircle,
  X,
  Upload,
  Send,
  Plus,
} from "lucide-react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_KEY ;
//  const API_URL = import.meta.env.VITE_API_KEY;

// Reusable Star Rating Component
const StarRating = ({ rating, interactive = false, onChange }) => {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-6 h-6 transition-all font-sans ${
            interactive && (hover || rating) > i
              ? "fill-amber-400 text-amber-400 cursor-pointer"
              : i < rating
              ? "fill-amber-400 text-amber-400"
              : "text-gray-300"
          }`}
          onMouseEnter={() => interactive && setHover(i + 1)}
          onMouseLeave={() => interactive && setHover(0)}
          onClick={() => interactive && onChange(i + 1)}
        />
      ))}
    </div>
  );
};

export default function TestimonialPage() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [form, setForm] = useState({
    name: "",
    weddingDate: "",
    message: "",
    rating: 5,
    image: null,
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // null | 'success' | 'error'
  const fileInputRef = useRef(null);

  // === FETCH APPROVED TESTIMONIALS ===
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await axios.get(`${API_URL}/admin/testimonials`);
        const data = Array.isArray(res.data.data) ? res.data.data : [];
        setTestimonials(data);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.response?.data?.message || "Failed to load testimonials");
        setTestimonials([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  // === HANDLE FORM SUBMIT ===
const handleSubmit = async (e) => {
  e.preventDefault();

  // Validation
  if (!form.image) {
    alert("Please upload a photo of the couple.");
    return;
  }
  if (form.message.length < 50) {
    alert("Please write a message of at least 50 characters.");
    return;
  }

  setSubmitting(true);
  setSubmitStatus(null);

  try {
    // Send as JSON with base64 image
    await axios.post(`${API_URL}/admin/testimonials/submit`, {
      name: form.name.trim(),
      weddingDate: form.weddingDate.trim(),
      message: form.message.trim(),
      rating: form.rating,
      image: form.image, // base64 string
    });

    setSubmitStatus("success");
    setTimeout(() => {
      setShowForm(false);
      resetForm();
    }, 2000);
  } catch (err) {
    console.error("Submit error:", err);
    setSubmitStatus("error");
  } finally {
    setSubmitting(false);
  }
}

  // === RESET FORM ===
  const resetForm = () => {
    setForm({
      name: "",
      weddingDate: "",
      message: "",
      rating: 5,
      image: null,
    });
    setSubmitStatus(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // === HANDLE IMAGE CHANGE ===
const handleImageChange = (e) => {
  const file = e.target.files[0];
  if (file && file.type.startsWith("image/")) {
    const reader = new FileReader();
    reader.onloadend = () => {
      // reader.result will be: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQ..."
      setForm((prev) => ({ 
        ...prev, 
        image: reader.result 
      }));
    };
    reader.onerror = () => {
      alert("Failed to read image file. Please try another image.");
    };
    reader.readAsDataURL(file); // This converts to base64
  } else {
    alert("Please upload a valid image file (JPEG, PNG, etc.).");
  }
};

  // === LOADING STATE ===
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen font-sans">
        <Loader2 className="w-12 h-12 animate-spin text-rose-500" />
      </div>
    );
  }

  // === ERROR STATE ===
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center font-sans">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <p className="text-xl text-gray-700 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-rose-500 text-white rounded-full hover:bg-rose-600 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  // === MAIN RENDER ===
  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white pt-24 font-sans">
      {/* HERO SECTION */}
      <section className="relative py-5 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center">
          <Heart className="w-16 h-16 text-rose-500 animate-pulse mx-auto mb-6" />
          <h1 className="text-4xl md:text-4xl font-bold text-gray-800 mb-4">
            Love Stories We Helped Create
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Real couples. Real emotions. Real weddings.
          </p>

          <button
            onClick={() => setShowForm(true)}
            className="mt-8 inline-flex items-center gap-2 bg-amber-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-amber-700 transition"
          >
            <Plus className="w-5 h-5" />
             Add Your Testimonial
          </button>
        </div>
      </section>

      {/* TESTIMONIALS GRID */}
      {testimonials.length > 0 ? (
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((t) => {
                // Defensive text rendering
                const safeName = typeof t.name === "string" && t.name.length < 100 ? t.name : "Anonymous Couple";
                const safeDate = typeof t.weddingDate === "string" && t.weddingDate.length < 50 ? t.weddingDate : "Date Unknown";
                const safeMessage = typeof t.message === "string" && t.message.length < 1000 ? t.message : "No message available.";

                return (
                  <div
                    key={t._id}
                    className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-shadow border border-rose-100"
                  >
                    <div className="flex items-center gap-4 mb-6">
                      <img
                        src={t.image?.url || "https://via.placeholder.com/64"}
                        alt={safeName}
                        className="w-16 h-16 rounded-full object-cover ring-4 ring-rose-100"
                        loading="lazy"
                      />
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800">{safeName}</h3>
                        <p className="text-sm text-rose-600">Married on {safeDate}</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <StarRating rating={t.rating || 0} />
                    </div>

                    {/* FIXED TEXT WRAPPING */}
                    <blockquote
                      className="text-gray-700  text-lg leading-relaxed
                                 break-words hyphens-auto
                                 overflow-hidden
                                 line-clamp-4"  // Remove this line if you want unlimited lines
                      title={safeMessage}
                    >
                      "{safeMessage}"
                    </blockquote>

                    <div className="mt-6 flex justify-end">
                      <Heart className="w-6 h-6 text-rose-400" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      ) : (
        <section className="py-20 px-4 text-center">
          <Heart className="w-16 h-16 text-rose-300 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Be the First to Share!
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            No testimonials yet. Click the button above to share your beautiful wedding story!
          </p>
        </section>
      )}


      {/* SUBMISSION MODAL */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 relative font-sans">
            <button
              onClick={() => {
                setShowForm(false);
                resetForm();
              }}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-bold text-center mb-6 text-amber-700">
              Share Your Love Story
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Image Upload */}
              {/* Image Upload */}
<div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Couple Photo <span className="text-red-500">*</span>
  </label>
  <div className="flex items-center justify-center w-full">
    <label
      htmlFor="image-upload"
      className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-amber-300 rounded-lg cursor-pointer bg-amber-50 hover:bg-amber-100 transition"
    >
      {form.image ? (
        // ✅ FIX: Check if it's base64 string
        typeof form.image === 'string' && form.image.startsWith('data:image') ? (
          <img
            src={form.image}
            alt="Preview"
            className="h-full w-full object-cover rounded-lg"
          />
        ) : (
          // Fallback for File objects
          <img
            src={URL.createObjectURL(form.image)}
            alt="Preview"
            className="h-full w-full object-cover rounded-lg"
          />
        )
      ) : (
        <div className="text-center p-4">
          <Upload className="w-10 h-10 text-amber-600 mx-auto mb-2" />
          <p className="text-sm text-amber-600">Click to upload</p>
        </div>
      )}
      <input
        id="image-upload"
        name="image"
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleImageChange}
        className="hidden"
        required
      />
    </label>
  </div>
</div>

              {/* Name */}
              <input
                type="text"
                name="name"
                placeholder="Couple Name (e.g. Priya & Arjun)"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
                required
              />

              {/* Wedding Date */}
              <input
                type="text"
                name="weddingDate"
                placeholder="Wedding Date (e.g. March 15, 2024)"
                value={form.weddingDate}
                onChange={(e) => setForm({ ...form, weddingDate: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
                required
              />

              {/* Message */}
              <textarea
                name="message"
                placeholder="Your beautiful story... (min 50 characters)"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg h-32 resize-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
                required
                minLength="50"
              />

              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Rating
                </label>
                <StarRating
                  rating={form.rating}
                  interactive
                  onChange={(val) => setForm({ ...form, rating: val })}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-amber-600 text-white py-3 rounded-lg font-semibold hover:bg-amber-700 disabled:opacity-70 flex items-center justify-center gap-2 transition"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Submitting...
                  </>
                ) : submitStatus === "success" ? (
                  "Submitted!"
                ) : submitStatus === "error" ? (
                  "Try Again"
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Submit Testimonial
                  </>
                )}
              </button>

              {submitStatus === "success" && (
                <p className="text-green-600 text-center font-medium animate-pulse">
                  Thank you! Your story will appear after review.
                </p>
              )}
              {submitStatus === "error" && (
                <p className="text-red-600 text-center">
                  Failed to submit. Please try again.
                </p>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}