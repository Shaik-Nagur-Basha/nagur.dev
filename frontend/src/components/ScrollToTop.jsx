import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const ScrollToTop = () => {
  const { darkMode } = useTheme();
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled down
  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Scroll to top smoothly
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <>
      {isVisible && (
        <div className="fixed bottom-8 right-8 z-40 group animate-fadeIn transition-all duration-500">
          {/* Tooltip with glassmorphism */}
          <div
            className={`absolute bottom-full right-0 mb-3 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap backdrop-blur-xl border transition-all duration-500 transform opacity-0 group-hover:opacity-100 group-hover:-translate-y-2 pointer-events-none ${
              darkMode
                ? "bg-gray-900/70 border-white/10 text-gray-100 shadow-lg shadow-black/30"
                : "bg-white/70 border-white/40 text-gray-900 shadow-lg shadow-black/5"
            }`}
          >
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent font-bold">
              Scroll to Top
            </span>
          </div>

          {/* Button with gradient border - inspired by FoundationsAndInterests */}
          <div
            className={`relative rounded-full p-px transition-all duration-500 transform group-hover:scale-110 group-hover:-translate-y-2
              bg-gradient-to-br from-blue-500/50 via-purple-500/40 to-pink-500/30
              hover:from-blue-500 hover:via-purple-500 hover:to-pink-500
            `}
          >
            {/* Inner glassmorphic container */}
            <button
              onClick={scrollToTop}
              className={`relative cursor-pointer rounded-full p-3 transition-all duration-500 flex items-center justify-center
                ${
                  darkMode
                    ? "bg-gray-900/70 backdrop-blur-xl border border-white/10 shadow-lg shadow-black/30"
                    : "bg-white/70 backdrop-blur-xl border border-white/40 shadow-lg shadow-black/5"
                }
                hover:shadow-2xl active:scale-95
              `}
              aria-label="Scroll to top"
              title="Scroll to top"
            >
              {/* Icon with gradient animation */}
              <ArrowUp
                size={24}
                className={`relative z-10 transition-all duration-500 group-hover:-translate-y-1 group-hover:scale-110
                  ${
                    darkMode
                      ? "text-white group-hover:bg-gradient-to-br group-hover:from-blue-300 group-hover:to-purple-300 group-hover:bg-clip-text"
                      : "text-gray-900 group-hover:bg-gradient-to-br group-hover:from-blue-400 group-hover:to-purple-400 group-hover:bg-clip-text"
                  }
                `}
              />
            </button>

            {/* Glow effect on hover */}
            <div
              className={`absolute inset-0 rounded-full blur-2xl transition-all duration-500 pointer-events-none
                ${isVisible && "group-hover:opacity-100"} opacity-0 group-hover:scale-150
              `}
              style={{
                background: darkMode
                  ? "radial-gradient(circle, rgba(139, 92, 246, 0.4), transparent)"
                  : "radial-gradient(circle, rgba(139, 92, 246, 0.3), transparent)",
              }}
            ></div>
          </div>

          <style>{`
            @keyframes fadeIn {
              from {
                opacity: 0;
                transform: translateY(10px) scale(0.95);
              }
              to {
                opacity: 1;
                transform: translateY(0) scale(1);
              }
            }
            .animate-fadeIn {
              animation: fadeIn 0.4s ease-out;
            }
          `}</style>
        </div>
      )}
    </>
  );
};

export default ScrollToTop;
