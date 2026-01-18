import { useTheme } from "../context/ThemeContext";

/**
 * Skeleton Loader Component inspired by FoundationsAndInterests glassmorphism design
 */
const SkeletonLoader = ({ type = "hero", count = 1 }) => {
  const { darkMode } = useTheme();

  // About skeleton
  if (type === "about") {
    return (
      <section className={`py-20 px-4 transition-all duration-300`}>
        <div className="max-w-7xl mx-auto">
          {/* Title skeleton */}
          <div className="text-center mb-16">
            <div
              className={`h-10 w-48 rounded-full animate-pulse mx-auto mb-6 ${darkMode ? "bg-gray-700/50" : "bg-gray-200/50"}`}
            ></div>
            <div
              className={`h-8 w-full max-w-2xl rounded-lg animate-pulse mx-auto mb-4 ${darkMode ? "bg-gray-700/50" : "bg-gray-200/50"}`}
              style={{ animationDelay: "100ms" }}
            ></div>
            <div
              className={`h-4 w-3/4 max-w-2xl rounded animate-pulse mx-auto ${darkMode ? "bg-gray-700/40" : "bg-gray-200/40"}`}
              style={{ animationDelay: "200ms" }}
            ></div>
          </div>

          {/* Content grid skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Left content */}
            <div className="space-y-6">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`h-16 rounded-lg animate-pulse ${darkMode ? "bg-gray-700/50" : "bg-gray-200/50"}`}
                  style={{ animationDelay: `${300 + i * 100}ms` }}
                ></div>
              ))}
            </div>
            {/* Right content */}
            <div className="space-y-6">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`h-16 rounded-lg animate-pulse ${darkMode ? "bg-gray-700/50" : "bg-gray-200/50"}`}
                  style={{ animationDelay: `${700 + i * 100}ms` }}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Projects skeleton
  if (type === "projects") {
    return (
      <section className={`py-20 px-4`}>
        <div className="max-w-7xl mx-auto">
          {/* Title skeleton */}
          <div className="text-center mb-16">
            <div
              className={`h-10 w-48 rounded-full animate-pulse mx-auto mb-6 ${darkMode ? "bg-gray-700/50" : "bg-gray-200/50"}`}
            ></div>
            <div
              className={`h-8 w-full max-w-2xl rounded-lg animate-pulse mx-auto mb-4 ${darkMode ? "bg-gray-700/50" : "bg-gray-200/50"}`}
              style={{ animationDelay: "100ms" }}
            ></div>
          </div>

          {/* Projects grid skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`h-96 rounded-2xl animate-pulse ${darkMode ? "bg-gray-700/50" : "bg-gray-200/50"}`}
                style={{ animationDelay: `${200 + i * 150}ms` }}
              ></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // FoundationsAndInterests skeleton
  if (type === "foundations") {
    return (
      <section className="mt-10 mb-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Title skeleton */}
          <div className="text-center mb-20">
            <div
              className={`h-10 w-48 rounded-full animate-pulse mx-auto mb-6 ${darkMode ? "bg-gray-700/50" : "bg-gray-200/50"}`}
            ></div>
            <div
              className={`h-8 w-full max-w-2xl rounded-lg animate-pulse mx-auto mb-4 ${darkMode ? "bg-gray-700/50" : "bg-gray-200/50"}`}
              style={{ animationDelay: "100ms" }}
            ></div>
          </div>

          {/* Education cards skeleton */}
          <div className="space-y-6 mb-20">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`h-40 rounded-xl animate-pulse ${darkMode ? "bg-gray-700/50" : "bg-gray-200/50"}`}
                style={{ animationDelay: `${200 + i * 100}ms` }}
              ></div>
            ))}
          </div>

          {/* Skills grid skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-4">
                <div
                  className={`h-10 w-32 rounded-lg animate-pulse ${darkMode ? "bg-gray-700/50" : "bg-gray-200/50"}`}
                  style={{ animationDelay: `${600 + i * 100}ms` }}
                ></div>
                {[1, 2, 3, 4].map((j) => (
                  <div
                    key={j}
                    className={`h-8 rounded-lg animate-pulse ${darkMode ? "bg-gray-700/40" : "bg-gray-200/40"}`}
                    style={{ animationDelay: `${700 + i * 100 + j * 50}ms` }}
                  ></div>
                ))}
              </div>
            ))}
          </div>

          {/* Interests grid skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`h-32 rounded-xl animate-pulse ${darkMode ? "bg-gray-700/50" : "bg-gray-200/50"}`}
                style={{ animationDelay: `${1000 + i * 100}ms` }}
              ></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Contact skeleton
  if (type === "contact") {
    return (
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Title skeleton */}
          <div className="text-center mb-16">
            <div
              className={`h-10 w-48 rounded-full animate-pulse mx-auto mb-6 ${darkMode ? "bg-gray-700/50" : "bg-gray-200/50"}`}
            ></div>
            <div
              className={`h-8 w-full max-w-2xl rounded-lg animate-pulse mx-auto mb-4 ${darkMode ? "bg-gray-700/50" : "bg-gray-200/50"}`}
              style={{ animationDelay: "100ms" }}
            ></div>
            <div
              className={`h-4 w-3/4 max-w-xl rounded animate-pulse mx-auto ${darkMode ? "bg-gray-700/40" : "bg-gray-200/40"}`}
              style={{ animationDelay: "200ms" }}
            ></div>
          </div>

          {/* Contact grid skeleton */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
            {/* Left contact info */}
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`h-24 rounded-lg animate-pulse ${darkMode ? "bg-gray-700/50" : "bg-gray-200/50"}`}
                  style={{ animationDelay: `${300 + i * 100}ms` }}
                ></div>
              ))}
            </div>
            {/* Right form skeleton */}
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`h-12 rounded-lg animate-pulse ${darkMode ? "bg-gray-700/50" : "bg-gray-200/50"}`}
                  style={{ animationDelay: `${600 + i * 100}ms` }}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Footer skeleton
  if (type === "footer") {
    return (
      <footer
        className={`py-12 px-4 ${darkMode ? "bg-gray-950" : "bg-gray-50"}`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-4">
                <div
                  className={`h-6 w-32 rounded animate-pulse ${darkMode ? "bg-gray-700/50" : "bg-gray-200/50"}`}
                  style={{ animationDelay: `${i * 100}ms` }}
                ></div>
                {[1, 2, 3].map((j) => (
                  <div
                    key={j}
                    className={`h-4 w-24 rounded animate-pulse ${darkMode ? "bg-gray-700/40" : "bg-gray-200/40"}`}
                    style={{ animationDelay: `${i * 100 + j * 50}ms` }}
                  ></div>
                ))}
              </div>
            ))}
          </div>
          <div
            className={`h-px ${darkMode ? "bg-gray-800" : "bg-gray-200"} mb-6`}
          ></div>
          <div
            className={`h-4 w-full max-w-xs rounded animate-pulse ${darkMode ? "bg-gray-700/40" : "bg-gray-200/40"}`}
          ></div>
        </div>
      </footer>
    );
  }

  // ErrorPage skeleton
  if (type === "errorpage") {
    return (
      <div className="min-h-screen flex flex-col">
        <div
          className={`flex-1 flex items-center justify-center px-4 ${darkMode ? "bg-slate-950" : "bg-slate-50"}`}
        >
          <div className="text-center space-y-6 w-full max-w-2xl">
            {/* Error code skeleton */}
            <div
              className={`h-32 w-40 rounded-lg animate-pulse mx-auto ${darkMode ? "bg-gray-700/50" : "bg-gray-200/50"}`}
              style={{ animationDelay: "100ms" }}
            ></div>
            {/* Error title skeleton */}
            <div
              className={`h-8 w-3/4 max-w-xs rounded-lg animate-pulse mx-auto ${darkMode ? "bg-gray-700/50" : "bg-gray-200/50"}`}
              style={{ animationDelay: "200ms" }}
            ></div>
            {/* Error description skeleton */}
            <div className="space-y-2">
              <div
                className={`h-4 w-full rounded animate-pulse ${darkMode ? "bg-gray-700/40" : "bg-gray-200/40"}`}
                style={{ animationDelay: "300ms" }}
              ></div>
              <div
                className={`h-4 w-5/6 mx-auto rounded animate-pulse ${darkMode ? "bg-gray-700/40" : "bg-gray-200/40"}`}
                style={{ animationDelay: "400ms" }}
              ></div>
            </div>
            {/* Buttons skeleton */}
            <div className="flex gap-4 justify-center pt-4">
              <div
                className={`h-11 w-40 rounded-lg animate-pulse ${darkMode ? "bg-gray-700/50" : "bg-gray-200/50"}`}
                style={{ animationDelay: "500ms" }}
              ></div>
              <div
                className={`h-11 w-40 rounded-lg animate-pulse ${darkMode ? "bg-gray-700/50" : "bg-gray-200/50"}`}
                style={{ animationDelay: "600ms" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ProjectsPage skeleton
  if (type === "projectspage") {
    return (
      <div className="min-h-screen flex flex-col">
        <section
          className={`flex-1 py-20 px-4 ${darkMode ? "bg-gray-950" : "bg-white"}`}
        >
          <div className="max-w-7xl mx-auto">
            {/* Title skeleton */}
            <div className="text-center mb-16">
              <div
                className={`h-10 w-48 rounded-full animate-pulse mx-auto mb-6 ${darkMode ? "bg-gray-700/50" : "bg-gray-200/50"}`}
              ></div>
              <div
                className={`h-8 w-full max-w-2xl rounded-lg animate-pulse mx-auto mb-4 ${darkMode ? "bg-gray-700/50" : "bg-gray-200/50"}`}
                style={{ animationDelay: "100ms" }}
              ></div>
            </div>

            {/* Projects grid skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className={`h-96 rounded-2xl animate-pulse ${darkMode ? "bg-gray-700/50" : "bg-gray-200/50"}`}
                  style={{ animationDelay: `${200 + i * 100}ms` }}
                ></div>
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (type === "navigation") {
    return (
      <nav
        className={`sticky top-0 z-50 transition-all duration-300 backdrop-blur-2xl border-b ${
          darkMode
            ? "bg-gray-900/80 border-gray-800/50"
            : "bg-white/80 border-gray-200/50"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo skeleton */}
            <div
              className={`h-10 w-32 rounded-lg animate-pulse ${
                darkMode ? "bg-gray-700/50" : "bg-gray-200/50"
              }`}
            ></div>

            {/* Menu skeleton */}
            <div className="hidden md:flex gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`h-4 w-20 rounded animate-pulse ${
                    darkMode ? "bg-gray-700/50" : "bg-gray-200/50"
                  }`}
                  style={{ animationDelay: `${i * 100}ms` }}
                ></div>
              ))}
            </div>

            {/* Right controls skeleton */}
            <div className="flex gap-3">
              <div
                className={`h-8 w-8 rounded-full animate-pulse ${
                  darkMode ? "bg-gray-700/50" : "bg-gray-200/50"
                }`}
              ></div>
              <div
                className={`h-8 w-8 rounded-full animate-pulse ${
                  darkMode ? "bg-gray-700/50" : "bg-gray-200/50"
                }`}
              ></div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  if (type === "hero") {
    return (
      <section
        className={`pt-32 pb-20 px-4 min-h-screen flex items-center transition-all duration-500 relative overflow-hidden`}
      >
        <div className="max-w-7xl mx-auto w-full relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 items-center">
            {/* Left content skeleton */}
            <div className="space-y-6 order-last md:order-first">
              {/* Badge skeleton */}
              <div
                className={`h-10 w-48 rounded-full animate-pulse ${
                  darkMode ? "bg-gray-700/50" : "bg-gray-200/50"
                }`}
              ></div>

              {/* Title skeleton */}
              <div className="space-y-3">
                <div
                  className={`h-8 w-full rounded-lg animate-pulse ${
                    darkMode ? "bg-gray-700/50" : "bg-gray-200/50"
                  }`}
                  style={{ animationDelay: "100ms" }}
                ></div>
                <div
                  className={`h-8 w-3/4 rounded-lg animate-pulse ${
                    darkMode ? "bg-gray-700/50" : "bg-gray-200/50"
                  }`}
                  style={{ animationDelay: "200ms" }}
                ></div>
              </div>

              {/* Description skeleton */}
              <div className="space-y-3">
                <div
                  className={`h-4 w-full rounded animate-pulse ${
                    darkMode ? "bg-gray-700/40" : "bg-gray-200/40"
                  }`}
                  style={{ animationDelay: "300ms" }}
                ></div>
                <div
                  className={`h-4 w-5/6 rounded animate-pulse ${
                    darkMode ? "bg-gray-700/40" : "bg-gray-200/40"
                  }`}
                  style={{ animationDelay: "400ms" }}
                ></div>
              </div>

              {/* Buttons skeleton */}
              <div className="flex gap-3 pt-4">
                <div
                  className={`h-11 w-40 rounded-xl animate-pulse ${
                    darkMode ? "bg-gray-700/50" : "bg-gray-200/50"
                  }`}
                  style={{ animationDelay: "500ms" }}
                ></div>
                <div
                  className={`h-11 w-40 rounded-xl animate-pulse ${
                    darkMode ? "bg-gray-700/50" : "bg-gray-200/50"
                  }`}
                  style={{ animationDelay: "600ms" }}
                ></div>
              </div>

              {/* Social links skeleton */}
              <div className="flex gap-3 pt-6">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`h-12 w-12 rounded-2xl animate-pulse ${
                      darkMode ? "bg-gray-700/50" : "bg-gray-200/50"
                    }`}
                    style={{ animationDelay: `${700 + i * 100}ms` }}
                  ></div>
                ))}
              </div>
            </div>

            {/* Right image skeleton */}
            <div className="flex items-center justify-center order-first md:order-last">
              <div
                className={`w-48 h-48 sm:w-60 sm:h-60 md:w-72 md:h-72 lg:w-80 lg:h-80 xl:w-96 xl:h-96 rounded-full animate-pulse ${
                  darkMode ? "bg-gray-700/50" : "bg-gray-200/50"
                }`}
                style={{ animationDelay: "1000ms" }}
              ></div>
            </div>
          </div>
        </div>

        <style>{`
          @keyframes shimmer {
            0% {
              background-position: -1000px 0;
            }
            100% {
              background-position: 1000px 0;
            }
          }
          .animate-pulse {
            animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }
        `}</style>
      </section>
    );
  }

  return null;
};

export default SkeletonLoader;
