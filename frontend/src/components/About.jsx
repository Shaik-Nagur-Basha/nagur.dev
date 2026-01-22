import { CheckCircle, Sparkles, TrendingUp, Award, Zap } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useState, useEffect } from "react";
import SkeletonLoader from "./SkeletonLoader";

function About() {
  const { darkMode } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [minLoadingTime, setMinLoadingTime] = useState(true);

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
  const highlights = [
    "1.5+ yrs experience in MERN",
    "Expert in React & Node.js",
    "Responsive & accessible design",
    "Performance optimization",
  ];

  const overlayStyle = `
    @keyframes glow-pulse {
      0%, 100% { opacity: 0.15; transform: scale(1); }
      50% { opacity: 0.25; transform: scale(1.05); }
    }
    @keyframes float-glow {
      0%, 100% { transform: translateX(0px) translateY(0px); }
      50% { transform: translateX(10px) translateY(-10px); }
    }
  `;

  return (
    <>
      {isLoading ? (
        <SkeletonLoader type="about" />
      ) : (
        <section
          id="about"
          className={`py-20 px-4 transition-all duration-300 relative overflow-hidden`}
        >
          <style>{overlayStyle}</style>

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mt-4 mb-16">
              <div className="inline-block mb-4">
                <span
                  className={`px-4 py-2 rounded-full text-sm font-semibold border backdrop-blur-xl flex items-center gap-2 transition-all duration-300 ${
                    darkMode
                      ? "bg-purple-900/40 text-purple-300 border-purple-800"
                      : "bg-blue-100/60 text-blue-700 border-blue-300/60 shadow-lg shadow-blue-300/20"
                  }`}
                >
                  <Sparkles size={16} /> About Me
                </span>
              </div>
              <h2
                className={`text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold mb-4 transition-colors duration-300 ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Crafting Digital Solutions
              </h2>
              <p
                className={`text-base md:text-lg transition-colors duration-300 line-clamp-2 ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Full-stack developer creating responsive, performant, and
                user-friendly experiences
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 xl:gap-4 2xl:gap-16 items-start">
              {/* Content - Full width on mobile, left column on desktop */}
              <div className="space-y-8 order-2 lg:order-1">
                {/* Paragraphs */}
                <div className="space-y-6">
                  <p
                    className={`leading-relaxed text-base sm:text-lg transition-colors duration-300 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    I'm a{" "}
                    <span className="font-semibold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      MERN full stack web developer
                    </span>{" "}
                    who builds{" "}
                    <span className="font-semibold text-blue-600 dark:text-blue-400">
                      modern, high-performance web applications
                    </span>{" "}
                    with a strong focus on{" "}
                    <span className="font-semibold text-purple-600 dark:text-purple-400">
                      clean UI, scalability, and real-world usability
                    </span>
                    .
                  </p>

                  <p
                    className={`leading-relaxed text-base sm:text-lg transition-colors duration-300 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    I combine{" "}
                    <span className="font-semibold text-blue-600 dark:text-blue-400">
                      design precision
                    </span>{" "}
                    with{" "}
                    <span className="font-semibold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      engineering discipline
                    </span>
                    , ensuring every product is{" "}
                    <span className="font-semibold text-purple-600 dark:text-purple-400">
                      responsive, accessible, and optimized
                    </span>{" "}
                    for performance.{" "}
                    <span className="font-semibold text-blue-600 dark:text-blue-400">
                      Continuous learning
                    </span>{" "}
                    keeps me aligned with the{" "}
                    <span className="font-semibold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      latest web technologies
                    </span>
                    , allowing me to deliver{" "}
                    <span className="font-semibold text-purple-600 dark:text-purple-400">
                      reliable and maintainable
                    </span>{" "}
                    solutions consistently.
                  </p>
                </div>

                {/* Highlights Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {highlights.map((highlight, idx) => (
                    <div
                      key={idx}
                      className={`flex items-start gap-3 p-3 rounded-lg transition-all duration-200 border ${
                        darkMode
                          ? "hover:bg-gray-800/50 border-transparent"
                          : "hover:bg-blue-100/40 border-blue-300/30 hover:border-blue-300/60 hover:shadow-md hover:shadow-blue-300/20"
                      }`}
                    >
                      <CheckCircle
                        className="text-green-500 shrink-0 mt-1 hover:scale-110 transition-transform duration-200"
                        size={20}
                      />
                      <span
                        className={`font-medium text-sm sm:text-base transition-colors duration-300 ${
                          darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {highlight}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats - Full width on mobile, stacked responsively on tablet, 3-column on desktop */}
              <div className="w-full order-1 lg:order-2">
                <div className="grid grid-cols-3 lg:grid-cols-2 gap-4 sm:gap-3 lg:gap-4">
                  {[
                    { number: "5+", label: "Projects", icon: TrendingUp },
                    { number: "1.5+", label: "Years", icon: Award },
                    { number: "100%", label: "Satisfaction", icon: Zap },
                  ].map((stat, idx) => {
                    const IconComponent = stat.icon;
                    return (
                      <div
                        key={idx}
                        className={`relative p-4 sm:p-5 lg:p-6 rounded-xl text-center transition-all duration-300 transform hover:scale-105 backdrop-blur-sm border group overflow-hidden ${
                          darkMode
                            ? "bg-linear-to-br from-gray-900/50 to-gray-800/50 border-gray-700/40 hover:from-blue-900/40 hover:to-purple-900/50 hover:border-purple-500/60 hover:shadow-2xl hover:shadow-purple-500/30"
                            : "bg-linear-to-br from-blue-50/80 to-purple-50/80 hover:from-blue-100/80 hover:to-purple-100/80 border-blue-200/50 hover:border-purple-300/50 hover:shadow-lg hover:shadow-blue-300/40"
                        }`}
                      >
                        <div
                          className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                            darkMode
                              ? "bg-linear-to-br from-blue-500/10 to-purple-500/15"
                              : "bg-linear-to-br from-blue-600/5 to-purple-600/5"
                          }`}
                        />
                        <div className="relative">
                          <div className="mb-2 sm:mb-3 flex justify-center">
                            <IconComponent
                              className={`transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 ${
                                darkMode
                                  ? "text-blue-400 group-hover:text-purple-400"
                                  : "text-blue-600 group-hover:text-purple-600"
                              }`}
                              size={22}
                            />
                          </div>
                          <p className="text-xl sm:text-2xl lg:text-3xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-1 group-hover:from-purple-400 group-hover:to-blue-400 transition-all duration-300">
                            {stat.number}
                          </p>
                          <p
                            className={`text-xs sm:text-sm font-semibold transition-colors duration-300 ${
                              darkMode
                                ? "text-gray-300 group-hover:text-purple-300"
                                : "text-gray-700"
                            }`}
                          >
                            {stat.label}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}

export default About;
