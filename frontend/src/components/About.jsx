import { CheckCircle, Sparkles } from "lucide-react";

function About() {
  const highlights = [
    "5+ years of web development experience",
    "Expert in React & Node.js",
    "Full-stack development capabilities",
    "Responsive & accessible design",
    "Performance optimization specialist",
    "Team collaboration & mentoring",
  ];

  return (
    <section
      id="about"
      className="py-20 px-4 bg-white dark:bg-gray-950 transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <span className="px-4 py-2 bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300 rounded-full text-sm font-semibold border border-purple-200 dark:border-purple-800 backdrop-blur-sm flex items-center gap-2">
              <Sparkles size={16} /> About Me
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Crafting Digital Solutions
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Crafting digital solutions with passion and precision
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-6">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
              I'm a passionate developer with a keen eye for design and a love
              for problem-solving. With expertise in modern web technologies, I
              create web applications that are not only visually stunning but
              also highly functional and performant.
            </p>

            <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
              My journey in tech started with curiosity and has evolved into a
              commitment to delivering excellence in every project I undertake.
              I believe in continuous learning and staying updated with the
              latest industry trends.
            </p>

            {/* Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              {highlights.map((highlight, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-purple-50 dark:hover:bg-gray-800/50 transition-colors duration-200"
                >
                  <CheckCircle
                    className="text-green-500 shrink-0 mt-1 hover:scale-110 transition-transform duration-200"
                    size={20}
                  />
                  <span className="text-gray-700 dark:text-gray-300 font-medium">
                    {highlight}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-6">
            {[
              { number: "50+", label: "Projects Completed" },
              { number: "40+", label: "Happy Clients" },
              { number: "5+", label: "Years Experience" },
              { number: "100%", label: "Satisfaction Rate" },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="p-6 bg-linear-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl text-center hover:shadow-lg dark:hover:shadow-purple-900/20 transition-all duration-300 transform hover:-translate-y-1 border border-blue-100 dark:border-gray-700"
              >
                <p className="text-3xl md:text-4xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-1">
                  {stat.number}
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base font-medium">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
