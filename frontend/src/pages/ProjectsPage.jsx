import { useTheme } from "../context/ThemeContext";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import SkeletonLoader from "../components/SkeletonLoader";
import { ExternalLink, Github, MoveRightIcon } from "lucide-react";
import { useState, useEffect } from "react";

function ProjectsPage() {
  const { darkMode } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [minLoadingTime, setMinLoadingTime] = useState(true);
  const [ripples, setRipples] = useState({});
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

  const projectCardStyle = `
    @property --gradient-angle {
      syntax: "<angle>";
      initial-value: 0deg;
      inherits: false;
    }

    @keyframes rotate-gradient {
      to { --gradient-angle: 360deg; }
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

    .project-card-grid:hover .project-card-inner::after {
      opacity: 1;
    }

    .project-card-grid:hover .project-card-inner {
      transform: rotateX(var(--rotate-x)) rotateY(var(--rotate-y));
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

  return (
    <>
      {isLoading ? (
        <SkeletonLoader type="projectspage" />
      ) : (
        <div
          className={`${
            darkMode
              ? "dark bg-gradient-to-br from-gray-950 via-gray-900 to-purple-950"
              : "bg-gradient-to-br from-blue-50 via-white to-purple-50"
          } min-h-screen`}
        >
          <Navigation />
          <style>{projectCardStyle}</style>

          <section className="py-20 px-4 transition-all duration-300 relative overflow-hidden">
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
              {projects.map((project) => (
                <div
                  key={project.id}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                  onClick={(e) => handleClick(e, project.id)}
                  className="project-card-grid relative rounded-2xl overflow-hidden group h-64 aspect-video isolate z-0 cursor-pointer"
                >
                  <div className="project-card-inner rounded-2xl overflow-hidden shadow-2xl flex flex-col relative h-full">
                    {/* Ripple Container */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none z-25">
                      {ripples[`${project.id}`] &&
                        Object.entries(ripples)
                          .filter(([key]) => key.startsWith(`${project.id}-`))
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
                          <p className="text-gray-300 text-sm font-medium group-hover:text-gray-100 transition-colors duration-300">
                            {project.description}
                          </p>

                          {/* Tags */}
                          <div className="flex flex-wrap gap-2 pt-2">
                            {project.tags.map((tag, idx) => (
                              <span
                                key={idx}
                                className="tech-badge px-3 py-1 bg-white/10 text-cyan-400 rounded-full text-[10px] font-bold border border-cyan-400/30 hover:bg-white/20 hover:border-cyan-300/60 transition-all duration-300"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>

                          {/* Buttons */}
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
          </section>

          <Footer />
        </div>
      )}
    </>
  );
}

export default ProjectsPage;
