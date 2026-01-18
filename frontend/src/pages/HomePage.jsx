import { useTheme } from "../context/ThemeContext";
import Navigation from "../components/Navigation";
import Hero from "../components/Hero";
import About from "../components/About";
import Projects from "../components/Projects";
import FoundationsAndInterests from "../components/FoundationsAndInterests";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
// import Certifications from "../components/Certifications";
// import ClientResponses from "../components/ClientResponses";

function HomePage() {
  const { darkMode } = useTheme();

  return (
    <div
      className={`${
        darkMode
          ? "dark bg-linear-to-br from-gray-950 via-gray-900 to-purple-950"
          : "bg-linear-to-br from-blue-50 via-white to-purple-50"
      }`}
      // style={{
      //   background: "linear-gradient(to bottom right, #ffea0022, #92d8eb44, #52204366)",
      // }}
    >
      <Navigation />
      <Hero />
      <About />
      <Projects />
      <FoundationsAndInterests />
      {/* <Certifications /> */}
      {/* <ClientResponses /> */}
      <Contact />
      <Footer />
    </div>
  );
}

export default HomePage;
