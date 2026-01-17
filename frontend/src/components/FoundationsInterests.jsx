import { BookOpen, Lightbulb, Trophy, Code, Zap, Globe } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useState } from "react";
import "./FoundationsInterests.css";

function FoundationsInterests() {
  const { darkMode } = useTheme();
  const [activeTab, setActiveTab] = useState("education");
  const [expandedItem, setExpandedItem] = useState(null);

  const educationData = [
    {
      id: 1,
      degree: "Bachelor of Technology",
      field: "Computer Science & Engineering",
      institution: "National Institute of Technology",
      year: "2020 - 2024",
      gpa: "8.2/10",
      highlights: ["Data Structures", "Web Development", "Database Design", "Cloud Computing"],
      icon: BookOpen,
    },
    {
      id: 2,
      degree: "Full Stack Web Development",
      field: "Certification Program",
      institution: "Udemy & FreeCodeCamp",
      year: "2021 - 2023",
      gpa: "Completed with Distinction",
      highlights: ["React Mastery", "Node.js & Express", "MongoDB", "System Design"],
      icon: Code,
    },
  ];

  const interestsData = [
    {
      id: 1,
      title: "Web Performance Optimization",
      description: "Passionate about creating lightning-fast web applications",
      icon: Zap,
      color: "from-yellow-400 to-orange-500",
      skills: ["Core Web Vitals", "Bundle Optimization", "Caching Strategies"],
    },
    {
      id: 2,
      title: "Open Source Contribution",
      description: "Active contributor to web development projects and libraries",
      icon: Globe,
      color: "from-green-400 to-emerald-500",
      skills: ["GitHub Workflows", "Code Review", "Documentation"],
    },
    {
      id: 3,
      title: "UI/UX Design & Implementation",
      description: "Crafting beautiful, intuitive user interfaces with modern techniques",
      icon: Lightbulb,
      color: "from-pink-400 to-rose-500",
      skills: ["Accessibility", "Design Systems", "Animation"],
    },
    {
      id: 4,
      title: "Cloud Architecture & DevOps",
      description: "Building scalable infrastructure and deployment pipelines",
      icon: Trophy,
      color: "from-blue-400 to-cyan-500",
      skills: ["Docker", "AWS/Cloud", "CI/CD"],
    },
  ];

  const bgClass = darkMode
    ? "bg-gradient-to-b from-slate-950/40 to-slate-900/20"
    : "bg-gradient-to-b from-slate-50/30 to-slate-100/20";

  const tabBgClass = darkMode
    ? "bg-slate-800/40 border-slate-700/60 text-slate-300 hover:bg-slate-700/50"
    : "bg-white/60 border-slate-200/60 text-slate-700 hover:bg-slate-100/80";

  const activeTabClass = darkMode
    ? "bg-gradient-to-r from-blue-600/80 to-purple-600/80 border-blue-500/60 text-white shadow-lg shadow-blue-500/20"
    : "bg-gradient-to-r from-blue-500/90 to-purple-500/90 border-blue-400/60 text-white shadow-lg shadow-blue-400/30";

  return (
    <section id="foundations" className="foundations-section py-16 sm:py-20 md:py-24 lg:py-28 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16 md:mb-20">
          <div className="inline-block mb-4 sm:mb-6">
            <span className={`header-badge inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold rounded-full border backdrop-blur-lg transition-all duration-300 ${
              darkMode
                ? "bg-gradient-to-r from-blue-900/50 to-purple-900/50 border-blue-700/40 text-blue-300 shadow-lg shadow-blue-900/30 hover:shadow-xl hover:shadow-blue-900/50"
                : "bg-gradient-to-r from-blue-100/80 to-purple-100/80 border-blue-300/60 text-blue-700 shadow-lg shadow-blue-300/20 hover:shadow-xl hover:shadow-blue-300/40"
            }`}>
              <BookOpen size={18} className="flex-shrink-0" />
              <span>Foundations & Interests</span>
            </span>
          </div>

          <h2 className={`heading-gradient text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-3 sm:mb-4 leading-tight ${
            darkMode ? "text-white" : "text-gray-900"
          }`}>
            Education & Passion
          </h2>

          <p className={`text-base sm:text-lg md:text-xl max-w-3xl mx-auto leading-relaxed ${
            darkMode ? "text-slate-400" : "text-slate-600"
          }`}>
            My educational journey combined with areas of genuine interest that drive my development
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-3 sm:gap-4 justify-center mb-10 sm:mb-14 md:mb-16 flex-wrap">
          <button
            onClick={() => setActiveTab("education")}
            className={`tab-button px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base border transition-all duration-300 flex items-center gap-2 backdrop-blur-sm ${
              activeTab === "education"
                ? activeTabClass
                : `${tabBgClass} border-slate-300/40 dark:border-slate-700/40`
            }`}
          >
            <BookOpen size={18} className="flex-shrink-0" />
            <span className="hidden sm:inline">Education</span>
            <span className="sm:hidden">Edu</span>
          </button>

          <button
            onClick={() => setActiveTab("interests")}
            className={`tab-button px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base border transition-all duration-300 flex items-center gap-2 backdrop-blur-sm ${
              activeTab === "interests"
                ? activeTabClass
                : `${tabBgClass} border-slate-300/40 dark:border-slate-700/40`
            }`}
          >
            <Lightbulb size={18} className="flex-shrink-0" />
            <span className="hidden sm:inline">Interests</span>
            <span className="sm:hidden">Int</span>
          </button>
        </div>

        {/* Content Container */}
        <div className="relative">
          {/* Education Tab */}
          {activeTab === "education" && (
            <div className="education-content grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 animate-in">
              {educationData.map((edu, idx) => {
                const Icon = edu.icon;
                return (
                  <div
                    key={edu.id}
                    className={`education-card group relative rounded-2xl sm:rounded-3xl p-0.5 overflow-hidden transition-all duration-500 ${
                      darkMode
                        ? "hover:shadow-2xl hover:shadow-blue-900/40"
                        : "hover:shadow-2xl hover:shadow-blue-300/40"
                    }`}
                    style={{
                      animation: `slideInUp 0.6s ease-out ${idx * 0.15}s backwards`,
                    }}
                  >
                    {/* Gradient Border */}
                    <div className={`absolute inset-0 rounded-2xl sm:rounded-3xl bg-gradient-to-br ${
                      darkMode
                        ? "from-blue-600/30 via-purple-600/20 to-pink-600/20 group-hover:from-blue-600/60 group-hover:via-purple-600/50 group-hover:to-pink-600/40"
                        : "from-blue-400/40 via-purple-400/30 to-pink-400/30 group-hover:from-blue-400/80 group-hover:via-purple-400/70 group-hover:to-pink-400/60"
                    } transition-all duration-500`} />

                    {/* Card Content */}
                    <div className={`relative rounded-2xl sm:rounded-3xl p-6 sm:p-8 h-full ${
                      darkMode
                        ? "bg-slate-900/80 backdrop-blur-2xl border border-slate-700/50"
                        : "bg-white/80 backdrop-blur-2xl border border-slate-200/60"
                    } shadow-lg transition-all duration-500 group-hover:-translate-y-1 group-hover:shadow-2xl`}>

                      {/* Icon & Header */}
                      <div className="flex items-start justify-between mb-4 sm:mb-5">
                        <div className="flex-1">
                          <h3 className={`text-lg sm:text-xl md:text-2xl font-bold mb-1 sm:mb-2 transition-colors duration-300 ${
                            darkMode ? "text-white group-hover:text-blue-400" : "text-gray-900 group-hover:text-blue-600"
                          }`}>
                            {edu.degree}
                          </h3>
                          <p className={`text-sm sm:text-base font-semibold ${
                            darkMode ? "text-slate-400 group-hover:text-slate-300" : "text-slate-600 group-hover:text-slate-700"
                          }`}>
                            {edu.field}
                          </p>
                        </div>
                        <Icon className={`w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0 transition-all duration-300 ${
                          darkMode ? "text-blue-400 group-hover:text-purple-400" : "text-blue-600 group-hover:text-purple-600"
                        } group-hover:scale-110 group-hover:-rotate-12`} />
                      </div>

                      {/* Details */}
                      <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs sm:text-sm font-medium px-3 py-1 rounded-full ${
                            darkMode
                              ? "bg-slate-700/50 text-slate-300"
                              : "bg-slate-200/60 text-slate-700"
                          }`}>
                            {edu.year}
                          </span>
                          <span className={`text-xs sm:text-sm font-semibold ${
                            darkMode ? "text-yellow-400" : "text-amber-600"
                          }`}>
                            GPA: {edu.gpa}
                          </span>
                        </div>
                        <p className={`text-sm sm:text-base ${
                          darkMode ? "text-slate-400" : "text-slate-600"
                        }`}>
                          {edu.institution}
                        </p>
                      </div>

                      {/* Highlights */}
                      <div className="flex flex-wrap gap-2">
                        {edu.highlights.map((highlight, i) => (
                          <span
                            key={i}
                            className={`text-xs sm:text-sm px-3 py-1.5 rounded-lg font-medium transition-all duration-300 ${
                              darkMode
                                ? "bg-gradient-to-r from-blue-900/60 to-purple-900/60 text-blue-200 hover:from-blue-800 hover:to-purple-800"
                                : "bg-gradient-to-r from-blue-100/80 to-purple-100/80 text-blue-700 hover:from-blue-200 hover:to-purple-200"
                            }`}
                          >
                            {highlight}
                          </span>
                        ))}
                      </div>

                      {/* Glow Effect */}
                      <div className={`absolute inset-0 rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${
                        darkMode
                          ? "from-blue-500/5 via-purple-500/5 to-pink-500/5"
                          : "from-blue-400/10 via-purple-400/10 to-pink-400/10"
                      } blur-xl pointer-events-none`} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Interests Tab */}
          {activeTab === "interests" && (
            <div className="interests-content grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 sm:gap-8 animate-in">
              {interestsData.map((interest, idx) => {
                const Icon = interest.icon;
                return (
                  <div
                    key={interest.id}
                    className="interest-card group relative cursor-pointer"
                    onClick={() => setExpandedItem(expandedItem === interest.id ? null : interest.id)}
                    style={{
                      animation: `slideInUp 0.6s ease-out ${idx * 0.15}s backwards`,
                    }}
                  >
                    {/* Gradient Card */}
                    <div className={`relative rounded-2xl sm:rounded-3xl p-6 sm:p-8 h-full overflow-hidden transition-all duration-500 ${
                      darkMode
                        ? "bg-gradient-to-br from-slate-800/60 to-slate-900/80 border border-slate-700/40 hover:border-slate-600/60 shadow-lg hover:shadow-2xl hover:shadow-slate-900/40"
                        : "bg-gradient-to-br from-white/70 to-slate-50/80 border border-slate-200/60 hover:border-slate-300/80 shadow-lg hover:shadow-2xl hover:shadow-slate-300/30"
                    } group-hover:-translate-y-2 backdrop-blur-xl`}>

                      {/* Top Section */}
                      <div className="flex items-start justify-between gap-4 mb-4 sm:mb-5">
                        <div className="flex-1 min-w-0">
                          <h3 className={`text-lg sm:text-xl font-bold mb-2 transition-colors duration-300 ${
                            darkMode ? "text-white group-hover:text-blue-400" : "text-gray-900 group-hover:text-blue-600"
                          }`}>
                            {interest.title}
                          </h3>
                          <p className={`text-sm sm:text-base line-clamp-2 ${
                            darkMode ? "text-slate-400 group-hover:text-slate-300" : "text-slate-600 group-hover:text-slate-700"
                          }`}>
                            {interest.description}
                          </p>
                        </div>
                        <div className={`flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br ${interest.color} flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-12 shadow-lg`}>
                          <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                        </div>
                      </div>

                      {/* Expandable Skills */}
                      <div className={`overflow-hidden transition-all duration-300 ${
                        expandedItem === interest.id ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                      }`}>
                        <div className="pt-4 sm:pt-5 border-t border-slate-300/30 dark:border-slate-700/30">
                          <p className={`text-xs sm:text-sm font-semibold mb-3 ${
                            darkMode ? "text-slate-400" : "text-slate-600"
                          }`}>
                            Key Areas:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {interest.skills.map((skill, i) => (
                              <span
                                key={i}
                                className={`text-xs px-2.5 py-1 rounded-md font-medium transition-all duration-300 ${
                                  darkMode
                                    ? "bg-slate-700/60 text-slate-300 group-hover:bg-slate-600"
                                    : "bg-slate-200/60 text-slate-700 group-hover:bg-slate-300"
                                }`}
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Glow Effect */}
                      <div className={`absolute inset-0 rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${interest.color}/10 blur-xl pointer-events-none`} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* CTA Section */}
        <div className="mt-12 sm:mt-16 md:mt-20 text-center">
          <div className={`inline-flex items-center gap-2 px-5 sm:px-6 py-3 sm:py-3.5 rounded-full font-semibold text-sm sm:text-base transition-all duration-300 backdrop-blur-sm border ${
            darkMode
              ? "bg-gradient-to-r from-emerald-900/40 to-teal-900/40 border-emerald-700/40 text-emerald-300 hover:from-emerald-900/60 hover:to-teal-900/60 hover:shadow-lg hover:shadow-emerald-900/30"
              : "bg-gradient-to-r from-emerald-100/80 to-teal-100/80 border-emerald-300/60 text-emerald-700 hover:from-emerald-200 hover:to-teal-200 hover:shadow-lg hover:shadow-emerald-300/30"
          }`}>
            <Zap size={18} className="flex-shrink-0" />
            <span>Continuously evolving and exploring</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FoundationsInterests;