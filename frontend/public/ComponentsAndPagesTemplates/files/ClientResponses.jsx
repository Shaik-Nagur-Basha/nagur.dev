import { MessageCircle, Star, User } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

function ClientResponses() {
  const { darkMode } = useTheme();

  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      title: "Product Manager",
      company: "Tech Innovations Inc.",
      rating: 5,
      feedback:
        "Exceptional work! The attention to detail and innovative approach transformed our project. Highly professional and results-driven.",
      image: "👩‍💼",
      color: "from-blue-500/40 to-cyan-500/40",
    },
    {
      id: 2,
      name: "Michael Chen",
      title: "CEO",
      company: "Digital Solutions Ltd.",
      rating: 5,
      feedback:
        "Outstanding developer! Delivered a robust, scalable solution ahead of schedule. Communication was excellent throughout.",
      image: "👨‍💻",
      color: "from-purple-500/40 to-pink-500/40",
    },
    {
      id: 3,
      name: "Emma Williams",
      title: "Design Director",
      company: "Creative Studios",
      rating: 5,
      feedback:
        "Incredible collaboration! They understood our vision perfectly and implemented features that exceeded expectations.",
      image: "👩‍🎨",
      color: "from-green-500/40 to-emerald-500/40",
    },
    {
      id: 4,
      name: "David Rodriguez",
      title: "Startup Founder",
      company: "NextGen Ventures",
      rating: 5,
      feedback:
        "A true professional! Built our MVP in record time without compromising quality. Definitely hiring again!",
      image: "👨‍🚀",
      color: "from-orange-500/40 to-amber-500/40",
    },
    {
      id: 5,
      name: "Lisa Park",
      title: "Marketing Lead",
      company: "Growth Co.",
      rating: 5,
      feedback:
        "Amazing to work with! Created responsive, beautiful UI that our users absolutely love. Great problem solver.",
      image: "👩‍💼",
      color: "from-red-500/40 to-rose-500/40",
    },
    {
      id: 6,
      name: "James Murphy",
      title: "Technical Director",
      company: "Enterprise Systems",
      rating: 5,
      feedback:
        "Top-tier developer! Clean code, great documentation, and always ready to help. A valuable team member.",
      image: "👨‍💼",
      color: "from-indigo-500/40 to-purple-500/40",
    },
  ];

  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        size={16}
        className={
          i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-400"
        }
      />
    ));
  };

  return (
    <section id="clients" className="mt-10 mb-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <span
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border backdrop-blur-xl mb-4 ${
              darkMode
                ? "bg-purple-900/40 text-purple-300 border-purple-800"
                : "bg-blue-100/60 text-blue-700 border-blue-300/60 shadow-lg shadow-blue-300/20"
            }`}
          >
            <MessageCircle size={16} />
            Client Responses
          </span>

          <h2
            className={`mt-6 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight ${
              darkMode ? "text-white/85" : "text-black/85"
            }`}
          >
            What Clients Say
          </h2>

          <p className="mt-4 text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Real feedback from clients who've experienced exceptional service
            and results.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className={`group relative rounded-2xl p-px
                bg-linear-to-br ${testimonial.color}
                transition-all hover:scale-105 duration-500
                ${darkMode ? "hover:shadow-2xl hover:shadow-purple-500/40" : "hover:shadow-2xl hover:shadow-blue-500/30"}`}
            >
              {/* Card Container */}
              <div
                className={`relative h-full rounded-2xl p-6
                  backdrop-blur-xl
                  border border-white/40 dark:border-white/10
                  shadow-lg shadow-black/5 dark:shadow-black/30
                  transition-all duration-500
                  group-hover:-translate-y-1
                  ${
                    darkMode
                      ? "bg-linear-to-br from-gray-900/80 via-gray-800/70 to-gray-900/80"
                      : "bg-linear-to-br from-white/80 via-blue-50/60 to-white/70"
                  }`}
              >
                {/* Top Section - Avatar and Stars */}
                <div className="flex items-start justify-between mb-4">
                  <span className="text-4xl transition-transform duration-300 group-hover:scale-110">
                    {testimonial.image}
                  </span>
                  <div className="flex gap-1">
                    {renderStars(testimonial.rating)}
                  </div>
                </div>

                {/* Testimonial Text */}
                <p
                  className={`text-sm leading-relaxed mb-4 line-clamp-4 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  "{testimonial.feedback}"
                </p>

                {/* Divider */}
                <div
                  className={`h-px my-4 ${
                    darkMode ? "bg-gray-700/50" : "bg-gray-200/50"
                  }`}
                ></div>

                {/* Client Info */}
                <div>
                  <h4
                    className={`text-sm font-bold mb-0.5 group-hover:text-purple-500 transition-colors ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {testimonial.name}
                  </h4>
                  <p
                    className={`text-xs font-semibold mb-1 ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {testimonial.title}
                  </p>
                  <p
                    className={`text-xs ${
                      darkMode ? "text-gray-500" : "text-gray-500"
                    }`}
                  >
                    {testimonial.company}
                  </p>
                </div>

                {/* Checkmark indicator */}
                <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-green-500 rounded-full p-1">
                    <MessageCircle size={16} className="text-white" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div
            className={`p-6 rounded-xl backdrop-blur-xl border text-center ${
              darkMode
                ? "bg-gray-800/50 border-gray-700"
                : "bg-white/60 border-gray-200"
            }`}
          >
            <p className="text-3xl font-bold text-purple-500">
              {testimonials.length}
            </p>
            <p
              className={`text-sm mt-2 ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Happy Clients
            </p>
          </div>

          <div
            className={`p-6 rounded-xl backdrop-blur-xl border text-center ${
              darkMode
                ? "bg-gray-800/50 border-gray-700"
                : "bg-white/60 border-gray-200"
            }`}
          >
            <p className="text-3xl font-bold text-yellow-500">
              {(
                testimonials.reduce((sum, t) => sum + t.rating, 0) /
                testimonials.length
              ).toFixed(1)}
            </p>
            <p
              className={`text-sm mt-2 ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Avg. Rating
            </p>
          </div>

          <div
            className={`p-6 rounded-xl backdrop-blur-xl border text-center ${
              darkMode
                ? "bg-gray-800/50 border-gray-700"
                : "bg-white/60 border-gray-200"
            }`}
          >
            <p className="text-3xl font-bold text-green-500">100%</p>
            <p
              className={`text-sm mt-2 ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Satisfied
            </p>
          </div>

          <div
            className={`p-6 rounded-xl backdrop-blur-xl border text-center ${
              darkMode
                ? "bg-gray-800/50 border-gray-700"
                : "bg-white/60 border-gray-200"
            }`}
          >
            <p className="text-3xl font-bold text-blue-500">⭐</p>
            <p
              className={`text-sm mt-2 ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              5 Stars
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div
          className={`mt-16 rounded-2xl p-8 backdrop-blur-xl border ${
            darkMode
              ? "bg-linear-to-r from-purple-900/40 to-blue-900/40 border-purple-800/60"
              : "bg-linear-to-r from-blue-100/60 to-purple-100/60 border-blue-300/60"
          } text-center`}
        >
          <h3
            className={`text-2xl font-bold mb-3 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Ready to Join Our Satisfied Clients?
          </h3>
          <p className={`mb-6 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
            Let's collaborate and create something extraordinary together.
          </p>
          <button
            className={`px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform active:scale-95 ${
              darkMode
                ? "bg-linear-to-r from-purple-600 to-blue-600 text-white hover:shadow-lg hover:shadow-purple-500/50"
                : "bg-linear-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg hover:shadow-blue-500/50"
            }`}
          >
            Start Your Project
          </button>
        </div>
      </div>
    </section>
  );
}

export default ClientResponses;
