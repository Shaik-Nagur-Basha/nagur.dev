import {
  ArrowRight,
  Github,
  Linkedin,
  MailPlus,
  Download,
  CheckCircle,
  Send,
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import SkeletonLoader from "./SkeletonLoader";
import { ButtonPrimary, ButtonSecondary, ButtonGradient } from "./Button";
import SkeletonWaveBar from "./SkeletonWaveBar";
import { useProfileStore } from "../store/useProfileStore";

function Hero() {
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [minLoadingTime, setMinLoadingTime] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState("idle"); // idle, downloading, completed
  const { profile, fetchProfile } = useProfileStore();

  // Minimum skeleton display time (prevents flashing)
  useEffect(() => {
    const minTimer = setTimeout(() => setMinLoadingTime(false), 800);
    fetchProfile();
    return () => clearTimeout(minTimer);
  }, [fetchProfile]);

  // Switch to content once minimum time has passed
  useEffect(() => {
    if (!minLoadingTime) {
      setIsLoading(false);
    }
  }, [minLoadingTime]);

  // Handle navigation to projects
  const handleViewWork = () => {
    navigate("/projects");
  };

  // Handle CV download
  const handleDownloadCV = () => {
    if (!profile?.cv) return;
    setDownloadStatus("downloading");
    const link = document.createElement("a");
    link.href = profile.cv;
    link.download = "Sk_Nagur_Basha_CV.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Set completed status after a short delay
    setTimeout(() => {
      setDownloadStatus("completed");
      // Reset to idle after 3 seconds
      setTimeout(() => {
        setDownloadStatus("idle");
      }, 3000);
    }, 500);
  };

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

  // Mount-state entrance for above-the-fold hero (no scroll trigger needed)
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    if (!isLoading) {
      const t = setTimeout(() => setMounted(true), 60);
      return () => clearTimeout(t);
    }
  }, [isLoading]);

  return (
    <>
      {isLoading ? (
        <SkeletonLoader type="hero" />
      ) : (
        <section
          id="home"
          className={`pt-32 min-h-screen pb-12 md:pb-20 px-4 md:pt-44 flex items-center transition-all duration-500 relative overflow-hidden`}
        >
          <style>{floatingStyle}</style>
          <div className="max-w-7xl mx-auto w-full relative z-10">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 sm:gap-12 items-center">
              {/* Right - Profile Image (Shows first on mobile) */}
              <div className={`flex items-center justify-center order-first xl:order-last reveal-scale ${mounted ? "reveal-visible" : ""}`}>
                <div className="relative w-48 h-48 sm:w-60 sm:h-60 md:w-72 md:h-72 lg:w-80 lg:h-80 xl:w-96 xl:h-96 group">
                  {/* Animated background blur circles */}
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
                      background: darkMode
                        ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                        : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    }}
                  >
                    {!imageLoaded && (
                      <SkeletonWaveBar className="w-full h-full transition-all duration-500 group-hover:scale-105 drop-shadow-2xl rounded-full" />
                    )}

                    {/* Profile Image - with fallback handling for ORB/CORS issues */}
                    <img
                      src={profile?.profilePicture || "/nagur_photo.png"}
                      alt={profile?.name || "Sk Nagur Basha"}
                      onLoad={() => setImageLoaded(true)}
                      onError={() => {
                        // If image fails (429, ORB blocked, etc), show gradient
                        setImageLoaded(true);
                      }}
                      className="w-full h-full transition-all duration-500 group-hover:scale-105 drop-shadow-2xl"
                      style={{
                        filter:
                          "drop-shadow(0 20px 25px rgba(0, 0, 0, 0.3)) drop-shadow(0 10px 15px rgba(59, 130, 246, 0.2))",
                      }}
                      loading="lazy"
                      crossOrigin="anonymous"
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
              <div className="space-y-6 order-last xl:order-first px-4 sm:px-8 2xl:px-0">
                <div className={`inline-block reveal-init ${mounted ? "reveal-visible" : ""}`}>
                  <span
                    className={`px-4 py-2 text-sm font-semibold rounded-full border backdrop-blur-xl transition-all duration-300 shadow-xl ${
                      darkMode
                        ? "bg-blue-900/30 text-blue-300 border-blue-700/50 hover:bg-blue-800/40"
                        : "bg-blue-100/60 text-blue-700 border-blue-300/60 shadow-blue-200/40 hover:bg-blue-100/80"
                    }`}
                  >
                    ✨ Welcome to nagur.dev
                  </span>
                </div>

                <h1
                  className={`text-3xl max-[400px]:text-2xl sm:text-4xl md:text-3xl lg:text-4xl xl:text-5xl font-bold leading-tight transition-all duration-300 reveal-init stagger-1 ${
                    darkMode ? "text-white" : "text-gray-900"
                  } ${mounted ? "reveal-visible" : ""}`}
                >
                  Hi, I'm{" "}
                  <span className="bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-pulse">
                    {profile?.name || "Sk Nagur Basha"}
                  </span>
                </h1>

                <p
                  className={`text-base max-[400px]:text-sm sm:text-base md:text-lg lg:text-lg leading-relaxed transition-all duration-300 reveal-init stagger-2 ${
                    darkMode ? "text-gray-400" : "text-gray-700"
                  } ${mounted ? "reveal-visible" : ""}`}
                >
                  {profile?.bio ||
                    `MERN stack web developer crafting polished, full-stack web
                    applications with a strong focus on performance, scalability,
                    and clean architecture.`}
                </p>

                {/* CTA Buttons */}
                <div className={`flex flex-row gap-3 pt-4 md:pt-6 w-fit text-nowrap reveal-init stagger-3 ${mounted ? "reveal-visible" : ""}`}>
                  <ButtonGradient
                    onClick={handleViewWork}
                    variant="primary"
                    className="px-2 sm:!px-6 md:!px-8 !py-3 md:!py-3.5 !rounded-2xl"
                  >
                    <span className="max-[400px]:hidden">View Work</span>
                    <span className="hidden max-[400px]:inline">Work</span>{" "}
                    <ArrowRight
                      size={20}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </ButtonGradient>
                  
                  <ButtonGradient
                    onClick={handleDownloadCV}
                    variant="secondary"
                    disabled={downloadStatus === "downloading" || !profile?.cv}
                    className="px-2 sm:!px-6 md:!px-8 !py-3 md:!py-3.5 !rounded-2xl"
                  >
                    {downloadStatus === "downloading" && (
                      <>
                        <Download
                          size={18}
                          className="animate-bounce transition-all duration-300"
                        />
                        <span className="inline ml-2">
                          Downloading...
                        </span>
                      </>
                    )}
                    {downloadStatus === "completed" && (
                      <>
                        <CheckCircle
                          size={18}
                          className="transition-all duration-300"
                        />
                        <span className="inline ml-2">
                          Downloaded!
                        </span>
                      </>
                    )}
                    {downloadStatus === "idle" && (
                      <>
                        <Download size={18} className="transition-transform group-hover:-translate-y-0.5" />
                        <span className="max-[400px]:hidden">Get Resume</span>
                        <span className="hidden max-[400px]:inline">Resume</span>
                      </>
                    )}
                  </ButtonGradient>
                </div>

                <div className={`flex gap-3 sm:gap-4 pt-6 md:pt-8 reveal-init stagger-4 ${mounted ? "reveal-visible" : ""}`}>
                  <a
                    href={profile?.socialLinks?.github || "https://github.com/Shaik-Nagur-Basha"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group relative p-3 md:p-4 rounded-2xl transition-all duration-300 transform active:scale-90 overflow-hidden ${
                      darkMode
                        ? "backdrop-blur-2xl bg-linear-to-br from-gray-700/30 via-gray-800/20 to-gray-900/30 border border-gray-600/40 hover:border-gray-400/60 shadow-lg shadow-gray-900/50 hover:shadow-2xl hover:shadow-gray-500/40 hover:-translate-y-1 drop-shadow-md drop-shadow-gray-900/30"
                        : "backdrop-blur-2xl bg-linear-to-br from-white/40 via-gray-50/30 to-white/20 border border-gray-300/50 hover:border-gray-500/80 shadow-lg shadow-gray-200/40 hover:shadow-2xl hover:shadow-gray-500/40 hover:-translate-y-1 drop-shadow-md drop-shadow-gray-200/20"
                    }`}
                    aria-label="GitHub"
                    title="GitHub"
                  >
                    <div
                      className={`absolute inset-0 transition-all duration-500 ${
                        darkMode
                          ? "bg-linear-to-r from-gray-500/0 via-gray-500/0 to-gray-500/0 group-hover:from-gray-500/20 group-hover:via-gray-500/10 group-hover:to-gray-500/0"
                          : "bg-linear-to-r from-gray-400/0 via-gray-400/0 to-gray-400/0 group-hover:from-gray-400/20 group-hover:via-gray-400/15 group-hover:to-gray-400/0"
                      }`}
                    ></div>
                    <Github
                      size={24}
                      className={`relative z-10 transition-all duration-300 group-hover:scale-110 ${
                        darkMode
                          ? "text-gray-400 group-hover:text-white drop-shadow-lg group-hover:drop-shadow-2xl"
                          : "text-gray-600 group-hover:text-gray-900 drop-shadow-md group-hover:drop-shadow-lg"
                      }`}
                    />
                    <div
                      className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none ${
                        darkMode
                          ? "shadow-inset-lg shadow-gray-500/20"
                          : "shadow-inset-lg shadow-gray-500/20"
                      }`}
                    ></div>
                  </a>
                  <a
                    href={profile?.socialLinks?.linkedin || "https://www.linkedin.com/in/nagur-basha"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group relative p-3 md:p-4 rounded-2xl transition-all duration-300 transform active:scale-90 overflow-hidden ${
                      darkMode
                        ? "backdrop-blur-2xl bg-linear-to-br from-gray-700/30 via-gray-800/20 to-gray-900/30 border border-gray-600/40 hover:border-blue-500/60 shadow-lg shadow-gray-900/50 hover:shadow-2xl hover:shadow-blue-600/40 hover:-translate-y-1 drop-shadow-md drop-shadow-gray-900/30"
                        : "backdrop-blur-2xl bg-linear-to-br from-white/40 via-blue-50/30 to-white/20 border border-blue-300/50 hover:border-blue-600/80 shadow-lg shadow-blue-200/40 hover:shadow-2xl hover:shadow-blue-600/50 hover:-translate-y-1 drop-shadow-md drop-shadow-blue-200/20"
                    }`}
                    aria-label="LinkedIn"
                    title="LinkedIn"
                  >
                    <div
                      className={`absolute inset-0 transition-all duration-500 ${
                        darkMode
                          ? "bg-linear-to-r from-blue-600/0 via-blue-600/0 to-blue-600/0 group-hover:from-blue-600/20 group-hover:via-blue-600/10 group-hover:to-blue-600/0"
                          : "bg-linear-to-r from-blue-600/0 via-blue-600/0 to-blue-600/0 group-hover:from-blue-600/20 group-hover:via-blue-600/15 group-hover:to-blue-600/0"
                      }`}
                    ></div>
                    <Linkedin
                      size={24}
                      className={`relative z-10 transition-all duration-300 group-hover:scale-110 ${
                        darkMode
                          ? "text-gray-400 group-hover:text-blue-400 drop-shadow-lg group-hover:drop-shadow-2xl"
                          : "text-gray-600 group-hover:text-blue-700 drop-shadow-md group-hover:drop-shadow-lg"
                      }`}
                    />
                    <div
                      className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none ${
                        darkMode
                          ? "shadow-inset-lg shadow-blue-600/20"
                          : "shadow-inset-lg shadow-blue-600/20"
                      }`}
                    ></div>
                  </a>
                  <a
                    href={`mailto:${profile?.socialLinks?.email || "sknbasknba@gmail.com"}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group relative p-3 md:p-4 rounded-2xl transition-all duration-300 transform active:scale-90 overflow-hidden ${
                      darkMode
                        ? "backdrop-blur-2xl bg-linear-to-br from-gray-700/30 via-gray-800/20 to-gray-900/30 border border-gray-600/40 hover:border-red-500/60 shadow-lg shadow-gray-900/50 hover:shadow-2xl hover:shadow-red-500/40 hover:-translate-y-1 drop-shadow-md drop-shadow-gray-900/30"
                        : "backdrop-blur-2xl bg-linear-to-br from-white/40 via-red-50/30 to-white/20 border border-red-200/50 hover:border-red-500/80 shadow-lg shadow-red-100/40 hover:shadow-2xl hover:shadow-red-500/40 hover:-translate-y-1 drop-shadow-md drop-shadow-red-200/20"
                    }`}
                    aria-label="Email"
                    title="Email"
                  >
                    <div
                      className={`absolute inset-0 transition-all duration-500 ${
                        darkMode
                          ? "bg-linear-to-r from-red-500/0 via-red-500/0 to-red-500/0 group-hover:from-red-500/20 group-hover:via-red-500/10 group-hover:to-red-500/0"
                          : "bg-linear-to-r from-red-500/0 via-red-500/0 to-red-500/0 group-hover:from-red-500/20 group-hover:via-red-500/15 group-hover:to-red-500/0"
                      }`}
                    ></div>
                    <MailPlus
                      size={24}
                      className={`relative z-10 transition-all duration-300 group-hover:scale-110 ${
                        darkMode
                          ? "text-gray-400 group-hover:text-red-400 drop-shadow-lg group-hover:drop-shadow-2xl"
                          : "text-gray-600 group-hover:text-red-600 drop-shadow-md group-hover:drop-shadow-lg"
                      }`}
                    />
                    <div
                      className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none ${
                        darkMode
                          ? "shadow-inset-lg shadow-red-500/20"
                          : "shadow-inset-lg shadow-red-500/20"
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
