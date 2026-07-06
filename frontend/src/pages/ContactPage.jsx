import { useTheme } from "../context/ThemeContext";
import Navigation from "../components/Navigation";
import Contact from "../components/Contact";
import Footer from "../components/Footer";

function ContactPage() {
  const { darkMode } = useTheme();

  return (
    <div
      className={`min-h-screen flex flex-col justify-between ${
        darkMode
          ? "dark bg-linear-to-br from-gray-950 via-gray-900 to-purple-950"
          : "bg-linear-to-br from-blue-50 via-white to-purple-50"
      }`}
    >
      <Navigation />
      <Contact />
      <Footer />
    </div>
  );
}

export default ContactPage;
