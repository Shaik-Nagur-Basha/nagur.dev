import { useTheme } from "../context/ThemeContext";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import SkeletonLoader from "../components/SkeletonLoader";
import SkeletonWaveBlur from "../components/SkeletonWaveBar";
import { ExternalLink, Github, MoveRightIcon, Sparkles, ChevronDown, ArrowUpRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

function ProjectsPage() {
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [minLoadingTime, setMinLoadingTime] = useState(true);
  const [ripples, setRipples] = useState({});
  const [expandedId, setExpandedId] = useState(null);
  const [videoLoadingStates, setVideoLoadingStates] = useState({});

  useEffect(() => {
    // Minimum skeleton display time (prevents flashing)
    const minTimer = setTimeout(() => setMinLoadingTime(false), 800);
    return () => clearTimeout(minTimer);
  }, []);

  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data } = await API.get("projects");
        if (data.success) {
          setProjects(data.data);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const projectCardStyle = `
    @property --ts-angle {
      syntax: "<angle>";
      initial-value: 0deg;
      inherits: false;
    }

    @keyframes ts-spin {
      to { --ts-angle: 360deg; }
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
      opacity: 0;
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


  return (
    <>
      {isLoading ? (
        <SkeletonLoader type="projectspage" />
      ) : (
        <div
          className={`${
            darkMode
              ? "dark bg-linear-to-br from-gray-950 via-gray-900 to-purple-950"
              : "bg-linear-to-br from-blue-50 via-white to-purple-50"
          } min-h-screen`}
        >
          <Navigation />
          <style>{projectCardStyle}</style>

          <section className="py-20 px-4 transition-all duration-300 relative overflow-hidden">
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

            <div className="pt-10 mx-auto relative z-10">
              <div className="text-center mb-16">
                <h1
                  className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-4 transition-colors duration-300 ${
                    darkMode ? "text-white/80" : "text-black/80"
                  }`}
                >
                  All Projects
                </h1>
                <p
                  className={`text-base md:text-lg transition-colors duration-300 ${
                    darkMode ? "text-white/60" : "text-black/60"
                  }`}
                >
                  Explore the complete collection of my work and technical
                  expertise
                </p>
              </div>
            </div>

            {/* Projects Grid */}
            <div className="flex flex-wrap justify-evenly gap-8">
              {projects.map((project) => {
                const c1 = project.featured ? "#f59e0b" : "#06b6d4";
                const c2 = project.featured ? "#ec4899" : "#3b82f6";
                return (
                  <div
                    key={project._id}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => navigate(`/projects/${project.slug || project._id}`)}
                    className="project-card-grid relative p-2 rounded-none group h-64 aspect-video isolate z-0 cursor-pointer"
                    style={{
                      "--ts-c1": c1,
                      "--ts-c2": c2,
                      "--ts-shine-color": project.featured ? "rgba(245, 158, 11, 0.18)" : "rgba(6, 182, 212, 0.18)"
                    }}
                  >
                    <div className="project-card-inner shadow-md shadow-gray-200/70 dark:shadow-black/70 rounded-none flex flex-col relative h-full z-10">
                      {/* Extra shimmer sweep effect on hover */}
                      <div className="project-card-shine" />
                      {/* Glassy Featured Hover Badge (Featured projects only, hidden when expanded) */}
                      {project.featured && expandedId !== project._id && (
                        <div
                          className="absolute top-4 right-4 z-30 flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-[8px] font-black tracking-widest uppercase transition-all duration-300 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 text-neutral-950 border border-amber-300 shadow-md shadow-amber-500/30"
                        >
                          <Sparkles size={8} className="animate-pulse text-neutral-950 shrink-0" />
                          <span>FEATURED</span>
                        </div>
                      )}
                      {/* Glassy Category Hover Badge (Hidden when expanded) */}
                      {project.category && expandedId !== project._id && (
                        <div
                          className={`absolute top-0 left-0 z-30 px-3 py-1.5 rounded-br-md text-[8px] font-black tracking-widest uppercase transition-all duration-300 opacity-0 group-hover:opacity-100 bg-neutral-950/95 border-r border-b backdrop-blur-xs ${
                            project.featured
                              ? "border-amber-500/40 text-amber-300"
                              : "border-cyan-500/40 text-cyan-300"
                          }`}
                        >
                          {project.category}
                        </div>
                      )}
                      {/* Media Wrapper (handles clipping for backgrounds & overlays) */}
                      <div className="absolute inset-0 rounded-none overflow-hidden z-0">
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
                        {project.mediaType === "video" ? (
                          <video
                            className="absolute inset-0 w-full h-full object-fill"
                            autoPlay
                            loop
                            muted
                            playsInline
                            onLoadedData={() => handleVideoLoaded(project._id)}
                          >
                            <source src={project.video} type="video/mp4" />
                          </video>
                        ) : (
                          <img 
                            src={project.image} 
                            alt={project.title}
                            className="absolute inset-0 w-full h-full object-cover"
                            onLoad={() => handleVideoLoaded(project._id)}
                          />
                        )}

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
                            : "mt-auto hidden max-lg:flex group-hover:flex pl-3 pb-2 bg-black/50 backdrop-blur-xs"
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleClick(e, project._id);
                        }}
                      >
                        <div className="flex justify-between items-center w-full pr-3 mb-1">
                          <h3
                            className={`text-base font-semibold font-sans tracking-wide transition-colors duration-300 ${
                              project.featured ? "text-amber-400" : "text-cyan-400"
                            }`}
                          >
                            {project.title}
                          </h3>
                          {expandedId !== project._id && (
                            <MoveRightIcon
                              size={16}
                              className={`transition-all duration-300 shrink-0 transform group-hover:translate-x-1 ${
                                project.featured ? "text-amber-400" : "text-cyan-400"
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

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/projects/${project.slug || project._id}`);
                                }}
                                className={`group relative px-2.5 py-1.5 rounded-lg transition-all duration-300 transform active:scale-90 overflow-hidden flex items-center justify-center gap-1 text-[10px] font-medium cursor-pointer ${
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
                          <div className="w-full text-xs font-normal font-sans text-slate-300 dark:text-slate-300 pr-3 pb-1 line-clamp-1 leading-snug">
                            {project.description}
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              );
              })}
            </div>
          </section>

          <Footer />
        </div>
      )}
    </>
  );
}

export default ProjectsPage;
