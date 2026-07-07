import { useState, useEffect, useRef } from "react";
import { useMotionValue, useSpring } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import {
  Moon,
  Sun,
  User,
  Briefcase,
  Mail,
  Layers,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import SkeletonLoader from "./SkeletonLoader";
import Logo from "./Logo";
import { useProfileStore } from "../store/useProfileStore";

function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [minLoadingTime, setMinLoadingTime] = useState(true);
  const { darkMode, toggleDarkMode } = useTheme();
  const { profile, fetchProfile, activeSection, setActiveSection } = useProfileStore();
  const location = useLocation();
  const isProgrammaticScroll = useRef(false);
  const scrollTimeoutRef = useRef(null);
  const [observerTrigger, setObserverTrigger] = useState(0);

  // Trigger a re-bind of the scrollspy observer 1 second after loading state finishes.
  // This guarantees that all sections have unmounted their skeletons and mounted their real DOM nodes.
  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        setObserverTrigger((prev) => prev + 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  // If loading from another page with a hash, or clicking a link that triggers routing, pause scrollspy
  useEffect(() => {
    if (location.pathname === "/" && location.hash) {
      isProgrammaticScroll.current = true;
      const targetId = location.hash.substring(1);
      setActiveSection(targetId);
      
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(() => {
        isProgrammaticScroll.current = false;
      }, 1200);
    }
  }, [location.pathname, location.hash]);

  // Scroll spy to update active section based on intersecting sections
  useEffect(() => {
    if (location.pathname !== "/") {
      return;
    }

    const sectionIds = ["home", "about", "projects", "skills", "contact"];
    
    const observerCallback = (entries) => {
      if (isProgrammaticScroll.current) return;
      const intersectingEntry = entries.find(entry => entry.isIntersecting);
      if (intersectingEntry) {
        setActiveSection(intersectingEntry.target.id);
      }
    };

    const observerOptions = {
      root: null,
      rootMargin: "-25% 0px -55% 0px",
      threshold: 0,
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        observer.observe(el);
      }
    });

    const handleScroll = () => {
      if (isProgrammaticScroll.current) return;
      
      const scrollTop = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = window.innerHeight;

      // If at the very bottom of the page, force Contact section active
      if (scrollTop + clientHeight >= scrollHeight - 80) {
        setActiveSection("contact");
        return;
      }

      if (scrollTop < 100) {
        setActiveSection("home");
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, [location.pathname, isLoading, observerTrigger]);

  const isLinkActive = (linkHref) => {
    if (linkHref.startsWith("/#")) {
      const targetId = linkHref.split("#")[1];
      return location.pathname === "/" && activeSection === targetId;
    }
    return location.pathname === linkHref;
  };

  const handleNavClick = (e, link) => {
    setIsOpen(false);
    if (link.href.startsWith("/#")) {
      const targetId = link.href.split("#")[1];
      const element = document.getElementById(targetId);
      if (element) {
        // We are on the Home Page, so intercept navigation to scroll smoothly
        e.preventDefault();
        isProgrammaticScroll.current = true;
        setActiveSection(targetId);
        element.scrollIntoView({ behavior: "smooth", block: "start" });
        window.history.pushState(null, "", link.href);

        if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
        scrollTimeoutRef.current = setTimeout(() => {
          isProgrammaticScroll.current = false;
        }, 1000);
      }
    }
  };

  const handleLogoClick = (e) => {
    setIsOpen(false);
    if (location.pathname === "/") {
      // If already on the Home Page, prevent default and scroll smoothly to top
      e.preventDefault();
      isProgrammaticScroll.current = true;
      setActiveSection("home");
      window.scrollTo({ top: 0, behavior: "smooth" });
      window.history.pushState(null, "", "/");

      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(() => {
        isProgrammaticScroll.current = false;
      }, 1000);
    }
  };

  // Scroll progress bar
  const rawProgress = useMotionValue(0);
  const scrollProgress = useSpring(rawProgress, { stiffness: 200, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Minimum skeleton display time (prevents flashing)
  useEffect(() => {
    const minTimer = setTimeout(() => setMinLoadingTime(false), 800);
    return () => clearTimeout(minTimer);
  }, []);

  // Switch to content once minimum time has passed
  useEffect(() => {
    if (!minLoadingTime) {
      setIsLoading(false);
    }
  }, [minLoadingTime]);

  // Animation styles for menu transitions
  const menuAnimationStyle = `
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600&display=swap');

    .nav-menu-font {
      font-family: 'Space Grotesk', system-ui, sans-serif;
      letter-spacing: 0.07em;
    }

    @keyframes slideInDown {
      from {
        opacity: 0;
        transform: translateY(-8px) scale(0.95);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }
    @keyframes slideOutUp {
      from {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
      to {
        opacity: 0;
        transform: translateY(-8px) scale(0.95);
      }
    }
    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
    .menu-enter {
      animation: slideInDown 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    .menu-exit {
      animation: slideOutUp 0.2s ease-in;
    }
    .menu-item {
      animation: fadeIn 0.3s ease-out forwards;
      opacity: 0;
    }
    .menu-item:nth-child(1) { animation-delay: 0.05s; }
    .menu-item:nth-child(2) { animation-delay: 0.1s; }
    .menu-item:nth-child(3) { animation-delay: 0.15s; }
    .menu-item:nth-child(4) { animation-delay: 0.2s; }
    .menu-item:nth-child(5) { animation-delay: 0.25s; }
    .menu-item:nth-child(6) { animation-delay: 0.3s; }
    .menu-item:nth-child(7) { animation-delay: 0.35s; }
  `;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      // Calculate scroll progress
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      rawProgress.set(docHeight > 0 ? scrollTop / docHeight : 0);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [rawProgress]);

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinks = [
    { name: "About", href: "/#about", icon: User },
    { name: "Projects", href: "/#projects", icon: Briefcase },
    { name: "Skills & Education", href: "/#skills", icon: Layers },
    { name: "Contact", href: "/#contact", icon: Mail },
  ];

  return (
    <>
      {isLoading ? (
        <SkeletonLoader type="navigation" />
      ) : (
        <motion.nav
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
            isScrolled ? "px-4 pt-4" : "px-0 pt-0"
          }`}
        >
          <style>{menuAnimationStyle}</style>
          <div
            className={`relative overflow-hidden mx-auto transition-all duration-500 ${
              isScrolled
                ? "max-w-5xl rounded-2xl px-5"
                : "max-w-full px-4 sm:px-6 lg:px-8 rounded-none"
            } ${
              darkMode
                ? isScrolled
                  ? "bg-gray-950/85 shadow-[0_10px_40px_rgba(0,0,0,0.6),_0_0_20px_rgba(139,92,246,0.1)]"
                  : ""
                : isScrolled
                  ? "bg-white/80 shadow-[0_10px_40px_rgba(0,0,0,0.06),_0_0_20px_rgba(59,130,246,0.06)]"
                  : ""
            } backdrop-blur-2xl`}
          >
            <div className="flex justify-between items-center h-16 max-w-7xl mx-auto ">
              {/* Logo - Clickable Link to Home */}
              <Link
                to="/"
                onClick={handleLogoClick}
                className="shrink-0 flex items-center hover:opacity-80 transition-opacity duration-300 cursor-pointer group"
              >
                <div className="relative">
                  <Logo />
                </div>
                <h1
                  className={`text-xl sm:text-2xl font-black font-outfit px-3 py-1.5 rounded-lg navbar-title ${
                    !darkMode && "drop-shadow-sm"
                  }`}
                >
                  {profile?.title ? profile.title : "nagur.dev"}
                </h1>
              </Link>

              {/* Desktop Menu */}
              <div className="hidden md:flex items-center space-x-7 relative">
                {navLinks.map((link) => {
                  const active = isLinkActive(link.href);
                  return (
                    <Link
                      key={link.name}
                      to={link.href}
                      onClick={(e) => handleNavClick(e, link)}
                      className={`nav-menu-font relative group pb-1.5 pt-1 text-[13px] font-[500] tracking-[0.06em] uppercase transition-all duration-200 cursor-pointer ${
                        active
                          ? darkMode
                            ? "text-blue-400"
                            : "text-blue-600"
                          : darkMode
                            ? "text-gray-400 hover:text-blue-400"
                            : "text-gray-600 hover:text-blue-600"
                      }`}
                    >
                      {link.name}
                      {active && (
                        <motion.div
                          layoutId="activeIndicator"
                          className={`absolute bottom-0 left-0 right-0 h-[2px] rounded-full z-10 ${
                            darkMode
                              ? "bg-linear-to-r from-blue-500 to-purple-500"
                              : "bg-linear-to-r from-blue-500 to-cyan-500"
                          }`}
                          transition={{ type: "spring", stiffness: 350, damping: 30 }}
                        />
                      )}
                    </Link>
                  );
                })}
              </div>

              {/* Right Side - Theme Toggle & Mobile Menu */}
              <div className="flex items-center space-x-4 relative">
                {/* NEW: Theme toggle with AnimatePresence icon swap */}
                <motion.button
                  onClick={toggleDarkMode}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  className={`p-2.5 rounded-xl cursor-pointer transition-colors duration-200 ${
                    darkMode ? "text-amber-400 hover:bg-white/5" : "text-blue-700 hover:bg-blue-50"
                  }`}
                  aria-label="Toggle dark mode"
                  title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={darkMode ? "sun" : "moon"}
                      initial={{ rotate: -90, opacity: 0, scale: 0.7 }}
                      animate={{ rotate: 0, opacity: 1, scale: 1 }}
                      exit={{ rotate: 90, opacity: 0, scale: 0.7 }}
                      transition={{ duration: 0.2 }}
                      style={{ display: "block" }}
                    >
                      {darkMode ? (
                        <Sun size={20} />
                      ) : (
                        <Moon size={20} />
                      )}
                    </motion.span>
                  </AnimatePresence>
                </motion.button>

                {/* NEW: Hamburger with morphing 3-bar lines */}
                <motion.button
                  onClick={toggleMenu}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  className={`md:hidden cursor-pointer p-2.5 rounded-xl transition-colors duration-200 ${
                    darkMode
                      ? "text-gray-300 hover:text-white hover:bg-white/5"
                      : "text-blue-700 hover:bg-blue-50"
                  }`}
                  aria-label="Toggle menu"
                  aria-expanded={isOpen}
                >
                  <div className="w-5 h-4 flex flex-col justify-between">
                    <motion.span
                      animate={isOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                      transition={{ duration: 0.25 }}
                      className="block h-[1.5px] w-full bg-current rounded-full origin-center"
                    />
                    <motion.span
                      animate={isOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
                      transition={{ duration: 0.2 }}
                      className="block h-[1.5px] w-3/4 bg-current rounded-full"
                    />
                    <motion.span
                      animate={isOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                      transition={{ duration: 0.25 }}
                      className="block h-[1.5px] w-full bg-current rounded-full origin-center"
                    />
                  </div>
                </motion.button>
              </div>
            </div>

            {/* Scroll progress bar — inside glass container, clipped by overflow-hidden */}
            <motion.div
              className="absolute bottom-0 left-0 h-[2px] origin-left"
              style={{
                scaleX: scrollProgress,
                background: darkMode
                  ? "linear-gradient(90deg, #6366f1, #8b5cf6, #06b6d4)"
                  : "linear-gradient(90deg, #3b82f6, #6366f1, #8b5cf6)",
                width: "100%",
              }}
            />
          </div>

          {/* Scroll progress bar was moved inside the glass container above */}

          {/* Mobile Menu - New glass style with AnimatePresence */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.97 }}
                transition={{ duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
                className={`absolute md:hidden right-4 min-w-[220px] rounded-2xl overflow-hidden border shadow-2xl backdrop-blur-2xl ${
                  darkMode
                    ? "bg-gray-950/95 border-purple-700/20 shadow-black/60"
                    : "bg-white/95 border-blue-300/25 shadow-black/10"
                }`}
                style={{
                  top: isScrolled ? "calc(100% + 8px)" : "calc(64px + 8px)",
                  zIndex: 40,
                }}
              >
                <div className="pl-1 pr-3 py-2 space-y-1">
                  {navLinks.map((link) => {
                    const IconComponent = link.icon;
                    const active = isLinkActive(link.href);
                    return (
                      <Link
                        key={link.name}
                        to={link.href}
                        onClick={(e) => handleNavClick(e, link)}
                        className={`nav-menu-font menu-item relative flex items-center gap-3 cursor-pointer px-4 py-2.5 rounded-lg text-[12.5px] font-[500] tracking-[0.05em] uppercase transition-all duration-200 ${
                          active
                            ? darkMode
                              ? "text-blue-300 font-semibold"
                              : "text-blue-700 font-semibold"
                            : darkMode
                              ? "text-gray-400 hover:text-blue-300"
                              : "text-gray-500 hover:text-blue-700"
                        }`}
                      >
                        {active && (
                          <motion.div
                            layoutId="activeIndicatorMobile"
                            className={`absolute inset-0 rounded-lg border -z-10 ${
                              darkMode
                                ? "bg-blue-600/20 border-blue-500/30"
                                : "bg-blue-400/20 border-blue-400/40"
                            }`}
                            transition={{ type: "spring", stiffness: 350, damping: 30 }}
                          />
                        )}
                        <IconComponent
                          size={18}
                          className={`transition-all duration-200 ${
                            active
                              ? darkMode
                                ? "text-blue-300 scale-110"
                                : "text-blue-700 scale-110"
                              : "text-current"
                          }`}
                        />
                        <span>{link.name}</span>
                      </Link>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.nav>
      )}
    </>
  );
}

export default Navigation;
