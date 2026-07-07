import { useTheme } from "../context/ThemeContext";

/**
 * Skeleton Loader Component
 * Every skeleton type precisely mirrors the actual component's layout,
 * grid structure, card dimensions, and element sizes.
 */
const SkeletonLoader = ({ type = "hero", count = 1 }) => {
  const { darkMode } = useTheme();

  const pulse = (extra = "") =>
    `animate-pulse ${darkMode ? "bg-gray-700/50" : "bg-gray-200/60"} ${extra}`;
  const pulseFaint = (extra = "") =>
    `animate-pulse ${darkMode ? "bg-gray-700/35" : "bg-gray-200/40"} ${extra}`;

  // ─── Navigation ───────────────────────────────────────────────────────────
  // Real: fixed top-0, backdrop-blur, max-w-7xl, flex h-16
  // Logo (h-9 w-auto) + 4 desktop nav links + theme toggle + mobile hamburger
  if (type === "navigation") {
    return (
      <nav className={`sticky top-0 z-50 backdrop-blur-2xl ${darkMode ? "" : "bg-white/5"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo: text-xl sm:text-2xl font-black */}
            <div className={`h-9 w-32 sm:w-36 rounded-lg ${pulse()}`} />

            {/* Desktop nav: hidden md:flex items-center space-x-7 */}
            <div className="hidden md:flex items-center gap-7">
              {["About", "Projects", "Skills & Education", "Contact"].map((_, i) => (
                <div
                  key={i}
                  className={`h-4 rounded ${pulse()}`}
                  style={{ width: [44, 60, 112, 56][i], animationDelay: `${i * 70}ms` }}
                />
              ))}
            </div>

            {/* Right: theme toggle (p-2.5 = ~40px) + mobile hamburger */}
            <div className="flex items-center gap-4">
              {/* Theme toggle button */}
              <div className={`h-10 w-10 rounded-xl ${pulse()}`} />
              {/* Hamburger — md:hidden */}
              <div className={`h-10 w-10 md:hidden rounded-xl ${pulse()}`} style={{ animationDelay: "60ms" }} />
            </div>
          </div>
        </div>
      </nav>
    );
  }

  // ─── Hero ─────────────────────────────────────────────────────────────────
  // Real: pt-32 md:pt-44 min-h-screen, xl:grid-cols-2 gap-8 sm:gap-12 items-center
  // Right (order-first mobile): w-48→xl:w-96 rounded-full avatar
  // Left (order-last mobile): badge pill, h1 (2 lines), bio (3 lines), 2 CTA buttons, 3 social icons
  if (type === "hero") {
    return (
      <section className="pt-32 md:pt-44 pb-20 px-4 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 sm:gap-12 items-center">
            {/* Avatar — order-first on mobile */}
            <div className="flex items-center justify-center order-first xl:order-last">
              <div
                className={`w-48 h-48 sm:w-60 sm:h-60 md:w-72 md:h-72 lg:w-80 lg:h-80 xl:w-96 xl:h-96 rounded-full ${pulse()}`}
                style={{ animationDelay: "600ms" }}
              />
            </div>

            {/* Text content — px-4 sm:px-8 2xl:px-0, order-last mobile */}
            <div className="space-y-6 order-last xl:order-first px-4 sm:px-8 2xl:px-0">
              {/* Badge: px-4 py-2 rounded-full text-sm */}
              <div className={`h-9 w-48 rounded-full ${pulse()}`} />

              {/* h1: text-3xl→xl:text-5xl font-bold — 2 lines */}
              <div className="space-y-3">
                <div className={`h-9 sm:h-10 lg:h-11 xl:h-12 w-full rounded-lg ${pulse()}`} style={{ animationDelay: "100ms" }} />
                <div className={`h-9 sm:h-10 lg:h-11 xl:h-12 w-3/4 rounded-lg ${pulse()}`} style={{ animationDelay: "160ms" }} />
              </div>

              {/* Bio p: text-base md:text-lg — 3 lines */}
              <div className="space-y-2.5">
                <div className={`h-5 w-full rounded ${pulseFaint()}`} style={{ animationDelay: "240ms" }} />
                <div className={`h-5 w-11/12 rounded ${pulseFaint()}`} style={{ animationDelay: "290ms" }} />
                <div className={`h-5 w-4/5 rounded ${pulseFaint()}`} style={{ animationDelay: "340ms" }} />
              </div>

              {/* CTA buttons: flex-row gap-3, ButtonGradient = px-6 md:px-8 py-3 md:py-3.5 rounded-2xl */}
              <div className="flex flex-row gap-3 pt-4 md:pt-6">
                <div className={`h-12 md:h-13 w-32 sm:w-40 rounded-2xl ${pulse()}`} style={{ animationDelay: "400ms" }} />
                <div className={`h-12 md:h-13 w-32 sm:w-40 rounded-2xl ${pulse()}`} style={{ animationDelay: "460ms" }} />
              </div>

              {/* Social icons: p-3 md:p-4 rounded-2xl = ~42px md:~48px */}
              <div className="flex gap-3 sm:gap-4 pt-6 md:pt-8">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`h-11 w-11 md:h-13 md:w-13 rounded-2xl ${pulse()}`}
                    style={{ animationDelay: `${520 + i * 80}ms` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ─── About ────────────────────────────────────────────────────────────────
  // Real: py-20 px-4, text-center header, lg:grid-cols-2 gap-8 xl:gap-4 2xl:gap-16 items-start
  // Left (order-2 lg:order-1): 2 paragraphs + highlight grid (grid-cols-1 sm:grid-cols-2 gap-3/4)
  // Right (order-1 lg:order-2): 3 stat cards (grid-cols-3 lg:grid-cols-2 gap-4)
  if (type === "about") {
    return (
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header: badge + h2 + subtitle */}
          <div className="text-center mt-4 mb-16">
            <div className={`h-9 w-36 rounded-full mx-auto mb-4 ${pulse()}`} />
            <div className={`h-8 sm:h-9 lg:h-10 xl:h-11 w-72 rounded-lg mx-auto mb-4 ${pulse()}`} style={{ animationDelay: "80ms" }} />
            <div className={`h-5 w-3/4 max-w-lg rounded mx-auto ${pulseFaint()}`} style={{ animationDelay: "160ms" }} />
          </div>

          <div className="grid lg:grid-cols-2 gap-8 xl:gap-4 2xl:gap-16 items-start">
            {/* Left — text content, order-2 on mobile */}
            <div className="space-y-8 order-2 lg:order-1">
              {/* Paragraph 1 — text-base sm:text-lg leading-relaxed */}
              <div className="space-y-3">
                {[100, 96, 91, 78].map((w, i) => (
                  <div
                    key={i}
                    className={`h-5 sm:h-6 rounded ${pulseFaint()}`}
                    style={{ width: `${w}%`, animationDelay: `${240 + i * 60}ms` }}
                  />
                ))}
              </div>
              {/* Paragraph 2 */}
              <div className="space-y-3">
                {[100, 94, 98, 84, 67].map((w, i) => (
                  <div
                    key={i}
                    className={`h-5 sm:h-6 rounded ${pulseFaint()}`}
                    style={{ width: `${w}%`, animationDelay: `${480 + i * 55}ms` }}
                  />
                ))}
              </div>

              {/* Highlights — grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-3 p-3 rounded-lg border ${
                      darkMode ? "border-gray-700/30" : "border-blue-300/30"
                    } ${pulse()}`}
                    style={{ animationDelay: `${720 + i * 80}ms` }}
                  >
                    <div className={`h-5 w-5 rounded-full shrink-0 ${pulseFaint()}`} />
                    <div className={`h-4 flex-1 rounded ${pulseFaint()}`} />
                  </div>
                ))}
              </div>
            </div>

            {/* Right — stats, order-1 on mobile */}
            <div className="w-full order-1 lg:order-2">
              {/* grid-cols-3 lg:grid-cols-2, p-4 sm:p-5 lg:p-6 rounded-xl */}
              <div className="grid grid-cols-3 lg:grid-cols-2 gap-4 sm:gap-3 lg:gap-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`p-4 sm:p-5 lg:p-6 rounded-xl text-center border ${
                      darkMode
                        ? "bg-gray-900/40 border-gray-700/40"
                        : "bg-blue-50/80 border-blue-200/50"
                    }`}
                    style={{ animationDelay: `${200 + i * 100}ms` }}
                  >
                    {/* Icon — size={22} */}
                    <div className={`h-6 w-6 rounded mx-auto mb-2 sm:mb-3 ${pulse()}`} />
                    {/* Number — text-xl sm:text-2xl lg:text-3xl */}
                    <div className={`h-7 sm:h-8 lg:h-9 w-12 sm:w-14 rounded mx-auto mb-1 ${pulse()}`} style={{ animationDelay: `${300 + i * 100}ms` }} />
                    {/* Label — text-xs sm:text-sm */}
                    <div className={`h-3.5 w-14 sm:w-16 rounded mx-auto ${pulseFaint()}`} style={{ animationDelay: `${400 + i * 100}ms` }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ─── Projects (home carousel section) ────────────────────────────────────
  // Real: py-20 px-4, section header (badge+h2+p), carousel with ←/→ buttons,
  // cards h-60 aspect-video rounded-none, "View All Projects" link at bottom
  if (type === "projects") {
    return (
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Section header */}
          <div className="text-center mt-4 mb-16">
            <div className={`h-9 w-36 rounded-full mx-auto mb-4 ${pulse()}`} />
            <div className={`h-8 sm:h-9 lg:h-10 xl:h-11 w-56 rounded-lg mx-auto mb-4 ${pulse()}`} style={{ animationDelay: "80ms" }} />
            <div className={`h-5 w-64 rounded mx-auto ${pulseFaint()}`} style={{ animationDelay: "160ms" }} />
          </div>

          {/* Carousel row */}
          <div className="relative flex items-center justify-center">
            {/* Left arrow: p-3 md:p-4 rounded-full */}
            <div className={`absolute xl:-left-10 2xl:-left-20 max-xl:-left-0.5 top-1/2 -translate-y-1/2 z-10 h-11 w-11 md:h-13 md:w-13 rounded-full ${pulse()}`} />

            {/* Sliding strip — w-full overflow-hidden */}
            <div className="w-full overflow-hidden">
              <div className="flex">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="shrink-0 h-60"
                    style={{ flex: "0 0 calc(100% / 3)", aspectRatio: "16/9" }}
                  >
                    <div
                      className={`w-full h-full ${pulse()}`}
                      style={{ animationDelay: `${220 + i * 110}ms` }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Right arrow */}
            <div className={`absolute xl:-right-10 2xl:-right-20 max-xl:-right-0.5 top-1/2 -translate-y-1/2 z-10 h-11 w-11 md:h-13 md:w-13 rounded-full ${pulse()}`} />
          </div>

          {/* "View All Projects" link — mt-12 */}
          <div className="flex justify-center mt-12">
            <div className={`h-5 w-36 rounded ${pulseFaint()}`} />
          </div>
        </div>
      </section>
    );
  }

  // ─── Foundations & Interests ──────────────────────────────────────────────
  // Real: py-20 px-4, text-center header, grid-cols-1 lg:grid-cols-3 gap-8
  // Left (lg:col-span-1): Education — header row + timeline (3 entries, border-l-2 ml-5)
  // Right (lg:col-span-2): Skills header + grid(sm:cols-2 lg:cols-3 mb-16 rounded-3xl p-6) +
  //                        Interests header + flex-wrap pill badges
  if (type === "foundations") {
    return (
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Section header */}
          <div className="text-center mt-5 mb-20">
            <div className={`h-9 w-44 rounded-full mx-auto mb-6 ${pulse()}`} />
            <div className={`h-9 sm:h-10 md:h-11 lg:h-12 w-64 sm:w-80 rounded-lg mx-auto mb-4 ${pulse()}`} style={{ animationDelay: "80ms" }} />
            <div className={`h-5 w-3/4 max-w-xl rounded mx-auto ${pulseFaint()}`} style={{ animationDelay: "160ms" }} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Education — lg:col-span-1 */}
            <div className="lg:col-span-1 space-y-8">
              {/* Header: icon(p-3 rounded-full) + h3(text-2xl) */}
              <div className="flex items-center gap-4">
                <div className={`h-12 w-12 rounded-full ${pulse()}`} />
                <div className={`h-7 w-32 rounded-lg ${pulse()}`} />
              </div>
              {/* Timeline: border-l-2 border-dashed ml-5, entries pl-8 */}
              <div className="space-y-6 border-l-2 border-dashed border-gray-300 dark:border-gray-700 ml-5">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="pl-8 relative space-y-2"
                    style={{ animationDelay: `${240 + i * 100}ms` }}
                  >
                    {/* Degree: text-lg font-semibold */}
                    <div className={`h-5 w-5/6 rounded ${pulse()}`} />
                    {/* Institution: text-sm font-medium */}
                    <div className={`h-4 w-4/5 rounded ${pulseFaint()}`} />
                    {/* Year + CGPA badge row */}
                    <div className="flex items-center gap-3 mt-2 mb-2">
                      <div className={`h-4 w-20 rounded ${pulseFaint()}`} />
                      <div className={`h-7 w-24 rounded-full ${pulse()}`} />
                    </div>
                    {/* Details: text-sm */}
                    <div className={`h-3.5 w-full rounded ${pulseFaint()}`} />
                    <div className={`h-3.5 w-3/4 rounded ${pulseFaint()}`} />
                  </div>
                ))}
              </div>
            </div>

            {/* Skills + Interests — lg:col-span-2 */}
            <div className="lg:col-span-2">
              {/* Skills header row */}
              <div className="flex items-center gap-4 mb-8">
                <div className={`h-12 w-12 rounded-full ${pulse()}`} />
                <div className={`h-7 w-20 rounded-lg ${pulse()}`} />
              </div>

              {/* Skills cards: grid gap-8 sm:grid-cols-2 lg:grid-cols-3 mb-16 */}
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 mb-16">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`rounded-3xl p-6 border ${
                      darkMode
                        ? "bg-gray-900/60 border-white/10"
                        : "bg-white/95 border-white/60 shadow-lg"
                    }`}
                    style={{ animationDelay: `${480 + i * 100}ms` }}
                  >
                    {/* Category: icon(text-3xl) + h3(text-xl) — flex gap-4 mb-6 */}
                    <div className="flex items-center gap-4 mb-6">
                      <div className={`h-8 w-8 rounded ${pulse()}`} />
                      <div className={`h-6 w-24 rounded-lg ${pulse()}`} />
                    </div>
                    {/* Skill bars × 4 — space-y-5 */}
                    <div className="space-y-5">
                      {[1, 2, 3, 4].map((j) => (
                        <div key={j} style={{ animationDelay: `${580 + i * 100 + j * 50}ms` }}>
                          <div className="flex justify-between mb-1">
                            <div className={`h-3 w-20 rounded ${pulseFaint()}`} />
                            <div className={`h-3 w-8 rounded ${pulseFaint()}`} />
                          </div>
                          {/* Bar: h-2 rounded-full */}
                          <div className={`w-full h-2 rounded-full ${pulseFaint()}`} />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Interests — header row + flex-wrap pill badges */}
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className={`h-12 w-12 rounded-full ${pulse()}`} />
                  <div className={`h-7 w-28 rounded-lg ${pulse()}`} />
                </div>
                {/* Pills: px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-3xl — icon + label */}
                <div className="flex flex-wrap gap-3 sm:gap-4">
                  {["Researching", "Note-Making", "Gaming", "Movies"].map((label, i) => (
                    <div
                      key={i}
                      className={`h-9 sm:h-10 rounded-3xl ${pulse()}`}
                      style={{
                        width: [110, 112, 88, 90][i],
                        animationDelay: `${1000 + i * 80}ms`,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ─── Contact ──────────────────────────────────────────────────────────────
  // Real: py-20 px-4, text-center header (badge, h2, p)
  // Grid: justify-items-center lg:grid-cols-2 gap-8 lg:gap-16
  // Left: 3 compact contact-info cards (p-3 pr-7 rounded-xl — icon 8×8 + title + info + arrow)
  // Right: form heading (text-2xl sm:text-3xl) + name/email 2-col + textarea 5-rows + submit btn
  if (type === "contact") {
    return (
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mt-4 mb-16">
            <div className={`h-9 w-40 rounded-full mx-auto mb-4 ${pulse()}`} />
            <div className={`h-9 md:h-10 w-64 rounded-lg mx-auto mb-4 ${pulse()}`} style={{ animationDelay: "80ms" }} />
            <div className={`h-5 w-56 rounded mx-auto ${pulseFaint()}`} style={{ animationDelay: "160ms" }} />
          </div>

          {/* Main grid */}
          <div className="grid justify-items-center lg:grid-cols-2 gap-8 lg:gap-16 mb-8">
            {/* Left: contact info — max-lg:flex flex-wrap gap-4 lg:space-y-6 lg:mt-10 */}
            <div className="lg:space-y-6 lg:place-content-start max-lg:w-full max-lg:flex items-center justify-center md:gap-8 gap-4 flex-wrap lg:mt-10 lg:mr-10">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`flex items-center gap-2 p-3 pr-7 rounded-xl border ${
                    darkMode
                      ? "bg-gray-900/50 border-gray-700/40"
                      : "bg-white/70 border-gray-200"
                  }`}
                  style={{ animationDelay: `${240 + i * 100}ms` }}
                >
                  {/* Icon: w-8 h-8 rounded */}
                  <div className={`h-8 w-8 rounded shrink-0 ${pulse()}`} />
                  <div>
                    {/* Title: text-sm font-bold */}
                    <div className={`h-3.5 w-14 rounded mb-1.5 ${pulse()}`} />
                    {/* Info: text-xs font-semibold */}
                    <div className={`h-3 w-28 sm:w-40 rounded ${pulseFaint()}`} />
                  </div>
                </div>
              ))}
            </div>

            {/* Right: form — w-full max-w-2xl lg:mr-44 */}
            <div className="w-full max-w-2xl lg:mr-44">
              {/* Heading: text-2xl sm:text-3xl font-bold, text-center */}
              <div className={`h-8 sm:h-9 w-52 sm:w-60 rounded-lg mx-auto mb-6 ${pulse()}`} />

              {/* Name + Email: grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 mb-4 sm:mb-5 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 mb-4 sm:mb-5">
                {[1, 2].map((i) => (
                  <div key={i} style={{ animationDelay: `${440 + i * 80}ms` }}>
                    <div className={`h-4 w-20 rounded mb-2 ${pulse()}`} />
                    {/* Input: py-2 sm:py-3 rounded-lg */}
                    <div className={`h-10 sm:h-11 w-full rounded-lg ${pulse()}`} />
                  </div>
                ))}
              </div>

              {/* Message: mb-6 sm:mb-8, textarea rows=5 */}
              <div className="mb-6 sm:mb-8" style={{ animationDelay: "600ms" }}>
                <div className={`h-4 w-28 rounded mb-2 ${pulse()}`} />
                <div className={`h-32 sm:h-36 w-full rounded-lg ${pulse()}`} />
              </div>

              {/* Submit: ButtonGradient px-8 sm:px-12 py-3 sm:py-4 */}
              <div className="flex justify-center" style={{ animationDelay: "700ms" }}>
                <div className={`h-12 sm:h-14 w-40 sm:w-52 rounded-xl ${pulse()}`} />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ─── Footer ───────────────────────────────────────────────────────────────
  // Real: rounded-tl-2xl rounded-tr-2xl, footer-content (max-w-7xl mx-auto py-6)
  // Inner: w-full flex gap-14 max-xl:flex-col
  //   Left (xl:w-3/5): flex-wrap gap-4/12/16 — 3 link sections (title + 4 links each)
  //   Right (xl:w-2/5): brand name + description + 4 social btn circles (w-10 h-10 rounded-full)
  // Divider + bottom row (copyright + 3 policy links)
  if (type === "footer") {
    return (
      <footer
        className={`rounded-tl-2xl rounded-tr-2xl ${
          darkMode
            ? "bg-gradient-to-b from-slate-950 to-gray-950"
            : "bg-gradient-to-b from-slate-50 to-white"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-3.5 py-6 sm:py-4">
          {/* Top section: flex gap-14 */}
          <div className="w-full gap-14 max-xl:flex-col flex px-4 sm:px-8 2xl:px-0">
            {/* Left — 3 link sections */}
            <div className="flex flex-wrap gap-4 md:gap-12 xl:gap-16 justify-between xl:justify-start xl:w-3/5">
              {["Quick Links", "Projects", "Contact"].map((title, col) => (
                <div key={col} className="space-y-2" style={{ animationDelay: `${col * 80}ms` }}>
                  {/* Section title: footer-title — ~text-base font-bold */}
                  <div className={`h-4 w-24 rounded mb-3 ${pulse()}`} />
                  {/* Links: footer-link text-sm — 4 per column */}
                  {[80, 60, 72, 88].map((w, j) => (
                    <div
                      key={j}
                      className={`h-4 rounded ${pulseFaint()}`}
                      style={{ width: w + col * 4, animationDelay: `${col * 80 + j * 40}ms` }}
                    />
                  ))}
                </div>
              ))}
            </div>

            {/* Right — brand + social */}
            <div className="xl:w-2/5 space-y-3 xl:translate-x-20 2xl:translate-x-40">
              {/* Brand name: text-base font-bold */}
              <div className={`h-5 w-36 rounded ${pulse()}`} />
              {/* Description: text-sm — 3 lines */}
              <div className="space-y-2">
                <div className={`h-3.5 w-full rounded ${pulseFaint()}`} />
                <div className={`h-3.5 w-5/6 rounded ${pulseFaint()}`} style={{ animationDelay: "60ms" }} />
                <div className={`h-3.5 w-3/4 rounded ${pulseFaint()}`} style={{ animationDelay: "120ms" }} />
              </div>
              {/* Social buttons: w-10 h-10 rounded-full × 4 */}
              <div className="flex gap-2.5 flex-wrap mt-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`h-10 w-10 rounded-full ${pulse()}`}
                    style={{ animationDelay: `${i * 60}ms` }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Divider: h-px, my-6 → mt-6 mb-4 */}
          <div
            className={`h-px my-6 ${darkMode ? "bg-white/10" : "bg-black/10"}`}
            style={{ margin: "1.5rem 1rem 1rem" }}
          />

          {/* Bottom row: copyright + policy links */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-3 px-4 sm:px-8 2xl:px-0">
            <div className={`h-3.5 w-56 rounded ${pulseFaint()}`} />
            <div className="flex flex-wrap gap-4">
              {[72, 96, 80].map((w, i) => (
                <div
                  key={i}
                  className={`h-3.5 rounded ${pulseFaint()}`}
                  style={{ width: w, animationDelay: `${i * 50}ms` }}
                />
              ))}
            </div>
          </div>
        </div>
      </footer>
    );
  }

  // ─── ErrorPage ────────────────────────────────────────────────────────────
  // Real: min-h-screen flex-1 flex items-center justify-center px-4
  // Large error code, title, 2–3 desc lines, 2 action buttons
  if (type === "errorpage") {
    return (
      <div className="min-h-screen flex flex-col">
        <div
          className={`flex-1 flex items-center justify-center px-4 ${
            darkMode ? "bg-slate-950" : "bg-slate-50"
          }`}
        >
          <div className="text-center space-y-6 w-full max-w-2xl">
            {/* Error code — large block */}
            <div
              className={`h-32 w-40 rounded-2xl mx-auto ${pulse()}`}
              style={{ animationDelay: "80ms" }}
            />
            {/* Title */}
            <div
              className={`h-8 w-3/4 max-w-xs rounded-lg mx-auto ${pulse()}`}
              style={{ animationDelay: "180ms" }}
            />
            {/* Description */}
            <div className="space-y-2 max-w-sm mx-auto">
              <div className={`h-4 w-full rounded ${pulseFaint()}`} style={{ animationDelay: "280ms" }} />
              <div className={`h-4 w-5/6 mx-auto rounded ${pulseFaint()}`} style={{ animationDelay: "340ms" }} />
              <div className={`h-4 w-4/5 mx-auto rounded ${pulseFaint()}`} style={{ animationDelay: "400ms" }} />
            </div>
            {/* Buttons */}
            <div className="flex gap-4 justify-center pt-2">
              <div className={`h-11 w-40 rounded-lg ${pulse()}`} style={{ animationDelay: "460ms" }} />
              <div className={`h-11 w-40 rounded-lg ${pulse()}`} style={{ animationDelay: "520ms" }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── ProjectsPage ─────────────────────────────────────────────────────────
  // Real: min-h-screen with Navigation + py-20 section
  // Hero: pt-8 sm:pt-12, badge + h1 + p + search-bar + category pills
  // Grid: flex flex-wrap justify-evenly gap-8, cards: h-64 aspect-video (p-2 rounded-none)
  // Pagination: ChevronLeft + page numbers + ChevronRight
  if (type === "projectspage") {
    return (
      <div className="min-h-screen flex flex-col">
        <section className="py-20 px-4 flex-1">
          <div className="max-w-7xl mx-auto">
            {/* Page hero — pt-8 sm:pt-12 */}
            <div className="pt-8 sm:pt-12 text-center mb-6">
              {/* Badge: px-3 py-1 rounded-full text-[9px] uppercase */}
              <div className={`h-6 w-24 rounded-full mx-auto mb-3 ${pulse()}`} />
              {/* h1: text-3xl sm:text-4xl md:text-5xl font-black */}
              <div className={`h-10 sm:h-11 md:h-12 w-56 sm:w-72 rounded-lg mx-auto mb-2 ${pulse()}`} style={{ animationDelay: "80ms" }} />
              {/* Subtitle: text-sm md:text-base */}
              <div className={`h-4 w-64 sm:w-80 rounded mx-auto mb-6 ${pulseFaint()}`} style={{ animationDelay: "160ms" }} />

              {/* Search bar: max-w-sm sm:max-w-md — flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl */}
              <div className="max-w-sm sm:max-w-md mx-auto mb-6">
                <div
                  className={`flex items-center gap-2.5 h-11 rounded-xl border px-3.5 ${
                    darkMode
                      ? "bg-white/5 border-white/10"
                      : "bg-black/5 border-black/10"
                  } ${pulse()}`}
                  style={{ animationDelay: "240ms" }}
                />
              </div>

              {/* Category pills: flex-wrap justify-center gap-1.5 mb-8 — px-3 py-1.5 rounded-lg */}
              <div className="flex flex-wrap justify-center gap-1.5 mb-8 max-w-3xl mx-auto px-2">
                {[48, 36, 56, 44, 52, 40, 60].map((w, i) => (
                  <div
                    key={i}
                    className={`h-8 rounded-lg ${pulse()}`}
                    style={{ width: w + 16, animationDelay: `${300 + i * 55}ms` }}
                  />
                ))}
              </div>
            </div>

            {/* Project cards grid: flex flex-wrap justify-evenly gap-8 */}
            {/* Each card: h-64 aspect-video, p-2, rounded-none */}
            <div className="flex flex-wrap justify-evenly gap-8 max-[500px]:gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="relative h-64 aspect-video"
                  style={{ animationDelay: `${440 + i * 90}ms` }}
                >
                  <div className={`w-full h-full ${pulse()}`} />
                </div>
              ))}
            </div>

            {/* Pagination: ChevronLeft + numbers + ChevronRight */}
            <div className="flex justify-center items-center gap-2 mt-10">
              <div className={`h-9 w-9 rounded-xl ${pulse()}`} />
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`h-9 w-9 rounded-xl ${pulse()}`}
                  style={{ animationDelay: `${i * 55}ms` }}
                />
              ))}
              <div className={`h-9 w-9 rounded-xl ${pulse()}`} />
            </div>
          </div>
        </section>
      </div>
    );
  }

  // ─── ProjectDetail ────────────────────────────────────────────────────────
  // Real: max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 lg:pt-32 pb-12 sm:pb-20 lg:pb-24
  // 1. Breadcrumb row: back-link (rounded-full px-4 py-2) + category/featured badges
  // 2. Split hero: grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 mb-16 items-center
  //    Left (lg:col-span-6): title (h-11→h-12) + 4-line desc + 6 tech badges + 2 action btns
  //    Right (lg:col-span-6): aspect-video rounded-3xl media
  // 3. Features: border-t pt-16 mb-16, h2 + grid-cols-1 md:grid-cols-2 gap-8, 4 cards (p-6 rounded-2xl)
  // 4. Tech Stack: mb-16, h2 + grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6, 3 cards (h-48 rounded-3xl)
  if (type === "projectdetail") {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 lg:pt-32 pb-12 sm:pb-20 lg:pb-24 relative z-10 w-full">
        {/* Breadcrumb row */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full mb-3 sm:mb-8 gap-3">
          {/* Back link: px-4 py-2 rounded-full border */}
          <div className={`h-9 w-32 rounded-full ${pulse()}`} />
          {/* Category + featured badges: hidden sm:flex gap-3 */}
          <div className="hidden sm:flex flex-wrap items-center gap-3">
            <div className={`h-7 w-28 rounded ${pulse()}`} />
            <div className={`h-7 w-24 rounded ${pulse()}`} style={{ animationDelay: "60ms" }} />
          </div>
        </div>

        {/* Hero split grid: lg:grid-cols-12 gap-6 lg:gap-12 mb-16 items-center */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 mb-16 items-center">
          {/* Left col (lg:col-span-6): title + desc + badges + btns */}
          <div className="lg:col-span-6 flex flex-col justify-center space-y-6">
            {/* Title: text-3xl sm:text-4xl lg:text-5xl font-black */}
            <div className={`h-10 sm:h-11 lg:h-12 w-3/4 rounded-lg ${pulse()}`} />
            {/* Description: text-sm sm:text-base, 4 lines */}
            <div className="space-y-2.5">
              {[100, 96, 90, 83].map((w, i) => (
                <div
                  key={i}
                  className={`h-4 sm:h-5 rounded ${pulseFaint()}`}
                  style={{ width: `${w}%`, animationDelay: `${i * 60}ms` }}
                />
              ))}
            </div>
            {/* Tech badge pills: flex flex-wrap gap-2 */}
            <div className="flex flex-wrap gap-2">
              {[52, 64, 48, 72, 56, 44].map((w, i) => (
                <div
                  key={i}
                  className={`h-6 rounded ${pulse()}`}
                  style={{ width: w, animationDelay: `${i * 50}ms` }}
                />
              ))}
            </div>
            {/* Action buttons: flex gap-4, h-12 rounded-xl */}
            <div className="flex gap-4">
              <div className={`h-12 w-36 rounded-xl ${pulse()}`} />
              <div className={`h-12 w-36 rounded-xl ${pulse()}`} style={{ animationDelay: "80ms" }} />
            </div>
          </div>

          {/* Right col (lg:col-span-6): aspect-video rounded-3xl */}
          <div className="lg:col-span-6 w-full aspect-video rounded-3xl overflow-hidden">
            <div className={`w-full h-full ${pulse()}`} />
          </div>
        </div>

        {/* Features section: border-t pt-16 mb-16 */}
        <div
          className="border-t pt-16 mb-16"
          style={{
            borderColor: darkMode
              ? "rgba(255,255,255,0.08)"
              : "rgba(0,0,0,0.08)",
          }}
        >
          {/* Section heading */}
          <div className={`h-8 w-48 rounded-lg mb-8 ${pulse()}`} />
          {/* Feature cards: grid-cols-1 md:grid-cols-2 gap-8 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`p-6 rounded-2xl border space-y-3 ${
                  darkMode
                    ? "bg-gray-900/50 border-white/5"
                    : "bg-white/60 border-gray-200/60"
                }`}
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className={`h-6 w-1/2 rounded ${pulse()}`} />
                <div className={`h-4 w-full rounded ${pulseFaint()}`} />
                <div className={`h-4 w-5/6 rounded ${pulseFaint()}`} />
              </div>
            ))}
          </div>
        </div>

        {/* Tech Stack section: mb-16 */}
        <div className="mb-16">
          <div className={`h-8 w-64 rounded-lg mb-8 ${pulse()}`} />
          {/* Stack cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6, h-48 rounded-3xl */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`h-48 rounded-3xl border ${
                  darkMode
                    ? "bg-gray-900/50 border-white/5"
                    : "bg-white/60 border-gray-200/60"
                } ${pulse()}`}
                style={{ animationDelay: `${i * 100}ms` }}
              />
            ))}
          </div>
        </div>
      </main>
    );
  }

  return null;
};

export default SkeletonLoader;
