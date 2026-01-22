import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useLayoutEffect } from "react";
import { ThemeProvider } from "./context/ThemeContext";
import HomePage from "./pages/HomePage";
import ProjectsPage from "./pages/ProjectsPage";
import ErrorPage from "./pages/ErrorPage";
import ScrollToTop from "./components/ScrollToTop";
import "./style.css";
import AboutPage from "./pages/AboutPage";
import FoundationsPage from "./pages/FoundationsPage";
import ContactPage from "./pages/ContactPage";

function App() {
  // Scroll to top on every route change
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <ThemeProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/skills" element={<FoundationsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
