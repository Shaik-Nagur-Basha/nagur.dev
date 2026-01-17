import { Zap } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

function Skills() {
  const { darkMode } = useTheme();
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

  return (
    <section id="skills" className="py-24 px-4">
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
            <Zap size={16} />
            Skills & Expertise
          </span>

          <h2
            className={`mt-6 text-3xl md:text-4xl font-extrabold tracking-tight ${
              darkMode ? "text-white/85" : "text-black/85"
            }`}
          >
            Technologies I Master
          </h2>

          <p className="mt-4 text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Tools, frameworks, and platforms I use to build modern web
            applications.
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {skillCategories.map((category, idx) => (
            <div
              key={idx}
              className={`group relative rounded-3xl p-[1px]
                 ${
                   darkMode
                     ? "bg-linear-to-br from-blue-500/40 via-purple-500/30 to-pink-500/30"
                     : "bg-linear-to-br from-blue-500/80 via-purple-500/60 to-pink-500/60"
                 }
                transition-all hover:from-blue-500 hover:to-purple-500 duration-500`}
            >
              <div
                className="
                  relative h-full rounded-3xl p-8
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
                {/* Card Header */}
                <div className="flex items-center gap-4 mb-8">
                  <span className="text-4xl">{category.icon}</span>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white truncate">
                    {category.category}
                  </h3>
                </div>

                {/* Skills */}
                <div className="space-y-6">
                  {category.skills.map((skill, i) => (
                    <div key={i}>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          {skill.name}
                        </span>
                        <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                          {skill.level}%
                        </span>
                      </div>

                      <div
                        className="
                        w-full h-2.5 rounded-full overflow-hidden
                        bg-gray-200 dark:bg-gray-700
                      "
                      >
                        <div
                          className={`h-full rounded-full ${darkMode ? "bg-linear-to-r from-blue-600/75 via-purple-600/75 to-pink-600/75" : "bg-linear-to-r from-blue-600/85 via-purple-600/85 to-pink-600/85"}
                            
                            shadow-md
                            transition-all duration-1000 ease-out`}
                          style={{ width: `${skill.level}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Glow Effect */}
                <div
                  className="
                    pointer-events-none absolute inset-0 rounded-3xl
                    opacity-0 group-hover:opacity-100
                    transition duration-500
                    bg-linear-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10
                  "
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Skills;
