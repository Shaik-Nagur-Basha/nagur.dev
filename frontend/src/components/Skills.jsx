import { Zap } from "lucide-react";

function Skills() {
  const skillCategories = [
    {
      category: "Frontend",
      icon: "🎨",
      skills: [
        { name: "React", level: 95 },
        { name: "JavaScript", level: 95 },
        { name: "Tailwind CSS", level: 90 },
        { name: "HTML/CSS", level: 95 },
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
    <section
      id="skills"
      className="py-20 px-4 bg-linear-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <span className="px-4 py-2 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 rounded-full text-sm font-semibold border border-blue-200 dark:border-blue-800 backdrop-blur-sm flex items-center gap-2">
              <Zap size={16} /> Skills & Expertise
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Technologies I Master
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Tools and frameworks I work with on daily basis
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {skillCategories.map((category, categoryIdx) => (
            <div
              key={categoryIdx}
              className="p-8 bg-linear-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl hover:shadow-xl dark:hover:shadow-purple-900/20 transition-all duration-300 transform hover:-translate-y-1 border border-blue-100 dark:border-gray-600"
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">{category.icon}</span>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {category.category}
                </h3>
              </div>

              <div className="space-y-6">
                {category.skills.map((skill, skillIdx) => (
                  <div key={skillIdx}>
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold text-gray-700 dark:text-gray-300">
                        {skill.name}
                      </span>
                      <span className="text-blue-600 dark:text-blue-400 font-bold">
                        {skill.level}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="bg-linear-to-r from-blue-600 to-purple-600 h-2.5 rounded-full transition-all duration-700 ease-out shadow-lg"
                        style={{ width: `${skill.level}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Skills;
