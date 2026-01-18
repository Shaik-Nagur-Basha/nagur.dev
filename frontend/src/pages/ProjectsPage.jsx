import { useTheme } from "../context/ThemeContext";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import { ExternalLink, Github, MoveRightIcon } from "lucide-react";
import { useState } from "react";

function ProjectsPage() {
  const { darkMode } = useTheme();
  const [ripples, setRipples] = useState({});
  const [expandedId, setExpandedId] = useState(null);

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
      title: "E-Commerce Platform",
      description:
        "Full-stack e-commerce solution with payment integration and admin dashboard",
      tags: ["React", "Node.js", "MongoDB", "Stripe"],
      link: "#",
      github: "#",
      video: "/BlogByte-Blog.mp4",
    },
    {
      id: 2,
      title: "Task Management App",
      description:
        "Real-time collaborative task management with drag-and-drop functionality",
      tags: ["React", "Firebase", "Tailwind CSS"],
      link: "#",
      github: "#",
      video: "/Gradient-Craft.mp4",
    },
    {
      id: 3,
      title: "AI Chat Application",
      description:
        "Advanced chat application with AI integration and message persistence",
      tags: ["React", "OpenAI API", "WebSocket"],
      link: "#",
      github: "#",
      video: "/Devmatrix.mp4",
    },
    {
      id: 4,
      title: "Portfolio Website",
      description:
        "Modern portfolio with animations, dark mode, and responsive design",
      tags: ["React", "Tailwind CSS", "Framer Motion"],
      link: "#",
      github: "#",
      video: "/NeoChat.mp4",
    },
    {
      id: 5,
      title: "Weather Forecast App",
      description:
        "Real-time weather application with geolocation and weather APIs integration",
      tags: ["React", "OpenWeather API", "Axios"],
      link: "#",
      github: "#",
      video: "/Text-In-Image.mp4",
    },
    {
      id: 6,
      title: "Social Media Dashboard",
      description:
        "Analytics dashboard for multiple social media platforms with real-time stats",
      tags: ["React", "Chart.js", "Redux"],
      link: "#",
      github: "#",
      video: "/Devmatrix.mp4",
    },
    {
      id: 7,
      title: "Video Streaming Platform",
      description:
        "Full-featured video streaming service with user authentication and subscriptions",
      tags: ["React", "Node.js", "HLS.js", "PostgreSQL"],
      link: "#",
      github: "#",
      video: "/BlogByte-Blog.mp4",
    },
  ];

  return (
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
              Explore the complete collection of my work and technical expertise
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
                    className={`text-lg tracking-wide font-black italic mb-3 transition-colors duration-300 ${expandedId === project.id ? "text-cyan-400" : "text-white"}`}
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
                          <span className="hidden sm:inline">&lt;/&gt;</span>
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
  );
}

export default ProjectsPage;
