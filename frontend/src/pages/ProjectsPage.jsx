import { useTheme } from "../context/ThemeContext";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import SkeletonLoader from "../components/SkeletonLoader";
import SkeletonWaveBlur from "../components/SkeletonWaveBar";
import {
  ExternalLink,
  Github,
  MoveRightIcon,
  Sparkles,
  ChevronDown,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Search,
  X,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";
import useScrollReveal from "../hooks/useScrollReveal";
import ProjectMedia from "../components/ProjectMedia";
import { useBackendStore } from "../store/useBackendStore";

function ProjectsPage() {
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [minLoadingTime, setMinLoadingTime] = useState(true);
  const [ripples, setRipples] = useState({});
  const [expandedId, setExpandedId] = useState(null);
  const [hoveredCardId, setHoveredCardId] = useState(null);
  const [videoLoadingStates, setVideoLoadingStates] = useState({});

  const [headerRef, headerVisible] = useScrollReveal({ threshold: 0.1 });
  const [filterRef, filterVisible] = useScrollReveal({ threshold: 0.1 });
  const [gridRef, gridVisible] = useScrollReveal({ threshold: 0.05 });

  useEffect(() => {
    // Minimum skeleton display time (prevents flashing)
    const minTimer = setTimeout(() => setMinLoadingTime(false), 800);
    return () => clearTimeout(minTimer);
  }, []);

  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState(["ALL"]);
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const handleViewportResize = () => {
      if (
        typeof window !== "undefined" &&
        window.innerWidth < 467 &&
        expandedId
      ) {
        setExpandedId(null);
      }
    };

    handleViewportResize();
    window.addEventListener("resize", handleViewportResize);
    return () => window.removeEventListener("resize", handleViewportResize);
  }, [expandedId]);

  // Search dropdown state (independent from main grid)
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownResults, setDropdownResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownLoading, setDropdownLoading] = useState(false);
  const searchRef = useRef(null);

  const { onBackendReady } = useBackendStore();

  // Main grid fetch — never affected by search
  useEffect(() => {
    const fetchProjects = async (isLive = false) => {
      setIsLoading(true);
      try {
        const { data } = await API.get("projects", {
          params: { page: currentPage, limit: 6, category: selectedCategory },
          preferNetwork: isLive,
        });
        if (data.success) {
          setProjects(data.data);
          if (data.categories) setCategories(data.categories);
          if (data.pagination) setTotalPages(data.pagination.totalPages);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects(false);

    const unsubscribe = onBackendReady(() => {
      fetchProjects(true);
    });

    return () => unsubscribe();
  }, [currentPage, selectedCategory, onBackendReady]);

  // Dropdown search — debounced 350ms, top 5 results only
  useEffect(() => {
    const q = searchQuery.trim();
    if (!q) {
      setDropdownResults([]);
      setShowDropdown(false);
      return;
    }
    const timer = setTimeout(async () => {
      setDropdownLoading(true);
      try {
        const { data } = await API.get("projects", {
          params: {
            search: q,
            limit: 5,
            page: 1,
            select: "title,slug,image,thumbnail,category,featured,mediaType,video",
          },
        });
        setDropdownResults(data.data || []);
        setShowDropdown(true);
      } catch {
        setDropdownResults([]);
      } finally {
        setDropdownLoading(false);
      }
    }, 350);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const projectCardStyle = `
    @property --ts-angle {
      syntax: "<angle>";
      initial-value: 0deg;
      inherits: false;
    }

    @property --ts-angle-2 {
      syntax: "<angle>";
      initial-value: 180deg;
      inherits: false;
    }

    @keyframes ts-spin {
      to { --ts-angle: 360deg; }
    }

    @keyframes ts-spin-2 {
      to { --ts-angle-2: 540deg; }
    }


    @keyframes glow-pulse {
      0%, 100% { opacity: 0.15; transform: scale(1); }
      50% { opacity: 0.25; transform: scale(1.05); }
    }

    @keyframes ripple {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }

    .ripple {
      position: absolute;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(255,255,255,0.6), rgba(255,255,255,0));
      pointer-events: none;
      animation: ripple 0.6s ease-out;
    }

    .project-card-grid {
      --mouse-x: 50%;
      --mouse-y: 50%;
      perspective: 1200px;
      transition: transform 0.1s ease-out;
      
    }

    /* Hide right arrow when card is narrower than 467px */
    @media (max-width: 466px) {
      .project-move-right {
        display: none !important;
      }
    }

    /* 3D Transform and Spotlight Effect */
    .project-card-inner {
      position: relative;
      height: 100%;
      width: 100%;
      transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
      transform-style: preserve-3d;
      background: ${
        darkMode ? "rgba(30, 41, 59, 0.4)" : "rgba(255, 255, 255, 0.4)"
      };
      border: 1px solid rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(15px);
    }

    /* Moving Spotlight */
    .project-card-inner::before {
      content: "";
      position: absolute;
      inset: 0;
      background: radial-gradient(
        800px circle at var(--mouse-x) var(--mouse-y), 
        ${darkMode ? "rgba(255, 255, 255, 0.06)" : "rgba(59, 130, 246, 0.1)"},
        transparent 40%
      );
      z-index: 3;
      pointer-events: none;
    }

    /* Rotating Conic Gradient Border Hover Effect */
    .project-card-inner::after {
      content: "";
      position: absolute;
      inset: -2px;
      border-radius: inherit;
      background: conic-gradient(
        from var(--ts-angle),
        transparent 55%,
        var(--ts-c1, rgba(6, 182, 212, 0.8)) 75%,
        var(--ts-c2, rgba(139, 92, 246, 0.8)) 88%,
        transparent 100%
      );
      animation: ts-spin 5s linear infinite;
      opacity: 1;
      transition: opacity 0.4s ease;
      z-index: -1;
      padding: 2px;
      -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
      pointer-events: none;
    }

    /* Second border line offset by 180 degrees */
    .project-card-border-2 {
      position: absolute;
      inset: -2px;
      border-radius: inherit;
      background: conic-gradient(
        from var(--ts-angle-2),
        transparent 55%,
        var(--ts-c1, rgba(6, 182, 212, 0.8)) 75%,
        var(--ts-c2, rgba(139, 92, 246, 0.8)) 88%,
        transparent 100%
      );
      animation: ts-spin-2 5s linear infinite;
      opacity: 1;
      transition: opacity 0.4s ease;
      z-index: -1;
      padding: 2px;
      -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
      pointer-events: none;
    }


    .project-card-grid:hover .project-card-inner::after {
      opacity: 1;
    }

    .project-card-grid:hover .project-card-inner {
      transform: rotateX(var(--rotate-x)) rotateY(var(--rotate-y));
    }

    /* Badge shimmer sweep reference from ts-pill */
    @keyframes ts-badge-shine {
      0%   { background-position: -200% center; }
      100% { background-position: 300% center; }
    }

    .project-card-shine {
      position: absolute;
      inset: 0;
      background: linear-gradient(
        105deg,
        transparent 20%,
        var(--ts-shine-color, rgba(255, 255, 255, 0.08)) 50%,
        transparent 80%
      );
      background-size: 200% 100%;
      background-repeat: no-repeat;
      background-position: -200% center;
      opacity: 0;
      transition: opacity 0.3s;
      z-index: 25;
      pointer-events: none;
      border-radius: inherit;
    }

    .project-card-grid:hover .project-card-shine {
      opacity: 1;
      animation: ts-badge-shine 0.7s ease-in 2 forwards;
    }

    /* Tech Badge */
    .tech-badge {
      transform: translateZ(20px);
      box-shadow: 0 5px 15px rgba(0,0,0,0.3);
    }

    @media (max-width: 500px) {
      .project-card-grid {
        height: auto !important;
        width: 100% !important;
        aspect-ratio: 16 / 9 !important;
      }
    }
  `;

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * 10;
    const rotateY = (-(x - centerX) / centerX) * 10;

    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);
    card.style.setProperty("--rotate-x", `${rotateX}deg`);
    card.style.setProperty("--rotate-y", `${rotateY}deg`);
  };

  const handleMouseLeave = (e) => {
    const card = e.currentTarget;
    card.style.setProperty("--rotate-x", `0deg`);
    card.style.setProperty("--rotate-y", `0deg`);
  };

  const handleClick = (e, projectId) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const size = 40;

    const rippleId = `${projectId}-${Date.now()}`;
    setRipples((prev) => ({
      ...prev,
      [rippleId]: { x, y, size },
    }));

    setTimeout(() => {
      setRipples((prev) => {
        const updated = { ...prev };
        delete updated[rippleId];
        return updated;
      });
    }, 600);

    setExpandedId(expandedId === projectId ? null : projectId);
  };

  const handleVideoLoaded = (projectId) => {
    setVideoLoadingStates((prev) => ({
      ...prev,
      [projectId]: true,
    }));
  };

  const paginatedProjects = projects;

  return (
    <>
      {isLoading ? (
        <SkeletonLoader type="projectspage" />
      ) : (
        <div
          className={`min-h-screen flex flex-col justify-between bg-pattern-subtle ${
            darkMode
              ? "dark bg-linear-to-br from-gray-950 via-gray-900 to-purple-950"
              : "bg-linear-to-br from-blue-50 via-white to-purple-50"
          }`}
        >
          <Navigation />
          <style>{projectCardStyle}</style>

          <section className="pt-24 pb-12 md:pt-28 md:pb-16 px-4 transition-all duration-300 relative overflow-hidden">
            {/* Background overlay effects */}
            <div
              className={`absolute top-0 right-0 w-96 h-96 pointer-events-none blur-3xl ${
                darkMode
                  ? "bg-linear-to-br from-purple-600/15 via-purple-500/5 to-transparent"
                  : "bg-linear-to-br from-blue-400/20 via-blue-300/10 to-transparent"
              }`}
              style={{
                borderRadius: "50%",
                animation: "glow-pulse 4s ease-in-out infinite",
              }}
            />

            <div
              className={`absolute bottom-0 left-0 w-80 h-80 pointer-events-none blur-3xl ${
                darkMode
                  ? "bg-linear-to-tr from-blue-600/10 via-blue-500/5 to-transparent"
                  : "bg-linear-to-tr from-purple-300/15 via-purple-200/5 to-transparent"
              }`}
              style={{
                borderRadius: "50%",
                animation: "glow-pulse 5s ease-in-out infinite 1s",
              }}
            />

            {/* ── Restructured Compact Header ── */}
            <div className="max-w-7xl mx-auto relative z-20 mb-8 md:mb-12">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 pb-6 border-b border-gray-200/10 dark:border-white/5">
                
                {/* Left Column: Title & Subtitle */}
                <div ref={headerRef} className="text-center md:text-left max-w-xl">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.22em] border backdrop-blur-md mb-3 reveal-init ${
                      darkMode
                        ? "bg-cyan-500/10 border-cyan-400/25 text-cyan-400"
                        : "bg-cyan-500/10 border-cyan-400/30 text-cyan-600"
                    } ${headerVisible ? "reveal-visible" : ""}`}
                  >
                    <Sparkles size={9} className="animate-pulse" />
                    Portfolio
                  </span>

                  <h1
                    className={`text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-2 transition-colors duration-300 reveal-init stagger-1 ${
                      darkMode ? "text-white" : "text-gray-900"
                    } ${headerVisible ? "reveal-visible" : ""}`}
                  >
                    All{" "}
                    <span
                      className={`text-transparent bg-clip-text ${
                        darkMode
                          ? "bg-gradient-to-r from-cyan-400 to-blue-500"
                          : "bg-gradient-to-r from-cyan-500 to-blue-600"
                      }`}
                    >
                      Projects
                    </span>
                  </h1>

                  <p
                    className={`text-sm md:text-base max-w-md md:max-w-none mx-auto md:mx-0 mb-2 transition-colors duration-300 reveal-init stagger-2 ${
                      darkMode ? "text-white/45" : "text-black/45"
                    } ${headerVisible ? "reveal-visible" : ""}`}
                  >
                    Built with passion — from frontend finesse to backend depth
                  </p>
                </div>

                {/* Right Column: Search bar and Category filters */}
                <div className="flex flex-col gap-4 w-full md:max-w-md">
                  {/* ── Search with Dropdown ── */}
                  <div
                    ref={searchRef}
                    className={`relative z-30 max-w-sm sm:max-w-md md:max-w-none mx-auto md:mx-0 w-full reveal-init stagger-3 ${headerVisible ? "reveal-visible" : ""}`}
                  >
                    <div
                      className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border backdrop-blur-md transition-all duration-300 ${
                        darkMode
                          ? "bg-white/5 border-white/10 focus-within:border-cyan-400/50 shadow-lg shadow-black/20"
                          : "bg-black/5 border-black/10 focus-within:border-cyan-500/40 shadow-lg shadow-black/5"
                      }`}
                    >
                      {dropdownLoading ? (
                        <div
                          className={`w-3.5 h-3.5 shrink-0 rounded-full border-2 animate-spin ${darkMode ? "border-white/10 border-t-cyan-400" : "border-black/10 border-t-cyan-600"}`}
                        />
                      ) : (
                        <Search
                          size={14}
                          className={`shrink-0 transition-colors ${
                            searchQuery
                              ? darkMode
                                ? "text-cyan-400"
                                : "text-cyan-600"
                              : darkMode
                                ? "text-slate-500"
                                : "text-slate-400"
                          }`}
                        />
                      )}
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                          if (!e.target.value.trim()) setShowDropdown(false);
                        }}
                        onFocus={() => {
                          if (dropdownResults.length > 0) setShowDropdown(true);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Escape") {
                            setShowDropdown(false);
                            setSearchQuery("");
                          }
                        }}
                        placeholder="Search projects, skills, tech..."
                        className={`flex-1 bg-transparent outline-none text-sm font-medium placeholder:font-normal placeholder:text-[13px] transition-colors whiteblink-remover ${
                          darkMode
                            ? "text-white placeholder:text-slate-600"
                            : "text-gray-900 placeholder:text-slate-400"
                        }`}
                      />
                      {searchQuery && (
                        <button
                          onClick={() => {
                            setSearchQuery("");
                            setShowDropdown(false);
                            setDropdownResults([]);
                          }}
                          className={`shrink-0 p-0.5 rounded-full transition-all cursor-pointer ${
                            darkMode
                              ? "text-slate-500 hover:text-white hover:bg-white/10"
                              : "text-slate-400 hover:text-gray-900 hover:bg-black/10"
                          }`}
                        >
                          <X size={12} />
                        </button>
                      )}
                    </div>

                    {/* Dropdown */}
                    {showDropdown && (
                      <div
                        className={`absolute left-0 right-0 top-full mt-2 rounded-xl border overflow-hidden z-50 backdrop-blur-xl shadow-2xl ${
                          darkMode
                            ? "bg-slate-950/95 border-white/10"
                            : "bg-white/95 border-black/10"
                        }`}
                      >
                        {dropdownResults.length === 0 ? (
                          <div
                            className={`px-4 py-5 text-center text-xs font-medium ${
                              darkMode ? "text-slate-500" : "text-slate-400"
                            }`}
                          >
                            No results for &ldquo;{searchQuery}&rdquo;
                          </div>
                        ) : (
                          <ul>
                            {dropdownResults.map((p, i) => (
                              <li key={p._id}>
                                <button
                                  onClick={() => {
                                    navigate(`/projects/${p.slug || p._id}`);
                                    setShowDropdown(false);
                                    setSearchQuery("");
                                  }}
                                  className={`group w-full flex items-center gap-3 pl-3.5 pr-3.5 py-2.5 text-left transition-all duration-300 ease-out cursor-pointer ${
                                    i !== dropdownResults.length - 1
                                      ? darkMode
                                        ? "border-b border-white/5"
                                        : "border-b border-black/5"
                                      : ""
                                  } ${
                                    p.featured
                                      ? darkMode
                                        ? "hover:bg-amber-500/[0.06] hover:pl-[18px]"
                                        : "hover:bg-amber-500/[0.04] hover:pl-[18px]"
                                      : darkMode
                                        ? "hover:bg-cyan-500/[0.06] hover:pl-[18px]"
                                        : "hover:bg-cyan-500/[0.04] hover:pl-[18px]"
                                  }`}
                                >
                                  {/* Thumbnail */}
                                  <div
                                    className={`w-16 aspect-video shrink-0 shadow-sm shadow-gray-950/75 overflow-hidden border transition-all duration-300 bg-black flex items-center justify-center ${
                                      darkMode
                                        ? "border-white/10"
                                        : "border-black/10"
                                    }`}
                                  >
                                    {p.mediaType || p.image || p.thumbnail ? (
                                      <ProjectMedia
                                        videoSrc={p.video}
                                        thumbnailSrc={p.image || p.thumbnail}
                                        mediaType={p.mediaType}
                                        alt={p.title}
                                        className="w-full h-full"
                                        groupHoverScale={true}
                                      />
                                    ) : (
                                      <div
                                        className={`w-full h-full flex items-center justify-center ${
                                          p.featured
                                            ? "text-amber-400"
                                            : "text-cyan-400"
                                        }`}
                                      >
                                        <Sparkles size={14} />
                                      </div>
                                    )}
                                  </div>
                                  {/* Info */}
                                  <div className="flex-1 min-w-0">
                                    <p
                                      className={`text-xs font-semibold truncate ${
                                        darkMode ? "text-white" : "text-gray-900"
                                      }`}
                                    >
                                      {p.title}
                                    </p>
                                    {p.category && (
                                      <p
                                        className={`text-[10px] font-medium mt-0.5 ${
                                          p.featured
                                            ? darkMode
                                              ? "text-amber-400/70"
                                              : "text-amber-600/70"
                                            : darkMode
                                              ? "text-cyan-400/70"
                                              : "text-cyan-600/70"
                                        }`}
                                      >
                                        {p.category}
                                      </p>
                                    )}
                                  </div>
                                  <ArrowUpRight
                                    size={18}
                                    className={`transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${
                                      p.featured
                                        ? darkMode
                                          ? "text-amber-400/80 group-hover:text-amber-400"
                                          : "text-amber-600/80 group-hover:text-amber-500"
                                        : darkMode
                                          ? "text-cyan-400/80 group-hover:text-cyan-400"
                                          : "text-cyan-700/80 group-hover:text-cyan-600"
                                    }`}
                                  />
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                  </div>

                  {/* ── Category Filter ── */}
                  <div
                    ref={filterRef}
                    className={`flex flex-wrap md:justify-end gap-1.5 relative z-10 w-full reveal-init ${filterVisible ? "reveal-visible" : ""}`}
                  >
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => {
                          setSelectedCategory(cat);
                          setCurrentPage(1);
                        }}
                        className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold tracking-wide transition-all duration-200 backdrop-blur-md cursor-pointer border ${
                          selectedCategory === cat
                            ? "bg-cyan-500/25 border-cyan-400/60 text-cyan-300 shadow-sm shadow-cyan-500/10"
                            : darkMode
                              ? "bg-white/5 border-white/8 text-slate-400 hover:bg-white/10 hover:text-white"
                              : "bg-black/5 border-black/8 text-slate-600 hover:bg-black/10 hover:text-black"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Projects Grid */}
            <div ref={gridRef} className={`flex flex-wrap justify-evenly gap-8 max-[500px]:gap-4 reveal-init stagger-1 ${gridVisible ? "reveal-visible" : ""}`}>
              {!isLoading && paginatedProjects.length === 0 && (
                <div className="w-full py-24 flex flex-col items-center justify-center text-center">
                  <div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-5 border ${
                      darkMode
                        ? "bg-white/5 border-white/10"
                        : "bg-black/5 border-black/10"
                    }`}
                  >
                    <Search
                      size={28}
                      className={darkMode ? "text-slate-600" : "text-slate-400"}
                    />
                  </div>
                  <p
                    className={`text-lg font-bold mb-2 ${darkMode ? "text-white/60" : "text-black/60"}`}
                  >
                    No projects found
                  </p>
                  <p
                    className={`text-sm ${darkMode ? "text-white/30" : "text-black/30"}`}
                  >
                    {debouncedSearch
                      ? `No results for "${debouncedSearch}" — try a different keyword`
                      : "No projects in this category yet"}
                  </p>
                  {debouncedSearch && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className={`mt-5 px-4 py-2 rounded-xl text-xs font-bold tracking-wide border transition-all cursor-pointer ${
                        darkMode
                          ? "bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10"
                          : "bg-black/5 border-black/10 text-slate-600 hover:text-black hover:bg-black/10"
                      }`}
                    >
                      Clear search
                    </button>
                  )}
                </div>
              )}
              {paginatedProjects.map((project) => {
                const c1 = project.featured ? "#f59e0b" : "#06b6d4";
                const c2 = project.featured ? "#ec4899" : "#3b82f6";
                return (
                  <div
                    key={project._id}
                    onMouseMove={handleMouseMove}
                    onMouseEnter={() => setHoveredCardId(project._id)}
                    onMouseLeave={(e) => {
                      handleMouseLeave(e);
                      setHoveredCardId(null);
                    }}
                    onClick={() =>
                      navigate(`/projects/${project.slug || project._id}`)
                    }
                    className="project-card-grid relative p-2 rounded-none group w-full md:w-[440px] lg:w-[480px] h-auto aspect-video isolate z-0 cursor-pointer"
                    style={{
                      "--ts-c1": c1,
                      "--ts-c2": c2,
                      "--ts-shine-color": project.featured
                        ? "rgba(245, 158, 11, 0.18)"
                        : "rgba(6, 182, 212, 0.18)",
                    }}
                  >
                    <div className="project-card-inner shadow-md shadow-gray-200/70 dark:shadow-black/70 rounded-none flex flex-col relative h-full z-10">
                      {/* Extra shimmer sweep effect on hover */}
                      <div className="project-card-shine" />
                      {/* Second border line offset by 180 degrees */}
                      <div className="project-card-border-2" />
                      {/* Glassy Featured Hover Badge (Featured projects only, hidden when expanded) */}
                      {project.featured && expandedId !== project._id && (
                        <div className="absolute top-4 right-4 z-30 flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-[8px] font-black tracking-widest uppercase transition-all duration-300 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 text-neutral-950 border border-amber-300 shadow-md shadow-amber-500/30">
                          <Sparkles
                            size={8}
                            className="animate-pulse text-neutral-950 shrink-0"
                          />
                          <span>FEATURED</span>
                        </div>
                      )}
                      {/* Glassy Category Hover Badge (Hidden when expanded) */}
                      {project.category && expandedId !== project._id && (
                        <div
                          className={`absolute -top-px -left-px z-30 px-3 py-1.5 rounded-br-md text-[8px] font-black tracking-widest uppercase transition-all duration-300 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 bg-neutral-950/95 border-r border-b backdrop-blur-xs max-[466px]:px-2 max-[466px]:py-1 max-[466px]:text-[7px] ${
                            project.featured
                              ? "border-amber-500/40 text-amber-300"
                              : "border-cyan-500/40 text-cyan-300"
                          }`}
                        >
                          <span className="font-semibold uppercase tracking-[0.25em] max-[466px]:tracking-[0.15em]">
                            {project.category}
                          </span>
                        </div>
                      )}
                      {/* Media Wrapper (handles clipping for backgrounds & overlays) */}
                      <div className="absolute inset-0 rounded-none overflow-hidden z-0 bg-black">
                        {/* Ripple Container */}
                        <div className="absolute inset-0 overflow-hidden pointer-events-none z-25">
                          {ripples[`${project._id}`] &&
                            Object.entries(ripples)
                              .filter(([key]) =>
                                key.startsWith(`${project._id}-`),
                              )
                              .map(([key, ripple]) => (
                                <div
                                  key={key}
                                  className="ripple"
                                  style={{
                                    left: `${ripple.x}px`,
                                    top: `${ripple.y}px`,
                                    width: `${ripple.size}px`,
                                    height: `${ripple.size}px`,
                                    marginLeft: `-${ripple.size / 2}px`,
                                    marginTop: `-${ripple.size / 2}px`,
                                  }}
                                />
                              ))}
                        </div>

                        {/* Video/Image Background */}
                        <ProjectMedia
                          videoSrc={project.video}
                          thumbnailSrc={project.image}
                          mediaType={project.mediaType}
                          alt={project.title}
                          className="absolute inset-0 w-full h-full"
                          onLoad={() => handleVideoLoaded(project._id)}
                          onLoadedData={() => handleVideoLoaded(project._id)}
                          isHovered={hoveredCardId === project._id}
                        />

                        {/* Skeleton Wave Bar - Shows while video is loading */}
                        {!videoLoadingStates[project._id] && (
                          <SkeletonWaveBlur className="absolute w-full h-full inset-0 z-10" />
                        )}

                        {/* Overlay for light mode styling */}
                        <div
                          className={`absolute inset-0 z-10 transition-opacity duration-300 ${
                            expandedId === project._id
                              ? darkMode
                                ? "bg-black/80 backdrop-blur-md"
                                : "bg-black/60 backdrop-blur-md"
                              : ""
                          }`}
                        />
                      </div>

                      {/* Content Area */}
                      <div
                        className={`relative z-20 transition-all duration-500 flex flex-col ${
                          expandedId === project._id
                            ? "h-full p-6"
                            : "mt-auto hidden max-lg:flex group-hover:flex pl-3 pb-2 bg-gray-950/85 backdrop-blur-xs"
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.innerWidth >= 467) {
                            handleClick(e, project._id);
                          }
                        }}
                      >
                        <div className="flex justify-between items-center w-full pr-3 mb-1 max-[466px]:pr-1 max-[466px]:mb-0 max-[466px]:gap-2">
                          <h3
                            className={`text-base font-semibold font-sans tracking-wide transition-colors duration-300 max-[466px]:text-[13px] max-[466px]:leading-tight max-[466px]:line-clamp-1 ${
                              project.featured
                                ? "text-amber-400"
                                : "text-cyan-400"
                            }`}
                          >
                            {project.title}
                          </h3>
                          {expandedId !== project._id && (
                            <MoveRightIcon
                              size={16}
                              className={`project-move-right transition-all duration-300 shrink-0 transform group-hover:translate-x-1 ${
                                project.featured
                                  ? "text-amber-400"
                                  : "text-cyan-400"
                              }`}
                            />
                          )}
                        </div>

                        {expandedId === project._id ? (
                          <div className="flex flex-col h-full space-y-4 animate-in fade-in zoom-in-95 duration-300">
                            <p className="text-slate-300 dark:text-slate-300 font-normal font-sans text-xs tracking-normal line-clamp-4 leading-relaxed">
                              {project.shortDescription || project.description}
                            </p>

                            {/* Tags (Only 4 skills) */}
                            <div className="flex flex-wrap gap-2 pt-2">
                              {project.skills?.slice(0, 4).map((tag, idx) => (
                                <span
                                  key={idx}
                                  className={`tech-badge px-2.5 py-0.5 border border-dashed rounded text-[9px] font-mono tracking-wider transition-all duration-300 ${
                                    project.featured
                                      ? "text-amber-400 border-amber-500/40 hover:border-amber-300 hover:bg-amber-400/10"
                                      : "text-cyan-400 border-cyan-500/40 hover:border-cyan-300 hover:bg-cyan-400/10"
                                  }`}
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>

                            {/* Buttons */}
                            <div className="flex justify-between items-center mt-auto w-full">
                              <div className="flex gap-2">
                                {project.demoLink && (
                                  <a
                                    href={project.demoLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className={`group relative px-2.5 py-1.5 rounded-lg transition-all duration-300 transform active:scale-90 overflow-hidden flex items-center justify-center gap-1 text-[10px] font-medium ${
                                      project.featured
                                        ? darkMode
                                          ? "backdrop-blur-md bg-amber-500/15 border border-amber-500/30 hover:border-amber-400/60 hover:-translate-y-0.5 drop-shadow-sm text-amber-300 hover:text-amber-200"
                                          : "backdrop-blur-md bg-amber-400/15 border border-amber-400/40 hover:border-amber-300/70 hover:-translate-y-0.5 drop-shadow-sm text-amber-600 hover:text-amber-500"
                                        : darkMode
                                          ? "backdrop-blur-md bg-cyan-500/15 border border-cyan-500/30 hover:border-cyan-400/60 hover:-translate-y-0.5 drop-shadow-sm text-cyan-300 hover:text-cyan-200"
                                          : "backdrop-blur-md bg-cyan-400/15 border border-cyan-400/40 hover:border-cyan-300/70 hover:-translate-y-0.5 drop-shadow-sm text-cyan-500 hover:text-cyan-400"
                                    }`}
                                    title="View Live Demo"
                                  >
                                    <ExternalLink
                                      size={12}
                                      className="transition-all duration-300 group-hover:scale-110"
                                    />
                                    <span>DEMO</span>
                                  </a>
                                )}
                                {project.githubLink && (
                                  <a
                                    href={project.githubLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className={`group relative px-2.5 py-1.5 rounded-lg transition-all duration-300 transform active:scale-90 overflow-hidden flex items-center justify-center gap-1 text-[10px] font-mono font-medium ${
                                      project.featured
                                        ? darkMode
                                          ? "backdrop-blur-md bg-amber-500/15 border border-amber-500/30 hover:border-amber-400/60 hover:-translate-y-0.5 drop-shadow-sm text-amber-300 hover:text-amber-200"
                                          : "backdrop-blur-md bg-amber-400/15 border border-amber-400/40 hover:border-amber-300/70 hover:-translate-y-0.5 drop-shadow-sm text-amber-600 hover:text-amber-500"
                                        : darkMode
                                          ? "backdrop-blur-md bg-cyan-500/15 border border-cyan-500/30 hover:border-cyan-400/60 hover:-translate-y-0.5 drop-shadow-sm text-cyan-300 hover:text-cyan-200"
                                          : "backdrop-blur-md bg-cyan-400/15 border border-cyan-400/40 hover:border-cyan-300/70 hover:-translate-y-0.5 drop-shadow-sm text-cyan-500 hover:text-cyan-400"
                                    }`}
                                    title="View Code"
                                  >
                                    <Github
                                      size={12}
                                      className="transition-all duration-300 group-hover:scale-110"
                                    />
                                    <span>CODE</span>
                                  </a>
                                )}
                              </div>

                              <Link
                                to={`/projects/${project.slug || project._id}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                }}
                                className={`group relative px-2.5 py-1.5 rounded-lg text-nowrap transition-all duration-300 transform active:scale-90 overflow-hidden flex items-center justify-center gap-1 text-[10px] font-medium cursor-pointer ${
                                  project.featured
                                    ? darkMode
                                      ? "backdrop-blur-md bg-amber-500/15 border border-amber-500/30 hover:border-amber-400/60 hover:-translate-y-0.5 drop-shadow-sm text-amber-300 hover:text-amber-200"
                                      : "backdrop-blur-md bg-amber-400/15 border border-amber-400/40 hover:border-amber-300/70 hover:-translate-y-0.5 drop-shadow-sm text-amber-600 hover:text-amber-500"
                                    : darkMode
                                      ? "backdrop-blur-md bg-cyan-500/15 border border-cyan-500/30 hover:border-cyan-400/60 hover:-translate-y-0.5 drop-shadow-sm text-cyan-300 hover:text-cyan-200"
                                      : "backdrop-blur-md bg-cyan-400/15 border border-cyan-400/40 hover:border-cyan-300/70 hover:-translate-y-0.5 drop-shadow-sm text-cyan-500 hover:text-cyan-400"
                                }`}
                                title="View Full Project Details"
                              >
                                <span>MORE INFO</span>
                                <ArrowUpRight
                                  size={12}
                                  className="transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                                />
                              </Link>
                            </div>
                          </div>
                        ) : (
                          <div className="w-full text-xs font-normal font-sans text-slate-300 dark:text-slate-300 pr-3 pb-1 line-clamp-1 leading-snug max-[466px]:text-[10px] max-[466px]:pr-2 max-[466px]:pb-0.5 max-[466px]:line-clamp-1">
                            {project.shortDescription || project.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ── Pagination ── */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-10 mb-2 relative z-10 flex-wrap">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1}
                  aria-label="Previous page"
                  className={`p-2 rounded-lg border transition-all duration-200 backdrop-blur-md cursor-pointer ${
                    currentPage === 1
                      ? darkMode
                        ? "bg-white/5 border-white/5 text-slate-700 opacity-40 cursor-not-allowed"
                        : "bg-black/5 border-black/5 text-slate-400 opacity-40 cursor-not-allowed"
                      : darkMode
                        ? "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white"
                        : "bg-black/5 border-black/10 text-slate-700 hover:bg-black/10 hover:text-black"
                  }`}
                >
                  <ChevronLeft size={15} />
                </button>

                {/* Page numbers — hidden on xs, visible sm+ */}
                <div className="hidden sm:flex items-center gap-1.5">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-8 h-8 rounded-lg text-xs font-bold transition-all duration-200 backdrop-blur-md cursor-pointer border ${
                          currentPage === page
                            ? "bg-cyan-500/25 border-cyan-400/60 text-cyan-300 shadow-sm shadow-cyan-500/10"
                            : darkMode
                              ? "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-white"
                              : "bg-black/5 border-black/10 text-slate-600 hover:bg-black/10 hover:text-black"
                        }`}
                      >
                        {page}
                      </button>
                    ),
                  )}
                </div>

                {/* Compact page counter — xs only */}
                <span
                  className={`sm:hidden text-xs font-semibold px-3 py-1.5 rounded-lg border ${
                    darkMode
                      ? "bg-white/5 border-white/8 text-slate-300"
                      : "bg-black/5 border-black/8 text-slate-600"
                  }`}
                >
                  {currentPage}
                  <span
                    className={darkMode ? " text-slate-600" : " text-slate-400"}
                  >
                    {" "}
                    /{" "}
                  </span>
                  {totalPages}
                </span>

                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={currentPage === totalPages}
                  aria-label="Next page"
                  className={`p-2 rounded-lg border transition-all duration-200 backdrop-blur-md cursor-pointer ${
                    currentPage === totalPages
                      ? darkMode
                        ? "bg-white/5 border-white/5 text-slate-700 opacity-40 cursor-not-allowed"
                        : "bg-black/5 border-black/5 text-slate-400 opacity-40 cursor-not-allowed"
                      : darkMode
                        ? "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white"
                        : "bg-black/5 border-black/10 text-slate-700 hover:bg-black/10 hover:text-black"
                  }`}
                >
                  <ChevronRight size={15} />
                </button>
              </div>
            )}
          </section>

          <Footer />
        </div>
      )}
    </>
  );
}

export default ProjectsPage;
