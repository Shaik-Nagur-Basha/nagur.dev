import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  ExternalLink,
  Github,
  FolderKanban,
  X,
  Layers,
  Sparkles,
  MoveRightIcon,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAdminStore } from "../../store/useAdminStore";
import ProjectForm from "../../components/admin/ProjectForm";
import ConfirmDialog from "../../components/admin/ConfirmDialog";
import { toast } from "react-toastify";
import { cn } from "../../utils/cn";
import API from "../../api/axios";
import { useTheme } from "../../context/ThemeContext";
import ProjectMedia from "../../components/ProjectMedia";

const ProjectManagement = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const [isFormOpen, setIsFormOpen] = useState(
    location?.state?.openForm || false,
  );
  const [editingProject, setEditingProject] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const {
    projects,
    categories,
    totalPages,
    fetchProjects,
    deleteProject,
    loading,
  } = useAdminStore();
  const [expandedId, setExpandedId] = useState(null);
  const [hoveredCardId, setHoveredCardId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [showDraftOnly, setShowDraftOnly] = useState(false);

  // Dropdown search state
  const [dropdownResults, setDropdownResults] = useState([]);
  const [dropdownLoading, setDropdownLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef(null);

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

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * 8;
    const rotateY = (-(x - centerX) / centerX) * 8;
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

  const handleExpandClick = (e, id) => {
    e.stopPropagation();
    setExpandedId((prev) => (prev === id ? null : id));
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, showDraftOnly]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const loadProjects = () => {
    fetchProjects({
      page: currentPage,
      limit: 6,
      category: selectedCategory,
      search: debouncedSearch.trim(),
      status: showDraftOnly ? "Draft" : "all",
      isAdmin: "true",
    });
  };

  useEffect(() => {
    loadProjects();
  }, [
    fetchProjects,
    currentPage,
    selectedCategory,
    showDraftOnly,
    debouncedSearch,
  ]);

  useEffect(() => {
    const handleViewportResize = () => {
      if (window.innerWidth < 467 && expandedId) {
        setExpandedId(null);
      }
    };

    handleViewportResize();
    window.addEventListener("resize", handleViewportResize);

    return () => window.removeEventListener("resize", handleViewportResize);
  }, [expandedId]);

  // Reset state after navigation or handle deep-links
  useEffect(() => {
    if (location?.state?.openForm) {
      setIsFormOpen(true);
      window.history.replaceState({}, document.title);
    }
    if (location?.state?.expandId) {
      setExpandedId(location.state.expandId);
      // Optional: Clear state after handling
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleDelete = async (id) => {
    // open confirm modal instead of native confirm
    setPendingDeleteId(id);
    setConfirmOpen(true);
  };

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  const confirmDelete = async () => {
    if (!pendingDeleteId) return;
    setConfirmOpen(false);
    const result = await deleteProject(pendingDeleteId);
    setPendingDeleteId(null);
    if (result.success) toast.success("PROJECT DELETED");
    else toast.error(result.error);
  };

  const q = searchQuery.trim().toLowerCase();

  const searchInObject = (obj, query) => {
    if (!obj || !query) return false;
    if (typeof obj === "string") {
      return obj.toLowerCase().includes(query);
    }
    if (typeof obj === "number" || typeof obj === "boolean") {
      return String(obj).toLowerCase().includes(query);
    }
    if (Array.isArray(obj)) {
      return obj.some((item) => searchInObject(item, query));
    }
    if (typeof obj === "object") {
      const ignoredKeys = [
        "_id",
        "createdBy",
        "createdAt",
        "updatedAt",
        "imagePublicId",
        "videoPublicId",
        "image",
        "video",
        "thumbnail",
        "url",
      ];
      return Object.entries(obj).some(([key, val]) => {
        if (ignoredKeys.includes(key)) return false;
        return searchInObject(val, query);
      });
    }
    return false;
  };

  const visibleProjects = showDraftOnly
    ? projects.filter(
        (project) => String(project.status).toLowerCase() === "draft",
      )
    : projects;

  const paginatedProjects = visibleProjects;

  // Highlight matching query substrings in text
  const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const highlightText = (text = "", query) => {
    if (!query) return text;
    try {
      const re = new RegExp(`(${escapeRegExp(query)})`, "gi");
      const parts = String(text).split(re);
      return parts.map((part, i) =>
        re.test(part) ? (
          <span key={i} className="bg-yellow-300 text-slate-900 px-1 rounded">
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        ),
      );
    } catch (e) {
      return text;
    }
  };

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
      background: rgba(15, 23, 42, 0.45);
      border: 1px solid rgba(255, 255, 255, 0.06);
      backdrop-filter: blur(15px);
    }

    /* Moving Spotlight */
    .project-card-inner::before {
      content: "";
      position: absolute;
      inset: 0;
      background: radial-gradient(
        800px circle at var(--mouse-x) var(--mouse-y), 
        rgba(255, 255, 255, 0.06),
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

  return (
    <div className="">
      <style>{projectCardStyle}</style>
      <div
        className={`relative z-40 flex pb-8 flex-row items-center justify-between gap-4 glass-panel !border-0 !bg-transparent rounded-2xl ${
          isFormOpen ? "hidden" : ""
        }`}
      >
        {/* Search (left) */}
        <div className="flex-1">
          <div
            ref={searchRef}
            className="relative w-full md:max-w-[720px] z-30"
          >
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
              {dropdownLoading ? (
                <div
                  className={`w-3.5 h-3.5 shrink-0 rounded-full border-2 animate-spin ${
                    darkMode ? "border-white/10 border-t-cyan-400" : "border-black/10 border-t-cyan-600"
                  }`}
                />
              ) : (
                <Search
                  size={16}
                  className={`shrink-0 transition-colors ${
                    searchQuery
                      ? darkMode
                        ? "text-cyan-400"
                        : "text-cyan-600"
                      : "text-slate-500"
                  }`}
                />
              )}
            </div>
            <input
              type="text"
              placeholder="SEARCH ASSETS..."
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
              className="w-full border-b border-white/20 bg-transparent pl-9 pr-9 py-2 text-[13px] text-white/85 placeholder:text-slate-600 transition-colors duration-150 outline-none focus:outline-0 focus-visible:outline-0 ring-0 focus:ring-0 focus-visible:ring-0 whiteblink-remover"
              aria-label="Search assets"
              autoComplete="off"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setShowDropdown(false);
                  setDropdownResults([]);
                }}
                className="absolute right-2 p-1 cursor-pointer text-slate-500 hover:text-slate-400 transition-colors duration-150"
                title="Clear search"
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}

            {/* Search Dropdown */}
            {showDropdown && (
              <div
                className={`absolute bg-slate-950/95 border-white/10 left-0 right-0 top-full mt-2 rounded-xl border overflow-hidden z-50 backdrop-blur-xl shadow-2xl`}
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
                              className={`text-xs font-semibold text-white truncate tracking-wider`}
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
        </div>

        {/* Action (right) */}
        <div className="flex items-center gap-3 w-fit">
          <button
            onClick={() => {
              setEditingProject(null);
              setIsFormOpen(true);
            }}
            className="rotating-gradient-card new-project border-none shadow-none ring-0 outline-none !px-3 sm:!px-6"
          >
            <span>
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Project</span>
            </span>
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {isFormOpen ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="!bg-transparent !border-0"
          >
            <div className="flex items-center bg-transparent justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-500 flex items-center justify-center">
                  <Layers className="w-4 h-4" />
                </div>
                <h2 className="text-sm font-black uppercase tracking-[0.2em]">
                  {editingProject ? (
                    <>
                      <span className="hidden sm:inline">
                        Reconfigure Asset
                      </span>
                      <span className="sm:hidden">Reconfigure</span>
                    </>
                  ) : (
                    <>
                      <span className="hidden sm:inline">
                        Initialize New Asset
                      </span>
                      <span className="sm:hidden">Initialize</span>
                    </>
                  )}
                </h2>
              </div>
              <button
                onClick={() => setIsFormOpen(false)}
                className="p-2 bg-white/10 rounded-xl transition-all text-slate-500 cursor-pointer border border-gray-600/60"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <ProjectForm
              project={editingProject}
              onSuccess={() => {
                setIsFormOpen(false);
                setEditingProject(null);
                loadProjects();
              }}
            />
          </motion.div>
        ) : (
          <>
            {/* Category Filter & Status Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setCurrentPage(1);
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wider transition-all duration-300 backdrop-blur-md cursor-pointer border ${
                      selectedCategory === cat
                        ? "bg-cyan-500/25 border-cyan-400/60 text-cyan-300 shadow-md shadow-cyan-500/10"
                        : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:border-white/20 hover:text-white"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Draft Filter Toggle Button */}
              <button
                onClick={() => {
                  setShowDraftOnly((prev) => !prev);
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-semibold font-sans tracking-widest transition-all duration-300 backdrop-blur-md cursor-pointer border ${
                  showDraftOnly
                    ? "bg-amber-500/25 border-amber-400/60 text-amber-300 shadow-md shadow-amber-500/10"
                    : "bg-white/5 border-amber-400/40 text-slate-400 hover:bg-white/10 hover:border-amber-400/60 hover:text-white"
                }`}
              >
                <span>Drafts Only</span>
              </button>
            </div>

            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 max-[500px]:gap-3"
            >
              {paginatedProjects.map((project, index) => (
                 <motion.div
                   key={project._id}
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: index * 0.05 }}
                   onMouseMove={handleMouseMove}
                   onMouseEnter={() => setHoveredCardId(project._id)}
                   onMouseLeave={(e) => {
                     handleMouseLeave(e);
                     setHoveredCardId(null);
                   }}
                   onClick={() =>
                     navigate(`/projects/${project.slug || project._id}`)
                   }
                  className="project-card-grid relative p-2 rounded-none group w-full h-auto aspect-video isolate z-0 cursor-pointer"
                  style={{
                    "--ts-c1": project.featured ? "#f59e0b" : "#06b6d4",
                    "--ts-c2": project.featured ? "#ec4899" : "#3b82f6",
                    "--ts-shine-color": project.featured
                      ? "rgba(245, 158, 11, 0.18)"
                      : "rgba(6, 182, 212, 0.18)",
                  }}
                >
                  <div className="project-card-inner shadow-md shadow-black/70 rounded-none flex flex-col relative h-full z-10">
                    {/* Extra shimmer sweep effect on hover */}
                    <div className="project-card-shine" />
                    {/* Second border line offset by 180 degrees */}
                    <div className="project-card-border-2" />

                    {/* Floating Action Controls (Top-Right, below Featured Badge if featured) */}
                    {expandedId !== project._id && (
                      <div
                        className="absolute top-4 right-4 z-30 flex flex-col items-end gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {project.featured && (
                          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-[8px] font-black tracking-widest uppercase bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 text-neutral-950 border border-amber-300 shadow-md shadow-amber-500/30">
                            <Sparkles
                              size={8}
                              className="animate-pulse text-neutral-950 shrink-0"
                            />
                            <span>FEATURED</span>
                          </div>
                        )}
                        <div className="flex flex-row lg:flex-col gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingProject(project);
                              setIsFormOpen(true);
                            }}
                            className="p-2 rounded-xl backdrop-blur-md bg-neutral-950/95 border border-cyan-500/30 hover:border-cyan-400/60 hover:bg-cyan-500/15 text-cyan-300 hover:text-cyan-600 shadow-md hover:shadow-cyan-500/10 hover:-translate-y-0.5 active:scale-95 transition-all duration-300 cursor-pointer flex items-center justify-center"
                            title="Edit Project"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(project._id);
                            }}
                            className="p-2 rounded-xl backdrop-blur-md bg-neutral-950/95 border border-red-500/30 hover:border-red-400/60 hover:bg-red-500/25 text-red-300 hover:text-red-600 shadow-md hover:shadow-red-500/10 hover:-translate-y-0.5 active:scale-95 transition-all duration-300 cursor-pointer flex items-center justify-center"
                            title="Delete Project"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Glassy Category Hover Badge */}
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

                    {/* Media Wrapper */}
                    <div className="absolute inset-0 rounded-none overflow-hidden z-0 bg-black">
                       <ProjectMedia
                         videoSrc={project.video}
                         thumbnailSrc={project.image || project.thumbnail}
                         mediaType={project.mediaType === "video" || project.video ? "video" : "image"}
                         alt={project.title}
                         className="absolute inset-0 w-full h-full"
                         isHovered={hoveredCardId === project._id}
                       />

                      {/* Overlay for expanded state */}
                      <div
                        className={`absolute inset-0 z-10 transition-opacity duration-300 ${
                          expandedId === project._id
                            ? "bg-black/80 backdrop-blur-md"
                            : ""
                        }`}
                      />
                    </div>

                    {/* Content Area */}
                    <div
                      className={`relative z-20 transition-all duration-500 flex flex-col ${
                        expandedId === project._id
                          ? "h-full p-3"
                          : "mt-auto hidden max-lg:flex group-hover:flex pl-2.5 pb-1.5 bg-gray-950/85 backdrop-blur-xs"
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.innerWidth >= 467) {
                          setExpandedId((prev) =>
                            prev === project._id ? null : project._id,
                          );
                        }
                      }}
                    >
                      <div className="flex justify-between items-center w-full pr-2 mb-0.5 max-[466px]:pr-1 max-[466px]:mb-0 max-[466px]:gap-2">
                        <h3
                          className={`text-base font-semibold font-sans tracking-wide transition-colors duration-300 max-[466px]:text-[13px] max-[466px]:leading-tight max-[466px]:line-clamp-1 ${
                            expandedId === project._id
                              ? project.featured
                                ? "text-amber-400"
                                : "text-cyan-400"
                              : project.featured
                                ? "text-amber-400"
                                : "text-cyan-400"
                          }`}
                        >
                          {highlightText(project.title, q)}
                        </h3>
                        {expandedId !== project._id && (
                          <MoveRightIcon
                            size={16}
                            className={`project-move-right transition-all duration-300 shrink-0 transform group-hover:translate-x-1 max-[466px]:w-3.5 max-[466px]:h-3.5 ${
                              project.featured
                                ? "text-amber-400"
                                : "text-cyan-400"
                            }`}
                          />
                        )}
                      </div>

                      {expandedId === project._id ? (
                        <div className="flex flex-col h-full space-y-2 animate-in fade-in zoom-in-95 duration-300">
                          <p className="text-slate-300 dark:text-slate-300 font-normal font-sans text-xs tracking-normal line-clamp-3 leading-relaxed">
                            {project.shortDescription || project.description}
                          </p>

                          <div className="flex flex-wrap gap-2 pt-0.5">
                            {(project.tags || project.skills || [])
                              .slice(0, 4)
                              .map((tag, idx) => (
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
                                      ? "backdrop-blur-md bg-amber-500/15 border border-amber-500/30 hover:border-amber-400/60 hover:-translate-y-0.5 drop-shadow-sm text-amber-300 hover:text-amber-200"
                                      : "backdrop-blur-md bg-cyan-500/15 border border-cyan-500/30 hover:border-cyan-400/60 hover:-translate-y-0.5 drop-shadow-sm text-cyan-300 hover:text-cyan-200"
                                  }`}
                                >
                                  <ExternalLink
                                    size={12}
                                    className="transition-all shrink-0 duration-300 group-hover:scale-110"
                                  />
                                  <span className="overflow-hidden truncate">
                                    DEMO
                                  </span>
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
                                      ? "backdrop-blur-md bg-amber-500/15 border border-amber-500/30 hover:border-amber-400/60 hover:-translate-y-0.5 drop-shadow-sm text-amber-300 hover:text-amber-200"
                                      : "backdrop-blur-md bg-cyan-500/15 border border-cyan-500/30 hover:border-cyan-400/60 hover:-translate-y-0.5 drop-shadow-sm text-cyan-300 hover:text-cyan-200"
                                  }`}
                                >
                                  <Github
                                    size={12}
                                    className="transition-all shrink-0 duration-300 group-hover:scale-110"
                                  />
                                  <span className="overflow-hidden truncate">
                                    CODE
                                  </span>
                                </a>
                              )}
                            </div>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(
                                  `/projects/${project.slug || project._id}`,
                                );
                              }}
                              className={`group relative px-2.5 py-1.5 rounded-lg text-nowrap transition-all duration-300 transform active:scale-90 overflow-hidden flex items-center justify-center gap-1 text-[10px] font-medium cursor-pointer ${
                                project.featured
                                  ? "backdrop-blur-md bg-amber-500/15 border border-amber-500/30 hover:border-amber-400/60 hover:-translate-y-0.5 drop-shadow-sm text-amber-300 hover:text-amber-200"
                                  : "backdrop-blur-md bg-cyan-500/15 border border-cyan-500/30 hover:border-cyan-400/60 hover:-translate-y-0.5 drop-shadow-sm text-cyan-300 hover:text-cyan-200"
                              }`}
                              title="View Full Project Details"
                            >
                              <span>MORE INFO</span>
                              <ArrowUpRight
                                size={12}
                                className="transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                              />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="w-full text-xs font-normal font-sans text-slate-300 dark:text-slate-300 pr-3 pb-1 line-clamp-1 leading-snug max-[466px]:text-[10px] max-[466px]:pr-2 max-[466px]:pb-0.5 max-[466px]:line-clamp-1">
                          {project.shortDescription || project.description}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <>
                {/* Desktop Pagination */}
                <div className="hidden sm:flex justify-center items-center gap-3 mt-12">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    disabled={currentPage === 1}
                    className={`p-2 rounded-xl border transition-all duration-300 backdrop-blur-md cursor-pointer ${
                      currentPage === 1
                        ? "bg-white/5 border-white/5 text-slate-600 cursor-not-allowed opacity-50"
                        : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:border-white/20 hover:text-white"
                    }`}
                    aria-label="Previous page"
                  >
                    <ChevronLeft size={16} />
                  </button>

                  <div className="flex items-center gap-1.5">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`w-9 h-9 rounded-xl text-xs font-bold transition-all duration-300 backdrop-blur-md cursor-pointer border ${
                            currentPage === page
                              ? "bg-cyan-500/25 border-cyan-400/60 text-cyan-300 shadow-md shadow-cyan-500/10"
                              : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:border-white/20 hover:text-white"
                          }`}
                        >
                          {page}
                        </button>
                      ),
                    )}
                  </div>

                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-xl border transition-all duration-300 backdrop-blur-md cursor-pointer ${
                      currentPage === totalPages
                        ? "bg-white/5 border-white/5 text-slate-600 cursor-not-allowed opacity-50"
                        : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:border-white/20 hover:text-white"
                    }`}
                    aria-label="Next page"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>

                {/* Compact Mobile Pagination */}
                <div className="flex sm:hidden justify-center items-center gap-4 mt-8">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    disabled={currentPage === 1}
                    className={`p-2 rounded-xl border transition-all duration-300 backdrop-blur-md cursor-pointer ${
                      currentPage === 1
                        ? "bg-white/5 border-white/5 text-slate-600 cursor-not-allowed opacity-50"
                        : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:border-white/20 hover:text-white"
                    }`}
                    aria-label="Previous page"
                  >
                    <ChevronLeft size={16} />
                  </button>

                  <span className="text-xs font-medium text-slate-400">
                    {currentPage} <span className="text-slate-600">/</span>{" "}
                    {totalPages}
                  </span>

                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-xl border transition-all duration-300 backdrop-blur-md cursor-pointer ${
                      currentPage === totalPages
                        ? "bg-white/5 border-white/5 text-slate-600 cursor-not-allowed opacity-50"
                        : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:border-white/20 hover:text-white"
                    }`}
                    aria-label="Next page"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </AnimatePresence>
      <ConfirmDialog
        open={confirmOpen}
        title="Delete Project"
        message="Are you sure you want to delete this project? This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => {
          setConfirmOpen(false);
          setPendingDeleteId(null);
        }}
      />
    </div>
  );
};

export default ProjectManagement;
