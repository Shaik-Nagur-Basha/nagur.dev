import { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import SkeletonLoader from "../components/SkeletonLoader";
import API from "../api/axios";
import {
  ArrowLeft,
  ExternalLink,
  Github,
  Sparkles,
  Terminal,
  Layers,
  ArrowRight,
  Code,
  Cpu,
  Film,
  Server,
  Cloud,
  ShieldCheck,
  CheckCircle2,
  MoveRightIcon,
  ArrowUpRight,
} from "lucide-react";

/* ── Filmstrip: infinite auto-scroll reel with center-focus scaling ── */
function FilmstripLayout({ gallery, darkMode }) {
  const containerRef = useRef(null);
  const hovering = useRef(false);
  const rafRef = useRef(null);

  const scrollTimeoutRef = useRef(null);
  const isSmoothScrolling = useRef(false);

  const handleDotClick = (targetIdx) => {
    const el = containerRef.current;
    if (!el) return;

    // Find the card element that has data-index equal to targetIdx
    const targetCard = el.querySelector(`[data-index="${targetIdx}"]`);
    if (!targetCard) return;

    const containerCenter = el.clientWidth / 2;
    const cardCenterInViewport =
      targetCard.getBoundingClientRect().left -
      el.getBoundingClientRect().left +
      targetCard.offsetWidth / 2;
    const targetScroll =
      el.scrollLeft + (cardCenterInViewport - containerCenter);

    // Pause auto-scroll and mark smooth scroll active to bypass loop checks
    hovering.current = true;
    isSmoothScrolling.current = true;

    el.scrollTo({
      left: targetScroll,
      behavior: "smooth",
    });

    // Clear any existing resume timeout
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);

    // Resume auto-scroll and loop checks after smooth scroll completes (1.2s)
    scrollTimeoutRef.current = setTimeout(() => {
      isSmoothScrolling.current = false;
      hovering.current = false;
    }, 1200);
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el || gallery.length <= 1) return;

    const isScrollable = gallery.length >= 4;

    // Start at scrollLeft = 0
    el.scrollLeft = 0;

    const SPEED = 0.55; // px per frame
    const gap = 20; // gap-5 is 1.25rem = 20px

    const tick = () => {
      if (isScrollable && !hovering.current) {
        el.scrollLeft += SPEED;
      }

      // Only perform infinite loop card cycling if we aren't in the middle of a smooth scroll transition
      if (isScrollable && !isSmoothScrolling.current) {
        const maxCycles = el.children.length;

        // Loop rightwards (cycle all cards that went off-screen to the left)
        let first = el.firstElementChild;
        let rightCount = 0;
        while (
          first &&
          first.offsetWidth > 0 &&
          el.scrollLeft >= first.offsetWidth + gap &&
          rightCount < maxCycles
        ) {
          const prevScroll = el.scrollLeft;
          el.appendChild(first);
          el.scrollLeft -= first.offsetWidth + gap;
          // If scrollLeft didn't decrease (e.g. not scrollable or unmounting), break to avoid infinite loop
          if (el.scrollLeft >= prevScroll) {
            break;
          }
          first = el.firstElementChild;
          rightCount++;
        }

        // Loop leftwards (cycle all cards if scrolled back past 0)
        let last = el.lastElementChild;
        let leftCount = 0;
        while (
          el.scrollLeft <= 0 &&
          last &&
          last.offsetWidth > 0 &&
          leftCount < maxCycles
        ) {
          const prevScroll = el.scrollLeft;
          el.insertBefore(last, el.firstElementChild);
          el.scrollLeft += last.offsetWidth + gap;
          // If scrollLeft didn't actually increase (e.g. not scrollable or unmounting), break to avoid infinite loop
          if (el.scrollLeft <= prevScroll) {
            break;
          }
          last = el.lastElementChild;
          leftCount++;
        }
      }

      const viewCenter = el.getBoundingClientRect().left + el.clientWidth / 2;
      const cards = el.querySelectorAll("[data-filmcard]");

      let activeIdx = 0;
      let minCenterDist = Infinity;

      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const cardCenter = rect.left + rect.width / 2;
        const dist = Math.abs(cardCenter - viewCenter);
        const halfView = el.clientWidth * 0.55;
        const t = Math.max(0, 1 - dist / halfView);

        if (dist < minCenterDist) {
          minCenterDist = dist;
          activeIdx = parseInt(card.getAttribute("data-index") || "0", 10);
        }

        const scale = 0.85 + t * 0.25; // center card is 1.10x, edges are 0.85x
        const opacity = (0.6 + t * 0.4).toFixed(4); // keep cards visible (0.60 to 1.00)
        const zIndex = Math.round(t * 10); // scale z-index between 0 and 10 (always under the z-20 depth fades)

        card.style.transform = `scale(${scale})`;
        card.style.opacity = opacity;
        card.style.zIndex = zIndex;
      });

      // Update dots styling directly in DOM
      const dotsContainer = el.parentElement?.querySelector(
        "[data-dots-container]",
      );
      if (dotsContainer) {
        dotsContainer.querySelectorAll("[data-dot]").forEach((dot) => {
          const dotIdx = parseInt(dot.getAttribute("data-dot") || "0", 10);
          if (dotIdx === activeIdx) {
            dot.className = `rounded-full transition-all duration-300 h-1.5 w-4 ${
              darkMode
                ? "bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.6)]"
                : "bg-cyan-600 shadow-[0_0_6px_rgba(8,145,178,0.4)]"
            }`;
          } else {
            dot.className = `rounded-full transition-all duration-300 h-1.5 w-1.5 ${
              darkMode
                ? "bg-white/25 hover:bg-white/40"
                : "bg-gray-300 hover:bg-gray-400"
            }`;
          }
        });
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafRef.current);
    };
  }, [gallery.length]);

  const shadow = darkMode
    ? "0 8px 32px rgba(0,0,0,0.5),inset 0 1px 0 rgba(255,255,255,0.04)"
    : "0 8px 32px rgba(0,0,0,0.10),inset 0 1px 0 rgba(255,255,255,0.9)";

  return (
    <div className="relative">
      {/* Left depth fade */}
      {gallery.length >= 4 && (
        <div
          className="absolute left-0 top-0 bottom-4 w-36 z-20 pointer-events-none"
          style={{
            background: darkMode
              ? "linear-gradient(to right, rgba(3,7,18,0.95) 0%, transparent 100%)"
              : "linear-gradient(to right, rgba(249,250,251,0.97) 0%, transparent 100%)",
          }}
        />
      )}
      {/* Right depth fade */}
      {gallery.length >= 4 && (
        <div
          className="absolute right-0 top-0 bottom-4 w-36 z-20 pointer-events-none"
          style={{
            background: darkMode
              ? "linear-gradient(to left, rgba(3,7,18,0.95) 0%, transparent 100%)"
              : "linear-gradient(to left, rgba(249,250,251,0.97) 0%, transparent 100%)",
          }}
        />
      )}

      {/* Reel — overflow-x-scroll so scrollLeft works; scrollbar hidden via no-scrollbar */}
      <div
        ref={containerRef}
        className={`flex gap-5 overflow-x-scroll no-scrollbar py-8 ${
          gallery.length < 4 ? "justify-center" : ""
        }`}
        onMouseEnter={() => {
          hovering.current = true;
        }}
        onMouseLeave={() => {
          hovering.current = false;
        }}
      >
        {gallery.map((img, i) => (
          <div
            key={img.url}
            data-index={i}
            data-filmcard=""
            className={`group relative flex-none h-64 overflow-hidden rounded-2xl border cursor-pointer ${
              darkMode ? "border-white/10" : "border-gray-200/80"
            }`}
            style={{
              boxShadow: shadow,
              transformOrigin: "center center",
              willChange: "transform, opacity, z-index",
            }}
          >
            <GalleryBadge idx={i} darkMode={darkMode} />
            <GalleryGlow />
            <img
              src={img.url}
              alt={img.caption}
              className="h-full w-auto object-cover block"
              draggable={false}
            />
            <GalleryCaption caption={img.caption} darkMode={darkMode} />
            <GalleryScrim />
          </div>
        ))}
      </div>

      {/* Dot count indicators */}
      <div
        data-dots-container=""
        className="flex justify-center items-center gap-1.5 mt-1"
      >
        {gallery.map((_, i) => (
          <button
            key={i}
            data-dot={i}
            onClick={() => handleDotClick(i)}
            className={`rounded-full transition-all duration-300 h-1.5 w-1.5 ${
              darkMode ? "bg-white/25" : "bg-gray-300"
            }`}
            title={`Go to image ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

/* ── Shared gallery card micro-components ── */
function GalleryBadge({ idx, darkMode }) {
  return (
    <div
      className={`absolute top-3 left-3 z-20 w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black font-mono border ${
        darkMode
          ? "bg-black/60 border-white/15 text-cyan-400 backdrop-blur-sm"
          : "bg-white/70 border-gray-300/60 text-cyan-600 backdrop-blur-sm"
      } transition-opacity duration-300`}
    >
      {String(idx + 1).padStart(2, "0")}
    </div>
  );
}

function GalleryGlow() {
  return (
    <div
      className="absolute top-0 right-0 w-20 h-20 z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      style={{
        background:
          "radial-gradient(circle at top right, rgba(6,182,212,0.3) 0%, transparent 70%)",
      }}
    />
  );
}

function GalleryCaption({ caption, darkMode }) {
  return (
    <div
      className="absolute inset-x-0 bottom-0 z-20 translate-y-0 md:translate-y-full md:group-hover:translate-y-0 transition-transform duration-500 ease-out"
      style={{
        background: darkMode
          ? "linear-gradient(0deg, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.65) 60%, transparent 100%)"
          : "linear-gradient(0deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.45) 60%, transparent 100%)",
      }}
    >
      <div className="px-4 pb-4 pt-10">
        <div
          className="w-6 h-px mb-2"
          style={{ background: "rgba(6,182,212,0.8)" }}
        />
        <p className="text-white text-xs font-medium leading-snug tracking-wide">
          {caption}
        </p>
      </div>
    </div>
  );
}

function GalleryScrim() {
  return (
    <div
      className="absolute inset-x-0 bottom-0 h-10 z-10 pointer-events-none"
      style={{
        background:
          "linear-gradient(0deg, rgba(0,0,0,0.25) 0%, transparent 100%)",
      }}
    />
  );
}

function ProjectDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const [project, setProject] = useState(null);
  const [allProjects, setAllProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [galleryLayout, setGalleryLayout] = useState("grid"); // "grid" | "bento" | "filmstrip"
  const [expandedExploreId, setExpandedExploreId] = useState(null);

  useEffect(() => {
    const handleViewportResize = () => {
      if (
        typeof window !== "undefined" &&
        window.innerWidth < 467 &&
        expandedExploreId
      ) {
        setExpandedExploreId(null);
      }
    };

    handleViewportResize();
    window.addEventListener("resize", handleViewportResize);
    return () => window.removeEventListener("resize", handleViewportResize);
  }, [expandedExploreId]);

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

    @media (max-width: 500px) {
      .project-card-grid {
        height: auto !important;
        width: 100% !important;
        aspect-ratio: 16 / 9 !important;
      }
    }
  `;

  // Enforce default layouts responsively on mount and window resizes
  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleResize = () => {
        if (window.innerWidth < 768) {
          setGalleryLayout("grid");
        } else {
          setGalleryLayout((prev) => (prev === "grid" ? "filmstrip" : prev));
        }
      };

      handleResize();
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  useEffect(() => {
    let active = true;

    const fetchMainProject = async () => {
      setIsLoading(true);
      try {
        const res = await API.get(`projects/${slug}`);
        if (active && res.data?.success) {
          setProject(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching project details:", error);
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    const fetchAllProjects = async () => {
      try {
        const res = await API.get("projects");
        if (active && res.data?.success) {
          setAllProjects(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching all projects for navigation:", error);
      }
    };

    fetchMainProject();
    fetchAllProjects();

    return () => {
      active = false;
    };
  }, [slug]);

  const currentIndex = allProjects.findIndex(
    (p) => p.slug === slug || p._id === slug,
  );
  const prevProject = currentIndex > 0 ? allProjects[currentIndex - 1] : null;
  const nextProject =
    currentIndex < allProjects.length - 1
      ? allProjects[currentIndex + 1]
      : null;

  // Prioritized 3-way matching algorithm for Explore More Projects (up to 4 items)
  const exploreProjects = (() => {
    if (!allProjects.length) return [];

    // 1. Exclude the current project
    const otherProjects = allProjects.filter(
      (p) => p.slug !== slug && p._id !== slug,
    );

    // 2. Sort by relevance
    return [...otherProjects]
      .sort((a, b) => {
        // Rule A: Category matching is top priority
        const aMatchesCat =
          a.category &&
          project?.category &&
          a.category.toLowerCase() === project.category.toLowerCase();
        const bMatchesCat =
          b.category &&
          project?.category &&
          b.category.toLowerCase() === project.category.toLowerCase();

        if (aMatchesCat && !bMatchesCat) return -1;
        if (!aMatchesCat && bMatchesCat) return 1;

        // Rule B: Featured projects are second priority
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;

        // Rule C: Sort by defined ordering rank first, then newest creation date
        const orderA = a.order !== undefined ? a.order : 999;
        const orderB = b.order !== undefined ? b.order : 999;
        if (orderA !== orderB) return orderA - orderB;

        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      })
      .slice(0, 4);
  })();

  const getCategoryIcon = (category) => {
    const cat = category?.toLowerCase() || "";
    if (cat.includes("stack") || cat.includes("back")) {
      return <Terminal size={12} className="text-cyan-400 animate-pulse" />;
    }
    if (
      cat.includes("front") ||
      cat.includes("ui") ||
      cat.includes("clone") ||
      cat.includes("visual")
    ) {
      return <Layers size={12} className="text-cyan-400 animate-pulse" />;
    }
    if (
      cat.includes("tool") ||
      cat.includes("util") ||
      cat.includes("generator") ||
      cat.includes("script")
    ) {
      return <Cpu size={12} className="text-cyan-400 animate-pulse" />;
    }
    return <Code size={12} className="text-cyan-400 animate-pulse" />;
  };

  const colorVariants = [
    {
      dark: "bg-cyan-500/10 border-cyan-500/20 text-cyan-400 hover:border-cyan-500/40",
      light:
        "bg-cyan-50 border-cyan-150 text-cyan-700 hover:bg-cyan-100 hover:border-cyan-300",
    },
    {
      dark: "bg-purple-500/10 border-purple-500/20 text-purple-400 hover:border-purple-500/40",
      light:
        "bg-purple-50 border-purple-150 text-purple-700 hover:bg-purple-100 hover:border-purple-300",
    },
    {
      dark: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:border-emerald-500/40",
      light:
        "bg-emerald-50 border-emerald-150 text-emerald-700 hover:bg-emerald-100 hover:border-emerald-300",
    },
    {
      dark: "bg-amber-500/10 border-amber-500/20 text-amber-400 hover:border-amber-500/40",
      light:
        "bg-amber-50 border-amber-150 text-amber-700 hover:bg-amber-100 hover:border-amber-300",
    },
    {
      dark: "bg-rose-500/10 border-rose-500/20 text-rose-400 hover:border-rose-500/40",
      light:
        "bg-rose-50 border-rose-150 text-rose-700 hover:bg-rose-100 hover:border-rose-300",
    },
    {
      dark: "bg-blue-500/10 border-blue-500/20 text-blue-400 hover:border-blue-500/40",
      light:
        "bg-blue-50 border-blue-150 text-blue-700 hover:bg-blue-100 hover:border-blue-300",
    },
  ];

  const videoC1 = project?.featured ? "#f59e0b" : "#06b6d4";
  const videoC2 = project?.featured
    ? "#f97316"
    : darkMode
      ? "#8b5cf6"
      : "#7c3aed";
  const videoC3 = project?.featured
    ? "#ec4899"
    : darkMode
      ? "#ec4899"
      : "#db2777";
  const glowC1 = project?.featured
    ? "0 0 4px 2px rgba(245,158,11,0.4)"
    : "0 0 4px 2px rgba(6,182,212,0.4)";
  const glowC2 = project?.featured
    ? "0 0 4px 2px rgba(249,115,22,0.4)"
    : darkMode
      ? "0 0 4px 2px rgba(139,92,246,0.4)"
      : "0 0 4px 2px rgba(124,58,237,0.4)";
  const glowC3 = project?.featured
    ? "0 0 4px 2px rgba(236,72,153,0.4)"
    : darkMode
      ? "0 0 4px 2px rgba(236,72,153,0.4)"
      : "0 0 4px 2px rgba(219,39,119,0.4)";

  return (
    <div
      className={`min-h-screen flex flex-col justify-between relative overflow-hidden bg-pattern-subtle ${
        darkMode
          ? "dark bg-linear-to-br from-gray-950 via-gray-900 to-purple-950 text-gray-100"
          : "bg-linear-to-br from-blue-50 via-white to-purple-50 text-gray-800"
      } transition-colors duration-300`}
    >
      <Navigation />

      {/* Lighting backdrops */}
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-80 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {isLoading ? (
        <SkeletonLoader type="projectdetail" />
      ) : !project ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 min-h-[60vh] relative z-10">
          <h2 className="text-2xl font-bold mb-4">Project Not Found</h2>
          <Link
            to="/projects"
            className="flex items-center gap-2 text-cyan-500 hover:text-cyan-400"
          >
            <ArrowLeft size={16} /> Back to Projects
          </Link>
        </div>
      ) : (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 lg:pt-32 pb-12 sm:pb-20 lg:pb-24 relative z-10">
          {/* Navigation & Indicators Header Row */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full mb-3 sm:mb-8 gap-3">
            {/* Navigation Breadcrumb */}
            <Link
              to="/projects"
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300 ${
                darkMode
                  ? "border-white/10 hover:border-white/20 bg-white/5 text-gray-300 hover:text-white"
                  : "border-gray-200 hover:border-gray-300 bg-gray-100/50 text-gray-600 hover:text-gray-900"
              }`}
            >
              <ArrowLeft size={14} />
              <span className="text-xs font-semibold tracking-wider uppercase">
                All Projects
              </span>
            </Link>

            {/* Category & Featured Badge Indicators (Desktop Only) */}
            <div className="hidden sm:flex flex-wrap items-center gap-3">
              <span
                className={`px-4 py-1.5 text-xs font-mono font-bold tracking-widest uppercase flex items-center gap-2 rounded-sm transition-all duration-300 ${
                  darkMode
                    ? "bg-cyan-950/60 border-cyan-500/40 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.25)] shadow-cyan-500/10"
                    : "bg-cyan-50 border-cyan-300 text-cyan-700 shadow-[0_0_12px_rgba(6,182,212,0.2)] shadow-cyan-500/15"
                }`}
              >
                {getCategoryIcon(project.category)}
                {project.category}
              </span>
              {project.featured && (
                <span
                  className={`px-4 py-1.5 text-xs font-mono font-bold tracking-widest uppercase flex items-center gap-2 rounded-sm transition-all duration-300 ${
                    darkMode
                      ? "bg-amber-950/60 border-amber-500/40 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.25)] shadow-amber-500/10"
                      : "bg-amber-50 border-amber-300 text-amber-700 shadow-[0_0_12px_rgba(245,158,11,0.2)] shadow-amber-500/15"
                  }`}
                >
                  <Sparkles
                    size={13}
                    className="text-amber-400 animate-pulse"
                  />
                  FEATURED
                </span>
              )}
            </div>
          </div>

          {/* Split Grid Showcase */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 mb-16 items-center">
            {/* Left Column: Details (Order 2 on mobile, Order 1 on Desktop) */}
            <div className="lg:col-span-6 order-2 lg:order-1 flex flex-col justify-center">
              <h1
                className={`text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-4 ${
                  darkMode
                    ? "text-white bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-cyan-200"
                    : "text-gray-900"
                }`}
              >
                {project.title}
              </h1>

              <p
                className={`text-base sm:text-lg leading-relaxed mb-6 ${darkMode ? "text-gray-400" : "text-gray-600"}`}
              >
                {project.description}
              </p>

              {/* Skills/Tags Badge List (directly below description, variant box code styling) */}
              <div className="mb-8">
                <div className="flex flex-wrap gap-2">
                  {project.skills?.map((skill, index) => {
                    const variant = colorVariants[index % colorVariants.length];
                    return (
                      <code
                        key={index}
                        className={`text-xs font-mono py-1 px-2.5 border transition-all duration-300 rounded-xs select-all ${
                          darkMode ? `${variant.dark}` : `${variant.light}`
                        }`}
                      >
                        {skill.toLowerCase()}
                      </code>
                    );
                  })}
                </div>
              </div>

              {/* Premium Buttons (Neobrutalist 3D theme, width-fit to content) */}
              <div className="flex gap-4">
                {project.demoLink && (
                  <a
                    href={project.demoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-3.5 px-6 w-fit transition-all duration-200 flex items-center justify-center gap-2 text-xs font-mono font-bold tracking-wider rounded-none border-2 hover:-translate-x-1 hover:-translate-y-1 active:translate-x-0 active:translate-y-0 ${
                      darkMode
                        ? "bg-white text-black border-white hover:shadow-[4px_4px_0px_0px_rgba(6,182,212,0.85)]"
                        : "bg-black text-white border-black hover:shadow-[4px_4px_0px_0px_rgba(6,182,212,0.85)]"
                    }`}
                  >
                    <ExternalLink size={14} />
                    <span>LAUNCH SITE</span>
                  </a>
                )}
                {project.githubLink && (
                  <a
                    href={project.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-3.5 px-6 w-fit transition-all duration-200 flex items-center justify-center gap-2 text-xs font-mono font-bold tracking-wider rounded-none border-2 hover:-translate-x-1 hover:-translate-y-1 active:translate-x-0 active:translate-y-0 ${
                      darkMode
                        ? "border-white text-white bg-transparent hover:shadow-[4px_4px_0px_0px_rgba(168,85,247,0.85)]"
                        : "border-black text-black bg-transparent hover:shadow-[4px_4px_0px_0px_rgba(168,85,247,0.85)]"
                    }`}
                  >
                    <Github size={14} />
                    <span>SOURCE CODE</span>
                  </a>
                )}
              </div>
            </div>

            {/* Right Column: Video / Image Showcase (Order 1 on mobile, Order 2 on Desktop) */}
            <div className="lg:col-span-6 order-1 lg:order-2">
              {/* Ultra-modern rotating aurora border wrapper */}
              <div
                className={`aspect-video w-full ${darkMode ? "video-card-dark" : "video-card-light"}`}
                style={{
                  "--video-c1": videoC1,
                  "--video-c2": videoC2,
                  "--video-c3": videoC3,
                }}
              >
                {/* Glowing corner dot accents */}
                <span
                  className="video-card-corner-dot"
                  style={{
                    top: "-3px",
                    left: "-3px",
                    background: videoC1,
                    boxShadow: glowC1,
                  }}
                />
                <span
                  className="video-card-corner-dot"
                  style={{
                    top: "-3px",
                    right: "-3px",
                    background: videoC2,
                    boxShadow: glowC2,
                  }}
                />
                <span
                  className="video-card-corner-dot"
                  style={{
                    bottom: "-3px",
                    left: "-3px",
                    background: videoC3,
                    boxShadow: glowC3,
                  }}
                />
                <span
                  className="video-card-corner-dot"
                  style={{
                    bottom: "-3px",
                    right: "-3px",
                    background: videoC1,
                    boxShadow: glowC1,
                  }}
                />

                {/* Inner content wrapper */}
                <div
                  className={
                    darkMode
                      ? "video-card-dark__inner aspect-video"
                      : "video-card-light__inner aspect-video"
                  }
                >
                  {project.mediaType === "video" ? (
                    <video
                      className="w-full h-full object-cover"
                      autoPlay
                      loop
                      muted
                      controls
                      playsInline
                    >
                      <source src={project.video} type="video/mp4" />
                    </video>
                  ) : (
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              </div>
              {/* Mobile Category & Featured Badge Indicators (Below video, mobile only) */}
              <div className="flex sm:hidden flex-wrap justify-end items-center gap-3 mt-3 w-full">
                <span
                  className={`px-4 py-1.5 text-xs font-mono font-bold tracking-widest uppercase flex items-center gap-2 rounded-sm transition-all duration-300 ${
                    darkMode
                      ? "bg-cyan-950/60 border-cyan-500/40 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.25)] shadow-cyan-500/10"
                      : "bg-cyan-50 border-cyan-300 text-cyan-700 shadow-[0_0_12px_rgba(6,182,212,0.2)] shadow-cyan-500/15"
                  }`}
                >
                  {getCategoryIcon(project.category)}
                  {project.category}
                </span>
                {project.featured && (
                  <span
                    className={`px-4 py-1.5 text-xs font-mono font-bold tracking-widest uppercase flex items-center gap-2 rounded-sm transition-all duration-300 ${
                      darkMode
                        ? "bg-amber-950/60 border-amber-500/40 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.25)] shadow-amber-500/10"
                        : "bg-amber-50 border-amber-300 text-amber-700 shadow-[0_0_12px_rgba(245,158,11,0.2)] shadow-amber-500/15"
                    }`}
                  >
                    <Sparkles
                      size={13}
                      className="text-amber-400 animate-pulse"
                    />
                    FEATURED
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Detailed Features — Editorial Row Layout */}
          {project.featuresList && project.featuresList.length > 0 && (
            <div className="mb-16">
              {" "}
              {/* Section header */}
              <div className="flex items-stretch gap-4 mb-7">
                {/* Thin vertical rule */}
                <div
                  className="w-px flex-shrink-0"
                  style={{
                    background: darkMode
                      ? "linear-gradient(180deg,transparent,rgba(6,182,212,0.5),rgba(139,92,246,0.4),transparent)"
                      : "linear-gradient(180deg,transparent,rgba(6,182,212,0.55),rgba(139,92,246,0.4),transparent)",
                  }}
                />
                {/* Labels */}
                <div className="flex flex-col justify-center">
                  <p
                    className={`text-[10px] font-mono font-bold tracking-[0.25em] uppercase mb-1 ${darkMode ? "text-cyan-500" : "text-cyan-600"}`}
                  >
                    Architecture
                  </p>
                  <h2
                    className={`text-xl font-extrabold tracking-tight leading-tight font-serif ${darkMode ? "text-white" : "text-gray-900"}`}
                    style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                  >
                    Key Features
                  </h2>
                </div>
              </div>
              {/* Full-width top rule */}
              <div
                className="mb-0"
                style={{
                  height: "1px",
                  background: darkMode
                    ? "linear-gradient(90deg,rgba(6,182,212,0.5),rgba(139,92,246,0.35),transparent 70%)"
                    : "linear-gradient(90deg,rgba(6,182,212,0.6),rgba(139,92,246,0.35),transparent 70%)",
                }}
              />
              {/* Feature rows — mobile: sequential order; desktop: two-column split */}
              {/* Mobile: all features in correct sequential order (hidden on lg) */}
              <div className="flex flex-col lg:hidden">
                {project.featuresList.map((feat, idx) => (
                  <div key={idx}>
                    <div
                      className={`feat-row ${darkMode ? "feat-row-dark" : "feat-row-light"}`}
                    >
                      <span className="feat-row__num">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <div
                        className="feat-row__vline"
                        style={{
                          background: darkMode
                            ? "linear-gradient(180deg,transparent,rgba(6,182,212,0.35) 30%,rgba(139,92,246,0.35) 70%,transparent)"
                            : "linear-gradient(180deg,transparent,rgba(6,182,212,0.45) 30%,rgba(139,92,246,0.35) 70%,transparent)",
                        }}
                      />
                      <div className="feat-row__content">
                        <h4
                          className={`text-sm font-bold mb-1.5 leading-snug ${darkMode ? "text-white" : "text-gray-900"}`}
                        >
                          {feat.title}
                        </h4>
                        <p
                          className={`text-xs leading-relaxed ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                        >
                          {feat.description}
                        </p>
                      </div>
                    </div>
                    <div
                      style={{
                        height: "1px",
                        background: darkMode
                          ? "rgba(255,255,255,0.05)"
                          : "rgba(0,0,0,0.06)",
                      }}
                    />
                  </div>
                ))}
              </div>
              {/* Desktop: two-column split (hidden below lg) */}
              <div className="hidden lg:flex lg:flex-row lg:gap-0">
                {/* Left column — even-indexed features */}
                <div className="flex-1 lg:pr-6">
                  {project.featuresList
                    .filter((_, i) => i % 2 === 0)
                    .map((feat, colIdx) => {
                      const idx = colIdx * 2;
                      return (
                        <div key={idx}>
                          <div
                            className={`feat-row ${darkMode ? "feat-row-dark" : "feat-row-light"}`}
                          >
                            <span className="feat-row__num">
                              {String(idx + 1).padStart(2, "0")}
                            </span>
                            <div
                              className="feat-row__vline"
                              style={{
                                background: darkMode
                                  ? "linear-gradient(180deg,transparent,rgba(6,182,212,0.35) 30%,rgba(139,92,246,0.35) 70%,transparent)"
                                  : "linear-gradient(180deg,transparent,rgba(6,182,212,0.45) 30%,rgba(139,92,246,0.35) 70%,transparent)",
                              }}
                            />
                            <div className="feat-row__content">
                              <h4
                                className={`text-sm font-bold mb-1.5 leading-snug ${darkMode ? "text-white" : "text-gray-900"}`}
                              >
                                {feat.title}
                              </h4>
                              <p
                                className={`text-xs leading-relaxed ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                              >
                                {feat.description}
                              </p>
                            </div>
                          </div>
                          <div
                            style={{
                              height: "1px",
                              background: darkMode
                                ? "rgba(255,255,255,0.05)"
                                : "rgba(0,0,0,0.06)",
                            }}
                          />
                        </div>
                      );
                    })}
                </div>

                {/* Right column — odd-indexed features */}
                <div className="flex-1 lg:pl-6">
                  {project.featuresList
                    .filter((_, i) => i % 2 === 1)
                    .map((feat, colIdx) => {
                      const idx = colIdx * 2 + 1;
                      return (
                        <div key={idx}>
                          <div
                            className={`feat-row ${darkMode ? "feat-row-dark" : "feat-row-light"}`}
                          >
                            <span className="feat-row__num">
                              {String(idx + 1).padStart(2, "0")}
                            </span>
                            <div
                              className="feat-row__vline"
                              style={{
                                background: darkMode
                                  ? "linear-gradient(180deg,transparent,rgba(6,182,212,0.35) 30%,rgba(139,92,246,0.35) 70%,transparent)"
                                  : "linear-gradient(180deg,transparent,rgba(6,182,212,0.45) 30%,rgba(139,92,246,0.35) 70%,transparent)",
                              }}
                            />
                            <div className="feat-row__content">
                              <h4
                                className={`text-sm font-bold mb-1.5 leading-snug ${darkMode ? "text-white" : "text-gray-900"}`}
                              >
                                {feat.title}
                              </h4>
                              <p
                                className={`text-xs leading-relaxed ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                              >
                                {feat.description}
                              </p>
                            </div>
                          </div>
                          <div
                            style={{
                              height: "1px",
                              background: darkMode
                                ? "rgba(255,255,255,0.05)"
                                : "rgba(0,0,0,0.06)",
                            }}
                          />
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          )}

          {/* Project Gallery Showcase — Ultra Modern */}
          {project.gallery && project.gallery.length > 0 && (
            <div className="mb-16">
              {/* Section Header */}
              <div className="flex items-stretch justify-between mb-8">
                {/* Left: vertical rule + labels */}
                <div className="flex items-stretch gap-4">
                  <div
                    className="w-px flex-shrink-0"
                    style={{
                      background: darkMode
                        ? "linear-gradient(180deg,transparent,rgba(6,182,212,0.6),rgba(139,92,246,0.5),transparent)"
                        : "linear-gradient(180deg,transparent,rgba(6,182,212,0.65),rgba(139,92,246,0.45),transparent)",
                    }}
                  />
                  <div className="flex flex-col justify-center">
                    <p
                      className={`text-[10px] font-mono font-bold tracking-[0.25em] uppercase mb-1 ${darkMode ? "text-cyan-500" : "text-cyan-600"}`}
                    >
                      Visual Showcase
                    </p>
                    <h2
                      className={`text-xl font-extrabold tracking-tight leading-tight font-serif ${darkMode ? "text-white" : "text-gray-900"}`}
                      style={{
                        fontFamily: "Georgia, 'Times New Roman', serif",
                      }}
                    >
                      Interface Gallery
                    </h2>
                  </div>
                </div>

                {/* Right: Layout toggle buttons */}
                <div
                  className={`hidden md:flex items-center gap-1 p-1 rounded-xl border self-center ${
                    darkMode
                      ? "bg-white/5 border-white/10"
                      : "bg-gray-100/80 border-gray-200"
                  }`}
                >
                  {/* Filmstrip layout icon */}
                  <button
                    onClick={() => setGalleryLayout("filmstrip")}
                    title="Filmstrip Layout"
                    className={`p-2 rounded-lg transition-all cursor-pointer duration-200 ${
                      galleryLayout === "filmstrip"
                        ? darkMode
                          ? "bg-cyan-500/20 text-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.3)]"
                          : "bg-white text-cyan-600 shadow-sm"
                        : darkMode
                          ? "text-gray-500 hover:text-gray-300"
                          : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    <Film size={18} className="rotate-90" />
                  </button>

                  {/* Bento layout icon */}
                  <button
                    onClick={() => setGalleryLayout("bento")}
                    title="Bento Layout"
                    className={`p-2 rounded-lg transition-all cursor-pointer duration-200 ${
                      galleryLayout === "bento"
                        ? darkMode
                          ? "bg-cyan-500/20 text-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.3)]"
                          : "bg-white text-cyan-600 shadow-sm"
                        : darkMode
                          ? "text-gray-500 hover:text-gray-300"
                          : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <rect
                        x="1"
                        y="1"
                        width="9"
                        height="10"
                        rx="1.5"
                        fill="currentColor"
                        opacity="0.9"
                      />
                      <rect
                        x="12"
                        y="1"
                        width="5"
                        height="4.5"
                        rx="1.5"
                        fill="currentColor"
                        opacity="0.7"
                      />
                      <rect
                        x="12"
                        y="6.5"
                        width="5"
                        height="4.5"
                        rx="1.5"
                        fill="currentColor"
                        opacity="0.7"
                      />
                      <rect
                        x="1"
                        y="13"
                        width="4.5"
                        height="4"
                        rx="1.5"
                        fill="currentColor"
                        opacity="0.6"
                      />
                      <rect
                        x="6.75"
                        y="13"
                        width="4.5"
                        height="4"
                        rx="1.5"
                        fill="currentColor"
                        opacity="0.6"
                      />
                      <rect
                        x="12.5"
                        y="13"
                        width="4.5"
                        height="4"
                        rx="1.5"
                        fill="currentColor"
                        opacity="0.6"
                      />
                    </svg>
                  </button>

                  {/* Grid layout icon */}
                  <button
                    onClick={() => setGalleryLayout("grid")}
                    title="Grid Layout"
                    className={`p-2 rounded-lg transition-all cursor-pointer duration-200 ${
                      galleryLayout === "grid"
                        ? darkMode
                          ? "bg-cyan-500/20 text-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.3)]"
                          : "bg-white text-cyan-600 shadow-sm"
                        : darkMode
                          ? "text-gray-500 hover:text-gray-300"
                          : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <rect
                        x="1"
                        y="1"
                        width="7"
                        height="7"
                        rx="1.5"
                        fill="currentColor"
                        opacity="0.9"
                      />
                      <rect
                        x="10"
                        y="1"
                        width="7"
                        height="7"
                        rx="1.5"
                        fill="currentColor"
                        opacity="0.9"
                      />
                      <rect
                        x="1"
                        y="10"
                        width="7"
                        height="7"
                        rx="1.5"
                        fill="currentColor"
                        opacity="0.6"
                      />
                      <rect
                        x="10"
                        y="10"
                        width="7"
                        height="7"
                        rx="1.5"
                        fill="currentColor"
                        opacity="0.6"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* ── GRID LAYOUT ── */}
              {galleryLayout === "grid" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {project.gallery.map((img, idx) => (
                    <div
                      key={idx}
                      className={`group relative overflow-hidden rounded-2xl border cursor-pointer aspect-video ${
                        darkMode
                          ? "border-white/10 hover:border-cyan-500/40"
                          : "border-gray-200/80 hover:border-cyan-400/50"
                      } transition-all duration-500`}
                      style={{
                        boxShadow: darkMode
                          ? "0 4px 24px rgba(0,0,0,0.4),inset 0 1px 0 rgba(255,255,255,0.04)"
                          : "0 4px 24px rgba(0,0,0,0.08),inset 0 1px 0 rgba(255,255,255,0.8)",
                      }}
                    >
                      <GalleryBadge idx={idx} darkMode={darkMode} />
                      <GalleryGlow />
                      <img
                        src={img.url}
                        alt={img.caption}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                      <GalleryCaption
                        caption={img.caption}
                        darkMode={darkMode}
                      />
                      <GalleryScrim />
                    </div>
                  ))}
                </div>
              )}

              {/* ── BENTO LAYOUT ── */}
              {galleryLayout === "bento" &&
                (() => {
                  // Split: first 3 form the hero block, rest fill a 3-col strip
                  const hero = project.gallery.slice(0, 1);
                  const side = project.gallery.slice(1, 3);
                  const strip = project.gallery.slice(3);
                  const cardCls = (extra = "") =>
                    `group relative overflow-hidden rounded-2xl border cursor-pointer ${
                      darkMode
                        ? "border-white/10 hover:border-cyan-500/40"
                        : "border-gray-200/80 hover:border-cyan-400/50"
                    } transition-all duration-500 ${extra}`;
                  const shadow = {
                    boxShadow: darkMode
                      ? "0 4px 24px rgba(0,0,0,0.4),inset 0 1px 0 rgba(255,255,255,0.04)"
                      : "0 4px 24px rgba(0,0,0,0.08),inset 0 1px 0 rgba(255,255,255,0.8)",
                  };

                  return (
                    <div className="flex flex-col gap-4">
                      {/* Hero block: large left + 2 stacked right */}
                      <div
                        className="grid grid-cols-1 md:grid-cols-12 gap-4"
                        style={{ minHeight: "340px" }}
                      >
                        {/* Large hero */}
                        {hero.map((img, i) => (
                          <div
                            key={i}
                            className={cardCls("md:col-span-7 h-64 md:h-auto")}
                            style={shadow}
                          >
                            <GalleryBadge idx={0} darkMode={darkMode} />
                            <GalleryGlow />
                            <img
                              src={img.url}
                              alt={img.caption}
                              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                            />
                            <GalleryCaption
                              caption={img.caption}
                              darkMode={darkMode}
                            />
                            <GalleryScrim />
                          </div>
                        ))}

                        {/* Two stacked side cards */}
                        <div className="md:col-span-5 flex flex-col gap-4">
                          {side.map((img, i) => (
                            <div
                              key={i}
                              className={cardCls("flex-1 min-h-[140px]")}
                              style={shadow}
                            >
                              <GalleryBadge idx={i + 1} darkMode={darkMode} />
                              <GalleryGlow />
                              <img
                                src={img.url}
                                alt={img.caption}
                                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                              />
                              <GalleryCaption
                                caption={img.caption}
                                darkMode={darkMode}
                              />
                              <GalleryScrim />
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 3-column strip for remaining images */}
                      {strip.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {strip.map((img, i) => (
                            <div
                              key={i}
                              className={cardCls("aspect-video")}
                              style={shadow}
                            >
                              <GalleryBadge idx={i + 3} darkMode={darkMode} />
                              <GalleryGlow />
                              <img
                                src={img.url}
                                alt={img.caption}
                                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                              />
                              <GalleryCaption
                                caption={img.caption}
                                darkMode={darkMode}
                              />
                              <GalleryScrim />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })()}

              {/* ── FILMSTRIP LAYOUT ── */}
              {galleryLayout === "filmstrip" && (
                <FilmstripLayout
                  gallery={project.gallery}
                  darkMode={darkMode}
                />
              )}
            </div>
          )}

          {/* ── TECHNOLOGY SPECIFICATIONS ── */}
          {project.techStackDetails &&
            project.techStackDetails.length > 0 &&
            (() => {
              // Resolve icon per category via substring match
              const resolveIcon = (cat) => {
                const c = cat.toLowerCase();
                if (c.includes("front")) return Layers;
                if (c.includes("back") || c.includes("server")) return Server;
                if (
                  c.includes("devops") ||
                  c.includes("cloud") ||
                  c.includes("infra")
                )
                  return Cloud;
                if (c.includes("security") || c.includes("optim"))
                  return ShieldCheck;
                if (c.includes("test") || c.includes("quality"))
                  return CheckCircle2;
                return Code;
              };

              // Category accent palette
              const accentPalette = [
                {
                  from: "#06b6d4",
                  to: "#8b5cf6",
                  glow: "rgba(6,182,212,0.35)",
                  name: "cyan-violet",
                },
                {
                  from: "#f59e0b",
                  to: "#ef4444",
                  glow: "rgba(245,158,11,0.3)",
                  name: "amber-red",
                },
                {
                  from: "#10b981",
                  to: "#06b6d4",
                  glow: "rgba(16,185,129,0.3)",
                  name: "emerald-cyan",
                },
                {
                  from: "#a855f7",
                  to: "#ec4899",
                  glow: "rgba(168,85,247,0.3)",
                  name: "purple-pink",
                },
                {
                  from: "#3b82f6",
                  to: "#06b6d4",
                  glow: "rgba(59,130,246,0.3)",
                  name: "blue-cyan",
                },
                {
                  from: "#f97316",
                  to: "#f59e0b",
                  glow: "rgba(249,115,22,0.3)",
                  name: "orange-amber",
                },
              ];

              const totalTools = project.techStackDetails.reduce(
                (a, t) => a + t.items.length,
                0,
              );

              return (
                <div className="mb-16">
                  {/* ── INJECTED STYLES ── */}
                  <style>{`
                /* Rotating conic-gradient border */
                @property --ts-angle {
                  syntax: "<angle>";
                  initial-value: 0deg;
                  inherits: false;
                }
                @keyframes ts-spin { to { --ts-angle: 360deg; } }


                /* Stagger fade-in-up */
                @keyframes ts-rise {
                  from { opacity: 0; transform: translateY(28px) scale(0.97); }
                  to   { opacity: 1; transform: translateY(0)      scale(1); }
                }

                /* Badge shimmer sweep */
                @keyframes ts-badge-shine {
                  0%   { background-position: -200% center; }
                  100% { background-position: 300% center; }
                }

                /* Pulse ring for dot */
                @keyframes ts-ring-pulse {
                  0%, 100% { transform: scale(1); opacity: 0.8; }
                  50%       { transform: scale(1.5); opacity: 0; }
                }

                /* Header beacon blink */
                @keyframes ts-beacon {
                  0%, 100% { opacity: 1; }
                  50%       { opacity: 0.2; }
                }

                /* Neon line slide */
                @keyframes ts-neon-slide {
                  0%   { left: -60%; }
                  100% { left: 110%; }
                }

                /* Outer glow spin wrapper */
                .ts-card-wrap {
                  position: relative;
                  border-radius: 1.5rem;
                }
                .ts-card-wrap::before {
                  content: "";
                  position: absolute;
                  inset: -1.5px;
                  border-radius: inherit;
                  background: conic-gradient(
                    from var(--ts-angle),
                    transparent 55%,
                    var(--ts-c1, rgba(6,182,212,0.8)) 75%,
                    var(--ts-c2, rgba(139,92,246,0.8)) 88%,
                    transparent 100%
                  );
                  animation: ts-spin 5s linear infinite;
                  opacity: 0;
                  transition: opacity 0.4s ease;
                  z-index: 0;
                  padding: 1.5px;
                  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
                  -webkit-mask-composite: xor;
                  mask-composite: exclude;
                  pointer-events: none;
                }
                .ts-card-wrap:hover::before { opacity: 1; }

                /* Inner card surface */
                .ts-card-surface {
                  position: relative;
                  z-index: 1;
                  border-radius: calc(1.5rem - 1.5px);
                  overflow: hidden;
                  height: 100%;
                }



                /* Neon corner accent */
                .ts-corner-tl, .ts-corner-br {
                  position: absolute;
                  width: 20px; height: 20px;
                  pointer-events: none;
                  z-index: 3;
                }
                .ts-corner-tl {
                  top: 10px; left: 10px;
                  border-top: 2px solid;
                  border-left: 2px solid;
                  border-radius: 4px 0 0 0;
                  opacity: 0;
                  transition: opacity 0.4s;
                }
                .ts-corner-br {
                  bottom: 10px; right: 10px;
                  border-bottom: 2px solid;
                  border-right: 2px solid;
                  border-radius: 0 0 4px 0;
                  opacity: 0;
                  transition: opacity 0.4s;
                }
                .ts-card-wrap:hover .ts-corner-tl,
                .ts-card-wrap:hover .ts-corner-br { opacity: 1; }


                /* Rise animation per card */
                .ts-rise { animation: ts-rise 0.6s cubic-bezier(0.16,1,0.3,1) both; }

                /* Pill glow badge */
                .ts-pill {
                  position: relative;
                  overflow: hidden;
                  transition: all 0.25s ease;
                }
                .ts-pill::before {
                  content: "";
                  position: absolute;
                  inset: 0;
                  background: linear-gradient(
                    105deg,
                    transparent 20%,
                    rgba(255,255,255,0.07) 50%,
                    transparent 80%
                  );
                  background-size: 200% 100%;
                  opacity: 0;
                  transition: opacity 0.3s;
                }
                .ts-pill:hover::before {
                  opacity: 1;
                  animation: ts-badge-shine 1.2s ease-in-out;
                }

                /* Header neon bar underline */
                .ts-header-rule {
                  position: relative;
                  overflow: hidden;
                }
                .ts-header-rule::after {
                  content: "";
                  position: absolute;
                  left: -100%; top: 0;
                  height: 100%;
                  width: 60%;
                  background: linear-gradient(
                    to right,
                    transparent,
                    rgba(6,182,212,0.5),
                    rgba(139,92,246,0.4),
                    transparent
                  );
                  animation: ts-neon-slide 4s ease-in-out infinite;
                }

                /* Live dot ring */
                .ts-live-ring {
                  animation: ts-ring-pulse 2s ease-in-out infinite;
                }

                /* Beacon dot */
                .ts-beacon { animation: ts-beacon 1.4s ease-in-out infinite; }

                /* Stats counter bar */
                .ts-stat-bar {
                  position: relative;
                  overflow: hidden;
                }
                .ts-stat-bar::after {
                  content: "";
                  position: absolute;
                  left: -100%; top: 0; bottom: 0;
                  width: 80%;
                  background: linear-gradient(to right, transparent, rgba(6,182,212,0.08), transparent);
                  animation: ts-neon-slide 3.5s ease-in-out infinite;
                }

                /* Grid lines BG */
                .ts-grid-bg {
                  background-image:
                    linear-gradient(rgba(6,182,212,0.03) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(6,182,212,0.03) 1px, transparent 1px);
                  background-size: 32px 32px;
                }

                /* Category dot matrix */
                .ts-dot-matrix {
                  display: grid;
                  grid-template-columns: repeat(4, 1fr);
                  gap: 3px;
                }
                .ts-dot {
                  width: 4px; height: 4px;
                  border-radius: 50%;
                  transition: all 0.3s;
                }

                /* Holographic shimmer on hero card */
                .ts-holo-card {
                  background-size: 200% 200%;
                  animation: ts-holo-shift 8s ease-in-out infinite;
                }
                @keyframes ts-holo-shift {
                  0%, 100% { background-position: 0% 0%; }
                  50%       { background-position: 100% 100%; }
                }
              `}</style>

                  {/* ── SECTION HEADER SYSTEM BAR ── */}
                  <div
                    className={`relative rounded-xl mb-6 overflow-hidden ts-stat-bar ${
                      darkMode
                        ? "bg-slate-950/90 border border-white/[0.06]"
                        : "bg-white/95 border border-gray-200/70"
                    } backdrop-blur-xl`}
                  >
                    {/* Subtle grid BG */}
                    <div
                      className={`absolute inset-0 ts-grid-bg opacity-60 pointer-events-none`}
                    />

                    {/* Accent top bar */}
                    <div
                      className="absolute top-0 left-0 right-0 h-[2px] ts-header-rule rounded-full"
                      style={{
                        background:
                          "linear-gradient(to right, rgba(6,182,212,0.6), rgba(139,92,246,0.6), rgba(6,182,212,0.3))",
                      }}
                    />

                    <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-5 py-3">
                      {/* Left: label + title */}
                      <div className="flex items-center gap-3">
                        {/* Live status dot */}
                        <div className="relative flex-shrink-0">
                          <div className="absolute inset-0 rounded-full bg-cyan-400/30 ts-live-ring" />
                          <div className="relative w-2 h-2 rounded-full bg-cyan-400 ts-beacon" />
                        </div>

                        <div>
                          <h2
                            className={`text-base font-bold tracking-wider font-mono uppercase ${
                              darkMode ? "text-white" : "text-gray-900"
                            }`}
                          >
                            Technology{" "}
                            <span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
                              Specifications
                            </span>
                          </h2>
                        </div>
                      </div>

                      {/* Right: stats chips */}
                      <div className="flex items-center gap-2 flex-wrap max-sm:hidden">
                        {[
                          {
                            label: "MODULES",
                            value: project.techStackDetails.length,
                          },
                          { label: "TOOLS", value: totalTools },
                        ].map((stat) => (
                          <div
                            key={stat.label}
                            className={`flex flex-col items-center px-3 py-1.5 rounded-lg font-mono ${
                              darkMode
                                ? "bg-slate-900/80 border-white/[0.06] text-white"
                                : "bg-gray-50/80 border-gray-200/80 text-gray-800"
                            }`}
                          >
                            <span
                              className={`text-base font-black leading-none ${
                                darkMode ? "text-cyan-300" : "text-cyan-600"
                              }`}
                            >
                              {stat.value.toString().padStart(2, "0")}
                            </span>
                            <span
                              className={`text-[7px] tracking-[0.2em] uppercase mt-0.5 ${
                                darkMode ? "text-zinc-500" : "text-zinc-400"
                              }`}
                            >
                              {stat.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* ── BENTO GRID ── */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {project.techStackDetails.map((tech, idx) => {
                      const Icon = resolveIcon(tech.category);
                      const accent = accentPalette[idx % accentPalette.length];
                      const isHero = idx === 0;
                      const colSpan = isHero
                        ? "col-span-1 md:col-span-2 lg:col-span-2"
                        : "col-span-1";

                      // Dot matrix fill (16 dots, active = items count capped)
                      const dotCount = 16;
                      const activeDots = Math.min(tech.items.length, dotCount);

                      return (
                        <div
                          key={idx}
                          className={`ts-card-wrap ts-rise ${colSpan}`}
                          style={{
                            "--ts-c1": accent.from + "cc",
                            "--ts-c2": accent.to + "cc",
                            animationDelay: `${idx * 0.08}s`,
                          }}
                        >
                          {/* Neon corner accents */}
                          <div
                            className="ts-corner-tl"
                            style={{ borderColor: accent.from }}
                          />
                          <div
                            className="ts-corner-br"
                            style={{ borderColor: accent.to }}
                          />

                          {/* Main card surface */}
                          <div
                            className={`ts-card-surface p-6 border transition-all duration-500 ${
                              darkMode
                                ? "bg-slate-950/90 border-white/[0.05] group-hover:shadow-2xl"
                                : "bg-white/95 border-gray-200/80 group-hover:shadow-xl"
                            } backdrop-blur-2xl`}
                            style={{
                              boxShadow: `inset 0 1px 0 rgba(255,255,255,${darkMode ? "0.04" : "0.8"})`,
                            }}
                          >
                            {/* Ambient gradient blob */}
                            <div
                              className="absolute -right-16 -top-16 w-48 h-48 rounded-full blur-3xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                              style={{
                                background: `radial-gradient(circle, ${accent.glow}, transparent 70%)`,
                              }}
                            />

                            {/* Grid dots BG (subtle) */}
                            {isHero && (
                              <div
                                className={`absolute inset-0 ts-grid-bg opacity-40 rounded-[inherit] pointer-events-none`}
                              />
                            )}

                            {/* Watermark index */}
                            <div
                              className="absolute right-5 bottom-3 font-black font-mono leading-none select-none pointer-events-none transition-all duration-500"
                              style={{
                                fontSize: "5rem",
                                color: darkMode
                                  ? `${accent.from}08`
                                  : `${accent.from}0d`,
                                letterSpacing: "-0.05em",
                              }}
                            >
                              {String(idx + 1).padStart(2, "0")}
                            </div>

                            {/* ── CARD HEADER ── */}
                            <div className="relative z-10 flex items-start justify-between mb-5">
                              <div className="flex items-center gap-3">
                                {/* Icon container with glow ring */}
                                <div
                                  className="relative flex-shrink-0 p-2.5 rounded-xl transition-all duration-500"
                                  style={{
                                    background: `linear-gradient(135deg, ${accent.from}1a, ${accent.to}1a)`,
                                    border: `1px solid ${accent.from}22`,
                                    boxShadow: `0 0 0 0 ${accent.glow}`,
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.boxShadow = `0 0 16px ${accent.glow}`;
                                    e.currentTarget.style.borderColor = `${accent.from}55`;
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.boxShadow = `0 0 0 0 ${accent.glow}`;
                                    e.currentTarget.style.borderColor = `${accent.from}22`;
                                  }}
                                >
                                  <Icon
                                    size={isHero ? 20 : 17}
                                    style={{
                                      color: accent.from,
                                      transition: "all 0.4s",
                                    }}
                                  />
                                </div>

                                <div>
                                  {/* Module label */}
                                  <p
                                    className="font-mono text-[9px] tracking-[0.3em] uppercase mb-0.5"
                                    style={{ color: `${accent.from}99` }}
                                  >
                                    Module_{String(idx + 1).padStart(2, "0")}
                                  </p>
                                  {/* Category name */}
                                  <h4
                                    className={`font-outfit font-extrabold tracking-wider leading-tight ${
                                      isHero ? "text-base" : "text-sm"
                                    } ${darkMode ? "text-white" : "text-gray-900"}`}
                                  >
                                    {tech.category}
                                  </h4>
                                </div>
                              </div>

                              {/* Right side: dot matrix + count */}
                              <div className="flex flex-col items-end gap-2 flex-shrink-0">
                                {/* Dot matrix visualization */}
                                <div className="ts-dot-matrix">
                                  {Array.from({ length: dotCount }).map(
                                    (_, d) => (
                                      <div
                                        key={d}
                                        className="ts-dot"
                                        style={{
                                          background:
                                            d < activeDots
                                              ? `linear-gradient(135deg, ${accent.from}, ${accent.to})`
                                              : darkMode
                                                ? "rgba(255,255,255,0.06)"
                                                : "rgba(0,0,0,0.08)",
                                          boxShadow:
                                            d < activeDots
                                              ? `0 0 4px ${accent.glow}`
                                              : "none",
                                          transitionDelay: `${d * 30}ms`,
                                        }}
                                      />
                                    ),
                                  )}
                                </div>
                                {/* Count badge */}
                                <span
                                  className="font-mono text-[9px] px-2 py-0.5 rounded-md border"
                                  style={{
                                    background: `${accent.from}10`,
                                    borderColor: `${accent.from}25`,
                                    color: accent.from,
                                  }}
                                >
                                  {tech.items.length} tools
                                </span>
                              </div>
                            </div>

                            {/* ── TECH PILL BADGES ── */}
                            <div className="relative z-10 flex flex-wrap gap-2">
                              {tech.items.map((item, key) => (
                                <span
                                  key={key}
                                  className={`ts-pill font-mono text-[11px] px-3 py-1.5 rounded-lg border cursor-default select-none`}
                                  style={{
                                    background: darkMode
                                      ? `linear-gradient(135deg, ${accent.from}08, ${accent.to}06)`
                                      : `linear-gradient(135deg, ${accent.from}08, ${accent.to}05)`,
                                    borderColor: darkMode
                                      ? `${accent.from}18`
                                      : `${accent.from}20`,
                                    color: darkMode
                                      ? "rgba(228,228,231,0.85)"
                                      : "rgba(63,63,70,0.9)",
                                    transition: "all 0.25s ease",
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.background = `linear-gradient(135deg, ${accent.from}1f, ${accent.to}15)`;
                                    e.currentTarget.style.borderColor = `${accent.from}45`;
                                    e.currentTarget.style.color = accent.from;
                                    e.currentTarget.style.boxShadow = `0 0 12px ${accent.glow}, 0 2px 8px rgba(0,0,0,0.15)`;
                                    e.currentTarget.style.transform =
                                      "translateY(-2px) scale(1.04)";
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.background = darkMode
                                      ? `linear-gradient(135deg, ${accent.from}08, ${accent.to}06)`
                                      : `linear-gradient(135deg, ${accent.from}08, ${accent.to}05)`;
                                    e.currentTarget.style.borderColor = darkMode
                                      ? `${accent.from}18`
                                      : `${accent.from}20`;
                                    e.currentTarget.style.color = darkMode
                                      ? "rgba(228,228,231,0.85)"
                                      : "rgba(63,63,70,0.9)";
                                    e.currentTarget.style.boxShadow = "none";
                                    e.currentTarget.style.transform =
                                      "translateY(0) scale(1)";
                                  }}
                                >
                                  {item}
                                </span>
                              ))}
                            </div>
                          </div>
                          {/* /ts-card-surface */}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

          {/* ── Explore More Projects — Cinematic Wide-Card Layout ── */}
          <div>
            {/* Section Header */}
            <div className="flex items-center gap-4 mb-10">
              <div
                className={`flex-1 h-px bg-gradient-to-r ${darkMode ? "from-transparent via-cyan-500/30 to-cyan-500/60" : "from-transparent via-cyan-400/40 to-cyan-500/70"}`}
              />
              <div className="flex items-center gap-2.5 px-4">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                <h3
                  className={`text-[10px] font-black font-outfit tracking-[0.3em] uppercase ${darkMode ? "text-cyan-400/80" : "text-cyan-600/80"}`}
                >
                  Explore More Projects
                </h3>
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
              </div>
              <div
                className={`flex-1 h-px bg-gradient-to-l ${darkMode ? "from-transparent via-cyan-500/30 to-cyan-500/60" : "from-transparent via-cyan-400/40 to-cyan-500/70"}`}
              />
            </div>
            <style>{projectCardStyle}</style>

            {/* Responsive Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {exploreProjects.map((item, idx) => {
                // Responsive visibility:
                // idx 0, 1: Always visible (1 col on mobile -> 2 rows)
                // idx 2: Visible on md/lg (2 cols on tablet -> 2x2 grid, 3 cols on desktop -> 1x3 grid)
                // idx 3: Visible only on md screens (4th item for tablet 2x2 grid)
                const visibilityClass =
                  idx === 0 || idx === 1
                    ? "block"
                    : idx === 2
                      ? "hidden md:block"
                      : "hidden md:block lg:hidden";

                return (
                  <div
                    key={item._id || idx}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    onClick={() =>
                      navigate(`/projects/${item.slug || item._id}`)
                    }
                    className={`${visibilityClass} project-card-grid relative p-2 rounded-none group aspect-video isolate z-0 cursor-pointer`}
                    style={{
                      "--ts-c1": item.featured ? "#f59e0b" : "#06b6d4",
                      "--ts-c2": item.featured ? "#ec4899" : "#3b82f6",
                      "--ts-shine-color": item.featured
                        ? "rgba(245, 158, 11, 0.18)"
                        : "rgba(6, 182, 212, 0.18)",
                    }}
                  >
                    <div className="project-card-inner shadow-md shadow-black/70 rounded-none flex flex-col relative h-full z-10">
                      {/* Extra shimmer sweep effect on hover */}
                      <div className="project-card-shine" />

                      {/* Glassy Featured Hover Badge */}
                      {item.featured && expandedExploreId !== item._id && (
                        <div className="absolute top-4 right-4 z-30 flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-[8px] font-black tracking-widest uppercase transition-all duration-300 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 text-neutral-950 border border-amber-300 shadow-md shadow-amber-500/30">
                          <Sparkles
                            size={8}
                            className="animate-pulse text-neutral-950 shrink-0"
                          />
                          <span>FEATURED</span>
                        </div>
                      )}

                      {/* Glassy Category Hover Badge */}
                      {item.category && expandedExploreId !== item._id && (
                        <div
                          className={`absolute -top-px -left-px z-30 px-3 py-1.5 rounded-br-md text-[8px] font-black tracking-widest uppercase transition-all duration-300 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 bg-neutral-950/95 border-r border-b backdrop-blur-xs max-[466px]:px-2 max-[466px]:py-1 max-[466px]:text-[7px] ${
                            item.featured
                              ? "border-amber-500/40 text-amber-300"
                              : "border-cyan-500/40 text-cyan-300"
                          }`}
                        >
                          <span className="font-semibold uppercase tracking-[0.25em] max-[466px]:tracking-[0.15em]">
                            {item.category}
                          </span>
                        </div>
                      )}

                      {/* Media Wrapper */}
                      <div className="absolute inset-0 rounded-none overflow-hidden z-0">
                        {item.mediaType === "video" || item.video ? (
                          <video
                            className="absolute inset-0 w-full h-full object-cover"
                            autoPlay
                            loop
                            muted
                            playsInline
                          >
                            <source src={item.video} type="video/mp4" />
                          </video>
                        ) : (
                          <img
                            src={item.image}
                            alt=""
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        )}
                        <div
                          className={`absolute inset-0 z-10 transition-opacity duration-300 ${
                            expandedExploreId === item._id
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
                          expandedExploreId === item._id
                            ? "h-full p-4"
                            : "mt-auto hidden max-lg:flex group-hover:flex pl-3 pb-2 bg-gray-950/85 backdrop-blur-xs"
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.innerWidth >= 467) {
                            setExpandedExploreId(
                              expandedExploreId === item._id ? null : item._id,
                            );
                          }
                        }}
                      >
                        <div className="flex justify-between items-center w-full pr-3 mb-1 max-[466px]:pr-1 max-[466px]:mb-0 max-[466px]:gap-2">
                          <h3
                            className={`text-base font-semibold font-sans tracking-wide transition-colors duration-300 max-[466px]:text-[13px] max-[466px]:leading-tight max-[466px]:line-clamp-1 ${
                              item.featured ? "text-amber-400" : "text-cyan-400"
                            }`}
                          >
                            {item.title}
                          </h3>
                          {expandedExploreId !== item._id && (
                            <MoveRightIcon
                              size={16}
                              className={`project-move-right transition-all duration-300 shrink-0 transform group-hover:translate-x-1 ${
                                item.featured
                                  ? "text-amber-400"
                                  : "text-cyan-400"
                              }`}
                            />
                          )}
                        </div>

                        {expandedExploreId === item._id ? (
                          <div className="flex flex-col h-full space-y-4 animate-in fade-in zoom-in-95 duration-300">
                            <p className="text-slate-300 dark:text-slate-300 font-normal font-sans text-xs tracking-normal line-clamp-3 leading-relaxed">
                              {item.description}
                            </p>

                            {/* Tags (Only 4 skills) */}
                            <div className="flex flex-wrap gap-2 pt-1">
                              {item.skills?.slice(0, 4).map((tag, idx) => (
                                <span
                                  key={idx}
                                  className={`tech-badge px-2.5 py-0.5 border border-dashed rounded text-[9px] font-mono tracking-wider transition-all duration-300 ${
                                    item.featured
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
                                {item.demoLink && (
                                  <a
                                    href={item.demoLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className={`group relative px-2.5 py-1.5 rounded-lg transition-all duration-300 transform active:scale-90 overflow-hidden flex items-center justify-center gap-1 text-[10px] font-medium ${
                                      item.featured
                                        ? darkMode
                                          ? "backdrop-blur-md bg-amber-500/15 border border-amber-500/30 hover:border-amber-400/60 hover:-translate-y-0.5 drop-shadow-sm text-amber-300 hover:text-amber-200"
                                          : "backdrop-blur-md bg-amber-400/15 border border-amber-400/40 hover:border-amber-300/70 hover:-translate-y-0.5 drop-shadow-sm text-amber-600 hover:text-amber-500"
                                        : darkMode
                                          ? "backdrop-blur-md bg-cyan-500/15 border border-cyan-500/30 hover:border-cyan-400/60 hover:-translate-y-0.5 drop-shadow-sm text-cyan-300 hover:text-cyan-200"
                                          : "backdrop-blur-md bg-cyan-400/15 border border-cyan-400/40 hover:border-cyan-300/70 hover:-translate-y-0.5 drop-shadow-sm text-cyan-500 hover:text-cyan-400"
                                    }`}
                                  >
                                    <ExternalLink
                                      size={12}
                                      className="transition-all duration-300 group-hover:scale-110"
                                    />
                                    <span>DEMO</span>
                                  </a>
                                )}
                                {item.githubLink && (
                                  <a
                                    href={item.githubLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className={`group relative px-2.5 py-1.5 rounded-lg transition-all duration-300 transform active:scale-90 overflow-hidden flex items-center justify-center gap-1 text-[10px] font-mono font-medium ${
                                      item.featured
                                        ? darkMode
                                          ? "backdrop-blur-md bg-amber-500/15 border border-amber-500/30 hover:border-amber-400/60 hover:-translate-y-0.5 drop-shadow-sm text-amber-300 hover:text-amber-200"
                                          : "backdrop-blur-md bg-amber-400/15 border border-amber-400/40 hover:border-amber-300/70 hover:-translate-y-0.5 drop-shadow-sm text-amber-600 hover:text-amber-500"
                                        : darkMode
                                          ? "backdrop-blur-md bg-cyan-500/15 border border-cyan-500/30 hover:border-cyan-400/60 hover:-translate-y-0.5 drop-shadow-sm text-cyan-300 hover:text-cyan-200"
                                          : "backdrop-blur-md bg-cyan-400/15 border border-cyan-400/40 hover:border-cyan-300/70 hover:-translate-y-0.5 drop-shadow-sm text-cyan-500 hover:text-cyan-400"
                                    }`}
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
                                    `/projects/${item.slug || item._id}`,
                                  );
                                }}
                                className={`group relative px-2.5 py-1.5 rounded-lg text-nowrap transition-all duration-300 transform active:scale-90 overflow-hidden flex items-center justify-center gap-1 text-[10px] font-medium cursor-pointer ${
                                  item.featured
                                    ? darkMode
                                      ? "backdrop-blur-md bg-amber-500/15 border border-amber-500/30 hover:border-amber-400/60 hover:-translate-y-0.5 drop-shadow-sm text-amber-300 hover:text-amber-200"
                                      : "backdrop-blur-md bg-amber-400/15 border border-amber-400/40 hover:border-amber-300/70 hover:-translate-y-0.5 drop-shadow-sm text-amber-600 hover:text-amber-500"
                                    : darkMode
                                      ? "backdrop-blur-md bg-cyan-500/15 border border-cyan-500/30 hover:border-cyan-400/60 hover:-translate-y-0.5 drop-shadow-sm text-cyan-300 hover:text-cyan-200"
                                      : "backdrop-blur-md bg-cyan-400/15 border border-cyan-400/40 hover:border-cyan-300/70 hover:-translate-y-0.5 drop-shadow-sm text-cyan-500 hover:text-cyan-400"
                                }`}
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
                            {item.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ── Centered "View All Projects" CTA Button ── */}
            <div className="flex justify-center mt-12">
              <Link
                to="/projects"
                className={`group relative inline-flex items-center gap-3 px-8 py-3.5 rounded-full border
                  text-xs font-bold tracking-[0.25em] uppercase font-outfit transition-all duration-500 overflow-hidden
                  ${
                    darkMode
                      ? "border-cyan-500/30 hover:border-cyan-400 bg-slate-950/90 text-cyan-400 hover:text-white"
                      : "border-cyan-600/25 hover:border-cyan-600 bg-white text-cyan-600 hover:text-cyan-800"
                  }
                  hover:shadow-[0_0_35px_rgba(34,211,238,0.25)]`}
              >
                {/* Glowing neon backdrop hover blob */}
                <span className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Icon transition */}
                <Layers
                  size={13}
                  className="relative z-10 transition-transform duration-500 group-hover:scale-110"
                />
                <span className="relative z-10">View All Projects</span>
                <ArrowRight
                  size={12}
                  className="relative z-10 transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            </div>
          </div>
        </main>
      )}
      <Footer />
    </div>
  );
}

export default ProjectDetailPage;
