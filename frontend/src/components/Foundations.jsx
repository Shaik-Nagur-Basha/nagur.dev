import { Zap, GraduationCap, Heart } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

function Foundations() {
  const { darkMode } = useTheme();

  const education = [
    {
      degree: "Master of Computer Applications (MCA)",
      institution: "Biju Patnaik University of Technology, Rourkela",
      year: "2021 - 2023",
      details: "Focused on advanced software engineering, data structures, and web development. Completed a thesis on machine learning applications in web security.",
    },
    {
      degree: "Bachelor of Science in Physics",
      institution: "Fakir Mohan University, Balasore",
      year: "2018 - 2021",
      details: "Gained a strong analytical and problem-solving foundation. Developed a passion for technology and its application to scientific problems.",
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
    { name: "Open Source", icon: "🌐" },
    { name: "AI & Machine Learning", icon: "🤖" },
    { name: "UI/UX Design", icon: "✨" },
    { name: "Photography", icon: "📷" },
  ];

  return (
    <section id="foundations" className="py-24 px-4">
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
            className={`mt-6 text-3xl md:text-4xl font-extrabold tracking-tight ${
              darkMode ? "text-white/85" : "text-black/85"
            }`}
          >
            My Background & Passions
          </h2>

          <p className="mt-4 text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            A blend of formal education, self-taught skills, and personal interests that shape my work.
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Education Section (takes 1 column) */}
          <div className="lg:col-span-1 space-y-8">
            <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full ${darkMode ? 'bg-purple-900/40' : 'bg-blue-100/60'}`}>
                    <GraduationCap size={24} className={darkMode ? 'text-purple-300' : 'text-blue-700'} />
                </div>
                <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-black'}`}>Education</h3>
            </div>
            <div className="space-y-6 border-l-2 border-dashed border-gray-300 dark:border-gray-700 ml-5">
              {education.map((edu, index) => (
                <div key={index} className="pl-8 relative before:content-[''] before:w-4 before:h-4 before:bg-blue-500 before:rounded-full before:absolute before:-left-2 before:top-1.5 before:border-4 before:border-solid before:border-white dark:before:border-gray-900">
                  <h4 className={`text-lg font-semibold ${darkMode ? 'text-blue-300' : 'text-blue-600'}`}>{edu.degree}</h4>
                  <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{edu.institution}</p>
                  <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>{edu.year}</p>
                  <p className={`mt-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{edu.details}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Skills & Interests Section (takes 2 columns) */}
          <div className="lg:col-span-2">
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
            
            {/* Interests */}
            <div>
                <div className="flex items-center gap-4 mb-6">
                    <div className={`p-3 rounded-full ${darkMode ? 'bg-purple-900/40' : 'bg-blue-100/60'}`}>
                        <Heart size={24} className={darkMode ? 'text-purple-300' : 'text-blue-700'} />
                    </div>
                    <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-black'}`}>Interests</h3>
                </div>
                <div className="flex flex-wrap gap-4">
                    {interests.map((interest, index) => (
                        <div key={index} className={`flex items-center gap-3 px-4 py-2 rounded-full border backdrop-blur-sm transition-all duration-300 hover:shadow-lg ${darkMode ? 'bg-gray-800/50 border-gray-700 text-gray-300 hover:border-blue-500 hover:text-white' : 'bg-white/60 border-gray-300/80 text-gray-700 hover:border-blue-500 hover:text-gray-900'}`}>
                            <span className="text-xl">{interest.icon}</span>
                            <span className="font-semibold">{interest.name}</span>
                        </div>
                    ))}
                </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Foundations;
