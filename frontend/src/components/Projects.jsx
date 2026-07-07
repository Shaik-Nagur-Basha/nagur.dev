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
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SkeletonLoader from "./SkeletonLoader";
import API from "../api/axios";
import useScrollReveal from "../hooks/useScrollReveal";

function Projects() {
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [minLoadingTime, setMinLoadingTime] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  const [projects, setProjects] = useState([]);

  const [headerRef, headerVisible] = useScrollReveal({ threshold: 0.15 });
  const [gridRef, gridVisible] = useScrollReveal({ threshold: 0.1 });

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data } = await API.get("/projects");
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

    fetchProjects();
  }, []);
  const [currentPage, setCurrentPage] = useState(1);
  const [ripples, setRipples] = useState({});
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024,
  );

  // Calculate projectsPerPage based on screen width
  const getProjectsPerPage = (width) => {
    if (width < 1024) return 1;
    if (width < 1536) return 2;
    return 3;
  };

  const projectsPerPage = getProjectsPerPage(windowWidth);

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

  const projectCardStyle = `
    @property --ts-angle {
      syntax: "<angle>";
      initial-value: 0deg;
      inherits: false;
    }

    @keyframes ts-spin {
      to { --ts-angle: 360deg; }
    }


    .project-gallery {
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

  // Pagination - advance by 1 project at a time
  const totalSteps = Math.max(0, projects.length - projectsPerPage) + 1;

  return (
    <>
      {isLoading ? (
        <SkeletonLoader type="projects" />
      ) : (
        <section
          id="projects"
          className={`scroll-mt-16 md:scroll-mt-2 py-10 md:py-20 px-4 transition-all duration-300 relative overflow-hidden`}
        >
          <style>{projectCardStyle}</style>

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

            {/* Projects Grid with Modern Side Navigation */}
            <div ref={gridRef} className={`relative flex items-center justify-center reveal-init stagger-1 ${gridVisible ? "reveal-visible" : ""}`}>
              {/* Left Arrow Button */}
              <button
                onClick={() => {
                  setPrevPage(currentPage);
                  setCurrentPage((prev) => Math.max(1, prev - 1));
                }}
                disabled={currentPage === 1}
                className={`absolute max-sm:left-1 max-lg:left-20 max-md:left-10 xl:-left-10 2xl:-left-20 max-xl:-left-0.5 top-1/2 -translate-y-1/2 z-50 shrink-0 cursor-pointer group p-3 md:p-4 rounded-full transition-all duration-300 transform active:scale-90 overflow-hidden ${
                  currentPage === 1
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
                    currentPage === 1
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
                    currentPage === 1
                      ? ""
                      : darkMode
                        ? "shadow-inset-lg shadow-blue-400/20"
                        : "shadow-inset-lg shadow-blue-300/20"
                  }`}
                ></div>
              </button>

              {/* Projects Grid */}
              <div className="w-full max-w-7xl overflow-hidden">
                <div
                  className="flex"
                  style={{
                    transition: "transform 500ms ease-in-out",
                    transform: `translateX(calc(-${
                      currentPage - 1
                    } * (100% / ${projectsPerPage})))`,
                  }}
                >
                  {projects.map((project) => {
                    const c1 = project.featured ? "#f59e0b" : "#06b6d4";
                    const c2 = project.featured ? "#ec4899" : "#3b82f6";
                    return (
                      <div
                        key={project._id}
                        onMouseMove={handleMouseMove}
                        onMouseLeave={handleMouseLeave}
                        onClick={() =>
                          navigate(`/projects/${project.slug || project._id}`)
                        }
                        className={`project-gallery max-sm:scale-x-100 2xl:scale-x-90 max-2xl:scale-x-75 max-xl:scale-x-65 max-lg:scale-x-50 max-md:scale-x-65 relative h-60 rounded-none aspect-video group isolate z-0 cursor-pointer`}
                        style={{
                          flex: `0 0 calc(100% / ${projectsPerPage})`,
                          "--ts-c1": c1,
                          "--ts-c2": c2,
                          "--ts-shine-color": project.featured
                            ? "rgba(245, 158, 11, 0.18)"
                            : "rgba(6, 182, 212, 0.18)",
                        }}
                      >
                        <div className="project-card-inner rounded-none shadow-2xl flex flex-col relative z-10">
                          {/* Extra shimmer sweep effect on hover */}
                          <div className="project-card-shine" />
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
                          <div className="absolute inset-0 rounded-none overflow-hidden z-0">
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
                            {project.mediaType === "video" ? (
                              <video
                                className="absolute inset-0 w-full h-full object-fill"
                                autoPlay
                                loop
                                muted
                                playsInline
                              >
                                <source src={project.video} type="video/mp4" />
                              </video>
                            ) : (
                              <img
                                src={project.image}
                                alt={project.title}
                                className="absolute inset-0 w-full h-full object-cover"
                              />
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
                                  {project.description}
                                </p>

                                {/* Tags (Only 4 skills) */}
                                <div className="flex flex-wrap gap-2 pt-2">
                                  {project.skills
                                    ?.slice(0, 4)
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

                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      navigate(
                                        `/projects/${project.slug || project._id}`,
                                      );
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
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="w-full text-xs font-normal font-sans text-slate-300 dark:text-slate-300 pr-3 pb-1 line-clamp-1 leading-snug max-[466px]:text-[10px] max-[466px]:pr-2 max-[466px]:pb-0.5 max-[466px]:line-clamp-1">
                                {project.description}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Arrow Button */}
              <button
                onClick={() => {
                  setPrevPage(currentPage);
                  setCurrentPage((prev) => Math.min(totalSteps, prev + 1));
                }}
                disabled={currentPage === totalSteps}
                className={`absolute max-sm:right-1 max-md:right-10 max-lg:right-20 max-xl:-right-0.5 xl:-right-10 2xl:-right-20 top-1/2 -translate-y-1/2 z-50 shrink-0 cursor-pointer group p-3 md:p-4 rounded-full transition-all duration-300 transform active:scale-90 overflow-hidden ${
                  currentPage === totalSteps
                    ? darkMode
                      ? "backdrop-blur-2xl bg-gray-900/20 border border-gray-700/30 text-gray-600 cursor-not-allowed opacity-50"
                      : "backdrop-blur-2xl bg-gray-100/20 border border-gray-300/30 text-gray-400 cursor-not-allowed opacity-50"
                    : darkMode
                      ? "backdrop-blur-2xl bg-linear-to-br from-purple-700/30 via-purple-800/20 to-pink-900/30 border border-purple-500/40 hover:border-purple-400/70 text-purple-200 hover:text-purple-100 shadow-lg shadow-purple-900/30 hover:shadow-purple-600/50 drop-shadow-md drop-shadow-purple-900/40"
                      : "backdrop-blur-2xl bg-linear-to-br from-purple-500/30 via-purple-400/20 to-pink-600/30 border border-purple-400/50 hover:border-purple-300/80 text-black/60 hover:text-black/65 shadow-lg shadow-purple-400/60 hover:shadow-purple-400/65 drop-shadow-md drop-shadow-purple-300/30"
                }`}
                aria-label="Next projects"
              >
                <div
                  className={`absolute inset-0 transition-all duration-500 ${
                    currentPage === totalSteps
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
                    currentPage === totalSteps
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
      )}
    </>
  );
}

export default Projects;
