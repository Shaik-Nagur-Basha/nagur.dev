import { useState, useEffect } from "react";
import {
  Moon,
  Sun,
  Home,
  User,
  Briefcase,
  Zap,
  BookOpen,
  Smile,
  Mail,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import SkeletonLoader from "./SkeletonLoader";
import Logo from "./Logo";

function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [minLoadingTime, setMinLoadingTime] = useState(true);
  const { darkMode, toggleDarkMode } = useTheme();

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
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinks = [
    // { name: "Home", href: "#home", icon: Home },
    { name: "About", href: "#about", icon: User },
    { name: "Projects", href: "#projects", icon: Briefcase },
    { name: "Skills", href: "#skills", icon: Zap },
    { name: "Education", href: "#education", icon: BookOpen },
    { name: "Hobbies", href: "#hobbies", icon: Smile },
    { name: "Contact", href: "#contact", icon: Mail },
  ];

  return (
    <>
      {isLoading ? (
        <SkeletonLoader type="navigation" />
      ) : (
        <nav
          className={`fixed z-50 transition-all duration-500 ${
            isScrolled
              ? "rounded-3xl mx-4 mt-4 w-[calc(100%-32px)] left-0 shadow-md transition-all duration-500 group-hover:shadow-md group-hover:scale-105"
              : "w-full top-0 border-b-0"
          } ${
            isScrolled
              ? darkMode
                ? "border border-purple-700/30"
                : "border border-blue-300/30"
              : darkMode
                ? "border-b border-gray-700/30"
                : "border-b border-linear-to-r from-blue-200/40 to-cyan-200/40"
          }`}
        >
          <style>{menuAnimationStyle}</style>
          <div
            className={`px-4 sm:px-6 lg:px-8 w-full  ${isScrolled ? "rounded-3xl backdrop-blur-md" : ""}`}
          >
            <div className="flex justify-between items-center h-16 max-w-7xl mx-auto ">
              {/* Logo - Clickable Link to Home */}
              <a
                href="/"
                className="shrink-0 flex items-center gap-2 hover:opacity-80 transition-opacity duration-300 cursor-pointer"
              >
                <Logo />
                <h1
                  className={`text-lg font-bold sm:text-xl bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:to-pink-600 transition-all duration-300 px-3 py-1.5 rounded-lg border-2 border-glow ${
                    !darkMode && "drop-shadow-sm"
                  }`}
                >
                  nagur.dev
                </h1>
              </a>

              {/* Desktop Menu */}
              <div className="hidden md:flex items-center space-x-8">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className={`font-medium transition-all duration-200 relative group ${
                      darkMode
                        ? "text-gray-300 hover:text-blue-400"
                        : "text-gray-800 hover:text-blue-600"
                    }`}
                  >
                    {link.name}
                    <span
                      className={`absolute bottom-0 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300 ${
                        darkMode
                          ? "bg-linear-to-r from-blue-600 to-purple-600"
                          : "bg-linear-to-r from-blue-500 to-cyan-500"
                      }`}
                    ></span>
                  </a>
                ))}
              </div>

              {/* Right Side - Theme Toggle & Mobile Menu */}
              <div className="flex items-center space-x-4 relative">
                <button
                  onClick={toggleDarkMode}
                  className={`p-2.5 rounded-xl cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 font-semibold bg-transparent ${
                    darkMode ? "" : "text-blue-700"
                  }`}
                  aria-label="Toggle dark mode"
                  title={
                    darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"
                  }
                >
                  {darkMode ? (
                    <Sun
                      size={20}
                      className="text-yellow-400 animate-spin"
                      style={{ animationDuration: "3s" }}
                    />
                  ) : (
                    <Moon size={20} className="text-blue-700" />
                  )}
                </button>

                {/* Mobile Menu Button - Circular Morphing SVG */}
                <button
                  onClick={toggleMenu}
                  className={`md:hidden cursor-pointer p-2.5 rounded-xl transition-all duration-500 ease-out relative hover:scale-105 active:scale-95`}
                  aria-label="Toggle menu"
                >
                  <div className="relative w-6 h-6">
                    {/* Circular glow background */}
                    <div
                      className={`absolute inset-0 rounded-full transition-all duration-500 ease-out ${
                        isOpen ? "scale-100 opacity-100" : "scale-0 opacity-0"
                      }`}
                      style={{
                        background: "transparent",
                        // ? `conic-gradient(from 0deg, ${
                        //     darkMode ? "#3b82f6ee" : "#2563ebee"
                        //   }, ${darkMode ? "#7c3aedee" : "#7c3aedee"})`
                        // : "transparent",
                      }}
                    ></div>

                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`transition-all duration-500 ease-out relative z-10 ${
                        darkMode
                          ? isOpen
                            ? "text-blue-200"
                            : "text-gray-300"
                          : "text-blue-400"
                      }`}
                    >
                      {isOpen ? (
                        // Cross icon for close
                        <>
                          <line x1="6" y1="6" x2="18" y2="18" />
                          <line x1="18" y1="6" x2="6" y2="18" />
                        </>
                      ) : (
                        // Three vertical dots for menu
                        <>
                          <circle cx="12" cy="6" r="0.5" fill="currentColor" />
                          <circle cx="12" cy="12" r="0.5" fill="currentColor" />
                          <circle cx="12" cy="18" r="0.5" fill="currentColor" />
                        </>
                      )}
                    </svg>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu - Tooltip Style */}
          {isOpen && (
            <div
              className={`absolute md:hidden ${
                isOpen ? "menu-enter" : "menu-exit"
              } backdrop-blur-md rounded-xl border shadow-2xl ${
                darkMode
                  ? "bg-linear-to-br from-gray-800/25 via-gray-900/20 to-purple-900/25 border-gray-600/30 shadow-purple-900/20"
                  : "bg-linear-to-br from-white/30 via-blue-50/25 to-cyan-50/30 border-blue-300/30 shadow-blue-300/15"
              }`}
              style={{
                right: "1rem",
                top: isScrolled ? "calc(100% + 0.5rem)" : "calc(64px + 0.5rem)",
                width: "max-content",
                minWidth: "200px",
                zIndex: 40,
              }}
            >
              <div className="px-3 py-2 space-y-1">
                {navLinks.map((link) => {
                  const IconComponent = link.icon;
                  return (
                    <a
                      key={link.name}
                      href={link.href}
                      className={`menu-item flex items-center gap-3 cursor-pointer px-4 py-2.5 rounded-lg font-medium transition-all duration-200 border ${
                        darkMode
                          ? "text-gray-300 border-transparent hover:bg-linear-to-r hover:from-blue-600/20 hover:to-purple-600/20 hover:border-blue-500/40 hover:text-blue-300 hover:translate-x-1 hover:shadow-lg hover:shadow-blue-500/20"
                          : "text-gray-700 border-transparent hover:bg-linear-to-r hover:from-blue-400/20 hover:to-purple-400/20 hover:border-blue-400/50 hover:text-blue-700 hover:translate-x-1 hover:shadow-lg hover:shadow-blue-400/20"
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      <IconComponent
                        size={18}
                        className="transition-all duration-200"
                      />
                      {link.name}
                    </a>
                  );
                })}
              </div>
            </div>
          )}
        </nav>
      )}
    </>
  );
}

export default Navigation;
