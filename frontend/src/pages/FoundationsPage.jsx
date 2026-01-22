import { useTheme } from "../context/ThemeContext";
import Navigation from "../components/Navigation";
import FoundationsAndInterests from "../components/FoundationsAndInterests";
import Footer from "../components/Footer";

function FoundationsPage() {
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
      <FoundationsAndInterests />
      <Footer />
    </div>
  );
}

export default FoundationsPage;
