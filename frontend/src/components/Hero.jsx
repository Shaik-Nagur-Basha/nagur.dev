import { ArrowRight, Github, Linkedin, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import SkeletonLoader from "./SkeletonLoader";
import { ButtonPrimary, ButtonSecondary } from "./Button";

function Hero() {
  const { darkMode } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [minLoadingTime, setMinLoadingTime] = useState(true);

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

  // Add floating animation keyframes
  const floatingStyle = `
    @keyframes float-particle {
      0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.6; }
      25% { transform: translateY(-30px) translateX(10px); opacity: 0.8; }
      50% { transform: translateY(-60px) translateX(-10px); opacity: 1; }
      75% { transform: translateY(-30px) translateX(15px); opacity: 0.8; }
    }
    @keyframes float-particle-2 {
      0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.6; }
      25% { transform: translateY(-40px) translateX(-15px); opacity: 0.8; }
      50% { transform: translateY(-70px) translateX(10px); opacity: 1; }
      75% { transform: translateY(-40px) translateX(-20px); opacity: 0.8; }
    }
    @keyframes float-particle-3 {
      0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.6; }
      25% { transform: translateY(-35px) translateX(12px); opacity: 0.8; }
      50% { transform: translateY(-65px) translateX(-15px); opacity: 1; }
      75% { transform: translateY(-35px) translateX(18px); opacity: 0.8; }
    }
    @keyframes float-particle-4 {
      0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.6; }
      25% { transform: translateY(-45px) translateX(-20px); opacity: 0.8; }
      50% { transform: translateY(-75px) translateX(12px); opacity: 1; }
      75% { transform: translateY(-45px) translateX(-12px); opacity: 0.8; }
    }
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
        <SkeletonLoader type="hero" />
      ) : (
        <section
          id="home"
          className={`pt-32 pb-20 px-4 min-h-screen flex items-center transition-all duration-500 relative overflow-hidden`}
        >
          {/* ${
        darkMode
          ? "bg-linear-to-br from-gray-950 via-gray-900 to-purple-950"
          : "bg-linear-to-br from-blue-50 via-white to-purple-50"
      } */}

          {/* Radial gradient overlay - Top Right */}
          {/* <div
        className={`absolute top-0 right-0 w-96 h-96 pointer-events-none blur-3xl ${
          darkMode
            ? "bg-gradient-to-br from-purple-600/15 via-purple-500/5 to-transparent"
            : "bg-gradient-to-br from-blue-400/20 via-blue-300/10 to-transparent"
        }`}
        style={{
          borderRadius: "50%",
          animation: "glow-pulse 4s ease-in-out infinite",
        }}
      /> */}

          {/* Inner glow accent - Top Right */}
          {/* <div
        className={`absolute top-10 right-10 w-64 h-64 pointer-events-none blur-2xl ${
          darkMode
            ? "bg-gradient-to-br from-purple-500/10 to-transparent"
            : "bg-gradient-to-br from-blue-300/15 to-transparent"
        }`}
        style={{
          borderRadius: "50%",
          animation: "float-glow 6s ease-in-out infinite",
        }}
      /> */}

          {/* Radial gradient overlay - Bottom Left */}
          {/* <div
        className={`absolute bottom-0 left-0 w-80 h-80 pointer-events-none blur-3xl ${
          darkMode
            ? "bg-gradient-to-tr from-blue-600/10 via-blue-500/5 to-transparent"
            : "bg-gradient-to-tr from-purple-300/15 via-purple-200/5 to-transparent"
        }`}
        style={{
          borderRadius: "50%",
          animation: "glow-pulse 5s ease-in-out infinite 1s",
        }}
      /> */}

          {/* Inner glow accent - Bottom Left */}
          {/* <div
        className={`absolute bottom-10 left-10 w-56 h-56 pointer-events-none blur-2xl ${
          darkMode
            ? "bg-gradient-to-tr from-blue-500/8 to-transparent"
            : "bg-gradient-to-tr from-purple-200/10 to-transparent"
        }`}
        style={{
          borderRadius: "50%",
          animation: "float-glow 7s ease-in-out infinite reverse",
        }}
      /> */}
          <style>{floatingStyle}</style>
          <div className="max-w-7xl mx-auto w-full relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 items-center">
              {/* Right - Profile Image (Shows first on mobile) */}
              <div className="flex items-center justify-center order-first md:order-last">
                <div className="relative w-48 h-48 sm:w-60 sm:h-60 md:w-72 md:h-72 lg:w-80 lg:h-80 xl:w-96 xl:h-96 group">
                  {/* Animated background blur circles */}
                  {/* <div className="absolute -inset-6 bg-linear-to-br from-blue-400 via-purple-500 to-pink-500 rounded-full blur-3xl opacity-30 group-hover:opacity-50 animate-pulse transition-all duration-500"></div> */}
                  <div
                    className="absolute -inset-4 bg-linear-to-r from-blue-500 to-purple-600 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-all duration-500"
                    style={{ animationDelay: "0.5s" }}
                  ></div>
                  <div
                    className="absolute -inset-2 bg-linear-to-br from-purple-400 to-blue-500 rounded-full blur-xl opacity-15 group-hover:opacity-25 animate-pulse transition-all duration-500"
                    style={{ animationDelay: "1s" }}
                  ></div>

                  {/* Main circular container with image */}
                  <div
                    className={`relative w-full h-full rounded-full overflow-hidden backdrop-blur-3xl shadow-2xl transition-all duration-500 border-2 group-hover:shadow-2xl group-hover:scale-105 ${
                      darkMode
                        ? "bg-transparent border-purple-500/50 group-hover:border-purple-400/80 group-hover:shadow-purple-600/70 drop-shadow-2xl"
                        : "bg-transparent border-blue-300/60 group-hover:border-purple-400/80 group-hover:shadow-purple-400/70 drop-shadow-2xl"
                    }`}
                    style={{
                      filter:
                        "drop-shadow(0 20px 25px rgba(0, 0, 0, 0.3)) drop-shadow(0 10px 15px rgba(59, 130, 246, 0.2))",
                    }}
                  >
                    {/* Profile Image */}
                    <img
                      src="/nagur_photo.png"
                      alt="Sk Nagur Basha"
                      className="w-full h-full transition-all duration-500 group-hover:scale-105 drop-shadow-2xl"
                      style={{
                        filter:
                          "drop-shadow(0 20px 25px rgba(0, 0, 0, 0.3)) drop-shadow(0 10px 15px rgba(59, 130, 246, 0.2))",
                      }}
                    />

                    {/* Overlay gradient for light mode - only shows when not hovering */}
                    {!darkMode && (
                      <div className="absolute inset-0 bg-linear-to-br from-blue-300/10 via-transparent to-purple-600/10 rounded-full group-hover:opacity-0 transition-all duration-500 pointer-events-none"></div>
                    )}

                    {/* Dark overlay for dark mode - only shows when not hovering */}
                    {darkMode && (
                      <div className="absolute inset-0 bg-linear-to-br from-purple-900/20 via-transparent to-gray-900/20 rounded-full group-hover:opacity-0 transition-all duration-500 pointer-events-none"></div>
                    )}

                    {/* Animated rotating border - only visible on hover */}
                    <div
                      className={`absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none ${
                        darkMode
                          ? "border-2 border-purple-500/60"
                          : "border-2 border-purple-400/60"
                      }`}
                      style={{
                        animation: "spin 3s linear infinite",
                        animationPlayState: "running",
                      }}
                    ></div>

                    {/* Inner shine effect */}
                    <div className="absolute inset-0 rounded-full border border-white/15 group-hover:border-white/30 transition-all duration-500 pointer-events-none"></div>
                  </div>

                  {/* Enhanced floating particles */}
                  <div
                    className="absolute w-2 h-2 sm:w-3 sm:h-3 bg-blue-400 rounded-full top-8 sm:top-12 left-6 sm:left-8 opacity-70 group-hover:opacity-100 shadow-lg shadow-blue-400/50 transition-all duration-300"
                    style={{
                      animation: "float-particle 6s ease-in-out infinite",
                    }}
                  ></div>
                  <div
                    className="absolute w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-400 rounded-full bottom-12 sm:bottom-16 right-8 sm:right-10 opacity-70 group-hover:opacity-100 shadow-lg shadow-purple-400/50 transition-all duration-300"
                    style={{
                      animation: "float-particle-2 7s ease-in-out infinite",
                    }}
                  ></div>
                  <div
                    className="absolute w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 bg-pink-400 rounded-full top-1/3 right-4 sm:right-6 opacity-60 group-hover:opacity-100 shadow-lg shadow-pink-400/50 transition-all duration-300"
                    style={{
                      animation: "float-particle-3 6.5s ease-in-out infinite",
                    }}
                  ></div>
                  <div
                    className="absolute w-2 h-2 sm:w-2.5 sm:h-2.5 bg-cyan-400 rounded-full bottom-1/4 left-4 sm:left-6 opacity-60 group-hover:opacity-100 shadow-lg shadow-cyan-400/50 transition-all duration-300"
                    style={{
                      animation: "float-particle-4 7.5s ease-in-out infinite",
                    }}
                  ></div>
                </div>
              </div>
              <div className="space-y-6 order-last md:order-first">
                <div className="inline-block">
                  <span
                    className={`px-4 py-2 text-sm font-semibold rounded-full border backdrop-blur-xl transition-all duration-300 shadow-xl ${
                      darkMode
                        ? "bg-blue-900/30 text-blue-300 border-blue-700/50 hover:bg-blue-800/40"
                        : "bg-blue-100/60 text-blue-700 border-blue-300/60 shadow-blue-200/40 hover:bg-blue-100/80"
                    }`}
                  >
                    ✨ Welcome to my portfolio
                  </span>
                </div>

                <h1
                  className={`text-3xl sm:text-4xl md:text-3xl lg:text-4xl xl:text-5xl font-bold leading-tight transition-all duration-300 ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Hi, I'm{" "}
                  <span className="bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-pulse">
                    Sk Nagur Basha
                  </span>
                </h1>

                <p
                  className={`text-base sm:text-base md:text-lg lg:text-lg leading-relaxed transition-all duration-300 ${
                    darkMode ? "text-gray-400" : "text-gray-700"
                  }`}
                >
                  Full-stack developer passionate about creating beautiful and
                  functional web experiences. I specialize in React, Node.js,
                  and modern web technologies.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-row gap-3 pt-4 md:pt-6 w-fit">
                  <ButtonPrimary
                    className={`flex items-center justify-center cursor-pointer truncate gap-2 backdrop-blur-md font-semibold text-sm md:text-base px-5 md:px-7 py-2.5 md:py-3 rounded-xl transition-all duration-300 ${
                      darkMode
                        ? "bg-linear-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-600/40 hover:shadow-xl hover:shadow-blue-500/60 hover:scale-105 active:scale-95"
                        : "bg-linear-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-400/50 hover:shadow-xl hover:shadow-blue-400/70 hover:scale-105 active:scale-95"
                    }`}
                  >
                    View My Work{" "}
                    <ArrowRight
                      size={20}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </ButtonPrimary>
                  <ButtonSecondary
                    className={`flex items-center justify-center cursor-pointer truncate font-semibold text-sm md:text-base px-5 md:px-7 py-2.5 md:py-3 rounded-xl font-mono backdrop-blur-md transition-all duration-300 ${
                      darkMode
                        ? "bg-linear-to-r from-gray-700/40 to-gray-800/40 border-2 border-purple-500/40 text-gray-200 hover:from-purple-900/50 hover:to-purple-800/50 hover:border-purple-400/70 hover:text-purple-100 hover:shadow-lg hover:shadow-purple-600/40 hover:scale-105 active:scale-95"
                        : "bg-linear-to-r from-white/50 to-blue-50/50 border-2 border-blue-300/50 text-gray-600! hover:text-gray-700! hover:bg-gray-300! hover:from-blue-100/70 hover:to-blue-50/70 hover:border-purple-400/70 hover:shadow-lg hover:shadow-purple-400/40 hover:scale-105 active:scale-95"
                    }`}
                  >
                    Download CV
                  </ButtonSecondary>
                </div>

                {/* Social Links */}
                <div className="flex gap-3 sm:gap-4 pt-6 md:pt-8">
                  <a
                    href="#"
                    className={`group relative p-3 md:p-4 rounded-2xl transition-all duration-300 transform active:scale-90 overflow-hidden ${
                      darkMode
                        ? "backdrop-blur-2xl bg-linear-to-br from-gray-700/30 via-gray-800/20 to-gray-900/30 border border-gray-600/40 hover:border-blue-500/60 shadow-lg shadow-gray-900/50 hover:shadow-2xl hover:shadow-blue-500/40 hover:-translate-y-1 drop-shadow-md drop-shadow-gray-900/30"
                        : "backdrop-blur-2xl bg-linear-to-br from-white/40 via-blue-50/30 to-white/20 border border-blue-300/50 hover:border-blue-400/80 shadow-lg shadow-blue-200/40 hover:shadow-2xl hover:shadow-blue-400/50 hover:-translate-y-1 drop-shadow-md drop-shadow-blue-200/20"
                    }`}
                    aria-label="GitHub"
                    title="GitHub"
                  >
                    <div
                      className={`absolute inset-0 transition-all duration-500 ${
                        darkMode
                          ? "bg-linear-to-r from-blue-500/0 via-blue-500/0 to-blue-500/0 group-hover:from-blue-500/20 group-hover:via-blue-500/10 group-hover:to-blue-500/0"
                          : "bg-linear-to-r from-blue-400/0 via-blue-400/0 to-blue-400/0 group-hover:from-blue-400/20 group-hover:via-blue-400/15 group-hover:to-blue-400/0"
                      }`}
                    ></div>
                    <Github
                      size={24}
                      className={`relative z-10 transition-all duration-300 group-hover:scale-110 ${
                        darkMode
                          ? "text-gray-400 group-hover:text-blue-300 drop-shadow-lg group-hover:drop-shadow-2xl"
                          : "text-gray-600 group-hover:text-blue-600 drop-shadow-md group-hover:drop-shadow-lg"
                      }`}
                    />
                    <div
                      className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none ${
                        darkMode
                          ? "shadow-inset-lg shadow-blue-500/20"
                          : "shadow-inset-lg shadow-blue-400/20"
                      }`}
                    ></div>
                  </a>
                  <a
                    href="#"
                    className={`group relative p-3 md:p-4 rounded-2xl transition-all duration-300 transform active:scale-90 overflow-hidden ${
                      darkMode
                        ? "backdrop-blur-2xl bg-linear-to-br from-gray-700/30 via-gray-800/20 to-gray-900/30 border border-gray-600/40 hover:border-purple-500/60 shadow-lg shadow-gray-900/50 hover:shadow-2xl hover:shadow-purple-500/40 hover:-translate-y-1 drop-shadow-md drop-shadow-gray-900/30"
                        : "backdrop-blur-2xl bg-linear-to-br from-white/40 via-blue-50/30 to-white/20 border border-blue-300/50 hover:border-purple-400/80 shadow-lg shadow-blue-200/40 hover:shadow-2xl hover:shadow-purple-400/50 hover:-translate-y-1 drop-shadow-md drop-shadow-purple-200/20"
                    }`}
                    aria-label="LinkedIn"
                    title="LinkedIn"
                  >
                    <div
                      className={`absolute inset-0 transition-all duration-500 ${
                        darkMode
                          ? "bg-linear-to-r from-purple-500/0 via-purple-500/0 to-purple-500/0 group-hover:from-purple-500/20 group-hover:via-purple-500/10 group-hover:to-purple-500/0"
                          : "bg-linear-to-r from-purple-400/0 via-purple-400/0 to-purple-400/0 group-hover:from-purple-400/20 group-hover:via-purple-400/15 group-hover:to-purple-400/0"
                      }`}
                    ></div>
                    <Linkedin
                      size={24}
                      className={`relative z-10 transition-all duration-300 group-hover:scale-110 ${
                        darkMode
                          ? "text-gray-400 group-hover:text-purple-300 drop-shadow-lg group-hover:drop-shadow-2xl"
                          : "text-gray-600 group-hover:text-purple-600 drop-shadow-md group-hover:drop-shadow-lg"
                      }`}
                    />
                    <div
                      className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none ${
                        darkMode
                          ? "shadow-inset-lg shadow-purple-500/20"
                          : "shadow-inset-lg shadow-purple-400/20"
                      }`}
                    ></div>
                  </a>
                  <a
                    href="#"
                    className={`group relative p-3 md:p-4 rounded-2xl transition-all duration-300 transform active:scale-90 overflow-hidden ${
                      darkMode
                        ? "backdrop-blur-2xl bg-linear-to-br from-gray-700/30 via-gray-800/20 to-gray-900/30 border border-gray-600/40 hover:border-pink-500/60 shadow-lg shadow-gray-900/50 hover:shadow-2xl hover:shadow-pink-500/40 hover:-translate-y-1 drop-shadow-md drop-shadow-gray-900/30"
                        : "backdrop-blur-2xl bg-linear-to-br from-white/40 via-blue-50/30 to-white/20 border border-blue-300/50 hover:border-pink-400/80 shadow-lg shadow-blue-200/40 hover:shadow-2xl hover:shadow-pink-400/50 hover:-translate-y-1 drop-shadow-md drop-shadow-pink-200/20"
                    }`}
                    aria-label="Email"
                    title="Email"
                  >
                    <div
                      className={`absolute inset-0 transition-all duration-500 ${
                        darkMode
                          ? "bg-linear-to-r from-pink-500/0 via-pink-500/0 to-pink-500/0 group-hover:from-pink-500/20 group-hover:via-pink-500/10 group-hover:to-pink-500/0"
                          : "bg-linear-to-r from-pink-400/0 via-pink-400/0 to-pink-400/0 group-hover:from-pink-400/20 group-hover:via-pink-400/15 group-hover:to-pink-400/0"
                      }`}
                    ></div>
                    <Mail
                      size={24}
                      className={`relative z-10 transition-all duration-300 group-hover:scale-110 ${
                        darkMode
                          ? "text-gray-400 group-hover:text-pink-300 drop-shadow-lg group-hover:drop-shadow-2xl"
                          : "text-gray-600 group-hover:text-pink-600 drop-shadow-md group-hover:drop-shadow-lg"
                      }`}
                    />
                    <div
                      className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none ${
                        darkMode
                          ? "shadow-inset-lg shadow-pink-500/20"
                          : "shadow-inset-lg shadow-pink-400/20"
                      }`}
                    ></div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}

export default Hero;
