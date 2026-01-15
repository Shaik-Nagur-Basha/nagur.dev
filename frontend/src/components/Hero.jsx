import { ArrowRight, Github, Linkedin, Mail } from "lucide-react";
import { ButtonPrimary, ButtonSecondary } from "./Button";

function Hero() {
  return (
    <section
      id="home"
      className="pt-32 pb-20 px-4 bg-gradient-to-br from-white via-blue-50 to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950 min-h-screen flex items-center transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <div className="inline-block">
              <span className="px-4 py-2 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 rounded-full text-sm font-semibold border border-blue-200 dark:border-blue-800 backdrop-blur-sm">
                ✨ Welcome to my portfolio
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
              Hi, I'm{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-pulse">
                Your Name
              </span>
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
              Full-stack developer passionate about creating beautiful and
              functional web experiences. I specialize in React, Node.js, and
              modern web technologies.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <ButtonPrimary className="flex items-center justify-center gap-2">
                View My Work <ArrowRight size={20} />
              </ButtonPrimary>
              <ButtonSecondary>Download CV</ButtonSecondary>
            </div>

            {/* Social Links */}
            <div className="flex gap-4 pt-6">
              <a
                href="#"
                className="p-3 bg-gray-200 dark:bg-gray-800 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-blue-600 dark:hover:bg-blue-600 hover:text-white hover:scale-110 active:scale-95 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                aria-label="GitHub"
                title="GitHub"
              >
                <Github size={24} />
              </a>
              <a
                href="#"
                className="p-3 bg-gray-200 dark:bg-gray-800 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-blue-600 dark:hover:bg-blue-600 hover:text-white hover:scale-110 active:scale-95 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                aria-label="LinkedIn"
                title="LinkedIn"
              >
                <Linkedin size={24} />
              </a>
              <a
                href="#"
                className="p-3 bg-gray-200 dark:bg-gray-800 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-blue-600 dark:hover:bg-blue-600 hover:text-white hover:scale-110 active:scale-95 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                aria-label="Email"
                title="Email"
              >
                <Mail size={24} />
              </a>
            </div>
          </div>

          {/* Right - Illustration/Image */}
          <div className="hidden md:flex items-center justify-center">
            <div className="relative w-full h-96">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-600 rounded-3xl blur-3xl opacity-30 animate-glow"></div>
              <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl h-full flex items-center justify-center text-white text-6xl font-bold shadow-2xl hover:scale-105 transition-transform duration-300">
                {"</>"}
                <br />
                <span className="text-2xl">Dev</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
