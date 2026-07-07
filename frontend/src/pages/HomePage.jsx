import { useTheme } from "../context/ThemeContext";
import Navigation from "../components/Navigation";
import Hero from "../components/Hero";
import About from "../components/About";
import Projects from "../components/Projects";
import FoundationsAndInterests from "../components/FoundationsAndInterests";
import Contact from "../components/Contact";
import Footer from "../components/Footer";

function HomePage() {
  const { darkMode } = useTheme();

  return (
    <div
      className={`min-h-screen bg-pattern-home flex flex-col justify-between transition-colors duration-500 ${
        darkMode
          ? "dark bg-[#030014] text-white"
          : "bg-slate-50 text-slate-900"
      }`}
    >
      <Navigation />
      
      {/* Immersive layout with a unified backdrop for all sections */}
      <main className="flex-grow relative">
        {/* Large, overlapping background ambient glows that blend seamlessly across the entire page */}
        <div className="absolute inset-0 pointer-events-none select-none z-0">
          {/* Hero glow (top-left) */}
          <div
            className={`absolute top-0 left-[-10%] w-[600px] h-[600px] rounded-full blur-[160px] opacity-35 transition-colors duration-500 ${
              darkMode ? "bg-purple-900/30" : "bg-blue-200/40"
            }`}
          />
          
          {/* About glow (upper-right) */}
          <div
            className={`absolute top-[18%] right-[-10%] w-[700px] h-[700px] rounded-full blur-[180px] opacity-30 transition-colors duration-500 ${
              darkMode ? "bg-indigo-900/25" : "bg-purple-100/40"
            }`}
          />
          
          {/* Projects glow (mid-left) */}
          <div
            className={`absolute top-[42%] left-[-15%] w-[800px] h-[800px] rounded-full blur-[200px] opacity-30 transition-colors duration-500 ${
              darkMode ? "bg-cyan-900/25" : "bg-cyan-100/40"
            }`}
          />
          
          {/* Skills glow (lower-right) */}
          <div
            className={`absolute top-[68%] right-[-10%] w-[750px] h-[750px] rounded-full blur-[180px] opacity-25 transition-colors duration-500 ${
              darkMode ? "bg-pink-900/20" : "bg-pink-100/40"
            }`}
          />
          
          {/* Contact glow (bottom-left/center) */}
          <div
            className={`absolute bottom-[-5%] left-[10%] w-[700px] h-[700px] rounded-full blur-[160px] opacity-35 transition-colors duration-500 ${
              darkMode ? "bg-purple-950/35" : "bg-blue-100/40"
            }`}
          />
        </div>

        {/* Content sections stacked directly on top of the unified background */}
        <div className="relative z-10">
          <Hero />
          <About />
          <Projects />
          <FoundationsAndInterests />
          <Contact />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default HomePage;
