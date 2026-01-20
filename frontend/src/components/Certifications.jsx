import { Award, ExternalLink, Calendar, CheckCircle } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

function Certifications() {
  const { darkMode } = useTheme();

  const certifications = [
    {
      title: "React Developer Certification",
      organization: "Meta (Facebook)",
      issueDate: "2023-06",
      expiryDate: null,
      credentialId: "REACT-2023-12345",
      credentialUrl: "https://credentials.meta.com",
      category: "Frontend",
      color: "from-blue-500/40 to-cyan-500/40",
      icon: "⚛️",
      badge: "Advanced",
    },
    {
      title: "JavaScript Algorithms & Data Structures",
      organization: "freeCodeCamp",
      issueDate: "2023-04",
      expiryDate: null,
      credentialId: "FCC-JS-2023-98765",
      credentialUrl: "https://freecodecamp.org",
      category: "JavaScript",
      color: "from-yellow-500/40 to-orange-500/40",
      icon: "📜",
      badge: "Certified",
    },
    {
      title: "Full Stack Web Development",
      organization: "Udemy",
      issueDate: "2023-02",
      expiryDate: "2025-02",
      credentialId: "UDEMY-FULLSTACK-2023",
      credentialUrl: "https://udemy.com",
      category: "Full Stack",
      color: "from-purple-500/40 to-pink-500/40",
      icon: "🚀",
      badge: "Professional",
    },
    {
      title: "UI/UX Design Fundamentals",
      organization: "Google Design",
      issueDate: "2023-08",
      expiryDate: null,
      credentialId: "GOOGLE-DESIGN-2023",
      credentialUrl: "https://google.com",
      category: "Design",
      color: "from-green-500/40 to-emerald-500/40",
      icon: "🎨",
      badge: "Verified",
    },
    {
      title: "Web Performance Optimization",
      organization: "Coursera",
      issueDate: "2023-11",
      expiryDate: null,
      credentialId: "COURSERA-WPO-2023",
      credentialUrl: "https://coursera.org",
      category: "Performance",
      color: "from-red-500/40 to-rose-500/40",
      icon: "⚡",
      badge: "Advanced",
    },
    {
      title: "AWS Solutions Architect Associate",
      organization: "Amazon Web Services",
      issueDate: "2023-09",
      expiryDate: "2025-09",
      credentialId: "AWS-SA-2023-54321",
      credentialUrl: "https://aws.amazon.com",
      category: "Cloud",
      color: "from-orange-500/40 to-amber-500/40",
      icon: "☁️",
      badge: "Expert",
    },
  ];

  const categories = [...new Set(certifications.map((cert) => cert.category))];

  const getCategoryColor = (category) => {
    const colors = {
      Frontend: "text-blue-600 dark:text-blue-400",
      JavaScript: "text-yellow-600 dark:text-yellow-400",
      "Full Stack": "text-purple-600 dark:text-purple-400",
      Design: "text-green-600 dark:text-green-400",
      Performance: "text-red-600 dark:text-red-400",
      Cloud: "text-orange-600 dark:text-orange-400",
    };
    return colors[category] || "text-gray-600 dark:text-gray-400";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const [year, month] = dateString.split("-");
    const date = new Date(year, parseInt(month) - 1);
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  const isExpired = (expiryDate) => {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
  };

  return (
    <section id="certifications" className="mt-10 mb-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <span
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border backdrop-blur-xl mb-4 ${
              darkMode
                ? "bg-purple-900/40 text-purple-300 border-purple-800"
                : "bg-blue-100/60 text-blue-700 border-blue-300/60 shadow-lg shadow-blue-300/20"
            }`}
          >
            <Award size={16} />
            Professional Certifications
          </span>

          <h2
            className={`mt-6 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight ${
              darkMode ? "text-white/85" : "text-black/85"
            }`}
          >
            Verified Credentials & Achievements
          </h2>

          <p className="mt-4 text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Industry-recognized certifications demonstrating expertise and
            continuous learning.
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category, index) => (
            <div
              key={index}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 transform hover:scale-105 cursor-pointer ${
                darkMode
                  ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {category}
            </div>
          ))}
        </div>

        {/* Certifications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certifications.map((cert, index) => (
            <div
              key={index}
              className={`group relative rounded-2xl p-px
                bg-gradient-to-br ${cert.color}
                transition-all hover:scale-105 duration-500
                ${darkMode ? "hover:shadow-2xl hover:shadow-purple-500/40" : "hover:shadow-2xl hover:shadow-blue-500/30"}`}
            >
              {/* Card Container */}
              <div
                className={`relative h-full rounded-2xl p-6
                  backdrop-blur-xl
                  border border-white/40 dark:border-white/10
                  shadow-lg shadow-black/5 dark:shadow-black/30
                  transition-all duration-500
                  group-hover:-translate-y-1
                  ${
                    darkMode
                      ? "bg-gradient-to-br from-gray-900/80 via-gray-800/70 to-gray-900/80"
                      : "bg-gradient-to-br from-white/80 via-blue-50/60 to-white/70"
                  }`}
              >
                {/* Top Section - Icon and Badge */}
                <div className="flex items-start justify-between mb-4">
                  <span className="text-4xl transition-transform duration-300 group-hover:scale-110">
                    {cert.icon}
                  </span>
                  <span
                    className={`text-xs font-bold px-3 py-1.5 rounded-full whitespace-nowrap transition-all duration-300 ${
                      darkMode
                        ? "bg-gradient-to-r from-amber-900/60 to-yellow-800/60 text-amber-200 border border-amber-700/40"
                        : "bg-gradient-to-r from-amber-100/80 to-yellow-100/80 text-amber-700 border border-amber-300/60"
                    }`}
                  >
                    {cert.badge}
                  </span>
                </div>

                {/* Title */}
                <h3
                  className={`text-lg font-bold mb-2 line-clamp-2 group-hover:text-purple-500 transition-colors ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {cert.title}
                </h3>

                {/* Organization */}
                <p
                  className={`text-sm font-semibold mb-3 ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {cert.organization}
                </p>

                {/* Category */}
                <span
                  className={`inline-block text-xs font-bold px-3 py-1 rounded-full mb-4 ${getCategoryColor(
                    cert.category,
                  )} ${darkMode ? "bg-gray-700/50" : "bg-gray-100/60"}`}
                >
                  {cert.category}
                </span>

                {/* Dates */}
                <div className="space-y-2 mb-4 text-xs">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-purple-500 shrink-0" />
                    <span
                      className={darkMode ? "text-gray-400" : "text-gray-600"}
                    >
                      Issued: {formatDate(cert.issueDate)}
                    </span>
                  </div>
                  {cert.expiryDate && (
                    <div className="flex items-center gap-2">
                      <Calendar
                        size={14}
                        className={
                          isExpired(cert.expiryDate)
                            ? "text-red-500"
                            : "text-green-500"
                        }
                      />
                      <span
                        className={
                          isExpired(cert.expiryDate)
                            ? "text-red-500"
                            : darkMode
                              ? "text-gray-400"
                              : "text-gray-600"
                        }
                      >
                        Expires: {formatDate(cert.expiryDate)}
                        {isExpired(cert.expiryDate) && " (Expired)"}
                      </span>
                    </div>
                  )}
                </div>

                {/* Credential ID */}
                <div
                  className={`mb-4 p-3 rounded-lg text-xs font-mono ${
                    darkMode
                      ? "bg-gray-700/30 text-gray-400"
                      : "bg-gray-100/50 text-gray-600"
                  } break-all`}
                >
                  ID: {cert.credentialId}
                </div>

                {/* Link Button */}
                <a
                  href={cert.credentialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 transform active:scale-95 ${
                    darkMode
                      ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-lg hover:shadow-purple-500/50"
                      : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg hover:shadow-blue-500/50"
                  }`}
                >
                  <ExternalLink size={16} />
                  View Credential
                </a>

                {/* Checkmark for verified */}
                <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-green-500 rounded-full p-1">
                    <CheckCircle size={20} className="text-white" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-16 grid grid-cols-3 gap-4 text-center">
          <div
            className={`p-6 rounded-xl backdrop-blur-xl border ${
              darkMode
                ? "bg-gray-800/50 border-gray-700"
                : "bg-white/60 border-gray-200"
            }`}
          >
            <p className="text-3xl font-bold text-purple-500">
              {certifications.length}
            </p>
            <p
              className={`text-sm mt-2 ${darkMode ? "text-gray-400" : "text-gray-600"}`}
            >
              Total Certifications
            </p>
          </div>
          <div
            className={`p-6 rounded-xl backdrop-blur-xl border ${
              darkMode
                ? "bg-gray-800/50 border-gray-700"
                : "bg-white/60 border-gray-200"
            }`}
          >
            <p className="text-3xl font-bold text-green-500">
              {certifications.filter((c) => !isExpired(c.expiryDate)).length}
            </p>
            <p
              className={`text-sm mt-2 ${darkMode ? "text-gray-400" : "text-gray-600"}`}
            >
              Active
            </p>
          </div>
          <div
            className={`p-6 rounded-xl backdrop-blur-xl border ${
              darkMode
                ? "bg-gray-800/50 border-gray-700"
                : "bg-white/60 border-gray-200"
            }`}
          >
            <p className="text-3xl font-bold text-blue-500">
              {categories.length}
            </p>
            <p
              className={`text-sm mt-2 ${darkMode ? "text-gray-400" : "text-gray-600"}`}
            >
              Categories
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Certifications;
