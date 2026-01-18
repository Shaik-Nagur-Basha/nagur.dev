import { Zap, GraduationCap, Heart, Code } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useState, useEffect } from "react";
import SkeletonLoader from "./SkeletonLoader";

function FoundationsAndInterests() {
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

  const education = [
    {
      degree: "B. Tech in Computer Science & Engineering",
      institution: "Andhra University, Visakhapatnam",
      year: "2020 - 2024",
      cgpa: "7.02/10",
      details: "Web development, cloud computing, and software engineering.",
    },
    {
      degree: "12th Grade (MPC - Intermediate/IPE)",
      institution: "Sri Chaitanya Junior College, Vijayawada",
      year: "2018 - 2020",
      cgpa: "9.4/10",
      details:
        "Mathematics, Physics, and Chemistry stream with strong STEM foundation.",
    },
    {
      degree: "10th Grade (SSC Board)",
      institution: "Vikas Public School, Vijayawada",
      year: "2017 - 2018",
      cgpa: "9/10",
      details:
        "Secondary education with excellent performance in core subjects.",
    },
  ];

  const skillCategories = [
    {
      category: "Frontend",
      icon: "🎨",
      skills: [
        { name: "React", level: 95 },
        { name: "JavaScript", level: 95 },
        { name: "Tailwind CSS", level: 90 },
        { name: "HTML / CSS", level: 95 },
      ],
    },
    {
      category: "Backend",
      icon: "⚙️",
      skills: [
        { name: "Node.js", level: 90 },
        { name: "Express.js", level: 90 },
        { name: "MongoDB", level: 85 },
        { name: "REST APIs", level: 90 },
      ],
    },
    {
      category: "Tools & Others",
      icon: "🛠️",
      skills: [
        { name: "Git", level: 90 },
        { name: "Docker", level: 80 },
        { name: "Vite", level: 85 },
        { name: "Figma", level: 85 },
      ],
    },
  ];

  const interests = [
    {
      name: "Researching",
      icon: "🔬",
      description:
        "Engaging in technical research and exploring emerging technologies.",
    },
    {
      name: "Note-Making",
      icon: "📝",
      description: "Documenting innovative thoughts for future exploration.",
    },
    {
      name: "Gaming",
      icon: "🎮",
      description: "Strategizing and engaging in interactive gameplay.",
    },
    {
      name: "Movies",
      icon: "🎬",
      description:
        "Enjoying diverse films, especially Sci-Fi and adventure genres.",
    },
  ];

  return (
    <>
      {isLoading ? (
        <SkeletonLoader type="foundations" />
      ) : (
        <section id="foundations" className="mt-10 mb-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <span
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border backdrop-blur-xl mb-4 ${
                  darkMode
                    ? "bg-purple-900/40 text-purple-300 border-purple-800"
                    : "bg-blue-100/60 text-blue-700 border-blue-300/60 shadow-lg shadow-blue-300/20"
                }`}
              >
                <Zap size={16} />
                Foundations & Interests
              </span>

              <h2
                className={`mt-6 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight ${
                  darkMode ? "text-white/85" : "text-black/85"
                }`}
              >
                My Background & Passions
              </h2>

              <p className="mt-4 text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                A blend of formal education, self-taught skills, and personal
                interests that shape my work.
              </p>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Education Section (takes 1 column) */}
              <div className="lg:col-span-1 space-y-8">
                <div className="flex items-center gap-4">
                  <div
                    className={`p-3 rounded-full ${darkMode ? "bg-purple-900/40" : "bg-blue-100/60"}`}
                  >
                    <GraduationCap
                      size={24}
                      className={darkMode ? "text-purple-300" : "text-blue-700"}
                    />
                  </div>
                  <h3
                    className={`text-2xl font-bold ${darkMode ? "text-white/90" : "text-black/90"}`}
                  >
                    Education
                  </h3>
                </div>
                <div className="space-y-6 border-l-2 border-dashed border-gray-300 dark:border-gray-700 ml-5">
                  {education.map((edu, index) => (
                    <div
                      key={index}
                      className="pl-8 relative before:content-[''] before:w-4 before:h-4 before:bg-blue-500 before:rounded-full before:absolute before:-left-2 before:top-1.5 before:border-4 before:border-solid before:border-white dark:before:border-gray-900"
                    >
                      <h4
                        className={`text-lg font-semibold ${darkMode ? "text-blue-300" : "text-blue-600"}`}
                      >
                        {edu.degree}
                      </h4>
                      <p
                        className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-600"}`}
                      >
                        {edu.institution}
                      </p>
                      <div className="flex items-center gap-3 mt-2 mb-3">
                        <p
                          className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-500"}`}
                        >
                          {edu.year}
                        </p>
                        <span
                          className={`text-xs font-bold px-3 py-1.5 rounded-full whitespace-nowrap inline-block transition-all duration-300 ${
                            darkMode
                              ? "bg-linear-to-r from-amber-900/60 to-yellow-800/60 text-amber-200 border border-amber-700/40"
                              : "bg-linear-to-r from-amber-100/80 to-yellow-100/80 text-amber-700 border border-amber-300/60"
                          }`}
                        >
                          CGPA: {edu.cgpa}
                        </span>
                      </div>
                      <p
                        className={`mt-2 text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                      >
                        {edu.details}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skills & Interests Section (takes 2 columns) */}
              <div className="lg:col-span-2">
                {/* Skills Header */}
                <div className="flex items-center gap-4 mb-8">
                  <div
                    className={`p-3 rounded-full ${darkMode ? "bg-purple-900/40" : "bg-blue-100/60"}`}
                  >
                    <Code
                      size={24}
                      className={darkMode ? "text-purple-300" : "text-blue-700"}
                    />
                  </div>
                  <h3
                    className={`text-2xl font-bold ${darkMode ? "text-white/90" : "text-black/90"}`}
                  >
                    Skills
                  </h3>
                </div>

                {/* Skills */}
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 mb-16">
                  {skillCategories.map((category, idx) => (
                    <div
                      key={idx}
                      className={`group relative rounded-3xl p-px
                    ${
                      darkMode
                        ? "bg-linear-to-br from-blue-500/40 via-purple-500/30 to-pink-500/30"
                        : "bg-linear-to-br from-blue-500/80 via-purple-500/60 to-pink-500/60"
                    }
                    transition-all hover:from-blue-500 hover:to-purple-500 duration-500`}
                    >
                      <div
                        className="
                      relative h-full rounded-3xl p-6
                      bg-white/70 dark:bg-gray-900/60
                      backdrop-blur-xl
                      border border-white/40 dark:border-white/10
                      shadow-lg shadow-black/5 dark:shadow-black/30
                      transition-all duration-500
                      group-hover:-translate-y-2
                      group-hover:shadow-2xl
                      active:scale-[0.98]
                    "
                      >
                        <div className="flex items-center gap-4 mb-6">
                          <span className="text-3xl">{category.icon}</span>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white truncate">
                            {category.category}
                          </h3>
                        </div>
                        <div className="space-y-5">
                          {category.skills.map((skill, i) => (
                            <div key={i}>
                              <div className="flex justify-between mb-1">
                                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                                  {skill.name}
                                </span>
                                <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                                  {skill.level}%
                                </span>
                              </div>
                              <div className="w-full h-2 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                                <div
                                  className={`h-full rounded-full ${darkMode ? "bg-linear-to-r from-blue-600/75 via-purple-600/75 to-pink-600/75" : "bg-linear-to-r from-blue-600/85 via-purple-600/85 to-pink-600/85"} shadow-md transition-all duration-1000 ease-out`}
                                  style={{ width: `${skill.level}%` }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Interests / Hobbies */}
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <div
                      className={`p-3 rounded-full ${darkMode ? "bg-purple-900/40" : "bg-blue-100/60"}`}
                    >
                      <Heart
                        size={24}
                        className={
                          darkMode ? "text-purple-300" : "text-blue-700"
                        }
                      />
                    </div>
                    <h3
                      className={`text-2xl font-bold ${darkMode ? "text-white/90" : "text-black/90"}`}
                    >
                      Hobbies
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-3 sm:gap-4">
                    {interests.map((interest, index) => {
                      const gradients = [
                        {
                          dark: "from-cyan-500/40 to-blue-500/40",
                          light: "from-cyan-400/40 to-blue-400/40",
                          border: "hover:border-cyan-500/60",
                          shadow: "hover:shadow-cyan-500/40",
                        },
                        {
                          dark: "from-orange-500/40 to-amber-500/40",
                          light: "from-orange-400/40 to-amber-400/40",
                          border: "hover:border-orange-500/60",
                          shadow: "hover:shadow-orange-500/40",
                        },
                        {
                          dark: "from-pink-500/40 to-rose-500/40",
                          light: "from-pink-400/40 to-rose-400/40",
                          border: "hover:border-pink-500/60",
                          shadow: "hover:shadow-pink-500/40",
                        },
                        {
                          dark: "from-purple-500/40 to-violet-500/40",
                          light: "from-purple-400/40 to-violet-400/40",
                          border: "hover:border-purple-500/60",
                          shadow: "hover:shadow-purple-500/40",
                        },
                      ];
                      const gradient = gradients[index];
                      return (
                        <div
                          key={index}
                          className={`group relative flex items-center justify-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-3xl transition-all duration-300 transform active:scale-90 overflow-hidden backdrop-blur-md ${
                            darkMode
                              ? `bg-linear-to-br from-gray-700/30 via-gray-800/20 to-gray-900/30 border border-gray-600/40 ${gradient.border} shadow-lg shadow-gray-900/50 hover:shadow-2xl ${gradient.shadow} hover:-translate-y-1 drop-shadow-md drop-shadow-gray-900/30`
                              : `bg-linear-to-br from-white/40 via-blue-50/30 to-white/20 border border-blue-300/50 ${gradient.border} shadow-lg shadow-blue-200/40 hover:shadow-2xl ${gradient.shadow} hover:-translate-y-1 drop-shadow-md drop-shadow-purple-200/20`
                          }`}
                        >
                          <div
                            className={`absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 bg-linear-to-br ${
                              darkMode ? gradient.dark : gradient.light
                            }`}
                          ></div>
                          <span
                            className={`relative z-10 -translate-y-0.5 text-lg sm:text-xl transition-all duration-300 group-hover:scale-110 ${
                              darkMode
                                ? "drop-shadow-lg group-hover:drop-shadow-2xl"
                                : "drop-shadow-md group-hover:drop-shadow-lg"
                            }`}
                          >
                            {interest.icon}
                          </span>
                          <span
                            className={`relative z-10 text-xs sm:text-sm font-semibold transition-colors duration-300 ${
                              darkMode
                                ? "text-gray-300 group-hover:text-white"
                                : "text-gray-700 group-hover:text-gray-900"
                            }`}
                          >
                            {interest.name}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}

export default FoundationsAndInterests;
