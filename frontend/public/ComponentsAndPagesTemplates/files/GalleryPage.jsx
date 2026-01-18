import { useState, useEffect, useRef, useCallback } from "react";
import { X, ChevronLeft, ChevronRight, Grid3x3, LayoutGrid, Search, Share2, Download } from "lucide-react";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import { useTheme } from "../context/ThemeContext";

const GalleryPage = () => {
  const { darkMode } = useTheme();
  const [selectedItem, setSelectedItem] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [filter, setFilter] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [hoveredId, setHoveredId] = useState(null);
  const [loadingStates, setLoadingStates] = useState({});
  const observerTarget = useRef(null);

  // Enhanced gallery items with metadata
  const galleryItems = [
    {
      id: 1,
      type: "image",
      src: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&q=80",
      thumb: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&q=20&blur=10",
      alt: "Project showcase 1",
      category: "projects",
      title: "Website Redesign",
      description: "Modern responsive web design project",
      tags: ["web", "design", "responsive"],
    },
    {
      id: 2,
      type: "video",
      src: "https://videos.pexels.com/video-files/3535919/3535919-sd_640_360_25fps.mp4",
      thumb: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=400&q=80",
      alt: "Demo video 1",
      category: "demo",
      title: "Interactive Demo",
      description: "Smooth animations and interactions",
      tags: ["animation", "interactive", "demo"],
    },
    {
      id: 3,
      type: "image",
      src: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&q=80",
      thumb: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&q=20&blur=10",
      alt: "Design mockup",
      category: "design",
      title: "UI Components",
      description: "Custom component library design",
      tags: ["ui", "components", "design"],
    },
    {
      id: 4,
      type: "video",
      src: "https://videos.pexels.com/video-files/1409899/1409899-sd_640_360_25fps.mp4",
      thumb: "https://images.unsplash.com/photo-1516321720402-e06e8b43bc11?w=400&q=80",
      alt: "Process video",
      category: "demo",
      title: "Development Process",
      description: "Behind the scenes workflow",
      tags: ["process", "development", "timelapse"],
    },
    {
      id: 5,
      type: "image",
      src: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&q=80",
      thumb: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&q=20&blur=10",
      alt: "UI design",
      category: "design",
      title: "Dashboard Design",
      description: "Analytics dashboard interface",
      tags: ["ui", "dashboard", "analytics"],
    },
    {
      id: 6,
      type: "image",
      src: "https://images.unsplash.com/photo-1554050857-4d192d92225b?w=1200&q=80",
      thumb: "https://images.unsplash.com/photo-1554050857-4d192d92225b?w=400&q=20&blur=10",
      alt: "Web development",
      category: "projects",
      title: "Full Stack App",
      description: "Complete web application",
      tags: ["fullstack", "web", "projects"],
    },
    {
      id: 7,
      type: "video",
      src: "https://videos.pexels.com/video-files/2583852/2583852-sd_640_360_24fps.mp4",
      thumb: "https://images.unsplash.com/photo-1578375050468-d5b63b1688e9?w=400&q=80",
      alt: "Animation demo",
      category: "demo",
      title: "Advanced Animations",
      description: "Complex motion and transitions",
      tags: ["animation", "advanced", "effects"],
    },
    {
      id: 8,
      type: "image",
      src: "https://images.unsplash.com/photo-1611532736579-6b16e2b50449?w=1200&q=80",
      thumb: "https://images.unsplash.com/photo-1611532736579-6b16e2b50449?w=400&q=20&blur=10",
      alt: "Mobile app",
      category: "projects",
      title: "Mobile App Design",
      description: "iOS and Android application UI",
      tags: ["mobile", "app", "ux"],
    },
  ];

  const categories = ["all", "projects", "design", "demo"];
  
  // Advanced filtering with search
  const filtered = galleryItems.filter((item) => {
    const matchesCategory = filter === "all" || item.category === filter;
    const matchesSearch =
      searchTerm === "" ||
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );
    return matchesCategory && matchesSearch;
  });

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedItem) return;
      if (e.key === "Escape") setSelectedItem(null);
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedItem, lightboxIndex, filtered.length]);

  const handlePrev = useCallback(() => {
    setLightboxIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
  }, [filtered.length]);

  const handleNext = useCallback(() => {
    setLightboxIndex((prev) => (prev + 1) % filtered.length);
  }, [filtered.length]);

  const handleItemClick = (index) => {
    setSelectedItem(filtered[index]);
    setLightboxIndex(index);
  };

  const handleImageLoad = (id) => {
    setLoadingStates((prev) => ({ ...prev, [id]: false }));
  };

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-300 ${
        darkMode
          ? "bg-linear-to-br from-gray-950 via-gray-900 to-purple-950 text-white"
          : "bg-linear-to-br from-blue-50 via-white to-purple-50 text-gray-900"
      }`}
    >
      <Navigation />

      <main className="flex-1 px-3 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="max-w-7xl mx-auto">
          {/* Header with animated elements */}
          <div className="mb-12 text-center space-y-4 animate-fadeIn">
            <div className="inline-flex items-center justify-center">
              <div className="h-1 w-12 bg-linear-to-r from-transparent to-blue-500 rounded-full"></div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mx-4 bg-clip-text text-transparent bg-linear-to-r from-blue-500 via-purple-500 to-pink-500">
                Gallery
              </h1>
              <div className="h-1 w-12 bg-linear-to-l from-transparent to-pink-500 rounded-full"></div>
            </div>
            <p
              className={`text-lg ${
                darkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Explore my projects, designs, and creative work
            </p>
          </div>

          {/* Controls Section */}
          <div className="mb-10 space-y-4 sm:space-y-0">
            {/* Search Bar */}
            <div className="relative mb-6">
              <Search
                size={20}
                className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${
                  darkMode ? "text-gray-500" : "text-gray-400"
                }`}
              />
              <input
                type="text"
                placeholder="Search by title, description, or tags..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setSelectedItem(null);
                }}
                className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 transition-all duration-300 placeholder-opacity-70 ${
                  darkMode
                    ? "bg-gray-800 border-gray-700 text-white hover:border-purple-500 focus:border-purple-500"
                    : "bg-white border-gray-200 text-gray-900 hover:border-blue-500 focus:border-blue-500"
                } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
              />
            </div>

            {/* Filter and View Toggle */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              {/* Filter Buttons */}
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setFilter(cat);
                      setSelectedItem(null);
                    }}
                    className={`px-4 sm:px-6 py-2 rounded-full font-semibold text-sm sm:text-base transition-all duration-300 capitalize transform hover:scale-105 ${
                      filter === cat
                        ? "bg-linear-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-purple-500/30"
                        : darkMode
                          ? "bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* View Mode Toggle */}
              <div className="flex gap-2 bg-gray-800 dark:bg-gray-800 light:bg-gray-200 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded transition-all ${
                    viewMode === "grid"
                      ? "bg-purple-600 text-white"
                      : darkMode
                        ? "text-gray-400 hover:text-white"
                        : "text-gray-600 hover:text-gray-900"
                  }`}
                  title="Grid View"
                >
                  <Grid3x3 size={20} />
                </button>
                <button
                  onClick={() => setViewMode("masonry")}
                  className={`p-2 rounded transition-all ${
                    viewMode === "masonry"
                      ? "bg-purple-600 text-white"
                      : darkMode
                        ? "text-gray-400 hover:text-white"
                        : "text-gray-600 hover:text-gray-900"
                  }`}
                  title="Masonry View"
                >
                  <LayoutGrid size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Gallery Grid with dynamic layout */}
          <div
            className={`${
              viewMode === "masonry"
                ? "columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 sm:gap-6 space-y-4 sm:space-y-6"
                : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
            }`}
          >
            {filtered.map((item, index) => (
              <div
                key={item.id}
                onClick={() => handleItemClick(index)}
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
                className={`group cursor-pointer relative overflow-hidden rounded-xl transition-all duration-500 transform hover:scale-105 ${
                  viewMode === "masonry" ? "break-inside-avoid" : "aspect-square"
                } ${
                  darkMode
                    ? "hover:shadow-2xl hover:shadow-purple-500/30"
                    : "hover:shadow-2xl hover:shadow-blue-500/20"
                }`}
              >
                {/* Background Image/Video with blur-up effect */}
                <div className="w-full h-full relative bg-linear-to-br from-gray-800 to-gray-900">
                  {/* Blurred thumbnail */}
                  {item.type === "image" && (
                    <img
                      src={item.thumb}
                      alt={`${item.alt} blur`}
                      className="absolute inset-0 w-full h-full object-cover blur-sm"
                      aria-hidden="true"
                    />
                  )}

                  {/* Main content */}
                  {item.type === "image" ? (
                    <img
                      src={item.src}
                      alt={item.alt}
                      onLoad={() => handleImageLoad(item.id)}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <video
                      src={item.src}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  )}

                  {/* Gradient Overlay */}
                  <div
                    className={`absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300`}
                  ></div>

                  {/* Content on Hover */}
                  <div className="absolute inset-0 flex flex-col justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {/* Top - Title and Type */}
                    <div>
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-white font-bold text-lg mb-1">
                            {item.title}
                          </h3>
                          <p className="text-gray-200 text-sm">
                            {item.description}
                          </p>
                        </div>
                        <div className="px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md bg-white/20 text-white capitalize">
                          {item.type}
                        </div>
                      </div>
                    </div>

                    {/* Bottom - Tags and Actions */}
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                        {item.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 text-xs rounded-full bg-white/10 text-white backdrop-blur-sm"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigator.clipboard.writeText(item.src);
                          }}
                          className="flex-1 px-3 py-2 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-all text-sm font-medium backdrop-blur-sm"
                        >
                          <Share2 size={16} className="inline mr-1" />
                          Share
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const link = document.createElement("a");
                            link.href = item.src;
                            link.download = `${item.title}.jpg`;
                            link.click();
                          }}
                          className="flex-1 px-3 py-2 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-all text-sm font-medium backdrop-blur-sm"
                        >
                          <Download size={16} className="inline mr-1" />
                          Download
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Play indicator for videos */}
                  {item.type === "video" && hoveredId !== item.id && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-white text-4xl bg-white/20 p-4 rounded-full backdrop-blur-sm hover:bg-white/30 transition-all">
                        ▶
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* No Results */}
          {filtered.length === 0 && (
            <div className="text-center py-20">
              <p
                className={`text-lg ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                No items found matching your criteria
              </p>
            </div>
          )}

          {/* Results Counter */}
          <div className="text-center mt-10">
            <p
              className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}
            >
              Showing {filtered.length} of {galleryItems.length} items
            </p>
          </div>
        </div>
      </main>

      {/* Advanced Lightbox Modal */}
      {selectedItem && (
        <div
          className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="relative w-full h-full flex flex-col items-center justify-center max-w-6xl max-h-[95vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Info */}
            <div className="absolute top-4 sm:top-6 left-4 sm:left-6 right-4 sm:right-6 flex justify-between items-start z-10">
              <div className="hidden sm:block text-white">
                <h2 className="font-bold text-xl mb-1">
                  {selectedItem.title}
                </h2>
                <p className="text-gray-300 text-sm">{selectedItem.description}</p>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setSelectedItem(null)}
                className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all text-white backdrop-blur-sm"
                aria-label="Close"
              >
                <X size={28} />
              </button>
            </div>

            {/* Navigation Buttons */}
            {filtered.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute left-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all text-white z-10 transform hover:scale-110"
                  aria-label="Previous"
                >
                  <ChevronLeft size={32} />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all text-white z-10 transform hover:scale-110"
                  aria-label="Next"
                >
                  <ChevronRight size={32} />
                </button>
              </>
            )}

            {/* Content Container */}
            <div className="w-full h-full flex items-center justify-center mt-16 mb-16">
              {selectedItem.type === "image" ? (
                <img
                  src={selectedItem.src}
                  alt={selectedItem.alt}
                  className="max-w-full max-h-full object-contain rounded-lg animate-zoomIn"
                />
              ) : (
                <video
                  src={selectedItem.src}
                  autoPlay
                  loop
                  muted
                  playsInline
                  controls
                  className="max-w-full max-h-full object-contain rounded-lg animate-zoomIn"
                />
              )}
            </div>

            {/* Footer Info */}
            <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 flex justify-between items-end gap-4">
              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {selectedItem.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-xs rounded-full bg-white/10 text-white backdrop-blur-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Counter */}
              {filtered.length > 1 && (
                <div className="px-4 py-2 rounded-full bg-white/20 text-white text-sm font-medium backdrop-blur-sm whitespace-nowrap">
                  {lightboxIndex + 1} / {filtered.length}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes zoomIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-zoomIn {
          animation: zoomIn 0.3s ease-out;
        }

        .dark {
          color-scheme: dark;
        }

        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }
      `}</style>

      <Footer />
    </div>
  );
};

export default GalleryPage;
