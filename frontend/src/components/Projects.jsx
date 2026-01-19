import { Code2, ExternalLink, Github, MoveRightIcon, Plus } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useState, useEffect } from "react";
import SkeletonLoader from "./SkeletonLoader";

function Projects() {
  const { darkMode } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [minLoadingTime, setMinLoadingTime] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    // Minimum skeleton display time (prevents flashing)
    const minTimer = setTimeout(() => setMinLoadingTime(false), 800);
    return () => clearTimeout(minTimer);
  }, []);

  useEffect(() => {
    // Switch to content once minimum time has passed
    if (!minLoadingTime) {
      setIsLoading(false);
    }
  }, [minLoadingTime]);
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

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const projectsPerPage = getProjectsPerPage(windowWidth);

  // Detect window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const projectCardStyle = `
    @property --gradient-angle {
      syntax: "<angle>";
      initial-value: 0deg;
      inherits: false;
    }

    @keyframes rotate-gradient {
      to { --gradient-angle: 360deg; }
    }


    .project-gallery {
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

    /* Rainbow Border Shader */
    .project-card-inner::after {
      content: "";
      position: absolute;
      inset: -1px;
      z-index: -1;
      background: conic-gradient(
        from var(--gradient-angle),
        transparent 70%,
        #3b82f6,
        #8b5cf6,
        #3b82f6
      );
      border-radius: inherit;
      animation: rotate-gradient 4s linear infinite;
      opacity: 0;
      transition: opacity 0.3s;
    }

    .project-gallery:hover .project-card-inner::after {
      opacity: 1;
    }

    .project-gallery:hover .project-card-inner {
      transform: rotateX(var(--rotate-x)) rotateY(var(--rotate-y));
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
  `;

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Calculate rotation (max 10 degrees)
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (-(y - centerY) / centerY) * 10;
    const rotateY = ((x - centerX) / centerX) * 10;

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

  const projects = [
  {
    id: 1,
    title: "BlogByte Blog",
    description:
      "Full-stack blogging platform with post creation, comments, authentication, and modern UI.",
    tags: ["React", "Node.js", "Express", "MongoDB", "Tailwind CSS"],
    link: "https://blogbyte-blog.onrender.com",
    github: "https://github.com/Shaik-Nagur-Basha/BlogByte-Blog",
    video: `${import.meta.env.BASE_URL}BlogByte-Blog.mp4`,
  },
  {
    id: 2,
    title: "Listing Hub",
    description:
      "Full-stack listing platform built using RESTful APIs and MVC architecture.",
    tags: ["React", "Node.js", "Express", "MongoDB", "REST API"],
    link: "https://listing-hub.onrender.com",
    github: "https://github.com/Shaik-Nagur-Basha/Listing-Hub",
    video: `${import.meta.env.BASE_URL}Listing-Hub.mp4`,
  },
  {
    id: 3,
    title: "Gradient Craft",
    description:
      "Interactive gradient generator tool with live preview and copy-ready CSS output.",
    tags: ["HTML", "CSS", "JavaScript"],
    link: "https://shaik-nagur-basha.github.io/Gradient-Craft",
    github: "https://github.com/Shaik-Nagur-Basha/Gradient-Craft",
    video: `${import.meta.env.BASE_URL}Gradient-Craft.mp4`,
  },
  {
    id: 4,
    title: "DevMatrix (Ongoing)",
    description:
      "Developer-focused platform showcasing tools, utilities, and productivity features.",
    tags: ["React", "Tailwind CSS", "JavaScript"],
    link: "https://shaik-nagur-basha.github.io/DevMatrix",
    github: "https://github.com/Shaik-Nagur-Basha/DevMatrix",
    video: `${import.meta.env.BASE_URL}DevMatrix.mp4`,
  },
  {
    id: 5,
    title: "NeoChat (Ongoing)",
    description:
      "Real-time chat application with users, groups, channels, and message persistence.",
    tags: ["React", "Node.js", "Socket.io", "MongoDB"],
    link: "https://neochat-sk.onrender.com",
    github: "https://github.com/Shaik-Nagur-Basha/NeoChat",
    video: `${import.meta.env.BASE_URL}NeoChat.mp4`,
  },
  {
    id: 6,
    title: "Spotify Home UI Clone",
    description:
      "Pixel-perfect Spotify home interface clone with responsive and modern layout.",
    tags: ["HTML", "CSS", "JavaScript"],
    link: "https://shaik-nagur-basha.github.io/Spotify-Home-UI-Clone",
    github: "https://github.com/Shaik-Nagur-Basha/Spotify-Home-UI-Clone",
    video: `${import.meta.env.BASE_URL}Spotify-Home.mp4`,
  },
  {
    id: 7,
    title: "StellarMarket (Ongoing)",
    description:
      "Modern e-commerce UI with product listings, filters, and clean UX patterns.",
    tags: ["React", "Tailwind CSS", "JavaScript"],
    link: "https://shaik-nagur-basha.github.io/StellarMarket",
    github: "https://github.com/Shaik-Nagur-Basha/StellarMarket",
    video: `${import.meta.env.BASE_URL}StellarMarket.mp4`,
  },
  {
    id: 8,
    title: "SyncTask (Ongoing)",
    description:
      "Task management application focused on productivity and clean user experience.",
    tags: ["React", "JavaScript", "Tailwind CSS"],
    link: "https://shaik-nagur-basha.github.io/SyncTask",
    github: "https://github.com/Shaik-Nagur-Basha/SyncTask",
    video: `${import.meta.env.BASE_URL}SyncTask.mp4`,
  },
  {
    id: 9,
    title: "Text In Image Generator",
    description:
      "Utility tool to generate styled text embedded inside images dynamically.",
    tags: ["HTML", "CSS", "JavaScript"],
    link: "https://shaik-nagur-basha.github.io/Text-In-Image",
    github: "https://github.com/Shaik-Nagur-Basha/Text-In-Image",
    video: `${import.meta.env.BASE_URL}Text-In-Image.mp4`,
  },
];

  // Pagination - advance by 1 project at a time
  const totalSteps = Math.max(0, projects.length - projectsPerPage) + 1;

  return (
    <>
      {isLoading ? (
        <SkeletonLoader type="projects" />
      ) : (
        <section
          id="projects"
          className={`py-20 px-4 transition-all duration-300 relative overflow-hidden`}
        >
          <style>{projectCardStyle}</style>

          {/* Background overlay effects */}
          <div
            className={`absolute top-0 right-0 w-96 h-96 pointer-events-none blur-3xl ${
              darkMode
                ? "bg-gradient-to-br from-purple-600/15 via-purple-500/5 to-transparent"
                : "bg-gradient-to-br from-blue-400/20 via-blue-300/10 to-transparent"
            }`}
            style={{
              borderRadius: "50%",
              animation: "glow-pulse 4s ease-in-out infinite",
            }}
          />

          <div
            className={`absolute bottom-0 left-0 w-80 h-80 pointer-events-none blur-3xl ${
              darkMode
                ? "bg-gradient-to-tr from-blue-600/10 via-blue-500/5 to-transparent"
                : "bg-gradient-to-tr from-purple-300/15 via-purple-200/5 to-transparent"
            }`}
            style={{
              borderRadius: "50%",
              animation: "glow-pulse 5s ease-in-out infinite 1s",
            }}
          />

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mt-4 mb-16">
              <span
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border backdrop-blur-xl mb-4 ${
                  darkMode
                    ? "bg-purple-900/40 text-purple-300 border-purple-800"
                    : "bg-blue-100/60 text-blue-700 border-blue-300/60 shadow-lg shadow-blue-300/20"
                }`}
              >
                <Code2 size={16} />
                Featured Work
              </span>
              <h2
                className={`text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold mb-4 transition-colors duration-300 ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Showcase Projects
              </h2>
              <p
                className={`text-base md:text-lg transition-colors duration-300 ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Explore my best work and technical expertise
              </p>
            </div>

            {/* Projects Grid with Modern Side Navigation */}
            <div className="relative flex items-center justify-center">
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
                      ? "backdrop-blur-2xl bg-gradient-to-br from-blue-700/30 via-blue-800/20 to-cyan-900/30 border border-blue-500/40 hover:border-blue-400/70 text-blue-200 hover:text-blue-100 shadow-lg shadow-blue-900/30 hover:shadow-blue-600/50 drop-shadow-md drop-shadow-blue-900/40"
                      : "backdrop-blur-2xl bg-gradient-to-br from-blue-500/30 via-blue-400/20 to-cyan-600/30 border border-blue-400/50 hover:border-blue-300/80 text-black/60 hover:text-black/65 shadow-lg shadow-blue-400/30 hover:shadow-blue-400/50 drop-shadow-md drop-shadow-blue-300/30"
                }`}
                aria-label="Previous projects"
              >
                <div
                  className={`absolute inset-0 transition-all duration-500 ${
                    currentPage === 1
                      ? ""
                      : darkMode
                        ? "bg-gradient-to-r from-blue-400/0 via-blue-400/0 to-blue-400/0 group-hover:from-blue-400/20 group-hover:via-blue-400/15 group-hover:to-blue-400/0"
                        : "bg-gradient-to-r from-blue-300/0 via-blue-300/0 to-blue-300/0 group-hover:from-blue-300/25 group-hover:via-blue-300/20 group-hover:to-blue-300/0"
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
                  {projects.map((project) => (
                    <div
                      key={project.id}
                      onMouseMove={handleMouseMove}
                      onMouseLeave={handleMouseLeave}
                      className={`project-gallery max-sm:scale-x-100 2xl:scale-x-90 max-2xl:scale-x-75 max-xl:scale-x-65 max-lg:scale-x-50 max-md:scale-x-65 relative h-60 rounded-3xl aspect-video group overflow-hidden isolate z-0`}
                      style={{
                        flex: `0 0 calc(100% / ${projectsPerPage})`,
                      }}
                    >
                      <div className="project-card-inner rounded-3xl overflow-hidden shadow-2xl flex flex-col relative">
                        {/* Ripple Container */}
                        <div className="absolute inset-0 overflow-hidden pointer-events-none z-25">
                          {ripples[`${project.id}`] &&
                            Object.entries(ripples)
                              .filter(([key]) =>
                                key.startsWith(`${project.id}-`),
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

                        {/* Video Background */}
                        <video
                          className="absolute inset-0 w-full h-full object-fill"
                          autoPlay
                          loop
                          muted
                          playsInline
                        >
                          <source src={project.video} type="video/mp4" />
                        </video>

                        {/* Overlay for light mode styling */}
                        <div
                          className={`absolute inset-0 z-10 transition-opacity duration-300 ${
                            expandedId === project.id
                              ? darkMode
                                ? "bg-black/80"
                                : "bg-black/60"
                              : darkMode
                                ? ""
                                : ""
                          }`}
                        />

                        {/* Content Area */}
                        <div
                          className={`relative z-20 transition-all duration-500 flex flex-col ${
                            expandedId === project.id
                              ? "h-full p-6 backdrop-blur-md"
                              : "mt-auto hidden group-hover:flex pl-3 pb-1 bg-black/40 backdrop-blur-xs"
                          }`}
                          onClick={(e) => handleClick(e, project.id)}
                        >
                          <h3
                            className={`text-lg tracking-wide font-black italic transition-colors duration-300 ${expandedId === project.id ? "text-cyan-400 mb-3" : "text-white mb-1"}`}
                          >
                            {project.title}
                          </h3>

                          {expandedId === project.id ? (
                            <div className="flex flex-col h-full space-y-4 animate-in fade-in zoom-in-95 duration-300">
                              <p className="text-gray-300 text-sm font-medium">
                                {project.description}
                              </p>

                              <div className="flex flex-wrap gap-2 pt-2">
                                {project.tags.map((tag, idx) => (
                                  <span
                                    key={idx}
                                    className="tech-badge px-3 py-1 bg-white/10 text-cyan-400 rounded-full text-[10px] font-bold border border-cyan-400/30"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>

                              <div className="flex gap-2.5 mt-auto">
                                <a
                                  href={project.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`group relative px-3 py-2 rounded-lg transition-all duration-300 transform active:scale-90 overflow-hidden flex items-center justify-center gap-1.5 text-xs font-medium ${
                                    darkMode
                                      ? "backdrop-blur-md bg-cyan-500/15 border border-cyan-500/30 hover:border-cyan-400/60 hover:-translate-y-0.5 drop-shadow-sm text-cyan-300 hover:text-cyan-200"
                                      : "backdrop-blur-md bg-cyan-400/15 border border-cyan-400/40 hover:border-cyan-300/70 hover:-translate-y-0.5 drop-shadow-sm text-cyan-500 hover:text-cyan-400"
                                  }`}
                                  title="View Live Demo"
                                >
                                  <ExternalLink
                                    size={16}
                                    className="transition-all duration-300 group-hover:scale-110"
                                  />
                                  <span className="hidden sm:inline">DEMO</span>
                                </a>
                                <a
                                  href={project.github}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`group relative px-3 py-2 rounded-lg transition-all duration-300 transform active:scale-90 overflow-hidden flex items-center justify-center gap-1.5 text-xs font-mono font-medium ${
                                    darkMode
                                      ? "backdrop-blur-md bg-cyan-500/15 border border-cyan-500/30 hover:border-cyan-400/60 hover:-translate-y-0.5 drop-shadow-sm text-cyan-300 hover:text-cyan-200"
                                      : "backdrop-blur-md bg-cyan-400/15 border border-cyan-400/40 hover:border-cyan-300/70 hover:-translate-y-0.5 drop-shadow-sm text-cyan-500 hover:text-cyan-400"
                                  }`}
                                  title="View Code"
                                >
                                  <Github
                                    size={16}
                                    className="transition-all duration-300 group-hover:scale-110"
                                  />
                                  <span className="hidden sm:inline">
                                    &lt;/&gt;
                                  </span>
                                </a>
                              </div>
                            </div>
                          ) : (
                            <div
                              className="flex items-center cursor-pointer pl-3 pb-0.5 gap-0.5 hover:gap-1 text-cyan-500 font-bold text-[10px] tracking-widest"
                              onClick={(e) => handleClick(e, project.id)}
                            >
                              EXPLORE PROJECT
                              <MoveRightIcon size={16} />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
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
                      ? "backdrop-blur-2xl bg-gradient-to-br from-purple-700/30 via-purple-800/20 to-pink-900/30 border border-purple-500/40 hover:border-purple-400/70 text-purple-200 hover:text-purple-100 shadow-lg shadow-purple-900/30 hover:shadow-purple-600/50 drop-shadow-md drop-shadow-purple-900/40"
                      : "backdrop-blur-2xl bg-gradient-to-br from-purple-500/30 via-purple-400/20 to-pink-600/30 border border-purple-400/50 hover:border-purple-300/80 text-black/60 hover:text-black/65 shadow-lg shadow-purple-400/60 hover:shadow-purple-400/65 drop-shadow-md drop-shadow-purple-300/30"
                }`}
                aria-label="Next projects"
              >
                <div
                  className={`absolute inset-0 transition-all duration-500 ${
                    currentPage === totalSteps
                      ? ""
                      : darkMode
                        ? "bg-gradient-to-r from-purple-400/0 via-purple-400/0 to-purple-400/0 group-hover:from-purple-400/20 group-hover:via-purple-400/15 group-hover:to-purple-400/0"
                        : "bg-gradient-to-r from-purple-300/0 via-purple-300/0 to-purple-300/0 group-hover:from-purple-300/25 group-hover:via-purple-300/20 group-hover:to-purple-300/0"
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
                href="/nagur.dev/projects"
                className={`group inline-flex items-center gap-2 font-medium transition-all duration-300 ${
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
