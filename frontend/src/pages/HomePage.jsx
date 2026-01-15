import { useTheme } from "../context/ThemeContext";
import Navigation from "../components/Navigation";
import Hero from "../components/Hero";
import About from "../components/About";
import Projects from "../components/Projects";
import Skills from "../components/Skills";
import Contact from "../components/Contact";
import Footer from "../components/Footer";

function HomePage() {
  const { darkMode } = useTheme();

  return (
    <div
      className={`${
        darkMode
          ? "dark bg-linear-to-br from-gray-950 via-gray-900 to-purple-950"
          : "bg-linear-to-br from-blue-50 via-white to-purple-50"
      }`}
    >
      <Navigation />
      <Hero />
      <About />
      <Projects />
      <Skills />
      <Contact />
      <Footer />
    </div>
  );
}

export default HomePage;
