import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Search,
  Calendar,
  User,
  Eye,
  Clock,
  ChevronRight,
  ArrowUp,
  Tag,
} from "lucide-react";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import { useTheme } from "../context/ThemeContext";

const BlogsPage = () => {
  const { darkMode } = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [visibleBlogs, setVisibleBlogs] = useState(9);

  // Enhanced blog data with media
  const blogs = [
    {
      id: 1,
      title: "Building Modern Web Experiences",
      excerpt:
        "Explore cutting-edge techniques for creating interactive and responsive web applications.",
      content:
        "In today's digital landscape, building modern web experiences requires mastering multiple technologies and design principles. From React hooks to advanced CSS, we'll cover everything you need to create stunning web applications that engage users.",
      author: "Sarah Chen",
      date: "2024-01-15",
      readTime: 8,
      views: 2341,
      tags: ["web", "react", "design"],
      media: {
        type: "video",
        src: "https://videos.pexels.com/video-files/3535919/3535919-sd_640_360_25fps.mp4",
        thumb:
          "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&q=80",
      },
    },
    {
      id: 2,
      title: "The Art of User Interface Design",
      excerpt:
        "Discover principles and best practices for creating beautiful and intuitive user interfaces.",
      content:
        "A great UI is more than just aesthetics—it's about creating experiences that feel natural and effortless. This comprehensive guide covers typography, color theory, spacing, and interaction design patterns that will elevate your work.",
      author: "Alex Rivera",
      date: "2024-01-10",
      readTime: 12,
      views: 3156,
      tags: ["design", "ui", "ux"],
      media: {
        type: "image",
        src: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80",
        thumb:
          "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&q=80",
      },
    },
    {
      id: 3,
      title: "JavaScript Performance Optimization",
      excerpt:
        "Learn advanced techniques to optimize your JavaScript applications for maximum performance.",
      content:
        "Performance is crucial for user satisfaction. In this post, we explore debouncing, throttling, code splitting, lazy loading, and other optimization techniques that will make your applications lightning-fast.",
      author: "Jordan Mills",
      date: "2024-01-05",
      readTime: 15,
      views: 4521,
      tags: ["javascript", "performance", "web"],
      media: {
        type: "video",
        src: "https://videos.pexels.com/video-files/1409899/1409899-sd_640_360_25fps.mp4",
        thumb:
          "https://images.unsplash.com/photo-1516321720402-e06e8b43bc11?w=400&q=80",
      },
    },
    {
      id: 4,
      title: "CSS Grid: Mastering Layouts",
      excerpt:
        "Unlock the power of CSS Grid to create complex and responsive layouts with ease.",
      content:
        "CSS Grid revolutionized the way we approach layout design. This guide covers grid basics, advanced positioning, subgrid, and responsive patterns that will transform your design workflow.",
      author: "Emma Watson",
      date: "2023-12-28",
      readTime: 10,
      views: 2876,
      tags: ["css", "design", "web"],
      media: {
        type: "image",
        src: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
        thumb:
          "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&q=80",
      },
    },
    {
      id: 5,
      title: "React Hooks Deep Dive",
      excerpt:
        "Master React Hooks and write more efficient, reusable functional components.",
      content:
        "Hooks changed how we write React components. Learn about useState, useEffect, useContext, and custom hooks to write cleaner, more maintainable code that's easier to understand and test.",
      author: "Michael Chen",
      date: "2023-12-20",
      readTime: 14,
      views: 5234,
      tags: ["react", "javascript", "web"],
      media: {
        type: "video",
        src: "https://videos.pexels.com/video-files/2583852/2583852-sd_640_360_24fps.mp4",
        thumb:
          "https://images.unsplash.com/photo-1578375050468-d5b63b1688e9?w=400&q=80",
      },
    },
    {
      id: 6,
      title: "Responsive Design Best Practices",
      excerpt:
        "Create truly responsive websites that work beautifully on any device.",
      content:
        "In a multi-device world, responsive design is essential. Explore mobile-first approaches, flexible layouts, media queries, and testing strategies to ensure your sites look perfect everywhere.",
      author: "Lisa Park",
      date: "2023-12-15",
      readTime: 9,
      views: 3445,
      tags: ["design", "responsive", "web"],
      media: {
        type: "image",
        src: "https://images.unsplash.com/photo-1554050857-4d192d92225b?w=800&q=80",
        thumb:
          "https://images.unsplash.com/photo-1554050857-4d192d92225b?w=400&q=80",
      },
    },
    {
      id: 7,
      title: "Web Animations with CSS & JavaScript",
      excerpt:
        "Create engaging animations that enhance user experience without sacrificing performance.",
      content:
        "Animations can elevate your designs, but they must be purposeful and performant. Learn about CSS animations, transitions, keyframes, and JavaScript animation libraries to create smooth, delightful experiences.",
      author: "David Kim",
      date: "2023-12-10",
      readTime: 11,
      views: 2654,
      tags: ["animation", "css", "javascript"],
      media: {
        type: "video",
        src: "https://videos.pexels.com/video-files/3535919/3535919-sd_640_360_25fps.mp4",
        thumb:
          "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=400&q=80",
      },
    },
    {
      id: 8,
      title: "Accessibility in Web Design",
      excerpt:
        "Build inclusive websites that everyone can use, regardless of their abilities.",
      content:
        "Web accessibility isn't optional—it's essential. Discover WCAG guidelines, semantic HTML, ARIA attributes, keyboard navigation, and testing tools to create websites that work for everyone.",
      author: "Sophie Turner",
      date: "2023-12-05",
      readTime: 13,
      views: 1987,
      tags: ["accessibility", "design", "web"],
      media: {
        type: "image",
        src: "https://images.unsplash.com/photo-1611532736579-6b16e2b50449?w=800&q=80",
        thumb:
          "https://images.unsplash.com/photo-1611532736579-6b16e2b50449?w=400&q=80",
      },
    },
    {
      id: 9,
      title: "Vue.js vs React: Comparison Guide",
      excerpt:
        "Explore the differences, strengths, and use cases of Vue.js and React frameworks.",
      content:
        "Both Vue and React are powerful frameworks with passionate communities. This comprehensive comparison covers syntax, learning curve, ecosystem, performance, and helps you choose the right tool for your project.",
      author: "Thomas Anderson",
      date: "2023-11-30",
      readTime: 16,
      views: 6123,
      tags: ["framework", "javascript", "comparison"],
      media: {
        type: "video",
        src: "https://videos.pexels.com/video-files/1409899/1409899-sd_640_360_25fps.mp4",
        thumb:
          "https://images.unsplash.com/photo-1516321720402-e06e8b43bc11?w=400&q=80",
      },
    },
  ];

  // Get all unique tags
  const allTags = useMemo(() => {
    const tagSet = new Set();
    blogs.forEach((blog) => blog.tags.forEach((tag) => tagSet.add(tag)));
    return ["all", ...Array.from(tagSet).sort()];
  }, []);

  // Filter and sort blogs
  const filteredBlogs = useMemo(() => {
    let result = blogs.filter((blog) => {
      const matchesSearch =
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.tags.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase()),
        );

      const matchesTag =
        selectedTag === "all" || blog.tags.includes(selectedTag);

      return matchesSearch && matchesTag;
    });

    // Sort
    if (sortBy === "recent") {
      result.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortBy === "popular") {
      result.sort((a, b) => b.views - a.views);
    } else if (sortBy === "trending") {
      result.sort((a, b) => b.views / b.readTime - a.views / a.readTime);
    }

    return result;
  }, [searchTerm, selectedTag, sortBy]);

  // Scroll progress
  useEffect(() => {
    if (!selectedBlog) return;

    const handleScroll = () => {
      const element = document.documentElement;
      const scrollTop = element.scrollTop;
      const scrollHeight = element.scrollHeight - element.clientHeight;
      const progress =
        scrollHeight === 0 ? 0 : (scrollTop / scrollHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [selectedBlog]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-300 ${
        darkMode
          ? "bg-linear-to-br from-gray-950 via-gray-900 to-purple-950 text-white"
          : "bg-linear-to-br from-blue-50 via-white to-purple-50 text-gray-900"
      }`}
    >
      {/* Progress bar */}
      {selectedBlog && (
        <div
          className="fixed top-0 left-0 right-0 h-1 bg-linear-to-r from-blue-500 to-purple-500 z-40"
          style={{ width: `${scrollProgress}%` }}
        />
      )}

      <Navigation />

      <main className="flex-1 px-3 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="max-w-6xl mx-auto">
          {!selectedBlog ? (
            <>
              {/* Header */}
              <div className="mb-12 text-center space-y-4 animate-fadeIn">
                <div className="inline-flex items-center justify-center gap-4">
                  <div className="h-1 w-12 bg-linear-to-r from-transparent to-blue-500"></div>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-black bg-clip-text text-transparent bg-linear-to-r from-blue-500 via-purple-500 to-pink-500">
                    Blog
                  </h1>
                  <div className="h-1 w-12 bg-linear-to-l from-transparent to-pink-500"></div>
                </div>
                <p
                  className={`text-lg ${darkMode ? "text-gray-300" : "text-gray-600"}`}
                >
                  Insights, tutorials, and stories from the web development
                  world
                </p>
              </div>

              {/* Search and Filters */}
              <div className="mb-10 space-y-4">
                {/* Search */}
                <div className="relative group">
                  <Search
                    size={20}
                    className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors duration-300 ${
                      darkMode
                        ? "text-gray-500 group-focus-within:text-purple-400"
                        : "text-gray-400 group-focus-within:text-blue-400"
                    }`}
                  />
                  <input
                    type="text"
                    placeholder="Search articles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 transition-all duration-300 placeholder-opacity-70 backdrop-blur-md ${
                      darkMode
                        ? "bg-gray-800/60 border-gray-700/50 text-white placeholder-gray-400 hover:border-purple-500/50 hover:bg-gray-800/80 focus:border-purple-500 focus:bg-gray-800/90 focus:ring-2 focus:ring-purple-500/20"
                        : "bg-white/60 border-gray-200/50 text-gray-900 placeholder-gray-500 hover:border-blue-500/50 hover:bg-white/80 focus:border-blue-500 focus:bg-white/90 focus:ring-2 focus:ring-blue-500/20"
                    } focus:outline-none`}
                  />
                </div>

                {/* Tags and Sort */}
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center flex-wrap">
                  <div className="flex flex-wrap gap-3">
                    {allTags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => setSelectedTag(tag)}
                        className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 relative group backdrop-blur-md ${
                          selectedTag === tag
                            ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-purple-500/40 border border-purple-300/20"
                            : darkMode
                              ? "bg-gray-800/60 text-gray-200 hover:bg-gray-700/80 border border-gray-700/50 hover:border-gray-600"
                              : "bg-white/50 text-gray-700 hover:bg-white/70 border border-gray-200/50 hover:border-gray-300"
                        }`}
                      >
                        <span className="relative z-10">#{tag}</span>
                        {selectedTag === tag && (
                          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 group-hover:from-blue-500/30 group-hover:to-purple-500/30 transition-all duration-300"></div>
                        )}
                      </button>
                    ))}
                  </div>

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className={`px-4 py-2 rounded-xl border-2 transition-all duration-300 font-semibold backdrop-blur-md ${
                      darkMode
                        ? "bg-gray-800/60 border-gray-700/50 text-white hover:border-purple-500/50 focus:border-purple-500 focus:bg-gray-800/80 focus:ring-2 focus:ring-purple-500/20"
                        : "bg-white/60 border-gray-200/50 text-gray-900 hover:border-blue-500/50 focus:border-blue-500 focus:bg-white/80 focus:ring-2 focus:ring-blue-500/20"
                    } focus:outline-none`}
                  >
                    <option value="recent">Recent</option>
                    <option value="popular">Popular</option>
                    <option value="trending">Trending</option>
                  </select>
                </div>
              </div>

              {/* Blog List - Enhanced Cards */}
              <div className="space-y-6">
                {filteredBlogs.slice(0, visibleBlogs).map((blog, index) => (
                  <div
                    key={blog.id}
                    onClick={() => setSelectedBlog(blog)}
                    className={`group cursor-pointer relative p-px transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 rounded-2xl ${
                      darkMode
                        ? "hover:shadow-2xl hover:shadow-purple-500/40"
                        : "hover:shadow-2xl hover:shadow-blue-500/30"
                    } bg-gradient-to-br from-blue-500/40 via-purple-500/30 to-pink-500/30 hover:from-blue-500 hover:to-purple-500 duration-500`}
                  >
                    <div
                      className={`relative h-full rounded-2xl p-6 ${
                        darkMode ? "bg-gray-900/70" : "bg-white/70"
                      } backdrop-blur-xl border ${darkMode ? "border-white/10" : "border-white/40"} shadow-lg ${darkMode ? "shadow-black/30" : "shadow-black/5"} transition-all duration-500`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-6">
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start gap-3 mb-3">
                            <div
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap backdrop-blur-md transition-all duration-300 transform group-hover:scale-110 ${
                                darkMode
                                  ? "bg-blue-500/40 text-blue-200 border border-blue-400/30"
                                  : "bg-blue-500/30 text-blue-700 border border-blue-400/40"
                              }`}
                            >
                              Article
                            </div>
                            <h2 className="text-lg sm:text-xl font-bold group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 transition-all duration-300 flex-1">
                              {blog.title}
                            </h2>
                          </div>
                          <p
                            className={`text-sm mb-3 line-clamp-2 ${darkMode ? "text-gray-400" : "text-gray-600"}`}
                          >
                            {blog.excerpt}
                          </p>

                          {/* Meta */}
                          <div className="flex flex-wrap gap-3 text-xs sm:text-sm mb-3">
                            <div
                              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg backdrop-blur-md transition-all duration-300 ${
                                darkMode
                                  ? "bg-gray-800/40 text-gray-300"
                                  : "bg-gray-200/40 text-gray-700"
                              }`}
                            >
                              <User
                                size={14}
                                className="text-blue-500 group-hover:scale-110 transition-transform"
                              />
                              <span>{blog.author}</span>
                            </div>
                            <div
                              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg backdrop-blur-md transition-all duration-300 ${
                                darkMode
                                  ? "bg-gray-800/40 text-gray-300"
                                  : "bg-gray-200/40 text-gray-700"
                              }`}
                            >
                              <Calendar
                                size={14}
                                className="text-purple-500 group-hover:scale-110 transition-transform"
                              />
                              <span>{formatDate(blog.date)}</span>
                            </div>
                            <div
                              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg backdrop-blur-md transition-all duration-300 ${
                                darkMode
                                  ? "bg-gray-800/40 text-gray-300"
                                  : "bg-gray-200/40 text-gray-700"
                              }`}
                            >
                              <Clock
                                size={14}
                                className="text-pink-500 group-hover:scale-110 transition-transform"
                              />
                              <span>{blog.readTime} min</span>
                            </div>
                            <div
                              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg backdrop-blur-md transition-all duration-300 ${
                                darkMode
                                  ? "bg-gray-800/40 text-gray-300"
                                  : "bg-gray-200/40 text-gray-700"
                              }`}
                            >
                              <Eye
                                size={14}
                                className="text-cyan-500 group-hover:scale-110 transition-transform"
                              />
                              <span>{blog.views.toLocaleString()}</span>
                            </div>
                          </div>

                          {/* Tags */}
                          <div className="flex flex-wrap gap-2 mt-3">
                            {blog.tags.map((tag, idx) => (
                              <span
                                key={tag}
                                className={`text-xs px-3 py-1.5 rounded-lg backdrop-blur-md transition-all duration-300 transform hover:scale-105 ${
                                  darkMode
                                    ? "bg-purple-500/30 text-purple-200 border border-purple-400/30 hover:bg-purple-500/50 hover:border-purple-400/50"
                                    : "bg-blue-500/30 text-blue-700 border border-blue-400/40 hover:bg-blue-500/50 hover:border-blue-400/60"
                                }`}
                                style={{
                                  transitionDelay: `${idx * 30}ms`,
                                }}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Media Thumbnail */}
                        <div
                          className={`w-full sm:w-32 h-32 rounded-xl overflow-hidden shrink-0 group-hover:scale-110 transition-transform duration-300 border ${darkMode ? "border-white/10" : "border-white/20"} shadow-lg group-hover:shadow-2xl`}
                        >
                          {blog.media.type === "image" ? (
                            <img
                              src={blog.media.thumb}
                              alt={blog.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div
                              className={`w-full h-full relative ${darkMode ? "bg-gray-700" : "bg-gray-300"} flex items-center justify-center`}
                            >
                              <video
                                src={blog.media.src}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                <div className="text-white text-2xl">▶</div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Arrow */}
                        <ChevronRight
                          size={24}
                          className={`hidden sm:block text-purple-500 group-hover:translate-x-1 transition-transform shrink-0 group-hover:scale-110 duration-300`}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Load More */}
              {visibleBlogs < filteredBlogs.length && (
                <div className="mt-10 text-center">
                  <button
                    onClick={() => setVisibleBlogs((prev) => prev + 6)}
                    className={`px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 border border-purple-300/20 backdrop-blur-md`}
                  >
                    Load More Articles
                  </button>
                </div>
              )}

              {/* No Results */}
              {filteredBlogs.length === 0 && (
                <div className="text-center py-20">
                  <p
                    className={`text-lg ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                  >
                    No articles found matching your criteria
                  </p>
                </div>
              )}

              {/* Stats */}
              <div className="mt-16 grid grid-cols-3 gap-4 text-center">
                <div
                  className={`p-6 rounded-2xl backdrop-blur-md border transition-all duration-300 hover:scale-105 hover:-translate-y-2 ${
                    darkMode
                      ? "bg-blue-500/20 border-blue-400/30 shadow-lg shadow-blue-500/20"
                      : "bg-blue-500/20 border-blue-400/40 shadow-lg shadow-blue-500/20"
                  }`}
                >
                  <p className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                    {blogs.length}
                  </p>
                  <p
                    className={`text-sm mt-2 ${darkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Articles
                  </p>
                </div>
                <div
                  className={`p-6 rounded-2xl backdrop-blur-md border transition-all duration-300 hover:scale-105 hover:-translate-y-2 ${
                    darkMode
                      ? "bg-purple-500/20 border-purple-400/30 shadow-lg shadow-purple-500/20"
                      : "bg-purple-500/20 border-purple-400/40 shadow-lg shadow-purple-500/20"
                  }`}
                >
                  <p className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
                    {allTags.length - 1}
                  </p>
                  <p
                    className={`text-sm mt-2 ${darkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Categories
                  </p>
                </div>
                <div
                  className={`p-6 rounded-2xl backdrop-blur-md border transition-all duration-300 hover:scale-105 hover:-translate-y-2 ${
                    darkMode
                      ? "bg-pink-500/20 border-pink-400/30 shadow-lg shadow-pink-500/20"
                      : "bg-pink-500/20 border-pink-400/40 shadow-lg shadow-pink-500/20"
                  }`}
                >
                  <p className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-pink-600 bg-clip-text text-transparent">
                    {blogs
                      .reduce((sum, b) => sum + b.views, 0)
                      .toLocaleString()}
                  </p>
                  <p
                    className={`text-sm mt-2 ${darkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Total Views
                  </p>
                </div>
              </div>
            </>
          ) : (
            /* Blog Detail View */
            <div className="max-w-3xl mx-auto">
              <button
                onClick={() => setSelectedBlog(null)}
                className={`mb-8 px-4 py-2 rounded-lg font-semibold transition-all ${
                  darkMode
                    ? "bg-gray-800 text-white hover:bg-gray-700"
                    : "bg-gray-200 text-gray-900 hover:bg-gray-300"
                }`}
              >
                ← Back to Articles
              </button>

              {/* Featured Media */}
              <div
                className={`mb-8 rounded-2xl overflow-hidden h-96 sm:h-125 ${darkMode ? "bg-gray-800" : "bg-gray-200"}`}
              >
                {selectedBlog.media.type === "image" ? (
                  <img
                    src={selectedBlog.media.src}
                    alt={selectedBlog.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  >
                    <source src={selectedBlog.media.src} />
                  </video>
                )}
              </div>

              {/* Article Header */}
              <h1 className="text-3xl sm:text-5xl font-bold mb-4">
                {selectedBlog.title}
              </h1>
              <p
                className={`text-lg mb-6 ${darkMode ? "text-gray-400" : "text-gray-600"}`}
              >
                {selectedBlog.excerpt}
              </p>

              {/* Meta Info */}
              <div
                className={`flex flex-wrap gap-4 py-6 border-b-2 border-t-2 ${darkMode ? "border-gray-700" : "border-gray-300"} mb-8`}
              >
                <div className="flex items-center gap-2">
                  <User size={18} className="text-purple-500" />
                  <span>{selectedBlog.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={18} className="text-purple-500" />
                  <span>{formatDate(selectedBlog.date)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={18} className="text-purple-500" />
                  <span>{selectedBlog.readTime} min read</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye size={18} className="text-purple-500" />
                  <span>{selectedBlog.views.toLocaleString()} views</span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-8">
                {selectedBlog.tags.map((tag) => (
                  <span
                    key={tag}
                    className={`px-3 py-1 rounded-full text-sm ${
                      darkMode
                        ? "bg-purple-500/20 text-purple-300"
                        : "bg-blue-500/20 text-blue-700"
                    }`}
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Content */}
              <div
                className={`prose max-w-none mb-12 leading-relaxed text-lg ${darkMode ? "text-gray-300" : "text-gray-700"}`}
              >
                {selectedBlog.content}
              </div>

              {/* Author Card */}
              <div
                className={`p-6 rounded-xl border-2 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-gray-100 border-gray-300"}`}
              >
                <p className="font-bold text-lg mb-2">About the Author</p>
                <p
                  className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}
                >
                  {selectedBlog.author} is a passionate web developer and
                  technical writer sharing insights on modern web development
                  practices.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default BlogsPage;
