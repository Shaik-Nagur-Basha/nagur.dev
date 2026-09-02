import {
  Code2,
  ExternalLink,
  Github,
  MoveRightIcon,
  Plus,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import SkeletonLoader from "./SkeletonLoader";
import API from "../api/axios";
import useScrollReveal from "../hooks/useScrollReveal";
import ProjectMedia from "./ProjectMedia";
import { useBackendStore } from "../store/useBackendStore";

function Projects() {
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [minLoadingTime, setMinLoadingTime] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [hoveredCardId, setHoveredCardId] = useState(null);

  const [projects, setProjects] = useState([]);

  const sectionRef = useRef(null);
  const scrollContainerRef = useRef(null);

  const [isMobile, setIsMobile] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024,
  );
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Scroll-linked horizontal scroll using direct wheel event locking
  useEffect(() => {
    if (isMobile || projects.length === 0) return;

    const container = scrollContainerRef.current;
    const section = sectionRef.current;
    if (!container || !section) return;

    // 1. Dynamic nav button state tracking
    const handleContainerScroll = () => {
      setCanScrollLeft(container.scrollLeft > 5);
      setCanScrollRight(container.scrollLeft < container.scrollWidth - container.clientWidth - 5);
    };

    // 2. Lock page scroll and scroll container horizontally on wheel event
    const handleWheel = (e) => {
      if (Math.abs(e.deltaY) < Math.abs(e.deltaX)) return;

      const rect = section.getBoundingClientRect();
      const viewHeight = window.innerHeight;
      const maxScroll = container.scrollWidth - container.clientWidth;
      if (maxScroll <= 0) return;

      // Check if we are currently mid-scroll
      const isMidScroll = container.scrollLeft > 5 && container.scrollLeft < maxScroll - 5;

      // Check if the section center is close to the viewport center (within 80px)
      const sectionCenter = rect.top + rect.height / 2;
      const viewportCenter = viewHeight / 2;
      const isCentered = Math.abs(sectionCenter - viewportCenter) < 80;

      // Lock only if we are already mid-scroll, OR if we are centered
      const shouldLock = isMidScroll || isCentered;
      if (!shouldLock) return;

      // Downwards / rightwards scrolling
      if (e.deltaY > 0) {
        if (container.scrollLeft < maxScroll - 5) {
          e.preventDefault();
          container.scrollLeft = Math.min(container.scrollLeft + e.deltaY, maxScroll);
        }
      } else if (e.deltaY < 0) {
        // Upwards / leftwards scrolling
        if (container.scrollLeft > 5) {
          e.preventDefault();
          container.scrollLeft = Math.max(container.scrollLeft + e.deltaY, 0);
        }
      }
    };

    container.addEventListener("scroll", handleContainerScroll);
    section.addEventListener("wheel", handleWheel, { passive: false });

    // Initial triggers
    handleContainerScroll();

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleContainerScroll);
      }
      if (section) {
        section.removeEventListener("wheel", handleWheel);
      }
    };
  }, [isMobile, projects.length]);

  const handlePrevScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const card = container.querySelector("[data-project-card]");
    if (!card) return;
    const scrollAmount = card.offsetWidth;
    container.scrollBy({
      left: -scrollAmount,
      behavior: "smooth",
    });
  };

  const handleNextScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const card = container.querySelector("[data-project-card]");
    if (!card) return;
    const scrollAmount = card.offsetWidth;
    container.scrollBy({
      left: scrollAmount,
      behavior: "smooth",
    });
  };

  const [headerRef, headerVisible] = useScrollReveal({ threshold: 0.15 });
  const [gridRef, gridVisible] = useScrollReveal({ threshold: 0.1 });

  const { onBackendReady } = useBackendStore();

  useEffect(() => {
    const fetchProjects = async (isLive = false) => {
      try {
        const { data } = await API.get("/projects", {
          preferNetwork: isLive,
        });
        if (data.success) {
          const sorted = [...data.data].sort((a, b) => {
            if (a.featured && !b.featured) return -1;
            if (!a.featured && b.featured) return 1;
            const orderA = a.order ?? 0;
            const orderB = b.order ?? 0;
            if (orderA !== orderB) return orderA - orderB;
            return new Date(b.createdAt) - new Date(a.createdAt);
          });
          setProjects(sorted);
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
  }, [onBackendReady]);
  const [currentPage, setCurrentPage] = useState(1);
  const [ripples, setRipples] = useState({});


  // Calculate projectsPerPage based on screen width
  const getProjectsPerPage = (width) => {
    if (width < 768) return 1;
    if (width < 1536) return 2;
    return 3;
  };

  const projectsPerPage = getProjectsPerPage(windowWidth);
  const isNarrowCard = windowWidth / projectsPerPage < 467;

  // Detect window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleViewportResize = () => {
      if (
        typeof window !== "undefined" &&
        window.innerWidth / getProjectsPerPage(window.innerWidth) < 467 &&
        expandedId
      ) {
        setExpandedId(null);
      }
    };

    handleViewportResize();
    window.addEventListener("resize", handleViewportResize);
    return () => window.removeEventListener("resize", handleViewportResize);
  }, [expandedId]);

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



    .project-gallery {
      --mouse-x: 50%;
      --mouse-y: 50%;
      perspective: 1200px;
      transition: transform 0.1s ease-out;
      
    }

    /* Hide right arrow when card is narrower than 467px (viewport or card-width based) */
    @media (max-width: 466px) {
      .project-move-right {
        display: none !important;
      }
    }
    .narrow-card .project-move-right {
      display: none !important;
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


    .project-gallery:hover .project-card-inner::after {
      opacity: 1;
    }

    .project-gallery:hover .project-card-inner {
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

    .project-gallery:hover .project-card-shine {
      opacity: 1;
      animation: ts-badge-shine 0.7s ease-in 2 forwards;
    }

    /* Floating Tags */
    .tech-badge {
      transform: translateZ(20px);
      box-shadow: 0 5px 15px rgba(0,0,0,0.3);
    }

    /* Ripple Effect */
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

    @media (max-width: 500px) {
      .project-gallery {
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

    // Calculate rotation (max 10 degrees)
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

  const [prevPage, setPrevPage] = useState(currentPage);

  const handleClick = (e, projectId) => {
    if (typeof window !== "undefined" && window.innerWidth < 467) {
      setExpandedId(null);
      return;
    }

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

  const renderCard = (project) => {
    const c1 = project.featured ? "#f59e0b" : "#06b6d4";
    const c2 = project.featured ? "#ec4899" : "#3b82f6";
    return (
      <div className="project-card-inner rounded-none shadow-2xl flex flex-col relative z-10 w-full h-full">
        {/* Extra shimmer sweep effect on hover */}
        <div className="project-card-shine" />
        {/* Second border line offset by 180 degrees */}
        <div className="project-card-border-2" />
        
        {/* Glassy Featured Hover Badge */}
        {project.featured && expandedId !== project._id && (
          <div className="absolute top-4 right-4 z-30 flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-[8px] font-black tracking-widest uppercase transition-all duration-300 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 text-neutral-950 border border-amber-300 shadow-md shadow-amber-500/30">
            <Sparkles
              size={8}
              className="animate-pulse text-neutral-950 shrink-0"
            />
            <span>FEATURED</span>
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
          {/* Ripple Container */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-25">
            {ripples[`${project._id}`] &&
              Object.entries(ripples)
                .filter(([key]) => key.startsWith(`${project._id}-`))
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
            isHovered={hoveredCardId === project._id}
          />

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
              : `mt-auto hidden max-lg:flex group-hover:flex px-3 py-2 backdrop-blur-md ${
                  darkMode
                    ? "bg-gradient-to-t from-gray-950/95 via-gray-900/80 to-transparent border-white/5 shadow-[0_-4px_16px_rgba(0,0,0,0.4)]"
                    : "bg-gradient-to-t from-black/70 via-black/40 to-transparent border-white/10 shadow-[0_-4px_16px_rgba(0,0,0,0.25)]"
                }`
          }`}
          onClick={(e) => {
            e.stopPropagation();
            if (!isNarrowCard) {
              handleClick(e, project._id);
            }
          }}
        >
          <div className={`flex justify-between items-center w-full mb-1 ${isNarrowCard ? "pr-1 mb-0 gap-2" : "pr-3"}`}>
            <h3
              className={`text-base font-semibold font-sans tracking-wide transition-colors duration-300 ${isNarrowCard ? "text-[13px] leading-tight line-clamp-1" : ""} ${
                project.featured ? "text-amber-400" : "text-cyan-400"
              }`}
            >
              {project.title}
            </h3>
            {expandedId !== project._id && (
              <MoveRightIcon
                size={16}
                className={`project-move-right transition-all duration-300 shrink-0 transform group-hover:translate-x-1 ${
                  project.featured ? "text-amber-400" : "text-cyan-400"
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
    );
  };

  return (
    <>
      {isLoading ? (
        <SkeletonLoader type="projects" />
      ) : isMobile ? (
        /* Mobile Layout: 5 projects stacked vertically */
        <section
          ref={sectionRef}
          id="projects"
          className="scroll-mt-16 py-10 px-4 transition-all duration-300 relative overflow-hidden"
        >
          <style>{projectCardStyle}</style>

          <div className="max-w-7xl mx-auto relative z-10">
            <div ref={headerRef} className="text-center mt-4 mb-8 md:mb-16">
              <span
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border backdrop-blur-xl mb-4 reveal-init ${
                  darkMode
                    ? "bg-purple-900/40 text-purple-300 border-purple-800"
                    : "bg-blue-100/60 text-blue-700 border-blue-300/60 shadow-lg shadow-blue-300/20"
                } ${headerVisible ? "reveal-visible" : ""}`}
              >
                <Code2 size={16} />
                Featured Work
              </span>
              <h2
                className={`text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold mb-4 transition-colors duration-300 reveal-init stagger-1 ${
                  darkMode ? "text-white" : "text-gray-900"
                } ${headerVisible ? "reveal-visible" : ""}`}
              >
                Showcase Projects
              </h2>
              <p
                className={`text-base md:text-lg transition-colors duration-300 reveal-init stagger-2 ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                } ${headerVisible ? "reveal-visible" : ""}`}
              >
                Explore my best work and technical expertise
              </p>
            </div>

            <div ref={gridRef} className={`flex flex-col gap-6 w-full max-w-md sm:max-w-xl mx-auto px-2 reveal-init stagger-1 ${gridVisible ? "reveal-visible" : ""}`}>
              {projects.slice(0, 5).map((project) => (
                <div
                  key={project._id}
                  className="w-full aspect-video relative group cursor-pointer"
                  onClick={() => navigate(`/projects/${project.slug || project._id}`)}
                  style={{
                    "--ts-c1": project.featured ? "#f59e0b" : "#06b6d4",
                    "--ts-c2": project.featured ? "#ec4899" : "#3b82f6",
                    "--ts-shine-color": project.featured ? "rgba(245, 158, 11, 0.18)" : "rgba(6, 182, 212, 0.18)",
                  }}
                >
                  {renderCard(project)}
                </div>
              ))}
            </div>

            {/* View All Button - Positioned at Bottom */}
            <div className="flex justify-center mt-12">
              <a
                href="/projects"
                className={`group inline-flex items-center cursor-pointer gap-2 font-medium transition-all duration-300 ${
                  darkMode
                    ? "text-cyan-300 hover:text-cyan-100"
                    : "text-cyan-600 hover:text-cyan-500"
                }`}
                style={{
                  textShadow: darkMode
                    ? "0 0 20px rgba(34, 211, 238, 0.5), 0 0 40px rgba(34, 211, 238, 0.2)"
                    : "0 0 20px rgba(8, 145, 178, 0.4), 0 0 40px rgba(8, 145, 178, 0.15)",
                }}
              >
                <span
                  className={`border-b-2 border-transparent group-hover:border-current transition-all duration-300 italic tracking-wide text-base ${
                    darkMode
                      ? "group-hover:border-cyan-100"
                      : "group-hover:border-cyan-500"
                  }`}
                >
                  View All Projects
                </span>
                <ExternalLink
                  size={18}
                  className="transition-transform group-hover:translate-x-1 group-hover:drop-shadow-lg"
                  style={{
                    filter: darkMode
                      ? "drop-shadow(0 0 12px rgba(34, 211, 238, 0.6))"
                      : "drop-shadow(0 0 12px rgba(8, 145, 178, 0.5))",
                  }}
                />
              </a>
            </div>
          </div>
        </section>
      ) : (
        /* Desktop Layout: Scroll-locked horizontal slider (Compact Section) */
        <section
          ref={sectionRef}
          id="projects"
          className="py-12 md:py-24 px-4 transition-all duration-300 relative overflow-hidden"
        >
            <style>{projectCardStyle}</style>

            <div className="max-w-7xl mx-auto w-full relative z-10">
              <div ref={headerRef} className="text-center mt-4 mb-8 md:mb-16">
                <span
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border backdrop-blur-xl mb-4 reveal-init ${
                    darkMode
                      ? "bg-purple-900/40 text-purple-300 border-purple-800"
                      : "bg-blue-100/60 text-blue-700 border-blue-300/60 shadow-lg shadow-blue-300/20"
                  } ${headerVisible ? "reveal-visible" : ""}`}
                >
                  <Code2 size={16} />
                  Featured Work
                </span>
                <h2
                  className={`text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold mb-4 transition-colors duration-300 reveal-init stagger-1 ${
                    darkMode ? "text-white" : "text-gray-900"
                  } ${headerVisible ? "reveal-visible" : ""}`}
                >
                  Showcase Projects
                </h2>
                <p
                  className={`text-base md:text-lg transition-colors duration-300 reveal-init stagger-2 ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  } ${headerVisible ? "reveal-visible" : ""}`}
                >
                  Explore my best work and technical expertise
                </p>
              </div>

              {/* Projects Grid Container with Navigation */}
              <div ref={gridRef} className={`relative flex items-center lg:gap-3 reveal-init stagger-1 ${gridVisible ? "reveal-visible" : ""}`}>
                {/* Left Arrow Button */}
                <button
                  onClick={handlePrevScroll}
                  disabled={!canScrollLeft}
                  className={`absolute left-2 top-1/2 -translate-y-1/2 shrink-0 z-20 cursor-pointer group p-3 md:p-4 rounded-full transition-all duration-300 transform active:scale-90 overflow-hidden ${
                    !canScrollLeft
                      ? darkMode
                        ? "backdrop-blur-2xl bg-gray-900/20 border border-gray-700/30 text-gray-600 cursor-not-allowed opacity-50"
                        : "backdrop-blur-2xl bg-gray-100/20 border border-gray-300/30 text-gray-400 cursor-not-allowed opacity-50"
                      : darkMode
                        ? "backdrop-blur-2xl bg-linear-to-br from-blue-700/30 via-blue-800/20 to-cyan-900/30 border border-blue-500/40 hover:border-blue-400/70 text-blue-200 hover:text-blue-100 shadow-lg shadow-blue-900/30 hover:shadow-blue-600/50 drop-shadow-md drop-shadow-blue-900/40"
                        : "backdrop-blur-2xl bg-linear-to-br from-blue-500/30 via-blue-400/20 to-cyan-600/30 border border-blue-400/50 hover:border-blue-300/80 text-black/60 hover:text-black/65 shadow-lg shadow-blue-400/30 hover:shadow-blue-400/50 drop-shadow-md drop-shadow-blue-300/30"
                  }`}
                  aria-label="Previous projects"
                >
                  <div
                    className={`absolute inset-0 transition-all duration-500 ${
                      !canScrollLeft
                        ? ""
                        : darkMode
                          ? "bg-linear-to-r from-blue-400/0 via-blue-400/0 to-blue-400/0 group-hover:from-blue-400/20 group-hover:via-blue-400/15 group-hover:to-blue-400/0"
                          : "bg-linear-to-r from-blue-300/0 via-blue-300/0 to-blue-300/0 group-hover:from-blue-300/25 group-hover:via-blue-300/20 group-hover:to-blue-300/0"
                    }`}
                  ></div>
                  <svg
                    className="relative z-10 w-4 h-4 md:w-5 md:h-5 transition-transform group-hover:scale-110"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  <div
                    className={`absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none ${
                      !canScrollLeft
                        ? ""
                        : darkMode
                          ? "shadow-inset-lg shadow-blue-400/20"
                          : "shadow-inset-lg shadow-blue-300/20"
                    }`}
                  ></div>
                </button>

                {/* Projects Grid Scroll Window */}
                <div className="w-full overflow-hidden">
                  <div
                    ref={scrollContainerRef}
                    className="flex overflow-x-auto scrollbar-none gap-0 py-6 w-full"
                  >
                    {projects.map((project) => {
                      const c1 = project.featured ? "#f59e0b" : "#06b6d4";
                      const c2 = project.featured ? "#ec4899" : "#3b82f6";
                      return (
                        <div
                          key={project._id}
                          data-project-card
                          onMouseMove={handleMouseMove}
                          onMouseEnter={() => setHoveredCardId(project._id)}
                          onMouseLeave={(e) => {
                            handleMouseLeave(e);
                            setHoveredCardId(null);
                          }}
                          onClick={() => navigate(`/projects/${project.slug || project._id}`)}
                          className={`project-gallery relative p-2.5 h-auto rounded-none aspect-video group isolate z-0 cursor-pointer ${isNarrowCard ? "narrow-card" : ""}`}
                          style={{
                            flex: `0 0 calc(100% / ${projectsPerPage})`,
                            "--ts-c1": c1,
                            "--ts-c2": c2,
                            "--ts-shine-color": project.featured ? "rgba(245, 158, 11, 0.18)" : "rgba(6, 182, 212, 0.18)"
                          }}
                        >
                          {renderCard(project)}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Right Arrow Button */}
                <button
                  onClick={handleNextScroll}
                  disabled={!canScrollRight}
                  className={`absolute right-2 top-1/2 -translate-y-1/2 shrink-0 z-20 cursor-pointer group p-3 md:p-4 rounded-full transition-all duration-300 transform active:scale-90 overflow-hidden ${
                    !canScrollRight
                      ? darkMode
                        ? "backdrop-blur-2xl bg-gray-900/20 border border-gray-700/30 text-gray-600 cursor-not-allowed opacity-50"
                        : "backdrop-blur-2xl bg-gray-100/20 border border-gray-300/30 text-gray-400 cursor-not-allowed opacity-50"
                      : darkMode
                        ? "backdrop-blur-2xl bg-linear-to-br from-purple-700/30 via-purple-800/20 to-pink-900/30 border border-purple-500/40 hover:border-purple-400/70 text-purple-200 hover:text-purple-100 shadow-lg shadow-purple-900/30 hover:shadow-purple-600/50 drop-shadow-md drop-shadow-purple-900/40"
                        : "backdrop-blur-2xl bg-linear-to-br from-purple-500/30 via-purple-400/20 to-pink-600/30 border border-purple-400/50 hover:border-purple-300/80 text-black/60 hover:text-black/65 shadow-lg shadow-purple-400/65 hover:shadow-purple-400/60 drop-shadow-md drop-shadow-purple-300/30"
                  }`}
                  aria-label="Next projects"
                >
                  <div
                    className={`absolute inset-0 transition-all duration-500 ${
                      !canScrollRight
                        ? ""
                        : darkMode
                          ? "bg-linear-to-r from-purple-400/0 via-purple-400/0 to-purple-400/0 group-hover:from-purple-400/20 group-hover:via-purple-400/15 group-hover:to-purple-400/0"
                          : "bg-linear-to-r from-purple-300/0 via-purple-300/0 to-purple-300/0 group-hover:from-purple-300/25 group-hover:via-purple-300/20 group-hover:to-purple-300/0"
                    }`}
                  ></div>
                  <svg
                    className="relative z-10 w-4 h-4 md:w-5 md:h-5 transition-transform group-hover:scale-110"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                  <div
                    className={`absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none ${
                      !canScrollRight
                        ? ""
                        : darkMode
                          ? "shadow-inset-lg shadow-purple-400/20"
                          : "shadow-inset-lg shadow-purple-300/20"
                    }`}
                  ></div>
                </button>
              </div>

              {/* View All Button - Positioned at Bottom */}
              <div className="flex justify-center mt-12">
                <a
                  href="/projects"
                  className={`group inline-flex items-center cursor-pointer gap-2 font-medium transition-all duration-300 ${
                    darkMode
                      ? "text-cyan-300 hover:text-cyan-100"
                      : "text-cyan-600 hover:text-cyan-500"
                  }`}
                  style={{
                    textShadow: darkMode
                      ? "0 0 20px rgba(34, 211, 238, 0.5), 0 0 40px rgba(34, 211, 238, 0.2)"
                      : "0 0 20px rgba(8, 145, 178, 0.4), 0 0 40px rgba(8, 145, 178, 0.15)"
                  }}
                >
                  <span
                    className={`border-b-2 border-transparent group-hover:border-current transition-all duration-300 italic tracking-wide text-base ${
                      darkMode
                        ? "group-hover:border-cyan-100"
                        : "group-hover:border-cyan-500"
                    }`}
                  >
                    View All Projects
                  </span>
                  <ExternalLink
                    size={18}
                    className="transition-transform group-hover:translate-x-1 group-hover:drop-shadow-lg"
                    style={{
                      filter: darkMode
                        ? "drop-shadow(0 0 12px rgba(34, 211, 238, 0.6))"
                        : "drop-shadow(0 0 12px rgba(8, 145, 178, 0.5))"
                    }}
                  />
                </a>
              </div>
            </div>
          </section>
      )}
    </>
  );
}

export default Projects;
