import { useTheme } from "../context/ThemeContext";
import Navigation from "../components/Navigation";
import Hero from "../components/Hero";
import About from "../components/About";
import Projects from "../components/Projects";
import Foundations from "../components/Foundations";
import FoundationsInterests from "../components/FoundationsInterests";
import FoundationsAndInterests from "../components/FoundationsAndInterests";
import { Contact } from "lucide-react";
import Footer from "../components/Footer";
import Skills from "../components/Skills";

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
      <Skills/>
      <FoundationsInterests />
      <Foundations />
      <FoundationsAndInterests />
      <Contact />
      <Footer />
    </div>
  );
}

export default HomePage;
